import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentOrganizer } from '../_helpers/deepenTournamentOrganizer';
import { TournamentOrganizer } from '../types';

export const getTournamentOrganizersByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getTournamentOrganizersByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentOrganizersByTournamentArgs>,
): Promise<TournamentOrganizer[]> => {
  const records = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  return await Promise.all(records.map(async (item) => (
    await deepenTournamentOrganizer(ctx, item)
  )));
};
