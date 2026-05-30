import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Update profile with terms acceptance
    await db.profile.update({
      where: { userId: session.user.id },
      data: {
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Terms acceptance failed:', message);
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ termsAccepted: false }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: { termsAccepted: true },
    });

    return NextResponse.json({ termsAccepted: profile?.termsAccepted ?? false });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Terms check failed:', message);
    return NextResponse.json({ termsAccepted: false }, { status: 500 });
  }
}
