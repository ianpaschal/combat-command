import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';

const fetchUserProfileListByTournamentPairingId = async (): Promise<UserProfileSecureRow[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchUserProfileListByTournamentPairingId = () => useQuery({
  queryKey: ['user_profile_list'],
  queryFn: fetchUserProfileListByTournamentPairingId,
});