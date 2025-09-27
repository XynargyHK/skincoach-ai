// Add Ascorbic Acid booster from PDF to database
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

async function addAscorbicAcidBooster() {
  try {
    const ascorbicAcidBooster = {
      name: 'NV Ascorbic Acid',
      description: 'Vitamin C in its most active and stable form. NV Ascorbic Acid uses Nanovetores encapsulation technology to provide superior stability (500% improvement) and 22% increased permeation. Clinical studies show 100% of participants noticed skin improvements in firmness, rejuvenation, texture, hydration, skin tone, and skin strength after 28 days. Features 64.2% reduction in free radicals production vs 35.9% benchmark.',
      category: 'Antioxidant',
      key_ingredients: 'L-Ascorbic Acid (CAS: 50-81-7), Nanovetores encapsulation technology with polymeric particles >200nm for enhanced stability and permeation',
      concentration_percentage: 10,
      target_concerns: [
        'Skin aging',
        'Uneven skin tone',
        'Wrinkles',
        'Expression lines',
        'Loss of firmness',
        'Free radical damage',
        'Collagen depletion',
        'Dark spots'
      ],
      compatible_skin_types: [
        'All skin types',
        'Mature skin',
        'Sun-damaged skin',
        'Dull skin'
      ],
      price: 24.99,
      image_url: null,
      usage_notes: 'Add to formulation under 40°C with moderate mixing. Use in emulsions with pH less than 4.0. Store in dry place, protected from light, at 20-25°C. Incompatible with ethanol. Concentration range: 2-10% or up to 60% at formulator discretion. Results visible after 7 days, optimal after 28 days. Dermatologically tested, cruelty-free, and sustainable.',
      active: true
    }

    console.log('Adding NV Ascorbic Acid booster to database...')

    const { data, error } = await supabase
      .from('boosters')
      .insert([ascorbicAcidBooster])
      .select()

    if (error) {
      console.error('Error adding Ascorbic Acid booster:', error)
      return { success: false, error }
    }

    console.log('✅ Successfully added NV Ascorbic Acid booster!')
    console.log('Booster data:', data[0])

    return { success: true, data: data[0] }

  } catch (error) {
    console.error('Failed to add Ascorbic Acid booster:', error)
    return { success: false, error }
  }
}

// Run the function
addAscorbicAcidBooster()
  .then(result => {
    if (result.success) {
      console.log('🎉 NV Ascorbic Acid booster successfully added to database!')
    } else {
      console.log('❌ Failed to add booster:', result.error)
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('Script error:', error)
    process.exit(1)
  })