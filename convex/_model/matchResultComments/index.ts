import { Id } from '../../_generated/dataModel';

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
