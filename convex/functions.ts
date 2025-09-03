import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';
import { Triggers } from 'convex-helpers/server/triggers';

import { DataModel, Doc } from './_generated/dataModel';
import { mutation as convexMutation } from './_generated/server';

const triggers = new Triggers<DataModel>();

// Custom mutation function that triggers can subscribe to (use instead of Convex mutation): 
export const mutation = customMutation(convexMutation, customCtx(triggers.wrapDB));

const userSearchFieldKeys: (keyof Doc<'users'>)[] = [
  'givenName',
  'familyName',
  'username',
] as const;
triggers.register('users', async (ctx, change) => {
  if (change.newDoc) {
    const search = userSearchFieldKeys.map((key) => change.newDoc[key]).join(' ');
    if (change.newDoc.search !== search) {
      await ctx.db.patch(change.id, { search });
    }
  }
});
