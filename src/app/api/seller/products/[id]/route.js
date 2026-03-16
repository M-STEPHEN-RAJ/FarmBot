import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import jwt from "jsonwebtoken";
import Seller from "@/app/backend/models/Seller.js";
import { editProduct } from "@/app/backend/controllers/storeController.js";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("sellerToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Seller login required." },
        { status: 401 },
      );
    }

    let seller;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      seller = await Seller.findById(decoded.id);
      if (!seller || seller.role !== "seller") {
        return NextResponse.json(
          { message: "Unauthorized! Invalid seller." },
          { status: 401 },
        );
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized! Invalid token." },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      type: formData.get("type"),
      price: Number(formData.get("price")),
      unit: formData.get("unit"),
      stock: Number(formData.get("stock")),
    };

    const image = formData.get("image");
    
    const updatedProduct = await editProduct(id, body, seller);

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error("EDIT PRODUCT ERROR:", err);
    return NextResponse.json(
      { message: "Failed to edit product!" },
      { status: 500 },
    );
  }
}
