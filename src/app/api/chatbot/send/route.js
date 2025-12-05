import { addMessage } from "../../../backend/controllers/chatController.js";

export async function POST(req) {
  try {
    const { chatId, message, userId, lang } = await req.json();

    if (!chatId || !message || !userId || !lang) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const botReply = await addMessage({ chatId, message, userId, lang });

    return new Response(JSON.stringify({ botReply }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
