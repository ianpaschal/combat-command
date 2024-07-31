create table match_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,

  game_system_id uuid not null references public.game_systems,

  player_0_id uuid references public.users,
  player_0_list_id uuid references public.lists,
  player_0_notes text,
  player_1_id uuid references public.users,
  player_1_list_id uuid references public.lists,
  player_1_notes text,

  tournament_pairing_id uuid references public.tournament_pairings,
  detailed_config json not null,
  detailed_outcome json not null
);

-- Set up RLS
alter table match_results enable row level security;
create policy "Game systems are viewable by everyone." on match_results for select to authenticated, anon using (true);

-- Set up CLS for read-only columns
revoke update (created_at, updated_at) on table match_results from authenticated, anon;

-- Set up auto-updating "updated_at" timestamps
drop trigger if exists match_results_update_dates on match_results;
create trigger match_results_update_dates before update on match_results for each row execute procedure update_dates ();

-- Set up auto-updating "created_at" timestamps
drop trigger if exists match_results_insert_dates on match_results;
create trigger match_results_insert_dates before insert on match_results for each row execute procedure insert_dates ();