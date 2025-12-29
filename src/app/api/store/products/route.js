import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import { getProducts, createProduct } from "@/app/backend/controllers/storeController.js";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const savedProduct = await createProduct(body);

    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error("POST PRODUCT ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add product!" },
      { status: 500 }
    );
  }
}

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
