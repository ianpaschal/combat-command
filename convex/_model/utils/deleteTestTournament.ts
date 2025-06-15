import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../_generated/server';

export const deleteTestTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const deleteTestTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof deleteTestTournamentArgs>,
): Promise<void> => {
  // 1. Delete the tournament
  await ctx.db.delete(id);

  // 2. Delete competitors
  const competitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  competitors.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 3. Delete pairings
  const pairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  pairings.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 4. Delete match results
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  matchResults.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });
};
