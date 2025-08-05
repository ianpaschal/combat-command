import { Infer, v } from 'convex/values';

import { api } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import {
  action,
  ActionCtx,
  internalQuery,
} from '../../../_generated/server';
import { calculateFowV4MatchResultScore } from '../../fowV4/calculateFowV4MatchResultScore';

export const exportTournamentMatchDataArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const exportFowV4TournamentMatchData = async (
  ctx: ActionCtx,
  args: Infer<typeof exportTournamentMatchDataArgs>,
): Promise<Id<'_storage'>> => {

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

  const rows = matchResults.map((matchResult) => {

    const playerLetterIndexes = ['a', 'b'];
    const generalValues = {
      round: matchResult.tournamentPairingId,
      turns_played: matchResult.details.turnsPlayed,
      first_turn: playerLetterIndexes[matchResult.details.firstTurn],
      outcome: matchResult.details.outcomeType,
      winner: playerLetterIndexes[matchResult.details.winner] ?? 'none',
    };

    const playerValues = playerLetterIndexes.map((letter, i) => {
      type GeneralKey = keyof typeof matchResult;
      type DetailsKey = keyof typeof matchResult.details;
      const playerUser = i === 0 ? matchResult.player0User : matchResult.player1User;
      return {
        [`player_${letter}_team`]: 'foo',
        [`player_${letter}_user_id`]: playerUser?._id ?? '',
        [`player_${letter}_name`]: playerUser?.displayName ?? matchResult[`player${i}Placeholder` as GeneralKey],
        [`player_${letter}_alignment`]: 'foo',
        [`player_${letter}_faction`]: 'foo',
        [`player_${letter}_formation_0`]: 'foo',
        [`player_${letter}_formation_1`]: 'foo',
        [`player_${letter}_formation_2`]: 'foo',
        [`player_${letter}_battle_plan`]: matchResult.details[`player${i}BattlePlan` as DetailsKey],
        [`player_${letter}_units_lost`]: matchResult.details[`player${i}UnitsLost` as DetailsKey],
        [`player_${letter}_score`]: matchResult.details[`player${i}Score` as DetailsKey],
        [`player_${letter}_role`]: matchResult.details.attacker === 0 ? 'attacker' : 'defender',
      };
    });

  });

  // 2. Convert to CSV
  const csv = parse(data); // using json2csv

  // 3. Upload to storage
  const file = new Blob([csv], { type: 'text/csv' });

  const storageId = await ctx.storage.store(file);

  // 4. Return storage ID
  return storageId;
};

export const doSomething = action({
  args: { a: v.number() },
  handler: async (ctx, args) => {

    // do something with `data`
  },
});

export const readData = internalQuery({
  args: { a: v.number() },
  handler: async (ctx, args) => {
    // read from `ctx.db` here
  },
});
