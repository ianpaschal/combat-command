import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentShallow } from '../../tournaments';

/**
 * Deepens a TournamentTimer by adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep TournamentTimer.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw TournamentTimer document
 * @returns A deep TournamentTimer
 */
export const deepenTournamentTimer = async (
  ctx: QueryCtx,
  timer: Doc<'tournamentTimers'>,
) => {
  const { roundStructure } = await getTournamentShallow(ctx, timer.tournamentId);

  // Convert the round structure to milliseconds
  const roundStructureMs = Object.entries(roundStructure).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value * 60000,
  }), {} as { [key: string]: number });

  const total = Object.values(roundStructureMs).reduce((acc, value) => acc + value, 0);
  const now = Date.now();
  const elapsed = timer.startedAt ? ((timer.pausedAt ?? now) - timer.startedAt) - timer.pauseTime : 0;
  const remaining = total - elapsed;
  const endsAt = timer.pausedAt ? null : now + remaining;

  return {
    ...timer,
    total,
    elapsed,
    remaining,
    endsAt,
  };
};

/**
 * Deep TournamentTimer with additional computed fields.
 */
export type TournamentTimerDeep = Awaited<ReturnType<typeof deepenTournamentTimer>>;
