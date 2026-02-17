import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import Dashboard from "@/app/backend/models/Dashboard.js";
import Scan from "@/app/backend/models/Scan.js";

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function GET(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const dashboardDoc = await Dashboard.findOne({ userId });
    if (!dashboardDoc) {
      return NextResponse.json({ crops: [] }, { status: 200 });
    }

    const today = normalizeDate(new Date());

    const crops = await Promise.all(
      dashboardDoc.crops.map(async (crop) => {
        const start = normalizeDate(crop.startDate);
        const totalDays = crop.harvestDays;

        const diffDays = Math.floor(
          (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );

        const day = today < start ? 0 : Math.min(totalDays, diffDays + 1);
        const progress = Math.round((day / totalDays) * 100);
        const daysRemaining = Math.max(0, totalDays - day);

        const harvestDate = new Date(start);
        harvestDate.setDate(start.getDate() + totalDays - 1);

        const latestScan = await Scan.findOne({
          user: userId,
          plantName: new RegExp(`^${crop.name}$`, "i"),
        }).sort({ createdAt: -1 });

        return {
          name: crop.name,
          startDate: crop.startDate,
          harvestDays: totalDays,

          // ✅ COMPUTED (NOW THEY WILL APPEAR)
          day,
          totalDays,
          progress,
          daysRemaining,
          harvestDate,

          health: latestScan
            ? {
                plantName: latestScan.plantName,
                result: latestScan.prediction,
                confidence: latestScan.confidence,
                predictedAt: latestScan.createdAt,
              }
            : null,

          todayAdvice:
            crop.todayAdvice &&
            normalizeDate(crop.todayAdvice.generatedForDate).getTime() ===
              today.getTime()
              ? crop.todayAdvice
              : null,
        };
      }),
    );

    return NextResponse.json({ crops }, { status: 200 });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard!" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, startDate } = await req.json();

    if (!name || !startDate) {
      return NextResponse.json(
        { message: "Plant name and startDate required!" },
        { status: 400 },
      );
    }

    // 🌱 FarmBot harvest knowledge
    const HARVEST_DAYS = {
      potato: 90,
      tomato: 75,
      onion: 100,
      rice: 120,
      maize: 90,
    };

    const plantKey = name.toLowerCase();
    const harvestDays = HARVEST_DAYS[plantKey];

    if (!harvestDays) {
      return NextResponse.json(
        { message: "Harvest data not available for this crop" },
        { status: 400 },
      );
    }

    let dashboard = await Dashboard.findOne({ userId });

    if (!dashboard) {
      dashboard = await Dashboard.create({
        userId,
        crops: [],
      });
    }

    const alreadyExists = dashboard.crops.some(
      (c) => c.name.toLowerCase() === plantKey,
    );

    if (alreadyExists) {
      return NextResponse.json(
        { message: "Crop already exists!" },
        { status: 409 },
      );
    }

    dashboard.crops.push({
      name,
      startDate: new Date(startDate),
      harvestDays,
    });

    await dashboard.save();

    return NextResponse.json(
      {
        message: "Crop added successfully!",
        crop: {
          name,
          startDate,
          harvestDays,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Crop Error:", error);
    return NextResponse.json(
      { message: "Failed to add crop!" },
      { status: 500 },
    );
  }
}
