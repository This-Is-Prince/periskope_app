import { supabase } from './supabase'

export const chatService = {
  // Get all chats for the current user
  async getUserChats(userId: string) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        chat_participants!inner(user_id, role),
        chat_tags(tag),
        last_message_by_user:users!chats_last_message_by_fkey(name)
      `)
      .eq('chat_participants.user_id', userId)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('Error fetching chats:', error)
      return []
    }

    return data || []
  },

  // Get chat participants with user details
  async getChatParticipants(chatId: string) {
    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        *,
        users(id, name, phone, avatar_url)
      `)
      .eq('chat_id', chatId)

    if (error) {
      console.error('Error fetching chat participants:', error)
      return []
    }

    return data || []
  },

  // Get chat tags
  async getChatTags(chatId: string) {
    const { data, error } = await supabase
      .from('chat_tags')
      .select('tag')
      .eq('chat_id', chatId)

    if (error) {
      console.error('Error fetching chat tags:', error)
      return []
    }

    return data?.map(t => t.tag) || []
  }
}

export const messageService = {
  // Get messages for a chat
  async getChatMessages(chatId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, phone, avatar_url)
      `)
      .eq('chat_id', chatId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data || []
  },

  // Send a message
  async sendMessage(chatId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content: content,
        message_type: 'text'
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, phone, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return null
    }

    return data
  },

  // Subscribe to new messages in a chat
  subscribeToMessages(chatId: string, callback: (message: unknown) => void) {
    return supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          // Fetch the complete message with sender details
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(id, name, phone, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            callback(data)
          }
        }
      )
      .subscribe()
  }
}

export const userService = {
  // Get user by ID
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  },

  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data || []
  }
} 