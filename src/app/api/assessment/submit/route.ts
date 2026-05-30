import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';

interface AnswerInput {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

async function handler(req: NextRequest) {
  try {
    const { assessmentId, module, answers, scores } = await req.json();

    if (!assessmentId || !module) {
      return NextResponse.json({ error: 'Assessment ID and module required' }, { status: 400 });
    }

    // Try to save to database, but don't fail if DB is unavailable
    try {
      const { db } = await import('@/lib/db');

      // Save individual answers
      if (answers && answers.length > 0) {
        await db.answer.createMany({
          data: (answers as AnswerInput[]).map((a) => ({
            assessmentId,
            module,
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
          })),
        });
      }

      // Update assessment scores based on module
      const updateData: Record<string, unknown> = { currentModule: module };

      if (module === 'vocabulary' && scores) {
        updateData.voBand1 = scores.band1;
        updateData.voBand2 = scores.band2;
        updateData.voBand3 = scores.band3;
        updateData.voBand4 = scores.band4;
        updateData.voBand5 = scores.band5;
        updateData.voEstimatedSize = scores.estimatedSize;
        updateData.voOverall = scores.overall;
        updateData.voLevel = scores.level;
      }

      if (module === 'grammar' && scores) {
        updateData.grPercentage = scores.percentage;
        updateData.grLevel = scores.level;
      }

      if (module === 'speaking' && scores) {
        updateData.spPronunciation = scores.pronunciation;
        updateData.spFluency = scores.fluency;
        updateData.spWordsPerMinute = scores.wordsPerMinute;
        updateData.spPhonemeAcc = scores.phonemeAccuracy;
        updateData.spGrammarAcc = scores.grammarAccuracy;
        updateData.spVocabRange = scores.vocabularyRange;
        updateData.spConfidence = scores.confidence;
        updateData.spRhythmMatch = scores.rhythmMatch;
        updateData.spOverall = scores.overall;
        updateData.spLevel = scores.level;
      }

      if (module === 'listening' && scores) {
        updateData.liLiteral = scores.literalComprehension;
        updateData.liInference = scores.inference;
        updateData.liDetailRecognition = scores.detailRecognition;
        updateData.liOverall = scores.overall;
        updateData.liLevel = scores.level;
      }

      await db.assessment.update({
        where: { id: assessmentId },
        data: updateData,
      }).catch(() => {
        // Assessment might not exist, that's OK for demo
      });
    } catch (dbError) {
      console.log('DB save failed, continuing:', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Apply rate limiting and bot detection
export const POST = withApiProtection({ rateLimit: 'assessment', requireAuth: true, detectBots: true })(handler);
