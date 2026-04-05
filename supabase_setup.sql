-- Coffee Shops table
CREATE TABLE IF NOT EXISTS coffee_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  website TEXT,
  phone TEXT,
  hours TEXT,
  description TEXT,
  tags TEXT,
  features TEXT,
  wifi_yes_no BOOLEAN DEFAULT false,
  outlets_yes_no BOOLEAN DEFAULT false,
  seating_type TEXT,
  best_for TEXT,
  noise_level TEXT,
  aesthetic_score NUMERIC(3,1),
  coffee_quality NUMERIC(3,1),
  food_availability TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claim Requests table
CREATE TABLE IF NOT EXISTS claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coffee_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for coffee_shops (public read, insert for submissions)
CREATE POLICY "Public can read active shops"
  ON coffee_shops FOR SELECT
  USING (status = 'active');

CREATE POLICY "Anyone can submit a shop"
  ON coffee_shops FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update a shop"
  ON coffee_shops FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policies for claim_requests
CREATE POLICY "Anyone can submit a claim"
  ON claim_requests FOR INSERT
  WITH CHECK (true);

-- Policies for contact_messages
CREATE POLICY "Anyone can send a message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_coffee_shops_city ON coffee_shops (city);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_state ON coffee_shops (state);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_slug ON coffee_shops (slug);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_featured ON coffee_shops (featured);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_wifi ON coffee_shops (wifi_yes_no);
