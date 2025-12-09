"use client";
import ChatSidebar from "@/app/components/chatbot/ChatSidebar";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";


const ChatBot = () => {
  const params = useParams();

  const userId = "6914f28274882b40bddbe70f";
  const chatId = params?.id;

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const prevLangRef = useRef(lang);

  const refreshSidebar = () => setRefreshFlag(prev => !prev);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${API}/chatbot/${chatId}`
      );
      if (res.data?.chat?.messages) {
        const formattedMessages = res.data.chat.messages.map((msg) => ({
          sender: msg.userId._id === userId ? "user" : "bot",
          text: msg.content || "",
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      toast.error("Failed to load messages!");
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  // Send Message
  const sendMessage = async () => {

    if (!chatId) {
      toast.error("No chat selected!");
      return;
    }

    if (!text.trim()) return;

    const newMessage = { sender: "user", text: text.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setText("");

    try {
      await axios.post(`${API}/chatbot/send`, {
        chatId,
        userId,
        message: text.trim(),
        lang,
      });

      setText("");
      await fetchMessages();
      refreshSidebar();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message!");
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setText(transcript);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.lang = lang;

    if (prevLangRef.current !== lang) {
      toast.success(`Switched to ${lang === "ta-IN" ? "Tamil" : "English"}`);
      prevLangRef.current = lang;
    }
  }, [lang]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
        try {
        recognitionRef.current.start();
        } catch (err) {
        console.error("Speech recognition failed:", err);
        toast.error("Cannot start voice input.");
        }
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 5 * 24) + "px";
  };

  return (
    <div className="w-full flex">
      <ChatSidebar selectedChatId={chatId}  />

      <div className="flex-1 flex justify-center items-center">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center space-y-10 w-full max-w-[800px]">
            <h2 className="text-4xl font-medium text-[#166831]">
              Hello, Stephen
            </h2>

            <div
              className={`w-full flex px-2 py-1 ${
                text.length > 70
                  ? "flex-col items-end gap-3 py-2"
                  : "flex-row justify-between items-center gap-3"
              } border border-gray-300 rounded-4xl`}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="w-full outline-none resize-none overflow-y-auto px-3"
                placeholder="Ask Farm AI"
              />

              <div className="flex items-center gap-3">
                <div
                  onClick={() => setLang(lang === "en-US" ? "ta-IN" : "en-US")}
                  className="w-10 flex justify-center items-center p-2.5 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <p className="font-semibold">
                    {lang === "en-US" ? "en" : "த"}
                  </p>
                </div>

                <div
                  className={`w-10 p-2 rounded-full cursor-pointer ${
                    listening ? "bg-red-500" : "bg-[#166831]"
                  }`}
                  onClick={
                    text.length > 0
                      ? sendMessage
                      : startListening
                  }
                >
                  <img
                    src={`/images/chatbot/${
                      text.length > 0 ? "send" : "microphone"
                    }.png`}
                    alt=""
                    className="w-8"
                  />
                </div>
              </div>
            </div>

            <div className="w-full max-w-[600px] flex justify-center items-center flex-wrap gap-3">
              {[
                "What is the best crop for this season?",
                "How much fertilizer should I use?",
                "Detect plant disease",
                "Expected rainfall for this week",
                "Tips for healthy soil",
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setText(prompt);
                    textareaRef.current.focus();
                  }}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-screen max-w-[800px] mx-auto w-full">
            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`w-fit px-5 py-2 rounded-xl wrap-break-word
            ${
              msg.sender === "user"
                ? "bg-[#166831] text-white ml-auto max-w-[70%]"
                : "bg-white text-gray-800"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
                />                
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mb-2 space-y-2">
              <div
                className={`w-full flex px-2 py-1 ${
                  text.length > 70
                    ? "flex-col items-end gap-3 py-2"
                    : "flex-row justify-between items-center gap-3"
                } border border-gray-300 rounded-4xl`}
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={text}
                  onChange={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="w-full outline-none resize-none overflow-y-auto px-3 py-2"
                  placeholder="Ask Farm AI"
                />
                <div className="flex items-center gap-2">
                  <div
                    onClick={() =>
                      setLang(lang === "en-US" ? "ta-IN" : "en-US")
                    }
                    className="w-10 flex justify-center items-center p-2.5 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <p className="font-semibold">
                      {lang === "en-US" ? "en" : "த"}
                    </p>
                  </div>
                  <div
                    className={`w-10 p-2 rounded-full cursor-pointer ${
                      listening ? "bg-red-500" : "bg-[#166831]"
                    }`}
                    onClick={text.length > 0 ? sendMessage : startListening}
                  >
                    <img
                      src={`/images/chatbot/${
                        text.length > 0 ? "send" : "microphone"
                      }.png`}
                      alt=""
                      className="w-8"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">
                FarmBot AI can make mistakes. Check important info.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
