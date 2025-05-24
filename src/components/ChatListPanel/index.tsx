"use client";

import { mockChats } from "@/lib/mockChats";
import FilterBar from "./FilterBar";
import TagBadge from "@/ui-components/Tags";
// import Image from "next/image";

interface Props {
  selectedChatId: string;
  setSelectedChatId: (id: string) => void;
}

export default function ChatListPanel({ selectedChatId, setSelectedChatId }: Props) {
  return (
    <div className="h-full w-full bg-white flex flex-col text-[10px] font-semibold text-gray-500">
      <FilterBar />
      <div className="h-screen overflow-y-auto">
        {mockChats.map((chat) => {
          const trimmedMessage =
            chat.message.length > 30 ? `${chat.message.slice(0, 30)}...` : chat.message;
            const formattedDate = chat.date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              });

          const visibleTags = chat.tags.slice(0, 2);
          const tagExtra = chat.tags.length > 2 ? `+${chat.tags.length - 2}` : "";
          const contactExtra = chat.contacts.length > 1 ? `+${chat.contacts.length - 1}` : "";

          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-[#f5f5f5] ${
                selectedChatId === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex gap-2 items-start">
                {/* Default Avatar */}
                <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center text-[11px] font-bold uppercase">
                  {typeof chat.author === "string" ? chat.author.charAt(0) : "?"}
                </div>

                {/* Main Chat Info */}
                <div className="flex-1">
                <div className="flex justify-between">
                    <p className="text-black text-[13px]">{chat.author}</p>
                    <div className="flex items-center gap-1">
                    {visibleTags.map((tag, i) => (
                        <TagBadge key={i} tag={tag} />
                    ))}
                    {tagExtra && (
                        <span className="text-[9px] text-gray-400">
                    {tagExtra}
                        </span>
                    )}
                    </div>
                </div>

                  <p className="text-gray-500 text-[12px] truncate">
                    {chat.lastMessageBy === "tester"
                      ? chat.message
                      : `${chat.lastMessageBy}: ${trimmedMessage}`}
                  </p>

                  <div className="flex justify-between mt-1 text-[11px] text-gray-400">
                    <span className="bg-[#f5f5f5] px-1 py-[0.5px] rounded-md ">
                      📞 {chat.contacts[0]}
                      {contactExtra && <span className="ml-1">{contactExtra}</span>}
                    </span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
