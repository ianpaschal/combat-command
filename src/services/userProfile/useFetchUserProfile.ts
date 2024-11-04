import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';

const fetchUserProfile = async (userId: string): Promise<UserProfileSecureRow> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchUserProfile = (userId?: string) => useQuery({
  queryKey: ['user_profile', userId],
  queryFn: userId ? () => fetchUserProfile(userId) : undefined,
  enabled: !!userId,
});