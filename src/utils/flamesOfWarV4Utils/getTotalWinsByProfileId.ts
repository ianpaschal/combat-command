import { MatchDeep } from '~/types/db/Matches';

/**
 * Returns the total number of wins by a given profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The profile UUID
 * @returns The total number of wins
 */
export const getTotalWinsByProfileId = (
  matches: MatchDeep[],
  profileId: string,
): number => (
  matches.reduce((acc, match) => {
    const playerIndex = [match.player_0, match.player_1].findIndex((player) => player.profile.id === profileId);
    if (match.outcome.winner === playerIndex) {
      acc += 1;
    }
    return acc;
  }, 0)
);
