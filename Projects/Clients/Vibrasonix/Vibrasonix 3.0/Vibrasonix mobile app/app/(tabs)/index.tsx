import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play, Pause, Clock, Sparkles, Moon, Sun, Wind, Waves as WavesIcon, TrendingUp, Star, Zap, Cloud, Crown, Brain, Heart, Volume2, Headphones, Activity, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useMusic } from '@/contexts/MusicContext';
import { router } from 'expo-router';
import AnimatedReanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing,
  interpolate,
  withSpring,
  withSequence
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Enhanced emotional states with scientific backing
// Local fallback gradients for cards when images fail to load
const cardGradients: Record<string, [string, string, string]> = {
  sleep: ['#1A1A2E', '#16213E', '#0F3460'],
  focus: ['#4A266A', '#5E1675', '#7A1C7C'],
  relax: ['#1E5128', '#4E9F3D', '#D8E9A8'],
  energy: ['#E14D2A', '#FD841F', '#FFB200'],
  pain_relief: ['#850E35', '#EE6983', '#FFC4C4'],
  nsdr: ['#3E6D9C', '#2E4F4F', '#0E8388'],
  meditation: ['#472183', '#4B56D2', '#82C3EC'],
  creativity: ['#FF8B13', '#E97777', '#FFDCA9'],
};

const emotionalStates = [
  {
    id: 'sleep',
    title: 'Deep Sleep',
    subtitle: 'Restorative rest',
    description: 'Delta waves (0.5-4 Hz) promote deep sleep and physical healing',
    icon: Moon,
    color: '#4A5568',
    gradient: ['#2D3748', '#4A5568', '#1A202C'],
    image: 'https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=600',
    frequency: 'Delta Waves',
    benefits: ['Improved sleep quality', 'Physical recovery', 'Memory consolidation'],
    scientificBacking: 'Studies show delta waves enhance deep sleep stages and growth hormone release'
  },
  {
    id: 'focus',
    title: 'Laser Focus',
    subtitle: 'Mental clarity',
    description: 'Beta waves (13-30 Hz) enhance concentration and cognitive performance',
    icon: Brain,
    color: '#805AD5',
    gradient: ['#553C9A', '#805AD5', '#9F7AEA'],
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=600',
    frequency: 'Beta Waves',
    benefits: ['Enhanced concentration', 'Improved productivity', 'Mental alertness'],
    scientificBacking: 'Research demonstrates beta waves increase attention span and cognitive processing'
  },
  {
    id: 'relax',
    title: 'Deep Relaxation',
    subtitle: 'Stress relief',
    description: 'Alpha waves (8-12 Hz) induce calm awareness and reduce anxiety',
    icon: WavesIcon,
    color: '#38B2AC',
    gradient: ['#2C7A7B', '#38B2AC', '#4FD1C7'],
    image: 'https://images.pexels.com/photos/6148926/pexels-photo-6148926.jpeg?auto=compress&cs=tinysrgb&w=600',
    frequency: 'Alpha Waves',
    benefits: ['Reduced stress', 'Emotional balance', 'Peaceful awareness'],
    scientificBacking: 'Alpha waves are associated with relaxed alertness and reduced cortisol levels'
  },
  {
    id: 'energy',
    title: 'Vital Energy',
    subtitle: 'Natural boost',
    description: 'Gamma waves (30-100 Hz) increase energy and mental performance',
    icon: Sun,
    color: '#F6AD55',
    gradient: ['#DD6B20', '#F6AD55', '#FBD38D'],
    image: 'https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg?auto=compress&cs=tinysrgb&w=600',
    frequency: 'Gamma Waves',
    benefits: ['Increased energy', 'Enhanced mood', 'Mental vitality'],
    scientificBacking: 'Gamma waves correlate with heightened awareness and peak performance states'
  },
  {
    id: 'pain_relief',
    title: 'Pain Relief',
    subtitle: 'Natural healing',
    description: '432 Hz frequency promotes cellular healing and pain reduction',
    icon: Heart,
    color: '#E53E3E',
    gradient: ['#C53030', '#E53E3E', '#FC8181'],
    image: 'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=600',
    frequency: '432 Hz',
    benefits: ['Pain reduction', 'Cellular healing', 'Inflammation relief'],
    scientificBacking: '432 Hz resonates with natural body frequencies and promotes healing responses'
  },
  {
    id: 'nsdr',
    title: 'NSDR',
    subtitle: 'Non-sleep deep rest',
    description: 'Theta waves (4-8 Hz) facilitate deep rest without sleep',
    icon: Cloud,
    color: '#6B46C1',
    gradient: ['#553C9A', '#6B46C1', '#8B5CF6'],
    image: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg',
    frequency: 'Theta Waves',
    benefits: ['Deep rest', 'Mental restoration', 'Stress recovery'],
    scientificBacking: 'Theta states provide restorative benefits similar to sleep while maintaining awareness'
  },
  {
    id: 'meditation',
    title: 'Meditation',
    subtitle: 'Mindful awareness',
    description: 'Solfeggio frequencies enhance spiritual connection and mindfulness',
    icon: Sparkles,
    color: '#9F7AEA',
    gradient: ['#805AD5', '#9F7AEA', '#B794F6'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    frequency: 'Solfeggio',
    benefits: ['Spiritual growth', 'Inner peace', 'Mindful awareness'],
    scientificBacking: 'Ancient frequencies used in sacred music promote meditative states and well-being'
  },
  {
    id: 'creativity',
    title: 'Creative Flow',
    subtitle: 'Artistic inspiration',
    description: 'Alpha-theta bridge frequencies unlock creative potential',
    icon: Zap,
    color: '#F093FB',
    gradient: ['#F093FB', '#F5576C', '#4FD1C7'],
    image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
    frequency: 'Alpha-Theta',
    benefits: ['Enhanced creativity', 'Artistic flow', 'Innovation boost'],
    scientificBacking: 'Alpha-theta states are associated with creative insights and artistic breakthroughs'
  },
];

export default function HomeScreen() {
  const { state, playTrack, getTracksByGoal, formatTime } = useMusic();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingGoal, setCurrentlyPlayingGoal] = useState<string | null>(null);
  const [todaysRecommendations, setTodaysRecommendations] = useState<any[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<any[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enhanced animation values
  const glowOpacity = useSharedValue(0.3);
  const particleOffset1 = useSharedValue(0);
  const particleOffset2 = useSharedValue(0);
  const particleOffset3 = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const pulseAnimation = useSharedValue(1);
  const waveAnimation = useSharedValue(0);

  useEffect(() => {
    // Enhanced golden glow animation
    glowOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Staggered particle animations with different patterns
    particleOffset1.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      false
    );

    particleOffset2.value = withRepeat(
      withTiming(1, {
        duration: 12000,
        easing: Easing.bezier(0.2, 0, 0.8, 1),
      }),
      -1,
      false
    );

    particleOffset3.value = withRepeat(
      withTiming(1, {
        duration: 10000,
        easing: Easing.bezier(0.3, 0, 0.7, 1),
      }),
      -1,
      false
    );

    // Pulse animation for active states
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Wave animation for background
    waveAnimation.value = withRepeat(
      withTiming(1, {
        duration: 6000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Enhanced animated styles
  const selectedGoalGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: selectedGoal ? glowOpacity.value : 0,
    shadowRadius: interpolate(glowOpacity.value, [0.3, 0.8], [12, 24]),
    shadowColor: '#A68752',
    elevation: interpolate(glowOpacity.value, [0.3, 0.8], [12, 24]),
    transform: [{ scale: selectedGoal ? pulseAnimation.value : 1 }],
  }));

  const particle1Style = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          particleOffset1.value,
          [0, 1],
          [-30, width + 30]
        )
      },
      {
        translateY: interpolate(
          particleOffset1.value,
          [0, 0.3, 0.7, 1],
          [0, -40, 20, 0]
        )
      },
      {
        rotate: `${interpolate(particleOffset1.value, [0, 1], [0, 360])}deg`
      }
    ],
    opacity: interpolate(particleOffset1.value, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0]),
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          particleOffset2.value,
          [0, 1],
          [-40, width + 40]
        )
      },
      {
        translateY: interpolate(
          particleOffset2.value,
          [0, 0.4, 0.6, 1],
          [0, 30, -30, 0]
        )
      },
      {
        scale: interpolate(particleOffset2.value, [0, 0.5, 1], [0.5, 1.2, 0.5])
      }
    ],
    opacity: interpolate(particleOffset2.value, [0, 0.3, 0.7, 1], [0, 0.7, 0.7, 0]),
  }));

  const particle3Style = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          particleOffset3.value,
          [0, 1],
          [-50, width + 50]
        )
      },
      {
        translateY: interpolate(
          particleOffset3.value,
          [0, 0.2, 0.8, 1],
          [0, -20, 25, 0]
        )
      }
    ],
    opacity: interpolate(particleOffset3.value, [0, 0.4, 0.6, 1], [0, 0.8, 0.8, 0]),
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          waveAnimation.value,
          [0, 1],
          [-width * 2, width * 2]
        )
      }
    ],
    opacity: interpolate(waveAnimation.value, [0, 0.5, 1], [0, 0.3, 0]),
  }));

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Generate randomized recommendations when albums load
  useEffect(() => {
    if (state.albums.length > 0) {
      generateTodaysRecommendations();
      generateFeaturedAlbums();
    }
  }, [state.albums]);

  const generateTodaysRecommendations = () => {
    const allTracks = state.albums.flatMap(album => 
      album.tracks.map(track => ({
        ...track,
        albumTitle: album.title,
        albumArtwork: album.artwork,
        albumIsPremium: album.isPremium
      }))
    );

    if (allTracks.length === 0) return;

    const shuffled = [...allTracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setTodaysRecommendations(shuffled.slice(0, 6));
  };

  const generateFeaturedAlbums = () => {
    if (state.featuredAlbums.length > 0) {
      setFeaturedAlbums(state.featuredAlbums);
    } else {
      const shuffled = [...state.albums];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFeaturedAlbums(shuffled.slice(0, 3));
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleEmotionalStateSelect = async (emotionalState: any) => {
    try {
      // Visual feedback
      setSelectedGoal(emotionalState.id);
      cardScale.value = withSpring(1.05, { damping: 15 });
      
      // Show loading state
      setIsPlaying(true);
      setCurrentlyPlayingGoal(emotionalState.id);
      
      // Get tracks for this emotional state
      const goalTracks = await getTracksByGoal(emotionalState.id);
      
      if (goalTracks.length > 0) {
        // Create a curated album for this emotional state
        const emotionalAlbum = {
          id: `emotional-${emotionalState.id}`,
          title: `${emotionalState.title} Experience`,
          artist: 'Vibrasonix Science',
          artwork: emotionalState.image,
          tracks: goalTracks,
          description: emotionalState.description,
          scienceData: emotionalState.scientificBacking,
          isCustom: false,
          frequency: emotionalState.frequency,
          benefits: emotionalState.benefits,
        };
        
        // Play the first track with smooth transition
        await playTrack(goalTracks[0], emotionalAlbum, 0);
        
        // Navigate to player with enhanced transition
        setTimeout(() => {
          router.push('/player');
        }, 500);
        
        // Show success feedback
        Alert.alert(
          `${emotionalState.title} Activated`,
          `Now playing scientifically curated ${emotionalState.frequency} frequencies for ${emotionalState.subtitle.toLowerCase()}.`,
          [{ text: 'Enjoy', style: 'default' }]
        );
      } else {
        // No tracks found
        setIsPlaying(false);
        setCurrentlyPlayingGoal(null);
        Alert.alert(
          'Coming Soon',
          `${emotionalState.title} frequencies are being prepared. More scientifically curated content will be available soon!`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error loading emotional state tracks:', error);
      setIsPlaying(false);
      setCurrentlyPlayingGoal(null);
      Alert.alert(
        'Connection Error',
        'Unable to load your selected emotional state. Please check your connection and try again.',
        [{ text: 'Retry', style: 'default' }]
      );
    } finally {
      cardScale.value = withSpring(1, { damping: 15 });
    }
  };

  const handlePlayAlbum = (album: any) => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album, 0);
      router.push('/player');
    }
  };

  const handlePlayRecommendation = (track: any) => {
    const tempAlbum = {
      id: 'recommendation',
      title: track.albumTitle,
      artist: track.artist,
      artwork: track.albumArtwork,
      tracks: [track],
      description: 'Today\'s recommendation',
      isCustom: false,
    };
    
    playTrack(track, tempAlbum, 0);
    router.push('/player');
  };

  // Track image loading state for each card
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const renderEmotionalStateCard = ({ item }: { item: any }) => {
    const isSelected = selectedGoal === item.id;
    const isCurrentlyPlaying = currentlyPlayingGoal === item.id && isPlaying;
    const hasImageError = imageLoadErrors[item.id];
    
    // Ensure icon exists, fallback to a default icon if not
    const IconComponent = item.icon || Moon;
    
    // Use fallback gradient if image fails to load
    const fallbackGradient = cardGradients[item.id] || ['#1A1A2E', '#16213E', '#0F3460'] as [string, string, string];
    
    return (
      <TouchableOpacity
        style={styles.emotionalCard}
        onPress={() => handleEmotionalStateSelect(item)}
        activeOpacity={0.8}
      >
        <AnimatedReanimated.View style={isSelected ? selectedGoalGlowStyle : {}}>
          <BlurView intensity={20} style={styles.emotionalCardBlur}>
            <LinearGradient
              colors={item.gradient}
              style={[
                styles.emotionalCardGradient,
                isSelected && styles.selectedEmotionalCard
              ]}
            >
              {!hasImageError ? (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.emotionalCardImage}
                  onError={(e) => {
                    console.log('Image loading error:', e.nativeEvent.error);
                    setImageLoadErrors(prev => ({ ...prev, [item.id]: true }));
                  }}
                />
              ) : null}
              
              {/* Fallback gradient when image fails to load */}
              {hasImageError ? (
                <LinearGradient
                  colors={fallbackGradient}
                  style={[styles.emotionalCardImage, styles.fallbackGradient]}
                />
              ) : null}
              
              {/* Enhanced overlay with scientific info */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
                style={styles.emotionalCardOverlay}
              >
                <View style={styles.emotionalCardContent}>
                  {/* Icon and status */}
                  <View style={styles.cardHeader}>
                    <IconComponent size={28} color="white" strokeWidth={1.5} />
                    {isCurrentlyPlaying && (
                      <View style={styles.playingIndicator}>
                        <Activity size={16} color="#A68752" />
                        <Text style={styles.playingText}>Playing</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Main content */}
                  <View style={styles.cardMainContent}>
                    <Text style={styles.emotionalCardTitle}>{item.title}</Text>
                    <Text style={styles.emotionalCardSubtitle}>{item.subtitle}</Text>
                    
                    {/* Scientific frequency badge */}
                    <View style={styles.frequencyBadge}>
                      <Volume2 size={12} color="#A68752" />
                      <Text style={styles.frequencyText}>{item.frequency}</Text>
                    </View>
                    
                    {/* Benefits preview */}
                    <View style={styles.benefitsContainer}>
                      {item.benefits.slice(0, 2).map((benefit: string, index: number) => (
                        <View key={index} style={styles.benefitItem}>
                          <View style={styles.benefitDot} />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Action indicator */}
                  <View style={styles.cardAction}>
                    <View style={styles.actionButton}>
                      <Play size={16} color="white" fill="white" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
              
              {/* Selection indicator */}
              {isSelected && (
                <View style={styles.selectionIndicator}>
                  <View style={styles.selectionRing}>
                    <Sparkles size={20} color="#A68752" />
                  </View>
                </View>
              )}
            </LinearGradient>
          </BlurView>
        </AnimatedReanimated.View>
      </TouchableOpacity>
    );
  };

  const renderRecommendationCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.recommendationCard} 
      onPress={() => handlePlayRecommendation(item)}
      activeOpacity={0.9}
    >
      <BlurView intensity={20} style={styles.recommendationBlur}>
        <Image source={{ uri: item.albumArtwork }} style={styles.recommendationImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.recommendationOverlay}
        >
          <View style={styles.recommendationContent}>
            <View style={styles.recommendationHeader}>
              {item.albumIsPremium && (
                <View style={styles.premiumBadge}>
                  <Crown size={10} color="#FFD700" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
              <TouchableOpacity style={styles.playButton}>
                <Play size={16} color="white" fill="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationTitle}>{item.title}</Text>
              <Text style={styles.recommendationArtist}>{item.artist}</Text>
              {item.frequency && (
                <Text style={styles.recommendationFrequency}>{item.frequency}</Text>
              )}
              <Text style={styles.recommendationDuration}>
                {formatTime(item.duration * 1000)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  const renderFeaturedAlbum = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.featuredAlbumCard}
      onPress={() => handlePlayAlbum(item)}
      activeOpacity={0.9}
    >
      <BlurView intensity={30} style={styles.featuredAlbumBlur}>
        <Image source={{ uri: item.artwork }} style={styles.featuredAlbumImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.featuredAlbumOverlay}
        >
          <View style={styles.featuredAlbumContent}>
            <View style={styles.featuredAlbumHeader}>
              <View style={styles.albumBadge}>
                <Sparkles size={12} color="#A68752" />
                <Text style={styles.albumBadgeText}>Featured</Text>
              </View>
              
              {item.isPremium && (
                <View style={styles.premiumBadge}>
                  <Crown size={10} color="#FFD700" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
            </View>
            
            <View style={styles.albumInfo}>
              <Text style={styles.albumTitle}>{item.title}</Text>
              <Text style={styles.albumArtist}>{item.artist}</Text>
              <Text style={styles.albumTracks}>{item.tracks.length} tracks</Text>
            </View>
            
            <TouchableOpacity style={styles.albumPlayButton}>
              <LinearGradient
                colors={['#A68752', '#8B6F3F']}
                style={styles.albumPlayGradient}
              >
                <Play size={20} color="white" fill="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#16213E']}
        style={styles.background}
      />

      {/* Floating Particles */}
      <AnimatedReanimated.View style={[styles.particle, styles.particle1, particle1Style]} />
      <AnimatedReanimated.View style={[styles.particle, styles.particle2, particle2Style]} />
      <AnimatedReanimated.View style={[styles.particle, styles.particle3, particle3Style]} />

      {/* Wave Effect */}
      <AnimatedReanimated.View style={[styles.waveEffect, waveStyle]} />

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.heroTitle}>Find Your Perfect Frequency</Text>
          <Text style={styles.heroSubtitle}>
            Scientifically crafted soundscapes for every emotional state
          </Text>
        </View>

        {/* Emotional States Section - Enhanced */}
        <View style={styles.emotionalSection}>
          <View style={styles.emotionalSectionHeader}>
            <Text style={styles.emotionalSectionTitle}>What is your emotional goal?</Text>
            <Text style={styles.emotionalSectionSubtitle}>
              Choose your desired state and let science guide your journey
            </Text>
          </View>
          
          <FlatList
            data={emotionalStates}
            renderItem={renderEmotionalStateCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionalList}
            style={styles.emotionalFlatList}
          />
          
          {/* Selection Status */}
          {selectedGoal && (
            <View style={styles.selectionStatus}>
              <CheckCircle size={16} color="#A68752" />
              <Text style={styles.selectionStatusText}>
                {emotionalStates.find(s => s.id === selectedGoal)?.title} selected
              </Text>
            </View>
          )}
        </View>

        {/* Today's Recommendations */}
        {todaysRecommendations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Recommendations</Text>
              <Text style={styles.sectionSubtitle}>Curated for your wellness journey</Text>
            </View>
            <FlatList
              data={todaysRecommendations}
              renderItem={renderRecommendationCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationList}
            />
          </View>
        )}

        {/* Featured Albums */}
        {featuredAlbums.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Collections</Text>
              <Text style={styles.sectionSubtitle}>Premium healing frequencies</Text>
            </View>
            <FlatList
              data={featuredAlbums}
              renderItem={renderFeaturedAlbum}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
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
  particle: {
    position: 'absolute',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  particle1: {
    width: 3,
    height: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    top: '20%',
  },
  particle2: {
    width: 2,
    height: 2,
    backgroundColor: '#A68752',
    shadowColor: '#A68752',
    top: '60%',
  },
  particle3: {
    width: 4,
    height: 4,
    backgroundColor: '#FFA500',
    shadowColor: '#FFA500',
    top: '40%',
  },
  waveEffect: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22,
  },
  emotionalSection: {
    marginBottom: 40,
    backgroundColor: 'rgba(166, 135, 82, 0.05)',
    paddingVertical: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.2)',
  },
  emotionalSectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  emotionalSectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  emotionalSectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  emotionalFlatList: {
    marginBottom: 20,
  },
  emotionalList: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  emotionalCard: {
    width: 200,
    height: 280,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  emotionalCardBlur: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  emotionalCardGradient: {
    flex: 1,
    position: 'relative',
    borderRadius: 24,
  },
  selectedEmotionalCard: {
    borderWidth: 2,
    borderColor: '#A68752',
  },
  emotionalCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.2)', // Add background color as fallback
  },
  fallbackGradient: {
    opacity: 1,
  },
  emotionalCardOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 24,
  },
  emotionalCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardMainContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  emotionalCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  emotionalCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  frequencyText: {
    color: '#A68752',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A68752',
    marginRight: 8,
  },
  benefitText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  cardAction: {
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  selectionRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  selectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  selectionStatusText: {
    fontSize: 14,
    color: '#A68752',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  recommendationList: {
    paddingLeft: 24,
  },
  recommendationCard: {
    width: width * 0.7,
    height: 160,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  recommendationBlur: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  recommendationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
    borderRadius: 20,
  },
  recommendationOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  recommendationContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  premiumBadgeText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '700',
    marginLeft: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166, 135, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recommendationInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  recommendationArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  recommendationFrequency: {
    fontSize: 12,
    color: '#A68752',
    fontWeight: '600',
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  recommendationDuration: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  featuredList: {
    paddingLeft: 24,
  },
  featuredAlbumCard: {
    width: width * 0.7,
    height: 280,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredAlbumBlur: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  featuredAlbumImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    borderRadius: 20,
  },
  featuredAlbumOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  featuredAlbumContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  featuredAlbumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  albumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  albumBadgeText: {
    fontSize: 11,
    color: '#A68752',
    fontWeight: '600',
    marginLeft: 4,
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  albumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  albumTracks: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  albumPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  albumPlayGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 160,
  },
});