"use client"
import ChatSidebar from '@/app/components/chatbot/ChatSidebar';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ChatBot = () => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-US");

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const prevLangRef = useRef(lang);

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
            .map(result => result[0].transcript)
            .join('');
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
      toast.success(`Switched to ${lang === 'ta-IN' ? 'Tamil' : 'English'}`);
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
      setText("");
    }
  };

  return (
    <div className="w-full flex">
      <ChatSidebar />

      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-10 w-full max-w-[800px]">
          <h2 className='text-4xl font-medium text-[#166831]'>Hello, Stephen</h2>

          <div className={`w-full flex ${text.length > 59 ? 
            "flex-col items-end gap-3" : 
            "flex-row justify-between items-center gap-3"
          } px-3 py-2 border border-gray-300 rounded-4xl`}>

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
                onClick={() => setLang(lang === "en-US" ? "ta-IN" : "en-US")} 
                className="w-10 flex justify-center items-center p-2.5 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <p className='font-semibold'>{lang === "en-US" ? "en" : "த"}</p>
              </div>

              <div
                className={`w-10 p-1.5 rounded-full cursor-pointer ${listening ? "bg-red-500" : "bg-[#166831]"}`}
                onClick={text.length > 0 ? () => { console.log("Send clicked:", text); setText(""); } : startListening}
              >
                <img
                  src={`/images/chatbot/${text.length > 0 ? "send" : "microphone"}.png`}
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
              "Tips for healthy soil"
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

export default ChatBot;
