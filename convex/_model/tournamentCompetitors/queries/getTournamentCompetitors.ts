import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentCompetitor, DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';

export const getTournamentCompetitors = async (
  ctx: QueryCtx,
): Promise<DeepTournamentCompetitor[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').collect();
  const deepTournamentCompetitors = await Promise.all(tournamentCompetitors.map(
    async (item) => await deepenTournamentCompetitor(ctx, item),
  ));
  return deepTournamentCompetitors.sort((a, b) => {
    const getSortValue = (competitor: DeepTournamentCompetitor): string => {
      if (competitor.teamName) {
        return competitor.teamName;
      }
      if (competitor.players[0].user.familyName) {
        return competitor.players[0].user.familyName;
      }
      if (competitor.players[0].user.username) {
        return competitor.players[0].user.username;
      }
      return '';
    };
    return getSortValue(a).localeCompare(getSortValue(b));
  });
};
