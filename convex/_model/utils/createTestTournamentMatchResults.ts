import { Infer, v } from 'convex/values';

import { createMockFowV4MatchResultData } from '../../_fixtures/fowV4/createMockFowV4MatchResultData';
import { Doc, Id } from '../../_generated/dataModel';
import { MutationCtx } from '../../_generated/server';

export const createTestTournamentMatchResultsArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const createTestTournamentMatchResults = async (
  ctx: MutationCtx,
  { tournamentId }: Infer<typeof createTestTournamentMatchResultsArgs>,
): Promise<void> => {
  const tournament = await ctx.db.get(tournamentId);
  if (!tournament) {
    throw new Error('Tournament doesn\'t exist!');
  }
  if (tournament.status !== 'active') {
    throw new Error('Tournament is not active');
  }
  if (tournament.currentRound == undefined) {
    throw new Error('Tournament does not have a current round!');
  }
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournamentId).eq('round', tournament.currentRound ?? -1))
    .collect();
  if (tournamentPairings.length < 1) {
    throw new Error('No pairings to create results for!');
  }
  tournamentPairings.forEach(async (pairing) => {
    const existingMatchResults = await ctx.db.query('matchResults')
      .withIndex('by_tournament_pairing_id', (q) => q.eq('tournamentPairingId', pairing._id))
      .collect();

    const matchResultIds = existingMatchResults.map((matchResult) => matchResult._id);
    const usedPlayerIds = existingMatchResults.reduce((acc, result) => {
      if (result.player0UserId) {
        acc.push(result.player0UserId);
      }
      if (result.player1UserId) {
        acc.push(result.player1UserId);
      }
      return acc;
    }, [] as Id<'users'>[]);

    let i = 0;
    while (matchResultIds.length < tournament.competitorSize) {
      i += 1;

      if (i > tournament.competitorSize * 2) {
        throw new Error('Adding way too many match results! Something is wrong!');
      }

      const playerData: Pick<Doc<'matchResults'>, 'player0UserId' | 'player1UserId' | 'player1Placeholder' | 'player0Placeholder'> = {};
      const tournamentCompetitor0 = await ctx.db.get(pairing.tournamentCompetitor0Id);
      const tournamentCompetitor0UserIds = tournamentCompetitor0 ? tournamentCompetitor0.players.filter((player) => (
        player.active && !usedPlayerIds.includes(player.userId)
      )).map((player) => player.userId) : [];
      const player0UserId = tournamentCompetitor0UserIds.pop();
      if (player0UserId) {
        playerData.player0UserId = player0UserId;
      } else {
        playerData.player0Placeholder = 'Bye';
      }

      if (pairing.tournamentCompetitor1Id) {
        const tournamentCompetitor1 = await ctx.db.get(pairing.tournamentCompetitor1Id);
        const tournamentCompetitor1UserIds = tournamentCompetitor1 ? tournamentCompetitor1.players.filter((player) => (
          player.active && !usedPlayerIds.includes(player.userId)
        )).map((player) => player.userId) : [];
        const player1UserId = tournamentCompetitor1UserIds.pop();
        playerData.player1UserId = player1UserId;
      } else {
        playerData.player1Placeholder = 'Bye';
      }

      // TODO: Replace with actual call to the create mutation
      const matchResultId = await ctx.db.insert('matchResults', {
        ...createMockFowV4MatchResultData({
          ...playerData,
          tournamentPairingId: pairing._id,
     
          gameSystemConfig: tournament.gameSystemConfig,
          gameSystemId: tournament.gameSystemId,
        }),
        tournamentId: tournament._id,
      });

      if (matchResultId) {
        matchResultIds.push(matchResultId);
        if (playerData.player0UserId) {
          usedPlayerIds.push(playerData.player0UserId);
        }
        if (playerData.player1UserId) {
          usedPlayerIds.push(playerData.player1UserId);
        }
      }
    }
  });
};
