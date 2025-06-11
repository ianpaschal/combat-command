import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const fields = {
  matchResultId: v.id('matchResults'),
};

export const matchResultLikesTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_user_id', ['userId'])
  .index('by_match_result_id', ['matchResultId'])
  .index('by_user_id_match_result_id', ['userId', 'matchResultId']);

export type MatchResultLikeId = Id<'matchResultLikes'>;

// Helpers
export {
  deepenMatchResultLike,
  type DeepMatchResultLike,
} from './_helpers/deepenMatchResultLike';

// Mutations
export {
  toggleMatchResultLike,
  toggleMatchResultLikeArgs,
} from './mutations/toggleMatchResultLike';

// Queries
export {
  getMatchResultLike,
  getMatchResultLikeArgs,
} from './queries/getMatchResultLike';
export {
  getMatchResultLikesByMatchResult,
  getMatchResultLikesByMatchResultArgs,
} from './queries/getMatchResultLikesByMatchResult';
export {
  getMatchResultLikesByUser,
  getMatchResultLikesByUserArgs,
} from './queries/getMatchResultLikesByUser';
