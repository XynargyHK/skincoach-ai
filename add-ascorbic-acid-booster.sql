-- Add NV Ascorbic Acid booster to database
-- Run this in Supabase SQL Editor

INSERT INTO boosters (
  name,
  description,
  category,
  key_ingredients,
  concentration_percentage,
  target_concerns,
  compatible_skin_types,
  price,
  usage_notes,
  active
) VALUES (
  'NV Ascorbic Acid',
  'Vitamin C in its most active and stable form. NV Ascorbic Acid uses Nanovetores encapsulation technology to provide superior stability (500% improvement) and 22% increased permeation. Clinical studies show 100% of participants noticed skin improvements in firmness, rejuvenation, texture, hydration, skin tone, and skin strength after 28 days. Features 64.2% reduction in free radicals production vs 35.9% benchmark.',
  'Antioxidant',
  'L-Ascorbic Acid (CAS: 50-81-7), Nanovetores encapsulation technology with polymeric particles >200nm for enhanced stability and permeation',
  10,
  ARRAY['Skin aging', 'Uneven skin tone', 'Wrinkles', 'Expression lines', 'Loss of firmness', 'Free radical damage', 'Collagen depletion', 'Dark spots'],
  ARRAY['All skin types', 'Mature skin', 'Sun-damaged skin', 'Dull skin'],
  24.99,
  'Add to formulation under 40°C with moderate mixing. Use in emulsions with pH less than 4.0. Store in dry place, protected from light, at 20-25°C. Incompatible with ethanol. Concentration range: 2-10% or up to 60% at formulator discretion. Results visible after 7 days, optimal after 28 days. Dermatologically tested, cruelty-free, and sustainable.',
  true
);

-- Verify the insert
SELECT * FROM boosters WHERE name = 'NV Ascorbic Acid';