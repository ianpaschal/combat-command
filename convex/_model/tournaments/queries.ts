import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getDeepTournament } from './helpers';

export const getTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const getTournament = async (
  ctx: QueryCtx,
  { id }: Infer<typeof getTournamentArgs>,
) => {
  const result = await ctx.db.get(id);
  if (!result) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  return await getDeepTournament(ctx, result);
};

export const getTournaments = async (
  ctx: QueryCtx,
) => {
  const result = await ctx.db.query('tournaments').collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getDeepTournament(ctx, item),
    ),
  );

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};

export const getTournamentOpenRoundArgs = v.object({
  id: v.id('tournaments'),
});

export const getTournamentOpenRound = async (
  ctx: QueryCtx,
  { id }: Infer<typeof getTournamentOpenRoundArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status !== 'active' || tournament.currentRound === undefined) {
    return null;
  }

  const pairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .filter((q) => q.eq(q.field('round'), tournament.currentRound))
    .collect();

  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();

  const relevantPairingIds = pairings.map((pairing) => pairing._id);
  const relevantMatchResultIds = matchResults.filter((matchResult) => (
    matchResult.tournamentPairingId && relevantPairingIds.includes(matchResult.tournamentPairingId)
  )).map((matchResult) => matchResult._id);

  return {
    round: tournament.currentRound,
    matchResultsProgress: {
      submitted: relevantPairingIds.length * tournament.competitorSize,
      required: relevantMatchResultIds.length,
    },
    // Get timer
  };
};
