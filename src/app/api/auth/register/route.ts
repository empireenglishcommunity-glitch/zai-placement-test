import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { sendEmail, verificationEmail, getAppUrl } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName, inviteCode } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required. Registration is by invitation only.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate invite code
    const invite = await db.inviteCode.findUnique({
      where: { code: inviteCode.toUpperCase().trim() },
    }).catch(() => null);

    if (!invite || !invite.isActive) {
      return NextResponse.json(
        { error: 'Invalid invite code. Contact your instructor for access.' },
        { status: 403 }
      );
    }

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      return NextResponse.json(
        { error: 'This invite code has expired. Request a new one.' },
        { status: 403 }
      );
    }

    if (invite.maxUses !== -1 && invite.usedCount >= invite.maxUses) {
      return NextResponse.json(
        { error: 'This invite code has reached its usage limit.' },
        { status: 403 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Generate email verification token (expires in 24 hours)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        displayName: displayName || email.split('@')[0],
        emailVerified: false,
        verifyToken,
        verifyTokenExpiry,
      },
    });

    await db.profile.create({
      data: {
        userId: user.id,
        currentLevel: 0,
        assessmentCount: 0,
      },
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${verifyToken}`;
    sendEmail({
      to: email,
      subject: 'MACAL EMPIRE — Verify Your Email',
      html: verificationEmail(verifyUrl),
    }).catch((err) => console.error('[REGISTER] Verification email failed:', err));

    // Mark invite code as used
    const usedByList = invite.usedBy ? JSON.parse(invite.usedBy) : [];
    usedByList.push(user.id);
    await db.inviteCode.update({
      where: { id: invite.id },
      data: {
        usedCount: invite.usedCount + 1,
        usedBy: JSON.stringify(usedByList),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Account created. A verification email has been sent.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
