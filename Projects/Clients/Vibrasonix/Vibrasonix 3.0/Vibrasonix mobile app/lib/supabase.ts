import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Custom storage adapter for React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types - Updated to match actual schema
export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_super_admin?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork_url: string;
  description?: string;
  science_data?: string;
  release_date?: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  album_id?: string;
  title: string;
  artist: string;
  duration: number;
  audio_url: string;
  frequency?: string;
  description?: string;
  track_number: number;
  created_at: string;
  updated_at: string;
  goal_tags?: string[];
}

export interface UserPlaylist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
}

export interface UserListeningHistory {
  id: string;
  user_id: string;
  track_id: string;
  album_id: string;
  listened_at: string;
  duration_listened: number;
  completed: boolean;
}

export interface UserDownload {
  id: string;
  user_id: string;
  track_id: string;
  downloaded_at: string;
  file_path: string;
}

// Database service functions
export class DatabaseService {
  // User management
  static async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Albums and tracks
  static async getAlbums() {
    const { data, error } = await supabase
      .from('albums')
      .select(`
        *,
        tracks (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getFeaturedAlbums() {
    const { data, error } = await supabase
      .from('albums')
      .select(`
        *,
        tracks (*)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAlbum(albumId: string) {
    const { data, error } = await supabase
      .from('albums')
      .select(`
        *,
        tracks (*)
      `)
      .eq('id', albumId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTracks(albumId?: string) {
    let query = supabase
      .from('tracks')
      .select('*')
      .order('track_number', { ascending: true });

    if (albumId) {
      query = query.eq('album_id', albumId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Goal-based track queries
  static async getTracksByGoal(goal: string) {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .contains('goal_tags', [goal])
      .order('title', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Playlists
  static async createPlaylist(userId: string, name: string, description?: string, isPublic = false) {
    const { data, error } = await supabase
      .from('user_playlists')
      .insert([{
        user_id: userId,
        name,
        description,
        is_public: isPublic
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserPlaylists(userId: string) {
    // First get the playlists
    const { data: playlists, error } = await supabase
      .from('user_playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!playlists || playlists.length === 0) return [];

    // Then get playlist tracks separately
    const playlistIds = playlists.map(p => p.id);
    const { data: playlistTracks, error: tracksError } = await supabase
      .from('playlist_tracks')
      .select('*')
      .in('playlist_id', playlistIds)
      .order('position', { ascending: true });

    if (tracksError) throw tracksError;

    // Get track details
    const trackIds = playlistTracks?.map(pt => pt.track_id) || [];
    const { data: tracks, error: trackDetailsError } = trackIds.length > 0
      ? await supabase.from('tracks').select('*').in('id', trackIds)
      : { data: [], error: null };

    if (trackDetailsError) throw trackDetailsError;

    // Combine the data
    return playlists.map(playlist => ({
      ...playlist,
      playlist_tracks: (playlistTracks || [])
        .filter(pt => pt.playlist_id === playlist.id)
        .map(pt => ({
          ...pt,
          tracks: tracks?.find(t => t.id === pt.track_id) || null
        }))
    }));
  }

  static async addTrackToPlaylist(playlistId: string, trackId: string) {
    // Get the next position
    const { data: lastTrack } = await supabase
      .from('playlist_tracks')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const position = lastTrack ? lastTrack.position + 1 : 1;

    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert([{
        playlist_id: playlistId,
        track_id: trackId,
        position
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Listening history
  static async addToListeningHistory(
    userId: string, 
    trackId: string, 
    albumId: string, 
    durationListened: number, 
    completed: boolean
  ) {
    const { data, error } = await supabase
      .from('user_listening_history')
      .insert([{
        user_id: userId,
        track_id: trackId,
        album_id: albumId,
        duration_listened: durationListened,
        completed
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getListeningHistory(userId: string, limit = 50) {
    // Get listening history
    const { data: history, error } = await supabase
      .from('user_listening_history')
      .select('*')
      .eq('user_id', userId)
      .order('listened_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    if (!history || history.length === 0) return [];

    // Get related tracks and albums
    const trackIds = [...new Set(history.map(h => h.track_id))];
    const albumIds = [...new Set(history.map(h => h.album_id))];

    const [tracksData, albumsData] = await Promise.all([
      supabase.from('tracks').select('*').in('id', trackIds),
      supabase.from('albums').select('*').in('id', albumIds)
    ]);

    const tracks = tracksData.data || [];
    const albums = albumsData.data || [];

    return history.map(entry => ({
      ...entry,
      tracks: tracks.find(t => t.id === entry.track_id) || null,
      albums: albums.find(a => a.id === entry.album_id) || null,
    }));
  }

  // Downloads
  static async addDownload(userId: string, trackId: string, filePath: string) {
    const { data, error } = await supabase
      .from('user_downloads')
      .insert([{
        user_id: userId,
        track_id: trackId,
        file_path: filePath
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserDownloads(userId: string) {
    // Get downloads
    const { data: downloads, error } = await supabase
      .from('user_downloads')
      .select('*')
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false });
    
    if (error) throw error;
    if (!downloads || downloads.length === 0) return [];

    // Get related tracks
    const trackIds = downloads.map(d => d.track_id);
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .in('id', trackIds);

    if (tracksError) throw tracksError;

    return downloads.map(download => ({
      ...download,
      tracks: tracks?.find(t => t.id === download.track_id) || null
    }));
  }

  static async removeDownload(userId: string, trackId: string) {
    const { error } = await supabase
      .from('user_downloads')
      .delete()
      .eq('user_id', userId)
      .eq('track_id', trackId);
    
    if (error) throw error;
  }

  // Analytics
  static async getUserStats(userId: string) {
    const [playlists, downloads, history] = await Promise.all([
      this.getUserPlaylists(userId),
      this.getUserDownloads(userId),
      this.getListeningHistory(userId, 1000)
    ]);

    const totalListeningTime = history.reduce((total, entry) => total + entry.duration_listened, 0);
    const completedSessions = history.filter(entry => entry.completed).length;

    return {
      totalPlaylists: playlists.length,
      totalDownloads: downloads.length,
      totalListeningTime: Math.floor(totalListeningTime / 1000 / 60), // in minutes
      completedSessions
    };
  }
}