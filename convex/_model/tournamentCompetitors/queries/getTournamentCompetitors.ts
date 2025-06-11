import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentCompetitor, DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';

export const getTournamentCompetitors = async (
  ctx: QueryCtx,
): Promise<DeepTournamentCompetitor[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').collect();
  return await Promise.all(tournamentCompetitors.map(
    async (item) => await deepenTournamentCompetitor(ctx, item),
  ));
};
