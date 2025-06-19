import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verify the webhook is from Dodo Payments
    // You should implement proper webhook signature verification here
    // For now, we'll do basic validation
    
    if (!body.event_type || !body.payment_id) {
      return new Response('Invalid webhook payload', { status: 400 });
    }

    // Handle successful payment
    if (body.event_type === 'payment.completed' || body.event_type === 'payment.success') {
      const paymentId = body.payment_id;
      const customData = body.custom_data ? JSON.parse(body.custom_data) : null;
      const userId = customData?.userId;

      if (!userId) {
        console.error('No user ID found in webhook payload');
        return new Response('No user ID provided', { status: 400 });
      }

      // Update user to premium status
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: 'premium',
          subscription_expires_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user to premium:', error);
        return new Response('Database update failed', { status: 500 });
      }

      console.log(`User ${userId} upgraded to premium via payment ${paymentId}`);
      
      return new Response('Webhook processed successfully', { status: 200 });
    }

    // Handle failed payment
    if (body.event_type === 'payment.failed') {
      console.log('Payment failed:', body.payment_id);
      return new Response('Payment failed webhook received', { status: 200 });
    }

    return new Response('Webhook event not handled', { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return new Response('Webhook endpoint - POST only', { status: 405 });
}