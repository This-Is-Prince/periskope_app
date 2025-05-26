'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { messageService, chatService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import ChatWindowFooter from "./ChatWindowFooter";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowSidebar from "./ChatWindowSidebar";

interface Props {
  chatId: string;
}

interface MessageWithSender {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    id: string;
    name: string;
    phone: string;
    avatar_url?: string;
  };
}

interface ChatDetails {
  id: string;
  name?: string;
  is_group: boolean;
  chat_participants: Array<{
    users: {
      id: string;
      name: string;
      phone: string;
    };
  }>;
}

export default function ChatWindow({ chatId }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadChatData = useCallback(async () => {
    if (!user?.id || !chatId) return;

    try {
      setLoading(true);
      
      // Load messages
      const chatMessages = await messageService.getChatMessages(chatId);
      setMessages(chatMessages);

      // Load chat details
      const participants = await chatService.getChatParticipants(chatId);
      if (participants.length > 0) {
        // Get chat info from the first participant's chat data
        const { data: chat } = await supabase
          .from('chats')
          .select('*')
          .eq('id', chatId)
          .single();

        if (chat) {
          setChatDetails({
            ...chat,
            chat_participants: participants
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId, user?.id]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);

  useEffect(() => {
    if (!messages.length) return;
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    // Subscribe to new messages
    const subscription = messageService.subscribeToMessages(chatId, (newMessage) => {
      setMessages(prev => [...prev, newMessage as MessageWithSender]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  // Show placeholder if no chat is selected
  if (!chatId) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-[#ece5dd]">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">Select a chat to start messaging</p>
          <p className="text-gray-400 text-sm">Choose a conversation from the list</p>
        </div>
      </main>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !chatId || sending) return;

    setSending(true);
    try {
      const message = await messageService.sendMessage(chatId, user.id, newMessage.trim());
      if (message) {
        // Message will be added via real-time subscription
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getChatName = () => {
    if (!chatDetails) return 'Loading...';
    
    if (chatDetails.is_group && chatDetails.name) {
      return chatDetails.name;
    }
    
    // For individual chats, show the other participant's name
    const otherParticipant = chatDetails.chat_participants.find(
      p => p.users.id !== user?.id
    );
    
    return otherParticipant?.users.name || otherParticipant?.users.phone || 'Unknown';
  };

  const getParticipantNames = () => {
    if (!chatDetails) return [];
    
    return chatDetails.chat_participants.map(p => p.users.name);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isMyMessage = (message: MessageWithSender) => {
    return message.sender_id === user?.id;
  };

  if (loading) {
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full">
      {/* Main Chat Column */}
      <section className="relative flex flex-col flex-1">
        {/* Header */}
        <ChatWindowHeader
          chatName={getChatName()}
          participants={getParticipantNames()}
        />

        {/* Messages Area */}
        <section className="flex-1 overflow-y-auto bg-[url('/bg-img.jpg')] bg-cover bg-center p-4 text-sm font-semibold" role="log" aria-label="Chat messages" aria-live="polite">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`mb-4 flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                  isMyMessage(message)
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {!isMyMessage(message) && chatDetails?.is_group && (
                  <header className="text-xs font-semibold mb-1 text-green-600">
                    {message.sender.name}
                  </header>
                )}
                <p className="break-words">{message.content}</p>
                <footer className={`text-xs mt-1 ${
                  isMyMessage(message) ? 'text-green-100' : 'text-gray-500'
                }`}>
                  <time dateTime={message.created_at}>{formatMessageTime(message.created_at)}</time>
                </footer>
              </div>
            </article>
          ))}
          
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full" role="status">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </section>

        {/* Footer */}
        <ChatWindowFooter
          disabled={sending}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      </section>

      {/* Right Sidebar */}
      <ChatWindowSidebar />
    </main>
  );
}
