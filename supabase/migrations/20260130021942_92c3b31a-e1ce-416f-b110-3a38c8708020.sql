-- Add display_order column to radios table
ALTER TABLE radios ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial order as requested by user
UPDATE radios SET display_order = 1 WHERE name ILIKE '%Irece%Lider%' OR name ILIKE '%Irecê%Líder%';
UPDATE radios SET display_order = 2 WHERE name ILIKE '%Clube%91%' OR name ILIKE '%Clube%Jacobina%';
UPDATE radios SET display_order = 3 WHERE name ILIKE '%Lider%Itaberaba%' OR name ILIKE '%Líder%Itaberaba%';
UPDATE radios SET display_order = 4 WHERE name ILIKE '%Serrana%';
UPDATE radios SET display_order = 5 WHERE name ILIKE '%Clube%96%' OR name ILIKE '%Clube%Joao%' OR name ILIKE '%Clube%João%';
UPDATE radios SET display_order = 6 WHERE name ILIKE '%Lider%Ruy%' OR name ILIKE '%Líder%Ruy%';