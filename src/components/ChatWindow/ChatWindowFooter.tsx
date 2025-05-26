"use client";

import {
  FiPaperclip,
  FiSmile,
  FiClock,
  FiMic,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import Image from "next/image";

interface Props {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  disabled: boolean;
}

export default function ChatWindowFooter({ newMessage, setNewMessage, onSendMessage, disabled }: Props) {
  return (
    <footer className="absolute bottom-10 w-full pl-3 pr-5 py-2 bg-white border-t border-gray-200">
      <form onSubmit={(e) => { e.preventDefault(); onSendMessage(); }} className="flex items-center gap-x-2 justify-between mb-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder="Message..."
          className="flex-1 px-4 py-2 mr-2 rounded-full bg-gray-100 text-gray-800 text-sm outline-none"
          disabled={disabled}
          aria-label="Type a message"
        />
        <button
          type="submit"
          disabled={!newMessage?.trim() || disabled}
          className="border-none outline-none flex items-center justify-center cursor-pointer"
          aria-label="Send message"
        >
          <IoSend className="text-green-600 text-xl" />
        </button>
      </form>

      {/* Row 2: Action icons */}
      <nav className="flex items-center justify-between" aria-label="Message actions">
        <div className="flex items-center gap-x-[22px] px-2">
          <button type="button" aria-label="Attach file" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <FiPaperclip />
          </button>
          <button type="button" aria-label="Add emoji" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <FiSmile />
          </button>
          <button type="button" aria-label="Schedule message" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <FiClock />
          </button>
          <button type="button" aria-label="Message history" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <PiClockCounterClockwiseBold />
          </button>
          <button type="button" aria-label="AI assistant" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <BsStars />
          </button>
          <button type="button" aria-label="More options" className="text-gray-500 text-lg cursor-pointer hover:text-gray-700">
            <HiOutlineMenuAlt2 />
          </button>
          <button type="button" aria-label="Voice message" className="text-gray-400 text-lg cursor-pointer font-semibold hover:text-gray-600">
            <FiMic />
          </button>
        </div>
        <div className="border rounded-[4px] px-2 py-1 flex items-center gap-5 text-xs font-semibold text-green-600">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="Logo" width={16} height={16} />
            Periskope
          </div>
          <span className="text-xs text-gray-400 ml-1" aria-hidden="true">▾</span>
        </div>
      </nav>
    </footer>
  );
}
