import { Infer, v } from 'convex/values';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';

export const exportFowV4TournamentMatchDataArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const exportFowV4TournamentMatchData = async (
  ctx: ActionCtx,
  args: Infer<typeof exportFowV4TournamentMatchDataArgs>,
): Promise<string | null> => {

  // 1. Gater base data
  const tournamentPairings = await ctx.runQuery(
    api.tournamentPairings.getTournamentPairings, {
      tournamentId: args.tournamentId,
    },
  );
  const tournamentCompetitors = await ctx.runQuery(
    api.tournamentCompetitors.getTournamentCompetitorsByTournament, {
      tournamentId: args.tournamentId,
    },
  );
  const matchResults = await ctx.runQuery(
    api.matchResults.getMatchResultsByTournament, {
      tournamentId: args.tournamentId,
    },
  );

  // 2. Construct CSV data
  const rows = matchResults.map((matchResult) => {
    const playerLetterIndexes = ['a', 'b'];
    const pairing = tournamentPairings.find((p) => p._id === matchResult.tournamentPairingId);
    return playerLetterIndexes.reduce((acc, letter, i) => {
      type GeneralKey = keyof typeof matchResult;
      type DetailsKey = keyof typeof matchResult.details;
      const playerUser = i === 0 ? matchResult.player0User : matchResult.player1User;
      const playerList = i === 0 ? matchResult.player0List : matchResult.player1List;
      const playerTeam = tournamentCompetitors.find((c) => c.registrations.find((r) => r.user?._id === playerUser?._id));
      return {
        ...acc,
        [`player_${letter}_team`]: playerTeam?.teamName ?? '',
        [`player_${letter}_user_id`]: playerUser?._id ?? '',
        [`player_${letter}_name`]: playerUser?.displayName ?? matchResult[`player${i}Placeholder` as GeneralKey],
        [`player_${letter}_force_diagram`]: playerList?.data.meta.forceDiagram ?? '',
        [`player_${letter}_faction`]: playerList?.data.meta.faction ?? '',
        [`player_${letter}_formation_0`]: playerList?.data.formations[0]?.sourceId ?? '',
        [`player_${letter}_formation_1`]: playerList?.data.formations[1]?.sourceId ?? '',
        [`player_${letter}_battle_plan`]: matchResult.details[`player${i}BattlePlan` as DetailsKey],
        [`player_${letter}_units_lost`]: matchResult.details[`player${i}UnitsLost` as DetailsKey],
        [`player_${letter}_score`]: matchResult.details[`player${i}Score` as DetailsKey],
        [`player_${letter}_role`]: matchResult.details.attacker === i ? 'attacker' : 'defender',
      };
    }, {
      round: pairing?.round !== undefined ? (pairing.round + 1).toString() : '',
      turns_played: matchResult.details.turnsPlayed,
      first_turn: playerLetterIndexes[matchResult.details.firstTurn],
      outcome: matchResult.details.outcomeType,
      winner: playerLetterIndexes[matchResult.details.winner] ?? 'none',
    });
  });

  // 3. Convert to CSV
  const csv = [
    Object.keys(rows[0]).join(','), // Header
    ...rows.map((row) => Object.values(row).join(',')),
  ].join('\n');

  // 4. Upload to storage
  const storageId = await ctx.storage.store(new Blob([csv], { type: 'text/csv' }));
  return await ctx.storage.getUrl(storageId);
};
