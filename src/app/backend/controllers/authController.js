import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

// Register User
export const registerUser = async (req) => {
    try {
        const { name, email, password, role, avatar } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "Email already exists!" }),
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            avatar: avatar || "https://res.cloudinary.com/dbqirapyz/image/upload/v1766351294/avatar_zrjmys.png",
            provider: "credentials",
        })

        return new Response(
            JSON.stringify({ message: "User registered successfully!", user: newUser }),
            { status: 201 }
        );
    } 
    catch (error) {
        console.error("Signup error!", error); 
        return new Response(
            JSON.stringify({ message: "Failed to register!" }),
            { status: 500 }
        );       
    }
}

// Login User
export const loginUser = async (req) => {
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials!" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Login successful!", user, token }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  }
  catch (error) {
    console.error("Login error!", error);
    return new Response(
      JSON.stringify({ message: "Failed to Login!!" }),
      { status: 500 }
    );
  }
}