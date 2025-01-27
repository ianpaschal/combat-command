import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';

const fetchAvatar = async (path?: string): Promise<string | null> => {
  if (!path) {
    return null;
  }
  const { data, error } = await supabase.storage.from('avatars').download(path);
  if (error) {
    throw error;
  }
  return URL.createObjectURL(data);
};

export const useFetchAvatar = (path?: string) => useQuery({
  queryKey: ['avatar', path],
  queryFn: () => fetchAvatar(path),
  enabled: !!path,
});