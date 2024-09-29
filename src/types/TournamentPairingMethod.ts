import { z } from 'zod';

export const tournamentPairingMethodSchema = z.union([
  z.literal('swiss'),
  z.literal('round_robin'),
  z.literal('swiss_groups'),
]);

export type TournamentPairingMethod = z.infer<typeof tournamentPairingMethodSchema>;
