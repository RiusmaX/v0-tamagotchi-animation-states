-- Add is_public column to monsters table to allow users to share their monsters
ALTER TABLE monsters ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add like_count column to monsters table for performance optimization
ALTER TABLE monsters ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create monster_likes table to track which users liked which monsters
CREATE TABLE IF NOT EXISTS monster_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monster_id UUID NOT NULL REFERENCES monsters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, monster_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_monster_likes_user_id ON monster_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_monster_likes_monster_id ON monster_likes(monster_id);
CREATE INDEX IF NOT EXISTS idx_monsters_is_public ON monsters(is_public);

-- Enable RLS on monster_likes
ALTER TABLE monster_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all likes
CREATE POLICY "Users can view all likes" ON monster_likes
  FOR SELECT USING (true);

-- Policy: Users can insert their own likes
CREATE POLICY "Users can insert their own likes" ON monster_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON monster_likes
  FOR DELETE USING (auth.uid() = user_id);
