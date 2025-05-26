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
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for chats table
CREATE POLICY "Users can view chats they created or participate in" ON chats FOR SELECT USING (
  auth.uid()::text = created_by::text OR
  id IN (
    SELECT chat_id FROM chat_participants WHERE user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Chat creators can update chats" ON chats FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Create security definer function to check chat membership
CREATE OR REPLACE FUNCTION is_chat_member(check_chat_id UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM chat_participants 
    WHERE chat_id = check_chat_id 
    AND user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for chat_participants table
CREATE POLICY "Users can view participants of their chats" ON chat_participants FOR SELECT 
USING (
  is_chat_member(chat_id, auth.uid()::uuid)
);

CREATE POLICY "Users can join chats or admins can add members" ON chat_participants FOR INSERT WITH CHECK (
  user_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM chat_participants admin_check 
    WHERE admin_check.chat_id = chat_participants.chat_id 
    AND admin_check.user_id::text = auth.uid()::text 
    AND admin_check.role = 'admin'
  )
);

CREATE POLICY "Users can update their own participation or admins can manage members" ON chat_participants FOR UPDATE USING (
  user_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM chat_participants admin_check 
    WHERE admin_check.chat_id = chat_participants.chat_id 
    AND admin_check.user_id::text = auth.uid()::text 
    AND admin_check.role = 'admin'
  )
);

CREATE POLICY "Users can leave chats or admins can remove members" ON chat_participants FOR DELETE USING (
  user_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM chat_participants admin_check 
    WHERE admin_check.chat_id = chat_participants.chat_id 
    AND admin_check.user_id::text = auth.uid()::text 
    AND admin_check.role = 'admin'
  )
);

-- Create policies for messages table
CREATE POLICY "Users can view messages in their chats" ON messages FOR SELECT USING (
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can send messages to their chats" ON messages FOR INSERT WITH CHECK (
  auth.uid()::text = sender_id::text AND
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (auth.uid()::text = sender_id::text);

-- Create policies for chat_tags table
CREATE POLICY "Users can view tags of their chats" ON chat_tags FOR SELECT USING (
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Only admins can add tags" ON chat_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chat_tags.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text 
    AND chat_participants.role = 'admin'
  )
);

CREATE POLICY "Only admins can update tags" ON chat_tags FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chat_tags.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text 
    AND chat_participants.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete tags" ON chat_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chat_tags.chat_id 
    AND chat_participants.user_id::text = auth.uid()::text 
    AND chat_participants.role = 'admin'
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

-- Insert test chats (both individual and group)
-- Note: Only insert if users exist
INSERT INTO chats (id, name, is_group, created_by) 
SELECT v.id::uuid, v.name, v.is_group, v.created_by::uuid FROM (VALUES 
  ('11111111-1111-1111-1111-111111111111', NULL, FALSE, 'a74a4b80-9ea1-49f0-a813-b9eb232180b5'),
  ('22222222-2222-2222-2222-222222222222', 'Periskope Team Chat', TRUE, '4034fd51-c282-4638-90fa-15c65bd70935'),
  ('33333333-3333-3333-3333-333333333333', NULL, FALSE, '4034fd51-c282-4638-90fa-15c65bd70935'),
  ('44444444-4444-4444-4444-444444444444', 'Demo Campaign', TRUE, '8e061a1a-c790-4e9b-b6e2-661f4e700512'),
  ('55555555-5555-5555-5555-555555555555', NULL, FALSE, 'a59d0053-29dd-4c18-9508-2445afd6705e')
) AS v(id, name, is_group, created_by)
WHERE EXISTS (SELECT 1 FROM users WHERE users.id = v.created_by::uuid)
ON CONFLICT (id) DO NOTHING;

-- Insert chat participants
-- Note: Only insert if both chat and user exist
INSERT INTO chat_participants (chat_id, user_id, role) 
SELECT v.chat_id::uuid, v.user_id::uuid, v.role FROM (VALUES 
  -- Individual chat 1 (Test User 1 & Test User 2)
  ('11111111-1111-1111-1111-111111111111', 'a74a4b80-9ea1-49f0-a813-b9eb232180b5', 'member'),
  ('11111111-1111-1111-1111-111111111111', '911609a1-f6fb-404c-98b2-a19f9ace6a47', 'member'),

  -- Group chat - Periskope Team (Swapnika as admin)
  ('22222222-2222-2222-2222-222222222222', '4034fd51-c282-4638-90fa-15c65bd70935', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'a74a4b80-9ea1-49f0-a813-b9eb232180b5', 'member'),
  ('22222222-2222-2222-2222-222222222222', '911609a1-f6fb-404c-98b2-a19f9ace6a47', 'member'),
  ('22222222-2222-2222-2222-222222222222', '26dc640c-a1c6-4dea-85f2-080ba5f32d78', 'member'),

  -- Individual chat 2 (Swapnika & Test User 2)
  ('33333333-3333-3333-3333-333333333333', '4034fd51-c282-4638-90fa-15c65bd70935', 'member'),
  ('33333333-3333-3333-3333-333333333333', '911609a1-f6fb-404c-98b2-a19f9ace6a47', 'member'),

  -- Group chat - Demo Campaign (Prakash as admin)
  ('44444444-4444-4444-4444-444444444444', '8e061a1a-c790-4e9b-b6e2-661f4e700512', 'admin'),
  ('44444444-4444-4444-4444-444444444444', 'af5c9dfb-9649-4069-9ee3-1fa3b4232283', 'member'),
  ('44444444-4444-4444-4444-444444444444', '26dc640c-a1c6-4dea-85f2-080ba5f32d78', 'member'),
  ('44444444-4444-4444-4444-444444444444', '911609a1-f6fb-404c-98b2-a19f9ace6a47', 'member'),

  -- Individual chat 3 (El Centro & Test User 1)
  ('55555555-5555-5555-5555-555555555555', 'a59d0053-29dd-4c18-9508-2445afd6705e', 'member'),
  ('55555555-5555-5555-5555-555555555555', 'a74a4b80-9ea1-49f0-a813-b9eb232180b5', 'member')
) AS v(chat_id, user_id, role)
WHERE EXISTS (SELECT 1 FROM chats WHERE chats.id = v.chat_id::uuid)
  AND EXISTS (SELECT 1 FROM users WHERE users.id = v.user_id::uuid)
ON CONFLICT (chat_id, user_id) DO NOTHING;

-- Insert some test messages
-- Note: Only insert if both chat and sender exist
INSERT INTO messages (chat_id, sender_id, content) 
SELECT v.chat_id::uuid, v.sender_id::uuid, v.content FROM (VALUES 
  ('11111111-1111-1111-1111-111111111111', '911609a1-f6fb-404c-98b2-a19f9ace6a47', 'Support2: This doesn''t go on Tuesday...'),
  ('22222222-2222-2222-2222-222222222222', '4034fd51-c282-4638-90fa-15c65bd70935', 'Periskope: Test message'),
  ('33333333-3333-3333-3333-333333333333', '4034fd51-c282-4638-90fa-15c65bd70935', 'Hi there, I''m Swapnika...'),
  ('44444444-4444-4444-4444-444444444444', '8e061a1a-c790-4e9b-b6e2-661f4e700512', 'We''ve created a new segment for email marketing.'),
  ('55555555-5555-5555-5555-555555555555', 'a59d0053-29dd-4c18-9508-2445afd6705e', 'Test message from El Centro team.')
) AS v(chat_id, sender_id, content)
WHERE EXISTS (SELECT 1 FROM chats WHERE chats.id = v.chat_id::uuid)
  AND EXISTS (SELECT 1 FROM users WHERE users.id = v.sender_id::uuid);

-- Insert chat tags
-- Note: Only insert if chat exists
INSERT INTO chat_tags (chat_id, tag) 
SELECT v.chat_id::uuid, v.tag FROM (VALUES 
  ('11111111-1111-1111-1111-111111111111', 'demo'),
  ('11111111-1111-1111-1111-111111111111', 'dont send'),
  ('22222222-2222-2222-2222-222222222222', 'demo'),
  ('22222222-2222-2222-2222-222222222222', 'internal'),
  ('33333333-3333-3333-3333-333333333333', 'signup'),
  ('33333333-3333-3333-3333-333333333333', 'dont send'),
  ('44444444-4444-4444-4444-444444444444', 'marketing'),
  ('44444444-4444-4444-4444-444444444444', 'demo'),
  ('44444444-4444-4444-4444-444444444444', 'content'),
  ('55555555-5555-5555-5555-555555555555', 'test'),
  ('55555555-5555-5555-5555-555555555555', 'demo'),
  ('55555555-5555-5555-5555-555555555555', 'dont send')
) AS v(chat_id, tag)
WHERE EXISTS (SELECT 1 FROM chats WHERE chats.id = v.chat_id::uuid); 