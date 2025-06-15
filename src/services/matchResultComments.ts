import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetMatchResultComment = createQueryHook(api.matchResultComments.getMatchResultComment);

// Special Queries
export const useGetMatchResultCommentsByMatchResult = createQueryHook(api.matchResultComments.getMatchResultCommentsByMatchResult);
export const useGetMatchResultCommentsByUser = createQueryHook(api.matchResultComments.getMatchResultCommentsByUser);

// Basic (C_UD) Mutations
export const useAddMatchResultComment = createMutationHook(api.matchResultComments.addMatchResultComment);
