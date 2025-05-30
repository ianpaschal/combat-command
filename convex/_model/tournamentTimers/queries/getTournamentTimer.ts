import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getTournamentTimerStrict } from '../_helpers/getTournamentTimerStrict';

export const getTournamentTimerArgs = v.object({
  tournamentId: v.id('tournaments'),
});

/**
 * Gets a tournament document which must exist.
 * An error will be thrown if it does not exist.
 * 
 * @param ctx 
 * @param id 
 * @returns 
 */
export const getTournamentTimer = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentTimerArgs>,
) => await getTournamentTimerStrict(ctx, args.tournamentId);
