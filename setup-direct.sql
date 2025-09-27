-- SkinCoach Database Setup - Copy and paste this into Supabase SQL Editor

-- Create base_products table
CREATE TABLE IF NOT EXISTS base_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  short_description text,
  price decimal(10,2) NOT NULL,
  sku text UNIQUE,
  image_url text,
  ingredients jsonb,
  benefits text[],
  skin_types text[],
  concerns text[],
  usage_instructions text,
  volume_ml integer,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create boosters table
CREATE TABLE IF NOT EXISTS boosters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  key_ingredients jsonb,
  concentration_percentage decimal(5,2),
  target_concerns text[],
  compatible_skin_types text[],
  price decimal(10,2),
  image_url text,
  usage_notes text,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  gender text,
  age_group text,
  skin_type text,
  current_products text[],
  skin_concerns text[],
  lifestyle_factors text[],
  preferences jsonb,
  routine_time text,
  skin_sensitivity text,
  product_experience text,
  budget_range text,
  specific_goals text[],
  created_at timestamp DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read base products" ON base_products;
CREATE POLICY "Anyone can read base products" ON base_products FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Anyone can read boosters" ON boosters;
CREATE POLICY "Anyone can read boosters" ON boosters FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Anyone can read quiz responses" ON quiz_responses;
CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);

-- Insert sample data
INSERT INTO base_products (name, description, price, skin_types, concerns, active) VALUES
('Gentle Foam Cleanser', 'A mild, soap-free cleanser suitable for all skin types', 24.99, ARRAY['Normal', 'Sensitive', 'Dry'], ARRAY['Hydration'], true),
('Vitamin C Brightening Serum', 'Powerful antioxidant serum for radiant skin', 39.99, ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Dullness', 'Pigmentation'], true),
('Hyaluronic Acid Moisturizer', 'Deeply hydrating moisturizer with hyaluronic acid', 32.99, ARRAY['Dry', 'Normal', 'Sensitive'], ARRAY['Hydration', 'Anti-Aging'], true);

INSERT INTO boosters (name, description, category, concentration_percentage, target_concerns, compatible_skin_types, price, active) VALUES
('Niacinamide Pore Refiner', 'Minimizes pore appearance and controls oil production', 'Pore Minimizing', 10.00, ARRAY['Pores', 'Oiliness'], ARRAY['Oily', 'Combination'], 16.99, true),
('Retinol Anti-Aging Serum', 'Powerful anti-aging treatment for fine lines', 'Anti-Aging', 0.5, ARRAY['Aging', 'Fine Lines'], ARRAY['Normal', 'Dry'], 24.99, true),
('Salicylic Acid Acne Treatment', 'BHA treatment for acne and blackheads', 'Anti-Acne', 2.0, ARRAY['Acne', 'Blackheads'], ARRAY['Oily', 'Combination'], 18.99, true);

INSERT INTO quiz_responses (gender, age_group, skin_type, skin_concerns) VALUES
('Female', '25-34', 'Combination', ARRAY['Acne', 'Pores']),
('Male', '18-24', 'Oily', ARRAY['Acne', 'Oiliness']),
('Female', '35-44', 'Dry', ARRAY['Aging', 'Hydration']);