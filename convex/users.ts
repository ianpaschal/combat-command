import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from './_generated/server';
import * as model from './_model/users';
import { mutationWithTrigger } from './functions';

// INTERNAL
export const setUserDefaultAvatar = internalAction({
  args: model.setUserDefaultAvatarArgs,
  handler: model.setUserDefaultAvatar,
});

export const addContactToResend = internalAction({
  args: model.addContactToResendArgs,
  handler: model.addContactToResend,
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

export const updateUserClaimToken = internalMutation({
  args: model.updateUserClaimTokenArgs,
  handler: model.updateUserClaimToken,
});

export const deleteUserClaimToken = internalMutation({
  args: model.deleteUserClaimTokenArgs,
  handler: model.deleteUserClaimToken,
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

export const updateUser = mutationWithTrigger({
  args: model.updateUserArgs,
  handler: model.updateUser,
});

export const inviteUser = action({
  args: model.inviteUserArgs,
  handler: model.inviteUser,
});

export const claimUser = action({
  args: model.claimUserArgs,
  handler: model.claimUser,
});
