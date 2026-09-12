ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS make TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS variant TEXT,
  ADD COLUMN IF NOT EXISTS manufacturing_year INT CHECK (manufacturing_year BETWEEN 1980 AND 2100),
  ADD COLUMN IF NOT EXISTS registration_year INT CHECK (registration_year BETWEEN 1980 AND 2100),
  ADD COLUMN IF NOT EXISTS owner_count INT CHECK (owner_count BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS seller_type TEXT CHECK (seller_type IN ('dealer', 'private', 'unknown')),
  ADD COLUMN IF NOT EXISTS registration_state TEXT,
  ADD COLUMN IF NOT EXISTS accident_history TEXT,
  ADD COLUMN IF NOT EXISTS service_history TEXT,
  ADD COLUMN IF NOT EXISTS insurance_status TEXT,
  ADD COLUMN IF NOT EXISTS condition_notes TEXT,
  ADD COLUMN IF NOT EXISTS acquisition_price_inr BIGINT CHECK (acquisition_price_inr >= 0),
  ADD COLUMN IF NOT EXISTS acquisition_date DATE,
  ADD COLUMN IF NOT EXISTS listed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS inventory_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (inventory_status IN ('in_stock', 'reserved', 'sold', 'inactive')),
  ADD COLUMN IF NOT EXISTS sold_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sold_price_inr BIGINT CHECK (sold_price_inr >= 0);

CREATE TABLE public.external_market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  source_listing_id TEXT,
  listing_url TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  manufacturing_year INT CHECK (manufacturing_year BETWEEN 1980 AND 2100),
  registration_year INT CHECK (registration_year BETWEEN 1980 AND 2100),
  fuel TEXT NOT NULL,
  transmission TEXT,
  owner_count INT CHECK (owner_count BETWEEN 1 AND 10),
  km INT NOT NULL CHECK (km >= 0),
  asking_price_inr BIGINT NOT NULL CHECK (asking_price_inr > 0),
  location TEXT NOT NULL,
  registration_state TEXT,
  seller_type TEXT CHECK (seller_type IN ('dealer', 'private', 'unknown')),
  listed_at TIMESTAMPTZ,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accident_history TEXT,
  service_history TEXT,
  insurance_status TEXT,
  condition_notes TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source, source_listing_id)
);
GRANT SELECT ON public.external_market_listings TO authenticated;
GRANT ALL ON public.external_market_listings TO service_role;
ALTER TABLE public.external_market_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view external market listings"
  ON public.external_market_listings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.garage_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  question TEXT NOT NULL,
  parsed_vehicle JSONB,
  status TEXT NOT NULL CHECK (status IN ('completed', 'insufficient_data', 'provider_unavailable', 'failed')),
  internal_match_count INT NOT NULL DEFAULT 0 CHECK (internal_match_count >= 0),
  external_match_count INT NOT NULL DEFAULT 0 CHECK (external_match_count >= 0),
  latency_ms INT CHECK (latency_ms >= 0),
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.garage_queries TO authenticated;
GRANT ALL ON public.garage_queries TO service_role;
ALTER TABLE public.garage_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view Garage query logs"
  ON public.garage_queries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER external_market_listings_updated_at
  BEFORE UPDATE ON public.external_market_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX external_market_listings_vehicle_idx
  ON public.external_market_listings (lower(make), lower(model), lower(fuel), km);
CREATE INDEX external_market_listings_location_idx
  ON public.external_market_listings (lower(location), observed_at DESC);
CREATE INDEX garage_queries_created_at_idx
  ON public.garage_queries (created_at DESC);