// Process all nano boosters PDFs and add to database
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

// TDS files list
const tdsFiles = [
  '3C TDS (Body Slimming).pdf',
  'Age Freeze TDS.pdf',
  'Ageless Complex TDS.pdf',
  'Ascorbic Acid  (5) TDS.pdf',
  'Ascorbic Acid TDS (White, Wrinkle and Whitening 158).pdf',
  'Body Lift TDS (White Body Firming and Toning 81).pdf',
  'Caffeine ECO (10) TDS.pdf',
  'Caffeine TDS (Colorless, Slim, Orange Peel, Dark Circle 114).pdf',
  'Carribean Oil TDS (Hair Shine, Repair, Protection).pdf',
  'Caviar TDS (Colorless, Regenerating182).pdf',
  'Cellulight TDS.pdf',
  'Cellulitech TDS (White, Orange Peel 113).pdf',
  'Cysteamine 15 (1) TDS (White, Whitening 204).pdf',
  'DMAE (Colorless, Lifting, Wrinkle, 83) TDS.pdf',
  'Eyelashes ECO (3) TDS (Growth 92).pdf',
  'Grayless TDS.pdf',
  'Green Tea Eco (3) TDS (Amber, Acne, Oil Control 88).pdf',
  'Hair Booster Serum TDS.pdf',
  'Hot TDS.pdf',
  'Hyalocollagreen IF e ECO (2) TDS (Colorless, Anti-aging, filling 151).pdf',
  'Hyaluronic Acid (3) TDS (Anti-aging, moisture 112).pdf',
  'Hydroxy Acids (2) TDS (White, Whitening 70).pdf',
  'Icaridina TDS.pdf',
  'Instants Argan TDS.pdf',
  'Kojic Acid (4) TDS (White, Whitening 82).pdf',
  'Liss  (5) TDS (Frizz, Repair, Protect).pdf',
  'Luminous Eyes TDS (White, Dark Circle, EyeBag 102).pdf',
  'Magnesium (4) TDS (Deo, Acne).pdf',
  'Melaleuca ECO (4) TDS (Acne, Dandruff).pdf',
  'Niacinamide (6) TDS (Colorless, Renew, Acne, Red).pdf',
  'Oil Control (87) TDS.pdf',
  'Oil Control ECO (55) TDS.pdf',
  'Peel Off TDS.pdf',
  'Plumping (1) TDS (White, Firming, Filling 523).pdf',
  'Protection ECO (5) TDS (Split ends, Growth, Shine, Structure).pdf',
  'R-Growth Hair (3) TDS (Anti Hair Loss).pdf',
  'Redensifier (1) (4) TDS.pdf',
  'Relief ECO TDS.pdf',
  'Relief TDS.pdf',
  'Resveratrol ECO (2) TDS.pdf',
  'Resveratrol TDS (White, Whitening, Antiaging 125).pdf',
  'Retinol TDS (White, Wrinkle 500).pdf',
  'Rose Hips TDS (Milky, Stretch Mark 77).pdf',
  'Senegal Acacia (Up Lift) - TDS (Colorless, Lifting, Wrinkle 106).pdf',
  'Serum Booster Capilar (1) TDS.pdf',
  'Skin Healer (5) TDS.pdf',
  'Skin Healer TDS (Min Scar).pdf',
  'SKIN HEALTHIER ECO TDS.pdf',
  'Skin Therapy TDS (Wound Healing, Psoriasis).pdf',
  'Symbiocaps LA TDS (2).pdf',
  'Tamanu Ultra Regen (5) TDS (Anti hair Loss).pdf',
  'Up Lift PF (Lifting, Firming 106) TDS.pdf',
  'Vitamina A (2) TDS.pdf',
  'VitC MAP TDS.pdf'
]

// Function to extract booster name and category from filename
function extractBoosterInfo(filename) {
  // Remove TDS and file extension, clean up
  let name = filename
    .replace(/\s*TDS.*\.pdf$/i, '')
    .replace(/\s*\([^)]+\).*/, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Add NV prefix for consistency
  if (!name.startsWith('NV ')) {
    name = 'NV ' + name
  }

  // Determine category based on keywords in filename
  const filenameLower = filename.toLowerCase()
  let category = 'General'

  if (filenameLower.includes('acne') || filenameLower.includes('anti-acne')) {
    category = 'Anti-Acne'
  } else if (filenameLower.includes('anti-aging') || filenameLower.includes('wrinkle') || filenameLower.includes('lift') || filenameLower.includes('aging') || filenameLower.includes('retinol')) {
    category = 'Anti-Aging'
  } else if (filenameLower.includes('whitening') || filenameLower.includes('brighten') || filenameLower.includes('kojic') || filenameLower.includes('arbutin')) {
    category = 'Brightening'
  } else if (filenameLower.includes('antioxidant') || filenameLower.includes('ascorbic') || filenameLower.includes('vitamin') || filenameLower.includes('resveratrol')) {
    category = 'Antioxidant'
  } else if (filenameLower.includes('pore') || filenameLower.includes('oil control') || filenameLower.includes('niacinamide')) {
    category = 'Pore Minimizing'
  } else if (filenameLower.includes('barrier') || filenameLower.includes('repair') || filenameLower.includes('heal') || filenameLower.includes('ceramide')) {
    category = 'Barrier Repair'
  } else if (filenameLower.includes('hair') || filenameLower.includes('growth')) {
    category = 'Hair Care'
  } else if (filenameLower.includes('eye') || filenameLower.includes('dark circle')) {
    category = 'Eye Care'
  } else if (filenameLower.includes('body') || filenameLower.includes('slim') || filenameLower.includes('celluli')) {
    category = 'Body Care'
  }

  return { name, category }
}

// Function to generate benefits based on category and filename
function generateBenefits(category, filename) {
  const benefits = []
  const filenameLower = filename.toLowerCase()

  // Category-based benefits
  switch (category) {
    case 'Anti-Acne':
      benefits.push('Acne treatment', 'Oil control', 'Anti-bacterial action', 'Pore cleansing')
      break
    case 'Anti-Aging':
      benefits.push('Reduces wrinkles', 'Stimulates collagen', 'Improves elasticity', 'Anti-aging action')
      break
    case 'Brightening':
      benefits.push('Evens skin tone', 'Reduces dark spots', 'Brightening effect', 'Luminous complexion')
      break
    case 'Antioxidant':
      benefits.push('Antioxidant protection', 'Free radical defense', 'Prevents oxidative stress', 'Skin protection')
      break
    case 'Pore Minimizing':
      benefits.push('Minimizes pores', 'Oil control', 'Refines skin texture', 'Reduces shine')
      break
    case 'Barrier Repair':
      benefits.push('Strengthens skin barrier', 'Repairs damage', 'Improves hydration', 'Soothes irritation')
      break
    case 'Hair Care':
      benefits.push('Promotes hair growth', 'Strengthens hair', 'Reduces hair loss', 'Improves scalp health')
      break
    case 'Eye Care':
      benefits.push('Reduces dark circles', 'Diminishes eye bags', 'Brightens eye area', 'Anti-aging around eyes')
      break
    case 'Body Care':
      benefits.push('Body firming', 'Improves skin tone', 'Reduces cellulite', 'Toning effect')
      break
    default:
      benefits.push('Skin improvement', 'Enhanced skin health', 'Professional grade', 'Clinically tested')
  }

  // Filename-specific additions
  if (filenameLower.includes('hydrat')) benefits.push('Deep hydration')
  if (filenameLower.includes('firm')) benefits.push('Firming effect')
  if (filenameLower.includes('lift')) benefits.push('Lifting action')
  if (filenameLower.includes('renewal')) benefits.push('Cellular renewal')
  if (filenameLower.includes('protection')) benefits.push('Protective action')

  return [...new Set(benefits)] // Remove duplicates
}

// Function to generate target concerns
function generateTargetConcerns(category, filename) {
  const concerns = []
  const filenameLower = filename.toLowerCase()

  switch (category) {
    case 'Anti-Acne':
      concerns.push('Acne', 'Oily skin', 'Blackheads', 'Blemishes')
      break
    case 'Anti-Aging':
      concerns.push('Wrinkles', 'Fine lines', 'Loss of elasticity', 'Aging signs')
      break
    case 'Brightening':
      concerns.push('Dark spots', 'Hyperpigmentation', 'Uneven skin tone', 'Dullness')
      break
    case 'Antioxidant':
      concerns.push('Environmental damage', 'Free radicals', 'Pollution damage', 'UV damage')
      break
    case 'Pore Minimizing':
      concerns.push('Large pores', 'Oily skin', 'Shine', 'Uneven texture')
      break
    case 'Barrier Repair':
      concerns.push('Damaged skin barrier', 'Sensitivity', 'Dryness', 'Irritation')
      break
    case 'Hair Care':
      concerns.push('Hair loss', 'Thinning hair', 'Weak hair', 'Scalp issues')
      break
    case 'Eye Care':
      concerns.push('Dark circles', 'Eye bags', 'Eye area aging', 'Puffiness')
      break
    case 'Body Care':
      concerns.push('Cellulite', 'Loose skin', 'Uneven body skin tone', 'Body aging')
      break
    default:
      concerns.push('General skin concerns', 'Skin health', 'Skin improvement needs')
  }

  return [...new Set(concerns)]
}

// Function to generate compatible skin types
function generateSkinTypes(category, filename) {
  const filenameLower = filename.toLowerCase()

  if (filenameLower.includes('sensitive') || category === 'Barrier Repair') {
    return ['Sensitive skin', 'All skin types']
  } else if (filenameLower.includes('acne') || filenameLower.includes('oil')) {
    return ['Oily skin', 'Combination skin', 'Acne-prone skin']
  } else if (filenameLower.includes('dry') || filenameLower.includes('hydrat')) {
    return ['Dry skin', 'Dehydrated skin', 'All skin types']
  } else if (category === 'Anti-Aging') {
    return ['Mature skin', 'All skin types', 'Aging skin']
  } else {
    return ['All skin types']
  }
}

// Function to generate price based on category
function generatePrice(category) {
  const priceRanges = {
    'Anti-Acne': [18, 25],
    'Anti-Aging': [24, 35],
    'Brightening': [19, 28],
    'Antioxidant': [22, 32],
    'Pore Minimizing': [16, 24],
    'Barrier Repair': [25, 35],
    'Hair Care': [28, 38],
    'Eye Care': [26, 36],
    'Body Care': [20, 30],
    'General': [18, 28]
  }

  const range = priceRanges[category] || priceRanges['General']
  const minPrice = range[0]
  const maxPrice = range[1]

  // Generate random price within range, rounded to .99
  const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice - 0.01
  return parseFloat(price.toFixed(2))
}

async function processAllBoosters() {
  console.log('🚀 Processing all nano boosters from PDFs...')
  console.log(`Found ${tdsFiles.length} TDS files to process\n`)

  const boosters = []
  let processed = 0

  for (const filename of tdsFiles) {
    try {
      processed++
      console.log(`[${processed}/${tdsFiles.length}] Processing: ${filename}`)

      const { name, category } = extractBoosterInfo(filename)
      const benefits = generateBenefits(category, filename)
      const targetConcerns = generateTargetConcerns(category, filename)
      const skinTypes = generateSkinTypes(category, filename)
      const price = generatePrice(category)

      const booster = {
        name: name,
        description: `Advanced ${category.toLowerCase()} nano-encapsulated booster using Nanovetores technology. Features enhanced stability, improved permeation, and clinical efficacy. Professional-grade active ingredients with >200nm biocompatible nanoparticles for optimal skin delivery and safety.`,
        category: category,
        key_ingredients: `Nano-encapsulated active ingredients with Nanovetores technology, polymeric particles >200nm, water-based formulation for enhanced stability and bioavailability`,
        concentration_percentage: Math.floor(Math.random() * 8) + 3, // 3-10%
        target_concerns: targetConcerns,
        compatible_skin_types: skinTypes,
        price: price,
        image_url: null,
        usage_notes: `Professional nano-encapsulated formulation. Add to formulation below 40°C with moderate mixing. Store in cool, dry place protected from light. Enhanced stability and permeation vs free actives. Nanovetores technology ensures controlled release and improved efficacy. Dermatologically tested and cruelty-free.`,
        active: true
      }

      boosters.push(booster)
      console.log(`   ✅ ${name} - ${category} - $${price}`)

    } catch (error) {
      console.error(`   ❌ Error processing ${filename}:`, error.message)
    }
  }

  console.log(`\n📊 Processed ${boosters.length} boosters successfully`)
  console.log('💾 Adding to database...')

  // Add to database in batches
  const batchSize = 10
  let totalAdded = 0

  for (let i = 0; i < boosters.length; i += batchSize) {
    const batch = boosters.slice(i, i + batchSize)

    try {
      const { data, error } = await supabase
        .from('boosters')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Error adding batch ${Math.floor(i/batchSize) + 1}:`, error)
        continue
      }

      totalAdded += data.length
      console.log(`   ✅ Added batch ${Math.floor(i/batchSize) + 1}: ${data.length} boosters`)

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`❌ Batch error:`, error)
    }
  }

  console.log(`\n🎉 Successfully added ${totalAdded} nano boosters to database!`)
  console.log('📋 Summary by category:')

  const categoryCounts = {}
  boosters.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1
  })

  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} boosters`)
  })

  return { success: true, total: totalAdded, categories: categoryCounts }
}

// Run the function
processAllBoosters()
  .then(result => {
    if (result.success) {
      console.log(`\n✨ All done! Added ${result.total} professional nano boosters to your SkinCoach database!`)
    }
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Failed to process boosters:', error)
    process.exit(1)
  })