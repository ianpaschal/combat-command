import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { getTournamentNextRound } from './getTournamentNextRound';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a Tournament by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep Tournament.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw Tournament document
 * @returns A deep Tournament
 */
export const deepenFowV4ListData = async (
  ctx: QueryCtx,
  list: Pick<Doc<'lists'>, 'gameSystemConfig' | 'data'>,
) => {

  if (list.gameSystemConfig !== GameSystem) {
    return {
      ...list,
      logoUrl,
      bannerUrl,
      competitorCount,
      activePlayerCount: activePlayerUserIds.length,
      playerCount: playerUserIds.length,
      playerUserIds,
      activePlayerUserIds,
      maxPlayers : tournament.maxCompetitors * tournament.competitorSize,
      useTeams: tournament.competitorSize > 1,
      nextRound: getTournamentNextRound(tournament),
    };
  }
};

/**
 * Deep Tournament with additional joined data and computed fields.
 */
export type DeepFowV4ListData = Awaited<ReturnType<typeof deepenTournament>>;
