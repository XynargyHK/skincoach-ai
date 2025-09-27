-- Simple update for quiz_responses table to match Basic Assessment

-- First, backup existing table if it exists
-- We'll create a new table with the correct structure

-- Drop the test table if it exists
DROP TABLE IF EXISTS quiz_responses_basic;

-- Create new quiz_responses table structure for Basic Assessment
CREATE TABLE quiz_responses_basic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,

  -- Basic Assessment Fields (5 essential fields)
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  age_group TEXT NOT NULL CHECK (age_group IN ('<20', '21-40', '40+')),
  skin_type TEXT NOT NULL CHECK (skin_type IN ('Dry', 'Normal', 'Combination', 'Oily')),
  primary_concern TEXT[] NOT NULL,
  spending_budget TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test insert to verify schema works
INSERT INTO quiz_responses_basic (gender, age_group, skin_type, primary_concern, spending_budget)
VALUES ('Female', '21-40', 'Normal', ARRAY['Acne', 'Pigments'], '75');

-- Verify the insert worked
SELECT * FROM quiz_responses_basic LIMIT 1;

-- Clean up test data
DELETE FROM quiz_responses_basic;

-- Success message
SELECT 'Basic quiz_responses schema created successfully!' as message;