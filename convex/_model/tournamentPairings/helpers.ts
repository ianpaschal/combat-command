import { ConvexError } from 'convex/values';

import { Doc } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getDeepTournamentCompetitor } from '../tournamentCompetitors/helpers';

export const getDeepTournamentPairing = async (
  ctx: QueryCtx,
  tournamentPairing: Doc<'tournamentPairings'>,
) => {

  const rawTournamentCompetitor0 = await ctx.db.get(tournamentPairing.tournamentCompetitor0Id);
  if (!rawTournamentCompetitor0) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournamentCompetitor0 = await getDeepTournamentCompetitor(ctx, rawTournamentCompetitor0 );

  const rawTournamentCompetitor1 = await ctx.db.get(tournamentPairing.tournamentCompetitor1Id);
  if (!rawTournamentCompetitor1) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournamentCompetitor1 = await getDeepTournamentCompetitor(ctx, rawTournamentCompetitor1 );

  return {
    ...tournamentPairing,
    tournamentCompetitor0,
    tournamentCompetitor1,
  };
};
