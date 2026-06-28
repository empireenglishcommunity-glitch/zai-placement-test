// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Invite Code Management API
// GET: validate a code | POST: create new code (admin only)
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ─── GET: Validate an invite code ───────────────────────────

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Code required' }, { status: 400 });
  }

  try {
    const invite = await db.inviteCode.findUnique({ where: { code: code.toUpperCase().trim() } });

    if (!invite) {
      return NextResponse.json({ valid: false, error: 'Invalid invite code' });
    }

    if (!invite.isActive) {
      return NextResponse.json({ valid: false, error: 'This code has been deactivated' });
    }

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      return NextResponse.json({ valid: false, error: 'This code has expired' });
    }

    if (invite.maxUses !== -1 && invite.usedCount >= invite.maxUses) {
      return NextResponse.json({ valid: false, error: 'This code has reached its usage limit' });
    }

    return NextResponse.json({ valid: true, type: invite.type });
  } catch (error) {
    console.error('[INVITE] Validation error:', error);
    return NextResponse.json({ valid: false, error: 'Validation failed' });
  }
}

// ─── POST: Create a new invite code (admin only) ────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    // Simple admin check — you can expand this
    if (!email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { code, type, maxUses, expiresInDays, note } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const invite = await db.inviteCode.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type || 'general',
        maxUses: maxUses ?? 1,
        expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null,
        note: note || null,
      },
    });

    return NextResponse.json({ success: true, invite });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }
    console.error('[INVITE] Create error:', error);
    return NextResponse.json({ error: 'Failed to create code' }, { status: 500 });
  }
}
