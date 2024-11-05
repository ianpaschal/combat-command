import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileRow } from '~/types/db';
import { convertNulls, NullConversion } from '~/utils/nullsToUndefined';

const getOwnUserProfile = async (userId: string): Promise<NullConversion<UserProfileRow>> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    throw error;
  }
  return convertNulls(data);
};

export const useGetOwnUserProfile = (userId?: string) => useQuery({
  queryKey: ['user_profile', userId],
  queryFn: userId ? () => getOwnUserProfile(userId) : undefined,
  enabled: !!userId,
});