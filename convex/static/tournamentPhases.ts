import { Infer, v } from 'convex/values';

export const tournamentPhases = [
  'pairing',
  'setUp',
  'playing',
  'completed',
] as const;

export const tournamentPhase = v.union(...tournamentPhases.map(v.literal));

export type TournamentPhase = Infer<typeof tournamentPhase>;
