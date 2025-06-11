import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const matchResultCommentsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_user_id', ['userId'])
  .index('by_match_result_id', ['matchResultId']);

export type MatchResultCommentId = Id<'matchResultComments'>;
  
// Helpers
export {
  deepenMatchResultComment,
  type DeepMatchResultComment,
} from './_helpers/deepenMatchResultComment';
  
// Mutations
export {
  addMatchResultComment,
  addMatchResultCommentArgs,
} from './mutations/addMatchResultComment';
  
// Queries
export {
  getMatchResultComment,
  getMatchResultCommentArgs,
} from './queries/getMatchResultComment';
export {
  getMatchResultCommentsByMatchResult,
  getMatchResultCommentsByMatchResultArgs,
} from './queries/getMatchResultCommentsByMatchResult';
export {
  getMatchResultCommentsByUser,
  getMatchResultCommentsByUserArgs,
} from './queries/getMatchResultCommentsByUser';
