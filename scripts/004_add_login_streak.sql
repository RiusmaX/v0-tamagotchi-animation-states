-- Add login streak columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_streak_reward_date DATE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login_date);
