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

async function checkBoosterNames() {
  try {
    console.log('🔍 Checking actual booster names...')

    const { data: boosters, error } = await supabase
      .from('boosters')
      .select('id, name')
      .like('name', 'NV %')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch boosters: ${error.message}`)
    }

    console.log(`\nFound ${boosters.length} NV boosters:\n`)

    boosters.forEach((booster, index) => {
      const cleanName = booster.name.replace('NV ', '').toLowerCase().trim()
      console.log(`${index + 1}. "${booster.name}" -> cleaned: "${cleanName}"`)
    })

    // Check our mapping
    const directMatches = {
      'niacinamide': 'NV Niacinamide',
      'ascorbic acid': 'NV Ascorbic Acid',
      'retinol': 'NV Retinol',
      'hyaluronic acid': 'NV Hyaluronic Acid',
      'caffeine': 'NV Caffeine'
    }

    console.log('\n🎯 Our mapping matches:')
    boosters.forEach(booster => {
      const cleanName = booster.name.replace('NV ', '').toLowerCase().trim()
      const matchKey = directMatches[cleanName]
      if (matchKey) {
        console.log(`✅ ${booster.name} -> ${matchKey}`)
      } else {
        console.log(`❌ ${booster.name} -> NO MATCH`)
      }
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkBoosterNames()