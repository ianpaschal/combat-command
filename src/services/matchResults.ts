import { api } from '~/api';
import {
  createMutationHook,
  createPaginatedQueryHook,
  createQueryHook,
} from '~/services/utils';

// Basic Queries
export const useGetMatchResult = createQueryHook(api.matchResults.getMatchResult);
export const useGetMatchResults = createPaginatedQueryHook(api.matchResults.getMatchResults);

// Special Queries
export const useGetMatchResultsByTournament = createQueryHook(api.matchResults.getMatchResultsByTournament);
export const useGetMatchResultsByTournamentPairing = createQueryHook(api.matchResults.getMatchResultsByTournamentPairing);
export const useGetMatchResultsByTournamentRound = createQueryHook(api.matchResults.getMatchResultsByTournamentRound);
export const useGetMatchResultsByUser = createPaginatedQueryHook(api.matchResults.getMatchResultsByUser);

// Basic (C_UD) Mutations
export const useCreateMatchResult = createMutationHook(api.matchResults.createMatchResult);
export const useUpdateMatchResult = createMutationHook(api.matchResults.updateMatchResult);
export const useDeleteMatchResult = createMutationHook(api.matchResults.deleteMatchResult);

// Special Mutations
export const useAddPhotoToMatchResult = createMutationHook(api.matchResults.addPhotoToMatchResult);
