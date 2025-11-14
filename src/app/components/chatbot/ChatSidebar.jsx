import React from 'react'

const ChatSidebar = () => {
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
        <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
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

        <div className="space-y-1">
          <div className="px-2 py-2 flex justify-between items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer group">
            <p className='text-sm'>Saving chatbot conversation</p>
            <img src="/images/chatbot/more.png" alt="" className='w-4 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100' />
          </div>

          <div className="px-2 py-2 flex justify-between items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer group">
            <p className='text-sm'>Saving chatbot conversation</p>
            <img src="/images/chatbot/more.png" alt="" className='w-4 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100' />
          </div>

          <div className="px-2 py-2 flex justify-between items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer group">
            <p className='text-sm'>Saving chatbot conversation</p>
            <img src="/images/chatbot/more.png" alt="" className='w-4 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100' />
          </div>
        </div>

      </div>

    </div>
    </>
  )
}

export default ChatSidebar