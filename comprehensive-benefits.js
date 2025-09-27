// Comprehensive benefits list with user additions
const userBenefitsList = [
  'Anti-Acne', 'Wrinkle Reduction', 'Fight Sagging', 'Facial Lifting', 'Cell Renewal',
  'Reduces Dark Spots', 'Reduces PIH', 'Anti-Cellulite', 'Anti-Rosacea', 'Brightening',
  'Plumping and Filling Effects', 'Reduce Dark Circles', 'Reduce Puffiness', 'Reduce Fine Lines',
  'Skin Barrier Repair', 'Skin Barrier Protection', 'Prevent TEWL', 'Moisture Retention',
  'Water Channeling', 'Oil Control', 'Blue Light Protection', 'Reduce Stretch mark',
  'Ezcema Soothing', 'Psorasis Soothing', 'Draining Effect', 'Enhance microcirculation',
  'Anti-Hair Loss', 'Anti-Dandruff', 'Even out Skin Tone', 'Hydration', 'Balance Microbiome',
  'Body Slimming', 'Body Toning', 'Breast Volume Enlargement', 'Anti-Inflammation',
  'Exfoliation', 'Stimulate Hair Growth', 'Prevents White Hair Formation',
  'Muscular Relaxation Effect', 'Anti-Bacterial', 'Reduce Irritation', 'Anti-Redness',
  'Anti-Aging', 'Anti-Oxidation', 'Wound Healing', 'Reduce Itchiness', 'Reduce Muscle Pain',
  'Odor Reduction', 'Anti-Frizz', 'Hair Protection', 'Color Protection', 'Increase Hair Density',
  'Scalp Nourishment'
]

// Previous PDF benefits for reference
const pdfBenefits = [
  'Acne Treatment', 'Anti-aging', 'Antioxidant', 'Barrier Repair', 'Barrier Strengthening',
  'Barrier Support', 'Blue Light Protection', 'Brightening', 'Cell Renewal', 'Cellulite Reduction',
  'Circulation', 'Collagen Boost', 'Dark Circle Reduction', 'Deep Hydration', 'Drainage',
  'Elasticity', 'Firming', 'Hydrating', 'Plumping', 'Puffiness Reduction', 'Radiance',
  'Rosacea Care', 'Smoothing', 'Texture Improvement', 'Tone Evening', 'Wrinkle Reduction'
]

function createComprehensiveBenefitsList() {
  console.log('🚀 CREATING COMPREHENSIVE BENEFITS LIST...\n')

  // Combine and deduplicate benefits
  const allBenefits = new Set([...userBenefitsList, ...pdfBenefits])

  // Convert to sorted array
  const sortedBenefits = Array.from(allBenefits).sort()

  // Create comprehensive benefits table structure
  const benefitsTable = sortedBenefits.map((benefit, index) => ({
    id: index + 1,
    name: benefit,
    active: true,
    created_at: new Date().toISOString()
  }))

  return { sortedBenefits, benefitsTable }
}

// Generate the data
const { sortedBenefits, benefitsTable } = createComprehensiveBenefitsList()

console.log('📋 COMPREHENSIVE BENEFITS TABLE STRUCTURE:\n')
console.log('CREATE TABLE benefits (')
console.log('  id SERIAL PRIMARY KEY,')
console.log('  name TEXT NOT NULL UNIQUE,')
console.log('  active BOOLEAN DEFAULT true,')
console.log('  created_at TIMESTAMP DEFAULT NOW()')
console.log(');')
console.log('')

console.log('📊 ALL COMPREHENSIVE BENEFITS:\n')
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

console.log('📋 SAMPLE BENEFITS DATA (first 10):')
console.table(benefitsTable.slice(0, 10))

module.exports = {
  sortedBenefits,
  benefitsTable,
  userBenefitsList,
  pdfBenefits
}