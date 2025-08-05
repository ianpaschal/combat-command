import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { UserDataVisibilityLevel } from '../../../common/userDataVisibilityLevel';
import { checkUserTournamentRelationship } from './checkUserTournamentRelationship';

export const checkUserRelationshipLevel = async (
  ctx: QueryCtx,
  user: Doc<'users'>,
  queryUserId?: Id<'users'> | null,
): Promise<UserDataVisibilityLevel> => {
  const userId = queryUserId ?? await getAuthUserId(ctx);

  // RETURN CLOSEST RELATIONSHIPS FIRST!

  // 0 - Hidden
  const isSelf = userId === user._id;
  if (isSelf) {
    return 'hidden';
  }

  // 1 - Friends
  const hasFriendRelationship = false;
  if (hasFriendRelationship) {
    return 'friends';
  }

  // 2 - Club
  const hasClubsRelationship = false;
  if (hasClubsRelationship) {
    return 'clubs';
  }

  // 3 - Tournaments
  const hasTournamentRelationship = await checkUserTournamentRelationship(ctx, userId, user._id);
  if (hasTournamentRelationship) {
    return 'tournaments';
  }

  // 4 - Community
  if (userId) {
    return 'community';
  }

  // 5 - Public
  return 'public';
};
