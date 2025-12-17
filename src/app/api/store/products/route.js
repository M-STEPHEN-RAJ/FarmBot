import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import { getProducts } from "@/app/backend/controllers/storeController.js";

export async function GET(req) {
  try {

    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const products = await getProducts(query);

    return NextResponse.json(products);

  } 
  catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch products!" },
      { status: 500 }
    );
  }
}
