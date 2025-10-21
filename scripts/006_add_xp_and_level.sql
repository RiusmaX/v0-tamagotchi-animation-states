-- Add XP and level columns to monsters table
ALTER TABLE monsters
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_monsters_level ON monsters(level);

-- Update existing monsters to have default values
UPDATE monsters
SET level = 1, xp = 0, total_xp = 0
WHERE level IS NULL OR xp IS NULL OR total_xp IS NULL;
