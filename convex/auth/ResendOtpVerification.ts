import { Email } from '@convex-dev/auth/providers/Email';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Resend as ResendAPI } from 'resend';
 
export const ResendOtpVerification = Email({
  id: 'resend-otp-verification',
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(8, alphabet('0-9'));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
    expires,
  }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: 'CombatCommand <noreply@combatcommand.net>',
      to: [email],
      subject: 'Verification Code',
      text: `Your code is ${token}. It will expire in ${expires} minutes.`,
    });
 
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
