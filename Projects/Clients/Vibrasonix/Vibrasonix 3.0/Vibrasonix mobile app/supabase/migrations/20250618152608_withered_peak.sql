/*
  # Initial Schema for Vibrasonix Music App

  1. New Tables
    - `users` - User profiles and subscription info
    - `albums` - Music albums with metadata
    - `tracks` - Individual tracks belonging to albums
    - `user_favorites` - User's favorite tracks and albums
    - `user_playlists` - Custom user playlists
    - `playlist_tracks` - Tracks within playlists
    - `user_listening_history` - Track listening analytics
    - `user_downloads` - Downloaded tracks for offline use

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for albums and tracks
    - Private access for user-specific data

  3. Features
    - Full user profile management
    - Music library with albums and tracks
    - Favorites and playlist functionality
    - Listening history and analytics
    - Download management for offline use
    - Premium subscription support
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  artwork_url text NOT NULL,
  description text,
  science_data text,
  release_date date,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text NOT NULL,
  duration integer NOT NULL, -- in seconds
  audio_url text NOT NULL,
  frequency text,
  description text,
  track_number integer NOT NULL DEFAULT 1,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT favorite_type_check CHECK (
    (track_id IS NOT NULL AND album_id IS NULL) OR 
    (track_id IS NULL AND album_id IS NOT NULL)
  )
);

-- User playlists table
CREATE TABLE IF NOT EXISTS user_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Playlist tracks table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES user_playlists(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- User listening history table
CREATE TABLE IF NOT EXISTS user_listening_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  listened_at timestamptz DEFAULT now(),
  duration_listened integer DEFAULT 0, -- in milliseconds
  completed boolean DEFAULT false
);

-- User downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  file_path text NOT NULL,
  UNIQUE(user_id, track_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Albums policies (public read)
CREATE POLICY "Albums are publicly readable"
  ON albums
  FOR SELECT
  TO authenticated
  USING (true);

-- Tracks policies (public read)
CREATE POLICY "Tracks are publicly readable"
  ON tracks
  FOR SELECT
  TO authenticated
  USING (true);

-- User favorites policies
CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User playlists policies
CREATE POLICY "Users can manage own playlists"
  ON user_playlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public playlists are readable"
  ON user_playlists
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Playlist tracks policies
CREATE POLICY "Users can manage own playlist tracks"
  ON playlist_tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE id = playlist_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE id = playlist_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public playlist tracks are readable"
  ON playlist_tracks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE id = playlist_id AND is_public = true
    )
  );

-- User listening history policies
CREATE POLICY "Users can manage own listening history"
  ON user_listening_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User downloads policies
CREATE POLICY "Users can manage own downloads"
  ON user_downloads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_track_number ON tracks(album_id, track_number);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_track_id ON user_favorites(track_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_album_id ON user_favorites(album_id);
CREATE INDEX IF NOT EXISTS idx_user_playlists_user_id ON user_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON user_listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_listened_at ON user_listening_history(user_id, listened_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_playlists_updated_at
  BEFORE UPDATE ON user_playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();