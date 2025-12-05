import mongoose from "mongoose";

// Each message
const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Conversation
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New Chat" },
  language: { type: String, default: "en-US" },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
