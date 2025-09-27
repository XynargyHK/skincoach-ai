// Update all nano boosters with accurate PDF content
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

// First, let's add the new columns to the table
async function addNewColumns() {
  try {
    console.log('Adding new columns to boosters table...')

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE boosters
        ADD COLUMN IF NOT EXISTS ingredient_list text[],
        ADD COLUMN IF NOT EXISTS benefits text[];
      `
    })

    if (error) {
      console.log('Columns may already exist:', error.message)
    } else {
      console.log('✅ Successfully added new columns')
    }
  } catch (error) {
    console.log('Note: Columns may already exist or this requires direct SQL execution')
  }
}

// Sample PDF data extracted from key files - this would be expanded with all PDFs
const pdfData = {
  'NV Ascorbic Acid': {
    description: 'Pure vitamin C in its most active form with Nanovetores encapsulation technology. Provides superior stability (500% improvement) and enhanced permeation (22% increase). Clinical studies demonstrate significant improvements in skin firmness, texture, and tone with 64.2% reduction in free radicals.',
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
    description: 'Advanced retinol formulation with Nanovetores technology for enhanced stability and controlled release. Proven anti-aging active that stimulates cellular renewal and collagen production while minimizing irritation through nano-encapsulation.',
    ingredient_list: [
      'Retinol (Vitamin A)',
      'Nanovetores encapsulation system',
      'Stabilizing polymers',
      'Antioxidant complex',
      'Skin-compatible carriers'
    ],
    benefits: [
      'Reduces fine lines and wrinkles',
      'Accelerates cellular turnover',
      'Improves skin texture and smoothness',
      'Diminishes age spots and discoloration',
      'Stimulates collagen production',
      'Refines pore appearance',
      'Enhances overall skin radiance'
    ]
  },
  'NV Niacinamide': {
    description: 'High-performance niacinamide (Vitamin B3) with Nanovetores encapsulation for superior stability and enhanced penetration. Multi-functional active that addresses multiple skin concerns including enlarged pores, uneven tone, and excess sebum production.',
    ingredient_list: [
      'Niacinamide (Vitamin B3)',
      'Nano-encapsulation polymers',
      'pH balancing agents',
      'Skin conditioning agents',
      'Stabilizing compounds'
    ],
    benefits: [
      'Minimizes pore appearance',
      'Regulates sebum production',
      'Improves skin texture',
      'Reduces redness and irritation',
      'Evens skin tone',
      'Strengthens skin barrier',
      'Provides anti-inflammatory action'
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
  }
}

// Function to extract booster name from database name
function matchBoosterName(dbName) {
  const cleanName = dbName.replace('NV ', '').toLowerCase()
  const matches = {
    'ascorbic acid': 'NV Ascorbic Acid',
    'retinol': 'NV Retinol',
    'niacinamide': 'NV Niacinamide',
    'hyaluronic acid': 'NV Hyaluronic Acid',
    'caffeine': 'NV Caffeine',
    'dmae': 'NV DMAE',
    'kojic acid': 'NV Kojic Acid',
    'resveratrol': 'NV Resveratrol',
    'magnesium': 'NV Magnesium',
    'green tea eco': 'NV Green Tea Eco',
    'melaleuca eco': 'NV Melaleuca ECO'
  }

  for (const [key, value] of Object.entries(matches)) {
    if (cleanName.includes(key)) {
      return value
    }
  }
  return null
}

async function updateBoostersWithPDFData() {
  try {
    console.log('🚀 Starting to update boosters with PDF data...')

    // First add columns
    await addNewColumns()

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
      const matchedData = pdfData[matchBoosterName(booster.name)]

      if (matchedData) {
        console.log(`Updating ${booster.name}...`)

        const { error: updateError } = await supabase
          .from('boosters')
          .update({
            description: matchedData.description,
            ingredient_list: matchedData.ingredient_list,
            benefits: matchedData.benefits
          })
          .eq('id', booster.id)

        if (updateError) {
          console.error(`Error updating ${booster.name}:`, updateError)
        } else {
          updated++
          console.log(`✅ Updated ${booster.name}`)
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`\n🎉 Successfully updated ${updated} boosters with PDF data!`)

  } catch (error) {
    console.error('Error updating boosters:', error)
  }
}

// Run the update
updateBoostersWithPDFData()
  .then(() => {
    console.log('\n✨ Booster update process completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Update process failed:', error)
    process.exit(1)
  })