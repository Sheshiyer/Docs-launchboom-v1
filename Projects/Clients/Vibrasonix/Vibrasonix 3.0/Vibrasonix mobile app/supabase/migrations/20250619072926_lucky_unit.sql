/*
  # Add premium flag to albums

  1. Changes
    - Add is_premium column to albums table
    - Create index for better performance when querying premium albums
    - Update sample data to mark some albums as premium

  2. Security
    - No changes to RLS policies needed
*/

-- Add is_premium column to albums table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'albums' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE albums ADD COLUMN is_premium boolean DEFAULT false;
  END IF;
END $$;

-- Create index for better performance when querying premium albums
CREATE INDEX IF NOT EXISTS idx_albums_is_premium ON albums(is_premium) WHERE is_premium = true;

-- Update sample albums to mark some as premium (for demonstration)
UPDATE albums SET is_premium = true WHERE title IN ('432 Hz Healing', 'Deep Sleep Sanctuary');
UPDATE albums SET is_premium = false WHERE title NOT IN ('432 Hz Healing', 'Deep Sleep Sanctuary');