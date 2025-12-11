import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getCurrentUser = async (request) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token) {
      return new Response(
        JSON.stringify({ message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return new Response(
        JSON.stringify({ message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error fetching current user:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
