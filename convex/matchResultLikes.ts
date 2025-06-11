import { mutation, query } from './_generated/server';
import * as model from './_model/matchResultLikes';

export const getMatchResultLike = query({
  args: model.getMatchResultLikeArgs,
  handler: model.getMatchResultLike,
});

export const getMatchResultLikesByMatchResult = query({
  args: model.getMatchResultLikesByMatchResultArgs,
  handler: model.getMatchResultLikesByMatchResult,
});

export const getMatchResultLikesByUser = query({
  args: model.getMatchResultLikesByUserArgs,
  handler: model.getMatchResultLikesByUser,
});

export const toggleMatchResultLike = mutation({
  args: model.toggleMatchResultLikeArgs,
  handler: model.toggleMatchResultLike,
});
