/*
  # Remove favorites functionality

  1. Drop Tables
    - Drop `user_favorites` table completely
    
  2. Clean up
    - Remove any indexes related to favorites
    - Remove any policies related to favorites
*/

-- Drop the user_favorites table completely
DROP TABLE IF EXISTS user_favorites CASCADE;

-- Drop any remaining indexes (if they exist)
DROP INDEX IF EXISTS idx_user_favorites_user_id;
DROP INDEX IF EXISTS idx_user_favorites_track_id;
DROP INDEX IF EXISTS idx_user_favorites_album_id;