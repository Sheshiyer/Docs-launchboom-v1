import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Clock, List, Volume2, VolumeX, RotateCcw, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMusic } from '@/contexts/MusicContext';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const timerOptions = [
  { label: 'Off', value: null },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
];

export default function PlayerScreen() {
  const { 
    state, 
    pauseTrack, 
    resumeTrack, 
    skipToNext, 
    skipToPrevious, 
    seekTo,
    setVolume,
    dispatch, 
    formatTimerRemaining,
    formatTime,
    retryPlayback
  } = useMusic();
  
  const [showQueue, setShowQueue] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  // Animation values
  const glowOpacity = useSharedValue(0.3);
  const pulseScale = useSharedValue(1);
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    // Golden glow animation
    glowOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Pulse animation for play button
    pulseScale.value = withRepeat(
      withTiming(1.05, {
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Wave animation
    waveOffset.value = withRepeat(
      withTiming(1, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Animated styles
  const artworkGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
    shadowRadius: interpolate(glowOpacity.value, [0.3, 0.8], [8, 20]),
    shadowColor: '#A68752',
    elevation: interpolate(glowOpacity.value, [0.3, 0.8], [8, 20]),
  }));

  const playButtonPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: state.isPlaying ? pulseScale.value : 1 }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          waveOffset.value,
          [0, 1],
          [-width, width]
        )
      }
    ],
    opacity: interpolate(waveOffset.value, [0, 0.5, 1], [0, 0.6, 0]),
  }));

  const progress = state.duration > 0 ? state.position / state.duration : 0;

  const handleTimerSelect = (timerValue: number | null) => {
    dispatch({ type: 'SET_TIMER', payload: timerValue });
    setShowTimer(false);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekPosition(state.position);
  };

  const handleSeekChange = (value: number) => {
    if (isSeeking) {
      setSeekPosition(value * state.duration);
    }
  };

  const handleSeekComplete = async (value: number) => {
    const newPosition = value * state.duration;
    setSeekPosition(newPosition);
    await seekTo(newPosition);
    setIsSeeking(false);
  };

  const handleVolumeChange = async (volume: number) => {
    await setVolume(volume);
  };

  const displayPosition = isSeeking ? seekPosition : state.position;

  if (!state.currentTrack) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f172a']}
        style={styles.container}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No track selected</Text>
          <TouchableOpacity 
            style={styles.backToHomeButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.backToHomeText}>Browse Music</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f172a']}
      style={styles.container}
    >
      {/* Background Artwork */}
      {state.currentAlbum?.artwork && (
        <Image 
          source={{ uri: state.currentAlbum.artwork }} 
          style={styles.backgroundArtwork}
          blurRadius={50}
        />
      )}
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(26,26,46,0.8)', 'rgba(26,26,46,0.9)']}
        style={styles.overlay}
      />

      {/* Animated Wave Effect */}
      <Animated.View style={[styles.waveEffect, waveStyle]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronDown size={28} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {state.currentTrack.title}
          </Text>
          <Text style={styles.headerSubitle} numberOfLines={1}>
            {state.currentTrack.artist}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => setShowVolumeControl(!showVolumeControl)}>
          {state.volume === 0 ? (
            <VolumeX size={24} color="rgba(255, 255, 255, 0.7)" />
          ) : (
            <Volume2 size={24} color="rgba(255, 255, 255, 0.7)" />
          )}
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      {showVolumeControl && (
        <View style={styles.volumeContainer}>
          <BlurView intensity={20} style={styles.volumeCard}>
            <VolumeX size={16} color="rgba(255, 255, 255, 0.6)" />
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={state.volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#A68752"
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor="#A68752"
            />
            <Volume2 size={16} color="rgba(255, 255, 255, 0.6)" />
          </BlurView>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        {state.error && (
          <View style={styles.errorContainer}>
            <BlurView intensity={20} style={styles.errorCard}>
              <AlertCircle size={20} color="#ff6b6b" />
              <Text style={styles.errorText}>{state.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={retryPlayback}>
                <RotateCcw size={16} color="white" />
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}

        {/* Album Artwork */}
        <View style={styles.artworkContainer}>
          <Animated.View style={[styles.artworkCard, artworkGlowStyle]}>
            <BlurView intensity={30} style={styles.artworkBlur}>
              {state.currentAlbum?.artwork ? (
                <Image 
                  source={{ uri: state.currentAlbum.artwork }} 
                  style={styles.artwork}
                />
              ) : (
                <View style={styles.artworkPlaceholder}>
                  <Text style={styles.artworkPlaceholderText}>♪</Text>
                </View>
              )}
              
              {/* Loading/Buffering Overlay */}
              {(state.isLoading || state.isBuffering) && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#A68752" />
                  <Text style={styles.loadingText}>
                    {state.isLoading ? 'Loading...' : 'Buffering...'}
                  </Text>
                </View>
              )}
            </BlurView>
          </Animated.View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{state.currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{state.currentTrack.artist}</Text>
          {state.currentTrack.frequency && (
            <Text style={styles.trackFrequency}>{state.currentTrack.frequency}</Text>
          )}
          {state.currentTrack.description && (
            <Text style={styles.trackDescription}>{state.currentTrack.description}</Text>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.progressSlider}
            minimumValue={0}
            maximumValue={1}
            value={progress}
            onSlidingStart={handleSeekStart}
            onValueChange={handleSeekChange}
            onSlidingComplete={handleSeekComplete}
            minimumTrackTintColor="#A68752"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#A68752"
            disabled={state.duration === 0}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(state.duration)}</Text>
          </View>
        </View>

        {/* Sleep Timer Display */}
        {state.timer && state.timerRemaining !== null && (
          <View style={styles.timerDisplay}>
            <BlurView intensity={20} style={styles.timerCard}>
              <Clock size={16} color="#A68752" />
              <Text style={styles.timerText}>
                Sleep timer: {formatTimerRemaining()} remaining
              </Text>
            </BlurView>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
          >
            <Shuffle 
              size={24} 
              color={state.isShuffled ? '#A68752' : 'rgba(255, 255, 255, 0.7)'} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious}>
            <SkipBack size={32} color="white" />
          </TouchableOpacity>

          <Animated.View style={playButtonPulseStyle}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={state.isPlaying ? pauseTrack : resumeTrack}
              disabled={state.isLoading}
            >
              <LinearGradient
                colors={['#A68752', '#8B6F3F']}
                style={styles.playButtonGradient}
              >
                {state.isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : state.isPlaying ? (
                  <Pause size={32} color="white" />
                ) : (
                  <Play size={32} color="white" fill="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
            <SkipForward size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => dispatch({ type: 'TOGGLE_LOOP' })}
          >
            <Repeat 
              size={24} 
              color={state.isLooped ? '#A68752' : 'rgba(255, 255, 255, 0.7)'} 
            />
          </TouchableOpacity>
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          <TouchableOpacity 
            style={[styles.secondaryButton, state.timer && styles.activeSecondaryButton]}
            onPress={() => setShowTimer(true)}
          >
            <Clock size={20} color={state.timer ? "#A68752" : "white"} />
            <Text style={[styles.secondaryButtonText, state.timer && styles.activeSecondaryButtonText]}>
              {state.timer ? `${state.timer}m` : 'Timer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowQueue(true)}
          >
            <List size={20} color="white" />
            <Text style={styles.secondaryButtonText}>Queue ({state.queue.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Timer Modal */}
      {showTimer && (
        <BlurView intensity={30} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowTimer(false)}
          />
          <View style={styles.timerModal}>
            <Text style={styles.modalTitle}>Sleep Timer</Text>
            <Text style={styles.modalSubtitle}>
              Music will automatically stop when the timer expires
            </Text>
            {timerOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.timerOption,
                  state.timer === option.value && styles.selectedTimerOption
                ]}
                onPress={() => handleTimerSelect(option.value)}
              >
                <Text style={[
                  styles.timerOptionText,
                  state.timer === option.value && styles.selectedTimerOptionText
                ]}>
                  {option.label}
                </Text>
                {state.timer === option.value && option.value && (
                  <Text style={styles.timerRemainingText}>
                    ({formatTimerRemaining()} remaining)
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTimer(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}

      {/* Queue Modal */}
      {showQueue && (
        <BlurView intensity={30} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowQueue(false)}
          />
          <View style={styles.queueModal}>
            <Text style={styles.modalTitle}>Up Next</Text>
            <ScrollView style={styles.queueList}>
              {state.queue.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.queueItem,
                    track.id === state.currentTrack?.id && styles.currentQueueItem
                  ]}
                >
                  <View style={styles.queueItemLeft}>
                    <Text style={styles.queueItemNumber}>{index + 1}</Text>
                    <View style={styles.queueItemInfo}>
                      <Text style={[
                        styles.queueTrackTitle,
                        track.id === state.currentTrack?.id && styles.currentQueueText
                      ]}>
                        {track.title}
                      </Text>
                      <Text style={[
                        styles.queueTrackArtist,
                        track.id === state.currentTrack?.id && styles.currentQueueText
                      ]}>
                        {track.artist}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.queueTrackDuration}>
                    {formatTime(track.duration * 1000)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowQueue(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
  backgroundArtwork: {
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
  waveEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(166, 135, 82, 0.1)',
    height: 2,
    top: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  volumeContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  volumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  errorText: {
    flex: 1,
    color: '#ff6b6b',
    fontSize: 14,
    marginLeft: 12,
    marginRight: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  artworkCard: {
    width: width - 80,
    height: width - 80,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    shadowOffset: { width: 0, height: 8 },
  },
  artworkBlur: {
    flex: 1,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  artworkPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkPlaceholderText: {
    fontSize: 48,
    color: '#A68752',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackFrequency: {
    fontSize: 14,
    color: '#A68752',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  trackDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  progressSlider: {
    width: '100%',
    height: 40,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  timerDisplay: {
    paddingHorizontal: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.3)',
    backgroundColor: 'rgba(166, 135, 82, 0.1)',
  },
  timerText: {
    color: '#A68752',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
    gap: 20,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 40,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeSecondaryButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    borderColor: 'rgba(166, 135, 82, 0.4)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  activeSecondaryButtonText: {
    color: '#A68752',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  backToHomeButton: {
    backgroundColor: '#A68752',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backToHomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timerModal: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    padding: 24,
    margin: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 280,
  },
  queueModal: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    padding: 24,
    margin: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxHeight: height * 0.7,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  timerOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedTimerOption: {
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    borderColor: '#A68752',
  },
  timerOptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedTimerOptionText: {
    color: '#A68752',
    fontWeight: '600',
  },
  timerRemainingText: {
    color: '#A68752',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  queueList: {
    maxHeight: 300,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  currentQueueItem: {
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    borderColor: '#A68752',
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  queueItemNumber: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
    marginRight: 12,
  },
  queueItemInfo: {
    flex: 1,
  },
  queueTrackTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  queueTrackArtist: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  queueTrackDuration: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  currentQueueText: {
    color: '#A68752',
  },
  closeButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});