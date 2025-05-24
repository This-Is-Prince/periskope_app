"use client";

import { useState } from "react";
import ChatListPanel from "@/components/ChatListPanel";
import ChatWindow from "@/components/ChatWindow";

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState("1");

  return (
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
  );
}
