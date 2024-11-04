import { MatchResultDeep } from '~/types/db';

/**
 * Returns all opponent user IDs for a given user within a set of match results.
 *
 * @param matchResults - The array of match results to include in the calculation
 * @param userId - The user UUID
 * @returns The opponent user IDs
 */
export const getOpponentUserIdsByUser = (matchResults: MatchResultDeep[], userId: string): string[] => (
  matchResults.reduce((acc, result) => [
    ...acc,
    ...result.players.filter(
      (player) => player.user_id !== userId,
    ).map(
      (opponent) => opponent.user_id,
    ),
  ], [] as string[])
);
