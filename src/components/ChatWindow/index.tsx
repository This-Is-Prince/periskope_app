'use client'

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { messageService, chatService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
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

  useEffect(() => {
    if (chatId && user) {
      loadChatData();
    }
  }, [chatId, user]);

  useEffect(() => {
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

  const loadChatData = async () => {
    if (!user || !chatId) return;

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
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      <section className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-screen w-full">
      {/* Main Chat Column */}
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <ChatWindowHeader
          chatName={getChatName()}
          participants={getParticipantNames()}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-[url('/bg-img.jpg')] bg-cover bg-center p-4 text-sm font-semibold">
          {messages.map((message) => (
            <div
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
                  <p className="text-xs font-semibold mb-1 text-green-600">
                    {message.sender.name}
                  </p>
                )}
                <p className="break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isMyMessage(message) ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.created_at)}
                </p>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <ChatWindowSidebar />
    </section>
  );
}
