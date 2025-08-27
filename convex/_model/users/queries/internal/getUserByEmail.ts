import { Infer, v } from 'convex/values';

import { Doc } from '../../../../_generated/dataModel';
import { QueryCtx } from '../../../../_generated/server';

export const getUserByEmailArgs = v.object({
  email: v.string(),
});

export const getUserByEmail = async (
  ctx: QueryCtx,
  args: Infer<typeof getUserByEmailArgs>,
): Promise<Doc<'users'> | null> => await ctx.db.query('users')
  .withIndex('by_email', (q) => q.eq('email', args.email))
  .unique();
