create table point_versions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,

  name text unique,
  game_system_id uuid not null references public.game_systems
);

-- Set up RLS
alter table point_versions enable row level security;
create policy "Point versions are viewable by everyone." on point_versions for select to authenticated, anon using (true);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table point_versions from authenticated, anon;

-- Set up auto-updating "updated_at" timestamps
drop trigger if exists point_versions_update_dates on point_versions;
create trigger point_versions_update_dates before update on point_versions for each row execute procedure update_dates ();

-- Set up auto-updating "created_at" timestamps
drop trigger if exists point_versions_insert_dates on point_versions;
create trigger point_versions_insert_dates before insert on point_versions for each row execute procedure insert_dates ();