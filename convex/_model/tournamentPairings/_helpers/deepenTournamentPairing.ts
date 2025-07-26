import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { deepenTournamentCompetitor } from '../../tournamentCompetitors';
import { getTournamentShallow } from '../../tournaments';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a TournamentPairing by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep TournamentPairing.
 * 
 * @param ctx - Convex query context
 * @param tournamentPairing - Raw TournamentPairing document
 * @returns A deep TournamentPairing
 */
export const deepenTournamentPairing = async (
  ctx: QueryCtx,
  tournamentPairing: Doc<'tournamentPairings'>,
) => {
  const { competitorSize } = await getTournamentShallow(ctx, tournamentPairing.tournamentId);
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_pairing_id', (q) => q.eq('tournamentPairingId', tournamentPairing._id))
    .collect();
  const submittedUserIds = matchResults.reduce((acc, matchResult) => {
    if (matchResult.player0UserId) {
      acc.push(matchResult.player0UserId);
    }
    if (matchResult.player1UserId) {
      acc.push(matchResult.player1UserId);
    }
    return acc;
  }, [] as Id<'users'>[]);

  const rawTournamentCompetitor0 = await ctx.db.get(tournamentPairing.tournamentCompetitor0Id);
  if (!rawTournamentCompetitor0) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournamentCompetitor0 = await deepenTournamentCompetitor(ctx, rawTournamentCompetitor0 );

  let tournamentCompetitor1 = null;
  if (tournamentPairing.tournamentCompetitor1Id) {
    const rawTournamentCompetitor1 = await ctx.db.get(tournamentPairing.tournamentCompetitor1Id);
    if (!rawTournamentCompetitor1) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
    }
    tournamentCompetitor1 = await deepenTournamentCompetitor(ctx, rawTournamentCompetitor1 );
  }

  return {
    ...tournamentPairing,
    tournamentCompetitor0,
    tournamentCompetitor1,
    playerUserIds: [
      ...tournamentCompetitor0.players.map((player) => player.user._id),
      ...(tournamentCompetitor1?.players ?? []).map((player) => player.user._id),
    ],
    submittedUserIds,
    matchResultsProgress: {
      submitted: matchResults.length,
      required: competitorSize,
      remaining: competitorSize - matchResults.length,
    },
  };
};

/**
 * Deep TournamentPairing with additional joined data and computed fields.
 */
export type TournamentPairingDeep = Awaited<ReturnType<typeof deepenTournamentPairing>>;
