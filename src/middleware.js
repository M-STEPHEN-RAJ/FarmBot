import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
    
  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/user/login",
    "/user/register",
    "/user/forgot-password",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // protect /user routes
  if (!pathname.startsWith("/user")) {
    return NextResponse.next();
  }

  // Check Google session (NextAuth)
  const googleSession = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check credentials JWT cookie
  const token = req.cookies.get("token")?.value;
  let jwtValid = false;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      jwtValid = true;
    } catch (err) {
      jwtValid = false;
    }
  }

  // Block access if neither exists
  if (!googleSession && !jwtValid) {
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"],
};
