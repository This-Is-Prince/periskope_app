import {
  FaHome,
  FaComments,
  FaChartLine,
  FaList,
  FaBullhorn,
  FaProjectDiagram,
  FaImage,
  FaTasks,
  FaCog,
  FaStar,
} from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import { RiContactsBookFill } from "react-icons/ri";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { TbStarsFilled } from "react-icons/tb";
import Image from "next/image";

export default function Sidebar() {
  return (
    <nav className="flex flex-col justify-between items-center py-2 text-gray-600 bg-white border-r h-screen w-full" aria-label="Main navigation">
      {/* Top Icons */}
      <ul className="flex flex-col items-center space-y-6" role="list">
        <li><Image src="/logo.png" alt="Logo" width={36} height={36} /></li>
        <li><button aria-label="Home" className="hover:text-green-500"><FaHome size={20} /></button></li>
        <li><button aria-label="Chats" className="text-green-600"><FaComments size={20} /></button></li>
        <li><button aria-label="Tickets" className="hover:text-green-500"><IoTicket size={20} /></button></li>
        <li><button aria-label="Analytics" className="hover:text-green-500"><FaChartLine size={20} /></button></li>
        <li><button aria-label="Lists" className="hover:text-green-500"><FaList size={20} /></button></li>
        <li><button aria-label="Campaigns" className="hover:text-green-500"><FaBullhorn size={20} /></button></li>
        <li className="relative">
          <button aria-label="Projects" className="hover:text-green-500">
            <FaProjectDiagram size={20} />
            <FaStar size={10} className="absolute -top-1 -right-1 text-yellow-400" />
          </button>
        </li>
        <li><button aria-label="Contacts" className="hover:text-green-500"><RiContactsBookFill size={20} /></button></li>
        <li><button aria-label="Media" className="hover:text-green-500"><FaImage size={20} /></button></li>
        <li><button aria-label="Tasks" className="hover:text-green-500"><FaTasks size={20} /></button></li>
        <li><button aria-label="Settings" className="hover:text-green-500"><FaCog size={20} /></button></li>
      </ul>

      {/* Bottom Icons - Carefully matched */}
      <ul className="flex flex-col items-center space-y-6 pb-2" role="list">
        <li><button aria-label="AI Features" className="hover:text-green-500"><TbStarsFilled size={20} /></button></li>
        <li><button aria-label="Toggle Sidebar" className="hover:text-green-500"><TbLayoutSidebarLeftExpand size={20} /></button></li>
      </ul>
    </nav>
  );
}
