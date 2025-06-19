import { Tabs } from 'expo-router';
import { Chrome as Home, Library, User } from 'lucide-react-native';
import { useMusic } from '@/contexts/MusicContext';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play, Pause } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const { state, pauseTrack, resumeTrack } = useMusic();

  // Animation values
  const glowOpacity = useSharedValue(0.4);
  const particleOffset = useSharedValue(0);

  useEffect(() => {
    // Golden glow animation for mini player
    glowOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 2500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Particle effect animation
    particleOffset.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Animated styles
  const miniPlayerGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: state.currentTrack ? glowOpacity.value : 0,
    shadowRadius: interpolate(glowOpacity.value, [0.4, 0.8], [8, 16]),
    shadowColor: '#A68752',
    elevation: interpolate(glowOpacity.value, [0.4, 0.8], [8, 16]),
  }));

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          particleOffset.value,
          [0, 1],
          [-50, width + 50]
        )
      }
    ],
    opacity: interpolate(particleOffset.value, [0, 0.3, 0.7, 1], [0, 0.8, 0.8, 0]),
  }));

  const handleMiniPlayerPress = () => {
    router.push('/player');
  };

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = state.duration > 0 ? state.position / state.duration : 0;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingBottom: 34,
            paddingTop: 12,
            height: 88,
          },
          tabBarBackground: () => (
            <BlurView intensity={80} style={styles.tabBarBackground}>
              <LinearGradient
                colors={['rgba(26, 26, 46, 0.95)', 'rgba(15, 23, 42, 0.98)']}
                style={styles.tabBarGradient}
              />
            </BlurView>
          ),
          tabBarActiveTintColor: '#A68752',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ size, color }) => (
              <Library size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
      
      {/* Enhanced Mini Player with Glow Animation */}
      {state.currentTrack && (
        <Animated.View style={[styles.miniPlayerContainer, miniPlayerGlowStyle]}>
          <BlurView intensity={40} style={styles.miniPlayerBlur}>
            <LinearGradient
              colors={['rgba(166, 135, 82, 0.9)', 'rgba(139, 111, 63, 0.9)']}
              style={styles.miniPlayer}
            >
              {/* Animated Particle Effect */}
              <Animated.View style={[styles.particle, particleStyle]} />

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>

              {/* Main Content */}
              <TouchableOpacity 
                style={styles.miniPlayerContent}
                onPress={handleMiniPlayerPress}
                activeOpacity={0.8}
              >
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {state.currentTrack.title}
                  </Text>
                  <View style={styles.trackMeta}>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {state.currentTrack.artist}
                    </Text>
                    {state.currentTrack.frequency && (
                      <>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.trackFrequency}>
                          {state.currentTrack.frequency}
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {formatTime(state.position)} / {formatTime(state.duration)}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={handlePlayPause}
                >
                  <View style={styles.playButtonInner}>
                    {state.isPlaying ? (
                      <Pause size={18} color="white" />
                    ) : (
                      <Play size={18} color="white" fill="white" />
                    )}
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarGradient: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 88,
    left: 12,
    right: 12,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
  },
  miniPlayerBlur: {
    flex: 1,
  },
  miniPlayer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    top: '50%',
    width: 4,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  progressBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  miniPlayerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  trackArtist: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  metaDot: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginHorizontal: 6,
  },
  trackFrequency: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  timeContainer: {
    marginTop: 2,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '500',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});