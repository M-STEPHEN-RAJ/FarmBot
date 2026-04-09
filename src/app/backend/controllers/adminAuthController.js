import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import Admin from "../models/Admin.js";

// Register Admin
export const registerAdmin = async (req) => {
  try {
    const { name, email, password, avatar } = await req.json();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists!" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      avatar:
        avatar ||
        "https://res.cloudinary.com/dbqirapyz/image/upload/v1766351294/avatar_zrjmys.png",
      provider: "credentials",
    });

    return new Response(
      JSON.stringify({
        message: "Admin registered successfully!",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin register error!", error);
    return new Response(
      JSON.stringify({ message: "Failed to register admin!" }),
      { status: 500 }
    );
  }
};

// Login Admin
export const loginAdmin = async (req) => {
  try {
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Admin not found!" }),
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials!" }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookie = serialize("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return new Response(
      JSON.stringify({
        message: "Login successful!",
        admin,
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Admin login error!", error);
    return new Response(
      JSON.stringify({ message: "Failed to login admin!" }),
      { status: 500 }
    );
  }
};