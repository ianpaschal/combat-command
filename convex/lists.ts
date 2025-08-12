import { mutation } from './_generated/server';
import * as model from './_model/lists';

export const importListData = mutation({
  args: model.importListDataArgs,
  handler: model.importListData,
});
