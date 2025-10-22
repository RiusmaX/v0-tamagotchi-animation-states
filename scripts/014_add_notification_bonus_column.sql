-- Add notification_bonus_claimed column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS notification_bonus_claimed BOOLEAN DEFAULT FALSE;
