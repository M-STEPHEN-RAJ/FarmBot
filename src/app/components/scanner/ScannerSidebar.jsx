import React from "react";

const ScannerSidebar = () => {
  return (
    <div className="w-[280px] h-screen overflow-y-auto space-y-4 py-4 border-r border-gray-300">
      <div className="sticky top-0 space-y-4 bg-white pb-3 z-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-medium">Farm Doc</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/chatbot/closepanel.svg" alt="" className="w-5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="-mt-1 space-y-0.5">
          <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/chatbot/newchat.png" alt="" className='w-5' />
            <p className='text-sm'>New Scan</p>
          </div>
          <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/chatbot/search.png" alt="" className='w-5' />
            <p className='text-sm'>Search scans</p>
          </div>
        </div>
      </div>

      <div className="-mt-2 space-y-2 pr-2">
        <p className="text-sm text-gray-500 px-2">Scans</p>

        <div
          className='relative px-2 py-2 flex justify-between items-center gap-3 rounded-md cursor-pointer group hover:bg-gray-100'
        >
          <p className="text-sm truncate">Plant Disease Detection</p>
          <img
            src="/images/chatbot/more.png"
            alt=""
            className='w-4 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100'
          />
        </div>
      </div>
    </div>
  );
};

export default ScannerSidebar;
