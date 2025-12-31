import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import User from "@/app/backend/models/User.js";
import { initServer } from "@/app/backend/server";

export async function GET(req) {
  await initServer();

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email) return new Response("Email missing", { status: 400 });

  const user = await User.findOne({ email });
  if (!user) return new Response("User not found", { status: 404 });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      Location: "/user/chatbot",
    },
  });
}
