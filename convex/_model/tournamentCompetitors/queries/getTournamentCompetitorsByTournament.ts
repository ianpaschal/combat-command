import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getTournamentRankings } from '../../tournaments';
import { deepenTournamentCompetitor,DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';
import { sortTournamentCompetitorsByName } from '../_helpers/sortTournamentCompetitorsByName';

export const getTournamentCompetitorsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
  includeRankings: v.optional(v.number()),
});

export const getTournamentCompetitorsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentCompetitorsByTournamentArgs>,
): Promise<DeepTournamentCompetitor[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const rankings = args.includeRankings !== undefined && args.includeRankings > -1 ? await getTournamentRankings(ctx, {
    tournamentId: args.tournamentId,
    round: args.includeRankings,
  }) : undefined;
  const deepTournamentCompetitors = await Promise.all(tournamentCompetitors.map(async (item) => {
    const results = rankings?.competitors.find((c) => c.id === item._id);
    return await deepenTournamentCompetitor(ctx, item, results );
  }));
  return deepTournamentCompetitors.sort(sortTournamentCompetitorsByName);
};
