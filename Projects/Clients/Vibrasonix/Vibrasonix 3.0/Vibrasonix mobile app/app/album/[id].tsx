import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Play, Pause, Download, Shuffle, Clock, MoveVertical as MoreVertical, Trash2, CreditCard as Edit3, X, GripVertical } from 'lucide-react-native';
import { useMusic } from '@/contexts/MusicContext';
import { useLocalSearchParams, router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, playTrack, pauseTrack, resumeTrack, removeTrackFromPlaylist, deletePlaylist, reorderPlaylistTracks } = useMusic();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Find the album by ID
  const album = [...state.albums, ...state.customAlbums].find(a => a.id === id);
  const isCustomPlaylist = album?.isCustom || false;

  if (!album) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f172a']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Album not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const handlePlayTrack = (track: any) => {
    playTrack(track, album);
    router.push('/player');
  };

  const handlePlayAll = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album);
      router.push('/player');
    }
  };

  const handleTogglePlayPause = (track: any) => {
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      handlePlayTrack(track);
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    if (!isCustomPlaylist) return;
    
    removeTrackFromPlaylist(album.id, trackId);
  };

  const handleDeletePlaylist = async () => {
    if (!isCustomPlaylist) return;
    
    try {
      await deletePlaylist(album.id);
      // Navigate back to library after successful deletion
      router.replace('/(tabs)/library');
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleReorderTracks = (fromIndex: number, toIndex: number) => {
    if (!isCustomPlaylist || fromIndex === toIndex) return;
    
    reorderPlaylistTracks(album.id, fromIndex, toIndex);
  };

  const moveTrackUp = (index: number) => {
    if (index > 0) {
      handleReorderTracks(index, index - 1);
    }
  };

  const moveTrackDown = (index: number) => {
    if (index < album.tracks.length - 1) {
      handleReorderTracks(index, index + 1);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f172a']}
      style={styles.container}
    >
      {/* Background Image */}
      <Image 
        source={{ uri: album.artwork }} 
        style={styles.backgroundImage}
        blurRadius={20}
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(26,26,46,0.7)', 'rgba(26,26,46,0.9)']}
        style={styles.overlay}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {isCustomPlaylist && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowPlaylistMenu(true)}
            >
              <MoreVertical size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Album Info */}
        <View style={styles.albumInfo}>
          <BlurView intensity={30} style={styles.albumCard}>
            <Image 
              source={{ uri: album.artwork }} 
              style={styles.albumArtwork}
            />
            
            <View style={styles.albumDetails}>
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumArtist}>{album.artist}</Text>
              <Text style={styles.albumMeta}>
                <Text>{album.tracks.length} tracks</Text>
                {album.releaseDate && <Text> • {album.releaseDate}</Text>}
                {album.createdAt && !album.releaseDate && <Text> • {new Date(album.createdAt).getFullYear()}</Text>}
                {isCustomPlaylist && (
                  <Text style={styles.customBadge}> • Custom Playlist</Text>
                )}
              </Text>
              
              {album.description && (
                <Text style={styles.albumDescription}>{album.description}</Text>
              )}
            </View>
          </BlurView>
        </View>

        {/* Science Data */}
        {album.scienceData && (
          <BlurView intensity={20} style={styles.scienceCard}>
            <Text style={styles.scienceTitle}>Science Behind the Sound</Text>
            <Text style={styles.scienceText}>{album.scienceData}</Text>
          </BlurView>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.playAllButton}
            onPress={handlePlayAll}
          >
            <LinearGradient
              colors={['#A68752', '#8B6F3F']}
              style={styles.playAllGradient}
            >
              <Play size={20} color="white" fill="white" />
              <Text style={styles.playAllText}>Play All</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsDownloaded(!isDownloaded)}
          >
            <Download 
              size={20} 
              color={isDownloaded ? '#A68752' : 'white'} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Shuffle size={20} color="white" />
          </TouchableOpacity>

          {isCustomPlaylist && (
            <TouchableOpacity 
              style={[styles.actionButton, isReorderMode && styles.activeActionButton]}
              onPress={() => setIsReorderMode(!isReorderMode)}
            >
              <GripVertical size={20} color={isReorderMode ? '#A68752' : 'white'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Reorder Mode Info */}
        {isReorderMode && (
          <BlurView intensity={20} style={styles.reorderInfo}>
            <Text style={styles.reorderInfoText}>
              Tap the arrows to reorder tracks in your playlist
            </Text>
          </BlurView>
        )}

        {/* Track List */}
        <View style={styles.trackList}>
          <Text style={styles.trackListTitle}>Tracks</Text>
          
          {album.tracks.map((track, index) => (
            <BlurView key={track.id} intensity={15} style={styles.trackItem}>
              <TouchableOpacity 
                style={styles.trackContent}
                onPress={() => !isReorderMode && handlePlayTrack(track)}
                disabled={isReorderMode}
              >
                <View style={styles.trackNumber}>
                  <Text style={styles.trackNumberText}>{index + 1}</Text>
                </View>
                
                <View style={styles.trackInfo}>
                  <Text 
                    style={[
                      styles.trackTitle,
                      state.currentTrack?.id === track.id && styles.currentTrackTitle
                    ]}
                    numberOfLines={1}
                  >
                    {track.title}
                  </Text>
                  <View style={styles.trackMeta}>
                    {track.frequency && (
                      <Text style={styles.trackFrequency}>{track.frequency}</Text>
                    )}
                    <Text style={styles.trackDuration}>
                      {formatDuration(track.duration)}
                    </Text>
                  </View>
                  {track.description && (
                    <Text style={styles.trackDescription} numberOfLines={2}>
                      {track.description}
                    </Text>
                  )}
                </View>

                <View style={styles.trackActions}>
                  {isReorderMode && isCustomPlaylist ? (
                    <View style={styles.reorderControls}>
                      <TouchableOpacity 
                        style={[styles.reorderButton, index === 0 && styles.disabledReorderButton]}
                        onPress={() => moveTrackUp(index)}
                        disabled={index === 0}
                      >
                        <Text style={[styles.reorderButtonText, index === 0 && styles.disabledReorderButtonText]}>↑</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.reorderButton, index === album.tracks.length - 1 && styles.disabledReorderButton]}
                        onPress={() => moveTrackDown(index)}
                        disabled={index === album.tracks.length - 1}
                      >
                        <Text style={[styles.reorderButtonText, index === album.tracks.length - 1 && styles.disabledReorderButtonText]}>↓</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.trackPlayButton}
                        onPress={() => handleTogglePlayPause(track)}
                      >
                        {state.currentTrack?.id === track.id && state.isPlaying ? (
                          <Pause size={16} color="white" />
                        ) : (
                          <Play size={16} color="white" fill="white" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.trackActionButton}>
                        <Download size={14} color="rgba(255, 255, 255, 0.6)" />
                      </TouchableOpacity>

                      {isCustomPlaylist && (
                        <TouchableOpacity 
                          style={styles.trackActionButton}
                          onPress={() => handleRemoveTrack(track.id)}
                        >
                          <X size={14} color="rgba(255, 100, 100, 0.8)" />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </BlurView>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Playlist Menu Modal */}
      {showPlaylistMenu && (
        <BlurView intensity={30} style={styles.menuOverlay}>
          <TouchableOpacity 
            style={styles.menuBackdrop}
            onPress={() => setShowPlaylistMenu(false)}
          />
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Playlist Options</Text>
              <TouchableOpacity onPress={() => setShowPlaylistMenu(false)}>
                <X size={24} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.menuOption}
              onPress={() => {
                setShowPlaylistMenu(false);
                // TODO: Implement edit playlist functionality
                Alert.alert('Coming Soon', 'Edit playlist functionality will be available soon!');
              }}
            >
              <Edit3 size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.menuOptionText}>Edit Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, styles.deleteOption]}
              onPress={() => {
                setShowPlaylistMenu(false);
                handleDeletePlaylist();
              }}
            >
              <Trash2 size={20} color="#ff6b6b" />
              <Text style={[styles.menuOptionText, styles.deleteOptionText]}>Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  albumInfo: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  albumCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  albumArtwork: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  albumDetails: {
    alignItems: 'center',
  },
  albumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  albumArtist: {
    fontSize: 18,
    color: '#A68752',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  albumMeta: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 16,
  },
  customBadge: {
    color: '#A68752',
    fontWeight: '600',
  },
  albumDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  scienceCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  scienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A68752',
    marginBottom: 12,
  },
  scienceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  playAllButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  playAllGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeActionButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    borderColor: '#A68752',
  },
  reorderInfo: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  reorderInfoText: {
    fontSize: 14,
    color: '#A68752',
    textAlign: 'center',
    fontWeight: '500',
  },
  trackList: {
    paddingHorizontal: 24,
  },
  trackListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  trackItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  trackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  trackNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trackNumberText: {
    color: '#A68752',
    fontSize: 14,
    fontWeight: '600',
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  currentTrackTitle: {
    color: '#A68752',
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trackFrequency: {
    fontSize: 12,
    color: '#A68752',
    fontWeight: '600',
    marginRight: 12,
  },
  trackDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trackDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(166, 135, 82, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderControls: {
    flexDirection: 'column',
    gap: 4,
  },
  reorderButton: {
    width: 32,
    height: 24,
    backgroundColor: 'rgba(166, 135, 82, 0.8)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledReorderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  reorderButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledReorderButtonText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  bottomSpacing: {
    height: 160,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#A68752',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuModal: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  deleteOption: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  menuOptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    fontWeight: '500',
  },
  deleteOptionText: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
});