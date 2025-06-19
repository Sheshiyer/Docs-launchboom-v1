import { Platform, Linking } from 'react-native';
import { supabase } from './supabase';

export interface PaymentStatus {
  isPremium: boolean;
  paymentId?: string;
  paymentDate?: string;
}

export class DodoPaymentService {
  private static readonly PAYMENT_URL = 'https://checkout.dodopayments.com/buy/pdt_q9LwyIRgqTxvD1p3z7TSs?quantity=1';
  
  /**
   * Opens the Dodo payment link in the browser
   */
  static async initiatePayment(userId: string): Promise<void> {
    try {
      // Add user ID as a custom parameter to track the payment
      const paymentUrl = `${this.PAYMENT_URL}&custom_data=${encodeURIComponent(JSON.stringify({ userId }))}`;
      
      const canOpen = await Linking.canOpenURL(paymentUrl);
      if (canOpen) {
        await Linking.openURL(paymentUrl);
      } else {
        throw new Error('Cannot open payment URL');
      }
    } catch (error) {
      console.error('Error opening payment URL:', error);
      throw new Error('Failed to open payment page');
    }
  }

  /**
   * Check user's payment status from database
   */
  static async getPaymentStatus(userId: string): Promise<PaymentStatus> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_status, subscription_expires_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        isPremium: user.subscription_status === 'premium',
        paymentDate: user.subscription_expires_at
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { isPremium: false };
    }
  }

  /**
   * Update user to premium status (called by webhook)
   */
  static async upgradeToPremium(userId: string, paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: 'premium',
          subscription_expires_at: new Date().toISOString(), // Store payment date
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Log the payment for record keeping
      await this.logPayment(userId, paymentId);
    } catch (error) {
      console.error('Error upgrading user to premium:', error);
      throw error;
    }
  }

  /**
   * Log payment transaction
   */
  private static async logPayment(userId: string, paymentId: string): Promise<void> {
    try {
      // You could create a payments table to track transactions
      // For now, we'll just log to console
      console.log(`Payment logged: User ${userId}, Payment ${paymentId}`);
    } catch (error) {
      console.error('Error logging payment:', error);
    }
  }

  /**
   * Check if user can access premium content
   */
  static async canAccessPremiumContent(userId: string): Promise<boolean> {
    const status = await this.getPaymentStatus(userId);
    return status.isPremium;
  }

  /**
   * Get premium features list
   */
  static getPremiumFeatures(): string[] {
    return [
      'Unlimited music downloads',
      'Offline listening',
      'Access to all premium tracks',
      'Exclusive healing frequencies',
      'High-quality audio streaming',
      'No ads or interruptions',
      'Priority customer support'
    ];
  }
}

// Hook for using payment functionality in React components
export const usePayments = () => {
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>({ isPremium: false });
  const [loading, setLoading] = React.useState(false);

  const checkPaymentStatus = async (userId: string) => {
    try {
      setLoading(true);
      const status = await DodoPaymentService.getPaymentStatus(userId);
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (userId: string) => {
    try {
      setLoading(true);
      await DodoPaymentService.initiatePayment(userId);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentStatus,
    loading,
    checkPaymentStatus,
    initiatePayment,
    isPremium: paymentStatus.isPremium
  };
};

// Import React for the hook
import React from 'react';