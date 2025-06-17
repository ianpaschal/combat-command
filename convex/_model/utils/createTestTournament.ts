import { Infer, v } from 'convex/values';

import { mockTournamentData } from './_helpers/mockData';
import { Id } from '../../_generated/dataModel';
import { MutationCtx } from '../../_generated/server';
import { tournamentStatus } from '../../common/tournamentStatus';

export const createTestTournamentArgs = v.object({
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
  const organizerUserId = userIds.shift();
  if (!organizerUserId) {
    throw new Error('No organizer id');
  }

  // 2. Create the tournament
  const tournamentId = await ctx.db.insert('tournaments', {
    ...mockTournamentData,
    status,
    organizerUserIds: [organizerUserId],
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
    logoStorageId: 'kg208wxmb55v36bh9qnkqc0c397j1rmb' as Id<'_storage'>,
    bannerStorageId: 'kg23fhn8chmnc475pgmen2wn5n7j1qts' as Id<'_storage'>,
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

      await ctx.db.insert('tournamentCompetitors', {
        teamName,
        tournamentId,
        active: status === 'active',
        players,
      });
    }
  }
};
