import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { tournamentCompetitorFields } from '.';

export const addTournamentCompetitor = mutation({
  args: {
    competitor: v.object(tournamentCompetitorFields),
    tournamentId: v.id('tournaments'),
  },
  handler: async (ctx, { tournamentId, competitor }) => {
    const tournament = await ctx.db.get(tournamentId);
    const competitors = await ctx.db.query('tournamentCompetitors').withIndex('by_tournament_id').collect();

    if (!tournament) {
      throw 'Could not find a tournament with that ID.';
    }

    if (tournament.status === 'archived') {
      throw 'It is not possible to add competitors to an archived tournament.';
    }

    if (tournament.competitorCount === competitors.length) {
      throw 'This tournament cannot field more competitors.';
    }

    if (competitors.map((c) => c.teamName).includes(competitor.teamName)) {
      throw 'A team by that name is already registered.';
    }

    return await ctx.db.insert('tournamentCompetitors', {
      ...competitor,
      tournamentId,
    });
  },
});
