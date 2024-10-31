CREATE TABLE public.tournament_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  country_code TEXT,
  team_name TEXT
);

-- Set up RLS
alter table public.tournament_competitors enable row level security;
create policy "Tournament competitors are viewable by everyone." ON public.tournament_competitors FOR SELECT USING (true);

SELECT apply_basic_table_setup('tournament_competitors');