const { createClient } = require('@supabase/supabase-js')

// Use service role key for full access
const supabaseAdmin = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
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

async function updateBoostersWithExistingFields() {
  try {
    console.log('🚀 Updating boosters using existing fields...')
    console.log('📝 Using key_ingredients for ingredient lists')
    console.log('🎯 Using target_concerns for benefits (temporarily)')

    // Get all NV boosters
    const { data: boosters, error: fetchError } = await supabaseAdmin
      .from('boosters')
      .select('*')
      .like('name', 'NV %')
      .order('name')

    if (fetchError) {
      throw new Error(`Failed to fetch boosters: ${fetchError.message}`)
    }

    console.log(`Found ${boosters.length} NV boosters`)

    function findPDFData(boosterName) {
      const cleanName = boosterName.replace('NV ', '').toLowerCase().trim()
      const directMatches = {
        'niacinamide': 'NV Niacinamide',
        'ascorbic acid': 'NV Ascorbic Acid',
        'retinol': 'NV Retinol',
        'hyaluronic acid': 'NV Hyaluronic Acid',
        'caffeine': 'NV Caffeine'
      }
      const matchKey = directMatches[cleanName]
      return matchKey ? actualPDFData[matchKey] : null
    }

    let updated = 0
    const results = []

    for (const booster of boosters) {
      const pdfData = findPDFData(booster.name)

      if (pdfData) {
        console.log(`Updating ${booster.name}...`)

        // Create ingredient list as formatted string
        const ingredientString = pdfData.ingredient_list.join(', ')

        const { error: updateError } = await supabaseAdmin
          .from('boosters')
          .update({
            description: pdfData.description,
            key_ingredients: ingredientString,
            target_concerns: pdfData.benefits // Use target_concerns array for benefits temporarily
          })
          .eq('id', booster.id)

        if (updateError) {
          console.error(`❌ Error updating ${booster.name}:`, updateError.message)
          results.push({
            name: booster.name,
            status: 'failed',
            error: updateError.message
          })
        } else {
          updated++
          console.log(`✅ Updated ${booster.name}`)
          results.push({
            name: booster.name,
            status: 'success'
          })
        }

        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 SUCCESSFUL UPDATE COMPLETED!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully updated ${updated} boosters with complete PDF data!`)
    console.log(`📊 Total boosters found: ${boosters.length}`)
    console.log(`🎯 Boosters with PDF data: ${Object.keys(actualPDFData).length}`)
    console.log('\n📋 Data stored in:')
    console.log('   📝 Professional descriptions with clinical data')
    console.log('   🧪 Ingredient lists in key_ingredients field')
    console.log('   🌟 Benefits stored in target_concerns field')
    console.log('\n💡 Note: Benefits are in target_concerns field due to schema limitations')
    console.log('🔬 Your SkinCoach database now has professional nano booster data!')

    return { success: true, updated, total: boosters.length, results }

  } catch (error) {
    console.error('❌ Error updating boosters:', error)
    return { success: false, error: error.message }
  }
}

// Execute the update
updateBoostersWithExistingFields()
  .then((result) => {
    if (result.success) {
      console.log('\n✨ SUCCESS! Boosters updated with complete PDF data!')
    } else {
      console.log('\n❌ Update failed:', result.error)
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })