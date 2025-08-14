import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { redactUser } from '../../users';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentResultDataArgs = v.object({
  id: v.id('tournaments'),
});

export const getTournamentResultData = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentResultDataArgs>,
) => {

  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id')
    .collect();
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id')
    .collect();
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id')
    .collect();
  
  for (const matchResult of matchResults) {
    if (!matchResult.tournamentPairingId) {
      break;
    }
    const pairing = await ctx.db.get(matchResult.tournamentPairingId);
    if (!pairing) {
      break;
    }
    const competitor0 = await ctx.db.get(pairing?.tournamentCompetitor0Id);
    const competitor1 = await ctx.db.get(pairing?.tournamentCompetitor1Id);

    const playerLetterIndexes = ['a', 'b'];

    const player0User = matchResult.player0UserId ? await ctx.db.get(matchResult.player0UserId) : null;

    const player0DisplayName = (player0User ? (await redactUser(ctx, player0User)).displayName : null) ?? matchResult.player0Placeholder ?? '';
    
    const player0Team = matchResult.player0UserId !== undefined ? tournamentCompetitors.find((c) => c.players.map((p) => p.userId).includes(matchResult.player0UserId)) : null;

  }

};
