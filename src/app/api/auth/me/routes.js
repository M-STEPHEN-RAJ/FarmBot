import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getUserById } from "../../../backend/controllers/userController.js"

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    return NextResponse.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
