import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { checkUserTournamentRelationship } from './checkUserTournamentRelationship';

export const getLimitedUser = async (ctx: QueryCtx, user: Doc<'users'>) => {
  const queryingUserId = await getAuthUserId(ctx);

  const { givenName, familyName, countryCode, ...restFields } = user;

  const limitedUser: Doc<'users'> = restFields;

  // If user is querying own profile, simply return it
  if (queryingUserId === user._id) {
    return user;
  }

  // If user is querying someone they are in a friendship or club with
  const hasFriendRelationship = false;

  // If user is querying someone they are in a tournament with
  const hasTournamentRelationship = (queryingUserId && limitedUser?._id) ? await checkUserTournamentRelationship(ctx, {
    queryingUserId,
    evaluatingUserId: user._id,
  }) : false;

  // Add name information if allowed
  if (
    (user?.nameVisibility === 'public') ||
    (user?.nameVisibility === 'friends' && hasFriendRelationship) ||
    (user?.nameVisibility === 'tournaments' && (hasFriendRelationship || hasTournamentRelationship))
  ) {
    limitedUser.givenName = user.givenName;
    limitedUser.familyName = user.familyName;
  }

  // Add location information if allowed
  if (
    (user?.locationVisibility === 'public') ||
    (user?.locationVisibility === 'friends' && hasFriendRelationship) ||
    (user?.locationVisibility === 'tournaments' && (hasFriendRelationship || hasTournamentRelationship))
  ) {
    limitedUser.countryCode = user.countryCode;
  }

  return limitedUser;
};
