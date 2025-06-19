/*
  # Update goal tags to match admin app

  1. Updates
    - Update existing tracks with proper goal tags that match the admin app
    - Add more comprehensive goal tag assignments
    - Ensure all goal categories are represented

  2. Goal Tags
    - sleep: For sleep and deep rest tracks
    - focus: For concentration and mental clarity
    - relax: For relaxation and stress relief
    - energy: For energizing and revitalizing
    - pain_relief: For pain management and healing
    - nsdr: For Non-Sleep Deep Rest
    - meditation: For mindfulness and meditation
    - creativity: For creative inspiration and flow
*/

-- Clear existing goal tags
UPDATE tracks SET goal_tags = NULL;

-- Update tracks with comprehensive goal tags based on frequency and content
UPDATE tracks SET goal_tags = ARRAY['sleep', 'nsdr', 'relax'] 
WHERE frequency LIKE '%Delta%' OR frequency LIKE '%0.5%' OR frequency LIKE '%1%' OR frequency LIKE '%2%' OR frequency LIKE '%3%' OR frequency LIKE '%4%';

UPDATE tracks SET goal_tags = ARRAY['sleep', 'meditation', 'relax'] 
WHERE frequency LIKE '%Theta%' OR frequency LIKE '%4-8%' OR frequency LIKE '%5%' OR frequency LIKE '%6%' OR frequency LIKE '%7%';

UPDATE tracks SET goal_tags = ARRAY['meditation', 'creativity', 'relax'] 
WHERE frequency LIKE '%Alpha%' OR frequency LIKE '%8-12%' OR frequency LIKE '%8%' OR frequency LIKE '%9%' OR frequency LIKE '%10%' OR frequency LIKE '%11%' OR frequency LIKE '%12%';

UPDATE tracks SET goal_tags = ARRAY['focus', 'energy', 'creativity'] 
WHERE frequency LIKE '%Beta%' OR frequency LIKE '%13-30%' OR frequency LIKE '%15%' OR frequency LIKE '%20%';

UPDATE tracks SET goal_tags = ARRAY['focus', 'energy', 'creativity'] 
WHERE frequency LIKE '%Gamma%' OR frequency LIKE '%40%' OR frequency LIKE '%30-100%';

UPDATE tracks SET goal_tags = ARRAY['pain_relief', 'relax', 'meditation'] 
WHERE frequency = '432 Hz';

UPDATE tracks SET goal_tags = ARRAY['pain_relief', 'meditation', 'creativity'] 
WHERE frequency = '528 Hz';

UPDATE tracks SET goal_tags = ARRAY['relax', 'meditation'] 
WHERE frequency = '396 Hz';

UPDATE tracks SET goal_tags = ARRAY['creativity', 'focus'] 
WHERE frequency = '741 Hz';

UPDATE tracks SET goal_tags = ARRAY['meditation', 'creativity'] 
WHERE frequency = '852 Hz';

-- Update tracks based on title content
UPDATE tracks SET goal_tags = ARRAY['sleep', 'nsdr'] 
WHERE LOWER(title) LIKE '%sleep%' OR LOWER(title) LIKE '%dream%' OR LOWER(title) LIKE '%night%';

UPDATE tracks SET goal_tags = ARRAY['focus', 'energy'] 
WHERE LOWER(title) LIKE '%focus%' OR LOWER(title) LIKE '%concentration%' OR LOWER(title) LIKE '%study%';

UPDATE tracks SET goal_tags = ARRAY['relax', 'meditation'] 
WHERE LOWER(title) LIKE '%relax%' OR LOWER(title) LIKE '%calm%' OR LOWER(title) LIKE '%peace%';

UPDATE tracks SET goal_tags = ARRAY['energy', 'creativity'] 
WHERE LOWER(title) LIKE '%energy%' OR LOWER(title) LIKE '%power%' OR LOWER(title) LIKE '%vitality%';

UPDATE tracks SET goal_tags = ARRAY['pain_relief', 'relax'] 
WHERE LOWER(title) LIKE '%heal%' OR LOWER(title) LIKE '%pain%' OR LOWER(title) LIKE '%relief%';

UPDATE tracks SET goal_tags = ARRAY['meditation', 'relax'] 
WHERE LOWER(title) LIKE '%meditation%' OR LOWER(title) LIKE '%mindful%' OR LOWER(title) LIKE '%zen%';

UPDATE tracks SET goal_tags = ARRAY['creativity', 'focus'] 
WHERE LOWER(title) LIKE '%creative%' OR LOWER(title) LIKE '%flow%' OR LOWER(title) LIKE '%inspiration%';

-- Ensure all tracks have at least one goal tag (fallback)
UPDATE tracks SET goal_tags = ARRAY['relax', 'meditation'] 
WHERE goal_tags IS NULL OR array_length(goal_tags, 1) IS NULL;