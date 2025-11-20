import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';
import { Triggers } from 'convex-helpers/server/triggers';

import { api } from './_generated/api';
import { DataModel, Doc } from './_generated/dataModel';
import { mutation as convexMutation } from './_generated/server';
import { matchResultTriggers } from './_model/matchResults';
import { tournamentCompetitorTriggers } from './_model/tournamentCompetitors';
import { extractSearchTokens as extractTournamentSearchTokens } from './_model/tournaments/_helpers/extractSearchTokens';
import { extractSearchTokens as extractUserSearchTokens } from './_model/users/_helpers/extractSearchTokens';

const triggers = new Triggers<DataModel>();

// Custom mutation function that triggers can subscribe to (use instead of Convex mutation): 
export const mutationWithTrigger = customMutation(convexMutation, customCtx(triggers.wrapDB));

triggers.register('users', async (ctx, change) => {
  if (change.newDoc) {
    const search = extractUserSearchTokens(change.newDoc);
    if (change.newDoc.search !== search) {
      await ctx.db.patch(change.id, { search });
    }
  }
});

triggers.register('tournaments', async (ctx, change) => {
  const { newDoc, oldDoc } = change;

  const isNew = newDoc && !oldDoc;

  const startsAtChanged = newDoc && oldDoc && newDoc.startsAt !== oldDoc.startsAt;
  const endsAtChanged = newDoc && oldDoc && newDoc.endsAt !== oldDoc.endsAt;

  if (isNew || startsAtChanged || endsAtChanged) {

    const updated: Partial<Pick<Doc<'tournaments'>, 'startsAtTaskId'|'endsAtTaskId'>> = {};

    if (isNew || startsAtChanged) {
      if (oldDoc?.startsAtTaskId) {
        await ctx.scheduler.cancel(oldDoc.startsAtTaskId);
      }
      updated.startsAtTaskId = await ctx.scheduler.runAt(newDoc.startsAt, api.tournaments.startTournament, {
        id: newDoc._id,
      });
    }

    if (isNew || endsAtChanged) {
      if (oldDoc?.endsAtTaskId) {
        await ctx.scheduler.cancel(oldDoc.endsAtTaskId);
      }
      const endDelay = 21600000; // 6 hours in ms
      updated.endsAtTaskId = await ctx.scheduler.runAt(newDoc.endsAt + endDelay, api.tournaments.endTournament, {
        id: newDoc._id,
      });
    }

    await ctx.db.patch(change.id, updated);
  }

  // If changed:
  if (change.newDoc) {
    const search = extractTournamentSearchTokens(change.newDoc);
    if (change.newDoc.search !== search) {
      await ctx.db.patch(change.id, { search });
    }
  }
});

triggers.register('matchResults', matchResultTriggers.refreshTournamentResults);
triggers.register('tournamentCompetitors', tournamentCompetitorTriggers.refreshTournamentResults);
