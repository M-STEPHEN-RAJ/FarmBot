import Scan from "../models/Scan.js";
import { model } from "../config/gemini.js";
import { uploadImage } from "../../utils/cloudinary.js";
import { connectDB } from '../config/db.js'
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import FormData from "form-data";
import path from "path";

// Disease Detection
export const predictScan = async ({ body, userId }) => {
  const { imageBase64 } = body;
  if (!imageBase64) throw new Error("Image is required");

  const imageUrl = await uploadImage(imageBase64, "scans");

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Failed to fetch image from Cloudinary");

  const buffer = await response.arrayBuffer();
  const ext = path.extname(imageUrl).toLowerCase();
  let contentType = "image/png"; 
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";

  const formData = new FormData();
  formData.append("file", Buffer.from(buffer), {
    filename: `scan${ext}`,
    contentType,
  });

  let predictionResult;
  try {
    const res = await fetch("https://plantdiseasedetection-p3cg.onrender.com/predict", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Flask API error: ${text}`);
    }

    predictionResult = await res.json();
  } catch (err) {
    console.error("Flask API call failed:", err);
    throw new Error("Prediction failed");
  }

  const { disease: diseaseFull, plant_name: plantName, accuracy: confidence } = predictionResult;

  let explanation = "No explanation available";
  try {
    const prompt = `
      Explain the following plant disease to a farmer in simple language:
      Plant: "${plantName}"
      Disease: "${diseaseFull}"
      Confidence: ${confidence}%

      Use bullet points (<ol><li>…</li></ol>), highlight important words with <b>bold</b> tags only not with ** **,
      and provide practical advice for the farmer.

      Provide the output as JSON:
        "explanation": "<Your detailed explanation>"
    `;

    const result = await model.generateContent(prompt);
    let textResponse = result.response.text();
    textResponse = textResponse.replace(/```json\s*([\s\S]*?)\s*```/i, "$1").trim();

    try {
      const parsed = JSON.parse(textResponse);
      explanation = parsed.explanation || explanation;
    } catch {
      explanation = textResponse || explanation;
    }
  } catch (err) {
    console.error("Gemini API error:", err);
  }

  const newScan = new Scan({
    user: userId,
    imageUrl,
    plantName,
    prediction: diseaseFull,
    confidence,
    explanation,
  });
  await newScan.save();

  return {
    _id: newScan._id,
    imageUrl,
    plantName,
    prediction: diseaseFull,
    confidence,
    explanation,
    createdAt: newScan.createdAt,
  };
};

// Fetch Scans
export const getScans = async (token, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const scans = await Scan.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("imageUrl plantName prediction confidence createdAt");

    return res.json({ scans });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load scans!" });
  }
};

// Fetch Scan by Id
export const getScanById = async (token, scanId, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const scan = await Scan.findOne({ _id: scanId, user: userId });
    if (!scan) {
      return res.status(404).json({ error: "Scan not found!" });
    }

    return res.json(scan);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load scan!" });
  }
};


// Delete Scan
export const deleteScan = async (token, scanId, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const scan = await Scan.findOne({ _id: scanId, user: userId });
    if (!scan) {
      return res.status(404).json({ error: "Scan not found or not authorized!" });
    }

    await Scan.deleteOne({ _id: scanId });

    return res.json({ success: true, message: "Scan deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete scan!" });
  }
};


