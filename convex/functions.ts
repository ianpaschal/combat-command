import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';
import { Triggers } from 'convex-helpers/server/triggers';

import { DataModel } from './_generated/dataModel';
import { mutation as convexMutation } from './_generated/server';
import { extractSearchTokens } from './_model/users/_helpers/extractSearchTokens';

const triggers = new Triggers<DataModel>();

// Custom mutation function that triggers can subscribe to (use instead of Convex mutation): 
export const mutation = customMutation(convexMutation, customCtx(triggers.wrapDB));

triggers.register('users', async (ctx, change) => {
  if (change.newDoc) {
    const search = extractSearchTokens(change.newDoc);
    if (change.newDoc.search !== search) {
      await ctx.db.patch(change.id, { search });
    }
  }
});
