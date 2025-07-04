import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentCompetitor, DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';
import { sortTournamentCompetitorsByName } from '../_helpers/sortTournamentCompetitorsByName';

export const getTournamentCompetitors = async (
  ctx: QueryCtx,
): Promise<DeepTournamentCompetitor[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').collect();
  const deepTournamentCompetitors = await Promise.all(tournamentCompetitors.map(
    async (item) => await deepenTournamentCompetitor(ctx, item),
  ));
  return deepTournamentCompetitors.sort(sortTournamentCompetitorsByName);
};
