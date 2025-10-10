import { TournamentRoundPhase } from '@ianpaschal/combat-command-game-systems/common';
import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';
import { getTournamentShallow } from '../../tournaments';
import { convertRoundStructureToMs } from '../_helpers/convertRoundStructureToMs';
import { getTournamentTimerShallow } from '../_helpers/getTournamentTimerShallow';

export const tournamentRoundPhase = getStaticEnumConvexValidator(TournamentRoundPhase);

export const setTournamentTimerPhaseArgs = v.object({
  id: v.id('tournamentTimers'),
  phase: tournamentRoundPhase,
});

export const setTournamentTimerPhase = async (
  ctx: MutationCtx,
  args: Infer<typeof setTournamentTimerPhaseArgs>,
): Promise<void> => {
  const timer = await getTournamentTimerShallow(ctx, args.id);
  const tournament = await getTournamentShallow(ctx, timer.tournamentId);
  const roundStructure = convertRoundStructureToMs(tournament.roundStructure);
  const startingTimeStamps: Record<TournamentRoundPhase, number> = {
    [TournamentRoundPhase.Completed]: roundStructure.pairingTime + roundStructure.setUpTime + roundStructure.playingTime,
    [TournamentRoundPhase.Playing]: roundStructure.pairingTime + roundStructure.setUpTime,
    [TournamentRoundPhase.SetUp]: roundStructure.pairingTime ,
    [TournamentRoundPhase.Pairing]: 0,
  };
  const newCurrentTime = startingTimeStamps[args.phase];
  return await ctx.db.patch(timer._id, {
    startedAt: Date.now() - newCurrentTime,
    pausedAt: Date.now(),
    pauseTime: 0,
  });
};
