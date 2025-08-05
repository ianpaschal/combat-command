import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { checkUserRelationshipLevel } from './checkUserRelationshipLevel';
import { compareVisibilityLevels } from './compareVisibilityLevels';
import { formatUserRealName } from './formatUserRealName';

/**
 * User with some personal information hidden based on their preferences.
 */
export type LimitedUser = Pick<Doc<'users'>, '_id' | 'username'> & {
  avatarUrl?: string;
  countryCode?: string;
  displayName: string;
};

/**
 * Removes a users's real name or location based on their preferences, also adds avatarUrl and displayName.
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
  const { givenName, familyName, countryCode, email, ...restFields } = user;
  const avatarUrl = await getStorageUrl(ctx, user.avatarStorageId);

  // If user is querying own profile, simply return it
  if (userId === user._id) {
    return {
      ...user,
      avatarUrl,
      displayName: formatUserRealName(user),
    };
  }

  // Otherwise check for relationships:
  const relationshipLevel = await checkUserRelationshipLevel(ctx, user, userId);

  const nameVisible = compareVisibilityLevels(user?.nameVisibility ?? 'hidden', relationshipLevel);
  const locationVisible = compareVisibilityLevels(user?.locationVisibility ?? 'hidden', relationshipLevel);

  return {
    ...restFields,
    avatarUrl,
    displayName: nameVisible ? formatUserRealName(user) : user.username ?? 'Ghost',
    countryCode: locationVisible ? user.countryCode : undefined,
  };
};
