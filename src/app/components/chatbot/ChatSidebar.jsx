"use client";
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API } from '../../../app/utils/api.js'

const ChatSidebar = ({ selectedChatId, onSelectChat, refreshFlag }) => {

  const userId = "6914f28274882b40bddbe70f";

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch all converstions
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/chatbot/list?userId=${userId}`);
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
  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`${API}/chatbot/list`, { 
        params: { chatId, userId } 
      });
      toast.success("Chat deleted!");
      router.push('/user/chatbot');
      fetchConversations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chat!");
    }
  };

  // Create a new chat
  // const handleNewChat = async () => {
  //   try {
  //     const { data } = await axios.post(`${API}/chatbot/new`, {
  //       userId: userId,
  //       title: "New Chat",
  //       language: "en-US"
  //     });

  //     if (data && data.chatId) {
  //       toast.success("New chat created!");
  //       router.push(`/user/chatbot/${data.chatId}`);
  //       fetchConversations();
  //     } else {
  //       toast.error("Failed to get new chat ID!");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to create new chat!");
  //   }
  // };

  const handleNewChat = async () => {
    router.push('/user/chatbot');
  };

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
    <div className="w-[280px] h-screen space-y-3 py-4 border-r border-r-gray-300">

      <div className="flex justify-between items-center px-2">
        <h2 className='text-medium'>Farm AI</h2>
        <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
          <img src="/images/chatbot/closepanel.svg" alt="" className='w-5' />
        </div>
      </div>

      <div className="space-y-0.5 pr-2 mb-5">
        <div onClick={handleNewChat} className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
          <img src="/images/chatbot/newchat.png" alt="" className='w-5' />
          <p className='text-sm'>New Chat</p>
        </div>

        <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
          <img src="/images/chatbot/search.png" alt="" className='w-5' />
          <p className='text-sm'>Search chats</p>
        </div>
      </div>

      <div className="pr-2 space-y-2">
        <p className='text-sm text-gray-500 px-2'>Chats</p>

        <div className="">

          {loading && 
            Array.from({ length: 10 }).map((_, index) =>(
              <div key={index} className="px-2 py-2 flex justify-between items-center gap-3 rounded-md group animate-pulse">
                <div className="w-50 h-4 bg-gray-200 rounded-sm"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))
          }

          {conversations.map((chat) => (
            <div 
              key={chat._id} 
              onClick={() => {
                router.push(`/user/chatbot/${chat._id}`);
              }}
              className={`relative px-2 py-2 flex justify-between items-center gap-3 ${selectedChatId === chat._id ? 'bg-[#eeeef1] hover:bg-gray-200' : 'hover:bg-gray-100' } rounded-md cursor-pointer group`}
            >
              <p className='text-sm truncate'>{chat.title}</p>
              <img 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                }} 
                src="/images/chatbot/more.png" alt="" 
                className={`w-4 mr-1.5 opacity-0 ${ openMenuId === chat._id ? 'opacity-100' : '' } group-hover:opacity-100 transition-opacity duration-100`}
              />

              {openMenuId === chat._id && (
                <div
                  ref={dropdownRef}
                  onMouseEnter={(e) => e.stopPropagation()} 
                  onMouseLeave={(e) => e.stopPropagation()} 
                  className="absolute top-full right-0 mt-1 w-25 bg-white border border-gray-200 rounded-md shadow-sm z-10"
                >                  
                  <div
                    onClick={() => {
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-gray-100 text-gray-600 rounded-b-md cursor-pointer"
                  >
                    <img src="/images/chatbot/rename.png" className='h-4.5 w-4.5' alt="" />                    
                    Rename
                  </div>

                  <div
                    onClick={() => {
                      handleDeleteChat(chat._id);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-red-50 text-red-600 rounded-t-md cursor-pointer"
                  >
                    <img src="/images/chatbot/delete.png" className='h-4.5 w-4.5' alt="" />                    
                    Delete
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>

      </div>

    </div>
    </>
  )
}

export default ChatSidebar