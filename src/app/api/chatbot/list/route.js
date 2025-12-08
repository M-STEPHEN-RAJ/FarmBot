import { getChats, deleteChat } from "../../../backend/controllers/chatController.js";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
    }

    const chats = await getChats(userId);

    return new Response(JSON.stringify({ chats }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Handle delete request
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const chatId = url.searchParams.get("chatId");
    const userId = url.searchParams.get("userId");

    if (!chatId || !userId) {
      return new Response(JSON.stringify({ error: "chatId and userId are required" }), { status: 400 });
    }

    const result = await deleteChat(chatId, userId);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

