import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import { addToCart, getCart } from "../../backend/controllers/cartController.js";

// Fetch Cart
export async function GET(req) {
  try {
    await connectDB();

    // Get JWT token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Not authenticated!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cart = await getCart(userId);

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || "Failed to fetch cart!" },
      { status }
    );
  }
}

// Add to Cart
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { productId, quantity } = body;

    // Get JWT token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Not authenticated!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cart = await addToCart({ userId, productId, quantity });

    return NextResponse.json({ message: "Added to cart!", cart }, { status: 200 });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || "Failed to add to cart!" },
      { status }
    );
  }
}
