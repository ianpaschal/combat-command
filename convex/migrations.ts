import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api.js';
import { DataModel, Id } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const linkListsToTournamentMatchResults = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => {
    if (!doc.tournamentId) {
      return doc;
    }
    const competitors = await ctx.db.query('tournamentCompetitors')
      .withIndex('by_tournament_id', (q) => q.eq('tournamentId', doc.tournamentId as Id<'tournaments'>))
      .collect();
 
    const player0ListId = doc.player0UserId ? (
      competitors.find((c) => c.players.find((p) => p.userId === doc.player0UserId))?.players.find((p) => p.userId === doc.player0UserId)?.listId
    ) : undefined;
    if (doc.player1UserId) {
      const player1ListId = competitors.find((c) => c.players.find((p) => p.userId === doc.player1UserId))?.players.find((p) => p.userId === doc.player1UserId)?.listId;
    }

  },
});
