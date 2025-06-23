import {
  action,
  internalMutation,
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

export const getUsers = query({
  args: model.getUsersArgs,
  handler: model.getUsers,
});

export const updateUser = mutation({
  args: model.updateUserArgs,
  handler: model.updateUser,
});
