CREATE TABLE public.tournament_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  tournament_competitor_id UUID NOT NULL REFERENCES tournament_competitors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Set up RLS
alter table public.tournament_registrations enable row level security;
create policy "Tournament registrations are viewable by everyone." ON public.tournament_registrations FOR SELECT USING (true);

SELECT apply_basic_table_setup('tournament_registrations');