import { connectDB } from "@/app/backend/config/db.js";
import { predictCrop } from "@/app/backend/controllers/recommenderController.js";
import jwt from "jsonwebtoken";

connectDB();

const getTokenFromCookies = (req) => {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];
};

export async function POST(req) {
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();

    const result = await predictCrop({ body, userId });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}