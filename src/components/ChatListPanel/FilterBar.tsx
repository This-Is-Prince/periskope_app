import { FaSearch } from "react-icons/fa";
import { HiFolderDownload } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";

export default function FilterBar() {
  return (
    <div className="flex h-[44px] items-center justify-between px-3 py-2 bg-white border-b border-gray-200 text-[11px] font-semibold text-gray-500">
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1 text-green-600 cursor-pointer">
          <HiFolderDownload size={14} />
          <span>Custom filter</span>
        </div>

        <button className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-md hover:text-gray-600 text-gray-500">
          Save
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded-md hover:text-gray-600 text-gray-500">
          <FaSearch />
          <span>Search</span>
        </button>

        <button className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded-md text-green-600 ">
          <IoFilter fontWeight={600} />
          <span>Filtered</span>
          <span className="ml-1">✕</span>
        </button>
      </div>
    </div>
  );
}
