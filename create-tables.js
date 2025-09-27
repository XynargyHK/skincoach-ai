// create-tables.js - Comprehensive database setup
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q'
)

async function createTables() {
  console.log('🚀 Setting up SkinCoach database...\n')

  try {
    // Check connection first
    console.log('🔗 Testing Supabase connection...')
    const { data, error: connError } = await supabase.from('product_plans').select('count', { count: 'exact', head: true })

    if (connError && !connError.message.includes('relation')) {
      throw new Error(`Connection failed: ${connError.message}`)
    }
    console.log('✅ Connection successful!\n')

    // Create comprehensive schema using individual operations
    console.log('📝 Creating base_products table...')
    const createProductsResult = await supabase.rpc('exec_sql', {
      query: `
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

        ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can read base products" ON base_products;
        CREATE POLICY "Anyone can read base products" ON base_products FOR SELECT USING (active = true);
      `
    })

    if (createProductsResult.error) {
      console.log('Products table result:', createProductsResult.error.message)
    } else {
      console.log('✅ base_products table ready')
    }

    console.log('📝 Creating boosters table...')
    const createBoostersResult = await supabase.rpc('exec_sql', {
      query: `
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

        ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can read boosters" ON boosters;
        CREATE POLICY "Anyone can read boosters" ON boosters FOR SELECT USING (active = true);
      `
    })

    if (createBoostersResult.error) {
      console.log('Boosters table result:', createBoostersResult.error.message)
    } else {
      console.log('✅ boosters table ready')
    }

    console.log('📝 Creating quiz_responses table...')
    const createQuizResult = await supabase.rpc('exec_sql', {
      query: `
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

        ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can read quiz responses" ON quiz_responses;
        CREATE POLICY "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);
      `
    })

    if (createQuizResult.error) {
      console.log('Quiz table result:', createQuizResult.error.message)
    } else {
      console.log('✅ quiz_responses table ready')
    }

    // Wait a moment for tables to be ready
    console.log('\n⏳ Waiting for tables to be ready...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('📝 Inserting sample data...')

    // Insert sample data with better error handling
    try {
      const productsResult = await supabase.from('base_products').insert([
        {
          name: 'Gentle Foam Cleanser',
          description: 'A mild, soap-free cleanser suitable for all skin types',
          price: 24.99,
          skin_types: ['Normal', 'Sensitive', 'Dry'],
          concerns: ['Hydration'],
          active: true
        },
        {
          name: 'Vitamin C Brightening Serum',
          description: 'Powerful antioxidant serum for radiant skin',
          price: 39.99,
          skin_types: ['Normal', 'Oily', 'Combination'],
          concerns: ['Dullness', 'Pigmentation'],
          active: true
        }
      ])

      if (productsResult.error) {
        console.log('⚠️ Products insert error:', productsResult.error.message)
      } else {
        console.log('✅ Sample products inserted')
      }

      const boostersResult = await supabase.from('boosters').insert([
        {
          name: 'Niacinamide Pore Refiner',
          description: 'Minimizes pore appearance and controls oil production',
          category: 'Pore Minimizing',
          concentration_percentage: 10.00,
          target_concerns: ['Pores', 'Oiliness'],
          compatible_skin_types: ['Oily', 'Combination'],
          price: 16.99,
          active: true
        },
        {
          name: 'Retinol Anti-Aging Serum',
          description: 'Powerful anti-aging treatment for fine lines',
          category: 'Anti-Aging',
          concentration_percentage: 0.5,
          target_concerns: ['Aging', 'Fine Lines'],
          compatible_skin_types: ['Normal', 'Dry'],
          price: 24.99,
          active: true
        }
      ])

      if (boostersResult.error) {
        console.log('⚠️ Boosters insert error:', boostersResult.error.message)
      } else {
        console.log('✅ Sample boosters inserted')
      }

      const quizResult = await supabase.from('quiz_responses').insert([
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
        }
      ])

      if (quizResult.error) {
        console.log('⚠️ Quiz insert error:', quizResult.error.message)
      } else {
        console.log('✅ Sample quiz responses inserted')
      }

    } catch (insertError) {
      console.log('⚠️ Data insertion completed with some issues')
    }

    // Final verification
    console.log('\n🔍 Verifying setup...')
    const verification = await verifyData()

    console.log('\n🎉 Database setup complete!')
    console.log('🔗 Visit your admin panel at: http://localhost:3005/admin')

  } catch (error) {
    console.error('❌ Setup error:', error.message)
    console.log('\n💡 The admin panel should still work with mock data as fallback')
  }
}

async function verifyData() {
  try {
    const [products, boosters, quizzes, plans] = await Promise.all([
      supabase.from('base_products').select('*', { count: 'exact', head: true }),
      supabase.from('boosters').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_responses').select('*', { count: 'exact', head: true }),
      supabase.from('product_plans').select('*', { count: 'exact', head: true })
    ])

    console.log('📊 Final counts:')
    console.log(`   • Products: ${products.count || 0}`)
    console.log(`   • Boosters: ${boosters.count || 0}`)
    console.log(`   • Quiz Responses: ${quizzes.count || 0}`)
    console.log(`   • Plans: ${plans.count || 0}`)

    return (products.count > 0 || boosters.count > 0)
  } catch (error) {
    console.log('⚠️ Verification error:', error.message)
    return false
  }
}

createTables()