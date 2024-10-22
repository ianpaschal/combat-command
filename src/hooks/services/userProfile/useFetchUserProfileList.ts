import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileRecord } from '~/types/UserProfile';

const fetchUserProfileList = async (): Promise<UserProfileRecord[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchUserProfileList = () => useQuery({
  queryKey: ['user_profile_list'],
  queryFn: fetchUserProfileList,
});