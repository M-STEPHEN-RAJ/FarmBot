import Recommender from "../models/Recommender.js";
import User from "../models/User.js";
import { model } from "../config/gemini.js";
import { connectDB } from "../config/db.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export const predictCrop = async ({ body, userId }) => {
  const user = await User.findById(userId).select("preferredLanguage");
  const userLang = user?.preferredLanguage || "en";

  const { temperature, humidity, ph, rainfall } = body;

  if (!temperature || !humidity || !ph || !rainfall) {
    throw new Error("All fields are required");
  }

  let cropResult;
  try {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ temperature, humidity, ph, rainfall }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Flask API error: ${text}`);
    }

    cropResult = await res.json();
  } catch (err) {
    console.error("Flask API call failed:", err);
    throw new Error("Prediction failed");
  }

  const cropName = cropResult.crop;

  const languageMap = {
    en: "English",
    ta: "Tamil",
  };

  let explanation = "No explanation available";

  try {
    const prompt = `
Explain why "${cropName}" is suitable for these conditions:

Temperature: ${temperature}°C
Humidity: ${humidity}%
pH: ${ph}
Rainfall: ${rainfall} mm

Explain in ${languageMap[userLang]}.

Use bullet points (<ol><li>…</li></ol>).
Highlight important words using <b>bold</b>.
Give practical farming advice.

Return JSON:
{
  "explanation": "<your explanation>"
}
`;

    const result = await model.generateContent(prompt);
    let textResponse = result.response.text();

    textResponse = textResponse
      .replace(/```json\s*([\s\S]*?)\s*```/i, "$1")
      .trim();

    try {
      const parsed = JSON.parse(textResponse);
      explanation = parsed.explanation || explanation;
    } catch {
      explanation = textResponse || explanation;
    }
  } catch (err) {
    console.error("Gemini API error:", err);
  }

  const newCrop = new Recommender({
    user: userId,
    temperature,
    humidity,
    ph,
    rainfall,
    crop: cropName,
    explanation,
  });

  await newCrop.save();

  return {
    _id: newCrop._id,
    temperature,
    humidity,
    ph,
    rainfall,
    crop: cropName,
    explanation,
    createdAt: newCrop.createdAt,
  };
};

export const getCrops = async (token, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const crops = await Recommender.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("temperature humidity ph rainfall crop createdAt");

    return res.json({ crops });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load crops!" });
  }
};

export const getCropById = async (token, cropId, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const crop = await Recommender.findOne({
      _id: cropId,
      user: userId,
    });

    if (!crop) {
      return res.status(404).json({ error: "Crop not found!" });
    }

    return res.json(crop);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load crop!" });
  }
};

export const deleteCrop = async (token, cropId, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const crop = await Recommender.findOne({
      _id: cropId,
      user: userId,
    });

    if (!crop) {
      return res
        .status(404)
        .json({ error: "Crop not found or not authorized!" });
    }

    await Recommender.deleteOne({ _id: cropId });

    return res.json({
      success: true,
      message: "Crop deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete crop!" });
  }
};

export const getAutoFillData = async (token, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("preferredLanguage");
    const userLang = user?.preferredLanguage || "en";

    const languageMap = {
      en: "English",
      ta: "Tamil",
    };

    let aiData = {
      temperature: 25,
      humidity: 70,
      ph: 6.5,
      rainfall: 200,
    };

    try {
      const prompt = `
Generate realistic farm environmental values for crop recommendation.

Return ONLY JSON:
{
  "temperature": number,
  "humidity": number,
  "ph": number,
  "rainfall": number
}

Conditions:
- temperature: 26.7 °C
- humidity: 81.7 %
- ph: 7.8
- rainfall: 280.4 mm
`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();

      text = text.replace(/```json\s*([\s\S]*?)\s*```/i, "$1").trim();

      try {
        aiData = JSON.parse(text);
      } catch {
        console.log("Fallback AI parsing failed");
      }
    } catch (err) {
      console.error("Gemini error:", err);
    }

    return res.json({ data: aiData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI fetch failed" });
  }
};