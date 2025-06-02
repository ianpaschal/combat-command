import { convexTest } from 'convex-test';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { createFakeUserData } from '../../../_fixtures/createFakeUserData';
import { defaultTeamTournament } from '../../../_fixtures/defaultTeamTournament';
import { api } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import { errors } from '../../../common/errors';
import schema from '../../../schema';

describe('tournaments/startTournament', async () => {
  const t = convexTest(schema);
  let organizerId: Id<'users'>;
  let tournamentId: Id<'tournaments'>;
  const asRandomUser = () => t.withIdentity({ subject: 'random_user_id' as Id<'users'> });
  const asOrganizer = () => t.withIdentity({ subject: organizerId });

  await t.run(async (ctx) => {
    organizerId = await ctx.db.insert('users', createFakeUserData());
    tournamentId = await ctx.db.insert('tournaments', {
      ...defaultTeamTournament,
      organizerUserIds: [organizerId],
      status: 'published',
    });
  });

  // Authentication
  it('throws if the user is not authenticated', async () => {
    await expect(async () => {
      // Anonymous mutation
      await t.mutation(api.tournaments.startTournament, { id: tournamentId });
    }).rejects.toThrowError(errors.USER_NOT_AUTHENTICATED);
  });

  it('throws if the user is not a tournament organizer', async () => {
    await expect(async () => {
      await asRandomUser().mutation(api.tournaments.startTournament, { id: tournamentId });
    }).rejects.toThrowError(errors.USER_NOT_TOURNAMENT_ORGANIZER);
  });

  // Tournament
  // TODO: Fix once it's clear why Convex throws its own error instead of returning null and throwing our error
  it.skip('throws if the tournament is not found', async () => {
    await expect(async () => {
      await asOrganizer().mutation(api.tournaments.startTournament, { id: 'jx7ce5yh73nmqx65wd49fw14y57c54mr' as Id<'tournaments'> });
    }).rejects.toThrowError(errors.TOURNAMENT_NOT_FOUND);
  });

  it('throws if tournament is in draft status', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(tournamentId, { status: 'draft' });
    });
    await expect(async () => {
      await asOrganizer().mutation(api.tournaments.startTournament, { id: tournamentId });
    }).rejects.toThrowError(errors.CANNOT_START_DRAFT_TOURNAMENT);
  });

  it('throws if tournament is already active', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(tournamentId, { status: 'active' });
    });
    await expect(async () => {
      await asOrganizer().mutation(api.tournaments.startTournament, { id: tournamentId });
    }).rejects.toThrowError(errors.TOURNAMENT_ALREADY_ACTIVE);
  });

  it('throws if tournament is archived', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(tournamentId, { status: 'archived' });
    });
    await expect(async () => {
      await asOrganizer().mutation(api.tournaments.startTournament, { id: tournamentId });
    }).rejects.toThrowError(errors.CANNOT_START_ARCHIVED_TOURNAMENT);
  });

  // Happy flow
  it('starts a tournament', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(tournamentId, { status: 'published' });
    });
    await asOrganizer().mutation(api.tournaments.startTournament, {
      id: tournamentId,
    });
    const tournament = await t.query(api.tournaments.getTournament, {
      id: tournamentId,
    });
    expect(tournament?.status).toBe('active');
  });
});
