import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play, Download, Plus, Search, Filter, Grid3x3 as Grid3X3, List, Clock, Shuffle, TrendingUp, Music, Headphones, X, Check, ArrowLeft, ChevronRight, Crown } from 'lucide-react-native';
import { useMusic } from '@/contexts/MusicContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const libraryTabs = [
  { id: 'all', title: 'All', icon: Grid3X3 },
  { id: 'albums', title: 'Albums', icon: Music },
  { id: 'playlists', title: 'Playlists', icon: List },
  { id: 'downloaded', title: 'Downloaded', icon: Download },
];

const sortOptions = [
  { id: 'recent', title: 'Recently Added', icon: Clock },
  { id: 'name', title: 'Name', icon: List },
  { id: 'artist', title: 'Artist', icon: Headphones },
  { id: 'popular', title: 'Most Popular', icon: TrendingUp },
];

export default function LibraryScreen() {
  const { state, playTrack, dispatch } = useMusic();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom album creation states
  const [createStep, setCreateStep] = useState<'name' | 'albums' | 'tracks'>('name');
  const [customAlbumName, setCustomAlbumName] = useState('');
  const [customAlbumDescription, setCustomAlbumDescription] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);
  const [visitedAlbums, setVisitedAlbums] = useState<string[]>([]);

  const allAlbums = [...state.albums, ...state.customAlbums];
  const recentlyPlayed = state.albums.slice(0, 3);

  const handlePlayAlbum = (album: any) => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album);
      router.push('/player');
    }
  };

  const handleCreateCustomAlbum = () => {
    setShowCreateModal(true);
    setCreateStep('name');
    setCustomAlbumName('');
    setCustomAlbumDescription('');
    setSelectedAlbum(null);
    setSelectedTracks([]);
    setVisitedAlbums([]);
  };

  const handleNextStep = () => {
    if (createStep === 'name' && customAlbumName.trim()) {
      setCreateStep('albums');
    } else if (createStep === 'albums' && selectedAlbum) {
      setCreateStep('tracks');
    }
  };

  const handleSelectAlbum = (album: any) => {
    setSelectedAlbum(album);
    setCreateStep('tracks');
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setCreateStep('albums');
  };

  const handleToggleTrack = (track: any) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        // Add track with album info for better organization
        const trackWithAlbum = {
          ...track,
          albumTitle: selectedAlbum.title,
          albumArtwork: selectedAlbum.artwork
        };
        return [...prev, trackWithAlbum];
      }
    });
  };

  const handleDoneWithAlbum = () => {
    // Mark this album as visited
    if (selectedAlbum && !visitedAlbums.includes(selectedAlbum.id)) {
      setVisitedAlbums(prev => [...prev, selectedAlbum.id]);
    }
    
    // Go back to album selection
    setSelectedAlbum(null);
    setCreateStep('albums');
  };

  const handleCreatePlaylist = () => {
    if (selectedTracks.length === 0) return;

    // Use the first track's album artwork as the playlist artwork
    const playlistArtwork = selectedTracks[0]?.albumArtwork || selectedTracks[0]?.artwork || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg';

    const customAlbum = {
      id: `custom-${Date.now()}`,
      title: customAlbumName,
      artist: 'Custom Playlist',
      artwork: playlistArtwork,
      description: customAlbumDescription,
      tracks: selectedTracks,
      isCustom: true,
      isPremium: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CUSTOM_ALBUM', payload: customAlbum });
    setShowCreateModal(false);
    setCreateStep('name');
  };

  const renderTabButton = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === item.id && styles.activeTabButton]}
      onPress={() => setActiveTab(item.id)}
    >
      <item.icon 
        size={18} 
        color={activeTab === item.id ? '#A68752' : 'rgba(255, 255, 255, 0.6)'} 
        strokeWidth={1.5}
      />
      <Text style={[
        styles.tabButtonText,
        activeTab === item.id && styles.activeTabButtonText
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderGridAlbum = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.gridAlbumCard}
      onPress={() => router.push(`/album/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.gridAlbumImageContainer}>
        <Image source={{ uri: item.artwork }} style={styles.gridAlbumImage} />
        
        {/* Premium Badge */}
        {item.isPremium && (
          <View style={styles.gridPremiumBadge}>
            <Crown size={12} color="#FFD700" />
          </View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gridAlbumOverlay}
        >
          <TouchableOpacity 
            style={styles.gridPlayButton}
            onPress={() => handlePlayAlbum(item)}
          >
            <Play size={16} color="white" fill="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      
      <View style={styles.gridAlbumInfo}>
        <View style={styles.gridAlbumTitleContainer}>
          <Text style={styles.gridAlbumTitle} numberOfLines={2}>{item.title}</Text>
          {item.isPremium && (
            <Crown size={14} color="#FFD700" style={styles.gridTitlePremiumIcon} />
          )}
        </View>
        <Text style={styles.gridAlbumArtist} numberOfLines={1}>{item.artist}</Text>
        <Text style={styles.gridAlbumTracks}>{item.tracks.length} tracks</Text>
      </View>
    </TouchableOpacity>
  );

  const renderListAlbum = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listAlbumCard}
      onPress={() => router.push(`/album/${item.id}`)}
      activeOpacity={0.9}
    >
      <BlurView intensity={15} style={styles.listAlbumBlur}>
        <View style={styles.listAlbumImageContainer}>
          <Image source={{ uri: item.artwork }} style={styles.listAlbumImage} />
          {item.isPremium && (
            <View style={styles.listPremiumBadge}>
              <Crown size={10} color="#FFD700" />
            </View>
          )}
        </View>
        
        <View style={styles.listAlbumInfo}>
          <View style={styles.listAlbumTitleContainer}>
            <Text style={styles.listAlbumTitle} numberOfLines={1}>{item.title}</Text>
            {item.isPremium && (
              <Crown size={14} color="#FFD700" style={styles.listTitlePremiumIcon} />
            )}
          </View>
          <Text style={styles.listAlbumArtist} numberOfLines={1}>{item.artist}</Text>
          <View style={styles.listAlbumMeta}>
            <Text style={styles.listAlbumTracks}>{item.tracks.length} tracks</Text>
            <Text style={styles.listAlbumDot}>•</Text>
            <Text style={styles.listAlbumDate}>{item.releaseDate || item.createdAt ? new Date(item.createdAt).getFullYear() : '2024'}</Text>
          </View>
        </View>

        <View style={styles.listAlbumActions}>
          <TouchableOpacity style={styles.listActionButton}>
            <Download size={18} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.listPlayButton}
            onPress={() => handlePlayAlbum(item)}
          >
            <Play size={18} color="white" fill="white" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderRecentlyPlayed = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.recentCard}
      onPress={() => handlePlayAlbum(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.recentImage} />
      {item.isPremium && (
        <View style={styles.recentPremiumBadge}>
          <Crown size={10} color="#FFD700" />
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.recentOverlay}
      >
        <View style={styles.recentContent}>
          <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.recentArtist} numberOfLines={1}>{item.artist}</Text>
        </View>
        <TouchableOpacity style={styles.recentPlayButton}>
          <Play size={14} color="white" fill="white" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAlbumForSelection = ({ item }: { item: any }) => {
    const isVisited = visitedAlbums.includes(item.id);
    const tracksFromThisAlbum = selectedTracks.filter(track => track.albumTitle === item.title).length;
    
    return (
      <TouchableOpacity
        style={[
          styles.selectionAlbumCard,
          isVisited && styles.visitedAlbumCard
        ]}
        onPress={() => handleSelectAlbum(item)}
      >
        <View style={styles.selectionAlbumImageContainer}>
          <Image source={{ uri: item.artwork }} style={styles.selectionAlbumImage} />
          {item.isPremium && (
            <View style={styles.selectionPremiumBadge}>
              <Crown size={10} color="#FFD700" />
            </View>
          )}
        </View>
        <View style={styles.selectionAlbumInfo}>
          <Text style={styles.selectionAlbumTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.selectionAlbumArtist} numberOfLines={1}>{item.artist}</Text>
          <Text style={styles.selectionAlbumTracks}>
            {item.tracks.length} tracks
            {tracksFromThisAlbum > 0 && (
              <Text style={styles.selectedTracksCount}> • {tracksFromThisAlbum} selected</Text>
            )}
          </Text>
        </View>
        <View style={styles.albumSelectionRight}>
          {tracksFromThisAlbum > 0 && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>{tracksFromThisAlbum}</Text>
            </View>
          )}
          <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrackForSelection = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedTracks.some(t => t.id === item.id);
    const selectedIndex = selectedTracks.findIndex(t => t.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.selectionTrackCard,
          isSelected && styles.selectedTrackCard
        ]}
        onPress={() => handleToggleTrack(item)}
      >
        <View style={styles.trackSelectionLeft}>
          <View style={[
            styles.trackNumber,
            isSelected && styles.selectedTrackNumber
          ]}>
            <Text style={[
              styles.trackNumberText,
              isSelected && styles.selectedTrackNumberText
            ]}>
              {isSelected ? selectedIndex + 1 : index + 1}
            </Text>
          </View>
          
          <View style={styles.trackSelectionInfo}>
            <Text style={[
              styles.trackSelectionTitle,
              isSelected && styles.selectedTrackText
            ]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.trackSelectionMeta}>
              {item.frequency && (
                <Text style={styles.trackFrequency}>{item.frequency}</Text>
              )}
              <Text style={styles.trackDuration}>
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>

        <View style={[
          styles.selectionCheckbox,
          isSelected && styles.selectedCheckbox
        ]}>
          {isSelected && <Check size={14} color="white" strokeWidth={2} />}
        </View>
      </TouchableOpacity>
    );
  };

  const getFilteredAlbums = () => {
    let filtered = allAlbums;
    
    if (activeTab === 'albums') {
      filtered = state.albums;
    } else if (activeTab === 'playlists') {
      filtered = state.customAlbums;
    } else if (activeTab === 'downloaded') {
      filtered = allAlbums.filter(album => 
        state.downloads.some(downloadId => album.tracks.some(track => track.id === downloadId))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(album =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#16213E']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Your Library</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={22} color="rgba(255, 255, 255, 0.8)" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowSortModal(true)}
            >
              <Filter size={22} color="rgba(255, 255, 255, 0.8)" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateCustomAlbum}
            >
              <Plus size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <FlatList
          data={libraryTabs}
          renderItem={renderTabButton}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
        />

        {/* View Toggle */}
        <View style={styles.viewControls}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'grid' && styles.activeViewButton]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} color={viewMode === 'grid' ? '#A68752' : 'rgba(255, 255, 255, 0.6)'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
              onPress={() => setViewMode('list')}
            >
              <List size={16} color={viewMode === 'list' ? '#A68752' : 'rgba(255, 255, 255, 0.6)'} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.shuffleButton}>
            <Shuffle size={16} color="#A68752" strokeWidth={1.5} />
            <Text style={styles.shuffleText}>Shuffle All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recently Played */}
        {activeTab === 'all' && recentlyPlayed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <FlatList
              data={recentlyPlayed}
              renderItem={renderRecentlyPlayed}
              keyExtractor={(item) => `recent-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            />
          </View>
        )}

        {/* Quick Actions */}
        {activeTab === 'all' && (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={['#553C9A', '#805AD5']}
                style={styles.quickActionGradient}
              >
                <Download size={24} color="white" strokeWidth={1.5} />
                <Text style={styles.quickActionTitle}>Downloaded</Text>
                <Text style={styles.quickActionSubtitle}>{state.downloads.length} tracks</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={['#2C7A7B', '#38B2AC']}
                style={styles.quickActionGradient}
              >
                <Music size={24} color="white" strokeWidth={1.5} />
                <Text style={styles.quickActionTitle}>Playlists</Text>
                <Text style={styles.quickActionSubtitle}>{state.customAlbums.length} playlists</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Albums Grid/List */}
        <View style={styles.albumsSection}>
          <View style={styles.albumsHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'all' ? 'All Music' : 
               activeTab === 'albums' ? 'Albums' :
               activeTab === 'playlists' ? 'Playlists' : 'Downloaded'}
            </Text>
            <Text style={styles.albumsCount}>
              {getFilteredAlbums().length} {getFilteredAlbums().length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {viewMode === 'grid' ? (
            <FlatList
              key={viewMode}
              data={getFilteredAlbums()}
              renderItem={renderGridAlbum}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <FlatList
              key={viewMode}
              data={getFilteredAlbums()}
              renderItem={renderListAlbum}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sort Modal */}
      {showSortModal && (
        <BlurView intensity={30} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowSortModal(false)}
          />
          <View style={styles.sortModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={24} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.sortOption, sortBy === option.id && styles.selectedSortOption]}
                onPress={() => {
                  setSortBy(option.id);
                  setShowSortModal(false);
                }}
              >
                <option.icon 
                  size={20} 
                  color={sortBy === option.id ? '#A68752' : 'rgba(255, 255, 255, 0.6)'} 
                />
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.selectedSortOptionText
                ]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      )}

      {/* Create Custom Album Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <BlurView intensity={30} style={styles.createModalOverlay}>
          <View style={styles.createModalContent}>
            {/* Header */}
            <View style={styles.createModalHeader}>
              <TouchableOpacity 
                onPress={() => {
                  if (createStep === 'name') {
                    setShowCreateModal(false);
                  } else if (createStep === 'albums') {
                    setCreateStep('name');
                  } else {
                    handleBackToAlbums();
                  }
                }}
              >
                {createStep === 'tracks' ? (
                  <ArrowLeft size={24} color="white" />
                ) : (
                  <X size={24} color="white" />
                )}
              </TouchableOpacity>
              
              <Text style={styles.createModalTitle}>
                {createStep === 'name' ? 'Create Playlist' :
                 createStep === 'albums' ? 'Select Albums' : 
                 `Select from "${selectedAlbum?.title}"`}
              </Text>
              
              {createStep === 'name' && (
                <TouchableOpacity 
                  onPress={handleNextStep}
                  disabled={!customAlbumName.trim()}
                  style={[
                    styles.nextButton,
                    !customAlbumName.trim() && styles.disabledButton
                  ]}
                >
                  <Text style={[
                    styles.nextButtonText,
                    !customAlbumName.trim() && styles.disabledButtonText
                  ]}>
                    Next
                  </Text>
                </TouchableOpacity>
              )}

              {createStep === 'albums' && (
                <TouchableOpacity 
                  onPress={handleCreatePlaylist}
                  disabled={selectedTracks.length === 0}
                  style={[
                    styles.nextButton,
                    selectedTracks.length === 0 && styles.disabledButton
                  ]}
                >
                  <Text style={[
                    styles.nextButtonText,
                    selectedTracks.length === 0 && styles.disabledButtonText
                  ]}>
                    Create ({selectedTracks.length})
                  </Text>
                </TouchableOpacity>
              )}

              {createStep === 'tracks' && (
                <TouchableOpacity 
                  onPress={handleDoneWithAlbum}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            <ScrollView style={styles.createModalBody} showsVerticalScrollIndicator={false}>
              {createStep === 'name' && (
                <View style={styles.nameStep}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Playlist Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={customAlbumName}
                      onChangeText={setCustomAlbumName}
                      placeholder="Enter playlist name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description (Optional)</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={customAlbumDescription}
                      onChangeText={setCustomAlbumDescription}
                      placeholder="Enter description"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              )}

              {createStep === 'albums' && (
                <View style={styles.albumsStep}>
                  <Text style={styles.stepDescription}>
                    Select albums to choose tracks from ({selectedTracks.length} tracks selected)
                  </Text>
                  <FlatList
                    data={state.albums}
                    renderItem={renderAlbumForSelection}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.albumSelectionList}
                  />
                </View>
              )}

              {createStep === 'tracks' && selectedAlbum && (
                <View style={styles.tracksStep}>
                  <Text style={styles.stepDescription}>
                    Select tracks to add to your playlist
                  </Text>
                  <FlatList
                    data={selectedAlbum.tracks}
                    renderItem={renderTrackForSelection}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.trackSelectionList}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A68752',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsList: {
    paddingLeft: 24,
    marginBottom: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  tabButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: '#A68752',
    fontWeight: '600',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 2,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(166, 135, 82, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.2)',
  },
  shuffleText: {
    fontSize: 14,
    color: '#A68752',
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  recentList: {
    paddingLeft: 24,
  },
  recentCard: {
    width: 160,
    height: 100,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentPremiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 8,
    padding: 4,
    zIndex: 2,
  },
  recentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  recentPlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  albumsSection: {
    paddingHorizontal: 24,
  },
  albumsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  albumsCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  gridContainer: {
    gap: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridAlbumCard: {
    width: (width - 64) / 2,
  },
  gridAlbumImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  gridAlbumImage: {
    width: '100%',
    height: '100%',
  },
  gridPremiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 8,
    padding: 4,
    zIndex: 2,
  },
  gridAlbumOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  gridPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridAlbumInfo: {
    paddingHorizontal: 4,
  },
  gridAlbumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  gridAlbumTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    lineHeight: 18,
    flex: 1,
  },
  gridTitlePremiumIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  gridAlbumArtist: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  gridAlbumTracks: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  listContainer: {
    gap: 12,
  },
  listAlbumCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  listAlbumBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  listAlbumImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  listAlbumImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listPremiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 8,
    padding: 3,
    zIndex: 2,
  },
  listAlbumInfo: {
    flex: 1,
  },
  listAlbumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listAlbumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  listTitlePremiumIcon: {
    marginLeft: 8,
  },
  listAlbumArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  listAlbumMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listAlbumTracks: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  listAlbumDot: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  listAlbumDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  listAlbumActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sortModal: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedSortOption: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  sortOptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    fontWeight: '500',
  },
  selectedSortOptionText: {
    color: '#A68752',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 160,
  },
  // Create Modal Styles
  createModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  createModalContent: {
    backgroundColor: 'rgba(26, 26, 46, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '90%',
    minHeight: '70%',
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  createModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#A68752',
    borderRadius: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  createModalBody: {
    flex: 1,
    padding: 24,
  },
  nameStep: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  albumsStep: {
    gap: 16,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  albumSelectionList: {
    gap: 12,
  },
  selectionAlbumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  visitedAlbumCard: {
    backgroundColor: 'rgba(166, 135, 82, 0.1)',
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  selectionAlbumImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  selectionAlbumImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectionPremiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 6,
    padding: 2,
    zIndex: 2,
  },
  selectionAlbumInfo: {
    flex: 1,
  },
  selectionAlbumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  selectionAlbumArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  selectionAlbumTracks: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  selectedTracksCount: {
    color: '#A68752',
    fontWeight: '600',
  },
  albumSelectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A68752',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  tracksStep: {
    gap: 16,
  },
  trackSelectionList: {
    gap: 8,
  },
  selectionTrackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedTrackCard: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    borderColor: '#A68752',
  },
  trackSelectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedTrackNumber: {
    backgroundColor: '#A68752',
  },
  trackNumberText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  selectedTrackNumberText: {
    color: 'white',
  },
  trackSelectionInfo: {
    flex: 1,
  },
  trackSelectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  selectedTrackText: {
    color: '#A68752',
  },
  trackSelectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackFrequency: {
    fontSize: 11,
    color: '#A68752',
    fontWeight: '600',
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trackDuration: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: '#A68752',
    borderColor: '#A68752',
  },
});