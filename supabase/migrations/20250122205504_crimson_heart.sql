/*
  # SearchAI Database Schema

  1. New Tables
    - `user_profiles`
      - Extends the auth.users table with additional user data
      - Tracks search usage and limits
    - `search_history`
      - Stores user search history and conversations
      - Links to user profiles
    - `search_messages`
      - Stores individual messages within conversations
      - Contains query and response data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  searches_used INT NOT NULL DEFAULT 0,
  search_limit INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create search history table
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create search messages table
CREATE TABLE search_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  history_id UUID NOT NULL REFERENCES search_history(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response JSONB NOT NULL,
  is_follow_up BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own search history"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own search history"
  ON search_history
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own search messages"
  ON search_messages
  FOR SELECT
  TO authenticated
  USING (history_id IN (
    SELECT id FROM search_history WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own search messages"
  ON search_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (history_id IN (
    SELECT id FROM search_history WHERE user_id = auth.uid()
  ));

-- Create function to update user search count
CREATE OR REPLACE FUNCTION increment_user_searches()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET searches_used = searches_used + 1,
      updated_at = now()
  WHERE id = (
    SELECT user_id 
    FROM search_history 
    WHERE id = NEW.history_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search count
CREATE TRIGGER increment_searches_trigger
AFTER INSERT ON search_messages
FOR EACH ROW
EXECUTE FUNCTION increment_user_searches();

-- Create function to check search limits
CREATE OR REPLACE FUNCTION check_search_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT searches_used >= search_limit
    FROM user_profiles
    WHERE id = (
      SELECT user_id 
      FROM search_history 
      WHERE id = NEW.history_id
    )
  ) THEN
    RAISE EXCEPTION 'Search limit exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check limits before insert
CREATE TRIGGER check_search_limit_trigger
BEFORE INSERT ON search_messages
FOR EACH ROW
EXECUTE FUNCTION check_search_limit();