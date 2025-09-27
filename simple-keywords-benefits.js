// Simple keyword benefits from all PDF files
const allBenefitsFromPDFs = {
  'NV Niacinamide': [
    'Barrier Repair',
    'Cell Renewal',
    'Anti-aging',
    'Blue Light Protection',
    'Acne Treatment',
    'Antioxidant',
    'Tone Evening',
    'Rosacea Care'
  ],
  'NV Ascorbic Acid': [
    'Collagen Boost',
    'Wrinkle Reduction',
    'Firming',
    'Brightening',
    'Antioxidant',
    'Radiance',
    'Barrier Strengthening'
  ],
  'NV Retinol': [
    'Anti-aging',
    'Cell Renewal',
    'Tone Evening',
    'Wrinkle Reduction',
    'Hydrating',
    'Acne Treatment'
  ],
  'NV Hyaluronic Acid': [
    'Deep Hydration',
    'Plumping',
    'Elasticity',
    'Smoothing',
    'Barrier Support',
    'Wrinkle Reduction',
    'Anti-aging'
  ],
  'NV Caffeine': [
    'Dark Circle Reduction',
    'Circulation',
    'Cellulite Reduction',
    'Firming',
    'Drainage',
    'Puffiness Reduction',
    'Texture Improvement'
  ]
}

function extractSimpleKeywordBenefits() {
  console.log('🔬 EXTRACTING SIMPLE KEYWORD BENEFITS...\\n')

  // Get all unique benefits
  const allBenefits = new Set()
  Object.values(allBenefitsFromPDFs).forEach(benefits => {
    benefits.forEach(benefit => allBenefits.add(benefit))
  })

  // Convert to sorted array
  const sortedBenefits = Array.from(allBenefits).sort()

  // Create simple benefits table structure
  const benefitsTable = sortedBenefits.map((benefit, index) => ({
    id: index + 1,
    name: benefit,
    active: true,
    created_at: new Date().toISOString()
  }))

  return { sortedBenefits, benefitsTable }
}

// Generate the data
const { sortedBenefits, benefitsTable } = extractSimpleKeywordBenefits()

console.log('📋 SIMPLE KEYWORD BENEFITS TABLE STRUCTURE:\\n')
console.log('CREATE TABLE benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  name TEXT NOT NULL UNIQUE,')
console.log('  active BOOLEAN DEFAULT true,')
console.log('  created_at TIMESTAMP DEFAULT NOW()')
console.log(');')
console.log('')

console.log('📊 ALL SIMPLE KEYWORD BENEFITS:\\n')
sortedBenefits.forEach((benefit, index) => {
  console.log(`${index + 1}. ${benefit}`)
})

console.log(`\\n📈 TOTAL UNIQUE BENEFITS: ${sortedBenefits.length}`)
console.log('')

console.log('🔗 BOOSTER-BENEFIT MAPPING TABLE:\\n')
console.log('CREATE TABLE booster_benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  booster_id INTEGER REFERENCES boosters(id),')
console.log('  benefit_id INTEGER REFERENCES benefits(id),')
console.log('  UNIQUE(booster_id, benefit_id)')
console.log(');')
console.log('')

console.log('📋 SAMPLE BENEFITS DATA (first 10):')
console.table(benefitsTable.slice(0, 10))

module.exports = {
  sortedBenefits,
  benefitsTable,
  allBenefitsFromPDFs
}