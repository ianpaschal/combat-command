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

  // 2. Delete organizers
  const organizers = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', id))
    .collect();
  organizers.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 3. Delete registrations
  const registrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', id))
    .collect();
  registrations.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 4. Delete competitors
  const competitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  competitors.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 5. Delete pairings
  const pairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  pairings.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 6. Delete match results
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  matchResults.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });

  // 7. Delete results
  const results = await ctx.db.query('tournamentResults')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', id))
    .collect();
  results.forEach(async ({ _id }) => {
    await ctx.db.delete(_id);
  });
};
