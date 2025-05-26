'use client'

import { useAuth } from '@/lib/auth'
import { FiUser, FiLogOut, FiMessageCircle, FiSettings } from 'react-icons/fi'

export default function Sidebar() {
  const { appUser, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {/* User Avatar */}
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-6">
        {appUser?.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-4 flex-1">
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
          <FiMessageCircle size={20} />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
          <FiUser size={20} />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
          <FiSettings size={20} />
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Logout"
      >
        <FiLogOut size={20} />
      </button>
    </div>
  )
}
  