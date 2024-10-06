import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const tournamentCompetitorSchema = z.object({
  tournament_id: z.string().uuid(),
  user_ids: z.array(z.string().uuid()),
  list_ids: z.array(z.string().uuid()),
  country_code: z.optional(z.string()),
  team_name: z.optional(z.string()),
});

export type TournamentCompetitor = z.infer<typeof tournamentCompetitorSchema>;

export type TournamentCompetitorRecord = TournamentCompetitor & DbRecord;