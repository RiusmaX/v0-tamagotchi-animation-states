-- Add background columns to monsters table
ALTER TABLE monsters
ADD COLUMN IF NOT EXISTS current_background TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS owned_backgrounds TEXT[] DEFAULT ARRAY['default']::TEXT[];

-- Update existing monsters to have the default background
UPDATE monsters
SET current_background = 'default',
    owned_backgrounds = ARRAY['default']::TEXT[]
WHERE current_background IS NULL OR owned_backgrounds IS NULL;
