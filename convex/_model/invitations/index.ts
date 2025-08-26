import { Id } from '../../_generated/dataModel';

export type InvitationId = Id<'invitations'>;

export {
  acceptInvitation,
  acceptInvitationArgs,
} from './actions/acceptInvitation';
export {
  inviteUser,
  inviteUserArgs,
} from './actions/inviteUser';
export {
  cleanUpInvitationsByInvitedUser,
  cleanUpInvitationsByInvitedUserArgs,
} from './mutations/cleanUpInvitationsByInvitedUser';
export {
  createInvitation,
  createInvitationArgs,
} from './mutations/createInvitation';
export {
  deleteInvitation,
  deleteInvitationArgs,
} from './mutations/deleteInvitation';
export {
  getInvitationByToken,
  getInvitationByTokenArgs,
} from './queries/getInvitationByToken';
