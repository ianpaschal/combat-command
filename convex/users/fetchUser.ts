import { v } from 'convex/values';

import { getLimitedUser } from './utils/getLimitedUser';
import { query } from '../_generated/server';

export const fetchUser = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, { id }) => await getLimitedUser(ctx, id),
});
