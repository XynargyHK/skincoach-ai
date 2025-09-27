// create-with-service-key.js - Automated table creation with SERVICE ROLE key
const { createClient } = require('@supabase/supabase-js')

// Using SERVICE ROLE key for DDL operations
const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createTablesAutomated() {
  console.log('🚀 Creating SkinCoach database tables with SERVICE ROLE key...\n')

  try {
    console.log('🔗 Testing SERVICE ROLE connection...')

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('product_plans')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      console.log('Connection test result:', testError.message)
    } else {
      console.log('✅ SERVICE ROLE connection successful!')
    }

    console.log('\n📝 Creating tables using direct SQL execution...')

    // Try using rpc with service key
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
    `

    // Try direct HTTP request to PostgREST with SERVICE key
    console.log('🔄 Attempting direct SQL execution...')

    const response = await fetch('https://ihxfykfggdmanjkropmh.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
      },
      body: JSON.stringify({ query: createTablesSQL })
    })

    const sqlResult = await response.text()
    console.log('SQL execution response:', sqlResult)

    // Also try with supabase client
    try {
      const rpcResult = await supabase.rpc('sql', { query: createTablesSQL })
      console.log('RPC result:', rpcResult.error ? rpcResult.error.message : 'Success')
    } catch (rpcError) {
      console.log('RPC error:', rpcError.message)
    }

    console.log('\n📝 Inserting sample data...')

    // Insert sample data using SERVICE ROLE permissions
    const productInsert = await supabase
      .from('base_products')
      .upsert([
        {
          name: 'Gentle Foam Cleanser',
          description: 'A mild cleanser for all skin types',
          price: 24.99,
          skin_types: ['Normal', 'Sensitive', 'Dry'],
          concerns: ['Hydration'],
          active: true
        },
        {
          name: 'Vitamin C Serum',
          description: 'Brightening antioxidant serum',
          price: 39.99,
          skin_types: ['Normal', 'Oily', 'Combination'],
          concerns: ['Dullness', 'Pigmentation'],
          active: true
        },
        {
          name: 'Hyaluronic Moisturizer',
          description: 'Deep hydration moisturizer',
          price: 32.99,
          skin_types: ['Dry', 'Normal'],
          concerns: ['Hydration'],
          active: true
        }
      ])

    if (productInsert.error) {
      console.log('❌ Product insert error:', productInsert.error.message)
    } else {
      console.log('✅ Products inserted successfully')
    }

    const boosterInsert = await supabase
      .from('boosters')
      .upsert([
        {
          name: 'Niacinamide Pore Refiner',
          description: 'Controls oil and minimizes pores',
          category: 'Pore Minimizing',
          concentration_percentage: 10.00,
          target_concerns: ['Pores', 'Oiliness'],
          compatible_skin_types: ['Oily', 'Combination'],
          price: 16.99,
          active: true
        },
        {
          name: 'Retinol Anti-Aging Serum',
          description: 'Reduces fine lines',
          category: 'Anti-Aging',
          concentration_percentage: 0.5,
          target_concerns: ['Aging', 'Fine Lines'],
          compatible_skin_types: ['Normal', 'Dry'],
          price: 24.99,
          active: true
        },
        {
          name: 'Salicylic Acid Treatment',
          description: 'Acne fighting BHA',
          category: 'Anti-Acne',
          concentration_percentage: 2.0,
          target_concerns: ['Acne', 'Blackheads'],
          compatible_skin_types: ['Oily', 'Combination'],
          price: 18.99,
          active: true
        }
      ])

    if (boosterInsert.error) {
      console.log('❌ Booster insert error:', boosterInsert.error.message)
    } else {
      console.log('✅ Boosters inserted successfully')
    }

    const quizInsert = await supabase
      .from('quiz_responses')
      .insert([
        {
          gender: 'Female',
          age_group: '25-34',
          skin_type: 'Combination',
          skin_concerns: ['Acne', 'Pores']
        },
        {
          gender: 'Male',
          age_group: '18-24',
          skin_type: 'Oily',
          skin_concerns: ['Acne', 'Oiliness']
        },
        {
          gender: 'Female',
          age_group: '35-44',
          skin_type: 'Dry',
          skin_concerns: ['Aging', 'Hydration']
        }
      ])

    if (quizInsert.error) {
      console.log('❌ Quiz insert error:', quizInsert.error.message)
    } else {
      console.log('✅ Quiz responses inserted successfully')
    }

    // Verify final counts
    console.log('\n🔍 Verifying setup...')
    const [productsCount, boostersCount, quizzesCount, plansCount] = await Promise.all([
      supabase.from('base_products').select('*', { count: 'exact', head: true }),
      supabase.from('boosters').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_responses').select('*', { count: 'exact', head: true }),
      supabase.from('product_plans').select('*', { count: 'exact', head: true })
    ])

    console.log('📊 Final database contents:')
    console.log(`   • Products: ${productsCount.count || 0}`)
    console.log(`   • Boosters: ${boostersCount.count || 0}`)
    console.log(`   • Quiz Responses: ${quizzesCount.count || 0}`)
    console.log(`   • Plans: ${plansCount.count || 0}`)

    console.log('\n🎉 Database setup complete with SERVICE ROLE key!')
    console.log('🔗 Your admin panel at http://localhost:3005/admin should now show real data!')

  } catch (error) {
    console.error('❌ SERVICE ROLE automation failed:', error.message)
    console.log('Error details:', error)
  }
}

createTablesAutomated()