// Execute SQL directly using Supabase service role
const https = require('https')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

// Create an SQL function that we can call through RPC
async function createSQLFunction() {
  try {
    console.log('🔧 Creating SQL function to add columns...')

    // Create a function that adds the columns
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_booster_columns()
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Add ingredient_list column
        BEGIN
          ALTER TABLE boosters ADD COLUMN ingredient_list text[];
        EXCEPTION
          WHEN duplicate_column THEN
            -- Column already exists, ignore
            NULL;
        END;

        -- Add benefits column
        BEGIN
          ALTER TABLE boosters ADD COLUMN benefits text[];
        EXCEPTION
          WHEN duplicate_column THEN
            -- Column already exists, ignore
            NULL;
        END;

        RETURN 'Columns added successfully';
      END;
      $$;
    `

    // First try to create the function by calling it as a raw query
    const { data, error } = await supabase.rpc('exec', {
      sql: createFunctionSQL
    })

    if (error && !error.message.includes('function "exec" does not exist')) {
      console.error('Error creating function:', error)
    }

    console.log('📞 Calling function to add columns...')

    // Now call the function
    const { data: result, error: execError } = await supabase.rpc('add_booster_columns')

    if (execError) {
      console.error('Error executing function:', execError)
      return false
    }

    console.log('✅ Function executed:', result)
    return true

  } catch (error) {
    console.error('❌ Error in SQL function approach:', error)
    return false
  }
}

// Alternative: Use pg library to connect directly
async function directDatabaseConnection() {
  try {
    console.log('🔄 Trying alternative direct approach...')

    // Since we have service role, try creating a stored procedure
    const { data, error } = await supabase.rpc('version')

    if (error) {
      console.log('Cannot execute RPC functions')
      return false
    }

    console.log('✅ Database connection working')

    // Now try creating the columns by updating an existing record with new fields
    console.log('🎯 Using the INSERT approach with a complete booster structure...')

    // Get an existing booster first
    const { data: existingBooster, error: fetchError } = await supabase
      .from('boosters')
      .select('*')
      .limit(1)

    if (fetchError || !existingBooster.length) {
      console.error('Cannot fetch existing booster')
      return false
    }

    // Create a new booster based on existing one but with new fields
    const template = existingBooster[0]
    const newBooster = {
      ...template,
      id: undefined, // Remove ID to create new record
      name: 'TEMP_COLUMN_CREATOR_' + Date.now(),
      description: 'Temporary record to add columns',
      ingredient_list: ['Test ingredient'],
      benefits: ['Test benefit']
    }

    console.log('📝 Creating new booster with additional fields...')

    const { data: created, error: createError } = await supabase
      .from('boosters')
      .insert([newBooster])
      .select()

    if (createError) {
      console.error('❌ Error creating booster with new fields:', createError)
      return false
    }

    console.log('✅ Successfully created booster with new fields!')

    // Delete the temporary record
    await supabase
      .from('boosters')
      .delete()
      .eq('id', created[0].id)

    console.log('🧹 Temporary record cleaned up')

    return true

  } catch (error) {
    console.error('❌ Error in direct approach:', error)
    return false
  }
}

// Main execution
async function addColumnsAndUpdate() {
  console.log('🚀 Starting direct SQL column addition...')

  let success = false

  // Try the function approach first
  success = await createSQLFunction()

  if (!success) {
    // Try the direct approach
    success = await directDatabaseConnection()
  }

  if (success) {
    console.log('✨ SUCCESS! Columns have been added!')

    // Now update all boosters with the PDF data
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

    console.log('📊 Updating boosters with complete PDF data...')

    const { data: boosters, error } = await supabase
      .from('boosters')
      .select('*')
      .like('name', 'NV %')

    if (!error && boosters) {
      let updated = 0

      for (const booster of boosters) {
        const cleanName = booster.name.replace('NV ', '').toLowerCase().trim()
        const directMatches = {
          'niacinamide': 'NV Niacinamide',
          'ascorbic acid': 'NV Ascorbic Acid',
          'retinol': 'NV Retinol',
          'hyaluronic acid': 'NV Hyaluronic Acid',
          'caffeine': 'NV Caffeine'
        }
        const matchKey = directMatches[cleanName]
        const pdfData = matchKey ? actualPDFData[matchKey] : null

        if (pdfData) {
          const { error: updateError } = await supabase
            .from('boosters')
            .update({
              description: pdfData.description,
              ingredient_list: pdfData.ingredient_list,
              benefits: pdfData.benefits
            })
            .eq('id', booster.id)

          if (!updateError) {
            updated++
            console.log(`✅ Updated ${booster.name}`)
          }
        }
      }

      console.log(`\n🎉 Updated ${updated} boosters with complete PDF data!`)
    }

  } else {
    console.log('❌ Could not add columns using any method')
  }
}

addColumnsAndUpdate()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })