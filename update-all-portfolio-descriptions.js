const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

// Portfolio 2024 descriptions from pages 20, 21, 23, 25
const allPortfolioDescriptions = {
  // Page 20 descriptions
  'NV Ascorbic Acid': 'The original form of Vitamin C in its best version. It promotes even skin tone, hydration, texture and firmness improvement, diminishment of dark spots and also assists in expression lines reduction.',

  'NV Caffeine': 'Improves skin aspect and firmness, improves microcirculation, has lipolytic action, helps reduce dark circles and protects the skin from photoaging.',

  'NV Hyaluronic Acid': 'Hyaluronic acid can be incorporated in formulations with the purpose of filling wrinkles and hydrating. It also improves skin elasticity, enhances, and restores facial volume.',

  'NV Hydroxy Acids': 'Brightening effect, acts as a non-aggressive peeling, helps reduce melasma and promotes cell renewal. It possesses licorice extract which promotes skin redness and hyperpigmentation decrease.',

  'NV Magnésio': 'It has anti-inflammatory and antimicrobial action, providing effects such as reducing odors and acne on the skin. Additionally, it promotes hydration, stimulates collagen, reduces skin oiliness and has an astringent effect. NV Magnésio is an active that provides incredible results for the skin.',

  'NV Age Freeze': 'Contributes to skin rejuvenation by promoting muscle relaxation, inhibiting the transmissions of signals between nerves and muscles in the dermal layer.',

  'NV Mandelic Acid': 'Assists in the treatment of photoaging and common acne care, as well as improving skin texture, reducing the appearance of wrinkles and expression lines, and promotes skin renewal and a brightening effect.',

  'NV Melaleuca ECO': 'Ideal for anti-acne products. Potent antimicrobial (fungus, yeast, gram-negative bacterias, herpes simplex virus).',

  'NV Kojic Acid': 'Lightening and antiaging effect. Indicated for the treatment of skin hyperpigmetation. It contains oat oil and licorice extract.',

  // Page 21 descriptions
  'NV Niacinamide': 'Promotes skin barrier rejuvenation and cell renovation, prevents photo-aging, protects against blue light, treats for Acne vulgaris. It possesses antioxidant properties, evens out skin tone and reduces paleness. It supports atopic dermatitis and rosacea treatment.',

  'NV Oil Control ECO': 'A blend of actives rich in phenolic acids, potent refreshing substances, and oil regulators with astringent action.',

  'NV Protection ECO': 'Possesses anti-inflammatory action, protects against UV radiation and assists in skin microcirculation.',

  'NV Redensifier': 'Redensifies the skin, intensifies cell repair process, antioxidant and anti-inflammatory, adjuvant in UV protection, improves the looks of keloid scars, deep hydration, and more softness, improves elasticity and resistance, natural facial harmonization, nasolabial fold filling, tensor/lifting effect, increases skin volume and density.',

  'NV Resveratrol ECO': 'Offers prevention and treatment for the skin, acting on the photoaging process. Possesing antioxidant and radioprotector effect, it improves skin elasticity and stimulates collagen production.',

  'NV Retinol': 'Encapsulated retinol possesses high stability, controlled permeation and prolonged liberation. This active ingredient acts in collagen and elastin synthesis, promoting epidermal renewal and reducing fine wrinkles and aging signs, leaving the skin with a younger and healthier look.',

  'NV Tranexamic Acid': 'Powerful brightening effect. It is recommended for melasma treatment and UV induced skin pigmentation prevention.',

  'NV Up Lift': 'It is a versatile and multifunctional active developed with hyaluronic acid nanoparticles that promote skin firmness and wrinkle filling. It also improves skin elasticity stimulating collagen production.',

  'NV VitC MAP': 'Possesses brightening and antioxidant effect, fighting the damages caused by free radicals. Prevents skin aging and stimulates collagen synthesis improving skin firmness and elasticity.',

  'Symbiocaps LA': 'Beneficial bacteria that harmonizes the skin microbiota resulting in pores minimization and providing hydrating properties, skin pH balance, acne and rosacea treatment, cells metabolism restauration and immunity improvement for a complete and healthy skin treatment.',

  // Page 23 descriptions
  'NV 3C': 'Acts in cellulite treatment and prevention. Anti-inflammatory, antioxidant and thermogenic action. Accelerates the metabolism promoting fat burn and body measurements reduction.',

  'NV Body Lift': 'Firming, hydrating, refreshing and antioxidant action. Promotes lifting and tonifying effect.',

  'NV Skin Therapy': 'Perfect for skin recovery. Can be applied into post-peeling products, stimulating skin healing. It can also be used for auxiliary psoriasis treatment, eliminating erythematous and scaly lesions which are characteristic of this condition.',

  'NV Bioprotect': 'Antimicrobial and antioxidant action, regenerator of the epithelial system. Synergy with NV Nails promotes antiviral effect.',

  'NV Caffeine ECO': 'Improves skin aspect and firmness, improves microcirculation, possesses lipolytic action, helps reduce dark circles and protects the skin from photoaging.',

  'NV Cellulitech': 'Acts by burning localized fat, reducing the orange peel aspect. Acts in the treatment of gynoid lipodystrophy and measurements reduction, providing draining, anti-inflammatory and anti-free radicals effect, reducing lipogenesis and increasing lipolysis. It also improves local microcirculation.',

  'NV Delicate Skin ECO': 'Developed for sensitive skins, it promotes intense hydration and cell regeneration improving skin elasticity. Powerful antioxidant and anti-inflammatory effect.',

  'NV Green Tea ECO': 'Nano encapsulated green tea extract presents skin benefits by acting on the anti-aging process and skin hydration. It has antioxidant and prebiotic action, and stimulation of microcirculation.',

  'NV Hydratech': 'Indicated for the treatment of dry, thin, and sensitive skin. NV Hydratech has the property to maintain the skin naturally hydrated.',

  'NV Itching Off ECO': 'It helps alleviate itching and unwanted irritations, it also possesses refreshing and calming effect, helping with the healing process.',

  'NV Nails': 'Natural antifungal that acts against fungi and yeasts. Proven efficacy against Candida albicans and Aspergillus fumigtus. In synergy with Nano Bioprotect, it promotes antiviral action.',

  'NV Relief ECO': 'Acts on the immediate relief of muscle pain, arthritis and rheumatism. It promotes skin regeneration and strengthen tissues, improving blood microcirculation, expanding toning in the treated region.',

  'NV Rose Hips ECO': 'Helps in skin regeneration, post-surgery scars and burns. Ideal product for skin renovation, stimulates skin tissue regeneration helping to prevent and mitigate skin premature aging. Excellent effect in preventing stretch marks.',

  'NV Cellulight': 'Acts through draining effect, decreasing the swelling caused by cellulite inflammation. It also stimulates local microcirculation, possesses healing effect and promotes skin firmness and reduces measurements. Indicated for the treatment of gynoid lipodystrophy.',

  'NV Skin Healthier ECO': 'Acts as a regenerator of damaged skin, with anti-inflammatory action and helps minimize the appearance of scars.',

  // Page 25 descriptions
  'NV Liss': 'Versatile and multifunctional active. Hair anti-aging with protective action that increases hair mass. It promotes disciplinary effect, color protection and hair styling.',

  'NV Argan': 'Hydrating, softening, volume and frizz reduction properties, and also protects from hair breakage and dryness, leaving it more beautiful and healthier.',

  'NV Glossy': 'Provides intense glow and high hair substantiality, providing high hydration and higher elasticity and softness to the strand.',

  'NV Grayless': 'It acts on the hair follicle, stimulating stem cells to repigment the hair strand, and also protects the follicle from oxidation and activates melanogenesis to increase melanin production.',

  'NV Hyalocollagreen': 'Innovative and multifunctional active, acts as a filler on the hair fiber, prevents the cuticle from opening and reduces breackage, providing strength and restructuring to the hair.',

  'NV Redensifier': 'A versatile and multifunctional active ingredient. It estructures porous hair strands, nourishes, repairs and strengthens. It helps in the treatment of Alopecia areata, realigns the hair strands, and controls frizz. Promotes an increase in hair mass, volume and color protection, as well deep hydration and softness.',

  'NV R-Growth Hair': 'Group of active ingredients that act in the anti-hair fall effect, growth and hair thickening, providing vitality and vigor to the strands. The product reverts alopecia (imbalance between hair growth and loss) rapidly reactivating hair growth and decreasing hair loss.',

  'NV Smooth': 'Acts in frizz reduction and provides high substantiality to the strand. When thermoactivated, cuticle sealing promotes strand shielding effect, favoring hydration, softness, alignment and glow provided by the product.'
}

async function updateAllPortfolioDescriptions() {
  try {
    console.log('🔄 UPDATING ALL 53 BOOSTER DESCRIPTIONS WITH PORTFOLIO 2024 CONTENT...')
    console.log('='.repeat(70))
    console.log('')

    // First, get all boosters from database
    const { data: allBoosters, error: fetchError } = await supabase
      .from('boosters')
      .select('id, name, description')
      .order('name')

    if (fetchError) {
      console.error('❌ Error fetching boosters:', fetchError.message)
      return false
    }

    console.log(`📊 Found ${allBoosters.length} boosters in database`)
    console.log(`📋 Have Portfolio 2024 descriptions for ${Object.keys(allPortfolioDescriptions).length} boosters`)
    console.log('')

    let updated = 0
    let skipped = 0

    for (const booster of allBoosters) {
      const newDescription = allPortfolioDescriptions[booster.name]

      if (newDescription) {
        console.log(`🔄 Updating: ${booster.name}`)
        console.log(`   OLD: "${booster.description.substring(0, 60)}..."`)
        console.log(`   NEW: "${newDescription.substring(0, 60)}..."`)

        const { error: updateError } = await supabase
          .from('boosters')
          .update({
            description: newDescription
          })
          .eq('id', booster.id)

        if (updateError) {
          console.error(`❌ Error updating ${booster.name}:`, updateError.message)
        } else {
          updated++
          console.log(`✅ Successfully updated ${booster.name}`)
        }
        console.log('')

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        console.log(`⏭️  Skipping: ${booster.name} (no Portfolio 2024 description found)`)
        skipped++
      }
    }

    console.log('='.repeat(70))
    console.log('🎉 PORTFOLIO 2024 MASS UPDATE COMPLETED!')
    console.log('='.repeat(70))
    console.log(`✅ Successfully updated: ${updated} boosters`)
    console.log(`⏭️  Skipped (no Portfolio data): ${skipped} boosters`)
    console.log(`📊 Total processed: ${updated + skipped} boosters`)
    console.log('')
    console.log('🌟 All available Portfolio 2024 descriptions have been applied!')
    console.log('📝 Professional, concise descriptions from official portfolio')
    console.log('🔬 Extracted from pages 20, 21, 23, and 25')

    return { updated, skipped, total: updated + skipped }

  } catch (error) {
    console.error('❌ Mass update failed:', error.message)
    return false
  }
}

// Execute mass update
updateAllPortfolioDescriptions()
  .then(result => {
    if (result) {
      console.log(`\n✨ SUCCESS! Updated ${result.updated} out of ${result.total} boosters with Portfolio 2024 content!`)
      console.log('🌟 Your SkinCoach database now has the latest professional descriptions!')
    } else {
      console.log('\n❌ Mass update failed')
    }
    process.exit(result ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })