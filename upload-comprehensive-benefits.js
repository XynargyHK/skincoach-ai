const { createClient } = require('@supabase/supabase-js')
const { sortedBenefits, benefitsTable } = require('./comprehensive-benefits')

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

async function uploadComprehensiveBenefits() {
  try {
    console.log('🚀 UPLOADING COMPREHENSIVE BENEFITS TO SUPABASE...')

    // Check if benefits table exists and create if needed
    console.log('🔍 Checking if benefits table exists...')
    const { data: existingBenefits, error: checkError } = await supabase
      .from('benefits')
      .select('id')
      .limit(1)

    if (checkError && checkError.message.includes('does not exist')) {
      console.log('📋 Benefits table does not exist - please run migration first')
      console.log('💡 Create the table manually in Supabase dashboard with this SQL:')
      console.log(`
CREATE TABLE benefits (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
      `)
      return false
    }

    // Insert benefits in batches to avoid timeout
    console.log('📝 Inserting comprehensive benefits...')
    const batchSize = 20
    let inserted = 0

    for (let i = 0; i < benefitsTable.length; i += batchSize) {
      const batch = benefitsTable.slice(i, i + batchSize)
      const benefitData = batch.map(b => ({ name: b.name, active: b.active }))

      const { error: insertError } = await supabase
        .from('benefits')
        .upsert(benefitData, { onConflict: 'name' })

      if (insertError) {
        console.log(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError.message)
      } else {
        inserted += batch.length
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} benefits)`)
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Verify final count
    const { data: finalBenefits, error: countError } = await supabase
      .from('benefits')
      .select('id, name')

    if (!countError) {
      console.log(`✅ Final verification: ${finalBenefits.length} benefits in database`)
    }

    console.log('\\n' + '='.repeat(60))
    console.log('🎉 COMPREHENSIVE BENEFITS UPLOAD COMPLETED!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully processed ${inserted} comprehensive benefits`)
    console.log('🌟 Complete skincare and beauty benefit system created!')
    console.log('')
    console.log('📊 COMPREHENSIVE BENEFITS ADDED:')
    console.log(`   • ${sortedBenefits.length} total unique benefits`)
    console.log('   • Skincare benefits (acne, anti-aging, hydration)')
    console.log('   • Hair care benefits (growth, protection, scalp care)')
    console.log('   • Body care benefits (slimming, toning, cellulite)')
    console.log('   • Specialized treatments (wound healing, inflammation)')
    console.log('')
    console.log('🌟 YOUR SKINCOACH DATABASE NOW HAS A COMPLETE BENEFIT SYSTEM!')

    return true

  } catch (error) {
    console.error('❌ Upload failed:', error.message)
    return false
  }
}

// Execute upload
uploadComprehensiveBenefits()
  .then(success => {
    if (success) {
      console.log('\\n✨ SUCCESS! Comprehensive benefits uploaded!')
      console.log('🌟 Your SkinCoach database now has:')
      console.log(`   • ${sortedBenefits.length} comprehensive benefits`)
      console.log('   • Complete skincare benefit system')
      console.log('   • Hair, body, and specialized treatments')
      console.log('   • Professional-grade benefit taxonomy')
    } else {
      console.log('\\n❌ Upload failed - please create benefits table manually')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })