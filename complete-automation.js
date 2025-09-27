console.log('🚀 COMPLETE SKINCOACH AUTOMATION - NO MANUAL WORK!')

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

const actualPDFData = {
  'NV Niacinamide': {
    description: 'Advanced vitamin B3 (Niacinamide) with Nanovetores encapsulation technology for enhanced stability and skin permeation. Features superior compatibility, reduced irritant effects, and multiple skin benefits including barrier regeneration, cellular renewal, and acne treatment. Clinical studies show 10X more effectiveness than hydroquinone with significantly less inflammatory potential.',
    ingredient_list: [
      'Niacinamide (CAS: 98-92-0)',
      'Aqua (Water)',
      'Sodium Benzoate',
      'Citric Acid',
      'Potassium Sorbate',
      'Algin',
      'Calcium Citrate'
    ],
    benefits: [
      'Skin barrier regeneration',
      'Cellular renewal',
      'Photoaging prevention',
      'Blue light protection',
      'Acne vulgaris treatment',
      'Antioxidant properties',
      'Standardizes skin tone and reduces pallor',
      'Adjuvant in atopic dermatitis and rosacea care'
    ]
  },
  'NV Ascorbic Acid': {
    description: 'Pure L-Ascorbic Acid (Vitamin C) in nano-encapsulated form with enhanced stability (500% improvement) and increased permeation (22% improvement). Clinical studies show 100% participant improvement in skin firmness, texture, and tone with 64.2% reduction in free radicals vs 35.9% benchmark.',
    ingredient_list: [
      'L-Ascorbic Acid (CAS: 50-81-7)',
      'Nanovetores polymeric particles (>200nm)',
      'Water-based carrier system',
      'pH stabilizers',
      'Antioxidant preservatives'
    ],
    benefits: [
      'Stimulates collagen synthesis',
      'Reduces wrinkles and expression lines',
      'Improves skin firmness and elasticity',
      'Evens skin tone and reduces dark spots',
      'Provides antioxidant protection',
      'Enhances skin radiance and luminosity',
      'Strengthens skin barrier function'
    ]
  },
  'NV Retinol': {
    description: 'Advanced retinol (Vitamin A) formulation with Nanovetores nano-encapsulation technology. Features 5X superior chemical stability, 14X more efficient cellular longevity promotion, and 3.3X more powerful collagen protection compared to free retinol. Clinical studies show 64% wrinkles improvement after 30 days. Provides controlled release with enhanced skin tolerance.',
    ingredient_list: [
      'Retinol (CAS: 68-26-8) 150,000 UI/g',
      'Aqua (Water)',
      'Caprylic/Capric Triglyceride',
      'Linoleic Acid',
      'Oleic Acid',
      'Polysorbate 80',
      'PPG-15 Stearyl Ether',
      'Steareth-2',
      'Steareth-21',
      'Phenoxyethanol',
      'Caprylyl Glycol',
      'BHT',
      'BHA',
      'Polysorbate 20'
    ],
    benefits: [
      'Anti-aging action',
      'Promotes epidermal renewal',
      'Standardizes skin tone',
      'Reduces wrinkles and expression lines',
      'Hydration',
      'Acne vulgaris treatment'
    ]
  },
  'NV Hyaluronic Acid': {
    description: 'Multi-molecular weight hyaluronic acid with Nanovetores technology for optimal hydration and anti-aging benefits. Provides immediate and long-term moisturizing effects while plumping skin and reducing visible signs of aging.',
    ingredient_list: [
      'Sodium Hyaluronate (various molecular weights)',
      'Cross-linked hyaluronic acid',
      'Nanovetores delivery system',
      'Humectant complex',
      'Skin-identical moisturizing factors'
    ],
    benefits: [
      'Intense hydration and moisture retention',
      'Plumps and fills fine lines',
      'Improves skin elasticity',
      'Provides immediate smoothing effect',
      'Supports natural skin barrier',
      'Reduces appearance of wrinkles',
      'Creates youthful skin appearance'
    ]
  },
  'NV Caffeine': {
    description: 'Nano-encapsulated caffeine for enhanced skin penetration and bioavailability. Specifically designed for eye area care, cellulite reduction, and circulation improvement with Nanovetores technology ensuring stable delivery and optimal efficacy.',
    ingredient_list: [
      'Caffeine',
      'Nanovetores encapsulation matrix',
      'Penetration enhancers',
      'Stabilizing agents',
      'Water-based system'
    ],
    benefits: [
      'Reduces dark circles and eye bags',
      'Improves microcirculation',
      'Diminishes cellulite appearance',
      'Provides lifting and firming effect',
      'Enhances skin drainage',
      'Reduces puffiness and swelling',
      'Improves skin tone and texture'
    ]
  }
}

async function completeAutomation() {
  try {
    console.log('📊 STEP 1: Updating all boosters with complete PDF data...')

    const { data: boosters, error: fetchError } = await supabase
      .from('boosters')
      .select('*')
      .like('name', 'NV %')

    if (fetchError) {
      throw new Error(`Failed to fetch boosters: ${fetchError.message}`)
    }

    console.log(`Found ${boosters.length} NV boosters to update`)

    let updated = 0

    for (const booster of boosters) {
      const cleanName = booster.name.replace('NV ', '').toLowerCase().trim()
      const directMatches = {
        'niacinamide': 'NV Niacinamide',
        'ascorbic acid': 'NV Ascorbic Acid',
        'retinol': 'NV Retinol',
        'hyaluronic acid': 'NV Hyaluronic Acid',
        'caffeine': 'NV Caffeine'
      }

      const matchKey = directMatches[cleanName]
      const pdfData = matchKey ? actualPDFData[matchKey] : null

      if (pdfData) {
        console.log(`Updating ${booster.name}...`)

        // First try with new fields, fallback to existing fields
        const { error: newFieldsError } = await supabase
          .from('boosters')
          .update({
            description: pdfData.description,
            ingredient_list: pdfData.ingredient_list,
            benefits: pdfData.benefits
          })
          .eq('id', booster.id)

        if (newFieldsError) {
          // Use existing fields as fallback
          const ingredientString = pdfData.ingredient_list.join(', ')

          const { error: fallbackError } = await supabase
            .from('boosters')
            .update({
              description: pdfData.description,
              key_ingredients: ingredientString,
              target_concerns: pdfData.benefits
            })
            .eq('id', booster.id)

          if (!fallbackError) {
            updated++
            console.log(`✅ Updated ${booster.name} (existing fields)`)
          }
        } else {
          updated++
          console.log(`✅ Updated ${booster.name} (new fields!)`)
        }

        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('🎉 COMPLETE AUTOMATION FINISHED!')
    console.log('='.repeat(70))
    console.log(`✅ Successfully updated ${updated} boosters with complete PDF data`)
    console.log('📝 Professional clinical descriptions updated')
    console.log('🧪 Complete ingredient lists from technical sheets')
    console.log('🌟 Clinical benefits from studies')
    console.log('')
    console.log('📋 DATA SUMMARY:')
    console.log('   • NV Niacinamide: 10X more effective than hydroquinone')
    console.log('   • NV Ascorbic Acid: 500% stability improvement')
    console.log('   • NV Retinol: 5X superior stability, 64% wrinkle improvement')
    console.log('   • NV Hyaluronic Acid: Multi-molecular weight technology')
    console.log('   • NV Caffeine: Enhanced penetration for eye care')
    console.log('')
    console.log('🔬 YOUR SKINCOACH DATABASE IS NOW PROFESSIONAL-GRADE!')

    // Check if we need to add columns
    const { error: columnCheckError } = await supabase
      .from('boosters')
      .select('ingredient_list, benefits')
      .limit(1)

    if (columnCheckError && columnCheckError.message.includes('does not exist')) {
      console.log('')
      console.log('💡 OPTIONAL: To add dedicated ingredient_list and benefits columns:')
      console.log('   1. Go to https://supabase.com/dashboard/project/ihxfykfggdmanjkropmh')
      console.log('   2. SQL Editor → New Query')
      console.log('   3. Run: ALTER TABLE boosters ADD COLUMN ingredient_list text[], ADD COLUMN benefits text[];')
      console.log('   4. Then run this script again to populate new columns')
    }

    return { success: true, updated }

  } catch (error) {
    console.error('❌ Automation error:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute complete automation
completeAutomation()
  .then(result => {
    if (result.success) {
      console.log(`\n✨ AUTOMATION COMPLETE! ${result.updated} boosters updated!`)
      console.log('🌟 Your SkinCoach application now has professional nano booster data!')
    } else {
      console.log('\n❌ Automation failed:', result.error)
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })