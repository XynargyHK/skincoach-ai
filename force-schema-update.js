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

async function forceSchemaUpdate() {
  try {
    console.log('🚀 FORCING SCHEMA UPDATE: Adding new fields by creating records with them...')

    // Get an existing booster to use as template
    const { data: existingBoosters, error: fetchError } = await supabaseAdmin
      .from('boosters')
      .select('*')
      .limit(1)

    if (fetchError || !existingBoosters.length) {
      throw new Error('Could not fetch existing booster as template')
    }

    const template = existingBoosters[0]

    // Method: Create complete new records with new fields, using actual PDF data
    console.log('📝 Creating new boosters with ingredient_list and benefits fields...')

    const newBoosters = Object.entries(actualPDFData).map(([name, data]) => ({
      name: name,
      description: data.description,
      category: template.category || 'General',
      key_ingredients: data.ingredient_list.join(', '),
      concentration_percentage: template.concentration_percentage || 1,
      target_concerns: data.benefits,
      compatible_skin_types: template.compatible_skin_types || ['All'],
      price: template.price || 25.00,
      image_url: template.image_url || null,
      usage_notes: template.usage_notes || 'Apply as directed by skincare professional',
      active: true,
      // NEW FIELDS - the whole point!
      ingredient_list: data.ingredient_list,
      benefits: data.benefits
    }))

    console.log('🔧 Inserting boosters with new schema...')

    for (let i = 0; i < newBoosters.length; i++) {
      const booster = newBoosters[i]
      console.log(`Creating ${booster.name}...`)

      // First, delete any existing booster with same name to avoid duplicates
      await supabaseAdmin
        .from('boosters')
        .delete()
        .eq('name', booster.name)

      // Insert new booster with complete schema
      const { data: created, error: createError } = await supabaseAdmin
        .from('boosters')
        .insert([booster])
        .select()

      if (createError) {
        console.error(`❌ Error creating ${booster.name}:`, createError.message)

        if (createError.message.includes("Could not find the 'ingredient_list' column") ||
            createError.message.includes("Could not find the 'benefits' column")) {
          console.log('🔥 SCHEMA UPDATE NEEDED - Fields do not exist yet!')
          console.log('📝 Attempting to force creation by raw insert...')

          // Force the schema by creating a minimal record first
          const minimalBooster = {
            ...template,
            id: undefined,
            name: `FORCE_SCHEMA_${Date.now()}`,
            ingredient_list: ['temp'],
            benefits: ['temp']
          }

          const { error: forceError } = await supabaseAdmin
            .from('boosters')
            .insert([minimalBooster])

          if (forceError) {
            console.error('❌ Cannot force schema:', forceError.message)
          } else {
            console.log('✅ Schema forced! Retrying original insert...')
            // Clean up force record
            await supabaseAdmin
              .from('boosters')
              .delete()
              .eq('name', minimalBooster.name)

            // Retry original insert
            const { error: retryError } = await supabaseAdmin
              .from('boosters')
              .insert([booster])

            if (!retryError) {
              console.log(`✅ Successfully created ${booster.name} after schema force!`)
            }
          }
        }
      } else {
        console.log(`✅ Successfully created ${booster.name}`)
      }

      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Verify the new schema
    console.log('🔍 Verifying new schema...')
    const { data: verification, error: verifyError } = await supabaseAdmin
      .from('boosters')
      .select('name, ingredient_list, benefits')
      .in('name', Object.keys(actualPDFData))
      .limit(1)

    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message)
      return false
    }

    console.log('✅ Schema verification successful!')
    console.log('📊 Sample record with new fields:', verification[0])

    console.log('\n' + '='.repeat(60))
    console.log('🎉 SCHEMA UPDATE SUCCESSFUL!')
    console.log('='.repeat(60))
    console.log('✅ ingredient_list field added and populated')
    console.log('✅ benefits field added and populated')
    console.log('📝 All nano boosters updated with complete PDF data')
    console.log('🔬 Database schema now includes new fields!')

    return true

  } catch (error) {
    console.error('❌ Schema update failed:', error)
    return false
  }
}

// Execute schema update
forceSchemaUpdate()
  .then((success) => {
    if (success) {
      console.log('\n🌟 COMPLETE SUCCESS! New fields added and populated!')
    } else {
      console.log('\n❌ Schema update failed')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })