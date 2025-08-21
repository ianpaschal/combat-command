import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentRegistration, DeepTournamentRegistration } from '../_helpers/deepenTournamentRegistration';

export const getTournamentRegistrationsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getTournamentRegistrationsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationsByTournamentArgs>,
): Promise<DeepTournamentRegistration[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  return await Promise.all(
    tournamentRegistrations.map(async (registration) => await deepenTournamentRegistration(ctx, registration)),
  );
};
