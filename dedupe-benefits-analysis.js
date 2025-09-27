// Analysis of duplicate benefits with same meanings
const { sortedBenefits } = require('./comprehensive-benefits')

function analyzeDuplicateBenefits() {
  console.log('🔍 ANALYZING BENEFITS FOR DUPLICATE MEANINGS...\n')

  // List all current benefits
  console.log('📋 ALL CURRENT BENEFITS (75):')
  sortedBenefits.forEach((benefit, index) => {
    console.log(`${index + 1}. ${benefit}`)
  })

  console.log('\n🔍 DUPLICATE MEANING ANALYSIS:\n')

  // Identify duplicates with same meanings
  const duplicatePairs = [
    {
      group: 'Acne Treatment',
      keep: 'Anti-Acne',
      remove: ['Acne Treatment'],
      reason: 'Prefer "Anti-" prefix format'
    },
    {
      group: 'Anti-Aging',
      keep: 'Anti-Aging',
      remove: ['Anti-aging'],
      reason: 'Capitalization consistency'
    },
    {
      group: 'Dark Circles',
      keep: 'Dark Circle Reduction',
      remove: ['Reduce Dark Circles'],
      reason: 'Prefer "X Reduction" format'
    },
    {
      group: 'Puffiness',
      keep: 'Puffiness Reduction',
      remove: ['Reduce Puffiness'],
      reason: 'Prefer "X Reduction" format'
    },
    {
      group: 'Fine Lines',
      keep: 'Reduce Fine Lines',
      remove: [],
      reason: 'No duplicate - keep as is'
    },
    {
      group: 'Cellulite',
      keep: 'Anti-Cellulite',
      remove: ['Cellulite Reduction'],
      reason: 'Prefer "Anti-" prefix format'
    },
    {
      group: 'Rosacea',
      keep: 'Anti-Rosacea',
      remove: ['Rosacea Care'],
      reason: 'Prefer "Anti-" prefix format'
    },
    {
      group: 'Hydration',
      keep: 'Hydration',
      remove: ['Hydrating', 'Deep Hydration'],
      reason: 'Consolidate to main term'
    },
    {
      group: 'Barrier Consolidation',
      keep: 'Skin Barrier Repair, Skin Barrier Protection',
      remove: ['Barrier Repair', 'Barrier Strengthening', 'Barrier Support'],
      reason: 'Keep both Protection and Repair as they are different functions, remove generic duplicates'
    },
    {
      group: 'Drainage/Draining',
      keep: 'Draining Effect',
      remove: ['Drainage'],
      reason: 'More specific term'
    },
    {
      group: 'Circulation',
      keep: 'Enhance microcirculation',
      remove: ['Circulation'],
      reason: 'More specific and medical term'
    },
    {
      group: 'Plumping',
      keep: 'Plumping and Filling Effects',
      remove: ['Plumping'],
      reason: 'More comprehensive description'
    },
    {
      group: 'Antioxidant',
      keep: 'Anti-Oxidation',
      remove: ['Antioxidant'],
      reason: 'Consistent with "Anti-" prefix format'
    }
  ]

  // Show analysis
  duplicatePairs.forEach((pair, index) => {
    console.log(`${index + 1}. ${pair.group}:`)
    console.log(`   KEEP: "${pair.keep}"`)
    if (pair.remove.length > 0) {
      console.log(`   REMOVE: ${pair.remove.map(r => `"${r}"`).join(', ')}`)
    }
    console.log(`   REASON: ${pair.reason}\n`)
  })

  // Calculate final deduplicated list
  const toRemove = new Set()
  duplicatePairs.forEach(pair => {
    pair.remove.forEach(item => toRemove.add(item))
  })

  const deduplicatedBenefits = sortedBenefits.filter(benefit => !toRemove.has(benefit))

  console.log('📊 SUMMARY:')
  console.log(`Original benefits: ${sortedBenefits.length}`)
  console.log(`Benefits to remove: ${toRemove.size}`)
  console.log(`Final deduplicated: ${deduplicatedBenefits.length}`)

  console.log('\n🗑️ BENEFITS TO REMOVE:')
  Array.from(toRemove).sort().forEach((benefit, index) => {
    console.log(`${index + 1}. ${benefit}`)
  })

  console.log('\n✅ FINAL DEDUPLICATED BENEFITS LIST:')
  deduplicatedBenefits.forEach((benefit, index) => {
    console.log(`${index + 1}. ${benefit}`)
  })

  return {
    originalCount: sortedBenefits.length,
    toRemove: Array.from(toRemove),
    deduplicatedBenefits,
    finalCount: deduplicatedBenefits.length
  }
}

// Run analysis
const analysis = analyzeDuplicateBenefits()

module.exports = {
  analysis,
  deduplicatedBenefits: analysis.deduplicatedBenefits,
  toRemove: analysis.toRemove
}