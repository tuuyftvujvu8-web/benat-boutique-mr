-- 1) Roles and admin bootstrap
create type if not exists public.app_role as enum ('admin','user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.handle_new_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- everyone gets 'user'
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  -- grant admin to the specific email
  if lower(new.email) = 'sidiyacheikh2023@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_roles on auth.users;
create trigger on_auth_user_created_roles
  after insert on auth.users
  for each row execute procedure public.handle_new_user_roles();

-- RLS for user_roles
create policy if not exists "Users see own roles or admin all"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- 2) Catalog: categories, products, images
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  slug text unique,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.categories enable row level security;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  price_mru integer not null check (price_mru >= 0),
  short_description text,
  description text,
  rating numeric(3,2) default 0,
  rating_count int default 0,
  video_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.products enable row level security;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.product_images enable row level security;

-- timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger update_categories_updated_at
before update on public.categories
for each row execute function public.update_updated_at_column();

create or replace trigger update_products_updated_at
before update on public.products
for each row execute function public.update_updated_at_column();

-- RLS policies for catalog
create policy if not exists "Categories are viewable by everyone"
  on public.categories for select using (true);
create policy if not exists "Only admin can modify categories"
  on public.categories for all
  to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create policy if not exists "Products are viewable by everyone"
  on public.products for select using (true);
create policy if not exists "Only admin can modify products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create policy if not exists "Product images are viewable by everyone"
  on public.product_images for select using (true);
create policy if not exists "Only admin can modify product images"
  on public.product_images for all
  to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- 3) Orders (guest + user)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_email text,
  guest_phone text,
  items jsonb not null,
  total_mru integer not null,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.orders enable row level security;

-- Anyone can create an order (guest checkout)
create policy if not exists "Anyone can create order"
  on public.orders for insert
  to public
  with check (true);

-- Authenticated users can view their own orders
create policy if not exists "Users can view their own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

-- 4) Site settings
create table if not exists public.site_settings (
  id int primary key default 1,
  whatsapp text,
  email text,
  map_url text,
  logo_text_ar text default 'بنات',
  logo_text_en text default 'BENAT',
  hero_video_url text,
  updated_at timestamptz default now()
);
alter table public.site_settings enable row level security;

create or replace trigger update_site_settings_updated_at
before update on public.site_settings
for each row execute function public.update_updated_at_column();

create policy if not exists "Site settings viewable by everyone"
  on public.site_settings for select using (true);
create policy if not exists "Only admin can modify site settings"
  on public.site_settings for all
  to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Seed default site settings if missing
insert into public.site_settings (id, whatsapp, email, map_url, hero_video_url)
values (
  1,
  '+222 49055137',
  'moubarakouhoussein@gmail.com',
  'https://maps.app.goo.gl/vE3k4Ts1shPzQmNd7',
  'https://youtu.be/_AufUbQhYb4'
)
on conflict (id) do nothing;

-- 5) Storage buckets and policies
insert into storage.buckets (id, name, public) values
  ('product-images','product-images', true),
  ('product-videos','product-videos', true),
  ('site-assets','site-assets', true)
on conflict (id) do nothing;

-- Public read
create policy if not exists "Public can read product media"
  on storage.objects for select
  to public
  using (bucket_id in ('product-images','product-videos','site-assets'));

-- Admin only modify
create policy if not exists "Admin can modify product media"
  on storage.objects for all
  to authenticated
  using (bucket_id in ('product-images','product-videos','site-assets') and public.has_role(auth.uid(),'admin'))
  with check (bucket_id in ('product-images','product-videos','site-assets') and public.has_role(auth.uid(),'admin'));
