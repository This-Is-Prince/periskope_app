"use client";

import {
  FaComments,
  FaList,
} from "react-icons/fa";
import { TbRefreshDot } from "react-icons/tb";
import { GoDesktopDownload } from "react-icons/go";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { PiBellSlashFill } from "react-icons/pi";

const headerButtons = [
    { icon: <TbRefreshDot />, label: "Refresh" },
    { icon: <HiOutlineQuestionMarkCircle />, label: "Help" },
    {
      icon: <div className="w-2 h-2 bg-yellow-400 rounded-full" />,
      label: "5 / 6 phones",
      dropdown: true,
    },
    {
      icon: (
        <div className="flex items-center justify-center w-5 h-5">
          <GoDesktopDownload />
        </div>
      ),
      label: "",
    },
    {
      icon: (
        <div className="flex items-center justify-center w-5 h-5">
          <PiBellSlashFill className="text-gray-500"/>
        </div>
      ),
      label: "",
    },
    {
      icon: (
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">✦</span>
          <FaList className="text-gray-400" />
        </div>
      ),
      label: "",
    },
  ];
  

export default function ChatHeader() {
  return (
    <div className="h-[52px] py-1.5 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-500 font-semibold text-base">
        <FaComments />
        <span>chats</span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {headerButtons.map(({ icon, label, dropdown }, i) => (
          <button
            key={i}
            className="flex items-center text-[12px] font-semibold gap-1 px-3 py-1 bg-white border border-gray-300 rounded-[4px] text-gray-500 hover:text-black"
          >
            {icon}
            {label && <span>{label}</span>}
            {dropdown && <span className="text-xs">▾</span>}
          </button>
        ))}

      </div>
    </div>
  );
}
