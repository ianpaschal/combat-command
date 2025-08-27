import { api } from '~/api';
import { createActionHook } from '~/services/utils';

export const useAcceptInvitation = createActionHook(api.invitations.acceptInvitation);
export const useInviteUser = createActionHook(api.invitations.inviteUser);
