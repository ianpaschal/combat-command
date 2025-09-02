'use node';

import { Infer, v } from 'convex/values';
import { Resend } from 'resend';

import { ActionCtx } from '../../../../_generated/server';

export const addContactToResendArgs = v.object({
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
});

export const addContactToResend = async (
  ctx: ActionCtx,
  args: Infer<typeof addContactToResendArgs>,
): Promise<void> => {
  const resend = new Resend(process.env.AUTH_RESEND_KEY!);
  const { error } = await resend.contacts.create({
    ...args,
    unsubscribed: false,
    audienceId: 'bfe8504e-9cfa-4986-a533-4e1e39a40a0e',
  });
  if (error) {
    console.error(error);
    throw new Error(JSON.stringify(error));
  }
};
