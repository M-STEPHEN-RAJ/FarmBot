import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

// Register Seller
export const registerSeller = async (req) => {
  try {
    const { name, email, password, storeName, avatar } = await req.json();

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return new Response(
        JSON.stringify({ message: "Email already exists!" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      role: "seller",
      avatar:
        avatar ||
        "https://res.cloudinary.com/dbqirapyz/image/upload/v1766351294/avatar_zrjmys.png",
      storeName: storeName || "",
      provider: "credentials",
    });

    return new Response(
      JSON.stringify({
        message: "Seller registered successfully!",
        seller: newSeller,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Seller signup error!", error);
    return new Response(
      JSON.stringify({ message: "Failed to register seller!" }),
      { status: 500 }
    );
  }
};

// Login Seller
export const loginSeller = async (req) => {
  try {
    const { email, password } = await req.json();

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return new Response(
        JSON.stringify({ message: "Seller not found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials!" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    const cookie = serialize("sellerToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Login successful!", seller, token }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Seller login error!", error);
    return new Response(
      JSON.stringify({ message: "Failed to login seller!" }),
      { status: 500 }
    );
  }
};
