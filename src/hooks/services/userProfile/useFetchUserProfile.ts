import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileRecord } from '~/types/UserProfile';

const fetchUserProfile = async (userId: string): Promise<UserProfileRecord> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
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