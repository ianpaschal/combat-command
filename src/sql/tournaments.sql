CREATE TYPE tournament_status AS enum (
  'draft',
  'published',
  'active',
  'archived'
);

CREATE TYPE pairing_method AS ENUM (
  'random',
  'round_robin',
  'elimination',
  'swiss'
);

CREATE TABLE tournaments (
  id uuid default gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  title TEXT unique,
  description TEXT,
  location TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  banner_url TEXT,
  rules_pack_url TEXT,

  -- Format
  competitor_count INTEGER NOT NULL,
  competitor_groups JSONB NOT NULL,
  competitor_size INTEGER NOT NULL,
  use_national_teams BOOLEAN NOT NULL,
  round_count INTEGER NOT NULL,
  pairing_method TEXT NOT NULL,

  -- Game Config
  game_system_id UUID NOT NULL REFERENCES game_systems(id) ON DELETE CASCADE,
  game_system_config_id UUID NOT NULL REFERENCES game_system_configs(id) ON DELETE CASCADE,
  ranking_factors TEXT[] NOT NULL,

  -- Management
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  current_round INTEGER,  -- Optional field
  status tournament_status NOT NULL,  -- Enum for tournament status
  registrations_open BOOLEAN NOT NULL,
  registrations_close_at TIMESTAMPTZ NOT NULL,
  require_real_names BOOLEAN NOT NULL,
);

-- Set up RLS
alter table tournaments enable row level security;
create policy "Public tournaments are viewable by everyone." on tournaments for select to authenticated, anon using (visibility = 'public');
create policy "Hidden tournaments are viewable by their organizer." on tournaments for select to authenticated using ((select auth.uid()) = organizer_id AND visibility = 'hidden');
create policy "Tournaments can be created by authenticated users." on tournaments for insert to authenticated using ((select auth.uid()) = organizer_id);
create policy "Tournaments can be updated by their organizer." on tournaments for select to authenticated using ((select auth.uid()) = organizer_id);
create policy "Tournaments can be deleted by their organizer." on tournaments for delete to authenticated using ((select auth.uid()) = organizer_id);

SELECT apply_basic_table_setup('tournaments');
