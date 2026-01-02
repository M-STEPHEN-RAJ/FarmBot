import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import Product from "@/app/backend/models/Product.js";
import jwt from "jsonwebtoken";

export async function POST(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const productId = params.id;

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
    const userId = decoded.id;
    const userName = decoded.name;
    const userAvatar = decoded.avatar;

    const body = await req.json();
    const { rating, comment, images } = body;

    if (!rating) {
      return NextResponse.json(
        { message: "Rating is required!" },
        { status: 400 }
      );
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 404 }
      );
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        { message: "You have already reviewed this product!" },
        { status: 400 }
      );
    }

    // Create review
    const review = {
      userId,
      userName,
      userAvatar,
      rating,
      comment,
      images: images || [],
      isVerifiedPurchase: false,
    };

    product.reviews.push(review);

    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.reviewCount = product.reviews.length;
    product.rating = Number((totalRating / product.reviewCount).toFixed(1));

    await product.save();

    return NextResponse.json(
      {
        message: "Review added successfully!",
        review: product.reviews[product.reviews.length - 1],
        rating: product.rating,
        reviewCount: product.reviewCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Review Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add review" },
      { status: 500 }
    );
  }
}
