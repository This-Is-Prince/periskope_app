"use client";

import { FiSearch } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

interface ChatHeaderProps {
  chatName: string;
  participants: string[];
}

export default function ChatWindowHeader({ chatName, participants }: ChatHeaderProps) {
  return (
    <div className="h-[44px] border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      {/* Left: Chat Info */}
      <div className="flex flex-col text-xs">
        <p className="text-gray-800 font-semibold text-sm">{chatName}</p>
        <p className="text-gray-400">
          {participants.length <= 4
            ? participants.join(", ")
            : `${participants.slice(0, 4).join(", ")} +${participants.length - 4}`}
        </p>
      </div>

      {/* Right: Avatars and Icons */}
      <div className="flex items-center gap-3">
        {/* Avatars */}
        <div className="flex items-center -space-x-2">
          {participants.slice(0, 4).map((name, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gray-300 text-white text-[10px] flex items-center justify-center border-2 border-white relative"
            >
              {name.charAt(0)}
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          ))}
          {participants.length > 4 && (
  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center border-2 border-white">
    +{participants.length - 4}
  </div>
)}

        </div>

        {/* Icons */}
        <BsStars className="text-gray-600 text-[18px] cursor-pointer" />
        <FiSearch className="text-gray-600 text-[16px] cursor-pointer" />
      </div>
    </div>
  );
}
