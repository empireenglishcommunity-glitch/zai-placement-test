import { NextRequest, NextResponse } from 'next/server';
import { calculateLevelAssignment } from '@/services/scoring-service';
import { withApiProtection } from '@/lib/api-protection';

async function handler(req: NextRequest) {
  try {
    const scores = await req.json();

    if (!scores) {
      return NextResponse.json({ error: 'Scores required' }, { status: 400 });
    }

    const {
      speakingScore,
      listeningScore,
      vocabularyScore,
      grammarScore,
    } = scores;

    if (
      typeof speakingScore !== 'number' ||
      typeof listeningScore !== 'number' ||
      typeof vocabularyScore !== 'number' ||
      typeof grammarScore !== 'number'
    ) {
      return NextResponse.json(
        { error: 'All score fields must be numbers' },
        { status: 400 }
      );
    }

    const result = calculateLevelAssignment({
      speakingScore,
      listeningScore,
      vocabularyScore,
      grammarScore,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Level calculation error:', error);
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}

// Apply rate limiting — assessment results are sensitive
export const POST = withApiProtection({ rateLimit: 'assessment' })(handler);
