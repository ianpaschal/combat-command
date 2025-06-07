import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getMatchResultsByTournamentPairing = async (
  ctx: QueryCtx,
  tournamentPairingId: Id<'tournamentPairings'>,
) => await ctx.db.query('matchResults')
  .withIndex('by_tournament_pairing_id', (q) => q.eq('tournamentPairingId', tournamentPairingId))
  .collect();
