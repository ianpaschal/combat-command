import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const tournamentPlayerSchema = z.object({
  tournament_competitor_id: z.string().uuid(),
  user_id: z.string().uuid(),
  list_id: z.string().uuid(),
  country_code: z.optional(z.string()),
  team_name: z.optional(z.string()),
});

export type TournamentPlayer = z.infer<typeof tournamentPlayerSchema>;

export type TournamentPlayerRecord = TournamentPlayer & DbRecord;
