-- ============================================
-- SETUP SUPABASE TABLES POUR AGRIPRICE
-- ============================================
-- Exécutez ce SQL dans Supabase : SQL Editor → New query

-- 1. TABLE PRODUCTS (Produits agricoles)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Insérer les produits de base
INSERT INTO products (name_fr, category) VALUES
  ('Cacao', 'Cacao'),
  ('Banane', 'Fruits'),
  ('Café', 'Café'),
  ('Tomate', 'Légumes'),
  ('Oignon', 'Légumes'),
  ('Huile de palme', 'Huiles'),
  ('Gingembre', 'Condiments'),
  ('Noix de cajou', 'Noix'),
  ('Mangue', 'Fruits'),
  ('Poivre', 'Condiments'),
  ('Arachide', 'Noix'),
  ('Papaye', 'Fruits'),
  ('Riz', 'Céréales'),
  ('Maïs', 'Céréales'),
  ('Sucre', 'Condiments'),
  ('Miel', 'Condiments'),
  ('Ananas', 'Fruits'),
  ('Avocat', 'Fruits'),
  ('Épinards', 'Légumes'),
  ('Carottes', 'Légumes'),
  ('Chou', 'Légumes'),
  ('Concombre', 'Légumes'),
  ('Aubergine', 'Légumes'),
  ('Poivron', 'Légumes'),
  ('Courge', 'Légumes')
ON CONFLICT DO NOTHING;

-- 2. TABLE SOURCES (Fournisseurs/Marchés)
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  country TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Insérer les sources de base
INSERT INTO sources (name, region, country) VALUES
  ('Marché de Yaoundé', 'CAMEROON', 'Cameroun'),
  ('Douala Port Terminal', 'CAMEROON', 'Cameroun'),
  ('Shanghai Commodity Exchange', 'ASIA', 'China'),
  ('Dalian Futures', 'ASIA', 'China'),
  ('Rotterdam Agri Exchange', 'EUROPE', 'Netherlands'),
  ('Paris MATIF', 'EUROPE', 'France'),
  ('Chicago CBOT', 'NORTH AMERICA', 'USA'),
  ('Toronto Agri Exchange', 'NORTH AMERICA', 'Canada'),
  ('Bangkok Agricultural Market', 'ASIA', 'Thailand'),
  ('Singapore Commodity Hub', 'ASIA', 'Singapore'),
  ('Berlin Agro Exchange', 'EUROPE', 'Germany'),
  ('London ICE Futures', 'EUROPE', 'UK'),
  ('New York Mercantile Exchange', 'NORTH AMERICA', 'USA'),
  ('Mumbai Agricultural Market', 'ASIA', 'India'),
  ('Istanbul Commodity Exchange', 'EUROPE', 'Turkey'),
  ('Nairobi Commodity Exchange', 'AFRICA', 'Kenya'),
  ('Abidjan Port Market', 'AFRICA', 'Ivory Coast'),
  ('Accra Agricultural Market', 'AFRICA', 'Ghana'),
  ('Dakar Regional Market', 'AFRICA', 'Senegal'),
  ('Lagos Trade Center', 'AFRICA', 'Nigeria'),
  ('São Paulo Agri Market', 'SOUTH AMERICA', 'Brazil'),
  ('Buenos Aires Commodity Exchange', 'SOUTH AMERICA', 'Argentina')
ON CONFLICT DO NOTHING;

-- 3. TABLE PRICE_RECORDS (Historique des prix)
CREATE TABLE IF NOT EXISTS price_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  price_fcfa NUMERIC(12,2) NOT NULL,
  price_cny NUMERIC(12,2),
  price_usd NUMERIC(12,2),
  product_form TEXT,
  quality_grade TEXT,
  recorded_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT positive_prices CHECK (
    price_fcfa > 0 AND 
    (price_cny IS NULL OR price_cny > 0) AND 
    (price_usd IS NULL OR price_usd > 0)
  )
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_price_records_product_id ON price_records(product_id);
CREATE INDEX IF NOT EXISTS idx_price_records_source_id ON price_records(source_id);
CREATE INDEX IF NOT EXISTS idx_price_records_recorded_at ON price_records(recorded_at DESC);

-- 4. TABLE ALERTS (Alertes prix)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  target_price NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_count INT DEFAULT 0,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product_id ON alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);

-- 5. ENABLE REALTIME (pour subscriptions React)
ALTER TABLE alerts REPLICA IDENTITY FULL;

-- ============================================
-- INSERTS DE TEST (données d'exemple)
-- ============================================

-- Récupérer les IDs
WITH products_data AS (
  SELECT id, name_fr FROM products LIMIT 5
),
sources_data AS (
  SELECT id, name FROM sources LIMIT 5
)
INSERT INTO price_records (product_id, source_id, price_fcfa, price_cny, price_usd, product_form, quality_grade)
SELECT 
  p.id,
  s.id,
  (RANDOM() * 500000 + 50000)::NUMERIC(12,2) as price_fcfa,
  (RANDOM() * 5000 + 500)::NUMERIC(12,2) as price_cny,
  (RANDOM() * 800 + 80)::NUMERIC(12,2) as price_usd,
  'Bulk',
  'Grade A'
FROM products_data p, sources_data s
LIMIT 25;

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Exécutez ces queries pour vérifier :

-- SELECT COUNT(*) FROM products;          -- Doit afficher 25
-- SELECT COUNT(*) FROM sources;           -- Doit afficher 22
-- SELECT COUNT(*) FROM price_records;     -- Doit afficher 25+
-- SELECT * FROM price_records LIMIT 5;    -- Voir les données de test
