import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Extract user ID from session — it's set via JWT callback as token.id
    const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;
    
    if (!userId) {
      console.error('[terms_api] No user ID in session. Session exists:', !!session, 'User exists:', !!session?.user);
      
      // Fallback: try to find user by email if session has email but no id
      const userEmail = session?.user?.email;
      if (userEmail) {
        const user = await db.user.findUnique({ where: { email: userEmail } });
        if (user) {
          await db.profile.upsert({
            where: { userId: user.id },
            update: { termsAccepted: true, termsAcceptedAt: new Date() },
            create: { userId: user.id, termsAccepted: true, termsAcceptedAt: new Date() },
          });
          console.log('[terms_api] Terms accepted via email fallback for:', userEmail);
          return NextResponse.json({ success: true });
        }
      }
      
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Update profile with terms acceptance using upsert for safety
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
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[terms_api] Terms acceptance failed:', message);
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Extract user ID from session — it's set via JWT callback
    let userId = (session?.user as Record<string, unknown>)?.id as string | undefined;
    
    // Fallback: find by email if ID not in session
    if (!userId && session?.user?.email) {
      const user = await db.user.findUnique({ where: { email: session.user.email } });
      userId = user?.id;
    }
    
    if (!userId) {
      return NextResponse.json({ termsAccepted: false });
    }

    const profile = await db.profile.findUnique({
      where: { userId },
      select: { termsAccepted: true },
    });

    return NextResponse.json({ termsAccepted: profile?.termsAccepted ?? false });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[terms_api] Terms check failed:', message);
    return NextResponse.json({ termsAccepted: false });
  }
}
