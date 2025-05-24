import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import "../globals.css";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[60px] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader />

        {/* Content below header */}
        <div className="flex flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
