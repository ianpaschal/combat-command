import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getMatchResultsByTournamentPairingId = async (
  ctx: QueryCtx,
  id: Id<'tournamentPairings'>,
) => await ctx.db.query('matchResults')
  .withIndex('by_tournament_pairing_id', (q) => q.eq('tournamentPairingId', id))
  .collect();
