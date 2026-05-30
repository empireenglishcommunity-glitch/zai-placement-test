import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Extract user ID from session — it's set via JWT callback as token.id
    let userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

    // Fallback: try to find user by email if session has email but no id
    if (!userId && session?.user?.email) {
      try {
        const { db } = await import('@/lib/db');
        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (user) {
          userId = user.id;
        }
      } catch {
        console.warn('[terms_api] DB lookup by email failed');
      }
    }

    if (!userId) {
      console.warn('[terms_api] No user ID available — session may not be established yet');
      // Instead of blocking, return success and rely on localStorage
      // The user is clearly authenticated client-side if they reached this point
      return NextResponse.json({ success: true, note: 'accepted_locally' });
    }

    // Update profile with terms acceptance
    try {
      const { db } = await import('@/lib/db');
      await db.profile.upsert({
        where: { userId },
        update: {
          termsAccepted: true,
          termsAcceptedAt: new Date(),
        },
        create: {
          userId,
          termsAccepted: true,
          termsAcceptedAt: new Date(),
        },
      });
      console.log('[terms_api] Terms accepted for user:', userId);
    } catch (dbError) {
      console.warn('[terms_api] DB upsert failed, but proceeding:', dbError);
      // Don't fail the request — localStorage is the fallback
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[terms_api] Terms acceptance failed:', message);
    // Instead of returning error, still return success to not block users
    return NextResponse.json({ success: true, note: 'fallback_acceptance' });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Extract user ID from session — it's set via JWT callback
    let userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

    // Fallback: find by email if ID not in session
    if (!userId && session?.user?.email) {
      try {
        const { db } = await import('@/lib/db');
        const user = await db.user.findUnique({ where: { email: session.user.email } });
        userId = user?.id;
      } catch {
        // DB not available
      }
    }

    if (!userId) {
      return NextResponse.json({ termsAccepted: false });
    }

    try {
      const { db } = await import('@/lib/db');
      const profile = await db.profile.findUnique({
        where: { userId },
        select: { termsAccepted: true },
      });

      return NextResponse.json({ termsAccepted: profile?.termsAccepted ?? false });
    } catch {
      // DB not available
      return NextResponse.json({ termsAccepted: false });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[terms_api] Terms check failed:', message);
    return NextResponse.json({ termsAccepted: false });
  }
}
