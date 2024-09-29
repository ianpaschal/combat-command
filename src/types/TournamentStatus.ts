import { z } from 'zod';

export const tournamentStatusSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('active'),
  z.literal('archived'),
]);

export type TournamentStatus = z.infer<typeof tournamentStatusSchema>;

