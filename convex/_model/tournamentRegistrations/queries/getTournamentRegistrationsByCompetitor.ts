import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { deepenTournamentRegistration, DeepTournamentRegistration } from '../_helpers/deepenTournamentRegistration';

export const getTournamentRegistrationsByCompetitorArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  activeOnly: v.optional(v.boolean()),
});

/**
 * Gets an array of deep TournamentRegistrations for the given TournamentCompetitor.
 * 
 * @param ctx - Convex query context
 * @returns An array of deep TournamentRegistrations
 */
export const getTournamentRegistrationsByCompetitor = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationsByCompetitorArgs>,
): Promise<DeepTournamentRegistration[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', args.tournamentCompetitorId))
    .collect();
  const deepTournamentRegistrations = await Promise.all(
    tournamentRegistrations.map(async (registration) => {
      if (args.activeOnly && !registration.active) {
        return null;
      } else {
        return deepenTournamentRegistration(ctx, registration);
      }
    }),
  );
  return deepTournamentRegistrations.filter(notNullOrUndefined);
};
