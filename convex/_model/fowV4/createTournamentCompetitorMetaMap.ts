import { Id } from '../../_generated/dataModel';
import { TournamentCompetitorMeta } from './types';

// TODO: Move this out of the fowV4 folder

/**
 * 
 * @param ids 
 * @returns 
 */
export const createTournamentCompetitorMetaMap = (
  ids: Id<'tournamentCompetitors'>[],
): Record<Id<'tournamentCompetitors'>, TournamentCompetitorMeta> => ids.reduce((acc, id) => ({
  ...acc,
  [id]: {
    opponentIds: [],
    tablesPlayed: [],
    byeRounds: [],
  },
}), {} as Record<Id<'tournamentCompetitors'>, TournamentCompetitorMeta>);
