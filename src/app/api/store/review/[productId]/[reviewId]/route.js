import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import { deleteReview, updateReview } from "../../../../../backend/controllers/reviewController";

// Edit Review
export async function PATCH(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { productId, reviewId } = params;

    const body = await req.json();
    const { rating, comment, images } = body;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await updateReview({
      productId,
      reviewId,
      userId: decoded.id,
      rating,
      comment,
      images,
    });

    return NextResponse.json(
      {
        message: "Review updated successfully!",
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Review Error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || "Failed to update review!" },
      { status }
    );
  }
}

// Delete review
export async function DELETE(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { productId, reviewId } = params;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await deleteReview({
      productId,
      reviewId,
      userId: decoded.id,
    });

    return NextResponse.json(
      {
        message: "Review deleted successfully!",
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Review Error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || "Failed to delete review!" },
      { status }
    );
  }
}
