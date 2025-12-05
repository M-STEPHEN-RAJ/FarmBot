import { createChat } from "../../../backend/controllers/chatController.js";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const chatId = await createChat(userId);
    return new Response(JSON.stringify({ chatId }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
