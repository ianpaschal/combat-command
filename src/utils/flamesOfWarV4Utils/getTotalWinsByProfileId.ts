import { MatchResultDeep } from '~/types/db';

/**
 * Returns the total number of wins by a given profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The profile UUID
 * @returns The total number of wins
 */
export const getTotalWinsByProfileId = (
  matchResults: MatchResultDeep[],
  profileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    const playerIndex = [result.player_0, result.player_1].findIndex((player) => player.profile.id === profileId);
    if (result.outcome.winner === playerIndex) {
      acc += 1;
    }
    return acc;
  }, 0)
);
