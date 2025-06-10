import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { TournamentPhase, tournamentPhase } from '../../../static/tournamentPhases';
import { getTournamentShallow } from '../../tournaments';
import { convertRoundStructureToMs } from '../_helpers/convertRoundStructureToMs';
import { getTournamentTimerShallow } from '../_helpers/getTournamentTimerShallow';

export const setTournamentTimerPhaseArgs = v.object({
  id: v.id('tournamentTimers'),
  phase: tournamentPhase,
});

export const setTournamentTimerPhase = async (
  ctx: MutationCtx,
  args: Infer<typeof setTournamentTimerPhaseArgs>,
): Promise<void> => {
  const timer = await getTournamentTimerShallow(ctx, args.id);
  const tournament = await getTournamentShallow(ctx, timer.tournamentId);
  const roundStructure = convertRoundStructureToMs(tournament.roundStructure);
  const startingTimeStamps: Record<TournamentPhase, number> = {
    'completed': roundStructure.pairingTime + roundStructure.setUpTime + roundStructure.playingTime,
    'playing': roundStructure.pairingTime + roundStructure.setUpTime,
    'setUp': roundStructure.pairingTime ,
    'pairing': 0,
  };
  const newCurrentTime = startingTimeStamps[args.phase];
  return await ctx.db.patch(timer._id, {
    startedAt: Date.now() - newCurrentTime,
    pausedAt: Date.now(),
    pauseTime: 0,
  });
};
