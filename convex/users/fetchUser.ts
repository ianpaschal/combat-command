import { v } from 'convex/values';

import { getAvatarUrl } from './utils/getAvatarUrl';
import { getLimitedUser } from './utils/getLimitedUser';
import { query } from '../_generated/server';

export const fetchUser = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, { id }) => {
    const user = await getLimitedUser(ctx, id);
    if (!user) {
      return null;
    }
    const avatarUrl = await getAvatarUrl(ctx, user.avatarStorageId);
    return {
      ...user,
      avatarUrl,
    };
  },
});
