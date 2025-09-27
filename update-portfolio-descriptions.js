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

// Portfolio 2024 descriptions from pages 20, 21, 23, 25
const portfolioDescriptions = {
  'NV Niacinamide': 'Promotes skin barrier rejuvenation and cell renovation, prevents photo-aging, protects against blue light, treats for Acne vulgaris. It possesses antioxidant properties, evens out skin tone and reduces paleness. It supports atopic dermatitis and rosacea treatment.',

  'NV Ascorbic Acid': 'The original form of Vitamin C in its best version. It promotes even skin tone, hydration, texture and firmness improvement, diminishment of dark spots and also assists in expression lines reduction.',

  'NV Retinol': 'Encapsulated retinol possesses high stability, controlled permeation and prolonged liberation. This active ingredient acts in collagen and elastin synthesis, promoting epidermal renewal and reducing fine wrinkles and aging signs, leaving the skin with a younger and healthier look.',

  'NV Hyaluronic Acid': 'Hyaluronic acid can be incorporated in formulations with the purpose of filling wrinkles and hydrating. It also improves skin elasticity, enhances, and restores facial volume.',

  'NV Caffeine': 'Improves skin aspect and firmness, improves microcirculation, has lipolytic action, helps reduce dark circles and protects the skin from photoaging.'
}

async function updatePortfolioDescriptions() {
  try {
    console.log('🔄 UPDATING BOOSTER DESCRIPTIONS WITH PORTFOLIO 2024 CONTENT...')
    console.log('')

    let updated = 0

    for (const [boosterName, newDescription] of Object.entries(portfolioDescriptions)) {
      console.log(`Updating ${boosterName}...`)

      // Get current description for comparison
      const { data: currentBooster } = await supabase
        .from('boosters')
        .select('description')
        .eq('name', boosterName)
        .single()

      if (currentBooster) {
        console.log(`  OLD: ${currentBooster.description.substring(0, 100)}...`)
        console.log(`  NEW: ${newDescription.substring(0, 100)}...`)
      }

      const { error: updateError } = await supabase
        .from('boosters')
        .update({
          description: newDescription
        })
        .eq('name', boosterName)

      if (updateError) {
        console.error(`❌ Error updating ${boosterName}:`, updateError.message)
      } else {
        updated++
        console.log(`✅ Successfully updated ${boosterName}`)
      }
      console.log('')

      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log('='.repeat(60))
    console.log('🎉 PORTFOLIO 2024 DESCRIPTIONS UPDATE COMPLETED!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully updated ${updated} booster descriptions`)
    console.log('📝 All descriptions now match Portfolio 2024 content')
    console.log('🌟 Professional, concise descriptions from official portfolio')
    console.log('')

    // Verify final state
    console.log('📋 FINAL UPDATED DESCRIPTIONS:')
    for (const [boosterName, description] of Object.entries(portfolioDescriptions)) {
      const { data: finalBooster } = await supabase
        .from('boosters')
        .select('name, description')
        .eq('name', boosterName)
        .single()

      if (finalBooster) {
        console.log(`\n🔹 ${finalBooster.name}:`)
        console.log(`   ${finalBooster.description}`)
      }
    }

    return true

  } catch (error) {
    console.error('❌ Update failed:', error.message)
    return false
  }
}

// Execute update
updatePortfolioDescriptions()
  .then(success => {
    if (success) {
      console.log('\n✨ SUCCESS! All booster descriptions updated with Portfolio 2024 content!')
      console.log('🌟 Your SkinCoach database now has:')
      console.log('   • Professional Portfolio 2024 descriptions')
      console.log('   • Concise, marketing-ready content')
      console.log('   • Consistent professional terminology')
      console.log('   • Official Nanovetores product descriptions')
    } else {
      console.log('\n❌ Update failed')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })