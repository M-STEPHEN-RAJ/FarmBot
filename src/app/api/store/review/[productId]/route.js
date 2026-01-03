import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import { addReview } from "../../../../backend/controllers/reviewController";

export async function POST(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const productId = params.productId;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required!" },
        { status: 400 }
      );
    }

    // Get JWT token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 }
      );
    }

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { rating, comment, images } = body;

    const result = await addReview({
      productId,
      userId: decoded.id,
      userName: decoded.name,
      userAvatar: decoded.avatar,
      rating,
      comment,
      images,
    });

    return NextResponse.json(
      {
        message: "Review added successfully!",
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Review Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add review!" },
      { status: 500 }
    );
  }
}
