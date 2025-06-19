import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Waves, ArrowRight, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function AuthIndexScreen() {
  const { user, loading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isNavigationReady && !loading && user) {
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [user, loading, isNavigationReady]);

  if (loading || !isNavigationReady) {
    return (
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#16213E']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.logoContainer}>
            <Waves size={48} color="#A68752" strokeWidth={1.5} />
            <Sparkles size={24} color="#A68752" style={styles.sparkle} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0A0A0F', '#1A1A2E', '#16213E']}
      style={styles.container}
    >
      {/* Background Image */}
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg' }} 
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['rgba(10,10,15,0.4)', 'rgba(26,26,46,0.8)', 'rgba(26,26,46,0.95)']}
        style={styles.overlay}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={20} style={styles.logoCard}>
            <View style={styles.logoContainer}>
              <Waves size={48} color="#A68752" strokeWidth={1.5} />
              <Sparkles size={24} color="#A68752" style={styles.sparkle} />
            </View>
          </BlurView>
          
          <Text style={styles.title}>Vibrasonix</Text>
          <Text style={styles.subtitle}>Premium Relaxation Music</Text>
          <Text style={styles.description}>
            Experience the healing power of scientifically-crafted frequencies
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <BlurView intensity={30} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/onboarding')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#A68752', '#8B6F3F']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <ArrowRight size={20} color="white" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/signin')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/signup')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <BlurView intensity={15} style={styles.featuresCard}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Binaural beats & healing frequencies</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Scientifically proven benefits</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Offline downloads available</Text>
            </View>
          </BlurView>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
  },
  logoCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(166, 135, 82, 0.3)',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#A68752',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#A68752',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featuresCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A68752',
    marginRight: 12,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
});