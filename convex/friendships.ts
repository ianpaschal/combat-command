import { mutation, query } from './_generated/server';
import * as model from './_model/friendships';

export const getFriendship = query({
  args: model.getFriendshipArgs,
  handler: model.getFriendship,
});

export const getFriendshipsByUser = query({
  args: model.getFriendshipsByUserArgs,
  handler: model.getFriendshipsByUser,
});

export const createFriendship = mutation({
  args: model.createFriendshipArgs,
  handler: model.createFriendship,
});

export const confirmFriendship = mutation({
  args: model.confirmFriendshipArgs,
  handler: model.confirmFriendship,
});

export const deleteFriendship = mutation({
  args: model.deleteFriendshipArgs,
  handler: model.deleteFriendship,
});
