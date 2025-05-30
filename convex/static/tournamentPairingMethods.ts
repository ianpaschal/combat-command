import { Infer, v } from 'convex/values';

export const tournamentPairingMethods = [
  'adjacent', // Replacement for Swiss
  // 'round_robin', // Random, but will trigger validation error if rounds and competitors don't match
  // 'swiss_groups',
  'random',
  // 'elimination', // Will trigger validation error if rounds and competitors don't match
] as const;

export const tournamentPairingMethod = v.union(...tournamentPairingMethods.map(v.literal));

export type TournamentPairingMethod = Infer<typeof tournamentPairingMethod>;

// TODO: Move to front-end to enable translations
export const tournamentPairingMethodDisplayNames: Record<TournamentPairingMethod, string> = {
  'adjacent': 'Adjacent',
  'random': 'Random',
};

// TODO: Move to front-end to enable translations
export const tournamentPairingMethodOptions = tournamentPairingMethods.map((key) => ({
  value: key,
  label: tournamentPairingMethodDisplayNames[key],
}));
