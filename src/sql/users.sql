create type user_data_visibility as enum (
  'hidden',
  'friends',
  'tournaments',
  'public'
);

create table users (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,

  given_name text,
  given_name_visibility user_data_visibility,
  surname text,
  surname_visibility user_data_visibility,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up RLS
alter table users enable row level security;

create policy "Users are viewable by everyone." on users for select using (true);

create policy "Users can insert their own profile." on users for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on users for update using ((select auth.uid()) = id);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table users from authenticated;

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


DROP TRIGGER IF EXISTS users_update_dates ON users;
CREATE TRIGGER users_update_dates BEFORE UPDATE ON users FOR each ROW EXECUTE PROCEDURE update_dates ();

DROP TRIGGER IF EXISTS users_insert_dates ON users;
CREATE TRIGGER users_insert_dates BEFORE INSERT ON users FOR each ROW EXECUTE PROCEDURE insert_dates ();