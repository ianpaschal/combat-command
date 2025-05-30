import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getDeepTournamentCompetitor } from '../tournamentCompetitors/helpers';

export const getDeepTournamentPairing = async (
  ctx: QueryCtx,
  tournamentPairing: Doc<'tournamentPairings'>,
) => {

  const rawTournamentCompetitor0 = await ctx.db.get(tournamentPairing.tournamentCompetitor0Id);
  if (!rawTournamentCompetitor0) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournamentCompetitor0 = await getDeepTournamentCompetitor(ctx, rawTournamentCompetitor0 );

  let tournamentCompetitor1 = null;
  if (tournamentPairing.tournamentCompetitor1Id) {
    const rawTournamentCompetitor1 = await ctx.db.get(tournamentPairing.tournamentCompetitor1Id);
    if (!rawTournamentCompetitor1) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
    }
    tournamentCompetitor1 = await getDeepTournamentCompetitor(ctx, rawTournamentCompetitor1 );
  }

  return {
    ...tournamentPairing,
    tournamentCompetitor0,
    tournamentCompetitor1,
  };
};

export const getTournamentPairingsByTournamentId = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
) => await ctx.db.query('tournamentPairings')
  .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
  .collect();

/**
 * 
 * @param ctx - The Convex query context
 * @param args - range includes the start and finish so [0, 2] will include 0 1 and 2
 * @returns - Array of raw TournamentPairing records.
 */
export const getFilteredTournamentPairings = async (
  ctx: QueryCtx,
  args: {
    tournamentId?: Id<'tournaments'>,
    tournamentCompetitorId?: Id<'tournamentCompetitors'>,
    rounds?: [number, number],
  },
) => await ctx.db.query('tournamentPairings').filter((q) => {
  
  const filters = [];

  if (args.tournamentCompetitorId !== undefined) {
    filters.push(q.or(
      q.eq(q.field('tournamentCompetitor0Id'), args.tournamentCompetitorId),
      q.eq(q.field('tournamentCompetitor1Id'), args.tournamentCompetitorId),
    ));
  }

  if (args.rounds !== undefined) {
    const lowerBound = Math.max(args.rounds[0], 0); // Prevent values lower than 0
    const upperBound = Math.max(args.rounds[1], lowerBound); // Prevent values lower lowerBound
    filters.push(q.and(
      q.gte(q.field('round'), lowerBound),
      q.lte(q.field('round'), upperBound),
    ));
  }
  
  return q.and(
    ...filters,
  );
}).collect();

export function isCompetitorInPairing(id: Id<'tournamentCompetitors'>, pairing: Doc<'tournamentPairings'>) {
  return [pairing.tournamentCompetitor0Id, pairing.tournamentCompetitor1Id].includes(id);
}

export function tournamentPairingIncludesCompetitor(pairing: Doc<'tournamentPairings'>, id: Id<'tournamentCompetitors'>) {
  return [pairing.tournamentCompetitor0Id, pairing.tournamentCompetitor1Id].includes(id);
}
