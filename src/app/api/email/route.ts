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
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  writingScore: number;
  totalScore: number;
  cefrLevel: string;
  finalLevel: number;
  completionTimestamp: string;
}) {
  const rankName = RANK_NAMES[data.finalLevel] || 'Unknown';

  return `
    <div style="background: #0a0a0a; color: #e8e0d0; font-family: 'Playfair Display', Georgia, serif; padding: 40px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 24px; letter-spacing: 0.1em; margin: 0;">TOEFL SCORE REPORT</h1>
        <p style="color: #8b7355; font-size: 14px; margin-top: 8px;">MACAL EMPIRE — Empire English Community</p>
      </div>

      <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 18px;">Student Details</h2>
      <table style="width: 100%; color: #e8e0d0; font-size: 14px; margin-bottom: 24px;">
        <tr><td style="color: #8b7355; padding: 6px 0;">Name:</td><td style="padding: 6px 0;">${data.studentName}</td></tr>
        <tr><td style="color: #8b7355; padding: 6px 0;">Email:</td><td style="padding: 6px 0;">${data.studentEmail}</td></tr>
        <tr><td style="color: #8b7355; padding: 6px 0;">Completed:</td><td style="padding: 6px 0;">${data.completionTimestamp}</td></tr>
      </table>

      <h2 style="color: #c9a84c; font-family: Cinzel, serif; font-size: 18px;">Section Scores (0-30)</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.2);">
          <th style="text-align: left; color: #8b7355; padding: 10px 8px; font-size: 12px;">SECTION</th>
          <th style="text-align: center; color: #8b7355; padding: 10px 8px; font-size: 12px;">SCORE</th>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px; color: #c9a84c;">📖 Reading</td>
          <td style="text-align: center; padding: 10px 8px; font-weight: bold;">${data.readingScore}/30</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px; color: #cd7f32;">👂 Listening</td>
          <td style="text-align: center; padding: 10px 8px; font-weight: bold;">${data.listeningScore}/30</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.1);">
          <td style="padding: 10px 8px; color: #ff6b35;">🎤 Speaking</td>
          <td style="text-align: center; padding: 10px 8px; font-weight: bold;">${data.speakingScore}/30</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; color: #9b59b6;">✍️ Writing</td>
          <td style="text-align: center; padding: 10px 8px; font-weight: bold;">${data.writingScore}/30</td>
        </tr>
      </table>

      <div style="background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #8b7355; font-size: 12px; letter-spacing: 0.15em; margin: 0 0 8px;">TOTAL SCORE</p>
        <p style="color: #c9a84c; font-size: 36px; font-weight: bold; margin: 0;">${data.totalScore}/120</p>
        <p style="color: #8b7355; font-size: 14px; margin: 8px 0 0;">CEFR: ${data.cefrLevel} | Imperial Rank: ${rankName}</p>
      </div>

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
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  writingScore: number;
  totalScore: number;
  cefrLevel: string;
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
      <div style="text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); padding-bottom: 24px; margin-bottom: 30px;">
        <p style="color: #8b7355; font-size: 12px; letter-spacing: 0.3em; margin: 0 0 12px;">MACAL EMPIRE PRESENTS</p>
        <h1 style="color: #c9a84c; font-size: 22px; letter-spacing: 0.1em; margin: 0;">YOUR TOEFL SCORE REPORT</h1>
      </div>

      <p style="color: #e8e0d0; font-size: 16px;">Dear ${data.studentName},</p>
      <p style="color: #8b7355; font-size: 14px; line-height: 1.6;">
        You have completed all four sections of the Empire English Assessment. Here are your official results.
      </p>

      <!-- Score Card -->
      <div style="background: linear-gradient(145deg, #111118, #1a1a2e); border: 2px solid rgba(201,168,76,0.4); border-radius: 12px; padding: 30px; text-align: center; margin: 24px 0;">
        <p style="color: #8b7355; font-size: 11px; letter-spacing: 0.3em; margin: 0 0 8px;">TOTAL IMPERIAL SCORE</p>
        <p style="color: #c9a84c; font-size: 48px; font-weight: bold; margin: 0;">${data.totalScore}/120</p>
        <p style="color: #8b7355; font-size: 14px; margin: 8px 0 0;">CEFR Level: <strong style="color: #cd7f32;">${data.cefrLevel}</strong></p>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(201,168,76,0.2);">
          <p style="font-size: 36px; margin: 0 0 4px;">${rankEmoji}</p>
          <p style="color: #c9a84c; font-size: 24px; font-weight: bold; margin: 0;">${rankName.toUpperCase()}</p>
        </div>
      </div>

      <!-- Section Scores -->
      <h2 style="color: #c9a84c; font-size: 16px; margin-bottom: 16px;">Section Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
          <td style="padding: 12px 0; color: #c9a84c;">📖 Reading</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px;">${data.readingScore}<span style="color: #8b7355; font-size: 12px;">/30</span></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
          <td style="padding: 12px 0; color: #cd7f32;">👂 Listening</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px;">${data.listeningScore}<span style="color: #8b7355; font-size: 12px;">/30</span></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,168,76,0.15);">
          <td style="padding: 12px 0; color: #ff6b35;">🎤 Speaking</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px;">${data.speakingScore}<span style="color: #8b7355; font-size: 12px;">/30</span></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #9b59b6;">✍️ Writing</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px;">${data.writingScore}<span style="color: #8b7355; font-size: 12px;">/30</span></td>
        </tr>
      </table>

      <!-- Motivational Message -->
      <div style="background: rgba(201,168,76,0.05); border-left: 3px solid #c9a84c; padding: 16px 20px; margin: 24px 0;">
        <p style="color: #e8e0d0; font-size: 14px; font-style: italic; line-height: 1.6; margin: 0;">
          ${motivationalMessages[data.finalLevel] || motivationalMessages[0]}
        </p>
      </div>

      <p style="color: #8b7355; font-size: 14px; line-height: 1.6;">
        Continue your journey at the Empire English Community. Your next challenge awaits.
      </p>
      <p style="color: #c9a84c; font-size: 13px; margin-top: 20px;">
        Forged in Language. Crowned in Mastery.
      </p>

      <div style="text-align: center; border-top: 1px solid rgba(201,168,76,0.2); padding-top: 20px; margin-top: 30px; color: #8b7355; font-size: 11px;">
        <p>MACAL EMPIRE — Empire English Community</p>
        <p>assessment.empireenglish.online</p>
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
      readingScore = 0,
      listeningScore = 0,
      speakingScore = 0,
      writingScore = 0,
      totalScore = 0,
      cefrLevel = 'A1',
      finalLevel = 0,
      completionTimestamp,
      // Legacy fields (backward compatibility)
      vocabularyScore,
      grammarScore,
    } = body;

    // Validate required fields
    if (!studentName || !studentEmail) {
      console.error('[email_send_status] Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: studentName, studentEmail' },
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
            subject: `TOEFL Score Report — ${studentName} — ${totalScore}/120 (${cefrLevel})`,
            html: generateAdminEmail({
              studentName,
              studentEmail,
              readingScore: readingScore || 0,
              listeningScore: listeningScore || 0,
              speakingScore: speakingScore || 0,
              writingScore: writingScore || 0,
              totalScore: totalScore || 0,
              cefrLevel: cefrLevel || 'A1',
              finalLevel,
              completionTimestamp: timestamp,
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
            subject: `Your TOEFL Score Report — ${totalScore}/120 (${cefrLevel})`,
            html: generateStudentEmail({
              studentName,
              readingScore: readingScore || 0,
              listeningScore: listeningScore || 0,
              speakingScore: speakingScore || 0,
              writingScore: writingScore || 0,
              totalScore: totalScore || 0,
              cefrLevel: cefrLevel || 'A1',
              finalLevel,
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
