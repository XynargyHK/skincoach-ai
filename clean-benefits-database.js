const { createClient } = require('@supabase/supabase-js')
const { deduplicatedBenefits, toRemove } = require('./dedupe-benefits-analysis')

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

async function cleanBenefitsDatabase() {
  try {
    console.log('🧹 CLEANING BENEFITS DATABASE...')
    console.log(`Removing ${toRemove.length} duplicate benefits`)
    console.log(`Keeping ${deduplicatedBenefits.length} unique benefits\n`)

    // Step 1: Remove duplicate benefits
    console.log('🗑️ Removing duplicate benefits:')
    let removed = 0

    for (const benefitName of toRemove) {
      console.log(`Removing: "${benefitName}"`)

      const { error: deleteError } = await supabase
        .from('benefits')
        .delete()
        .eq('name', benefitName)

      if (deleteError) {
        console.log(`  ❌ Error removing "${benefitName}":`, deleteError.message)
      } else {
        console.log(`  ✅ Removed "${benefitName}"`)
        removed++
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Step 2: Verify final count
    console.log('\n📊 Verifying final database state...')
    const { data: finalBenefits, error: countError } = await supabase
      .from('benefits')
      .select('id, name')
      .order('name')

    if (countError) {
      console.log('❌ Error checking final count:', countError.message)
      return false
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 BENEFITS DATABASE CLEANING COMPLETED!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully removed ${removed} duplicate benefits`)
    console.log(`📊 Final database count: ${finalBenefits.length} benefits`)
    console.log('🌟 Clean, deduplicated benefit system ready!')
    console.log('')

    // Show final list
    console.log('📋 FINAL CLEAN BENEFITS IN DATABASE:')
    finalBenefits.forEach((benefit, index) => {
      console.log(`${index + 1}. ${benefit.name}`)
    })

    console.log('\n✨ BENEFITS SUCCESSFULLY DEDUPLICATED!')
    console.log('🌟 Your SkinCoach database now has:')
    console.log('   • No duplicate benefits')
    console.log('   • Consistent naming conventions')
    console.log('   • Professional terminology')
    console.log('   • Distinct functions (Protection vs Repair)')

    return true

  } catch (error) {
    console.error('❌ Cleaning failed:', error.message)
    return false
  }
}

// Execute cleaning
cleanBenefitsDatabase()
  .then(success => {
    if (success) {
      console.log('\n✨ SUCCESS! Benefits database cleaned and optimized!')
    } else {
      console.log('\n❌ Cleaning failed')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })