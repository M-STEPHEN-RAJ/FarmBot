"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "../../../utils/api.js";
import DeleteModal from "./Modal/DeleteModal.jsx";

const ChatSidebar = ({ selectedChatId, onSelectChat, refreshFlag }) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChatToDelete, setSelectedChatToDelete] = useState(null);

  const router = useRouter();
  const dropdownRef = useRef(null);
  const chatRefs = useRef([]);
  const renameInputRef = useRef(null);

  // Fetch all converstions
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/chatbot/list`, {
        credentials: "include",
      });
      const data = await res.json();
      setConversations(data.chats || []);
    } catch (err) {
      console.error("Failed to load conversations!", err);
      toast.error("Failed to load conversations!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Conversation
  const confirmDelete = async () => {
    try {
      if (!selectedChatToDelete) return;

      await axios.delete(`${API}/chatbot/list`, {
        params: { chatId: selectedChatToDelete.id },
      });

      toast.success("Chat deleted!");

      setShowDeleteModal(false);
      setSelectedChatToDelete(null);

      router.push("/user/chatbot");
      fetchConversations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chat!");
    }
  };

  // Rename Chat
  const handleRenameChat = async (chatId) => {
    try {
      if (!editedTitle.trim()) return;

      const res = await fetch(`${API}/chatbot/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Chat renamed!");

      setConversations((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, title: data.title } : c)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Rename failed!");
    } finally {
      setEditingChatId(null);
    }
  };

  const handleNewChat = async () => {
    router.push("/user/chatbot");
  };

  useEffect(() => {
    if (conversations.length > 0) {
      gsap.fromTo(
        chatRefs.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
      );
    }
  }, [conversations]);

  useEffect(() => {
    if (!editingChatId) return;

    const handleClickOutsideRename = (e) => {
      if (
        renameInputRef.current &&
        !renameInputRef.current.contains(e.target)
      ) {
        setEditingChatId(null);
        setEditedTitle("");
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRename);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideRename);
    };
  }, [editingChatId]);

  useEffect(() => {
    fetchConversations();
  }, [refreshFlag]);

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-[280px] h-screen space-y-3 py-4 border-r border-r-gray-300">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-medium">Farm AI</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img
              src="/images/user/chatbot/closepanel.svg"
              alt=""
              className="w-5"
            />
          </div>
        </div>

        <div className="space-y-0.5 pr-2 mb-5">
          <div
            onClick={handleNewChat}
            className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <img
              src="/images/user/chatbot/newchat.png"
              alt=""
              className="w-5"
            />
            <p className="text-sm">New Chat</p>
          </div>

          <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/user/chatbot/search.png" alt="" className="w-5" />
            <p className="text-sm">Search chats</p>
          </div>
        </div>

        <div className="pr-2 space-y-2">
          <p className="text-sm text-gray-500 px-2">Chats</p>

          <div className="">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="px-2 py-2 flex justify-between items-center gap-3 rounded-md animate-pulse"
                >
                  <div className="w-50 h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              ))
            ) : conversations.length > 0 ? (
              conversations.map((chat, index) => (
                <div
                  key={chat._id}
                  ref={(el) => (chatRefs.current[index] = el)}
                  onClick={() => {
                    router.push(`/user/chatbot/${chat._id}`);
                  }}
                  className={`relative px-2 py-2 flex justify-between items-center gap-3 ${
                    openMenuId === chat._id ? "z-50" : "z-10"
                  } ${
                    selectedChatId === chat._id
                      ? "bg-[#eeeef1] hover:bg-gray-200"
                      : "hover:bg-gray-100"
                  } rounded-md cursor-pointer group`}
                >
                  {editingChatId === chat._id ? (
                    <input
                      ref={renameInputRef}
                      autoFocus
                      value={editedTitle}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameChat(chat._id);
                        }
                        if (e.key === "Escape") {
                          setEditingChatId(null);
                          setEditedTitle("");
                        }
                      }}
                      className="text-sm w-full bg-white border border-gray-300 rounded px-1 outline-none"
                    />
                  ) : (
                    <p className="text-sm truncate">{chat.title}</p>
                  )}

                  <img
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                    }}
                    src="/images/user/chatbot/more.png"
                    alt=""
                    className={`w-4 mr-1.5 opacity-0 ${
                      openMenuId === chat._id ? "opacity-100" : ""
                    } group-hover:opacity-100 transition-opacity duration-100`}
                  />

                  {openMenuId === chat._id && (
                    <div
                      ref={dropdownRef}
                      onMouseEnter={(e) => e.stopPropagation()}
                      onMouseLeave={(e) => e.stopPropagation()}
                      className="absolute top-full right-0 mt-1 w-25 bg-white border border-gray-200 rounded-md shadow-sm z-10"
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChatId(chat._id);
                          setEditedTitle(chat.title);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-gray-100 text-gray-600 rounded-b-md cursor-pointer"
                      >
                        <img
                          src="/images/user/chatbot/rename.png"
                          className="h-4.5 w-4.5"
                          alt=""
                        />
                        Rename
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChatToDelete({
                            id: chat._id,
                            title: chat.title,
                          });
                          setShowDeleteModal(true);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-red-50 text-red-600 rounded-t-md cursor-pointer"
                      >
                        <img
                          src="/images/user/chatbot/delete.png"
                          className="h-4.5 w-4.5"
                          alt=""
                        />
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 px-2 py-5">No chats found</p>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          chatTitle={selectedChatToDelete?.title}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedChatToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default ChatSidebar;
