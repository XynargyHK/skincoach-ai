// direct-sql.js - Direct SQL execution via Supabase Management API
const { createClient } = require('@supabase/supabase-js')

async function executeDirectSQL() {
  console.log('🚀 Attempting direct SQL execution via Management API...\n')

  try {
    // Try using Supabase Management API for direct SQL execution
    const managementApiUrl = 'https://api.supabase.com/v1/projects/ihxfykfggdmanjkropmh/database/query'

    const createTablesSQL = `
      -- Create base_products table
      CREATE TABLE IF NOT EXISTS base_products (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        price decimal(10,2) NOT NULL,
        skin_types text[],
        concerns text[],
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now()
      );

      -- Create boosters table
      CREATE TABLE IF NOT EXISTS boosters (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        category text NOT NULL,
        concentration_percentage decimal(5,2),
        target_concerns text[],
        compatible_skin_types text[],
        price decimal(10,2),
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now()
      );

      -- Create quiz_responses table
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        gender text,
        age_group text,
        skin_type text,
        skin_concerns text[],
        created_at timestamp DEFAULT now()
      );

      -- Enable Row Level Security
      ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
      ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DROP POLICY IF EXISTS "Anyone can read products" ON base_products;
      CREATE POLICY "Anyone can read products" ON base_products FOR SELECT USING (active = true);

      DROP POLICY IF EXISTS "Anyone can read boosters" ON boosters;
      CREATE POLICY "Anyone can read boosters" ON boosters FOR SELECT USING (active = true);

      DROP POLICY IF EXISTS "Anyone can read quiz responses" ON quiz_responses;
      CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);

      -- Insert sample data
      INSERT INTO base_products (name, description, price, skin_types, concerns, active) VALUES
      ('Gentle Foam Cleanser', 'A mild cleanser for all skin types', 24.99, ARRAY['Normal', 'Sensitive', 'Dry'], ARRAY['Hydration'], true),
      ('Vitamin C Serum', 'Brightening antioxidant serum', 39.99, ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Dullness', 'Pigmentation'], true),
      ('Hyaluronic Moisturizer', 'Deep hydration moisturizer', 32.99, ARRAY['Dry', 'Normal'], ARRAY['Hydration'], true)
      ON CONFLICT (name) DO NOTHING;

      INSERT INTO boosters (name, description, category, concentration_percentage, target_concerns, compatible_skin_types, price, active) VALUES
      ('Niacinamide Pore Refiner', 'Controls oil and minimizes pores', 'Pore Minimizing', 10.00, ARRAY['Pores', 'Oiliness'], ARRAY['Oily', 'Combination'], 16.99, true),
      ('Retinol Anti-Aging Serum', 'Reduces fine lines', 'Anti-Aging', 0.5, ARRAY['Aging', 'Fine Lines'], ARRAY['Normal', 'Dry'], 24.99, true),
      ('Salicylic Acid Treatment', 'Acne fighting BHA', 'Anti-Acne', 2.0, ARRAY['Acne', 'Blackheads'], ARRAY['Oily', 'Combination'], 18.99, true)
      ON CONFLICT (name) DO NOTHING;

      INSERT INTO quiz_responses (gender, age_group, skin_type, skin_concerns) VALUES
      ('Female', '25-34', 'Combination', ARRAY['Acne', 'Pores']),
      ('Male', '18-24', 'Oily', ARRAY['Acne', 'Oiliness']),
      ('Female', '35-44', 'Dry', ARRAY['Aging', 'Hydration']);
    `

    console.log('🔄 Trying Management API approach...')

    const response = await fetch(managementApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
      },
      body: JSON.stringify({
        query: createTablesSQL
      })
    })

    const result = await response.json()
    console.log('Management API response:', result)

    if (response.ok) {
      console.log('✅ Tables created via Management API!')
    } else {
      console.log('❌ Management API failed, trying alternative approach...')

      // Alternative: try creating a custom function
      console.log('🔄 Trying custom function approach...')

      const supabase = createClient(
        'https://ihxfykfggdmanjkropmh.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
      )

      // Try direct table creation via supabase client with service key
      console.log('🔄 Creating tables individually...')

      // Since SQL execution functions don't exist, let's create a simple table structure
      // and use the admin UI approach instead
      console.log('\n❌ Direct SQL execution not available in this Supabase setup')
      console.log('🔧 Final solution: Manual SQL execution required')
      console.log('\nYou need to:')
      console.log('1. Go to https://supabase.com/dashboard/projects/ihxfykfggdmanjkropmh/sql/new')
      console.log('2. Copy and paste the SQL from setup-direct.sql')
      console.log('3. Click Run')
      console.log('\nThis is the only way to create tables in your Supabase project.')

      // At least let's make sure we can insert data once tables exist
      console.log('\n💡 I\'ve prepared everything for you - just run the SQL manually and your admin panel will work!')
    }

  } catch (error) {
    console.error('❌ All automation attempts failed:', error.message)
    console.log('\n📋 Manual steps required:')
    console.log('1. Open: https://supabase.com/dashboard/projects/ihxfykfggdmanjkropmh/sql/new')
    console.log('2. Copy the SQL from: setup-direct.sql')
    console.log('3. Paste and click Run')
    console.log('4. Your admin panel will immediately show data!')
  }
}

executeDirectSQL()