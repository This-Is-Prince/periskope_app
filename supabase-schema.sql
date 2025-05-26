-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100),
  is_group BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_by UUID REFERENCES users(id)
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  UNIQUE(chat_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create chat_tags table
CREATE TABLE IF NOT EXISTS chat_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for chats table
CREATE POLICY "Users can view chats they participate in" ON chats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chats.id 
    AND chat_participants.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Chat creators can update chats" ON chats FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Create policies for chat_participants table
CREATE POLICY "Users can view participants of chats they're in" ON chat_participants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_participants cp2 
    WHERE cp2.chat_id = chat_participants.chat_id 
    AND cp2.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Chat admins can manage participants" ON chat_participants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chat_participants cp 
    WHERE cp.chat_id = chat_participants.chat_id 
    AND cp.user_id::text = auth.uid()::text 
    AND cp.role = 'admin'
  )
);

-- Create policies for messages table
CREATE POLICY "Users can view messages in chats they participate in" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = messages.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can send messages to chats they participate in" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = messages.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text
  ) AND auth.uid()::text = sender_id::text
);

CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (auth.uid()::text = sender_id::text);

-- Create policies for chat_tags table
CREATE POLICY "Users can view tags of chats they participate in" ON chat_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chat_tags.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Chat admins can manage tags" ON chat_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chat_tags.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text 
    AND role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_tags_chat_id ON chat_tags(chat_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat's last message info
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET 
        last_message = NEW.content,
        last_message_at = NEW.created_at,
        last_message_by = NEW.sender_id,
        updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating last message
CREATE TRIGGER update_chat_last_message_trigger 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_chat_last_message();

-- Insert test users
INSERT INTO users (id, phone, name) VALUES 
('11111111-1111-1111-1111-111111111111', '18005550123', 'Test User 1'),
('22222222-2222-2222-2222-222222222222', '18005550124', 'Test User 2'),
('33333333-3333-3333-3333-333333333333', '18005550125', 'Test User 3'),
('44444444-4444-4444-4444-444444444444', '18005550126', 'Test User 4'),
('55555555-5555-5555-5555-555555555555', '18005550127', 'Test User 5'),
('66666666-6666-6666-6666-666666666666', '18005550128', 'Swapnika'),
('77777777-7777-7777-7777-777777777777', '18005550129', 'Prakash'),
('88888888-8888-8888-8888-888888888888', '18005550130', 'El Centro'),
('99999999-9999-9999-9999-999999999999', '18005550131', 'Aditya'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '18005550132', 'Vaibhav')
ON CONFLICT (phone) DO NOTHING;

-- Insert test chats (both individual and group)
INSERT INTO chats (id, name, is_group, created_by) VALUES 
('chat1111-1111-1111-1111-111111111111', NULL, FALSE, '11111111-1111-1111-1111-111111111111'),
('chat2222-2222-2222-2222-222222222222', 'Periskope Team Chat', TRUE, '66666666-6666-6666-6666-666666666666'),
('chat3333-3333-3333-3333-333333333333', NULL, FALSE, '66666666-6666-6666-6666-666666666666'),
('chat4444-4444-4444-4444-444444444444', 'Demo Campaign', TRUE, '77777777-7777-7777-7777-777777777777'),
('chat5555-5555-5555-5555-555555555555', NULL, FALSE, '88888888-8888-8888-8888-888888888888')
ON CONFLICT (id) DO NOTHING;

-- Insert chat participants
INSERT INTO chat_participants (chat_id, user_id, role) VALUES 
-- Individual chat 1
('chat1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'member'),
('chat1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'member'),

-- Group chat - Periskope Team
('chat2222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'admin'),
('chat2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'member'),
('chat2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'member'),
('chat2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'member'),

-- Individual chat 2
('chat3333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'member'),
('chat3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'member'),

-- Group chat - Demo Campaign
('chat4444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'admin'),
('chat4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'member'),
('chat4444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'member'),
('chat4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'member'),

-- Individual chat 3
('chat5555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'member'),
('chat5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'member')
ON CONFLICT (chat_id, user_id) DO NOTHING;

-- Insert some test messages
INSERT INTO messages (chat_id, sender_id, content) VALUES 
('chat1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Support2: This doesn''t go on Tuesday...'),
('chat2222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Periskope: Test message'),
('chat3333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Hi there, I''m Swapnika...'),
('chat4444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'We''ve created a new segment for email marketing.'),
('chat5555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'Test message from El Centro team.');

-- Insert chat tags
INSERT INTO chat_tags (chat_id, tag) VALUES 
('chat1111-1111-1111-1111-111111111111', 'demo'),
('chat1111-1111-1111-1111-111111111111', 'dont send'),
('chat2222-2222-2222-2222-222222222222', 'demo'),
('chat2222-2222-2222-2222-222222222222', 'internal'),
('chat3333-3333-3333-3333-333333333333', 'signup'),
('chat3333-3333-3333-3333-333333333333', 'dont send'),
('chat4444-4444-4444-4444-444444444444', 'marketing'),
('chat4444-4444-4444-4444-444444444444', 'demo'),
('chat4444-4444-4444-4444-444444444444', 'content'),
('chat5555-5555-5555-5555-555555555555', 'test'),
('chat5555-5555-5555-5555-555555555555', 'demo'),
('chat5555-5555-5555-5555-555555555555', 'dont send'); 