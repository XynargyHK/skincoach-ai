-- Update quiz_responses table to match the actual quiz structure
-- Copy and paste this into Supabase SQL Editor

-- Drop the old simple quiz_responses table and create the proper one
DROP TABLE IF EXISTS quiz_responses CASCADE;

-- Create comprehensive quiz_responses table matching your MC questions
CREATE TABLE quiz_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,

  -- Demographics (Questions 1-3)
  gender text,
  age_group text,
  ethnicity text,

  -- Skin Classification (Questions 4-5)
  skin_tone text,
  skin_type text,

  -- Skin Sensitivity (Question 6)
  sensitivity_level text,

  -- Skin Health (Question 7)
  skin_conditions text[],

  -- Skin Concerns (Questions 8-11)
  acne_level text,
  pigmentation_issues text[],
  aging_signs text[],
  skin_firmness text,

  -- Eye Area (Questions 12-13)
  dark_circles text,
  eye_bags text,

  -- Current Skincare (Question 14)
  current_routine text[],

  -- Experience (Question 15)
  skincare_knowledge text,

  -- Goals (Question 16)
  skin_goals text[],

  -- Lifestyle (Question 17)
  lifestyle_factors text[],

  -- Diet & Habits (Question 18)
  diet_habits text[],

  -- Metadata
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Anyone can read quiz responses" ON quiz_responses;
CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);

-- Create policy for insert (users can insert their own)
CREATE POLICY "Users can insert own quiz responses" ON quiz_responses FOR INSERT WITH CHECK (true);

-- Also create the recommendations table that your quiz component expects
DROP TABLE IF EXISTS recommendations CASCADE;

CREATE TABLE recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_response_id uuid REFERENCES quiz_responses(id) ON DELETE CASCADE,
  recommended_plan text NOT NULL,
  confidence_score decimal(3,2) DEFAULT 0.85,
  boosters text[],
  priority_concerns text[],
  skin_analysis jsonb,
  timeline_expectations text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS for recommendations
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read recommendations" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Users can insert recommendations" ON recommendations FOR INSERT WITH CHECK (true);

-- Insert sample quiz responses with comprehensive data matching your quiz structure
INSERT INTO quiz_responses (
  gender, age_group, ethnicity, skin_tone, skin_type, sensitivity_level,
  skin_conditions, acne_level, pigmentation_issues, aging_signs, skin_firmness,
  dark_circles, eye_bags, current_routine, skincare_knowledge, skin_goals,
  lifestyle_factors, diet_habits
) VALUES
(
  'Female', '20-35', 'Asian', 'Light - Sometimes burns, tans evenly',
  'Combination - Dry in some areas, oily in others (T-zone)',
  'Mildly sensitive - Sometimes react to acids or actives',
  ARRAY['None of the above'], 'Some comedones',
  ARRAY['Post-acne pigmentation', 'Uneven skin tone'],
  ARRAY['Fine lines starting to appear'], 'Tight and smooth',
  'Mild dark circles', 'No eye bags',
  ARRAY['Sunscreen', 'Cleanser', 'Moisturizer', 'Serums'],
  'Intermediate - I''m fairly clued up',
  ARRAY['Clear acne and blackheads', 'Reduce dark spots or pigmentation', 'Improve hydration'],
  ARRAY['Get less than 7 hours of sleep', 'Live a stressful lifestyle'],
  ARRAY['Caffeine', 'Lots of water']
),
(
  'Male', '20-35', 'Caucasian', 'Fair - Often burns, tans a little',
  'Oily - Produces lots of natural oils, shiny complexion',
  'Not sensitive - Never have problems with products',
  ARRAY['None of the above'], 'Large patches of acne',
  ARRAY['No pigmentation issues'], ARRAY['No visible aging signs'], 'Tight and smooth',
  'No dark circles', 'No eye bags',
  ARRAY['Cleanser', 'Sunscreen'],
  'Beginner - I haven''t got a clue',
  ARRAY['Clear acne and blackheads', 'Make pores less visible'],
  ARRAY['Exercise frequently', 'Spend a lot of time outdoors'],
  ARRAY['Processed foods or refined sugar', 'Lots of water']
),
(
  'Female', '36-50', 'Hispanic/Latino', 'Medium - Burns minimally, tans easily',
  'Dry - Prone to cracking, peeling, or feeling tight',
  'Quite sensitive - Regularly react to many products',
  ARRAY['Rosacea'], 'No acne or comedones',
  ARRAY['Sun spots appearing', 'Melasma'],
  ARRAY['Fine lines starting to appear', 'Crows feet around eyes'], 'Slightly sagging',
  'Very dark circles', 'Mild puffiness',
  ARRAY['Sunscreen', 'Cleanser', 'Moisturizer', 'Eye Cream', 'Night Cream'],
  'Advanced - I''m a dedicated enthusiast',
  ARRAY['Tackle fine lines and wrinkles', 'Reduce dark spots or pigmentation', 'Improve hydration', 'Treat rosacea'],
  ARRAY['Live in a high pollution area', 'Live a stressful lifestyle'],
  ARRAY['Alcohol', 'Caffeine', 'Lots of water']
);

-- Insert corresponding sample recommendations
INSERT INTO recommendations (
  quiz_response_id, recommended_plan, confidence_score, boosters, priority_concerns,
  skin_analysis, timeline_expectations
) VALUES
(
  (SELECT id FROM quiz_responses WHERE gender = 'Female' AND age_group = '20-35' LIMIT 1),
  'Pro', 0.88,
  ARRAY['Anti-acne', 'Brightening', 'Hydration'],
  ARRAY['Acne treatment', 'Pigmentation reduction', 'Hydration'],
  '{"skin_type": "Combination", "main_concerns": ["Acne", "Pigmentation"], "sensitivity_level": "Mild"}',
  '4-6 weeks for acne improvement, 8-12 weeks for pigmentation'
),
(
  (SELECT id FROM quiz_responses WHERE gender = 'Male' AND age_group = '20-35' LIMIT 1),
  'Essential', 0.92,
  ARRAY['Anti-acne', 'Oil control'],
  ARRAY['Severe acne treatment', 'Pore minimizing'],
  '{"skin_type": "Oily", "main_concerns": ["Severe acne", "Oily skin"], "sensitivity_level": "Not sensitive"}',
  '6-8 weeks for acne reduction'
),
(
  (SELECT id FROM quiz_responses WHERE gender = 'Female' AND age_group = '36-50' LIMIT 1),
  'Concierge', 0.90,
  ARRAY['Anti-aging', 'Brightening', 'Hydration', 'Gentle treatment'],
  ARRAY['Anti-aging', 'Pigmentation reduction', 'Rosacea management'],
  '{"skin_type": "Dry", "main_concerns": ["Aging", "Rosacea", "Pigmentation"], "sensitivity_level": "High"}',
  '8-12 weeks for aging signs, 4-8 weeks for rosacea improvement'
);