import {
  action,
  internalMutation,
  internalQuery,
} from './_generated/server';
import * as model from './_model/invitations';

export const getInvitationByToken = internalQuery({
  args: model.getInvitationByTokenArgs,
  handler: model.getInvitationByToken,
});

export const deleteInvitation = internalMutation({
  args: model.deleteInvitationArgs,
  handler: model.deleteInvitation,
});

export const cleanUpInvitationsByInvitedUser = internalMutation({
  args: model.cleanUpInvitationsByInvitedUserArgs,
  handler: model.cleanUpInvitationsByInvitedUser,
});

export const createInvitation = internalMutation({
  args: model.createInvitationArgs,
  handler: model.createInvitation,
});

export const acceptInvitation = action({
  args: model.acceptInvitationArgs,
  handler: model.acceptInvitation,
});

export const inviteUser = action({
  args: model.inviteUserArgs,
  handler: model.inviteUser,
});
