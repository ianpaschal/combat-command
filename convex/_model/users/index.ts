import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const usersTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_email', ['email'])
  .index('by_country_code', ['countryCode'])
  .index('by_name', ['givenName', 'familyName'])
  .index('by_username', ['username']);

export type UserId = Id<'users'>;

export {
  type LimitedUser,
  redactUser,
} from './_helpers/redactUser';
export {
  setUserDefaultAvatar,
  setUserDefaultAvatarArgs,
} from './actions/setUserDefaultAvatar';
export {
  updateUser,
  updateUserArgs,
} from './mutations/updateUser';
export {
  updateUserAvatarNoAuth,
  updateUserAvatarNoAuthArgs,
} from './mutations/updateUserAvatarNoAuth';
export {
  type CurrentUser,
  getCurrentUser,
} from './queries/getCurrentUser';
export {
  getUser,
  getUserArgs,
} from './queries/getUser';
export {
  getUserByEmail,
  getUserByEmailArgs,
} from './queries/getUserByEmail';
export {
  getUsers,
  getUsersArgs,
} from './queries/getUsers'; 
