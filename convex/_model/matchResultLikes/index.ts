import { Id } from '../../_generated/dataModel';

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
