import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  User, 
  Settings, 
  Download, 
  Music, 
  LogOut, 
  Crown, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  Star, 
  ChevronRight, 
  Volume2, 
  Wifi, 
  Moon, 
  Smartphone, 
  Globe, 
  CreditCard, 
  Gift, 
  Share2, 
  MessageCircle, 
  Mail, 
  X, 
  Check, 
  CreditCard as Edit3, 
  Camera, 
  Headphones, 
  Timer, 
  Zap, 
  Database,
  Sparkles
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { DodoPaymentService, usePayments } from '@/lib/payments';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut, isPremium } = useAuth();
  const { state } = useMusic();
  const { paymentStatus, loading: paymentLoading, checkPaymentStatus, initiatePayment } = usePayments();
  
  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(false);
  
  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.display_name || 'Music Lover');
  const [email, setEmail] = useState(user?.email || 'demo@vibrasonix.com');

  React.useEffect(() => {
    if (user) {
      checkPaymentStatus(user.id);
    }
  }, [user]);

  const profileStats = [
    { label: 'Listening Time', value: '127h', icon: Headphones, color: '#A68752' },
    { label: 'Downloads', value: state.downloads.length.toString(), icon: Download, color: '#4ecdc4' },
    { label: 'Playlists', value: state.customAlbums.length.toString(), icon: Music, color: '#9b59b6' },
    { label: 'Sessions', value: '89', icon: Timer, color: '#ff6b6b' },
  ];

  const handleUpgradeToPremium = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to upgrade to premium');
      return;
    }

    try {
      Alert.alert(
        'Upgrade to Premium',
        'You will be redirected to our secure payment page. After completing payment, your account will be automatically upgraded.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue', 
            onPress: async () => {
              try {
                await initiatePayment(user.id);
              } catch (error) {
                Alert.alert('Error', 'Failed to open payment page. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          label: 'Edit Profile', 
          icon: Edit3, 
          color: 'white',
          action: () => setShowEditProfile(true)
        },
        { 
          label: 'Premium', 
          icon: Crown, 
          color: isPremium ? '#A68752' : 'white', 
          badge: isPremium ? 'Active' : 'Upgrade',
          badgeColor: isPremium ? '#A68752' : '#ff6b6b',
          action: () => setShowPremiumModal(true)
        },
        { 
          label: 'Payment Methods', 
          icon: CreditCard, 
          color: 'white',
          action: () => Alert.alert('Coming Soon', 'Payment methods management will be available soon!')
        },
      ]
    },
    {
      title: 'Audio & Playback',
      items: [
        { 
          label: 'Audio Quality', 
          icon: Volume2, 
          color: 'white',
          action: () => setShowAudioSettings(true)
        },
        { 
          label: 'Download Settings', 
          icon: Download, 
          color: 'white',
          toggle: true,
          value: autoDownload,
          onToggle: setAutoDownload
        },
        { 
          label: 'Offline Mode', 
          icon: Wifi, 
          color: 'white',
          toggle: true,
          value: offlineMode,
          onToggle: setOfflineMode
        },
        { 
          label: 'Sleep Timer', 
          icon: Timer, 
          color: 'white',
          toggle: true,
          value: sleepTimer,
          onToggle: setSleepTimer
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          label: 'Notifications', 
          icon: Bell, 
          color: 'white',
          toggle: true,
          value: notifications,
          onToggle: setNotifications
        },
        { 
          label: 'Dark Mode', 
          icon: Moon, 
          color: 'white',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode
        },
        { 
          label: 'Language', 
          icon: Globe, 
          color: 'white',
          value: 'English',
          action: () => Alert.alert('Coming Soon', 'Language settings will be available soon!')
        },
        { 
          label: 'Privacy & Security', 
          icon: Shield, 
          color: 'white',
          action: () => setShowPrivacySettings(true)
        },
      ]
    },
    {
      title: 'Social & Sharing',
      items: [
        { 
          label: 'Share App', 
          icon: Share2, 
          color: 'white',
          action: () => Alert.alert('Share Vibrasonix', 'Share this amazing app with your friends!')
        },
        { 
          label: 'Invite Friends', 
          icon: Gift, 
          color: 'white',
          action: () => Alert.alert('Coming Soon', 'Friend invitation feature coming soon!')
        },
        { 
          label: 'Rate App', 
          icon: Star, 
          color: 'white',
          action: () => Alert.alert('Thank You!', 'Thank you for using Vibrasonix!')
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          label: 'Help Center', 
          icon: HelpCircle, 
          color: 'white',
          action: () => Alert.alert('Help Center', 'Visit our help center for FAQs and guides.')
        },
        { 
          label: 'Contact Support', 
          icon: MessageCircle, 
          color: 'white',
          action: () => Alert.alert('Contact Support', 'Reach out to our support team for assistance.')
        },
        { 
          label: 'Send Feedback', 
          icon: Mail, 
          color: 'white',
          action: () => Alert.alert('Feedback', 'We value your feedback! Send us your thoughts.')
        },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { 
          label: 'Sign Out', 
          icon: LogOut, 
          color: '#ff6b6b', 
          action: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut }
              ]
            );
          }
        },
      ]
    }
  ];

  const handleMenuPress = (item: any) => {
    if (item.action) {
      item.action();
    }
  };

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.label}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
      disabled={item.toggle}
    >
      <BlurView intensity={15} style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
            <item.icon size={20} color={item.color} strokeWidth={1.5} />
          </View>
          <View style={styles.menuItemTextContainer}>
            <Text style={[styles.menuItemText, { color: item.color }]}>
              {item.label}
            </Text>
            {item.value && !item.toggle && (
              <Text style={styles.menuItemValue}>{item.value}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.menuItemRight}>
          {item.badge && (
            <View style={[styles.badge, { borderColor: item.badgeColor, backgroundColor: `${item.badgeColor}20` }]}>
              <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
            </View>
          )}
          {item.toggle ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(166, 135, 82, 0.3)' }}
              thumbColor={item.value ? '#A68752' : 'rgba(255, 255, 255, 0.8)'}
              ios_backgroundColor="rgba(255, 255, 255, 0.2)"
            />
          ) : (
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} />
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const premiumFeatures = [
    'Unlimited music downloads',
    'Offline listening',
    'Access to all premium tracks',
    'Exclusive healing frequencies',
    'High-quality audio streaming',
    'No ads or interruptions',
    'Priority customer support'
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#16213E']}
        style={styles.background}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <BlurView intensity={30} style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color="white" strokeWidth={1.5} />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Camera size={14} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{email}</Text>
              
              <View style={[styles.premiumBadge, isPremium && styles.activePremiumBadge]}>
                <Crown size={14} color={isPremium ? '#A68752' : 'rgba(255, 255, 255, 0.6)'} strokeWidth={1.5} />
                <Text style={[styles.premiumText, isPremium && styles.activePremiumText]}>
                  {isPremium ? 'Premium Member' : 'Free Member'}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <BlurView intensity={20} style={styles.statCardContent}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={20} color={stat.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Sections */}
        <View style={styles.menuContainer}>
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map(renderSettingItem)}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <X size={24} color="white" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient
                  colors={['#A68752', '#8B6F3F']}
                  style={styles.saveButtonGradient}
                >
                  <Check size={20} color="white" strokeWidth={2} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Audio Settings Modal */}
      <Modal
        visible={showAudioSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAudioSettings(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Audio Settings</Text>
              <TouchableOpacity onPress={() => setShowAudioSettings(false)}>
                <X size={24} color="white" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Audio Quality</Text>
                <View style={styles.qualityOptions}>
                  {['High', 'Medium', 'Low'].map((quality) => (
                    <TouchableOpacity
                      key={quality}
                      style={[
                        styles.qualityOption,
                        quality === 'High' && styles.selectedQualityOption
                      ]}
                    >
                      <Text style={[
                        styles.qualityOptionText,
                        quality === 'High' && styles.selectedQualityOptionText
                      ]}>
                        {quality}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>High Quality Audio</Text>
                  <Switch
                    value={highQuality}
                    onValueChange={setHighQuality}
                    trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(166, 135, 82, 0.3)' }}
                    thumbColor={highQuality ? '#A68752' : 'rgba(255, 255, 255, 0.8)'}
                  />
                </View>
                <Text style={styles.settingDescription}>
                  Use higher bitrate for better audio quality (uses more data)
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Premium</Text>
              <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
                <X size={24} color="white" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.premiumContainer} showsVerticalScrollIndicator={false}>
              {isPremium ? (
                // Premium Active View
                <View style={styles.premiumActiveContainer}>
                  <View style={styles.premiumActiveHeader}>
                    <View style={styles.crownContainer}>
                      <Crown size={48} color="#A68752" strokeWidth={1.5} />
                      <Sparkles size={24} color="#A68752" style={styles.sparkle1} />
                      <Sparkles size={16} color="#A68752" style={styles.sparkle2} />
                    </View>
                    <Text style={styles.premiumActiveTitle}>Premium Active!</Text>
                    <Text style={styles.premiumActiveSubtitle}>
                      You have unlimited access to all features
                    </Text>
                    {paymentStatus.paymentDate && (
                      <Text style={styles.paymentDate}>
                        Activated on {new Date(paymentStatus.paymentDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.premiumFeaturesList}>
                    <Text style={styles.featuresTitle}>Your Premium Benefits</Text>
                    {premiumFeatures.map((feature, index) => (
                      <View key={index} style={styles.premiumFeatureItem}>
                        <Check size={16} color="#A68752" strokeWidth={2} />
                        <Text style={styles.premiumFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={() => checkPaymentStatus(user?.id || '')}
                    disabled={paymentLoading}
                  >
                    <Text style={styles.refreshButtonText}>
                      {paymentLoading ? 'Checking...' : 'Refresh Status'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Upgrade View
                <View style={styles.upgradeContainer}>
                  <View style={styles.upgradeHeader}>
                    <Crown size={48} color="#A68752" strokeWidth={1.5} />
                    <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                    <Text style={styles.upgradeSubtitle}>
                      One-time payment for lifetime access
                    </Text>
                  </View>

                  <View style={styles.pricingCard}>
                    <Text style={styles.pricingBadge}>BEST VALUE</Text>
                    <Text style={styles.price}>$99</Text>
                    <Text style={styles.pricingSubtext}>One-time payment</Text>
                    <Text style={styles.pricingDescription}>
                      Lifetime access • No recurring fees
                    </Text>
                  </View>

                  <View style={styles.premiumFeaturesList}>
                    <Text style={styles.featuresTitle}>What You Get</Text>
                    {premiumFeatures.map((feature, index) => (
                      <View key={index} style={styles.premiumFeatureItem}>
                        <Check size={16} color="#A68752" strokeWidth={2} />
                        <Text style={styles.premiumFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={[styles.upgradeButton, paymentLoading && styles.disabledButton]}
                    onPress={handleUpgradeToPremium}
                    disabled={paymentLoading}
                  >
                    <LinearGradient
                      colors={['#A68752', '#8B6F3F']}
                      style={styles.upgradeButtonGradient}
                    >
                      <Crown size={20} color="white" strokeWidth={2} />
                      <Text style={styles.upgradeButtonText}>
                        {paymentLoading ? 'Processing...' : 'Upgrade Now'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  profileCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A68752',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A68752',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(26, 26, 46, 1)',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activePremiumBadge: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    borderColor: '#A68752',
  },
  premiumText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  activePremiumText: {
    color: '#A68752',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemValue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '80%',
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
  formContainer: {
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
  saveButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsContainer: {
    gap: 24,
  },
  settingItem: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  settingDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  selectedQualityOption: {
    backgroundColor: 'rgba(166, 135, 82, 0.3)',
    borderColor: '#A68752',
  },
  qualityOptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  selectedQualityOptionText: {
    color: '#A68752',
    fontWeight: '600',
  },
  premiumContainer: {
    maxHeight: 400,
  },
  premiumActiveContainer: {
    alignItems: 'center',
  },
  premiumActiveHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crownContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -8,
  },
  premiumActiveTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A68752',
    marginBottom: 8,
  },
  premiumActiveSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  upgradeContainer: {
    alignItems: 'center',
  },
  upgradeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  pricingCard: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(166, 135, 82, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A68752',
    width: '100%',
  },
  pricingBadge: {
    backgroundColor: '#A68752',
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: '#A68752',
    marginBottom: 4,
  },
  pricingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  premiumFeaturesList: {
    width: '100%',
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumFeatureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  upgradeButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  refreshButton: {
    backgroundColor: 'rgba(166, 135, 82, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A68752',
  },
  refreshButtonText: {
    color: '#A68752',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 160,
  },
});