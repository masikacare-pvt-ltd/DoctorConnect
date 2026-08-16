import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { sendEmail } from './email';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

// Email verification is enabled only when SMTP is configured.
// In production with no SMTP, new registrations still work but are unverified.
// Set SMTP_HOST/SMTP_USER/SMTP_PASS to fully enable verification.
const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: smtpConfigured,
    sendVerificationEmail: smtpConfigured ? async ({ user, url }) => {
      await sendEmail(
        user.email,
        'Verify your MedConnect email address',
        `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#0B132B">Verify your email</h2>
          <p>Click the button below to verify your email address and activate your MedConnect account.</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#0B132B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Verify Email</a>
          <p style="color:#888;font-size:12px;margin-top:24px">This link expires in 24 hours. If you didn't register, ignore this email.</p>
        </div>`
      );
    } : undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'doctor',
        input: false,
      },
      approvalStatus: {
        type: 'string',
        required: true,
        defaultValue: 'pending',
        input: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubdomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  trustedOrigins: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ],
});
