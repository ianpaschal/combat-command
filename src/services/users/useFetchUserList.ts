import { useRef } from 'react';
import { useQuery } from 'convex/react';
import { useDebounce } from 'use-debounce';

import { api } from '~/api';

export const useFetchUserList = (args?: { search?: string }) => {
  const [debouncedArgs] = useDebounce(args, 250);
  const data = useQuery(api.users.fetchUserList.fetchUserList, debouncedArgs ?? 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
