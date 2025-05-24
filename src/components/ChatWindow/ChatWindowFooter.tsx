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

export default function ChatWindowFooter() {
  return (
    <div className="absolute bottom-10 w-full pl-3 pr-5 py-2 bg-white border-t border-gray-200 ">
      <div className="flex items-center gap-x-2 justify-between mb-2">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 px-4 py-2 mr-2 rounded-full bg-gray-100 text-gray-800 text-sm outline-none"
        />
          <IoSend className="text-green-600 text-xl cursor-pointer" />
      
      </div>

      {/* Row 2: Action icons */}
      <div className="flex items-center justify-between  ">
        <div className="flex items-center gap-x-[22px] px-2">
        <FiPaperclip className="text-gray-500 text-lg cursor-pointer" />
        <FiSmile className="text-gray-500 text-lg cursor-pointer" />
        <FiClock className="text-gray-500 text-lg cursor-pointer" />
        <PiClockCounterClockwiseBold className="text-gray-500 text-lg cursor-pointer" />
        <BsStars className="text-gray-500 text-lg cursor-pointer" />
        <HiOutlineMenuAlt2 className="text-gray-500 text-lg cursor-pointer" />
        <FiMic className="text-gray-400 text-lg cursor-pointer font-semibold" />
      </div>
          <div className="border rounded-[4px] px-2 py-1 flex items-center gap-5 text-xs font-semibold text-green-600">
            <div className="flex items-center gap-1">

            <Image src="/logo.png" alt="Logo" width={16} height={16} />
            Periskope
            </div>
            <span className="text-xs text-gray-400 ml-1">▾</span>
          </div>
        </div>
    </div>
  );
}
