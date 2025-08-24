import { mutation, query } from './_generated/server';
import * as model from './_model/userPreferences';

export const getUserPreferences = query({
  handler: model.getUserPreferences,
});

export const setUserPreferences = mutation({
  args: model.setUserPreferencesArgs,
  handler: model.setUserPreferences,
});
