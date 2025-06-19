/*
  # Add featured functionality to albums

  1. Changes
    - Add `is_featured` column to albums table
    - Create index for better performance when querying featured albums
    - Update some sample albums to be featured

  2. Security
    - No changes to RLS policies needed
*/

-- Add is_featured column to albums table
ALTER TABLE albums 
ADD COLUMN is_featured boolean DEFAULT false;

-- Create index for better performance when querying featured albums
CREATE INDEX IF NOT EXISTS idx_albums_is_featured ON albums(is_featured) WHERE is_featured = true;

-- Mark some sample albums as featured (optional - for demonstration)
UPDATE albums SET is_featured = true WHERE title IN ('Binaural Bliss', '432 Hz Healing', 'Focus Flow State');