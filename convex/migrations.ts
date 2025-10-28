import { Migrations } from '@convex-dev/migrations';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { DynamicPointsVersion, Era } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import { components } from './_generated/api.js';
import {
  DataModel,
  Doc,
  Id,
} from './_generated/dataModel.js';
import { MutationCtx } from './_generated/server.js';
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

const setDefaultDynamicPoints = async (
  ctx: MutationCtx,
  doc: Doc<'matchResults'> | Doc<'tournaments'>,
): Promise<void> => {
  if (doc.gameSystem === GameSystem.FlamesOfWarV4) {
    if (doc.gameSystemConfig.dynamicPointsVersion === undefined) {
      if (doc.gameSystemConfig.era === Era.LW) {
        return await ctx.db.patch(doc._id, {
          gameSystemConfig: {
            ...doc.gameSystemConfig,
            dynamicPointsVersion: DynamicPointsVersion.LWOriginal,
          },
        });
      }
      if (doc.gameSystemConfig.era === Era.MW) {
        return await ctx.db.patch(doc._id, {
          gameSystemConfig: {
            ...doc.gameSystemConfig,
            dynamicPointsVersion: DynamicPointsVersion.MWDynamic2025,
          },
        });
      }
    }
  }
};

export const setMissingMatchResultsDynamicPointsVersions = migrations.define({
  table: 'matchResults',
  migrateOne: setDefaultDynamicPoints,
});

export const setMissingTournamentDynamicPointsVersions = migrations.define({
  table: 'tournaments',
  migrateOne: setDefaultDynamicPoints,
});

const removeExperimentalMissionOption = async (
  ctx: MutationCtx,
  doc: Doc<'matchResults'> | Doc<'tournaments'>,
): Promise<void> => {
  // @ts-expect-error This is a migration.
  if (doc.gameSystemConfig?.useExperimentalMissions !== undefined) {
    return await ctx.db.patch(doc._id, {
      gameSystemConfig: {
        ...doc.gameSystemConfig,
        // @ts-expect-error This is a migration.
        useExperimentalMissions: undefined,
      },
    });
  }
};

export const removeMatchResultExperimentalMissionOption = migrations.define({
  table: 'matchResults',
  migrateOne: removeExperimentalMissionOption,
});

export const removeTournamentExperimentalMissionOption = migrations.define({
  table: 'tournaments',
  migrateOne: removeExperimentalMissionOption,
});
