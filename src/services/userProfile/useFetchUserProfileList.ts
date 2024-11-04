import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';

interface fetchUserProfilesFilters {
  profileIds?: string[];
}

const fetchUserProfileList = async (args: fetchUserProfilesFilters): Promise<UserProfileSecureRow[]> => {
  let query = supabase
    .from('user_profiles_secure')
    .select();

  if (args.profileIds && args.profileIds.length) {
    query = query.filter('id', 'in', `("${args.profileIds.join('","')}")`);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchUserProfileList = (args?: fetchUserProfilesFilters) => useQuery({
  queryKey: ['user_profile_list', args],
  queryFn: () => fetchUserProfileList(args || {}),
});