import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const userPreferencesTable = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_user_id', ['userId'],
);

export {
  setUserPreferences,
  setUserPreferencesArgs,
} from './mutations';
export {
  getUserPreferences,
} from './queries';
