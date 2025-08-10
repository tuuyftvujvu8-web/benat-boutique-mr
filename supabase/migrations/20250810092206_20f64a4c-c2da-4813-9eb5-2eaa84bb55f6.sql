-- 2) Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  slug TEXT UNIQUE,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3) Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price_mru INTEGER NOT NULL CHECK (price_mru >= 0),
  short_description TEXT,
  description TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4) Product images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 5) Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_phone TEXT,
  items JSONB NOT NULL,
  total_mru INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6) Site settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  whatsapp TEXT,
  email TEXT,
  map_url TEXT,
  logo_text_ar TEXT DEFAULT 'بنات',
  logo_text_en TEXT DEFAULT 'BENAT',
  hero_video_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;