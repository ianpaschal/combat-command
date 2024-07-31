create type tournament_visibility as enum (
  'hidden',
  'public'
);

create type tournament_type as enum (
  'solo',
  'team'
);

create table tournaments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,

  -- Functional data
  game_system_id uuid not null references public.game_systems,
  organizer_id uuid not null references public.users,
  visibility tournament_visibility default 'draft',
  registration_open boolean default false,
  match_results_open boolean default false,
  team_size_limit smallint default 1,
  active_round_index smallint,
  round_count smallint default 3,
  type tournament_type default 'solo',

  -- Display data
  title text unique,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location text not null,

  constraint title_length check (char_length(title) >= 5)
);

-- Set up RLS
alter table tournaments enable row level security;
create policy "Public tournaments are viewable by everyone." on tournaments for select to authenticated, anon using (visibility = 'public');
create policy "Hidden tournaments are viewable by their organizer." on tournaments for select to authenticated using ((select auth.uid()) = organizer_id AND visibility = 'hidden');
create policy "Tournaments can be created by authenticated users." on tournaments for insert to authenticated using ((select auth.uid()) = organizer_id);
create policy "Tournaments can be updated by their organizer." on tournaments for select to authenticated using ((select auth.uid()) = organizer_id);
create policy "Tournaments can be deleted by their organizer." on tournaments for delete to authenticated using ((select auth.uid()) = organizer_id);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table tournaments from authenticated, anon;

-- Set up auto-updating "updated_at" timestamps
drop trigger if exists tournaments_update_dates on tournaments;
create trigger tournaments_update_dates before update on tournaments for each row execute procedure update_dates ();

-- Set up auto-updating "created_at" timestamps
drop trigger if exists tournaments_insert_dates on tournaments;
create trigger tournaments_insert_dates before insert on tournaments for each row execute procedure insert_dates ();