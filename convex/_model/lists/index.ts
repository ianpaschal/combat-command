import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const listsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_owner_user_id', ['ownerUserId']);

export type ListId = Id<'lists'>;

export {
  importListData,
  importListDataArgs,
} from './mutations/importListData';
export {
  getList,
  getListArgs,
} from './queries/getList';
