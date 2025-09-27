const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

async function checkAllTables() {
  try {
    console.log('🔍 CHECKING ALL TABLES IN SUPABASE PROJECT...\n')

    // Check if boosters table exists and get its structure
    const { data: boosterSchema, error: schemaError } = await supabase.rpc('exec', {
      sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'boosters' ORDER BY ordinal_position"
    }).single()

    if (schemaError) {
      console.log('⚠️  Could not get table schema, trying direct query...')
    }

    // Try to get all boosters with all columns
    const { data: allBoosters, error: allError } = await supabase
      .from('boosters')
      .select('*')
      .order('name')

    if (allError) {
      console.error('❌ Error accessing boosters table:', allError.message)
      console.log('\nPossible issues:')
      console.log('1. Table name might be different')
      console.log('2. RLS (Row Level Security) might be blocking access')
      console.log('3. Service role key might not have proper permissions')
      return
    }

    console.log(`📊 BOOSTERS TABLE FOUND - ${allBoosters.length} records\n`)

    // Show table structure
    if (allBoosters.length > 0) {
      const firstRecord = allBoosters[0]
      console.log('📋 TABLE COLUMNS:')
      Object.keys(firstRecord).forEach((column, index) => {
        console.log(`${index + 1}. ${column}: ${typeof firstRecord[column]}`)
      })
      console.log('')
    }

    // Show specific boosters we updated
    const targetBoosters = ['NV Niacinamide', 'NV Ascorbic Acid', 'NV Retinol', 'NV Hyaluronic Acid', 'NV Caffeine']

    console.log('🎯 TARGET BOOSTERS STATUS:')
    targetBoosters.forEach(name => {
      const booster = allBoosters.find(b => b.name === name)
      if (booster) {
        console.log(`✅ ${name}: FOUND (ID: ${booster.id})`)
        console.log(`   Description: "${booster.description.substring(0, 80)}..."`)
      } else {
        console.log(`❌ ${name}: NOT FOUND`)
      }
    })

    console.log('\n📋 ALL BOOSTERS IN DATABASE:')
    allBoosters.forEach((booster, index) => {
      console.log(`${index + 1}. ${booster.name} (ID: ${booster.id})`)
    })

    console.log('\n🌐 SUPABASE DASHBOARD DIRECT LINKS:')
    console.log('Main Dashboard: https://supabase.com/dashboard/project/ihxfykfggdmanjkropmh')
    console.log('Table Editor: https://supabase.com/dashboard/project/ihxfykfggdmanjkropmh/editor')
    console.log('Boosters Table: https://supabase.com/dashboard/project/ihxfykfggdmanjkropmh/editor/28885')

  } catch (error) {
    console.error('❌ Failed to check tables:', error.message)
  }
}

checkAllTables()