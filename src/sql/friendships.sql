CREATE TABLE public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,

  -- Data
  user_0_id UUID REFERENCES public.users,
  user_1_id UUID REFERENCES public.users,
  confirmed BOOLEAN,
);

-- Set up RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Policy for creating a friendship
CREATE POLICY create_friendship_policy ON public.friendships FOR INSERT WITH CHECK (auth.uid() = user_0_id);

-- Policy for deleting a friendship
CREATE POLICY delete_friendship_policy ON public.friendships FOR DELETE USING (auth.uid() = user_0_id OR auth.uid() = user_1_id);

-- Policy for `user_1_id` user to update only `user_1_confirmed`
CREATE POLICY user_1_confirm_policy ON public.friendships FOR UPDATE USING (auth.uid() = user_1_id) WITH CHECK (auth.uid() = user_1_id);

-- Revoke update permissions on user ID columns
REVOKE UPDATE (user_0_id, user_1_id) ON TABLE public.friendships FROM authenticated, anon;

-- Set up triggers for created_at and updated_at
SELECT public.apply_basic_table_setup('public.friendships');