/*
  # Add subscription and credits support

  1. Updates
    - Add subscription fields to user_profiles
    - Add subscription_tier enum type
    - Add subscription status tracking
    
  2. Changes
    - Add subscription_status to user_profiles
    - Add subscription_tier to user_profiles
    - Add credits to user_profiles
*/

-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro');

-- Add subscription fields to user_profiles
ALTER TABLE user_profiles 
  ADD COLUMN subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  ADD COLUMN subscription_status TEXT,
  ADD COLUMN stripe_customer_id TEXT,
  ADD COLUMN credits INT NOT NULL DEFAULT 0;

-- Create function to check combined search limits
CREATE OR REPLACE FUNCTION check_search_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Get user profile
  WITH user_data AS (
    SELECT 
      subscription_tier,
      searches_used,
      search_limit,
      credits
    FROM user_profiles
    WHERE id = (
      SELECT user_id 
      FROM search_history 
      WHERE id = NEW.history_id
    )
  )
  -- Check if user can perform search
  SELECT
    CASE
      -- Pro users have unlimited searches
      WHEN subscription_tier = 'pro' THEN TRUE
      -- Free users need available monthly searches or credits
      WHEN searches_used < search_limit OR credits > 0 THEN TRUE
      ELSE FALSE
    END
  INTO STRICT exists
  FROM user_data;

  IF NOT exists THEN
    RAISE EXCEPTION 'No searches available. Please upgrade to Pro or purchase more credits.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace existing trigger with new one
DROP TRIGGER IF EXISTS check_search_limit_trigger ON search_messages;
CREATE TRIGGER check_search_availability_trigger
  BEFORE INSERT ON search_messages
  FOR EACH ROW
  EXECUTE FUNCTION check_search_availability();

-- Update search count function to handle credits
CREATE OR REPLACE FUNCTION increment_user_searches()
RETURNS TRIGGER AS $$
BEGIN
  WITH user_data AS (
    SELECT 
      id,
      subscription_tier,
      searches_used,
      search_limit,
      credits
    FROM user_profiles
    WHERE id = (
      SELECT user_id 
      FROM search_history 
      WHERE id = NEW.history_id
    )
  )
  UPDATE user_profiles
  SET 
    searches_used = 
      CASE 
        -- Pro users don't consume credits
        WHEN subscription_tier = 'pro' THEN searches_used + 1
        -- Free users use credits after monthly limit
        WHEN searches_used >= search_limit AND credits > 0 THEN searches_used
        ELSE searches_used + 1
      END,
    credits = 
      CASE
        -- Only deduct credit if monthly limit exceeded and credits available
        WHEN subscription_tier = 'free' AND searches_used >= search_limit AND credits > 0 
        THEN credits - 1
        ELSE credits
      END,
    updated_at = now()
  WHERE id = (SELECT id FROM user_data);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;