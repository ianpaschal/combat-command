import { Infer, v } from 'convex/values';

export const tournamentPairingMethod = v.union(
  v.literal('elimination'),
  v.literal('random'),
  v.literal('roundRobin'),
  v.literal('swiss'), 
);
export type TournamentPairingMethod = Infer<typeof tournamentPairingMethod>;
