import { z } from 'zod';

export const tournamentPairingMethodSchema = z.union([
  z.literal('swiss'),
  z.literal('roundRobin'),
  z.literal('swissGroups'),
  z.literal('random'),
  z.literal('elimination'),
]);

export type TournamentPairingMethod = z.infer<typeof tournamentPairingMethodSchema>;
