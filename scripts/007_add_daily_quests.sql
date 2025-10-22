-- Create daily_quests table to track user quests
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_type TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  current_count INTEGER DEFAULT 0,
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_type, quest_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_quests_user_date ON daily_quests(user_id, quest_date);
CREATE INDEX IF NOT EXISTS idx_daily_quests_completed ON daily_quests(user_id, completed, claimed);

-- Enable RLS
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quests"
  ON daily_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
  ON daily_quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
  ON daily_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
