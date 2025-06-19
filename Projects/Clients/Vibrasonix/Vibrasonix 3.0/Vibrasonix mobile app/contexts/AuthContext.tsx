import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, DatabaseService } from '@/lib/supabase';
import { DodoPaymentService } from '@/lib/payments';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '@/lib/supabase';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshPaymentStatus: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  isPremium: boolean;
  emailConfirmationRequired: boolean;
  setEmailConfirmationRequired: (required: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email_confirmed_at);
      
      if (event === 'SIGNED_UP') {
        setEmailConfirmationRequired(true);
        setLoading(false);
        showAlert('Check your email', 'Please check your email and click the confirmation link to complete your registration.');
      } else if (event === 'SIGNED_IN') {
        if (session?.user) {
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            setEmailConfirmationRequired(true);
            setLoading(false);
            showAlert('Email confirmation required', 'Please check your email and click the confirmation link to access your account.');
            return;
          }
          
          setEmailConfirmationRequired(false);
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          // Check if email was just confirmed
          if (session.user.email_confirmed_at && emailConfirmationRequired) {
            setEmailConfirmationRequired(false);
            showAlert('Email confirmed!', 'Your email has been confirmed. Welcome to the app!');
          }
          
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setUser(null);
        setEmailConfirmationRequired(false);
        setLoading(false);
      } else if (event === 'PASSWORD_RECOVERY') {
        showAlert('Password reset', 'Please check your email for password reset instructions.');
      }
    });

    return () => subscription.unsubscribe();
  }, [emailConfirmationRequired]);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await DatabaseService.getUser(userId);
      
      if (userProfile === null) {
        // User profile doesn't exist, create one
        if (supabaseUser) {
          try {
            const newUser = await DatabaseService.createUser({
              id: userId,
              email: supabaseUser.email!,
              display_name: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0],
              avatar_url: supabaseUser.user_metadata?.avatar_url,
              subscription_status: 'free'
            });
            setUser(newUser);
          } catch (createError) {
            console.error('Error creating user profile:', createError);
            throw createError;
          }
        }
      } else {
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setEmailConfirmationRequired(true);
          showAlert('Email confirmation required', 'Please check your email and click the confirmation link to access your account.');
        } else if (error.message.includes('Invalid login credentials')) {
          showAlert('Sign in failed', 'Invalid email or password. Please check your credentials and try again.');
        } else {
          showAlert('Sign in failed', error.message);
        }
        throw error;
      }

      // Check if email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        setEmailConfirmationRequired(true);
        showAlert('Email confirmation required', 'Please check your email and click the confirmation link to access your account.');
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          showAlert('Account exists', 'An account with this email already exists. Please sign in instead.');
        } else {
          showAlert('Sign up failed', error.message);
        }
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setEmailConfirmationRequired(true);
        showAlert('Check your email', 'Please check your email and click the confirmation link to complete your registration.');
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      showAlert('Sign out failed', 'There was an error signing out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        showAlert('Password reset failed', error.message);
        throw error;
      }
      
      showAlert('Password reset sent', 'Please check your email for password reset instructions.');
    } catch (error: any) {
      throw error;
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        showAlert('Resend failed', error.message);
        throw error;
      }
      
      showAlert('Confirmation email sent', 'Please check your email for the confirmation link.');
    } catch (error: any) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await DatabaseService.updateUser(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Update failed', 'There was an error updating your profile. Please try again.');
      throw error;
    }
  };

  const refreshPaymentStatus = async () => {
    if (!user) return;
    
    try {
      const paymentStatus = await DodoPaymentService.getPaymentStatus(user.id);
      if (paymentStatus.isPremium && user.subscription_status !== 'premium') {
        // Update local user state if payment status changed
        const updatedUser = { ...user, subscription_status: 'premium' as const };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing payment status:', error);
    }
  };

  const value = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshPaymentStatus,
    resetPassword,
    resendConfirmation,
    isPremium: user?.subscription_status === 'premium',
    emailConfirmationRequired,
    setEmailConfirmationRequired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};