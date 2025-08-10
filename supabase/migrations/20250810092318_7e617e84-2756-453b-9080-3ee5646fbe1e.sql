-- Fix search_path for trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-images','product-images', true),
  ('product-videos','product-videos', true),
  ('site-assets','site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can read product media"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images','product-videos','site-assets'));

CREATE POLICY "Admin can modify product media"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id IN ('product-images','product-videos','site-assets') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('product-images','product-videos','site-assets') AND public.has_role(auth.uid(),'admin'));

-- Seed site settings
INSERT INTO public.site_settings (id, whatsapp, email, map_url, hero_video_url)
VALUES (
  1,
  '+222 49055137',
  'moubarakouhoussein@gmail.com',
  'https://maps.app.goo.gl/vE3k4Ts1shPzQmNd7',
  'https://youtu.be/_AufUbQhYb4'
)
ON CONFLICT (id) DO NOTHING;

-- Seed categories with current data
INSERT INTO public.categories (name, image_url, slug, position) VALUES
  ('ملحف', 'https://i.postimg.cc/DzDqjCwx/alalalia-white-100-002-039-alt3-sq-gy-2000x2000.jpg', 'mulhaf', 1),
  ('حقائب', 'https://i.postimg.cc/Hk605WDD/attar-bottle-manufacturer-300x300.jpg', 'bags', 2),
  ('فساتين', 'https://i.postimg.cc/CxhHzB2s/FB-IMG-1674512139138-1-1.jpg', 'dresses', 3),
  ('عطور', 'https://i.postimg.cc/mrhYSxBc/IMG-20250612-WA0019.jpg', 'perfumes', 4)
ON CONFLICT (slug) DO NOTHING;