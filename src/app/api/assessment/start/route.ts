import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withApiProtection } from '@/lib/api-protection';

async function handler(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Check for existing in-progress assessment
    const existing = await db.assessment.findFirst({
      where: { userId, status: 'in_progress' },
    });

    if (existing) {
      return NextResponse.json({ assessment: existing, resumed: true });
    }

    const assessment = await db.assessment.create({
      data: {
        userId,
        status: 'in_progress',
        currentModule: 'vocabulary',
      },
    });

    return NextResponse.json({ assessment, resumed: false });
  } catch (error) {
    console.error('Assessment start error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Apply rate limiting and bot detection for assessment endpoints
export const POST = withApiProtection({ rateLimit: 'assessment', requireAuth: true, detectBots: true })(handler);
