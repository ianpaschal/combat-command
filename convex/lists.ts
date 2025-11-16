import {
  action,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/lists';

export const importList = action({
  args: model.importListArgs,
  handler: model.importList,
});

export const extractListData = action({
  args: model.extractListDataArgs,
  handler: model.extractListData,
});

export const createList = mutation({
  args: model.createListArgs,
  handler: model.createList,
});

export const getList = query({
  args: model.getListArgs,
  handler: model.getList,
});
