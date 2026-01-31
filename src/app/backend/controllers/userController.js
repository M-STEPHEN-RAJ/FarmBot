import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadImage } from "@/app/utils/cloudinary.js";

export const updateProfile = async (request) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return new Response(JSON.stringify({ message: "Invalid token!" }), {
        status: 401,
      });
    }

    const contentType = request.headers.get("content-type") || "";
    let updates = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name");
      const avatar = formData.get("avatar");
      const preferredLanguage = formData.get("preferredLanguage");

      if (name) updates.name = name;

      if (preferredLanguage && ["en", "ta"].includes(preferredLanguage)) {
        updates.preferredLanguage = preferredLanguage;
      }

      if (avatar && avatar.size > 0) {
        const buffer = Buffer.from(await avatar.arrayBuffer());
        const secure_url = await uploadImage(buffer);
        updates.avatar = secure_url;
      }
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      if (body.name) updates.name = body.name;
      if (body.avatar) updates.avatar = body.avatar;

      if (body.preferredLanguage && ["en", "ta"].includes(body.preferredLanguage)) {
        updates.preferredLanguage = body.preferredLanguage;
      }
    }

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ message: "Nothing to update!" }), {
        status: 400,
      });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    return new Response(JSON.stringify({ message: "Profile updated!", user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const getCurrentUser = async (request) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
