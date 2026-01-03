import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import Product from "@/app/backend/models/Product.js";

export async function POST(req, context) {
  try {
    await connectDB();
    const { productId, reviewId } = await context.params;
    const { type } = await req.json();

    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json({ message: "Invalid type!" }, { status: 400 });
    }

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

    // Fetch product
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

    if (type === "like") {
      if (review.likes.includes(userId)) {
        review.likes = review.likes.filter((id) => id.toString() !== userId);
      } else {
        review.likes.push(userId);
        review.dislikes = review.dislikes.filter(
          (id) => id.toString() !== userId
        );
      }
    } else if (type === "dislike") {
      if (review.dislikes.includes(userId)) {
        review.dislikes = review.dislikes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        review.dislikes.push(userId);
        review.likes = review.likes.filter((id) => id.toString() !== userId);
      }
    }

    await product.save();

    return NextResponse.json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
