import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';

export const tournamentPairingSchema = z.object({
  tournament_id: z.string().uuid(),
  round: z.number().min(0),
  table: z.number().min(0),
  competitor_ids: z.array(z.string().uuid()).min(2).max(2),
});

export type TournamentPairing = z.infer<typeof tournamentPairingSchema>;

export type TournamentPairingRecord = TournamentPairing & DbRecord;

