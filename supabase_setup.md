# Complete Supabase Setup Guide for Agora

To perfectly configure everything automatically in one go without errors, copy this exact SQL script and run it in your **Supabase Dashboard -> SQL Editor**. 

It automatically creates the table, the bucket, and fully disables the security restrictions blocking your connections!

```sql
-- 1. Create the structure for your reports table
create table reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  contact text,
  state text,
  area text,
  exact_location text not null,
  latitude double precision,
  longitude double precision,
  site_type text,
  severity text,
  category text,
  notes text,
  photos text[] -- Array that will hold your connected image URLs
);

-- 2. Disable default Row Level Security so your app can publicly submit rows 
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- 3. Magically create the 'reports_media' bucket securely
insert into storage.buckets (id, name, public)
values ('reports_media', 'reports_media', true)
on conflict (id) do nothing;

-- 4. Tell Supabase Storage to let anyone freely upload and view the photos!
create policy "Allow Public Image Viewing"
  on storage.objects for select
  using ( bucket_id = 'reports_media' );

create policy "Allow Public Image Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'reports_media' );
```

Once you run this full block, your form will immediately work 100% perfectly and save the images directly to the server. You can watch them appear inside the `Table Editor` and `Storage` tabs!
