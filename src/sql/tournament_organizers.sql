CREATE TABLE tournament_organizers (
  id uuid default gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,

  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (tournament_title, organizer_id)
);

-- Set up RLS
alter table tournament_organizers enable row level security;
create policy "Tournament organizers are viewable by everyone." ON tournaments_organizers FOR SELECT USING (true);

SELECT apply_basic_table_setup('tournament_organizers');