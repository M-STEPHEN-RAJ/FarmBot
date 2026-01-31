"use client";
import ChatSidebar from "@/app/components/user/chatbot/ChatSidebar";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";

const ChatBot = () => {
  const params = useParams();
  const chatId = params?.id;

  const [loading, setLoading] = useState(true); // messages loading
  const [langLoading, setLangLoading] = useState(true); // language loading
  const [currentUserId, setCurrentUserId] = useState(null);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const prevLangRef = useRef(lang);

  const refreshSidebar = () => setRefreshFlag((prev) => !prev);

  /** FETCH CURRENT USER & SET LANGUAGE */
  const fetchCurrentUser = async () => {
    try {
      setLangLoading(true);
      const res = await axios.get(`${API}/me`, { withCredentials: true });

      if (res.data?.user?._id) {
        const user = res.data.user;
        setCurrentUserId(user._id);

        // Set language based on API
        if (user.preferredLanguage === "ta") {
          setLang("ta-IN");
        } else {
          setLang("en-US");
        }
      } else {
        toast.error("Failed to fetch user info");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      toast.error("Failed to fetch user info");
    } finally {
      setLangLoading(false);
    }
  };

  /** FETCH CHAT MESSAGES */
  const fetchMessages = async () => {
    if (!chatId) return;
    setLoading(true);

    try {
      const res = await axios.get(`${API}/chatbot/${chatId}`);
      if (res.data?.chat) {
        const ownerId = res.data.chat.userId;
        setCurrentUserId(ownerId);

        const formattedMessages = res.data.chat.messages.map((msg) => ({
          sender: msg.userId._id === ownerId ? "user" : "bot",
          text: msg.content || "",
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);

      if (err.response?.status === 404 || err.response?.status === 500) {
        toast.error("This chat no longer exists!");
        window.location.href = "/user/chatbot";
        return;
      }

      toast.error("Failed to load messages!");
    } finally {
      setLoading(false);
    }
  };

  /** UPDATE LANGUAGE VIA API */
  const updateLanguage = async (newLang) => {
    try {
      setLangLoading(true);
      await axios.patch(
        `${API}/me`,
        {
          preferredLanguage: newLang === "ta-IN" ? "ta" : "en",
        },
        { withCredentials: true }
      );
      setLang(newLang);
      toast.success(`Language switched to ${newLang === "ta-IN" ? "Tamil" : "English"}`);
    } catch (err) {
      console.error("Failed to update language", err);
      toast.error("Failed to update language");
    } finally {
      setLangLoading(false);
    }
  };

  /** SEND MESSAGE */
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
        message: text.trim(),
        lang,
      });

      await fetchMessages();
      refreshSidebar();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message!");
    }
  };

  /** SCROLL TO BOTTOM */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** SPEECH RECOGNITION */
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

  /** UPDATE RECOGNITION LANG WHEN LANG CHANGES */
  useEffect(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = lang;

    if (prevLangRef.current !== lang) {
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

  /** INITIAL FETCH */
  useEffect(() => {
    fetchCurrentUser();
    if (chatId) fetchMessages();
  }, [chatId]);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <ChatSidebar selectedChatId={chatId} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full px-4">
          <div className="flex-1 py-4 space-y-5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`w-fit px-5 py-2 rounded-xl wrap-break-word ${
                  msg.sender === "user"
                    ? "bg-[#166831] text-white ml-auto max-w-[70%]"
                    : "bg-white text-gray-800"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}

            {loading && (
              <div className="flex flex-col justify-between w-full h-[90%]">
                <div className="space-y-5 h-full">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col space-y-5 w-full mx-auto"
                    >
                      <div className="ml-auto w-[50%] h-7 bg-green-300/50 rounded-xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="w-[80%] h-7 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-[80%] h-7 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-[60%] h-7 bg-gray-200 rounded-xl animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="space-y-2 sticky bottom-0 bg-white pt-2">
            <div
              className={`w-full flex px-2 py-1 ${
                text.length > 70
                  ? "flex-col items-end gap-3 py-2"
                  : "flex-row justify-between items-center gap-3"
              } border border-gray-300 rounded-4xl bg-white`}
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
                {/* Language Switch */}
                <div
                  onClick={() => {
                    if (langLoading) return;
                    const newLang = lang === "en-US" ? "ta-IN" : "en-US";
                    updateLanguage(newLang);
                  }}
                  className={`w-10 h-10 flex justify-center items-center p-2.5 rounded-full cursor-pointer ${
                    langLoading
                      ? "bg-gray-100 animate-pulse hover:bg-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {!langLoading && <p className="font-semibold">{lang === "en-US" ? "en" : "த"}</p>}
                </div>

                {/* Send / Mic */}
                <div
                  className={`w-10 p-2 rounded-full cursor-pointer ${
                    listening ? "bg-red-500" : "bg-[#166831]"
                  } ${langLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (langLoading) return;
                    text.length > 0 ? sendMessage() : startListening();
                  }}
                >
                  <img
                    src={`/images/user/chatbot/${text.length > 0 ? "send" : "microphone"}.png`}
                    alt=""
                    className="w-8"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 pb-2">
              FarmBot AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;