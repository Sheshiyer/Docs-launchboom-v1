/*
  # Create missing tables for user functionality

  1. New Tables
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `track_id` (uuid, foreign key to tracks, nullable)
      - `album_id` (uuid, foreign key to albums, nullable)
      - `created_at` (timestamp)
    - `user_playlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `description` (text, nullable)
      - `is_public` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `playlist_tracks`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, foreign key to user_playlists)
      - `track_id` (uuid, foreign key to tracks)
      - `position` (integer)
      - `added_at` (timestamp)
    - `user_listening_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `track_id` (uuid, foreign key to tracks)
      - `album_id` (uuid, foreign key to albums)
      - `listened_at` (timestamp)
      - `duration_listened` (integer)
      - `completed` (boolean)
    - `user_downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `track_id` (uuid, foreign key to tracks)
      - `downloaded_at` (timestamp)
      - `file_path` (text)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data

  3. Changes
    - Remove subscription-related fields from users table (not in actual schema)
    - Remove premium-related fields from albums and tracks (not in actual schema)
*/

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT user_favorites_track_or_album_check CHECK (
    (track_id IS NOT NULL AND album_id IS NULL) OR 
    (track_id IS NULL AND album_id IS NOT NULL)
  )
);

-- Create user_playlists table
CREATE TABLE IF NOT EXISTS user_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlist_tracks table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES user_playlists(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 1,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- Create user_listening_history table
CREATE TABLE IF NOT EXISTS user_listening_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  listened_at timestamptz DEFAULT now(),
  duration_listened integer NOT NULL DEFAULT 0,
  completed boolean DEFAULT false
);

-- Create user_downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  file_path text NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_favorites
CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_playlists
CREATE POLICY "Users can manage own playlists"
  ON user_playlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public playlists"
  ON user_playlists
  FOR SELECT
  TO public
  USING (is_public = true);

-- Create RLS policies for playlist_tracks
CREATE POLICY "Users can manage tracks in own playlists"
  ON playlist_tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE user_playlists.id = playlist_tracks.playlist_id 
      AND user_playlists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE user_playlists.id = playlist_tracks.playlist_id 
      AND user_playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view tracks in public playlists"
  ON playlist_tracks
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE user_playlists.id = playlist_tracks.playlist_id 
      AND user_playlists.is_public = true
    )
  );

-- Create RLS policies for user_listening_history
CREATE POLICY "Users can manage own listening history"
  ON user_listening_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_downloads
CREATE POLICY "Users can manage own downloads"
  ON user_downloads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_track_id ON user_favorites(track_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_album_id ON user_favorites(album_id);

CREATE INDEX IF NOT EXISTS idx_user_playlists_user_id ON user_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_playlists_public ON user_playlists(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks(playlist_id, position);

CREATE INDEX IF NOT EXISTS idx_user_listening_history_user_id ON user_listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_listening_history_track_id ON user_listening_history(track_id);
CREATE INDEX IF NOT EXISTS idx_user_listening_history_listened_at ON user_listening_history(listened_at);

CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_track_id ON user_downloads(track_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_playlists_updated_at'
  ) THEN
    CREATE TRIGGER update_user_playlists_updated_at
      BEFORE UPDATE ON user_playlists
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;