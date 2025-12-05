import { getChatById } from "../../../backend/controllers/chatController.js";

export async function GET(req) {
  const chatId = req.nextUrl.pathname.split("/").pop();

  try {
    const chat = await getChatById(chatId);
    return new Response(JSON.stringify({ chat }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
