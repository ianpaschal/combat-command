import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetUserPreferences = createQueryHook(api.userPreferences.getUserPreferences);

// Basic Mutations
export const useSetUserPreferences = createMutationHook(api.userPreferences.setUserPreferences);
