-- Create function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count(monster_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE monsters
  SET like_count = like_count + 1
  WHERE id = monster_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like_count(monster_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE monsters
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = monster_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
