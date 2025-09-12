import { api } from '~/api';
import {
  createActionHook,
  createMutationHook,
  createQueryHook,
} from '~/services/utils';

// Basic Queries
export const useGetTournamentPairing = createQueryHook(api.tournamentPairings.getTournamentPairing);
export const useGetTournamentPairings = createQueryHook(api.tournamentPairings.getTournamentPairings);

// Special Queries
export const useGetActiveTournamentPairingsByUser = createQueryHook(api.tournamentPairings.getActiveTournamentPairingsByUser);
export const useGenerateDraftTournamentPairings = createActionHook(api.tournamentPairings.generateDraftTournamentPairings);

// Mutations
export const useCreateTournamentPairings = createMutationHook(api.tournamentPairings.createTournamentPairings);
