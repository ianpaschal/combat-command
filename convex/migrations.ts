import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api.js';
import { DataModel, Id } from './_generated/dataModel.js';
import { extractSearchTokens } from './_model/users/_helpers/extractSearchTokens.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const addCaptains = migrations.define({
  table: 'tournamentCompetitors',
  migrateOne: async (ctx, doc) => {
    if (!doc.captainUserId) {
      const captainRegistration = await ctx.db.query('tournamentRegistrations')
        .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', doc._id))
        .first();
      if (captainRegistration) {
        await ctx.db.patch(doc._id, {
          captainUserId: captainRegistration.userId,
        });
      }
    }
  },
});

export const populateUserSearch = migrations.define({
  table: 'users',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {
    search: extractSearchTokens(doc),
  }),
});

export const fixMissingListData = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => {
    const patchData: { player0ListId?: Id<'lists'>, player1ListId?: Id<'lists'> } = {
      player0ListId: undefined,
      player1ListId: undefined,
    };
    if (doc.tournamentId && doc.player0UserId) {
      const reg = await ctx.db.query('tournamentRegistrations')
        .withIndex('by_tournament_user', (q) => q.eq('tournamentId', doc.tournamentId!).eq('userId', doc.player0UserId!))
        .first();
      if (reg) {
        patchData.player0ListId = reg.listId;
      }
    }
    if (doc.tournamentId && doc.player1UserId) {
      const reg = await ctx.db.query('tournamentRegistrations')
        .withIndex('by_tournament_user', (q) => q.eq('tournamentId', doc.tournamentId!).eq('userId', doc.player1UserId!))
        .first();
      if (reg) {
        patchData.player1ListId = reg.listId;
      }
    }
    await ctx.db.patch(doc._id, patchData);
  },
});
