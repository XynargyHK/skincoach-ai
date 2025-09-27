// postgres-direct.js - Direct PostgreSQL connection to create tables
const { Client } = require('pg')

async function createTablesDirectly() {
  console.log('🚀 Attempting direct PostgreSQL connection...\n')

  // Supabase PostgreSQL connection details
  const client = new Client({
    host: 'db.ihxfykfggdmanjkropmh.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    // We'll need the database password - this is usually different from API keys
    // You can find it in Supabase Dashboard → Settings → Database
    password: 'your-database-password-here', // You need to replace this
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🔗 Connecting to PostgreSQL...')
    await client.connect()
    console.log('✅ Connected to database!')

    console.log('📝 Creating tables...')

    // Create base_products table
    await client.query(`
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
    `)
    console.log('✅ base_products table created')

    // Create boosters table
    await client.query(`
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
    `)
    console.log('✅ boosters table created')

    // Create quiz_responses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        gender text,
        age_group text,
        skin_type text,
        skin_concerns text[],
        created_at timestamp DEFAULT now()
      );
    `)
    console.log('✅ quiz_responses table created')

    console.log('📝 Setting up Row Level Security...')

    // Enable RLS
    await client.query('ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;')
    await client.query('ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;')
    await client.query('ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;')

    // Create policies
    await client.query(`
      DROP POLICY IF EXISTS "Anyone can read products" ON base_products;
      CREATE POLICY "Anyone can read products" ON base_products FOR SELECT USING (active = true);
    `)

    await client.query(`
      DROP POLICY IF EXISTS "Anyone can read boosters" ON boosters;
      CREATE POLICY "Anyone can read boosters" ON boosters FOR SELECT USING (active = true);
    `)

    await client.query(`
      DROP POLICY IF EXISTS "Anyone can read quiz responses" ON quiz_responses;
      CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);
    `)

    console.log('✅ Row Level Security configured')

    console.log('📝 Inserting sample data...')

    // Insert sample products
    await client.query(`
      INSERT INTO base_products (name, description, price, skin_types, concerns, active)
      VALUES
        ('Gentle Foam Cleanser', 'A mild cleanser for all skin types', 24.99, ARRAY['Normal', 'Sensitive', 'Dry'], ARRAY['Hydration'], true),
        ('Vitamin C Serum', 'Brightening antioxidant serum', 39.99, ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Dullness', 'Pigmentation'], true),
        ('Hyaluronic Moisturizer', 'Deep hydration moisturizer', 32.99, ARRAY['Dry', 'Normal'], ARRAY['Hydration'], true)
      ON CONFLICT (name) DO NOTHING;
    `)

    // Insert sample boosters
    await client.query(`
      INSERT INTO boosters (name, description, category, concentration_percentage, target_concerns, compatible_skin_types, price, active)
      VALUES
        ('Niacinamide Pore Refiner', 'Controls oil and minimizes pores', 'Pore Minimizing', 10.00, ARRAY['Pores', 'Oiliness'], ARRAY['Oily', 'Combination'], 16.99, true),
        ('Retinol Anti-Aging Serum', 'Reduces fine lines', 'Anti-Aging', 0.5, ARRAY['Aging', 'Fine Lines'], ARRAY['Normal', 'Dry'], 24.99, true),
        ('Salicylic Acid Treatment', 'Acne fighting BHA', 'Anti-Acne', 2.0, ARRAY['Acne', 'Blackheads'], ARRAY['Oily', 'Combination'], 18.99, true)
      ON CONFLICT (name) DO NOTHING;
    `)

    // Insert sample quiz responses
    await client.query(`
      INSERT INTO quiz_responses (gender, age_group, skin_type, skin_concerns)
      VALUES
        ('Female', '25-34', 'Combination', ARRAY['Acne', 'Pores']),
        ('Male', '18-24', 'Oily', ARRAY['Acne', 'Oiliness']),
        ('Female', '35-44', 'Dry', ARRAY['Aging', 'Hydration']);
    `)

    console.log('✅ Sample data inserted')

    // Verify data
    const productsResult = await client.query('SELECT COUNT(*) FROM base_products')
    const boostersResult = await client.query('SELECT COUNT(*) FROM boosters')
    const quizzesResult = await client.query('SELECT COUNT(*) FROM quiz_responses')

    console.log('\n🎉 Database setup complete!')
    console.log('📊 Final counts:')
    console.log(`   • Products: ${productsResult.rows[0].count}`)
    console.log(`   • Boosters: ${boostersResult.rows[0].count}`)
    console.log(`   • Quiz Responses: ${quizzesResult.rows[0].count}`)
    console.log('\n🔗 Your admin panel should now work at: http://localhost:3005/admin')

  } catch (error) {
    console.error('❌ Direct PostgreSQL approach failed:', error.message)
    console.log('\n💡 You need the database password from:')
    console.log('   Supabase Dashboard → Settings → Database → Connection String')
    console.log('   Look for the password in the connection string')
  } finally {
    await client.end()
  }
}

createTablesDirectly()