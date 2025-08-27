import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/users';

// INTERNAL MUTATIONS
export const updateUserAvatarNoAuth = internalMutation({
  args: model.updateUserAvatarNoAuthArgs,
  handler: model.updateUserAvatarNoAuth,
});

export const setUserDefaultAvatar = action({
  args: model.setUserDefaultAvatarArgs,
  handler: model.setUserDefaultAvatar,
});

export const getCurrentUser = query({
  handler: model.getCurrentUser,
});

export const getUser = query({
  args: model.getUserArgs,
  handler: model.getUser,
});

export const getUserByEmail = query({
  args: model.getUserByEmailArgs,
  handler: model.getUserByEmail,
});

export const getUserByEmailInternal = internalQuery({
  args: model.getUserByEmailArgs,
  handler: async (ctx, args) => (
    await ctx.db.query('users').withIndex('by_email', (q) => q.eq('email', args.email)).unique()
  ),
});

export const getUsers = query({
  args: model.getUsersArgs,
  handler: model.getUsers,
});

export const updateUser = mutation({
  args: model.updateUserArgs,
  handler: model.updateUser,
});
