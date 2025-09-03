import { api } from '~/api';
import {
  createActionHook,
  createMutationHook,
  createPaginatedQueryHook,
  createQueryHook,
} from '~/services/utils';

// Basic Queries
export const useGetUser = createQueryHook(api.users.getUser);
export const useGetUsers = createPaginatedQueryHook(api.users.getUsers);

// Special Queries
export const useGetCurrentUser = createQueryHook(api.users.getCurrentUser);

// Basic (C_UD) Mutations
export const useUpdateUser = createMutationHook(api.users.updateUser);

// Actions
export const useClaimUser = createActionHook(api.users.claimUser);
export const useInviteUser = createActionHook(api.users.inviteUser);
