import { Migrations } from '@convex-dev/migrations';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { DynamicPointsVersion } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { ConvexError } from 'convex/values';

import { components } from './_generated/api';
import { DataModel, Id } from './_generated/dataModel';
import { getErrorMessage } from './_model/common/errors';
import { refreshTournamentResult } from './_model/tournamentResults';
import { aggregateTournamentData } from './_model/tournamentResults/_helpers/aggregateTournamentData';
import { applyScoreAdjustments } from './_model/tournamentResults/_helpers/applyScoreAdjustments';
import { getTournamentShallow } from './_model/tournaments';

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

export const fixRankingFactors = migrations.define({
  table: 'tournaments',
  migrateOne: async (ctx, doc) => {
    if (doc.status === 'archived') {
      const rounds = doc.lastRound !== undefined ? doc.lastRound + 1 : doc.roundCount;
      for (let i = 0; i < rounds; i++) {
        if (doc._id === 'kx7a8rgzq9297d50e1v3hxrsx57kv6ky') {
          const existingResult = await ctx.db.query('tournamentResults')
            .withIndex('by_tournament_round', (q) => q.eq('tournamentId', doc._id).eq('round', i))
            .first();
          if (!existingResult) {
            throw new Error('No existing result!');
          }
          const tournament = await getTournamentShallow(ctx, doc._id);
          if (!tournament) {
            throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
          }
          const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
            .withIndex('by_tournament_id', (q) => q.eq('tournamentId', doc._id))
            .collect();

          // ---- AGGREGATE RANKING DATA ----
          const { registrations, competitors } = await aggregateTournamentData(ctx, tournament, i);

          await ctx.db.patch(existingResult._id, {
            registrations: registrations.map((data) => {
              const existing = existingResult?.registrations.find((c) => c.id === data.id);
              return {
                ...data,
                rankingFactors: {
                  ...data.rankingFactors,
                  average_opponent_wins: existing?.rankingFactors.average_opponent_wins ?? 0,
                },
              };
            }).sort((a, b) => a.rank - b.rank),
            competitors: competitors.map((data, i) => {
              const existing = existingResult?.competitors.find((c) => c.id === data.id);
              return {
                ...data,
                rankingFactors: {
                  ...applyScoreAdjustments(
                    data.rankingFactors,
                    tournamentCompetitors.find((w) => w._id === data.id)?.scoreAdjustments ?? [],
                    i,
                  ),
                  average_opponent_wins: existing?.rankingFactors.average_opponent_wins ?? 0,
                },
              };
            }).sort((a, b) => a.rank - b.rank),
          });
        } else {
          await refreshTournamentResult(ctx, {
            tournamentId: doc._id,
            round: i,
          });
        }
      } 
    }
  },
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

export const addDynamicPointsVersionToMatchResults = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => {
    if (doc.gameSystem === GameSystem.FlamesOfWarV4) {
      const config = doc.gameSystemConfig;
      if (config.era === 'late_war' && !config.dynamicPointsVersion) {
        await ctx.db.patch(doc._id, {
          gameSystemConfig: {
            ...config,
            dynamicPointsVersion: DynamicPointsVersion.LWOriginal,
          },
        });
      }
    }
  },
});

export const addDynamicPointsVersionToTournaments = migrations.define({
  table: 'tournaments',
  migrateOne: async (ctx, doc) => {
    if (doc.gameSystem === GameSystem.FlamesOfWarV4) {
      const config = doc.gameSystemConfig;
      if (config.era === 'late_war' && !config.dynamicPointsVersion) {
        await ctx.db.patch(doc._id, {
          gameSystemConfig: {
            ...config,
            dynamicPointsVersion: DynamicPointsVersion.LWOriginal,
          },
        });
      }
    }
  },
});
