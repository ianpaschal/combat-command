import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const userPreferencesSchema = z.object({
  user_id: z.string(),
  language_code: z.string(),
  color_scheme: z.string(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema> ;

export type UserPreferencesRecord = DbRecord & UserPreferences;