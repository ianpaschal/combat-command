import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { VisibilityLevel } from '../../common/VisibilityLevel';
import { checkUserTournamentRelationship } from './checkUserTournamentRelationship';

export const checkUserRelationshipLevel = async (
  ctx: QueryCtx,
  user: Doc<'users'>,
  queryUserId?: Id<'users'> | null,
): Promise<VisibilityLevel> => {
  const userId = queryUserId ?? await getAuthUserId(ctx);

  // RETURN CLOSEST RELATIONSHIPS FIRST!

  // 0 - Hidden
  const isSelf = userId === user._id;
  if (isSelf) {
    return VisibilityLevel.Hidden;
  }

  // 1 - Friends
  const hasFriendRelationship = false;
  if (hasFriendRelationship) {
    return VisibilityLevel.Friends;
  }

  // 2 - Club
  const hasClubsRelationship = false;
  if (hasClubsRelationship) {
    return VisibilityLevel.Clubs;
  }

  // 3 - Tournaments
  const hasTournamentRelationship = await checkUserTournamentRelationship(ctx, userId, user._id);
  if (hasTournamentRelationship) {
    return VisibilityLevel.Tournaments;
  }

  // 4 - Community
  if (userId) {
    return VisibilityLevel.Community;
  }

  // 5 - Public
  return VisibilityLevel.Public;
};
