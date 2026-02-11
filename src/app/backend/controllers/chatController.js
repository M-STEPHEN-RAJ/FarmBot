import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { connectDB } from "../config/db";
import { model } from "../config/gemini";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

mongoose.model('User', User.schema);

// Create New Chat
export const createChat = async (token, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chat = await Chat.create({
      userId,
      title: "New Chat",
      messages: [],
    });

    return res.json({ chatId: chat._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create chat!" });
  }
};

// Add message and bot reply
export const addMessage = async (token, { chatId, message, lang }, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found!" });
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

    return res.json({ title: newTitle, reply: botReply });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process message!" });
  }
};

// Conversation Sidebar
export const getChats = async (token, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return res.json({ chats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load chats!" });
  }
};

// Delete a chat by ID
export const deleteChat = async (token, chatId, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) throw new Error("Chat not found or not authorized!");

    await Chat.deleteOne({ _id: chatId });

    return res.json({ success: true, message: "Chat deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete chat!" });
  }
};

// Get chat by ID
export const getChatById = async (token, chatId) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chat = await Chat.findOne({ _id: chatId, userId }).populate("messages.userId", "name");
    if (!chat) throw new Error("Chat not found!");

    return chat;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Rename chat title
export const renameChat = async (token, chatId, newTitle, res) => {
  try {
    await connectDB();

    if (!token) throw new Error("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!newTitle || !newTitle.trim()) {
      return res.status(400).json({ error: "Title is required!" });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { title: newTitle.slice(0, 50) },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!" });
    }

    return res.json({
      success: true,
      title: chat.title
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to rename chat!" });
  }
};
