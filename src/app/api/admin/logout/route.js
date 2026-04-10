import { serialize } from "cookie";

export async function POST() {
  try {
    const cookie = serialize("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Admin logged out successfully!" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to logout!" }),
      { status: 500 }
    );
  }
}