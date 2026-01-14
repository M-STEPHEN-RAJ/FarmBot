import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Seller from "../../../backend/models/Seller.js";
import { uploadImage } from "@/app/utils/cloudinary.js";

export async function GET(req) {
  try {
    const token = req.cookies.get("sellerToken")?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id);

    if (!seller)
      return NextResponse.json({ ok: false }, { status: 401 });

    return NextResponse.json({
      ok: true,
      seller: {
        id: seller._id,
        name: seller.name,
        role: seller.role,
        email: seller.email,
        avatar: seller.avatar,
        storeName: seller.storeName,
        createdAt: seller.createdAt,
      },
    });
  } catch (error) {
    console.error("Seller session error:", error);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("sellerToken")?.value;
    if (!token)
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const contentType = req.headers.get("content-type") || "";
    let updates = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const name = formData.get("name");
      const storeName = formData.get("storeName");
      const avatar = formData.get("avatar");

      if (name) updates.name = name;
      if (storeName) updates.storeName = storeName;

      if (avatar && avatar.size > 0) {
        const buffer = Buffer.from(await avatar.arrayBuffer());
        const secure_url = await uploadImage(buffer);
        updates.avatar = secure_url;
      }
    }

    else if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.name) updates.name = body.name;
      if (body.storeName) updates.storeName = body.storeName;
      if (body.avatar) updates.avatar = body.avatar;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    const seller = await Seller.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      ok: true,
      message: "Seller profile updated",
      seller,
    });
  } catch (error) {
    console.error("Seller profile update error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}