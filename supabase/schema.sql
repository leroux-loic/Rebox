-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('company', 'individual')) not null,
  company_name text,
  carbon_score int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for listings
create table listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) not null,
  title text not null,
  description text,
  price numeric not null,
  quantity int not null,
  dimensions text,
  status text check (status in ('active', 'sold')) default 'active',
  location_lat float not null,
  location_lng float not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for listings
alter table listings enable row level security;

create policy "Listings are viewable by everyone." on listings
  for select using (true);

create policy "Companies can insert their own listings." on listings
  for insert with check (auth.uid() = seller_id);

create policy "Companies can update their own listings." on listings
  for update using (auth.uid() = seller_id);

-- Create a table for orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references profiles(id) not null,
  listing_id uuid references listings(id) not null,
  pickup_code text not null,
  status text check (status in ('reserved', 'picked_up')) default 'reserved',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for orders
alter table orders enable row level security;

create policy "Buyers can view their own orders." on orders
  for select using (auth.uid() = buyer_id);

create policy "Sellers can view orders for their listings." on orders
  for select using (
    exists (
      select 1 from listings
      where listings.id = orders.listing_id
      and listings.seller_id = auth.uid()
    )
  );

create policy "Buyers can insert orders." on orders
  for insert with check (auth.uid() = buyer_id);

-- Storage Bucket Policy (You need to create 'listings' bucket in dashboard)
-- insert into storage.buckets (id, name, public) values ('listings', 'listings', true);

-- Policy to allow authenticated users to upload images
-- create policy "Authenticated users can upload images" on storage.objects
--   for insert with check (bucket_id = 'listings' and auth.role() = 'authenticated');

-- Policy to allow public to view images
-- create policy "Public can view images" on storage.objects
--   for select using (bucket_id = 'listings');
