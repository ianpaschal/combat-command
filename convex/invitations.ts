import {
  action,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/invitations';

export const getInvitationByToken = query({
  args: model.getInvitationByTokenArgs,
  handler: model.getInvitationByToken,
});

export const deleteInvitation = mutation({
  args: model.deleteInvitationArgs,
  handler: model.deleteInvitation,
});

export const createInvitation = mutation({
  args: model.createInvitationArgs,
  handler: model.createInvitation,
});

export const acceptInvitation = action({
  args: model.acceptInvitationArgs,
  handler: model.acceptInvitation,
});
