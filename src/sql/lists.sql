create table lists (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,

  game_system_id uuid not null references public.game_systems,
  point_version_id uuid not null references public.point_versions,
  name text unique,
  description text,
  data json
);

-- Set up RLS
alter table game_systems enable row level security;
create policy "Game systems are viewable by everyone." on game_systems for select to authenticated, anon using (true);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table tournaments from authenticated, anon;

-- Set up auto-updating "updated_at" timestamps
drop trigger if exists game_systems_update_dates on game_systems;
create trigger game_systems_update_dates before update on game_systems for each row execute procedure update_dates ();

-- Set up auto-updating "created_at" timestamps
drop trigger if exists game_systems_insert_dates on game_systems;
create trigger game_systems_insert_dates before insert on game_systems for each row execute procedure insert_dates ();