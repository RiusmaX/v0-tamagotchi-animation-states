-- Add policy to allow users to view public monsters from all users
-- This policy works alongside the existing "Users can view their own monsters" policy
-- Users can now see:
-- 1. Their own monsters (from existing policy)
-- 2. Public monsters from other users (from this new policy)

CREATE POLICY "Users can view public monsters"
  ON monsters
  FOR SELECT
  USING (is_public = true);
