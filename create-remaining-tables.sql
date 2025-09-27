-- Create remaining SkinCoach tables
-- Copy and paste this into Supabase SQL Editor

-- Create users table for skin points and SMS tracking
CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_points integer DEFAULT 0,
  last_sms text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create subscriptions table for plan management
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  bases text[],
  boosters text[],
  price float NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Create SMS campaigns table for marketing automation
CREATE TABLE IF NOT EXISTS sms_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  day_number integer NOT NULL,
  message text NOT NULL,
  sent_at timestamp DEFAULT now(),
  status text DEFAULT 'sent'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view own data" ON users
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own SMS campaigns" ON sms_campaigns
  FOR ALL USING (auth.uid() = user_id);