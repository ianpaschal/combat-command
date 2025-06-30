import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { checkUserTournamentForcedName } from './checkUserTournamentForcedName';
import { checkUserTournamentRelationship } from './checkUserTournamentRelationship';

/**
 * User with some personal information hidden based on their preferences.
 */
export type LimitedUser = Omit<Doc<'users'>, 'givenName' | 'familyName' | 'countryCode'> & {
  givenName?: string;
  familyName?: string;
  countryCode?: string;
  avatarUrl?: string;
};

/**
 * Removes a users's real name or location based on their preferences, also adds avatarUrl.
 * 
 * @remarks
 * This is essentially the user equivalent to the deepen[Resource]() pattern.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw user document
 * @returns A limited user
 */
export const redactUser = async (
  ctx: QueryCtx,
  user: Doc<'users'>,
): Promise<LimitedUser> => {
  const userId = await getAuthUserId(ctx);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { givenName, familyName, countryCode, ...restFields } = user;
  const avatarUrl = await getStorageUrl(ctx, user.avatarStorageId);

  const limitedUser: LimitedUser = {
    ...restFields,
    avatarUrl,
  };

  // If user is querying own profile, simply return it
  if (userId === user._id) {
    return { ...user, avatarUrl };
  }

  // If user is querying someone they are in a friendship or club with
  const hasFriendRelationship = false;

  // If user is querying someone they are in a tournament with
  const hasTournamentRelationship = await checkUserTournamentRelationship(ctx, userId, user._id);


  // If user is querying someone they are in a tournament with which requires real names
  const requiredByTournament = await checkUserTournamentForcedName(ctx, userId, user._id);

  // Add name information if allowed
  if (
    (user?.nameVisibility === 'public') ||
    (user?.nameVisibility === 'friends' && hasFriendRelationship) ||
    (user?.nameVisibility === 'tournaments' && (hasFriendRelationship || hasTournamentRelationship)) ||
    requiredByTournament
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
