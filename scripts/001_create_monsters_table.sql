-- Create monsters table
CREATE TABLE IF NOT EXISTS monsters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  traits JSONB NOT NULL,
  current_state TEXT NOT NULL DEFAULT 'happy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS monsters_user_id_idx ON monsters(user_id);

-- Enable Row Level Security
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own monsters
CREATE POLICY "Users can view their own monsters"
  ON monsters
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own monsters
CREATE POLICY "Users can create their own monsters"
  ON monsters
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own monsters
CREATE POLICY "Users can update their own monsters"
  ON monsters
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own monsters
CREATE POLICY "Users can delete their own monsters"
  ON monsters
  FOR DELETE
  USING (auth.uid() = user_id);
