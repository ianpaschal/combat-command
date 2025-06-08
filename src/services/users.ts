import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetUser = createQueryHook(api.users.fetchUser.fetchUser);
export const useGetUsers = createQueryHook(api.users.fetchUserList.fetchUserList);

// Basic (C_UD) Mutations
export const useUpdateUser = createMutationHook(api.users.updateUser.updateUser);
