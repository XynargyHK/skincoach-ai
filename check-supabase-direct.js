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

async function checkSupabaseDirectly() {
  try {
    console.log('🔍 CHECKING SUPABASE DATABASE DIRECTLY...\n')

    // Direct query to see what's actually in Supabase
    const { data: boosters, error } = await supabase
      .from('boosters')
      .select('id, name, description')
      .in('name', ['NV Niacinamide', 'NV Ascorbic Acid', 'NV Retinol', 'NV Hyaluronic Acid', 'NV Caffeine'])
      .order('name')

    if (error) {
      console.error('❌ Database error:', error)
      return
    }

    console.log(`📊 Direct Supabase Query Results (${boosters.length} boosters):\n`)

    boosters.forEach((booster, index) => {
      console.log(`${index + 1}. 📋 ${booster.name} (ID: ${booster.id})`)
      console.log(`   Description: "${booster.description}"\n`)
    })

    // Also check the updated_at or any timestamp fields
    const { data: timestamps } = await supabase
      .from('boosters')
      .select('name, updated_at')
      .in('name', ['NV Niacinamide', 'NV Ascorbic Acid', 'NV Retinol', 'NV Hyaluronic Acid', 'NV Caffeine'])
      .order('name')

    if (timestamps) {
      console.log('⏰ Last updated timestamps:')
      timestamps.forEach(item => {
        console.log(`   ${item.name}: ${item.updated_at || 'No timestamp'}`)
      })
    }

    console.log('\n🌐 SUPABASE DASHBOARD LINK:')
    console.log('https://supabase.com/dashboard/project/ihxfykfggdmanjkropmh/editor/28885')
    console.log('Go to Table Editor > boosters to see the data directly')

  } catch (error) {
    console.error('❌ Failed to check Supabase:', error.message)
  }
}

checkSupabaseDirectly()