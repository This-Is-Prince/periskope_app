import { FaSearch } from "react-icons/fa";
import { HiFolderDownload } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";

export default function FilterBar() {
  return (
    <nav className="flex h-[44px] items-center justify-between px-3 py-2 bg-white border-b border-gray-200 text-[11px] font-semibold text-gray-500" aria-label="Chat filters">
      <div className="flex items-center gap-2 w-full">
        <button className="flex items-center gap-1 text-green-600 cursor-pointer" aria-label="Apply custom filter">
          <HiFolderDownload size={14} />
          <span>Custom filter</span>
        </button>

        <button className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-md hover:text-gray-600 text-gray-500" aria-label="Save filter">
          Save
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded-md hover:text-gray-600 text-gray-500" aria-label="Search chats">
          <FaSearch />
          <span>Search</span>
        </button>

        <button className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded-md text-green-600" aria-label="Clear filter">
          <IoFilter fontWeight={600} />
          <span>Filtered</span>
          <span className="ml-1" aria-hidden="true">✕</span>
        </button>
      </div>
    </nav>
  );
}
