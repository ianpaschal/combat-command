import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournamentPairing = createQueryHook(api.tournamentPairings.getTournamentPairing);

// Special Queries
export const useGetActiveTournamentPairingsByUser = createQueryHook(api.tournamentPairings.getActiveTournamentPairingsByUser);
