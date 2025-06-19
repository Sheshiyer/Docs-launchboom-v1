/*
  # Add goal tags to tracks table

  1. Changes
    - Add `goal_tags` column to tracks table as text array
    - This allows tracks to be associated with multiple goals (sleep, focus, relax, energy, pain_relief, nsdr)

  2. Notes
    - Goal tags will be used to create dynamic playlists based on user's selected goal
    - Admin dashboard can use this to categorize tracks appropriately
*/

-- Add goal_tags column to tracks table
ALTER TABLE tracks 
ADD COLUMN goal_tags text[];

-- Create index for better performance when querying by goal tags
CREATE INDEX IF NOT EXISTS idx_tracks_goal_tags ON tracks USING GIN (goal_tags);

-- Update existing tracks with sample goal tags (optional - for demonstration)
UPDATE tracks SET goal_tags = ARRAY['sleep', 'relax'] WHERE frequency LIKE '%Hz' AND frequency NOT LIKE '%40%';
UPDATE tracks SET goal_tags = ARRAY['focus', 'energy'] WHERE frequency LIKE '%40%' OR frequency LIKE '%Beta%' OR frequency LIKE '%Gamma%';
UPDATE tracks SET goal_tags = ARRAY['sleep', 'nsdr'] WHERE frequency LIKE '%Delta%' OR frequency LIKE '%Theta%';
UPDATE tracks SET goal_tags = ARRAY['relax', 'pain_relief'] WHERE frequency = '432 Hz';
UPDATE tracks SET goal_tags = ARRAY['focus'] WHERE frequency LIKE '%Alpha%';