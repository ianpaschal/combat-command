import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { RankingFactorValues } from '../../common/types';
import { TournamentUserResult } from '../types';
import { getTournamentResultsByRound } from './getTournamentResultsByRound';

const emptyResults: TournamentUserResult = {
  gamesPlayed: 0,
  opponentIds: [],
  rank: -1,
  rankingFactors: {} as RankingFactorValues,
};

export const getTournamentResultsByUserArgs = v.object({
  userId: v.id('users'),
  tournamentId: v.id('tournaments'),
  round: v.optional(v.number()),
});

export const getTournamentResultsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentResultsByUserArgs>,
): Promise<TournamentUserResult> => {
  const tournamentResults = await getTournamentResultsByRound(ctx, args);
  const tournamentRegistration = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_user', (q) => q.eq('tournamentId', args.tournamentId).eq('userId', args.userId))
    .first();
  if (!tournamentRegistration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  return tournamentResults?.users?.find((r) => r.id === args.userId) ?? emptyResults; // FIXME: Remove second ? after migration
};
