'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Sidebar from "@/components/Sidebar";
import ChatListPanel from "@/components/ChatListPanel";
import ChatWindow from "@/components/ChatWindow";
import ChatHeader from "@/components/ChatHeader";

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedChatId, setSelectedChatId] = useState("11111111-1111-1111-1111-111111111111");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[60px] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader />

        {/* Content below header */}
        <div className="flex flex-1">
          <div className="flex w-full h-full">
            {/* Left Chat List */}
            <div className="w-[350px] border-r border-gray-200 bg-white">
              <ChatListPanel selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
            </div>

            {/* Right Chat Window */}
            <div className="flex-1 bg-[#ece5dd]">
              <ChatWindow chatId={selectedChatId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}