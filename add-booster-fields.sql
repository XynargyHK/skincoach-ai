-- Add new fields to boosters table for ingredient_list and benefits
-- Run this in Supabase SQL Editor

-- Add ingredient_list field (text array)
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS ingredient_list text[];

-- Add benefits field (text array)
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS benefits text[];

-- Verify the schema changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'boosters'
ORDER BY ordinal_position;