import { useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import { Route } from '@ianpaschal/combat-command-components';

import { CurrentUser } from '~/api';
import { PATHS } from '~/settings';
import { getPathWithQuery } from '~/utils/common/getPathWithQuery';

export const usePrimaryAppRoutes = (
  user: CurrentUser | null,
): Route[] => useMemo(() => [
  ...(user ? [{
    title: 'Dashboard',
    path: PATHS.dashboard,
  }] : []),
  {
    title: 'Tournaments',
    path: getPathWithQuery(PATHS.tournaments, { order: 'desc' }),
    children: [
      ...(user ? [
        {
          title: 'My Tournaments',
          path: getPathWithQuery(PATHS.tournaments, { userId: user._id, order: 'desc' }),
        },
      ] : []),
      {
        title: 'Ongoing',
        path: getPathWithQuery(PATHS.tournaments, { status: ['active'] }),
      },
      {
        title: 'Upcoming',
        path: getPathWithQuery(PATHS.tournaments, { status: ['published'] }),
      },
      {
        title: 'Past',
        path: getPathWithQuery(PATHS.tournaments, { status: ['archived'], order: 'desc' }),
      },
    ],
  },
  {
    title: 'Match Results',
    path: PATHS.matchResults,
    children: user ? [
      {
        title: 'My Matches',
        path: generatePath(PATHS.userProfile, { id: user._id }),
      },
      {
        title: 'All',
        path: PATHS.matchResults,
      },
    ] : undefined,
  },
],[user]);
