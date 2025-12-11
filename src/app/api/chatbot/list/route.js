import { getChats, deleteChat } from "../../../backend/controllers/chatController.js";

const createRes = () => ({
  json: (data) => new Response(JSON.stringify(data), { status: 200 }),
  status: (code) => ({
    json: (data) => new Response(JSON.stringify(data), { status: code }),
  }),
});

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    const res = createRes();
    return getChats(token, res);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const chatId = url.searchParams.get("chatId");

    if (!chatId) {
      return new Response(JSON.stringify({ error: "chatId is required" }), { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    const res = createRes();
    return deleteChat(token, chatId, res);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

