-- SkinCoach.ai Product Catalog Database Schema
-- Run this in Supabase SQL Editor

-- Product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Base products table (cleansers, serums, creams)
CREATE TABLE IF NOT EXISTS base_products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id uuid REFERENCES product_categories(id),
  name text NOT NULL,
  description text,
  short_description text,
  price decimal(10,2) NOT NULL,
  sku text UNIQUE,
  image_url text,
  ingredients jsonb, -- Array of ingredients with concentrations
  benefits text[],
  skin_types text[], -- oily, dry, combination, normal, sensitive
  concerns text[], -- acne, aging, pigmentation, hydration
  usage_instructions text,
  volume_ml integer,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Boosters table (specialized treatments)
CREATE TABLE IF NOT EXISTS boosters (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL, -- anti-acne, anti-aging, brightening, hydration, etc.
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

-- Product plans table (Essential, Pro, Concierge)
CREATE TABLE IF NOT EXISTS product_plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL, -- Essential, Pro, Concierge
  price decimal(10,2) NOT NULL,
  description text,
  included_products jsonb, -- Array of base product IDs
  max_boosters integer DEFAULT 0,
  features text[],
  target_demographic text,
  popular boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Personalized recommendations linking table
CREATE TABLE IF NOT EXISTS personalized_plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_response_id uuid REFERENCES quiz_responses(id),
  recommended_plan_id uuid REFERENCES product_plans(id),
  base_products jsonb, -- Specific products recommended
  recommended_boosters uuid[], -- Array of booster IDs
  customization_notes text,
  total_price decimal(10,2),
  created_at timestamp DEFAULT now()
);

-- Ingredients master table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  scientific_name text,
  category text, -- active, moisturizer, cleanser, preservative
  description text,
  benefits text[],
  safety_rating text, -- safe, caution, avoid
  pregnancy_safe boolean DEFAULT true,
  comedogenic_rating integer, -- 0-5 scale
  created_at timestamp DEFAULT now()
);

-- Insert default product categories
INSERT INTO product_categories (name, description, slug) VALUES
('Cleansers', 'Face cleansers and makeup removers', 'cleansers'),
('Serums', 'Treatment serums and essences', 'serums'),
('Moisturizers', 'Day and night moisturizers', 'moisturizers'),
('Sunscreens', 'UV protection products', 'sunscreens'),
('Eye Care', 'Eye creams and treatments', 'eye-care')
ON CONFLICT (slug) DO NOTHING;

-- Insert default product plans
INSERT INTO product_plans (name, price, description, max_boosters, features, target_demographic, popular) VALUES
(
  'Essential',
  39.00,
  'Perfect starter routine for Gen Z & young adults',
  2,
  ARRAY['Base serum or cream', '2 boosters', 'AI Dermatologist Coaching', 'Monthly skin check-ins'],
  'Gen Z & young adults',
  false
),
(
  'Pro',
  69.00,
  'Complete AM/PM smart routine for busy adults',
  4,
  ARRAY['Complete AM/PM routine', '4 boosters', 'AI Dermatologist Coaching', 'Smart routine optimization'],
  'Busy adults 25-40',
  false
),
(
  'Concierge',
  99.00,
  'Premium skincare with VIP support for mature skin',
  10,
  ARRAY['Cleanser + Day Serum + Day Cream + Night Cream', '10 advanced boosters', 'AI Dermatologist Coaching', 'Concierge VIP Support'],
  '40+ mature skin concerns',
  true
)
ON CONFLICT DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Public read access for products (for displaying on website)
CREATE POLICY "Anyone can read product categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read active base products" ON base_products FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read active boosters" ON boosters FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read active product plans" ON product_plans FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read ingredients" ON ingredients FOR SELECT USING (true);

-- Users can view their own personalized plans
CREATE POLICY "Users can view own personalized plans" ON personalized_plans FOR SELECT USING (
  quiz_response_id IN (SELECT id FROM quiz_responses WHERE user_id = auth.uid())
);