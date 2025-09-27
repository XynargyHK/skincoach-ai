// insert-data.js - Simple data insertion after tables are created
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q'
)

async function insertSampleData() {
  console.log('🚀 Inserting sample data into SkinCoach database...\n')

  try {
    // Insert products
    console.log('📝 Inserting sample products...')
    const { data: products, error: productsError } = await supabase
      .from('base_products')
      .upsert([
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
        },
        {
          name: 'Hyaluronic Acid Moisturizer',
          description: 'Deeply hydrating moisturizer with hyaluronic acid',
          price: 32.99,
          skin_types: ['Dry', 'Normal', 'Sensitive'],
          concerns: ['Hydration', 'Anti-Aging'],
          active: true
        }
      ], {
        onConflict: 'name',
        ignoreDuplicates: false
      })

    if (productsError) {
      console.log('❌ Products error:', productsError.message)
    } else {
      console.log('✅ Products inserted successfully')
    }

    // Insert boosters
    console.log('📝 Inserting sample boosters...')
    const { data: boosters, error: boostersError } = await supabase
      .from('boosters')
      .upsert([
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
        },
        {
          name: 'Salicylic Acid Acne Treatment',
          description: 'BHA treatment for acne and blackheads',
          category: 'Anti-Acne',
          concentration_percentage: 2.0,
          target_concerns: ['Acne', 'Blackheads'],
          compatible_skin_types: ['Oily', 'Combination'],
          price: 18.99,
          active: true
        }
      ], {
        onConflict: 'name',
        ignoreDuplicates: false
      })

    if (boostersError) {
      console.log('❌ Boosters error:', boostersError.message)
    } else {
      console.log('✅ Boosters inserted successfully')
    }

    // Insert quiz responses
    console.log('📝 Inserting sample quiz responses...')
    const { data: quizzes, error: quizzesError } = await supabase
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

    if (quizzesError) {
      console.log('❌ Quiz responses error:', quizzesError.message)
    } else {
      console.log('✅ Quiz responses inserted successfully')
    }

    // Verify final counts
    console.log('\n🔍 Verifying data...')
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

    console.log('\n🎉 Sample data insertion complete!')
    console.log('🔗 Your admin panel at http://localhost:3005/admin should now show real data')

  } catch (error) {
    console.error('❌ Error inserting data:', error.message)
    console.log('💡 Make sure the database tables exist first by running the SQL in setup-direct.sql')
  }
}

insertSampleData()