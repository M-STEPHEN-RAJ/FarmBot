import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import { getProducts, createProduct } from "@/app/backend/controllers/storeController.js";
import jwt from "jsonwebtoken";
import Seller from "@/app/backend/models/Seller.js";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("sellerToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id);
    if (!seller || seller.role !== "seller") {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const savedProduct = await createProduct(body, seller);

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
