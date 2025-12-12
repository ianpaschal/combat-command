import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { createSortByRanking } from '../../common/_helpers/gameSystem/createSortByRanking';
import { getErrorMessage } from '../../common/errors';
import { getTournamentShallow } from '../../tournaments';
import { aggregateTournamentData } from '../_helpers/aggregateTournamentData';
import { applyScoreAdjustments } from '../_helpers/applyScoreAdjustments';

export const refreshTournamentResultArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

export const refreshTournamentResult = async (
  ctx: MutationCtx,
  args: Infer<typeof refreshTournamentResultArgs>,
): Promise<Id<'tournamentResults'>> => {

  // ---- GATHER DATABASE RECORDS ----
  const existingResult = await ctx.db.query('tournamentResults')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', args.tournamentId).eq('round', args.round))
    .first();
  const tournament = await getTournamentShallow(ctx, args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();

  // ---- AGGREGATE RANKING DATA ----
  const { registrations, competitors } = await aggregateTournamentData(ctx, tournament, args.round);

  // ---- APPLY SCORE ADJUSTMENTS ----
  const adjustedCompetitors = competitors.map((c) => {
    const competitor = tournamentCompetitors.find((w) => w._id === c.id);
    const adjustedRankingFactors = applyScoreAdjustments(
      c.rankingFactors,
      competitor?.scoreAdjustments ?? [],
      args.round,
    );
    return {
      ...c,
      rankingFactors: adjustedRankingFactors,
    };
  });

  // ---- SORT USING RANKING FACTORS ----
  const sortByRanking = createSortByRanking(tournament.gameSystem, tournament.rankingFactors);
  const result = {
    registrations: registrations.sort(sortByRanking).map((data, i) => ({ ...data, rank:  i })),
    competitors: adjustedCompetitors.sort(sortByRanking).map((data, i) => ({ ...data, rank:  i })),
  };

  // ---- CREATE/UPDATE RECORD ----
  if (existingResult) {
    await ctx.db.patch(existingResult._id, result);
    return existingResult._id;
  }

  return await ctx.db.insert('tournamentResults', {
    ...args,
    ...result,
    gameSystem: tournament.gameSystem,
  });
};
