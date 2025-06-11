import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetMatchResultLike = createQueryHook(api.matchResultLikes.getMatchResultLike);

// Special Queries
export const useGetMatchResultLikesByMatchResult = createQueryHook(api.matchResultLikes.getMatchResultLikesByMatchResult);
export const useGetMatchResultLikesByUser = createQueryHook(api.matchResultLikes.getMatchResultLikesByUser);

// Special Mutations
export const useToggleMatchResultLike = createMutationHook(api.matchResultLikes.toggleMatchResultLike);
