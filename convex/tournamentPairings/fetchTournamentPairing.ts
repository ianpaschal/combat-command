import { v } from 'convex/values';

import { query } from '../_generated/server';
import { fetchTournamentCompetitor } from '../tournamentCompetitors/fetchTournamentCompetitor';

export const fetchTournamentPairing = query({
  args: {
    id: v.id('tournamentPairings'),
  },
  handler: async (ctx, { id }) => {
    const tournamentPairing = await ctx.db.get(id);
    if (!tournamentPairing) {
      return null;
    }

    const tournamentCompetitor0 = await fetchTournamentCompetitor(ctx, { id: tournamentPairing.tournamentCompetitor0Id });
    const tournamentCompetitor1 = await fetchTournamentCompetitor(ctx, { id: tournamentPairing.tournamentCompetitor1Id });

    if (!tournamentCompetitor0 || !tournamentCompetitor1) {
      throw 'Could not find referenced competitors with those IDs';
    }

    return {
      ...tournamentPairing,
      tournamentCompetitor0,
      tournamentCompetitor1,
    };
  },
});
