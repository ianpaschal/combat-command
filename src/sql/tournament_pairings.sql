CREATE TABLE public.tournament_pairings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  tournament_id UUID NOT NULL REFERENCES tournament_pairings(id) ON DELETE CASCADE,
  competitor_0_id UUID NOT NULL REFERENCES tournament_competitors(id) ON DELETE CASCADE,
  competitor_1_id UUID NOT NULL REFERENCES tournament_competitors(id) ON DELETE CASCADE,

  round NUMBER NOT NULL DEFAULT 0,
  table NUMBER NOT NULL DEFAULT 0
);

-- Set up RLS
ALTER TABLE public.tournament_pairings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tournament pairings are viewable by everyone." ON public.tournament_pairings FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Tournament pairings can be updated by the tournament creator." ON public.tournament_pairings FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.tournaments WHERE tournaments.id = tournament_pairings.tournament_id AND tournaments.creator_id = auth.uid()
  )
);
CREATE POLICY "Tournament pairings can be deleted by the tournament creator." ON public.tournament_pairings FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.tournaments WHERE tournaments.id = tournament_pairings.tournament_id AND tournaments.creator_id = auth.uid()
  )
);

SELECT apply_basic_table_setup('tournament_pairings');
