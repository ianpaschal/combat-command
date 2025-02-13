import { FetchMatchResultResponse } from '~/services/matchResults/fetchMatchResultBaseQuery';

/**
 * Returns all opponent profile UUIDs for a given user profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param userProfileId - The user profile UUID
 * @returns The opponent profile UUIDs
 */
export const getOpponentsByUserProfileId = (
  matchResults: FetchMatchResultResponse[],
  userProfileId: string,
): string[] => (
  matchResults.reduce((acc, match) => [
    ...acc,
    ...[match.player_0.user_profile.id, match.player_1.user_profile.id].filter((id) => id !== userProfileId),
  ], [] as string[])
);
