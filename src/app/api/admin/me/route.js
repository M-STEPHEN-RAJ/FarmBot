import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Admin from "../../../backend/models/Admin.js";
import { uploadImage } from "@/app/utils/cloudinary.js";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
        email: admin.email,
        avatar: admin.avatar,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const contentType = req.headers.get("content-type") || "";
    let updates = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const name = formData.get("name");
      const avatar = formData.get("avatar");

      if (name) updates.name = name;

      if (avatar && avatar.size > 0) {
        const buffer = Buffer.from(await avatar.arrayBuffer());
        const secure_url = await uploadImage(buffer);
        updates.avatar = secure_url;
      }
    }

    else if (contentType.includes("application/json")) {
      const body = await req.json();

      if (body.name) updates.name = body.name;
      if (body.avatar) updates.avatar = body.avatar;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    const admin = await Admin.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      ok: true,
      message: "Admin profile updated",
      admin,
    });

  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}