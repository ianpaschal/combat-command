CREATE TABLE public.match_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  game_system_config UUID NOT NULL REFERENCES public.game_system_configs ON DELETE CASCADE,
  tournament_pairing_id UUID REFERENCES public.tournament_pairings ON DELETE CASCADE,
  outcome JSON NOT NULL
);

-- Set up RLS
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match results are viewable by everyone." ON public.match_results FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Match results can be updated by referenced users." ON public.match_results FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.match_players WHERE match_players.match_result_id = match_results.id AND match_players.user_id = auth.uid()
  )
);
CREATE POLICY "Match results can be deleted by referenced users." ON public.match_results FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.match_players WHERE match_players.match_result_id = match_results.id AND match_players.user_id = auth.uid()
  )
);

SELECT apply_basic_table_setup('match_results');