import React from 'react'
import Sidebar from '../components/common/Sidebar'
import SessionWatcher from '../providers/SessionWatcher'

const UserLayout = ({ children }) => {
  return (
    <SessionWatcher>
      <div className="flex w-full min-h-screen">
          <div className="p-1 sticky top-0 h-screen">
            <Sidebar />
          </div>

          <main className="flex-1 flex justify-center">
              {children}
          </main>
      </div>
    </SessionWatcher>
  )
}

export default UserLayout