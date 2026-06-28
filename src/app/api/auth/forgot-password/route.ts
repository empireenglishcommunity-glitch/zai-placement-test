import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail, passwordResetEmail, getAppUrl } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Always return success (don't reveal if email exists)
    const user = await db.user.findUnique({ where: { email } }).catch(() => null);

    if (user) {
      // Generate reset token (expires in 1 hour)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });

      // Send reset email
      const resetUrl = `${getAppUrl()}/reset-password?token=${resetToken}`;
      await sendEmail({
        to: email,
        subject: 'MACAL EMPIRE — Password Reset',
        html: passwordResetEmail(resetUrl),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('[FORGOT-PASSWORD] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
