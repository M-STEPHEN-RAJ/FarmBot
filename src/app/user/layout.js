import React from 'react'
import Sidebar from '../components/common/Sidebar'

const UserLayout = ({ children }) => {
  return (
    <>
    <div className="flex w-full h-screen">
        <div className="p-1">
          <Sidebar />
        </div>

        <main className="flex-1 flex justify-center items-center">
            {children}
        </main>
    </div>
    </>
  )
}

export default UserLayout