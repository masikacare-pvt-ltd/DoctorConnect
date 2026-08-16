/**
 * Email transport configuration for better-auth email verification.
 *
 * Supports any SMTP provider (Resend, SendGrid, Mailgun, Gmail, etc.).
 * Set the following env vars on your deployment platform:
 *
 *   SMTP_HOST     - SMTP server hostname (e.g. smtp.resend.com)
 *   SMTP_PORT     - SMTP port (default 587)
 *   SMTP_USER     - SMTP username (e.g. resend, apikey)
 *   SMTP_PASS     - SMTP password / API key
 *   EMAIL_FROM    - Sender address (e.g. noreply@medconnect.app)
 *
 * If SMTP is not configured the server logs a warning and email
 * verification is skipped (development only behaviour).
 */

import nodemailer from 'nodemailer';

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[FATAL] SMTP not configured. Email verification will fail in production. Set SMTP_HOST, SMTP_USER, SMTP_PASS.');
    } else {
      console.warn('[WARN] SMTP not configured. Emails will not be sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable email verification.');
    }
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export const mailTransport = createTransport();
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@medconnect.app';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!mailTransport) {
    console.warn(`[EMAIL SKIPPED] To: ${to} | Subject: ${subject} (SMTP not configured)`);
    return;
  }
  await mailTransport.sendMail({ from: EMAIL_FROM, to, subject, html });
}
