"use client";
import ChatSidebar from "@/app/components/user/chatbot/ChatSidebar";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";

const ChatBotHome = () => {
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [langLoading, setLangLoading] = useState(true);

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const prevLangRef = useRef(lang);

  // Get Current User Login
  const fetchCurrentUser = async () => {
    try {
      setLangLoading(true);

      const res = await axios.get(`${API}/me`, { withCredentials: true });
      if (res.data?.user?._id) {
        const user = res.data.user;

        setUserId(user._id);

        if (user.preferredLanguage === "ta") {
          setLang("ta-IN");
        } else {
          setLang("en-US");
        }
      } else {
        toast.error("Failed to get user info");
      }
    } catch (err) {
      console.error("Failed to fetch user!", err);
      toast.error("Failed to fetch user info!");
    } finally {
      setLangLoading(false);
    }
  };

  const updateLanguage = async (newLang) => {
    try {
      await axios.patch(
        `${API}/me`,
        {
          preferredLanguage: newLang === "ta-IN" ? "ta" : "en",
        },
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Failed to update language", err);
    }
  };

  // Create Chat and Send Message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      let chatId = selectedChatId;

      if (!chatId) {
        const { data } = await axios.post(
          `${API}/chatbot/new`,
          {
            title: "New Chat",
            language: lang,
          },
          {
            withCredentials: true,
          },
        );
        chatId = data.chatId;
        setSelectedChatId(chatId);
      }

      const userMessage = text.trim();
      setText("");

      await axios.post(
        `${API}/chatbot/send`,
        {
          chatId,
          message: userMessage,
          lang,
        },
        {
          withCredentials: true,
        },
      );

      router.push(`/user/chatbot/${chatId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message!");
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const { data } = await axios.get(`${API}/chatbot/${chatId}`, {
        withCredentials: true,
      });
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (userId && selectedChatId) {
      fetchChatMessages(selectedChatId);
    }
  }, [userId, selectedChatId]);

  useEffect(() => {
    if (!lang) return;

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

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

    return () => {
      recognition.abort();
    };
  }, [lang]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.lang = lang;

    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
    }
  }, [lang]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 5 * 24) + "px";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Send clicked:", text);
      handleSend();
    }
  };

  return (
    <div className="w-full flex">
      <ChatSidebar
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
      />

      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-10 w-full max-w-[800px]">
          <h2 className="text-4xl font-medium text-[#166831]">
            Hello, Stephen
          </h2>

          <div
            className={`w-full flex ${
              text.length > 59
                ? "flex-col items-end gap-3"
                : "flex-row justify-between items-center gap-3"
            } px-2 py-1 border border-gray-300 rounded-4xl`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyPress}
              className="w-full outline-none resize-none overflow-y-auto px-3"
              placeholder="Ask Farm AI"
            />

            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  if (langLoading) return;
                  const newLang = lang === "en-US" ? "ta-IN" : "en-US";
                  setLang(newLang);
                  updateLanguage(newLang);
                }}
                className={`w-10 h-10 flex justify-center items-center p-2.5 rounded-full cursor-pointer 
    ${langLoading ? "bg-gray-100 animate-pulse hover:bg-gray-300" : "hover:bg-gray-100"}`}
              >
                {!langLoading && (
                  <p className="font-semibold">
                    {lang === "en-US" ? "en" : "த"}
                  </p>
                )}
              </div>

              <div
                className={`w-10 p-2 rounded-full cursor-pointer ${
                  listening ? "bg-red-500" : "bg-[#166831]"
                } ${langLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (langLoading) return;
                  text.length > 0 ? handleSend() : startListening();
                }}
              >
                <img
                  src={`/images/user/chatbot/${
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
      </div>
    </div>
  );
};

export default ChatBotHome;
