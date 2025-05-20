import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, UserId } from '~/api';

export const useFetchUser = (id?: UserId) => {
  const data = useQuery(api.users.fetchUser.fetchUser, id ? { id } : 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  if (!id) {
    return {
      data: undefined,
      loading: false,
    };
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
