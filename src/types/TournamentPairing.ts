import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const tournamentPairingSchema = z.object({
  tournament_id: z.string().uuid(),
  competitor_0_id: z.string().uuid(),
  competitor_1_id: z.string().uuid(),
  round_index: z.number().min(0),
  table_index: z.number().min(0),
});

export type TournamentPairing = z.infer<typeof tournamentPairingSchema>;

export type TournamentPairingRecord = TournamentPairing & DbRecord;