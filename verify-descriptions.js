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

async function verifyDescriptions() {
  try {
    console.log('🔍 CHECKING CURRENT BOOSTER DESCRIPTIONS IN DATABASE...\n')

    const { data: boosters, error } = await supabase
      .from('boosters')
      .select('name, description')
      .in('name', ['NV Niacinamide', 'NV Ascorbic Acid', 'NV Retinol', 'NV Hyaluronic Acid', 'NV Caffeine'])
      .order('name')

    if (error) {
      console.error('❌ Error fetching boosters:', error.message)
      return
    }

    if (!boosters || boosters.length === 0) {
      console.log('❌ No boosters found in database')
      return
    }

    console.log(`📊 Found ${boosters.length} boosters:\n`)

    boosters.forEach((booster, index) => {
      console.log(`${index + 1}. 🔹 ${booster.name}:`)
      console.log(`   "${booster.description}"`)
      console.log('')
    })

    // Expected Portfolio 2024 descriptions
    const expectedDescriptions = {
      'NV Niacinamide': 'Promotes skin barrier rejuvenation and cell renovation, prevents photo-aging, protects against blue light, treats for Acne vulgaris. It possesses antioxidant properties, evens out skin tone and reduces paleness. It supports atopic dermatitis and rosacea treatment.',
      'NV Ascorbic Acid': 'The original form of Vitamin C in its best version. It promotes even skin tone, hydration, texture and firmness improvement, diminishment of dark spots and also assists in expression lines reduction.',
      'NV Retinol': 'Encapsulated retinol possesses high stability, controlled permeation and prolonged liberation. This active ingredient acts in collagen and elastin synthesis, promoting epidermal renewal and reducing fine wrinkles and aging signs, leaving the skin with a younger and healthier look.',
      'NV Hyaluronic Acid': 'Hyaluronic acid can be incorporated in formulations with the purpose of filling wrinkles and hydrating. It also improves skin elasticity, enhances, and restores facial volume.',
      'NV Caffeine': 'Improves skin aspect and firmness, improves microcirculation, has lipolytic action, helps reduce dark circles and protects the skin from photoaging.'
    }

    console.log('✅ VERIFICATION RESULTS:')
    let allUpdated = true

    boosters.forEach(booster => {
      const expected = expectedDescriptions[booster.name]
      const matches = booster.description === expected

      console.log(`${matches ? '✅' : '❌'} ${booster.name}: ${matches ? 'UPDATED' : 'NOT UPDATED'}`)

      if (!matches) {
        allUpdated = false
        console.log(`   Expected: "${expected.substring(0, 50)}..."`)
        console.log(`   Current:  "${booster.description.substring(0, 50)}..."`)
      }
    })

    console.log(`\n${allUpdated ? '🎉 ALL DESCRIPTIONS SUCCESSFULLY UPDATED!' : '⚠️  SOME DESCRIPTIONS NOT UPDATED'}`)

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifyDescriptions()