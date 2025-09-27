
-- Execute this SQL in Supabase Dashboard or using CLI
-- Add new columns to boosters table
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS ingredient_list text[],
ADD COLUMN IF NOT EXISTS benefits text[];

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'boosters'
AND column_name IN ('ingredient_list', 'benefits');
      