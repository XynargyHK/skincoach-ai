-- Add ingredient_list and benefits columns to boosters table
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS ingredient_list text[],
ADD COLUMN IF NOT EXISTS benefits text[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boosters_ingredient_list ON boosters USING gin(ingredient_list);
CREATE INDEX IF NOT EXISTS idx_boosters_benefits ON boosters USING gin(benefits);

-- Add comment to track this migration
COMMENT ON COLUMN boosters.ingredient_list IS 'List of ingredients from PDF technical sheets';
COMMENT ON COLUMN boosters.benefits IS 'Clinical benefits from PDF studies';