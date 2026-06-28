// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Email Service (Resend)
// Permanent email infrastructure for auth flows
// ═══════════════════════════════════════════════════════════

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Empire English <onboarding@resend.dev>';
const APP_URL = process.env.NEXTAUTH_URL || 'https://assessment.empireenglish.online';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend API.
 * Returns true on success, false on failure.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('[EMAIL] RESEND_API_KEY not configured');
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('[EMAIL] Send failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[EMAIL] Error:', error);
    return false;
  }
}

// ─── Email Templates ────────────────────────────────────────

export function passwordResetEmail(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#c0c0c0;font-family:Georgia,serif;padding:40px 20px;">
  <div style="max-width:500px;margin:0 auto;text-align:center;">
    <h1 style="color:#c9a84c;font-size:24px;letter-spacing:0.1em;margin-bottom:8px;">MACAL EMPIRE</h1>
    <p style="color:#8b7355;font-size:12px;letter-spacing:0.2em;margin-bottom:30px;">EMPIRE ENGLISH COMMUNITY</p>
    <div style="background:#111;border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:30px;">
      <h2 style="color:#c9a84c;font-size:18px;margin-bottom:16px;">Password Reset Request</h2>
      <p style="color:#c0c0c0;font-size:14px;line-height:1.6;margin-bottom:24px;">
        You requested to reset your password. Click the button below to create a new password. This link expires in 1 hour.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:bold;font-size:14px;padding:12px 32px;border-radius:6px;text-decoration:none;letter-spacing:0.05em;">
        Reset Password
      </a>
      <p style="color:#8b7355;font-size:12px;margin-top:24px;">
        If you didn't request this, ignore this email. Your password will remain unchanged.
      </p>
    </div>
    <p style="color:#8b7355;font-size:11px;margin-top:20px;">&copy; MACAL EMPIRE. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export function verificationEmail(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#c0c0c0;font-family:Georgia,serif;padding:40px 20px;">
  <div style="max-width:500px;margin:0 auto;text-align:center;">
    <h1 style="color:#c9a84c;font-size:24px;letter-spacing:0.1em;margin-bottom:8px;">MACAL EMPIRE</h1>
    <p style="color:#8b7355;font-size:12px;letter-spacing:0.2em;margin-bottom:30px;">EMPIRE ENGLISH COMMUNITY</p>
    <div style="background:#111;border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:30px;">
      <h2 style="color:#c9a84c;font-size:18px;margin-bottom:16px;">Welcome to the Empire</h2>
      <p style="color:#c0c0c0;font-size:14px;line-height:1.6;margin-bottom:24px;">
        Verify your email to complete your registration and begin the Four Trials. Click the button below.
      </p>
      <a href="${verifyUrl}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:bold;font-size:14px;padding:12px 32px;border-radius:6px;text-decoration:none;letter-spacing:0.05em;">
        Verify Email
      </a>
      <p style="color:#8b7355;font-size:12px;margin-top:24px;">
        This link expires in 24 hours. If you didn't create an account, ignore this email.
      </p>
    </div>
    <p style="color:#8b7355;font-size:11px;margin-top:20px;">&copy; MACAL EMPIRE. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export function getAppUrl(): string {
  return APP_URL;
}
