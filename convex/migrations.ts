import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api.js';
import { DataModel } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const convertPlayersToRegistrations = migrations.define({
  table: 'tournamentCompetitors',
  migrateOne: async (ctx, doc) => {
    if (doc.players) {
      for (const player of doc.players) {
        await ctx.db.insert('tournamentRegistrations', {
          ...player,
          tournamentCompetitorId: doc._id,
          tournamentId: doc.tournamentId,
          listApproved: true,
          userConfirmed: true,
        });
      }
      await ctx.db.patch(doc._id, {
        players: undefined,
      });
    }
  },
});

export const convertTournamentOrganizers = migrations.define({
  table: 'tournaments',
  migrateOne: async (ctx, doc) => {
    if (doc.organizerUserIds) {
      for (const userId of doc.organizerUserIds) {
        await ctx.db.insert('tournamentOrganizers', {
          userId,
          tournamentId: doc._id,
        });
      }
      await ctx.db.patch(doc._id, {
        organizerUserIds: undefined,
      });
    }
  },
});
