-- Add last_state_change column to track when the state was last updated
ALTER TABLE monsters ADD COLUMN IF NOT EXISTS last_state_change TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing monsters to have last_state_change set to created_at
UPDATE monsters SET last_state_change = created_at WHERE last_state_change IS NULL;
