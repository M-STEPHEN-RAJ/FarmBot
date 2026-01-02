import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import { getProductById } from "@/app/backend/controllers/storeController.js";

export async function GET(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      throw new Error("Product ID is required!");
    }

    const product = await getProductById(id);

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
