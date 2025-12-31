import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json(
    { message: "Logged out successfully!" },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}
