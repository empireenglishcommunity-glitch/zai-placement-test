import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { withApiProtection } from '@/lib/api-protection';

// ─── Email Transporter ──────────────────────────────────────────
// Uses environment variables for SMTP configuration.
// Falls back to Ethereal Email (test account) for development.

async function getTransporter() {
  // Production: use configured SMTP
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development: use Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// ─── Rank Names ──────────────────────────────────────────────────

const RANK_NAMES: Record<number, string> = {
  0: 'Recruit',
  1: 'Initiate',
  2: 'Warrior',
  3: 'Champion',
};

// ─── Retry Helper ────────────────────────────────────────────────
// Retries an async operation with exponential backoff

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`[email_retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, err instanceof Error ? err.message : err);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ─── Admin Email Template ────────────────────────────────────────

function generateAdminEmail(data: {
  studentName: string;
  studentEmail: string;
  speakingScore: number;
  listeningScore: number;
  vocabularyScore: number;
  grammarScore: number;
  finalLevel: number;
  completionTimestamp: string;
  breakdown?: string;
}) {
  const rankName = RANK_NAMES[data.finalLevel] || 'Unknown';

  return `
    <div style="background: #0a0a0a; color: #e8e0d0; font-family: 'Playfair Display', Georgia, serif; padding: 40px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 24px; letter-spacing: 0.1em; margin: 0;">IMPERIAL ASSESSMENT REPORT</h1>
        <p style="color: #8b7355; font-size: 14px; margin-top: 8px;">MACAL EMPIRE — Empire English Community</p>
      </div>

      <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 18px;">Student Details</h2>
      <table style="width: 100%; color: #e8e0d0; font-size: 14px; margin-bottom: 24px;">
        <tr><td style="color: #8b7355; padding: 6px 0;">Name:</td><td style="padding: 6px 0;">${data.studentName}</td></tr>
        <tr><td style="color: #8b7355; padding: 6px 0;">Email:</td><td style="padding: 6px 0;">${data.studentEmail}</td></tr>
        <tr><td style="color: #8b7355; padding: 6px 0;">Completed:</td><td style="padding: 6px 0;">${data.completionTimestamp}</td></tr>
      </table>

      <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 18px;">Assessment Results</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.2);">
          <th style="text-align: left; color: #8b7355; padding: 10px 8px; font-family: Cinzel, serif; font-size: 12px;">MODULE</th>
          <th style="text-align: center; color: #8b7355; padding: 10px 8px; font-family: Cinzel, serif; font-size: 12px;">SCORE</th>
          <th style="text-align: center; color: #8b7355; padding: 10px 8px; font-family: Cinzel, serif; font-size: 12px;">LEVEL</th>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px;">Speaking</td>
          <td style="text-align: center; padding: 10px 8px;">${data.speakingScore}%</td>
          <td style="text-align: center; padding: 10px 8px; color: #cd7f32;">${RANK_NAMES[Math.floor(data.speakingScore / 25)] || 'Recruit'}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px;">Listening</td>
          <td style="text-align: center; padding: 10px 8px;">${data.listeningScore}%</td>
          <td style="text-align: center; padding: 10px 8px; color: #c9a84c;">${RANK_NAMES[Math.floor(data.listeningScore / 25)] || 'Recruit'}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px;">Vocabulary</td>
          <td style="text-align: center; padding: 10px 8px;">~${data.vocabularyScore.toLocaleString()} words</td>
          <td style="text-align: center; padding: 10px 8px; color: #ff6b35;">${RANK_NAMES[data.vocabularyScore >= 2501 ? 3 : data.vocabularyScore >= 1201 ? 2 : data.vocabularyScore >= 401 ? 1 : 0]}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px;">Grammar</td>
          <td style="text-align: center; padding: 10px 8px;">${data.grammarScore}%</td>
          <td style="text-align: center; padding: 10px 8px; color: #e74c3c;">${RANK_NAMES[Math.floor(data.grammarScore / 25)] || 'Recruit'}</td>
        </tr>
      </table>

      <div style="background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #8b7355; font-size: 12px; font-family: Cinzel, serif; letter-spacing: 0.15em; margin: 0 0 8px;">FINAL IMPERIAL RANK</p>
        <p style="color: #c9a84c; font-family: Cinzel, serif; font-size: 28px; margin: 0; text-shadow: 0 0 10px rgba(201,168,76,0.3);">${rankName.toUpperCase()}</p>
      </div>

      ${data.breakdown ? `
      <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 18px;">Question Breakdown</h2>
      <div style="background: rgba(10,10,10,0.8); border: 1px solid rgba(201,168,76,0.15); border-radius: 4px; padding: 16px; margin-bottom: 24px; font-size: 12px; color: #8b7355; white-space: pre-wrap;">${data.breakdown}</div>
      ` : ''}

      <div style="text-align: center; border-top: 1px solid rgba(201,168,76,0.2); padding-top: 20px; color: #8b7355; font-size: 12px;">
        <p>MACAL EMPIRE — Empire English Community</p>
        <p style="font-style: italic;">Forged in Language. Crowned in Mastery.</p>
      </div>
    </div>
  `;
}

// ─── Student Email Template ──────────────────────────────────────

function generateStudentEmail(data: {
  studentName: string;
  speakingScore: number;
  listeningScore: number;
  vocabularyScore: number;
  grammarScore: number;
  finalLevel: number;
}) {
  const rankName = RANK_NAMES[data.finalLevel] || 'Recruit';
  const rankEmoji = ['🗡️', '⚔️', '🛡️', '👑'][data.finalLevel] || '🗡️';

  const motivationalMessages: Record<number, string> = {
    0: 'Every warrior starts at the gates. Your journey has just begun — and the Empire sees your potential. Continue your training, face the trials again, and rise through the ranks.',
    1: 'You have taken your first oath. The path of the Initiate is one of discipline and perseverance. Keep pushing forward — the Empire believes in your growth.',
    2: 'You have proven your mettle. As a Warrior of the Empire, you stand among those who have truly committed to mastery. Your dedication is your greatest weapon.',
    3: 'You stand among the elite. As a Champion of the Empire, you have demonstrated exceptional command of the English language. Your mastery is an inspiration to all who follow.',
  };

  return `
    <div style="background: #0a0a0a; color: #e8e0d0; font-family: 'Playfair Display', Georgia, serif; padding: 40px; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); padding-bottom: 24px; margin-bottom: 30px;">
        <p style="color: #8b7355; font-size: 12px; font-family: Cinzel, serif; letter-spacing: 0.3em; margin: 0 0 12px;">MACAL EMPIRE PRESENTS</p>
        <h1 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 22px; letter-spacing: 0.1em; margin: 0;">YOUR IMPERIAL RANK HAS BEEN DECREEED</h1>
      </div>

      <!-- Greeting -->
      <p style="color: #e8e0d0; font-size: 16px;">Dear ${data.studentName},</p>
      <p style="color: #8b7355; font-size: 14px; line-height: 1.6;">
        The Empire has judged your performance across the Four Trials. Your dedication has been measured, and the Imperial Council has spoken.
      </p>

      <!-- Rank Card -->
      <div style="background: linear-gradient(145deg, #111118, #1a1a2e); border: 2px solid rgba(201,168,76,0.4); border-radius: 12px; padding: 30px; text-align: center; margin: 24px 0; box-shadow: 0 0 30px rgba(201,168,76,0.15);">
        <p style="color: #8b7355; font-size: 11px; font-family: Cinzel, serif; letter-spacing: 0.3em; margin: 0 0 12px;">IMPERIAL RANK ACHIEVED</p>
        <p style="font-size: 48px; margin: 0 0 8px;">${rankEmoji}</p>
        <p style="color: #c9a84c; font-family: Cinzel, serif; font-size: 32px; margin: 0; text-shadow: 0 0 15px rgba(201,168,76,0.4);">${rankName.toUpperCase()}</p>
        <p style="color: #8b7355; font-size: 13px; font-style: italic; margin-top: 8px;">
          Empire English Community
        </p>
      </div>

      <!-- Scores Summary -->
      <div style="margin: 24px 0;">
        <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 16px; margin-bottom: 16px;">Trial Performance</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
            <td style="padding: 10px 0; color: #cd7f32;">Speaking</td>
            <td style="padding: 10px 0; text-align: right;">${data.speakingScore}%</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
            <td style="padding: 10px 0; color: #c9a84c;">Listening</td>
            <td style="padding: 10px 0; text-align: right;">${data.listeningScore}%</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
            <td style="padding: 10px 0; color: #ff6b35;">Vocabulary</td>
            <td style="padding: 10px 0; text-align: right;">~${data.vocabularyScore.toLocaleString()} words</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #e74c3c;">Grammar</td>
            <td style="padding: 10px 0; text-align: right;">${data.grammarScore}%</td>
          </tr>
        </table>
      </div>

      <!-- Motivational Message -->
      <div style="background: rgba(201,168,76,0.05); border-left: 3px solid #c9a84c; padding: 16px 20px; margin: 24px 0;">
        <p style="color: #e8e0d0; font-size: 14px; font-style: italic; line-height: 1.6; margin: 0;">
          ${motivationalMessages[data.finalLevel] || motivationalMessages[0]}
        </p>
      </div>

      <!-- Certificate Message -->
      <div style="text-align: center; margin: 24px 0; padding: 20px; border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; background: rgba(201,168,76,0.03);">
        <p style="color: #8b7355; font-size: 11px; font-family: Cinzel, serif; letter-spacing: 0.2em; margin: 0 0 8px;">CERTIFICATE OF ACHIEVEMENT</p>
        <p style="color: #c9a84c; font-family: Cinzel, serif; font-size: 14px; margin: 0;">
          This certifies that <strong>${data.studentName}</strong> has been awarded the rank of <strong>${rankName}</strong> in the Empire English Community.
        </p>
      </div>

      <!-- Closing -->
      <p style="color: #8b7355; font-size: 14px; line-height: 1.6;">
        Continue your journey at the Empire English Community. Your next trial awaits.
      </p>
      <p style="color: #c9a84c; font-family: Cinzel, serif; font-size: 13px; margin-top: 20px;">
        Forged in Language. Crowned in Mastery.
      </p>

      <!-- Footer -->
      <div style="text-align: center; border-top: 1px solid rgba(201,168,76,0.2); padding-top: 20px; margin-top: 30px; color: #8b7355; font-size: 11px;">
        <p>MACAL EMPIRE — Empire English Community</p>
        <p style="font-style: italic;">This is an automated message from the Imperial Assessment System.</p>
      </div>
    </div>
  `;
}

// ─── API Route Handler ──────────────────────────────────────────

async function handler(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      studentName,
      studentEmail,
      speakingScore,
      listeningScore,
      vocabularyScore,
      grammarScore,
      finalLevel,
      completionTimestamp,
      breakdown,
    } = body;

    // Validate required fields
    if (!studentName || !studentEmail || finalLevel === undefined) {
      console.error('[email_send_status] Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: studentName, studentEmail, finalLevel' },
        { status: 400 }
      );
    }

    const timestamp = completionTimestamp || new Date().toISOString();
    let adminSendSuccess = false;
    let studentSendSuccess = false;
    let adminPreviewUrl: string | null = null;
    let studentPreviewUrl: string | null = null;
    let adminError: string | null = null;
    let studentError: string | null = null;

    try {
      const transporter = await getTransporter();

      // Send admin email with retry
      try {
        const adminResult = await withRetry(async () => {
          return transporter.sendMail({
            from: process.env.SMTP_FROM || '"Empire Assessment" <noreply@empire-english.com>',
            to: 'macalempire@gmail.com',
            subject: `Imperial Assessment Report — ${studentName} — ${RANK_NAMES[finalLevel] || 'Unknown'}`,
            html: generateAdminEmail({
              studentName,
              studentEmail,
              speakingScore: speakingScore || 0,
              listeningScore: listeningScore || 0,
              vocabularyScore: vocabularyScore || 0,
              grammarScore: grammarScore || 0,
              finalLevel,
              completionTimestamp: timestamp,
              breakdown,
            }),
          });
        }, 2, 1000);

        adminSendSuccess = true;
        adminPreviewUrl = nodemailer.getTestMessageUrl(adminResult);
        console.log('[email_send_status_admin] SUCCESS — Admin email sent for:', studentName, '| Duration:', Date.now() - startTime, 'ms');
      } catch (err) {
        adminError = err instanceof Error ? err.message : 'Unknown admin email error';
        console.error('[email_send_status_admin] FAILED —', adminError, '| Duration:', Date.now() - startTime, 'ms');
      }

      // Send student email with retry
      try {
        const studentResult = await withRetry(async () => {
          return transporter.sendMail({
            from: process.env.SMTP_FROM || '"Empire English Community" <noreply@empire-english.com>',
            to: studentEmail,
            subject: `Your Imperial Rank Has Been Decreed — ${RANK_NAMES[finalLevel] || 'Recruit'}`,
            html: generateStudentEmail({
              studentName,
              speakingScore: speakingScore || 0,
              listeningScore: listeningScore || 0,
              vocabularyScore: vocabularyScore || 0,
              grammarScore: grammarScore || 0,
              finalLevel,
            }),
          });
        }, 2, 1000);

        studentSendSuccess = true;
        studentPreviewUrl = nodemailer.getTestMessageUrl(studentResult);
        console.log('[email_send_status_student] SUCCESS — Student email sent to:', studentEmail, '| Duration:', Date.now() - startTime, 'ms');
      } catch (err) {
        studentError = err instanceof Error ? err.message : 'Unknown student email error';
        console.error('[email_send_status_student] FAILED —', studentError, '| Duration:', Date.now() - startTime, 'ms');
      }

    } catch (transporterErr) {
      const msg = transporterErr instanceof Error ? transporterErr.message : 'Transporter creation failed';
      console.error('[email_send_status] Transporter setup FAILED —', msg);
      adminError = adminError || msg;
      studentError = studentError || msg;
    }

    // Return detailed results — never silently fail
    const bothFailed = !adminSendSuccess && !studentSendSuccess;

    if (bothFailed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both admin and student emails failed to send',
          details: {
            adminError,
            studentError,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      adminSent: adminSendSuccess,
      studentSent: studentSendSuccess,
      adminPreviewUrl: adminPreviewUrl || undefined,
      studentPreviewUrl: studentPreviewUrl || undefined,
      ...(adminError ? { adminError } : {}),
      ...(studentError ? { studentError } : {}),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[email_send_status] CRITICAL FAILURE —', message, '| Duration:', Date.now() - startTime, 'ms');
    return NextResponse.json(
      { error: 'Failed to send assessment emails', details: message },
      { status: 500 }
    );
  }
}

// Apply rate limiting for email endpoints — strict to prevent abuse
export const POST = withApiProtection({ rateLimit: 'email', requireAuth: true, detectBots: true, blockBots: true })(handler);
