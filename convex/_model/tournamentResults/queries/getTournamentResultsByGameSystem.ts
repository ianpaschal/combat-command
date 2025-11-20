import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { Infer, v } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const getTournamentResultsByGameSystemArgs = v.object({
  gameSystem,
  round: v.optional(v.number()),
});

export const getTournamentResultsByGameSystem = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentResultsByGameSystemArgs>,
): Promise<Doc<'tournamentResults'>[]> => {
  const tournaments = await ctx.db.query('tournaments')
    .withIndex('by_game_system', (q) => q.eq('gameSystem', args.gameSystem))
    .filter((q) => q.eq('status', 'archived'))
    .collect();

  const tournamentResults: Doc<'tournamentResults'>[] = [];

  for (const tournament of tournaments) {
    const result = await ctx.db.query('tournamentResults')
      .withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournament._id).eq('round', tournament.lastRound ?? 0))
      .first();
    if (result) {
      tournamentResults.push(result);
    }
  }

  return tournamentResults;
};
