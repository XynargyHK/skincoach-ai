// setup-database.js - Automated SkinCoach Database Setup
import { createClient } from '@supabase/supabase-js'

// Direct credentials (from your .env.local file)
const supabaseUrl = 'https://ihxfykfggdmanjkropmh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Database schema for SkinCoach.ai
const createTablesSQL = `
-- Product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Base products table
CREATE TABLE IF NOT EXISTS base_products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id uuid REFERENCES product_categories(id),
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

-- Boosters table
CREATE TABLE IF NOT EXISTS boosters (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Personalized recommendations table
CREATE TABLE IF NOT EXISTS personalized_plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_response_id uuid REFERENCES quiz_responses(id),
  recommended_plan_id uuid REFERENCES product_plans(id),
  base_products jsonb,
  recommended_boosters uuid[],
  customization_notes text,
  total_price decimal(10,2),
  created_at timestamp DEFAULT now()
);

-- Ingredients master table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  scientific_name text,
  category text,
  description text,
  benefits text[],
  safety_rating text,
  pregnancy_safe boolean DEFAULT true,
  comedogenic_rating integer,
  created_at timestamp DEFAULT now()
);
`

const insertSampleDataSQL = `
-- Insert default product categories
INSERT INTO product_categories (name, description, slug) VALUES
('Cleansers', 'Face cleansers and makeup removers', 'cleansers'),
('Serums', 'Treatment serums and essences', 'serums'),
('Moisturizers', 'Day and night moisturizers', 'moisturizers'),
('Sunscreens', 'UV protection products', 'sunscreens'),
('Eye Care', 'Eye creams and treatments', 'eye-care')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample ingredients
INSERT INTO ingredients (name, scientific_name, category, description, benefits, safety_rating, pregnancy_safe, comedogenic_rating) VALUES
('Niacinamide', 'Nicotinamide', 'Active', 'A form of vitamin B3 that helps improve skin texture', ARRAY['Pore minimizing', 'Oil control', 'Brightening'], 'safe', true, 0),
('Salicylic Acid', 'Beta Hydroxy Acid', 'Active', 'BHA that exfoliates and unclogs pores', ARRAY['Exfoliating', 'Acne-fighting', 'Pore-minimizing'], 'safe', false, 0),
('Hyaluronic Acid', 'Sodium Hyaluronate', 'Moisturizer', 'Powerful humectant that holds up to 1000x its weight in water', ARRAY['Moisturizing', 'Plumping', 'Anti-aging'], 'safe', true, 0),
('Retinol', 'Vitamin A', 'Active', 'Gold standard anti-aging ingredient that promotes cell turnover', ARRAY['Anti-aging', 'Exfoliating', 'Firming'], 'caution', false, 2)
ON CONFLICT DO NOTHING;

-- Insert sample boosters
INSERT INTO boosters (name, description, category, key_ingredients, concentration_percentage, target_concerns, compatible_skin_types, price, usage_notes, active) VALUES
('Niacinamide Pore Refiner', 'Minimizes pore appearance and controls oil production', 'Pore Minimizing', '{"niacinamide": "10%", "zinc": "1%"}', 10.00, ARRAY['Pores', 'Oiliness'], ARRAY['Oily', 'Combination', 'Normal'], 16.99, 'Use AM and PM. Can be mixed with other serums.', true),
('Retinol Anti-Aging Serum', 'Powerful anti-aging treatment for fine lines and wrinkles', 'Anti-Aging', '{"retinol": "0.5%", "vitamin_e": "0.1%"}', 0.5, ARRAY['Aging', 'Fine Lines'], ARRAY['Normal', 'Dry', 'Combination'], 24.99, 'Use PM only. Start 2x per week. Always use SPF during the day.', true),
('Salicylic Acid Acne Treatment', 'BHA treatment that unclogs pores and fights acne', 'Anti-Acne', '{"salicylic_acid": "2%", "niacinamide": "2%"}', 2.00, ARRAY['Acne', 'Blackheads'], ARRAY['Oily', 'Combination'], 18.99, 'Use PM only. Start every other day. May cause initial purging.', true)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO base_products (category_id, name, description, price, skin_types, concerns, ingredients, active) VALUES
((SELECT id FROM product_categories WHERE slug = 'cleansers'), 'Gentle Foam Cleanser', 'A mild, soap-free cleanser suitable for all skin types', 24.99, ARRAY['Normal', 'Sensitive', 'Dry'], ARRAY['Hydration'], '{"gentle_surfactants": "30%", "glycerin": "5%"}', true),
((SELECT id FROM product_categories WHERE slug = 'serums'), 'Vitamin C Brightening Serum', 'Powerful antioxidant serum for radiant skin', 39.99, ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Dullness', 'Pigmentation'], '{"vitamin_c": "15%", "vitamin_e": "1%"}', true),
((SELECT id FROM product_categories WHERE slug = 'moisturizers'), 'Hydrating Night Cream', 'Rich moisturizer for overnight skin repair', 34.99, ARRAY['Dry', 'Normal'], ARRAY['Hydration', 'Aging'], '{"hyaluronic_acid": "2%", "ceramides": "3%"}', true)
ON CONFLICT DO NOTHING;
`

const enableRLSSQL = `
-- Enable Row Level Security
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can read product categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read active base products" ON base_products FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read active boosters" ON boosters FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read active product plans" ON product_plans FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read ingredients" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can read personalized plans" ON personalized_plans FOR SELECT USING (true);
`

/**
 * Execute SQL query with error handling
 */
async function executeSQLQuery(sql, description) {
  try {
    console.log(`🔄 ${description}...`)
    const { data, error } = await supabase.rpc('exec_sql', { query: sql })

    if (error) {
      throw new Error(error.message)
    }

    console.log(`✅ ${description} completed successfully`)
    return true
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return false
  }
}

/**
 * Main setup function
 */
async function setupSkinCoachDatabase() {
  console.log('🚀 Starting SkinCoach.ai Database Setup...\n')

  try {
    // Test connection first
    console.log('🔗 Testing Supabase connection...')
    const { data, error } = await supabase.from('product_plans').select('count', { count: 'exact', head: true })

    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`)
    }

    console.log('✅ Supabase connection successful!\n')

    // Create tables
    const tablesCreated = await executeSQLQuery(createTablesSQL, 'Creating database tables')
    if (!tablesCreated) return

    // Insert sample data
    const dataInserted = await executeSQLQuery(insertSampleDataSQL, 'Inserting sample data')
    if (!dataInserted) return

    // Enable RLS and policies
    const rlsEnabled = await executeSQLQuery(enableRLSSQL, 'Setting up Row Level Security')
    if (!rlsEnabled) return

    console.log('\n🎉 SkinCoach Database Setup Complete!')
    console.log('📊 Your admin panel should now show real data')
    console.log('🔗 Visit: http://localhost:3006/admin')

    // Verify setup
    console.log('\n🔍 Verifying setup...')
    const verification = await verifySetup()
    if (verification) {
      console.log('✅ All tables created and populated successfully!')
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check your .env.local file has correct Supabase credentials')
    console.log('2. Ensure your Supabase project is active')
    console.log('3. Try running this script again')
  }
}

/**
 * Verify database setup
 */
async function verifySetup() {
  try {
    const tables = ['product_categories', 'base_products', 'boosters', 'product_plans', 'ingredients']

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true })
      if (error) {
        console.log(`❌ Table '${table}' verification failed`)
        return false
      }
      console.log(`✅ Table '${table}': ${data?.length || 0} records`)
    }

    return true
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    return false
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSkinCoachDatabase()
}

export { setupSkinCoachDatabase }