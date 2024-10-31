DROP VIEW IF EXISTS public.user_profiles_secure;
CREATE VIEW public.user_profiles_secure WITH (SECURITY_INVOKER=ON) AS SELECT
  id,
  username,
  avatar_url,
  created_at,
  updated_at,
  country_code,

  CASE
    WHEN name_visibility = 'public' THEN given_name
    
    WHEN name_visibility = 'friends' AND EXISTS (
      SELECT 1 FROM public.friendships WHERE (
        public.friendships.user_0_id = auth.uid() and public.friendships.user_1_id = public.user_profiles.id and public.friendships.confirmed = true
      ) OR (
        public.friendships.user_1_id = auth.uid() and public.friendships.user_0_id = public.user_profiles.id and public.friendships.confirmed = true
      )
    ) THEN given_name
        
    WHEN name_visibility = 'tournaments' AND EXISTS (
      SELECT 1 FROM tournament_registrations t_reg_1
      JOIN tournament_competitors t_cmp_1 ON t_reg_1.tournament_competitor_id = t_cmp_1.id
      JOIN tournament_competitors t_cmp_2 ON t_cmp_1.tournament_id = t_cmp_2.tournament_id
      JOIN tournament_registrations t_reg_2 ON t_reg_2.tournament_competitor_id = t_cmp_2.id
      WHERE  t_reg_1.user_id = auth.uid() AND t_reg_2.user_id = user_profiles.id
    ) THEN given_name
        
    ELSE NULL -- If visibility is 'hidden' or the user otherwise doesn't meet the condition
  
  END AS given_name,

  CASE
    
    WHEN name_visibility = 'public' THEN family_name
    
    WHEN name_visibility = 'friends' AND EXISTS (
      SELECT 1 FROM public.friendships WHERE (
        public.friendships.user_0_id = auth.uid() and public.friendships.user_1_id = public.user_profiles.id and public.friendships.confirmed = true
      ) OR (
        public.friendships.user_1_id = auth.uid() and public.friendships.user_0_id = public.user_profiles.id and public.friendships.confirmed = true
      )
    ) THEN family_name
    
    WHEN name_visibility = 'tournaments' AND EXISTS (
      SELECT 1 FROM tournament_registrations t_reg_1
      JOIN tournament_competitors t_cmp_1 ON t_reg_1.tournament_competitor_id = t_cmp_1.id
      JOIN tournament_competitors t_cmp_2 ON t_cmp_1.tournament_id = t_cmp_2.tournament_id
      JOIN tournament_registrations t_reg_2 ON t_reg_2.tournament_competitor_id = t_cmp_2.id
      WHERE  t_reg_1.user_id = auth.uid() AND t_reg_2.user_id = user_profiles.id
    ) THEN given_name
        
    ELSE NULL -- If visibility is 'hidden' or the user otherwise doesn't meet the condition

  end as family_name

from public.user_profiles;

-- Block direct access (only allow querying user_profiles_secure)
CREATE POLICY block_direct_access ON public.user_profiles FOR SELECT USING (false);

-- Set up RLS
ALTER TABLE user_profiles_secure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User profiles (secured) are viewable by everyone." ON user_profiles_secure FOR SELECT TO authenticated, anon USING (true);