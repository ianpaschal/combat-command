import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetMatchResult = createQueryHook(api.matchResults.fetchMatchResult.fetchMatchResult);
export const useGetMatchResults = createQueryHook(api.matchResults.fetchMatchResultList.fetchMatchResultList);

// Basic (C_UD) Mutations
export const useCreateMatchResult = createMutationHook(api.matchResults.mutations.createMatchResult);
export const useUpdateMatchResult = createMutationHook(api.matchResults.mutations.updateMatchResult);
export const useDeleteMatchResult = createMutationHook(api.matchResults.mutations.deleteMatchResult);

// Special Mutations
export const useRemoveUserFromMatchResult = createMutationHook(api.matchResults.mutations.removeUserFromMatchResult);
