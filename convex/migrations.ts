import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api.js';
import { DataModel, Id } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const linkListsToTournamentMatchResults = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => {
    if (!doc.tournamentId || !doc.tournamentPairingId) {
      return doc;
    }
    const competitors = await ctx.db.query('tournamentCompetitors')
      .withIndex('by_tournament_id', (q) => q.eq('tournamentId', doc.tournamentId as Id<'tournaments'>))
      .collect();
    const getPlayerListId = (
      userId?: Id<'users'>,
    ): Id<'lists'> | undefined => {
      if (!userId) {
        return;
      }
      const competitor = competitors.find((c) => c.players.some((p) => p.userId === userId));
      if (!competitor) {
        return;
      }
      return competitor.players.find((p) => p.userId === userId)?.listId;
    };
    return {
      ...doc,
      player0ListId: getPlayerListId(doc.player0UserId),
      player1ListId: getPlayerListId(doc.player1UserId),
    };
  },
});
