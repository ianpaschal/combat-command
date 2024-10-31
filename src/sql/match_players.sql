CREATE TABLE public.match_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  match_result_id UUID NOT NULL REFERENCES public.match_results ON DELETE CASCADE,

  added_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  confirmed BOOLEAN DEFAULT false,
  placeholder_name TEXT
);

-- Set up RLS
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match players are viewable by everyone." ON public.match_players FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Match players can only be confirmed by their user." on public.match_players FOR update TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND confirmed IS NOT true);
CREATE POLICY "Match players can only be updated by their user after being confirmed." ON public.match_players FOR UPDATE TO authenticated USING (user_id = auth.uid() AND confirmed IS true);

SELECT apply_basic_table_setup('match_players');