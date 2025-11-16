import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetList = createQueryHook(api.lists.getList);
export const useGetListsByTournamentRegistration = createQueryHook(api.lists.getListsByTournamentRegistration);

// Basic (C_UD) Mutations
export const useCreateList = createMutationHook(api.lists.createList);
