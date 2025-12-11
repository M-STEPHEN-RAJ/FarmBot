import { addMessage } from "../../../backend/controllers/chatController.js";

export async function POST(req) {
  try {

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    const body = await req.json();
    const { chatId, message, lang } = body;

    if (!chatId || !message || !lang) {
      return new Response(
        JSON.stringify({ error: "chatId, message, and lang are required" }),
        { status: 400 }
      );
    }

    // Pass token instead of userId
    return addMessage(token, { chatId, message, lang }, {
      json: (data) => new Response(JSON.stringify(data), { status: 200 }),
      status: (code) => ({
        json: (data) => new Response(JSON.stringify(data), { status: code }),
      }),
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
