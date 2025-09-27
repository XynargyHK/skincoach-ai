-- Update quiz_responses table for simplified Basic Assessment
-- This migration will restructure the table to match the 5 essential fields

-- First, let's see what the current table looks like
-- Current table likely has many fields from the old comprehensive quiz

-- Create a new simplified quiz_responses table structure
DROP TABLE IF EXISTS quiz_responses_new;

CREATE TABLE quiz_responses_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Assessment Fields (5 essential fields)
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  age_group TEXT NOT NULL CHECK (age_group IN ('<20', '21-40', '40+')),
  skin_type TEXT NOT NULL CHECK (skin_type IN ('Dry', 'Normal', 'Combination', 'Oily')),
  primary_concern TEXT[] NOT NULL, -- Array for multiple selections
  spending_budget TEXT NOT NULL, -- Store as text to handle $20-$200+

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE quiz_responses_new ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own quiz responses
CREATE POLICY "Users can view own quiz responses" ON quiz_responses_new
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses" ON quiz_responses_new
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz responses" ON quiz_responses_new
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz responses" ON quiz_responses_new
  FOR DELETE USING (auth.uid() = user_id);

-- If you want to preserve existing data, you could migrate it like this:
-- INSERT INTO quiz_responses_new (user_id, gender, age_group, skin_type, primary_concern, spending_budget, created_at)
-- SELECT
--   user_id,
--   COALESCE(gender, 'Female') as gender,
--   COALESCE(age_group, '21-40') as age_group,
--   COALESCE(skin_type, 'Normal') as skin_type,
--   ARRAY[COALESCE(primary_concern, 'Hydrating')] as primary_concern, -- Convert single to array
--   COALESCE(spending_budget::text, '50') as spending_budget,
--   created_at
-- FROM quiz_responses
-- WHERE user_id IS NOT NULL;

-- Backup the old table
ALTER TABLE quiz_responses RENAME TO quiz_responses_old;

-- Replace with the new table
ALTER TABLE quiz_responses_new RENAME TO quiz_responses;

-- Create indexes for better performance
CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_responses_updated_at
    BEFORE UPDATE ON quiz_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE quiz_responses IS 'Simplified quiz responses for Basic Assessment - 5 essential fields only';
COMMENT ON COLUMN quiz_responses.gender IS 'User gender: Male or Female';
COMMENT ON COLUMN quiz_responses.age_group IS 'Age group: <20, 21-40, 40+';
COMMENT ON COLUMN quiz_responses.skin_type IS 'Skin type: Dry, Normal, Combination, Oily';
COMMENT ON COLUMN quiz_responses.primary_concern IS 'Array of selected concerns: Acne, Redness, Pigments, etc.';
COMMENT ON COLUMN quiz_responses.spending_budget IS 'Monthly spending budget as text (includes $ and + symbols)';