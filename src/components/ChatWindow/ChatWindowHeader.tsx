"use client";

import { FiSearch } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

interface ChatHeaderProps {
  chatName: string;
  participants: string[];
}

export default function ChatWindowHeader({ chatName, participants }: ChatHeaderProps) {
  return (
    <header className="h-[44px] border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      {/* Left: Chat Info */}
      <hgroup className="flex flex-col text-xs">
        <h2 className="text-gray-800 font-semibold text-sm">{chatName}</h2>
        <p className="text-gray-400">
          {participants.length <= 4
            ? participants.join(", ")
            : `${participants.slice(0, 4).join(", ")} +${participants.length - 4}`}
        </p>
      </hgroup>

      {/* Right: Avatars and Icons */}
      <div className="flex items-center gap-3">
        {/* Avatars */}
        <ul className="flex items-center -space-x-2" role="list" aria-label="Active participants">
          {participants.slice(0, 4).map((name, i) => (
            <li
              key={i}
              className="w-6 h-6 rounded-full bg-gray-300 text-white text-[10px] flex items-center justify-center border-2 border-white relative"
              title={name}
            >
              <span aria-hidden="true">{name.charAt(0)}</span>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" aria-label="Online"></span>
            </li>
          ))}
          {participants.length > 4 && (
            <li className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center border-2 border-white">
              +{participants.length - 4}
            </li>
          )}
        </ul>

        {/* Icons */}
        <button aria-label="AI features" className="text-gray-600 text-[18px] cursor-pointer hover:text-gray-800">
          <BsStars />
        </button>
        <button aria-label="Search in chat" className="text-gray-600 text-[16px] cursor-pointer hover:text-gray-800">
          <FiSearch />
        </button>
      </div>
    </header>
  );
}
