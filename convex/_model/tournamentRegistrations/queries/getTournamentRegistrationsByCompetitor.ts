import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentRegistration, DeepTournamentRegistration } from '../_helpers/deepenTournamentRegistration';

export const getTournamentRegistrationsByCompetitorArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
});

export const getTournamentRegistrationsByCompetitor = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationsByCompetitorArgs>,
): Promise<DeepTournamentRegistration[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', args.tournamentCompetitorId))
    .collect();
  return await Promise.all(
    tournamentRegistrations.map(async (registration) => await deepenTournamentRegistration(ctx, registration)),
  );
};
