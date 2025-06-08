import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournamentPairing = createQueryHook(api.tournamentPairings.getTournamentPairing);
export const useGetTournamentPairings = createQueryHook(api.tournamentPairings.getTournamentPairings);

// Special Queries
export const useGetActiveTournamentPairingsByUser = createQueryHook(api.tournamentPairings.getActiveTournamentPairingsByUser);
export const useGetDraftTournamentPairings = createQueryHook(api.tournamentPairings.getDraftTournamentPairings);
