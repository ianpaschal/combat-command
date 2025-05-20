import { Infer, v } from 'convex/values';

import { mockTournamentData } from './_helpers/mockData';
import { MutationCtx } from '../../_generated/server';
import { tournamentStatus } from '../../common/tournamentStatus';

export const createTestTournamentArgs = v.object({
  useTeams: v.boolean(),
  status: tournamentStatus,
  currentRound: v.number(),
  useNationalTeams: v.boolean(),
});

export const createTestTournament = async (
  ctx: MutationCtx,
  {
    useTeams,
    status,
    currentRound,
    useNationalTeams,
  }: Infer<typeof createTestTournamentArgs>,
) => {
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
    currentRound: currentRound === undefined ? 0 : 1,
    maxCompetitors,
    competitorSize,
    useNationalTeams,
    roundStructure: {
      pairingTime: useTeams ? 15 : 0,
      setUpTime: 30,
      playingTime: 150,
    },
  });

  // 3. Create competitors
  if (status !== 'draft') {
    for (let i = 0; i < maxCompetitors; i++) {
      const startingIndex = i * competitorSize;
      const players = userIds.slice(startingIndex, startingIndex + competitorSize).map((userId) => ({
        userId,
        active: true,
      }));
      await ctx.db.insert('tournamentCompetitors', {
        teamName: useTeams ? `Team ${i + 1}` : undefined,
        tournamentId,
        active: currentRound > 0,
        players,
      });
    }
  }
};
