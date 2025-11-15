import { useMemo } from 'react';

import { CurrentUser } from '~/api';

export const usePageTitle = (
  user: CurrentUser | null,
  filters: {
    status: string[] | null;
    userId: string | null;
  },
) => useMemo(() => {
  if (filters.userId && filters.userId === user?._id) {
    return 'My Tournaments';
  }
  if (filters.status && filters.status.length === 1) {
    if (filters.status[0] === 'draft') {
      return 'Draft Tournaments';
    }
    if (filters.status[0] === 'published') {
      return 'Upcoming Tournaments';
    }
    if (filters.status[0] === 'active') {
      return 'Ongoing Tournaments';
    }
    if (filters.status[0] === 'archived') {
      return 'Past Tournaments';
    }
  }
  return 'Tournaments';
}, [user, filters]);
