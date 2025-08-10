-- Timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply triggers
CREATE OR REPLACE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admin can modify categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- RLS policies for products
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Only admin can modify products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- RLS policies for product images
CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Only admin can modify product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- RLS policies for orders
CREATE POLICY "Anyone can create order"
  ON public.orders FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for site settings
CREATE POLICY "Site settings viewable by everyone"
  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admin can modify site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));