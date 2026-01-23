import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getCountryName } from '../../common/_helpers/getCountryName';
import { getErrorMessage } from '../../common/errors';
import { getTournamentRegistrationsByCompetitor } from '../../tournamentRegistrations';

export const getDisplayName = async (
  ctx: QueryCtx,
  doc?: Doc<'tournamentCompetitors'> | null,
): Promise<string> => {
  const fallBack = 'Unknown Competitor'; // TODO: Language support

  if (!doc) {
    return fallBack;
  }

  const activeRegistrations = await getTournamentRegistrationsByCompetitor(ctx, {
    tournamentCompetitorId: doc._id,
    activeOnly: true,
  });

  const tournament = await ctx.db.get(doc.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  // If competitor has only 1 player, just use the player's name:
  if (tournament?.competitorSize === 1 && activeRegistrations[0]?.user) {
    return activeRegistrations[0].user.displayName;
  }

  // Use the country name if there is one, otherwise just use the team name:
  if (doc.teamName) {
    const countryName = getCountryName(doc.teamName);
    return countryName ?? doc.teamName;
  }

  // Fallback:
  return fallBack;
};
