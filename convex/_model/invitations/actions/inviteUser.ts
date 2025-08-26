import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';
import { Resend } from 'resend';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { InviteUserViaTournament } from '../../../emails/InviteUserViaTournament';

export const inviteUserArgs = v.object({
  userId: v.id('users'),
  email: v.string(),
  tournamentId: v.optional(v.id('tournaments')),
  matchResultId: v.optional(v.id('matchResults')),
});

export const inviteUser = async (
  ctx: ActionCtx,
  args: Infer<typeof inviteUserArgs>,
): Promise<void> => {
  const resend = new Resend(process.env.AUTH_RESEND_KEY!);

  // --- PRIMARY ACTIONS ----
  const token = await ctx.runMutation(api.invitations.createInvitation, {
    email: args.email,
    userId: args.userId,
  });

  const defaultEmailOptions = {
    from: 'CombatCommand <noreply@combatcommand.net>',
    to: args.email,
  };

  if (args.tournamentId) {
    const tournament = await ctx.runQuery(api.tournaments.getTournament, {
      id: args.tournamentId,
    });
    if (!tournament) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
    }
    await resend.emails.send({
      ...defaultEmailOptions,
      subject: `You've been added to ${tournament.title} on Combat Command!`,
      react: InviteUserViaTournament({
        url: `${process.env.APP_URL}/invite?token=${token}`,
        tournament: tournament,
      }),
    });
  }
};
