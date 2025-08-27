import { Id } from '../../_generated/dataModel';

export type FriendshipId = Id<'friendships'>;

export {
  deepenFriendship,
  type DeepFriendship,
} from './_helpers/deepenFriendship';
export {
  confirmFriendship,
  confirmFriendshipArgs,
} from './mutations/confirmFriendship';
export {
  createFriendship,
  createFriendshipArgs,
} from './mutations/createFriendship';
export {
  deleteFriendship,
  deleteFriendshipArgs,
} from './mutations/deleteFriendship';
export {
  getFriendship,
  getFriendshipArgs,
} from './queries/getFriendship';
export {
  getFriendshipsByUser,
  getFriendshipsByUserArgs,
} from './queries/getFriendshipsByUser';
