import { Infer, v } from 'convex/values';

import { mockTournamentData } from './_helpers/mockData';
import { MutationCtx } from '../../_generated/server';
import { tournamentStatus } from '../common/tournamentStatus';

export const createTestTournamentArgs = v.object({
  organizerUserId: v.id('users'),
  useTeams: v.boolean(),
  status: tournamentStatus,
  currentRound: v.optional(v.number()),
  lastRound: v.optional(v.number()),
  useNationalTeams: v.boolean(),
});

const countryCodes = [
  'nl', 'be', 'de', 'dk',
  'se', 'gb-nir', 'fr', 'it',
  'es', 'pt', 'ie', 'us',
];

export const createTestTournament = async (
  ctx: MutationCtx,
  {
    organizerUserId,
    useTeams,
    status,
    currentRound,
    lastRound,
    useNationalTeams,
  }: Infer<typeof createTestTournamentArgs>,
): Promise<void> => {
  const maxCompetitors = useTeams ? 12 : 24;
  const competitorSize = useTeams ? 3 : 1;

  // 1. Gather users
  const requiredUserCount = maxCompetitors * competitorSize + 1;
  const users = await ctx.db.query('users').take(requiredUserCount);
  if (users.length < requiredUserCount) {
    throw new Error('Not enough users');
  }
  const userIds = users.map((user) => user._id);

  // 2. Create the tournament
  const tournamentId = await ctx.db.insert('tournaments', {
    ...mockTournamentData,
    startsAt: Date.now(),
    endsAt: Date.now(),
    registrationClosesAt: Date.now(),
    listSubmissionClosesAt: Date.now(),
    status,
    currentRound,
    lastRound,
    maxCompetitors,
    competitorSize,
    useNationalTeams,
    roundStructure: {
      pairingTime: useTeams ? 1 : 0,
      setUpTime: 2,
      playingTime: 3,
    },
  });
  await ctx.db.insert('tournamentOrganizers', {
    userId: organizerUserId,
    tournamentId,
  });

  // 3. Create competitors
  if (status !== 'draft') {
    for (let i = 0; i < maxCompetitors; i++) {
      const startingIndex = i * competitorSize;
      const players = userIds.slice(startingIndex, startingIndex + competitorSize).map((userId) => ({
        userId,
        active: true,
      }));

      let teamName = undefined;
      if (useTeams) {
        if (useNationalTeams && countryCodes[i]) {
          teamName = countryCodes[i];
        } else {
          teamName = `Team ${i + 1}`;
        }
      }

      const tournamentCompetitorId = await ctx.db.insert('tournamentCompetitors', {
        teamName,
        tournamentId,
        active: status === 'active',
      });

      for (const player of players) {
        await ctx.db.insert('tournamentRegistrations', {
          tournamentId,
          tournamentCompetitorId,
          userId: player.userId,
          active: true,
          userConfirmed: true,
          listApproved: true,
        });
      }
    }
  }
};
