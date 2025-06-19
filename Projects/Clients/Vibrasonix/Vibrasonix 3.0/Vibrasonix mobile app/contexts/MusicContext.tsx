import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import { DatabaseService, supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import type { Album as DBAlbum, Track as DBTrack } from '@/lib/supabase';

// Enhanced Audio implementation for better streaming
const createAudioImplementation = () => {
  if (Platform.OS === 'web') {
    // Web Audio implementation with better streaming support
    return {
      Sound: class WebAudioSound {
        private audio: HTMLAudioElement | null = null;
        private onStatusUpdate: ((status: any) => void) | null = null;
        private statusInterval: NodeJS.Timeout | null = null;

        static async createAsync(source: { uri: string }, initialStatus: any = {}) {
          const sound = new WebAudioSound();
          await sound.loadAsync(source, initialStatus);
          return { sound };
        }

        async loadAsync(source: { uri: string }, initialStatus: any = {}) {
          this.audio = new Audio();
          
          // Set up event listeners before setting src
          this.audio.addEventListener('loadedmetadata', () => {
            this.updateStatus();
          });
          
          this.audio.addEventListener('timeupdate', () => {
            this.updateStatus();
          });
          
          this.audio.addEventListener('ended', () => {
            this.updateStatus();
          });
          
          this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            // Don't throw here, just log the error
          });

          this.audio.addEventListener('canplay', () => {
            this.updateStatus();
          });

          // Configure audio element
          this.audio.preload = 'auto';
          this.audio.crossOrigin = 'anonymous';
          
          // Set source - use a fallback demo audio file if the provided URI fails
          try {
            this.audio.src = source.uri;
          } catch (error) {
            console.warn('Failed to set audio source:', error);
            // Use a demo audio file as fallback
            this.audio.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
          }

          // Auto-play if requested
          if (initialStatus.shouldPlay) {
            try {
              await this.playAsync();
            } catch (error) {
              console.warn('Auto-play prevented by browser:', error);
            }
          }

          return this.getStatus();
        }

        async playAsync() {
          if (this.audio) {
            try {
              await this.audio.play();
              this.startStatusUpdates();
            } catch (error) {
              console.error('Play error:', error);
              throw error;
            }
          }
          return this.getStatus();
        }

        async pauseAsync() {
          if (this.audio) {
            this.audio.pause();
            this.stopStatusUpdates();
          }
          return this.getStatus();
        }

        async stopAsync() {
          if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.stopStatusUpdates();
          }
          return this.getStatus();
        }

        async unloadAsync() {
          if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
            this.stopStatusUpdates();
          }
        }

        async setPositionAsync(positionMillis: number) {
          if (this.audio) {
            this.audio.currentTime = positionMillis / 1000;
          }
          return this.getStatus();
        }

        async setVolumeAsync(volume: number) {
          if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
          }
          return this.getStatus();
        }

        setOnPlaybackStatusUpdate(callback: (status: any) => void) {
          this.onStatusUpdate = callback;
        }

        private startStatusUpdates() {
          this.stopStatusUpdates();
          this.statusInterval = setInterval(() => {
            this.updateStatus();
          }, 100);
        }

        private stopStatusUpdates() {
          if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
          }
        }

        private updateStatus() {
          if (this.onStatusUpdate) {
            this.onStatusUpdate(this.getStatus());
          }
        }

        private getStatus() {
          if (!this.audio) {
            return {
              isLoaded: false,
              isPlaying: false,
              positionMillis: 0,
              durationMillis: 0,
            };
          }

          return {
            isLoaded: !isNaN(this.audio.duration),
            isPlaying: !this.audio.paused && !this.audio.ended,
            positionMillis: Math.floor(this.audio.currentTime * 1000),
            durationMillis: Math.floor((this.audio.duration || 0) * 1000),
            shouldPlay: !this.audio.paused,
          };
        }
      },
      setAudioModeAsync: () => Promise.resolve(),
    };
  } else {
    // Use Expo AV for native platforms
    return require('expo-av').Audio;
  }
};

const AudioModule = createAudioImplementation();

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  uri: string;
  artwork?: string;
  frequency?: string;
  description?: string;
  isPremium?: boolean;
  goal_tags?: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  tracks: Track[];
  description?: string;
  scienceData?: string;
  releaseDate?: string;
  isPremium?: boolean;
  isCustom?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface MusicState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  volume: number;
  sound: any | null;
  queue: Track[];
  currentIndex: number;
  isShuffled: boolean;
  isLooped: boolean;
  timer: number | null;
  timerRemaining: number | null;
  albums: Album[];
  featuredAlbums: Album[];
  customAlbums: Album[];
  downloads: string[];
  listeningHistory: any[];
  userStats: any;
  loading: boolean;
  error: string | null;
}

type MusicAction = 
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_CURRENT_ALBUM'; payload: Album }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_SOUND'; payload: any | null }
  | { type: 'SET_QUEUE'; payload: Track[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_LOOP' }
  | { type: 'SET_TIMER'; payload: number | null }
  | { type: 'SET_TIMER_REMAINING'; payload: number | null }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'SET_ALBUMS'; payload: Album[] }
  | { type: 'SET_FEATURED_ALBUMS'; payload: Album[] }
  | { type: 'ADD_CUSTOM_ALBUM'; payload: Album }
  | { type: 'UPDATE_CUSTOM_ALBUM'; payload: Album }
  | { type: 'DELETE_CUSTOM_ALBUM'; payload: string }
  | { type: 'SET_DOWNLOADS'; payload: string[] }
  | { type: 'ADD_DOWNLOAD'; payload: string }
  | { type: 'REMOVE_DOWNLOAD'; payload: string }
  | { type: 'SET_LISTENING_HISTORY'; payload: any[] }
  | { type: 'SET_USER_STATS'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null };

const musicReducer = (state: MusicState, action: MusicAction): MusicState => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload, error: null };
    case 'SET_CURRENT_ALBUM':
      return { ...state, currentAlbum: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_SOUND':
      return { ...state, sound: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    case 'TOGGLE_LOOP':
      return { ...state, isLooped: !state.isLooped };
    case 'SET_TIMER':
      return { 
        ...state, 
        timer: action.payload,
        timerRemaining: action.payload ? action.payload * 60 : null
      };
    case 'SET_TIMER_REMAINING':
      return { ...state, timerRemaining: action.payload };
    case 'TIMER_TICK':
      const newRemaining = state.timerRemaining ? state.timerRemaining - 1 : null;
      return { 
        ...state, 
        timerRemaining: newRemaining && newRemaining > 0 ? newRemaining : null
      };
    case 'TIMER_EXPIRED':
      return {
        ...state,
        timer: null,
        timerRemaining: null,
        isPlaying: false
      };
    case 'SET_ALBUMS':
      return { ...state, albums: action.payload };
    case 'SET_FEATURED_ALBUMS':
      return { ...state, featuredAlbums: action.payload };
    case 'ADD_CUSTOM_ALBUM':
      return { ...state, customAlbums: [...state.customAlbums, action.payload] };
    case 'UPDATE_CUSTOM_ALBUM':
      return { 
        ...state, 
        customAlbums: state.customAlbums.map(album => 
          album.id === action.payload.id ? action.payload : album
        ),
        currentAlbum: state.currentAlbum?.id === action.payload.id ? action.payload : state.currentAlbum
      };
    case 'DELETE_CUSTOM_ALBUM':
      return { 
        ...state, 
        customAlbums: state.customAlbums.filter(album => album.id !== action.payload),
        currentAlbum: state.currentAlbum?.id === action.payload ? null : state.currentAlbum,
        currentTrack: state.currentAlbum?.id === action.payload ? null : state.currentTrack,
        queue: state.currentAlbum?.id === action.payload ? [] : state.queue
      };
    case 'SET_DOWNLOADS':
      return { ...state, downloads: action.payload };
    case 'ADD_DOWNLOAD':
      return { ...state, downloads: [...state.downloads, action.payload] };
    case 'REMOVE_DOWNLOAD':
      return { ...state, downloads: state.downloads.filter(id => id !== action.payload) };
    case 'SET_LISTENING_HISTORY':
      return { ...state, listeningHistory: action.payload };
    case 'SET_USER_STATS':
      return { ...state, userStats: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState: MusicState = {
  currentTrack: null,
  currentAlbum: null,
  isPlaying: false,
  isLoading: false,
  isBuffering: false,
  position: 0,
  duration: 0,
  volume: 1.0,
  sound: null,
  queue: [],
  currentIndex: 0,
  isShuffled: false,
  isLooped: false,
  timer: null,
  timerRemaining: null,
  albums: [],
  featuredAlbums: [],
  customAlbums: [],
  downloads: [],
  listeningHistory: [],
  userStats: null,
  loading: false,
  error: null,
};

const MusicContext = createContext<{
  state: MusicState;
  dispatch: React.Dispatch<MusicAction>;
  playTrack: (track: Track, album?: Album, startIndex?: number) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seekTo: (positionMillis: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  addToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => Promise<void>;
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => void;
  downloadTrack: (trackId: string) => Promise<void>;
  loadUserData: () => Promise<void>;
  canPlayTrack: (track: Track) => boolean;
  getFilteredAlbums: () => Album[];
  getTracksByGoal: (goal: string) => Promise<Track[]>;
  formatTimerRemaining: () => string;
  formatTime: (milliseconds: number) => string;
  retryPlayback: () => Promise<void>;
} | undefined>(undefined);

// Transform database models to app models
const transformAlbum = (dbAlbum: DBAlbum & { tracks: DBTrack[] }): Album => ({
  id: dbAlbum.id,
  title: dbAlbum.title,
  artist: dbAlbum.artist,
  artwork: dbAlbum.artwork_url,
  description: dbAlbum.description || undefined,
  scienceData: dbAlbum.science_data || undefined,
  releaseDate: dbAlbum.release_date || undefined,
  isPremium: dbAlbum.is_premium || false,
  isFeatured: dbAlbum.is_featured || false,
  tracks: dbAlbum.tracks.map(transformTrack)
});

const transformTrack = (dbTrack: DBTrack): Track => {
  // For demo purposes, use a working audio URL
  // In production, this would use the actual Supabase storage URL
  const demoAudioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
  
  return {
    id: dbTrack.id,
    title: dbTrack.title,
    artist: dbTrack.artist,
    album: dbTrack.album_id || '',
    duration: dbTrack.duration,
    uri: demoAudioUrl, // Use demo URL for now
    frequency: dbTrack.frequency || undefined,
    description: dbTrack.description || undefined,
    isPremium: false,
    goal_tags: dbTrack.goal_tags || undefined
  };
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const { user, isPremium } = useAuth();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      AudioModule.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }
  }, []);

  // Load albums and user data when user changes
  useEffect(() => {
    loadAlbums();
    loadFeaturedAlbums();
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Sleep timer functionality
  useEffect(() => {
    if (state.timer && state.isPlaying && state.timerRemaining !== null) {
      timerIntervalRef.current = setInterval(() => {
        dispatch({ type: 'TIMER_TICK' });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [state.timer, state.isPlaying, state.timerRemaining]);

  // Handle timer expiration
  useEffect(() => {
    if (state.timerRemaining === null && state.timer && state.isPlaying) {
      handleTimerExpired();
    }
  }, [state.timerRemaining, state.timer, state.isPlaying]);

  const handleTimerExpired = async () => {
    try {
      if (state.sound) {
        await state.sound.pauseAsync();
      }
      dispatch({ type: 'TIMER_EXPIRED' });
    } catch (error) {
      console.error('Error stopping music on timer expiration:', error);
    }
  };

  const formatTimerRemaining = (): string => {
    if (!state.timerRemaining) return '';
    const minutes = Math.floor(state.timerRemaining / 60);
    const seconds = state.timerRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const loadAlbums = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const dbAlbums = await DatabaseService.getAlbums();
      const albums = dbAlbums.map(transformAlbum);
      dispatch({ type: 'SET_ALBUMS', payload: albums });
    } catch (error) {
      console.error('Error loading albums:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load albums' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadFeaturedAlbums = async () => {
    try {
      const dbFeaturedAlbums = await DatabaseService.getFeaturedAlbums();
      const featuredAlbums = dbFeaturedAlbums.map(transformAlbum);
      dispatch({ type: 'SET_FEATURED_ALBUMS', payload: featuredAlbums });
    } catch (error) {
      console.error('Error loading featured albums:', error);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [downloads, history, stats] = await Promise.all([
        DatabaseService.getUserDownloads(user.id),
        DatabaseService.getListeningHistory(user.id),
        DatabaseService.getUserStats(user.id)
      ]);

      dispatch({ type: 'SET_DOWNLOADS', payload: downloads.map(d => d.track_id) });
      dispatch({ type: 'SET_LISTENING_HISTORY', payload: history });
      dispatch({ type: 'SET_USER_STATS', payload: stats });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const canPlayTrack = (track: Track): boolean => {
    return true; // All tracks are free to play
  };

  const getFilteredAlbums = (): Album[] => {
    return state.albums;
  };

  const getTracksByGoal = async (goal: string): Promise<Track[]> => {
    try {
      const dbTracks = await DatabaseService.getTracksByGoal(goal);
      return dbTracks.map(transformTrack);
    } catch (error) {
      console.error('Error loading tracks by goal:', error);
      return [];
    }
  };

  const playTrack = async (track: Track, album?: Album, startIndex?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Unload previous sound
      if (state.sound) {
        await state.sound.unloadAsync();
      }

      // Create new sound
      const { sound } = await AudioModule.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true, volume: state.volume }
      );

      dispatch({ type: 'SET_SOUND', payload: sound });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      
      if (album) {
        dispatch({ type: 'SET_CURRENT_ALBUM', payload: album });
        dispatch({ type: 'SET_QUEUE', payload: album.tracks });
        dispatch({ type: 'SET_CURRENT_INDEX', payload: startIndex || album.tracks.findIndex(t => t.id === track.id) });
      }

      // Set up status updates
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          dispatch({ type: 'SET_POSITION', payload: status.positionMillis || 0 });
          dispatch({ type: 'SET_DURATION', payload: status.durationMillis || 0 });
          dispatch({ type: 'SET_PLAYING', payload: status.isPlaying || false });
          dispatch({ type: 'SET_BUFFERING', payload: status.isBuffering || false });

          // Auto-advance to next track when current track ends
          if (status.didJustFinish && !status.isLooping) {
            skipToNext();
          }
        }
      });

      dispatch({ type: 'SET_PLAYING', payload: true });

      // Record listening history
      if (user && album) {
        try {
          await DatabaseService.addToListeningHistory(
            user.id,
            track.id,
            album.id,
            0,
            false
          );
        } catch (error) {
          console.error('Error recording listening history:', error);
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play track. Please check your connection and try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const pauseTrack = async () => {
    try {
      if (state.sound) {
        await state.sound.pauseAsync();
      }
      dispatch({ type: 'SET_PLAYING', payload: false });
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  };

  const resumeTrack = async () => {
    try {
      if (state.sound) {
        await state.sound.playAsync();
      }
      dispatch({ type: 'SET_PLAYING', payload: true });
    } catch (error) {
      console.error('Error resuming track:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to resume playback' });
    }
  };

  const stopTrack = async () => {
    try {
      if (state.sound) {
        await state.sound.stopAsync();
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'SET_POSITION', payload: 0 });
      }
      dispatch({ type: 'SET_TIMER', payload: null });
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  };

  const seekTo = async (positionMillis: number) => {
    try {
      if (state.sound) {
        await state.sound.setPositionAsync(positionMillis);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      if (state.sound) {
        await state.sound.setVolumeAsync(clampedVolume);
      }
      dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const skipToNext = () => {
    if (state.queue.length > 0) {
      let nextIndex;
      
      if (state.isShuffled) {
        // Random next track
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        // Sequential next track
        nextIndex = (state.currentIndex + 1) % state.queue.length;
      }
      
      const nextTrack = state.queue[nextIndex];
      if (nextTrack) {
        playTrack(nextTrack, state.currentAlbum || undefined, nextIndex);
      }
    }
  };

  const skipToPrevious = () => {
    if (state.queue.length > 0) {
      let prevIndex;
      
      if (state.isShuffled) {
        // Random previous track
        prevIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        // Sequential previous track
        prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
      }
      
      const prevTrack = state.queue[prevIndex];
      if (prevTrack) {
        playTrack(prevTrack, state.currentAlbum || undefined, prevIndex);
      }
    }
  };

  const retryPlayback = async () => {
    if (state.currentTrack) {
      await playTrack(state.currentTrack, state.currentAlbum || undefined);
    }
  };

  const addToPlaylist = async (playlistId: string, trackId: string) => {
    if (!user) return;

    try {
      await DatabaseService.addTrackToPlaylist(playlistId, trackId);
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const playlist = state.customAlbums.find(album => album.id === playlistId);
    if (!playlist) return;

    const updatedTracks = playlist.tracks.filter(track => track.id !== trackId);
    const updatedPlaylist = { ...playlist, tracks: updatedTracks };
    
    dispatch({ type: 'UPDATE_CUSTOM_ALBUM', payload: updatedPlaylist });

    if (Platform.OS === 'web') {
      alert('Track removed from playlist');
    } else {
      Alert.alert('Success', 'Track removed from playlist');
    }
  };

  const deletePlaylist = async (playlistId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const confirmDelete = () => {
        try {
          dispatch({ type: 'DELETE_CUSTOM_ALBUM', payload: playlistId });
          
          if (Platform.OS === 'web') {
            alert('Playlist deleted successfully');
          } else {
            Alert.alert('Success', 'Playlist deleted successfully');
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      if (Platform.OS === 'web') {
        if (confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
          confirmDelete();
        } else {
          reject(new Error('User cancelled deletion'));
        }
      } else {
        Alert.alert(
          'Delete Playlist',
          'Are you sure you want to delete this playlist? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => reject(new Error('User cancelled deletion')) },
            { text: 'Delete', style: 'destructive', onPress: confirmDelete }
          ]
        );
      }
    });
  };

  const reorderPlaylistTracks = (playlistId: string, fromIndex: number, toIndex: number) => {
    const playlist = state.customAlbums.find(album => album.id === playlistId);
    if (!playlist) return;

    const updatedTracks = [...playlist.tracks];
    const [movedTrack] = updatedTracks.splice(fromIndex, 1);
    updatedTracks.splice(toIndex, 0, movedTrack);

    const updatedPlaylist = { ...playlist, tracks: updatedTracks };
    dispatch({ type: 'UPDATE_CUSTOM_ALBUM', payload: updatedPlaylist });

    if (state.currentAlbum?.id === playlistId) {
      dispatch({ type: 'SET_QUEUE', payload: updatedTracks });
    }
  };

  const downloadTrack = async (trackId: string) => {
    if (!user) return;

    try {
      const filePath = `/downloads/${trackId}.mp3`;
      await DatabaseService.addDownload(user.id, trackId, filePath);
      dispatch({ type: 'ADD_DOWNLOAD', payload: trackId });
      
      Alert.alert('Success', 'Track downloaded successfully!');
    } catch (error) {
      console.error('Error downloading track:', error);
      Alert.alert('Error', 'Failed to download track. Please try again.');
    }
  };

  const value = {
    state,
    dispatch,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    skipToNext,
    skipToPrevious,
    seekTo,
    setVolume,
    addToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    reorderPlaylistTracks,
    downloadTrack,
    loadUserData,
    canPlayTrack,
    getFilteredAlbums,
    getTracksByGoal,
    formatTimerRemaining,
    formatTime,
    retryPlayback,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};