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
      <div className="flex flex-col justify-between items-center py-2 text-gray-600 bg-white border-r h-screen w-full">
        {/* Top Icons */}
        <div className="flex flex-col items-center space-y-6">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />
          <FaHome size={20} className="hover:text-green-500" />
          <FaComments size={20} className="text-green-600" />
          <IoTicket size={20} className="hover:text-green-500" />
          <FaChartLine size={20} className="hover:text-green-500" />
          <FaList size={20} className="hover:text-green-500" />
          <FaBullhorn size={20} className="hover:text-green-500" />
          <div className="relative">
            <FaProjectDiagram size={20} className="hover:text-green-500" />
            <FaStar size={10} className="absolute -top-1 -right-1 text-yellow-400" />
          </div>
          <RiContactsBookFill size={20} className="hover:text-green-500" />
          <FaImage size={20} className="hover:text-green-500" />
          <FaTasks size={20} className="hover:text-green-500" />
          <FaCog size={20} className="hover:text-green-500" />
        </div>
  
        {/* Bottom Icons - Carefully matched */}
        <div className="flex flex-col items-center space-y-6 pb-2">
          <TbStarsFilled size={20} className="hover:text-green-500" />
          <TbLayoutSidebarLeftExpand size={20} className="hover:text-green-500" />
        </div>
      </div>
    );
  }
  