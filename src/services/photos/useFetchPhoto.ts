import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, PhotoId } from '~/api';

export const useFetchPhoto = (id?: PhotoId) => {
  const data = useQuery(api.photos.queries.fetchPhoto, id ? { id } : 'skip');
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
