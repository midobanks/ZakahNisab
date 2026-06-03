import { Resend } from 'resend';
import crypto from 'crypto';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'ZakahNisab <reminders@zakahnisab.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function buildUnsubscribeUrl(token: string): string {
  return `${APP_URL}/api/unsubscribe?token=${token}`;
}

export async function sendConfirmationEmail(
  email: string,
  unsubscribeToken: string
): Promise<boolean> {
  if (!resend) return false;

  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Confirm your Zakah reminder subscription',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="font-size:20px;margin:0 0 16px">Zakah Reminder Confirmation</h1>
        <p style="color:#333;line-height:1.6">
          You subscribed to receive Zakah reminders at <strong>${email}</strong>.
        </p>
        <p style="color:#333;line-height:1.6">
          You will receive a notification once a year around the anniversary of your subscription
          to remind you to calculate and pay your Zakah.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#888">
          If you did not request this, you can ignore this email.
          <br />
          <a href="${unsubscribeUrl}" style="color:#888">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  return !error;
}

export async function sendZakahReminderEmail(
  email: string,
  unsubscribeToken: string,
  params: { calculationUrl?: string }
): Promise<boolean> {
  if (!resend) return false;

  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);
  const calcUrl = params.calculationUrl ?? APP_URL;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Time to check your Zakah',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="font-size:20px;margin:0 0 16px">A Year Has Passed</h1>
        <p style="color:#333;line-height:1.6">
          It has been approximately one year since you subscribed for a Zakah reminder.
          Use the ZakahNisab calculator to check your current Nisab threshold and calculate
          what you owe.
        </p>
        <a href="${calcUrl}" style="display:inline-block;background:#ca8a04;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;margin:16px 0">
          Calculate Zakah
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#888">
          <a href="${unsubscribeUrl}" style="color:#888">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  return !error;
}
