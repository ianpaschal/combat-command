import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const forceListSchema = z.object({
  game_system_id: z.string(),
  data: z.unknown(), // TODO: Type later
});

export type ForceList = z.infer<typeof forceListSchema>;

export type ListRecord = ForceList & DbRecord;
