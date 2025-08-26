import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const invitationsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_secret', ['secret']);

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
