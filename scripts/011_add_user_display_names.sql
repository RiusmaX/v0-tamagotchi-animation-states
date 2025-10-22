-- Add display names for users in the gallery
-- We'll store a username in user_profiles for public display

-- Add username column to user_profiles if it doesn't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create a function to get a safe display name for a user
CREATE OR REPLACE FUNCTION get_user_display_name(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  display_name TEXT;
  user_email TEXT;
BEGIN
  -- Try to get username from user_profiles
  SELECT username INTO display_name
  FROM user_profiles
  WHERE user_id = user_uuid;
  
  -- If no username, try to get email from auth.users
  IF display_name IS NULL THEN
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_uuid;
    
    -- Extract username from email (part before @)
    IF user_email IS NOT NULL THEN
      display_name := split_part(user_email, '@', 1);
    ELSE
      display_name := 'Joueur';
    END IF;
  END IF;
  
  RETURN display_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_display_name(UUID) TO authenticated;
