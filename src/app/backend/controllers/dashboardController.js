import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Chat from "../models/Chat.js";
import { model } from "../config/gemini.js";

export const getTodayAdvice = async (token, dashboardData, lang, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      weather,
      crop,
      disease,
      date
    } = dashboardData;

    const prompt = `
You are FarmBot AI – a professional farming advisor.

Your task:
Give ONLY today’s farming actions based on the provided real data.

Rules:
• Reply in ${lang === "ta-IN" ? "Tamil" : "English"}
• Focus ONLY on today
• Be practical & short
• Use <ul><li>…</li></ul>
• Highlight risks using <b>bold</b>
• Do NOT ask questions
• Do NOT explain data
• No greetings

Farm Data:
Date: ${date}

Weather:
- Temperature: ${weather?.temp} °C
- Humidity: ${weather?.humidity} %
- Wind Speed: ${weather?.wind} m/s
- Condition: ${weather?.condition}
- Location: ${weather?.location}

Crop:
- Name: ${crop?.name}
- Start Date: ${crop?.startDate}
- Harvest Days: ${crop?.harvestDays}
- Days Remaining: ${crop?.daysRemaining}
- Progress: ${crop?.progress} %

Disease Scan:
- Result: ${disease?.result || "No Scan"}
- Confidence: ${disease?.confidence || "N/A"}

Respond ONLY as JSON:
{
  "reply": "<ul><li>Daily actions</li></ul>"
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json\s*([\s\S]*?)\s*```/i, "$1").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { reply: text };
    }

    return res.json({
      success: true,
      advice: parsed.reply
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate today advice!"
    });
  }
};