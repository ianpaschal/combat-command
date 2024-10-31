CREATE TABLE game_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  display_name TEXT UNIQUE NOT NULL
);

-- Set up RLS
ALTER TABLE game_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Game systems are viewable by everyone." ON game_systems FOR SELECT TO authenticated, anon USING (true);

SELECT apply_basic_table_setup('game_systems');