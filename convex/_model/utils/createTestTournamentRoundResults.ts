import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../_generated/server';

export const createTestTournamentRoundResultsArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const createTestTournamentRoundResults = async (
  ctx: MutationCtx,
  { tournamentId } : Infer<typeof createTestTournamentRoundResultsArgs>,
) => {
  const tournament = await ctx.db.get(tournamentId);
  if (!tournament) {
    throw new Error('Tournament doesn\'t exist!');
  }
  if (tournament.status !== 'active') {
    throw new Error('Tournament is not active');
  }
  const round = tournament.currentRound ?? 0;
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournamentId))
    .filter((q) => q.eq(q.field('round'), round))
    .collect();
  if (tournamentPairings.length < 1) {
    throw new Error('No pairings to create results for!');
  }
  tournamentPairings.forEach(async (pairing) => {
    const tournamentCompetitor0 = await ctx.db.get(pairing.tournamentCompetitor0Id);
    const tournamentCompetitor1 = await ctx.db.get(pairing.tournamentCompetitor1Id);
    if (!tournamentCompetitor0 || !tournamentCompetitor1) {
      throw new Error('Pairing is missing a competitor!');
    }
    const tournamentCompetitor0UserIds = tournamentCompetitor0.players.filter((player) => player.active).map((player) => player.userId);
    const tournamentCompetitor1UserIds = tournamentCompetitor1.players.filter((player) => player.active).map((player) => player.userId);
    for (let i = 0; i < tournament.competitorSize; i++) {
      const outcomeType = Math.random() > 0.25 ? 'objective_taken' : 'time_out';
      await ctx.db.insert('matchResults', {
        tournamentPairingId: pairing._id,
        player0UserId: tournamentCompetitor0UserIds[i],
        player1UserId: tournamentCompetitor1UserIds[i],
        player0Confirmed: true,
        player1Confirmed: true,
        playedAt: new Date().toISOString(),
        details: {
          attacker: 0,
          firstTurn: 0,
          missionId: 'flames_of_war_v4::mission::2023_04_spearpoint',
          outcomeType,
          player0BattlePlan: 'attack',
          player0UnitsLost: Math.round(Math.random() * 5) + 2,
          player1BattlePlan: 'attack',
          player1UnitsLost: Math.round(Math.random() * 5) + 2,
          turnsPlayed: Math.round(Math.random() * 5) + 2,
          winner: outcomeType === 'time_out' ? -1 : (Math.random() > 0.5 ? 1 : 0),
        },
        gameSystemConfig: tournament.gameSystemConfig,
        gameSystemId: tournament.gameSystemId,
      });
    }
  });
};
