// Simple benefits list from all PDF files - no categories
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

function extractAllUniqueBenefits() {
  console.log('🔬 EXTRACTING ALL UNIQUE BENEFITS FROM PDF FILES...\n')

  // Get all unique benefits
  const allBenefits = new Set()
  Object.values(allBenefitsFromPDFs).forEach(benefits => {
    benefits.forEach(benefit => allBenefits.add(benefit))
  })

  // Convert to sorted array
  const sortedBenefits = Array.from(allBenefits).sort()

  // Create benefits table structure (simple)
  const benefitsTable = sortedBenefits.map((benefit, index) => ({
    id: index + 1,
    name: benefit,
    description: generateDescription(benefit),
    active: true,
    created_at: new Date().toISOString()
  }))

  return { sortedBenefits, benefitsTable }
}

function generateDescription(benefit) {
  const descriptions = {
    'Acne vulgaris treatment': 'Therapeutic treatment for acne-prone skin conditions',
    'Adjuvant in atopic dermatitis and rosacea care': 'Supportive care for sensitive skin conditions like dermatitis and rosacea',
    'Anti-aging action': 'Comprehensive anti-aging effects targeting multiple signs of skin aging',
    'Antioxidant properties': 'Natural protective compounds that guard against oxidative stress',
    'Blue light protection': 'Protects skin from harmful blue light exposure from digital devices',
    'Cellular renewal': 'Promotes healthy cell turnover and regeneration processes',
    'Creates youthful skin appearance': 'Overall skin rejuvenation for a more youthful appearance',
    'Diminishes cellulite appearance': 'Reduces the visible signs and texture of cellulite',
    'Enhances skin drainage': 'Promotes lymphatic drainage and detoxification processes',
    'Enhances skin radiance and luminosity': 'Boosts natural skin glow and brightness',
    'Evens skin tone and reduces dark spots': 'Addresses hyperpigmentation and color irregularities',
    'Hydration': 'Essential moisture delivery and retention for skin cells',
    'Improves microcirculation': 'Enhances blood flow in small capillaries and vessels',
    'Improves skin elasticity': 'Restores skin flexibility, resilience and bounce-back properties',
    'Improves skin firmness and elasticity': 'Enhances skin structure, firmness and elasticity',
    'Improves skin tone and texture': 'Enhances both color evenness and surface smoothness',
    'Intense hydration and moisture retention': 'Deep moisturizing effects with long-lasting hydration',
    'Photoaging prevention': 'Protects against UV-induced premature aging and damage',
    'Plumps and fills fine lines': 'Adds volume and smooths out superficial lines and wrinkles',
    'Promotes epidermal renewal': 'Accelerates surface skin cell renewal and turnover',
    'Provides antioxidant protection': 'Guards against free radical damage and oxidative stress',
    'Provides immediate smoothing effect': 'Instant skin texture improvement upon application',
    'Provides lifting and firming effect': 'Tightens and lifts sagging skin areas',
    'Reduces appearance of wrinkles': 'Visibly diminishes wrinkle depth and prominence',
    'Reduces dark circles and eye bags': 'Targets under-eye discoloration and puffiness',
    'Reduces puffiness and swelling': 'Anti-inflammatory effects that reduce swelling',
    'Reduces wrinkles and expression lines': 'Minimizes fine lines and deeper expression wrinkles',
    'Skin barrier regeneration': 'Repairs and rebuilds damaged protective barrier function',
    'Standardizes skin tone': 'Evens out skin pigmentation and color uniformity',
    'Standardizes skin tone and reduces pallor': 'Improves skin color uniformity and vibrancy',
    'Stimulates collagen synthesis': 'Promotes natural collagen production for skin structure',
    'Strengthens skin barrier function': 'Enhances the skin\'s natural protective abilities',
    'Supports natural skin barrier': 'Maintains and strengthens protective barrier function'
  }

  return descriptions[benefit] || `Professional skincare benefit: ${benefit}`
}

// Generate the data
const { sortedBenefits, benefitsTable } = extractAllUniqueBenefits()

console.log('📋 SIMPLE BENEFITS TABLE STRUCTURE:\n')
console.log('CREATE TABLE benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  name TEXT NOT NULL UNIQUE,')
console.log('  description TEXT,')
console.log('  active BOOLEAN DEFAULT true,')
console.log('  created_at TIMESTAMP DEFAULT NOW()')
console.log(');')
console.log('')

console.log('📊 ALL UNIQUE BENEFITS FROM PDF FILES:\n')
sortedBenefits.forEach((benefit, index) => {
  console.log(`${index + 1}. ${benefit}`)
})

console.log(`\n📈 TOTAL UNIQUE BENEFITS: ${sortedBenefits.length}`)
console.log('')

console.log('🔗 BOOSTER-BENEFIT MAPPING TABLE:\n')
console.log('CREATE TABLE booster_benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  booster_id INTEGER REFERENCES boosters(id),')
console.log('  benefit_id INTEGER REFERENCES benefits(id),')
console.log('  UNIQUE(booster_id, benefit_id)')
console.log(');')
console.log('')

console.log('📋 SAMPLE BENEFITS DATA (first 5):')
console.table(benefitsTable.slice(0, 5))

module.exports = {
  sortedBenefits,
  benefitsTable,
  allBenefitsFromPDFs
}