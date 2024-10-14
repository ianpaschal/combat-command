create type user_data_visibility as enum (
  'hidden',
  'friends',
  'tournaments',
  'public'
);

create table user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  
  username text unique,
  
  avatar_url text,

  given_name text,
  given_name_visibility user_data_visibility,
  family_name text,
  family_visibility user_data_visibility,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up RLS
alter table user_profiles enable row level security;

create policy "Users are viewable by everyone." on user_profiles for select using (true);

create policy "Users can insert their own profile." on user_profiles for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on user_profiles for update using ((select auth.uid()) = id);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table user_profiles from authenticated;

-- Set up CLS for name privacy
CREATE VIEW user_profiles_secure AS SELECT
  id,
  username,
  avatar_url,
  created_at,
  updated_at,

  CASE
    WHEN given_name_visibility = 'public' THEN given_name
    
    WHEN given_name_visibility = 'friends' AND EXISTS (
      SELECT 1 FROM friendships WHERE (
        friendships.user_id = auth.uid() and friendships.friend_id = user_profiles.id and friendships.status = 'accepted'
      ) OR (
        friendships.friend_id = auth.uid() and friendships.user_id = user_profiles.id and friendships.status = 'accepted'
      )
    ) THEN given_name
    
    WHEN given_name_visibility = 'tournaments' AND EXISTS (
      SELECT 1 FROM tournament_participants tp1 JOIN tournament_participants tp2 on tp1.tournament_id = tp2.tournament_id WHERE (
        tp1.user_id = auth.uid() and tp2.user_id = user_profiles.id
      )
    ) THEN given_name
    
    ELSE NULL -- If visibility is 'hidden' or the user otherwise doesn't meet the condition
  
  END AS given_name,

  CASE
    
    WHEN family_name_visibility = 'public' THEN family_name
    
    WHEN family_name_visibility = 'friends' AND EXISTS (
      SELECT 1 FROM friendships WHERE (
        friendships.user_id = auth.uid() and friendships.friend_id = user_profiles.id and friendships.status = 'accepted'
      ) or (
        friendships.friend_id = auth.uid() and friendships.user_id = user_profiles.id and friendships.status = 'accepted'
      )
    ) then family_name
    
    WHEN family_name_visibility = 'tournaments' AND
         exists (
           select 1 from tournament_participants tp1
           join tournament_participants tp2 on tp1.tournament_id = tp2.tournament_id
           where tp1.user_id = auth.uid() and tp2.user_id = user_profiles.id
         ) then family_name
    ELSE NULL -- If visibility is 'hidden' or the user otherwise doesn't meet the condition

  end as family_name

from user_profiles;

-- Block direct access (only allow querying user_profiles_secure)
CREATE POLICY block_direct_access ON user_profiles for SELECT USING (false);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, created_at, modified_at)
  values (new.id, created_atnew.raw_user_meta_data->>'username', );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


DROP TRIGGER IF EXISTS user_profiles_update_dates ON user_profiles;
CREATE TRIGGER user_profiles_update_dates BEFORE UPDATE ON user_profiles FOR each ROW EXECUTE PROCEDURE update_dates ();

DROP TRIGGER IF EXISTS user_profiles_insert_dates ON user_profiles;
CREATE TRIGGER user_profiles_insert_dates BEFORE INSERT ON user_profiles FOR each ROW EXECUTE PROCEDURE insert_dates ();