import { connectDB } from "@/app/backend/config/db.js";
import Dashboard from "@/app/backend/models/Dashboard.js";
import jwt from "jsonwebtoken";
import { getTodayAdvice } from "@/app/backend/controllers/dashboardController.js";

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function POST(req) {
  try {
    await connectDB();

    // 🔐 AUTH
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 📦 BODY
    const { weather, crop, disease, date, lang } = await req.json();

    if (!weather || !crop?.name || !date || !lang) {
      return new Response(
        JSON.stringify({ error: "Missing dashboard data" }),
        { status: 400 }
      );
    }

    // 🧠 AI GENERATION (unchanged)
    const aiResponse = await getTodayAdvice(
      token,
      { weather, crop, disease, date },
      lang,
      {
        json: (data) => data,
        status: () => ({
          json: (data) => data,
        }),
      }
    );

    // 📘 FIND DASHBOARD
    const dashboard = await Dashboard.findOne({ userId });
    if (!dashboard) {
      return new Response(
        JSON.stringify({ error: "Dashboard not found" }),
        { status: 404 }
      );
    }

    // 🌱 MATCH CROP BY NAME (case-insensitive)
    const cropDoc = dashboard.crops.find(
      (c) => c.name.toLowerCase() === crop.name.toLowerCase()
    );

    if (!cropDoc) {
      return new Response(
        JSON.stringify({ error: "Crop not found" }),
        { status: 404 }
      );
    }

    // 💾 SAVE TODAY ADVICE
    cropDoc.todayAdvice = {
      content: aiResponse.advice,
      generatedForDate: normalizeDate(date),
      generatedAt: new Date(),
    };

    await dashboard.save();

    // ✅ RESPONSE
    return new Response(
      JSON.stringify({
        success: true,
        advice: aiResponse.advice,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Today Advice Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate today advice" }),
      { status: 500 }
    );
  }
}