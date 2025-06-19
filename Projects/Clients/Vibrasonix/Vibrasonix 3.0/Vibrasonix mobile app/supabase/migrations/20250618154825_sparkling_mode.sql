/*
  # Payment tracking and webhook support

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `payment_id` (text, unique - from Dodo Payments)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `payment_date` (timestamp)
      - `webhook_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policy for users to read their own payments
    - Add policy for system to insert payments (for webhooks)

  3. Indexes
    - Add index on payment_id for webhook lookups
    - Add index on user_id for user payment history
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  payment_id text UNIQUE NOT NULL,
  amount numeric(10,2) DEFAULT 99.00,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  payment_date timestamptz DEFAULT now(),
  webhook_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add constraint for valid payment status
ALTER TABLE payments ADD CONSTRAINT payments_status_check 
  CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));