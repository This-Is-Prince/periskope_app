export type ChatItem = {
    id: string;
    author: string | number;
    message: string;
    tags: string[];
    date: Date;
    contacts: number[];
    profileImage: string;
    messageStatus: "sent" | "delivered" | "seen" | "deleted" | "failed" | "unseen";
    lastMessageBy: string;
};

export type User = {
  id: string;
  phone: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Chat = {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  last_message_by?: string;
};

export type ChatParticipant = {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
  role: 'admin' | 'member';
};

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'file';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type ChatTag = {
  id: string;
  chat_id: string;
  tag: string;
  created_at: string;
};
  