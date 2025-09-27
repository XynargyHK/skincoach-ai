// Comprehensive update of all nano boosters with actual PDF content
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

// Extracted PDF data with actual descriptions, ingredients, and benefits
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

// Function to extract clean booster name for matching
function extractCleanName(dbName) {
  return dbName.replace('NV ', '').toLowerCase().trim()
}

// Function to find matching PDF data
function findPDFData(boosterName) {
  const cleanName = extractCleanName(boosterName)

  // Direct matches
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

// Function to update booster descriptions only (without new columns)
async function updateBoosterDescriptions() {
  try {
    console.log('🚀 Starting to update booster descriptions with actual PDF content...')

    // Get all NV boosters
    const { data: boosters, error } = await supabase
      .from('boosters')
      .select('*')
      .like('name', 'NV %')
      .order('name')

    if (error) {
      console.error('Error fetching boosters:', error)
      return
    }

    console.log(`Found ${boosters.length} NV boosters to update`)

    let updated = 0

    for (const booster of boosters) {
      const pdfData = findPDFData(booster.name)

      if (pdfData) {
        console.log(`Updating ${booster.name}...`)

        // Update only description for now
        const { error: updateError } = await supabase
          .from('boosters')
          .update({
            description: pdfData.description
          })
          .eq('id', booster.id)

        if (updateError) {
          console.error(`Error updating ${booster.name}:`, updateError)
        } else {
          updated++
          console.log(`✅ Updated ${booster.name} description`)
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        console.log(`⚠️  No PDF data found for ${booster.name}`)
      }
    }

    console.log(`\n🎉 Successfully updated ${updated} booster descriptions with actual PDF content!`)

    // Display the data we would add to new columns
    console.log('\n📋 Ingredient Lists and Benefits to be added:')
    Object.entries(actualPDFData).forEach(([name, data]) => {
      console.log(`\n${name}:`)
      console.log(`  Ingredients: ${data.ingredient_list.join(', ')}`)
      console.log(`  Benefits: ${data.benefits.join(', ')}`)
    })

  } catch (error) {
    console.error('Error updating boosters:', error)
  }
}

// Run the update
updateBoosterDescriptions()
  .then(() => {
    console.log('\n✨ Booster description update process completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Run the SQL commands in Supabase to add ingredient_list and benefits columns')
    console.log('2. Then run the full update script to populate these new columns')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Update process failed:', error)
    process.exit(1)
  })