import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronRight, Brain, Waves, Music } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to Vibrasonix',
    subtitle: 'Discover the Healing Power of Sound',
    description: 'Experience scientifically-crafted frequencies designed to enhance your well-being through the power of sound therapy.',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    icon: Music,
    color: '#A68752',
  },
  {
    title: 'Binaural Beats',
    subtitle: 'Synchronize Your Brainwaves',
    description: 'Two slightly different frequencies played in each ear create a third frequency that influences your brainwave activity, promoting relaxation and focus.',
    image: 'https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg',
    icon: Brain,
    color: '#6b73ff',
  },
  {
    title: '432 Hz Healing',
    subtitle: 'The Universal Frequency',
    description: 'Tuned to 432 Hz, the "natural frequency," our tracks resonate with the universe to promote natural healing and harmony.',
    image: 'https://images.pexels.com/photos/6148926/pexels-photo-6148926.jpeg',
    icon: Waves,
    color: '#4ecdc4',
  },
  {
    title: 'Science-Backed Results',
    subtitle: 'Proven Benefits',
    description: 'Research shows that specific frequencies can improve sleep quality, reduce stress, enhance focus, and promote overall well-being.',
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
    icon: Brain,
    color: '#ff6b6b',
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/(auth)');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)');
  };

  const currentData = onboardingData[currentPage];

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f172a']}
      style={styles.container}
    >
      {/* Background Image */}
      <Image 
        source={{ uri: currentData.image }} 
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(26,26,46,0.8)', 'rgba(26,26,46,0.95)']}
        style={styles.overlay}
      />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <BlurView intensity={30} style={styles.contentCard}>
          <View style={[styles.iconContainer, { backgroundColor: currentData.color }]}>
            <currentData.icon size={32} color="white" />
          </View>
          
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          <Text style={styles.description}>{currentData.description}</Text>
        </BlurView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        {/* Page Indicators */}
        <View style={styles.pageIndicators}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentPage && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['#A68752', '#8B6F3F']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ChevronRight size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    right: 0,
    bottom: 0,
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 12,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  contentCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A68752',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    alignItems: 'center',
  },
  pageIndicators: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#A68752',
    width: 24,
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});