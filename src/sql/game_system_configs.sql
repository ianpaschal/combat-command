CREATE TABLE game_system_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  data JSONB NOT NULL,
);

-- Set up RLS
ALTER TABLE game_system_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Game system configs are viewable by everyone." ON game_system_configs FOR SELECT TO authenticated, anon USING (true);

SELECT apply_basic_table_setup('game_system_configs');