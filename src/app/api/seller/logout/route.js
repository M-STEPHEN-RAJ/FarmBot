import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = serialize("sellerToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
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
