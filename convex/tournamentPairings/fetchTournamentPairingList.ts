import { v } from 'convex/values';

import { query } from '../_generated/server';

export const fetchTournamentPairingList = query({
  args: {
    tournamentId: v.id('tournaments'),
  },
  handler: async (ctx, { tournamentId }) => {
    const tournamentPairings = await ctx.db.query('tournamentPairings').withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournamentId)).collect();

    return Promise.all(tournamentPairings.map(async (tournamentPairing) => ({
      ...tournamentPairing,
    })));
  },
});
