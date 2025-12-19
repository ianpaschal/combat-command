import { useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import { Route } from '@ianpaschal/combat-command-components';
import qs from 'qs';

import { TournamentFilterParams } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { PATHS } from '~/settings';

const getQueryString = (basePath: string, params: TournamentFilterParams): string => {
  const queryString = qs.stringify(params, {
    arrayFormat: 'comma',
  });
  return `${basePath}?${queryString}`;
};

export const usePrimaryAppRoutes = (): Route[] => {
  const user = useAuth();
  return useMemo(() => [
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
          path: generatePath(PATHS.userProfile, { id: user._id }),
        },
        {
          title: 'All',
          path: PATHS.matchResults,
        },
      ] : undefined,
    },
    {
      title: 'Leagues',
      path: PATHS.leagues,
    },
  ],[user]);
};
