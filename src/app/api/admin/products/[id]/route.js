import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import Admin from "@/app/backend/models/Admin.js";
import Product from "@/app/backend/models/Product.js";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Admin login required." },
        { status: 401 }
      );
    }

    let admin;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      admin = await Admin.findById(decoded.id);

      if (!admin || admin.role !== "admin") {
        return NextResponse.json(
          { message: "Unauthorized! Invalid admin." },
          { status: 401 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized! Invalid token." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const allowedStatus = ["review", "active", "blocked"];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value!" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Product status updated",
      product,
    });

  } catch (err) {
    console.error("ADMIN PRODUCT UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}