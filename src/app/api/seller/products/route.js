import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import Product from "@/app/backend/models/Product.js";
import jwt from "jsonwebtoken";
import Seller from "@/app/backend/models/Seller.js";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    // Get token from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("sellerToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Seller login required." },
        { status: 401 }
      );
    }

    // Verify token & get seller
    let seller;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      seller = await Seller.findById(decoded.id);
      if (!seller || seller.role !== "seller") {
        return NextResponse.json(
          { message: "Unauthorized! Invalid seller." },
          { status: 401 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized! Invalid token." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const filter = {
      sellerId: new mongoose.Types.ObjectId(seller._id),
    };

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    if (query.search) filter.name = { $regex: query.search, $options: "i" };
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    if (query.inStock === "true") filter.stock = { $gt: 0 };
    if (query.outOfStock === "true") filter.stock = 0;
    if (query.rating && Number(query.rating) > 0)
      filter.rating = { $gte: Number(query.rating) };

    // Sorting
    let sortOption = {};
    if (query.sort === "popularity") sortOption = { popularity: -1 };
    else if (query.sort === "price_low") sortOption = { price: 1 };
    else if (query.sort === "price_high") sortOption = { price: -1 };
    else if (query.sort === "newest") sortOption = { createdAt: -1 };
    else sortOption = { popularity: -1 };

    const products = await Product.find(filter).sort(sortOption);

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET SELLER PRODUCTS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch seller products!" },
      { status: 500 }
    );
  }
}
