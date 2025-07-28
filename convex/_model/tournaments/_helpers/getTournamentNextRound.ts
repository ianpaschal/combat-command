import { Doc } from '../../../_generated/dataModel';

/**
 * Gets the next round of a tournament.
 * 
 * @param tournament - Raw Tournament document
 * @returns The next round if there will be one, otherwise undefined
 */
export const getTournamentNextRound = (
  tournament: Doc<'tournaments'>,
): number | undefined => {
  const nextRound = (tournament.currentRound ?? tournament.lastRound ?? -1) + 1;
  return nextRound < tournament.roundCount ? nextRound : undefined;
};
