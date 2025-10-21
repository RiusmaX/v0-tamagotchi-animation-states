-- Add columns to track owned accessories for each monster
ALTER TABLE monsters
ADD COLUMN IF NOT EXISTS owned_hats text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS owned_glasses text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS owned_shoes text[] DEFAULT '{}';

-- Add comment to explain the columns
COMMENT ON COLUMN monsters.owned_hats IS 'Array of hat accessory IDs that the monster owns';
COMMENT ON COLUMN monsters.owned_glasses IS 'Array of glasses accessory IDs that the monster owns';
COMMENT ON COLUMN monsters.owned_shoes IS 'Array of shoes accessory IDs that the monster owns';
