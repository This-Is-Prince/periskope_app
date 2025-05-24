"use client";

import {
  FiRefreshCw,
  FiEdit3,
  FiAlignJustify,
  FiUsers,
  FiAtSign,
  FiImage,
} from "react-icons/fi";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { PiMagicWandLight } from "react-icons/pi";
import { TbCategory2 } from "react-icons/tb";
import { BiLogOutCircle } from "react-icons/bi";

const icons = [
  BiLogOutCircle,
  FiRefreshCw,
  FiEdit3,
  FiAlignJustify,
  TbCategory2,
  PiMagicWandLight,
  FiUsers,
  FiAtSign,
  FiImage,
  HiMiniBars3BottomLeft,
];

export default function ChatWindowSidebar() {
  return (
    <div className="w-[40px] h-full bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-6 text-gray-400 text-lg">
      {icons.map((Icon, index) => (
        <Icon key={index} className="cursor-pointer hover:text-black" />
      ))}
    </div>
  );
}
