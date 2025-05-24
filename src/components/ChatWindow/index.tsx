import ChatWindowFooter from "./ChatWindowFooter";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowSidebar from "./ChatWindowSidebar";

interface Props {
  chatId: string;
}

export default function ChatWindow({ chatId }: Props) {
  return (
    <section className="flex h-screen w-full">
      {/* Main Chat Column */}
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <ChatWindowHeader
          chatName="Test El Centro"
          participants={[
            "Roshnaq Airtel",
            "Roshnaq Jio",
            "Bharat Kumar Ramesh",
            "Periskope",
          ]}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-[url('/bg-img.jpg')] bg-cover bg-center p-4 text-sm font-semibold">
          <div className="bg-white text-gray-700 rounded-md shadow p-3 w-max">
            Message from chat {chatId}
          </div>
        </div>

        {/* Footer */}
        <ChatWindowFooter />
      </div>

      {/* Right Sidebar */}
      <ChatWindowSidebar />
    </section>
  );
}
