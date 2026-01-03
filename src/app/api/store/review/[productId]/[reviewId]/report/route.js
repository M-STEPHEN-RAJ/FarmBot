import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import Product from "@/app/backend/models/Product.js";

export async function POST(req, context) {
  try {
    await connectDB();

    const { productId, reviewId } = await context.params;

    // Get JWT token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 }
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const product = await Product.findById(productId);
    if (!product)
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 404 }
      );

    const review = product.reviews.id(reviewId);
    if (!review)
      return NextResponse.json(
        { message: "Review not found!" },
        { status: 404 }
      );

    if (!Array.isArray(review.reporters)) {
      review.reporters = [];
    }

    if (review.reporters.includes(userId)) {
      review.reporters = review.reporters.filter(
        (id) => id.toString() !== userId
      );
    } else {
      review.reporters.push(userId);
    }

    review.reportCount = review.reporters.length;

    await product.save();

    return NextResponse.json({
      reporters: review.reporters,
      reportCount: review.reportCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
