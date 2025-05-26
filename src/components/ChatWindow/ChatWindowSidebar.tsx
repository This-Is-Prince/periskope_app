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

const sidebarActions = [
  { Icon: BiLogOutCircle, label: "Sign out" },
  { Icon: FiRefreshCw, label: "Refresh" },
  { Icon: FiEdit3, label: "Edit" },
  { Icon: FiAlignJustify, label: "Align" },
  { Icon: TbCategory2, label: "Categories" },
  { Icon: PiMagicWandLight, label: "Magic tools" },
  { Icon: FiUsers, label: "Participants" },
  { Icon: FiAtSign, label: "Mentions" },
  { Icon: FiImage, label: "Media" },
  { Icon: HiMiniBars3BottomLeft, label: "More options" },
];

export default function ChatWindowSidebar() {
  return (
    <aside className="w-[40px] h-full bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-6 text-gray-400 text-lg" aria-label="Chat actions">
      <nav>
        <ul className="flex flex-col items-center gap-6" role="list">
          {sidebarActions.map(({ Icon, label }, index) => (
            <li key={index}>
              <button 
                className="cursor-pointer hover:text-black transition-colors" 
                aria-label={label}
                title={label}
              >
                <Icon />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
