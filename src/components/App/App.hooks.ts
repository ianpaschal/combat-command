import { useMemo } from 'react';
import { Route } from '@ianpaschal/combat-command-components';
import qs from 'qs';

import { CurrentUser, TournamentFilterParams } from '~/api';
import { PATHS } from '~/settings';

const getQueryString = (basePath: string, params: TournamentFilterParams): string => {
  const queryString = qs.stringify(params, {
    arrayFormat: 'comma',
  });
  return `${basePath}?${queryString}`;
};

export const usePrimaryAppRoutes = (
  user: CurrentUser | null,
): Route[] => useMemo(() => [
  ...(user ? [{
    title: 'Dashboard',
    path: PATHS.dashboard,
  }] : []),
  {
    title: 'Tournaments',
    path: getQueryString(PATHS.tournaments, { order: 'desc' }),
    children: [
      ...(user ? [
        {
          title: 'My Tournaments',
          path: getQueryString(PATHS.tournaments, { userId: user._id, order: 'desc' }),
        },
      ] : []),
      {
        title: 'Ongoing',
        path: getQueryString(PATHS.tournaments, { status: ['active'] }),
      },
      {
        title: 'Upcoming',
        path: getQueryString(PATHS.tournaments, { status: ['published'] }),
      },
      {
        title: 'Past',
        path: getQueryString(PATHS.tournaments, { status: ['archived'], order: 'desc' }),
      },
    ],
  },
  {
    title: 'Match Results',
    path: PATHS.matchResults,
    children: user ? [
      {
        title: 'My Matches',
        path: getQueryString(PATHS.matchResults, { userId: user._id, order: 'desc' }),
      },
      {
        title: 'All',
        path: PATHS.matchResults,
      },
    ] : undefined,
  },
],[user]);
