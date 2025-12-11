import { createChat } from "../../../backend/controllers/chatController.js";

export async function POST(req) {
  try {
    
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    const res = {
      json: (data) => new Response(JSON.stringify(data), { status: 200 }),
      status: (code) => ({
        json: (data) => new Response(JSON.stringify(data), { status: code }),
      }),
    };

    return createChat(token, res);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
