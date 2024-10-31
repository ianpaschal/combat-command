CREATE TYPE public.user_data_visibility AS ENUM (
  'hidden',
  'friends',
  'clubs',
  'tournaments',
  'public'
);

CREATE TABLE public.user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  username TEXT UNIQUE,
  avatar_url TEXT,
  given_name TEXT,
  family_name TEXT,
  name_visibility user_data_visibility,
  country_code TEXT
);

-- Set up RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile." ON public.user_profiles FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert their own profile." ON public.user_profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Users can update their own profile." ON public.user_profiles FOR UPDATE USING ((select auth.uid()) = id);

-- SUPABASE VERSIONS
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id);


-- Set up triggers for 
SELECT public.apply_basic_table_setup('public.user_profiles');

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Storage!
INSERT INTO storage.buckets (id, name) VALUES ('avatars', 'avatars');

-- Set up access controls for storage
CREATE POLICY "Avatar images are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." on storage.objects for insert with check (bucket_id = 'avatars');