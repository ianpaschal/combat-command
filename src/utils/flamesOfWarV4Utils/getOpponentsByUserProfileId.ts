import { MatchResultFilterableRow } from '~/types/db';

/**
 * Returns all opponent User Profile UUIDs for a given User Profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param userProfileId - The User Profile UUID
 * @returns The opponent User Profile UUIDs
 */
export const getOpponentsByUserProfileId = (
  matchResults: MatchResultFilterableRow[],
  userProfileId: string,
): string[] => (
  matchResults.reduce((acc, match) => [
    ...acc,
    ...[match.player_0.user_profile.id, match.player_1.user_profile.id].filter((id) => id !== userProfileId),
  ], [] as string[])
);
