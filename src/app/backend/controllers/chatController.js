import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { connectDB } from "../config/db";
import { model } from "../config/gemini";
import mongoose from "mongoose";

// Ensure the User model is registered
mongoose.model('User', User.schema);

// Create New Chat
export const createChat = async (userId) => {
  await connectDB();

  const chat = await Chat.create({
    userId,
    title: "New Chat",
    messages: []
  });

  return chat._id;
};

// Add message and bot reply (combined prompt)
export const addMessage = async ({ chatId, message, userId, lang }) => {
  await connectDB();

  const chat = await Chat.findById(chatId);
  let newTitle = chat.title;

  const prompt = `
You are FarmBot AI.
Reply only to farmer-related questions.
Reply in ${lang === "ta-IN" ? "Tamil" : "English"}.
Make your answer simple and easy to understand for farmers.
Use bullet points (<ol><li>…</li></ol>) for each point instead of "-".
Optionally, you can use numbers (1,2,3) or Roman numerals (i, ii, iii) for numbering.
Highlight important words with <b>bold</b> tags instead of using **.
Separate sections with <br> where needed.
User message: "${message}"
${chat.title === "New Chat" ? 'Also, generate a short 3-5 word title for this conversation.' : ""}
Provide your response as JSON:
{
  "reply": "<Your bot reply with <ul><li>…</li></ul> and <b>bold</b> tags>"${chat.title === "New Chat" ? ', "title": "<Conversation title>"' : ""}
}
`;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();

  responseText = responseText.replace(/```json\s*([\s\S]*?)\s*```/i, '$1').trim();

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", err);
    parsed = { reply: responseText };
  }

  const botReply = parsed.reply || message;
  if (parsed.title) newTitle = parsed.title.slice(0, 50);

  await Chat.findByIdAndUpdate(chatId, {
    $push: {
      messages: [
        { userId, content: message },
        { userId: new mongoose.Types.ObjectId(process.env.BOT_USER_ID), content: botReply }
      ]
    },
    language: lang,
    title: newTitle
  });

  return { title: newTitle, reply: botReply };
};

// Conversation Sidebar
export const getChats = async (userId) => {
  await connectDB();

  const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
  return chats;
};

// Get chat by ID
export const getChatById = async (chatId) => {
  await connectDB();

  const chat = await Chat.findById(chatId).populate("messages.userId", "name");

  if (!chat) throw new Error("Chat not found");

  return chat;
};

// Delete a chat by ID
export const deleteChat = async (chatId, userId) => {
  await connectDB();

  const chat = await Chat.findOne({ _id: chatId, userId });
  if (!chat) throw new Error("Chat not found or not authorized!");

  await Chat.deleteOne({ _id: chatId });

  return { success: true, message: "Chat deleted successfully!" };
};

