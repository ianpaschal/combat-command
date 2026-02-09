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
export const useGetDraftTournamentPairings = createQueryHook(api.tournamentPairings.getDraftTournamentPairings);

// Mutations
export const useCreateTournamentPairings = createMutationHook(api.tournamentPairings.createTournamentPairings);

// Actions
export const useGenerateDraftTournamentPairings = createActionHook(api.tournamentPairings.generateDraftTournamentPairings);
export const useGenerateTableAssignments = createActionHook(api.tournamentPairings.generateTableAssignments);
