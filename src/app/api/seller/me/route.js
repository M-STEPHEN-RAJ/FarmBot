import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Seller from "../../../backend/models/Seller.js";

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
      },
    });
  } catch (error) {
    console.error("Seller session error:", error);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
