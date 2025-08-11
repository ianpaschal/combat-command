import { RankingFactorGroup } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { FowV4StatId, FowV4TournamentExtendedStats } from './types';

/**
 * 
 * @param ids 
 * @returns 
 */
export const createFowV4TournamentExtendedStatMap = <T extends FowV4StatId>(
  ids: T[],
): Record<T, FowV4TournamentExtendedStats> => ids.reduce((acc, id) => ({
  ...acc,
  [id]: {
    ...Object.values(RankingFactorGroup).reduce((key) => ({
      ...acc,
      [key as keyof FowV4TournamentExtendedStats]: {
        points: 0,
        units_destroyed: 0,
        units_lost: 0,
        wins: 0,
      },
    }), {}),
    gamesPlayed: 0,
  },
}), {} as Record<T, FowV4TournamentExtendedStats>);
