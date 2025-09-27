const { createClient } = require('@supabase/supabase-js')
const { sortedBenefits, benefitsTable, allBenefitsFromPDFs } = require('./simple-keywords-benefits')

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

async function uploadSimpleBenefits() {
  try {
    console.log('🚀 CREATING BENEFITS TABLE AND UPLOADING SIMPLE KEYWORDS...')

    // Step 1: Create benefits table
    console.log('📋 Creating benefits table...')
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS benefits (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    })

    if (createTableError && !createTableError.message.includes('already exists')) {
      console.log('❌ Table creation failed:', createTableError.message)
      console.log('💡 Trying alternative approach...')
    }

    // Step 2: Insert benefits data
    console.log('📝 Inserting benefits data...')
    const { data, error: insertError } = await supabase
      .from('benefits')
      .upsert(benefitsTable.map(b => ({ name: b.name, active: b.active })), {
        onConflict: 'name'
      })

    if (insertError) {
      console.log('❌ Benefits insert error:', insertError.message)
      return false
    }

    console.log('✅ Benefits data inserted successfully!')

    // Step 3: Create booster_benefits mapping table
    console.log('🔗 Creating booster_benefits mapping table...')
    const { error: mappingTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS booster_benefits (
          id SERIAL PRIMARY KEY,
          booster_id INTEGER REFERENCES boosters(id),
          benefit_id INTEGER REFERENCES benefits(id),
          UNIQUE(booster_id, benefit_id)
        );
      `
    })

    if (mappingTableError && !mappingTableError.message.includes('already exists')) {
      console.log('❌ Mapping table creation failed:', mappingTableError.message)
      console.log('💡 Continuing without mapping table...')
    }

    // Step 4: Get boosters and benefits for mapping
    console.log('🔍 Creating booster-benefit mappings...')
    const { data: boosters } = await supabase
      .from('boosters')
      .select('id, name')

    const { data: benefits } = await supabase
      .from('benefits')
      .select('id, name')

    if (boosters && benefits) {
      let mappings = []

      for (const [boosterName, boosterBenefits] of Object.entries(allBenefitsFromPDFs)) {
        const booster = boosters.find(b => b.name === boosterName)
        if (booster) {
          for (const benefitName of boosterBenefits) {
            const benefit = benefits.find(b => b.name === benefitName)
            if (benefit) {
              mappings.push({
                booster_id: booster.id,
                benefit_id: benefit.id
              })
            }
          }
        }
      }

      if (mappings.length > 0) {
        const { error: mappingError } = await supabase
          .from('booster_benefits')
          .upsert(mappings, { onConflict: 'booster_id,benefit_id' })

        if (mappingError) {
          console.log('❌ Mapping insert error:', mappingError.message)
        } else {
          console.log(`✅ Created ${mappings.length} booster-benefit mappings!`)
        }
      }
    }

    console.log('\\n' + '='.repeat(60))
    console.log('🎉 SIMPLE KEYWORD BENEFITS UPLOAD COMPLETED!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully uploaded ${sortedBenefits.length} simple keyword benefits`)
    console.log('📝 Clean, simple benefit names for better UX')
    console.log('🔗 Booster-benefit relationships mapped')
    console.log('')
    console.log('🌟 SIMPLE KEYWORD BENEFITS ADDED:')
    sortedBenefits.forEach((benefit, index) => {
      console.log(`   ${index + 1}. ${benefit}`)
    })

    return true

  } catch (error) {
    console.error('❌ Upload failed:', error.message)
    return false
  }
}

// Execute upload
uploadSimpleBenefits()
  .then(success => {
    if (success) {
      console.log('\\n✨ SUCCESS! Simple keyword benefits uploaded!')
      console.log('🌟 Your SkinCoach database now has:')
      console.log('   • 26 simple keyword benefits')
      console.log('   • Clean benefit names for better UX')
      console.log('   • Booster-benefit relationship mappings')
      console.log('   • Professional skincare benefit system')
    } else {
      console.log('\\n❌ Upload failed')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })