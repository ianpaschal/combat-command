import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/users';

// INTERNAL
export const setUserDefaultAvatar = internalAction({
  args: model.setUserDefaultAvatarArgs,
  handler: model.setUserDefaultAvatar,
});

export const getUserByEmail = internalQuery({
  args: model.getUserByEmailArgs,
  handler: model.getUserByEmail,
});

export const getUserByClaimToken = internalQuery({
  args: model.getUserByClaimTokenArgs,
  handler: model.getUserByClaimToken,
});

export const updateUserAvatarNoAuth = internalMutation({
  args: model.updateUserAvatarNoAuthArgs,
  handler: model.updateUserAvatarNoAuth,
});

export const removeUserClaimToken = internalMutation({
  args: model.removeUserClaimTokenArgs,
  handler: model.removeUserClaimToken,
});

// PUBLIC
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
