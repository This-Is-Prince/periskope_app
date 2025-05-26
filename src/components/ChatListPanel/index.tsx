"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { chatService } from "@/lib/database";
import FilterBar from "./FilterBar";
import TagBadge from "@/ui-components/Tags";

interface Props {
  selectedChatId: string;
  setSelectedChatId: (id: string) => void;
}

interface ChatWithDetails {
  id: string;
  name?: string;
  is_group: boolean;
  last_message?: string;
  last_message_at?: string;
  last_message_by?: string;
  chat_participants: Array<{
    user_id: string;
    users: {
      id: string;
      name: string;
      phone: string;
      avatar_url?: string;
    };
  }>;
  chat_tags: Array<{ tag: string }>;
  last_message_by_user?: { name: string };
}

export default function ChatListPanel({ selectedChatId, setSelectedChatId }: Props) {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const userChats = await chatService.getUserChats();
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const getChatDisplayName = (chat: ChatWithDetails) => {
    if (chat.is_group && chat.name) {
      return chat.name;
    }
    
    // For individual chats, show the other participant's name
    const otherParticipant = chat.chat_participants.find(
      p => p.user_id !== user?.id
    );
    
    return otherParticipant?.users.name || otherParticipant?.users.phone || 'Unknown';
  };

  const getChatAvatar = (chat: ChatWithDetails) => {
    if (chat.is_group) {
      return chat.name?.charAt(0).toUpperCase() || 'G';
    }
    
    const otherParticipant = chat.chat_participants.find(
      p => p.user_id !== user?.id
    );
    
    return otherParticipant?.users.name?.charAt(0).toUpperCase() || 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const getContactsDisplay = (chat: ChatWithDetails) => {
    const participants = chat.chat_participants;
    const firstParticipant = participants[0];
    const extraCount = participants.length > 1 ? participants.length - 1 : 0;
    
    return {
      primary: firstParticipant?.users.phone || '',
      extra: extraCount > 0 ? `+${extraCount}` : ''
    };
  };

  if (loading) {
    return (
      <section className="h-full w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chats...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="h-full w-full bg-white flex flex-col text-[10px] font-semibold text-gray-500">
      <FilterBar />
      <div className="h-screen overflow-y-auto" role="list" aria-label="Chat list">
        {chats.map((chat) => {
          const displayName = getChatDisplayName(chat);
          const avatar = getChatAvatar(chat);
          const trimmedMessage = chat.last_message && chat.last_message.length > 30 
            ? `${chat.last_message.slice(0, 30)}...` 
            : chat.last_message || '';
          const formattedDate = formatDate(chat.last_message_at);
          const tags = chat.chat_tags?.map(t => t.tag) || [];
          const visibleTags = tags.slice(0, 2);
          const tagExtra = tags.length > 2 ? `+${tags.length - 2}` : "";
          const contacts = getContactsDisplay(chat);

          return (
            <article
              key={chat.id}
              role="listitem"
              className={`outline-none flex w-full gap-2 items-start px-3 py-2 border-b border-gray-100 hover:bg-[#f5f5f5] ${
                selectedChatId === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <button
                onClick={() => setSelectedChatId(chat.id)}
                className="flex w-full gap-2 items-start cursor-pointer"
                aria-label={`Open chat with ${displayName}`}
                aria-pressed={selectedChatId === chat.id}
              >
                {/* Avatar */}
                <figure className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center text-[11px] font-bold uppercase" aria-hidden="true">
                  {avatar}
                </figure>

                {/* Main Chat Info */}
                <div className="flex-1">
                  <header className="flex justify-between">
                    <h3 className="text-black text-[13px]">{displayName}</h3>
                    <div className="flex items-center gap-1">
                      {visibleTags.map((tag: string, i: number) => (
                        <TagBadge key={i} tag={tag} />
                      ))}
                      {tagExtra && (
                        <span className="text-[9px] text-gray-400">
                          {tagExtra}
                        </span>
                      )}
                    </div>
                  </header>

                  <p className="text-gray-500 text-[12px] truncate">
                    {chat.last_message_by_user?.name && chat.last_message_by_user.name !== displayName
                      ? `${chat.last_message_by_user.name}: ${trimmedMessage}`
                      : trimmedMessage}
                  </p>

                  <footer className="flex justify-between mt-1 text-[11px] text-gray-400">
                    <span className="bg-[#f5f5f5] px-1 py-[0.5px] rounded-md">
                      📞 {contacts.primary}
                      {contacts.extra && <span className="ml-1">{contacts.extra}</span>}
                    </span>
                    <time dateTime={chat.last_message_at}>{formattedDate}</time>
                  </footer>
                </div>
              </button>
            </article>
          );
        })}
        
        {chats.length === 0 && (
          <div className="flex items-center justify-center h-32" role="status">
            <p className="text-gray-500 text-sm">No chats found</p>
          </div>
        )}
      </div>
    </section>
  );
}
