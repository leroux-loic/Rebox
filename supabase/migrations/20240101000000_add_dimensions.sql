-- Add dimension columns to listings table
ALTER TABLE listings 
ADD COLUMN length integer,
ADD COLUMN width integer,
ADD COLUMN height integer;

-- Create an index for efficient filtering
CREATE INDEX idx_listings_dimensions ON listings (length, width, height);

-- Optional: Backfill existing data if possible (approximate from text)
-- UPDATE listings SET 
--   length = CAST(SPLIT_PART(dimensions, 'x', 1) AS INTEGER),
--   width = CAST(SPLIT_PART(dimensions, 'x', 2) AS INTEGER),
--   height = CAST(SPLIT_PART(dimensions, 'x', 3) AS INTEGER)
-- WHERE dimensions ~ '^\d+x\d+x\d+$';
