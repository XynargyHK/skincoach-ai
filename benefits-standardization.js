// Extract and standardize all benefits from PDF files
const allBenefitsFromPDFs = {
  'NV Niacinamide': [
    'Skin barrier regeneration',
    'Cellular renewal',
    'Photoaging prevention',
    'Blue light protection',
    'Acne vulgaris treatment',
    'Antioxidant properties',
    'Standardizes skin tone and reduces pallor',
    'Adjuvant in atopic dermatitis and rosacea care'
  ],
  'NV Ascorbic Acid': [
    'Stimulates collagen synthesis',
    'Reduces wrinkles and expression lines',
    'Improves skin firmness and elasticity',
    'Evens skin tone and reduces dark spots',
    'Provides antioxidant protection',
    'Enhances skin radiance and luminosity',
    'Strengthens skin barrier function'
  ],
  'NV Retinol': [
    'Anti-aging action',
    'Promotes epidermal renewal',
    'Standardizes skin tone',
    'Reduces wrinkles and expression lines',
    'Hydration',
    'Acne vulgaris treatment'
  ],
  'NV Hyaluronic Acid': [
    'Intense hydration and moisture retention',
    'Plumps and fills fine lines',
    'Improves skin elasticity',
    'Provides immediate smoothing effect',
    'Supports natural skin barrier',
    'Reduces appearance of wrinkles',
    'Creates youthful skin appearance'
  ],
  'NV Caffeine': [
    'Reduces dark circles and eye bags',
    'Improves microcirculation',
    'Diminishes cellulite appearance',
    'Provides lifting and firming effect',
    'Enhances skin drainage',
    'Reduces puffiness and swelling',
    'Improves skin tone and texture'
  ]
}

// Standardize and categorize benefits
function standardizeBenefits() {
  console.log('🔬 STANDARDIZING BENEFITS FROM ALL PDF FILES...\n')

  // Extract all unique benefits
  const allBenefits = new Set()
  Object.values(allBenefitsFromPDFs).forEach(benefits => {
    benefits.forEach(benefit => allBenefits.add(benefit))
  })

  // Categorize benefits by type
  const categorizedBenefits = {
    'Anti-Aging': [
      'Anti-aging action',
      'Reduces wrinkles and expression lines',
      'Reduces appearance of wrinkles',
      'Plumps and fills fine lines',
      'Improves skin firmness and elasticity',
      'Improves skin elasticity',
      'Provides immediate smoothing effect',
      'Creates youthful skin appearance',
      'Stimulates collagen synthesis',
      'Photoaging prevention'
    ],
    'Hydration': [
      'Intense hydration and moisture retention',
      'Hydration',
      'Supports natural skin barrier',
      'Strengthens skin barrier function',
      'Skin barrier regeneration'
    ],
    'Skin Tone & Texture': [
      'Standardizes skin tone',
      'Standardizes skin tone and reduces pallor',
      'Evens skin tone and reduces dark spots',
      'Improves skin tone and texture',
      'Enhances skin radiance and luminosity'
    ],
    'Acne Treatment': [
      'Acne vulgaris treatment'
    ],
    'Cellular Health': [
      'Cellular renewal',
      'Promotes epidermal renewal',
      'Provides antioxidant protection',
      'Antioxidant properties'
    ],
    'Eye Care': [
      'Reduces dark circles and eye bags',
      'Reduces puffiness and swelling'
    ],
    'Circulation': [
      'Improves microcirculation',
      'Enhances skin drainage'
    ],
    'Body Contouring': [
      'Diminishes cellulite appearance',
      'Provides lifting and firming effect'
    ],
    'Skin Conditions': [
      'Adjuvant in atopic dermatitis and rosacea care'
    ],
    'Protection': [
      'Blue light protection'
    ]
  }

  // Create standardized benefits table structure
  const benefitsTable = []
  let id = 1

  Object.entries(categorizedBenefits).forEach(([category, benefits]) => {
    benefits.forEach(benefit => {
      benefitsTable.push({
        id: id++,
        name: benefit,
        category: category,
        description: generateDescription(benefit),
        active: true,
        created_at: new Date().toISOString()
      })
    })
  })

  return benefitsTable
}

function generateDescription(benefit) {
  const descriptions = {
    'Anti-aging action': 'Comprehensive anti-aging effects targeting multiple signs of skin aging',
    'Reduces wrinkles and expression lines': 'Minimizes the appearance of fine lines and deeper wrinkles',
    'Reduces appearance of wrinkles': 'Visibly diminishes wrinkle depth and prominence',
    'Plumps and fills fine lines': 'Adds volume to smooth out superficial lines',
    'Improves skin firmness and elasticity': 'Enhances skin structure and bounce-back properties',
    'Improves skin elasticity': 'Restores skin flexibility and resilience',
    'Provides immediate smoothing effect': 'Instant skin texture improvement upon application',
    'Creates youthful skin appearance': 'Overall rejuvenation for a more youthful look',
    'Stimulates collagen synthesis': 'Promotes natural collagen production for skin structure',
    'Photoaging prevention': 'Protects against UV-induced premature aging',
    'Intense hydration and moisture retention': 'Deep moisturizing with long-lasting hydration',
    'Hydration': 'Essential moisture delivery to skin cells',
    'Supports natural skin barrier': 'Strengthens the protective barrier function',
    'Strengthens skin barrier function': 'Enhances the skin\'s natural protective abilities',
    'Skin barrier regeneration': 'Repairs and rebuilds damaged barrier function',
    'Standardizes skin tone': 'Evens out skin pigmentation and color',
    'Standardizes skin tone and reduces pallor': 'Improves color uniformity and vibrancy',
    'Evens skin tone and reduces dark spots': 'Addresses hyperpigmentation and discoloration',
    'Improves skin tone and texture': 'Enhances both color evenness and surface smoothness',
    'Enhances skin radiance and luminosity': 'Boosts natural skin glow and brightness',
    'Acne vulgaris treatment': 'Therapeutic approach for acne-prone skin',
    'Cellular renewal': 'Promotes healthy cell turnover and regeneration',
    'Promotes epidermal renewal': 'Accelerates surface skin cell renewal',
    'Provides antioxidant protection': 'Guards against free radical damage',
    'Antioxidant properties': 'Natural protective compounds against oxidative stress',
    'Reduces dark circles and eye bags': 'Targets under-eye discoloration and puffiness',
    'Reduces puffiness and swelling': 'Anti-inflammatory effects for reduced swelling',
    'Improves microcirculation': 'Enhances blood flow in capillaries',
    'Enhances skin drainage': 'Promotes lymphatic drainage and detoxification',
    'Diminishes cellulite appearance': 'Reduces the visible signs of cellulite',
    'Provides lifting and firming effect': 'Tightens and lifts sagging skin areas',
    'Adjuvant in atopic dermatitis and rosacea care': 'Supportive treatment for sensitive skin conditions',
    'Blue light protection': 'Shields skin from harmful blue light exposure'
  }

  return descriptions[benefit] || `Professional skincare benefit: ${benefit}`
}

// Generate the benefits data
const standardizedBenefits = standardizeBenefits()

console.log('📋 STANDARDIZED BENEFITS TABLE STRUCTURE:\n')
console.log('CREATE TABLE benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  name TEXT NOT NULL UNIQUE,')
console.log('  category TEXT NOT NULL,')
console.log('  description TEXT,')
console.log('  active BOOLEAN DEFAULT true,')
console.log('  created_at TIMESTAMP DEFAULT NOW()')
console.log(');')
console.log('')

console.log('📊 BENEFITS BY CATEGORY:\n')
const categories = {}
standardizedBenefits.forEach(benefit => {
  if (!categories[benefit.category]) {
    categories[benefit.category] = []
  }
  categories[benefit.category].push(benefit.name)
})

Object.entries(categories).forEach(([category, benefits]) => {
  console.log(`🏷️  ${category.toUpperCase()} (${benefits.length} benefits):`)
  benefits.forEach((benefit, index) => {
    console.log(`   ${index + 1}. ${benefit}`)
  })
  console.log('')
})

console.log(`📈 TOTAL BENEFITS: ${standardizedBenefits.length}`)
console.log(`📂 CATEGORIES: ${Object.keys(categories).length}`)
console.log('')

console.log('🔗 BOOSTER-BENEFIT MAPPING TABLE:\n')
console.log('CREATE TABLE booster_benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  booster_id INTEGER REFERENCES boosters(id),')
console.log('  benefit_id INTEGER REFERENCES benefits(id),')
console.log('  UNIQUE(booster_id, benefit_id)')
console.log(');')
console.log('')

// Show sample data
console.log('📋 SAMPLE BENEFITS DATA (first 10):')
console.table(standardizedBenefits.slice(0, 10))

module.exports = {
  standardizedBenefits,
  allBenefitsFromPDFs,
  categories
}