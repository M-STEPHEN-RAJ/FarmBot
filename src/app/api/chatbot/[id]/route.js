import { getChatById } from "../../../backend/controllers/chatController.js";

export async function GET(req) {
  try {
    const chatId = req.nextUrl.pathname.split("/").pop();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized: No token" }), { status: 401 });
    }

    const chat = await getChatById(token, chatId);

    return new Response(JSON.stringify({ chat }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
