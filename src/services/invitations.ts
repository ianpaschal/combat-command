import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';
import { createActionHook } from '~/services/utils/createActionHook';

// Special Queries
export const useGetInvitationByToken = createQueryHook(api.invitations.getInvitationByToken);

// Basic (C_UD) Mutations
export const useCreateInvitation = createMutationHook(api.invitations.createInvitation);
export const useCleanUpInvitationsByInvitedUser = createMutationHook(api.invitations.cleanUpInvitationsByInvitedUser);
export const useDeleteInvitation = createMutationHook(api.invitations.deleteInvitation);

// Actions
export const useAcceptInvitation = createActionHook(api.invitations.acceptInvitation);
export const useInviteUser = createActionHook(api.invitations.inviteUser);
