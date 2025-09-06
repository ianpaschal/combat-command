import { Migrations } from '@convex-dev/migrations';
import { fromZonedTime } from 'date-fns-tz';

import { components } from './_generated/api.js';
import { DataModel, Id } from './_generated/dataModel.js';
import { VisibilityLevel } from './_model/common/types.js';
import { UserDataVisibilityLevel } from './_model/common/userDataVisibilityLevel.js';
import { extractSearchTokens } from './_model/users/_helpers/extractSearchTokens.js';

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

export const populateUserSearch = migrations.define({
  table: 'users',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {
    search: extractSearchTokens(doc),
  }),
});

const userDataVisibilityLevelMap: Record<UserDataVisibilityLevel, VisibilityLevel> = {
  hidden: VisibilityLevel.Hidden,
  clubs: VisibilityLevel.Clubs,
  friends: VisibilityLevel.Friends,
  tournaments: VisibilityLevel.Tournaments,
  community: VisibilityLevel.Community,
  public: VisibilityLevel.Public,
};
export const migrateUserDataVisibilityLevels = migrations.define({
  table: 'users',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {
    nameVisibility: userDataVisibilityLevelMap[(doc.nameVisibility ?? 'hidden') as UserDataVisibilityLevel],
    locationVisibility: userDataVisibilityLevelMap[(doc.locationVisibility ?? 'hidden') as UserDataVisibilityLevel],
  }),
});

const convertStringToEpoch = (input: string, timezone: string): number => {
  const date = new Date(input);
  return fromZonedTime(date, timezone).getTime();
};

export const migrateTournamentDates = migrations.define({
  table: 'tournaments',
  migrateOne: async (ctx, doc) => {
    const updated = {
      ...doc,
      startsAt: typeof doc.startsAt === 'string' ? convertStringToEpoch(doc.startsAt, doc.location.timeZone) : doc.startsAt,
      endsAt: typeof doc.endsAt === 'string' ? convertStringToEpoch(doc.endsAt, doc.location.timeZone) : doc.endsAt,
      registrationClosesAt: typeof doc.registrationClosesAt === 'string' ? convertStringToEpoch(doc.registrationClosesAt, doc.location.timeZone) : doc.registrationClosesAt,
      listSubmissionClosesAt: (typeof doc.startsAt === 'string' ? convertStringToEpoch(doc.startsAt, doc.location.timeZone) : doc.startsAt) - 86400000, // 1 Day earlier
    };
    await ctx.db.patch(doc._id, updated);
  },
});
