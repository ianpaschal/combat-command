import { mutation, query } from './_generated/server';
import * as model from './_model/matchResultComments';

export const getMatchResultComment = query({
  args: model.getMatchResultCommentArgs,
  handler: model.getMatchResultComment,
});

export const getMatchResultCommentsByMatchResult = query({
  args: model.getMatchResultCommentsByMatchResultArgs,
  handler: model.getMatchResultCommentsByMatchResult,
});

export const getMatchResultCommentsByUser = query({
  args: model.getMatchResultCommentsByUserArgs,
  handler: model.getMatchResultCommentsByUser,
});

export const addMatchResultComment = mutation({
  args: model.addMatchResultCommentArgs,
  handler: model.addMatchResultComment,
});
