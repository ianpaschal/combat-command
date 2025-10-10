import { AnyBaseStats, TournamentCompetitorRanked } from '../../common/types';

/**
 * Assigns a bye to the lowest-ranked TournamentCompetitor within a set of TournamentCompetitors.
 * 
 * @param competitors - Array of ranked TournamentCompetitors
 * @returns A tuple containing the TournamentCompetitor to receive a bye, and all remaining ranked TournamentCompetitors.
 */
export const assignBye = <TBaseStats extends AnyBaseStats>(
  competitors: TournamentCompetitorRanked<TBaseStats>[],
): [TournamentCompetitorRanked<TBaseStats> | null, TournamentCompetitorRanked<TBaseStats>[]] => {

  // Ensure competitors are ranked:
  const rankedCompetitors = [ ...competitors ].sort((a, b) => a.rank - b.rank);

  // If there is no need for a bye, skip the process entirely:
  if (rankedCompetitors.length % 2 === 0) {
    return [ null, competitors ];
  }

  // Find the lowest-ranked competitor who hasn't yet received a bye:
  let byeIndex = -1;
  for (let i = rankedCompetitors.length - 1; i >= 0; --i) {
    if (rankedCompetitors[i].byeRounds.length === 0) {
      byeIndex = i;
      break;
    }
  }

  // If all competitors have already received a bye, select the lowest-ranked competitor:
  if (byeIndex === -1) {
    byeIndex = rankedCompetitors.length - 1;
  }

  const byeCompetitor = rankedCompetitors[byeIndex];  
  return [
    byeCompetitor,

    // Return the input competitors, in their original order, albeit without the bye competitor:
    competitors.filter((c) => c.id !== byeCompetitor.id),
  ];
};
