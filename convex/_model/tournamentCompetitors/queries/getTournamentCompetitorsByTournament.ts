import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentCompetitor,DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';

export const getTournamentCompetitorsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getTournamentCompetitorsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentCompetitorsByTournamentArgs>,
): Promise<DeepTournamentCompetitor[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  return await Promise.all(tournamentCompetitors.map(
    async (item) => await deepenTournamentCompetitor(ctx, item),
  ));
};
