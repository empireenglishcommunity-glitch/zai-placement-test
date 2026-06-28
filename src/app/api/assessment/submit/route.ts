import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';
import { analyzeResponseTimes, type AnswerTiming } from '@/services/assessment-engine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface AnswerInput {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // milliseconds
}

async function handler(req: NextRequest) {
  try {
    const { assessmentId, module, answers, scores, userId: clientUserId } = await req.json();

    if (!module) {
      return NextResponse.json({ error: 'Module required' }, { status: 400 });
    }

    // ─── Anti-Cheating: Response Time Analysis ────────────
    let integrityAnalysis = null;
    if (answers && answers.length > 0) {
      const timings: AnswerTiming[] = (answers as AnswerInput[]).map((a) => ({
        elapsed: a.timeTaken ? a.timeTaken / 1000 : null, // convert ms → seconds
        correct: a.isCorrect,
      }));
      integrityAnalysis = analyzeResponseTimes(timings);
    }

    // Try to save to database
    try {
      const { db } = await import('@/lib/db');

      // Get the current user — RELIABLE method via email lookup from session
      let userId: string | null = null;
      
      // Method 1: Client sent their userId directly
      if (clientUserId && typeof clientUserId === 'string' && clientUserId.length > 5) {
        const userExists = await db.user.findUnique({ where: { id: clientUserId } }).catch(() => null);
        if (userExists) userId = clientUserId;
      }
      
      // Method 2: Try getServerSession with cookies forwarded
      if (!userId) {
        try {
          const session = await getServerSession(authOptions);
          if (session?.user) {
            const email = session.user.email;
            if (email) {
              const user = await db.user.findUnique({ where: { email } });
              if (user) userId = user.id;
            }
            if (!userId) {
              userId = (session.user as Record<string, unknown>)?.id as string || null;
            }
          }
        } catch { /* session not available */ }
      }

      // Method 3: Find user by email from request body (if provided)
      if (!userId && clientUserId && clientUserId.includes('@')) {
        const user = await db.user.findUnique({ where: { email: clientUserId } }).catch(() => null);
        if (user) userId = user.id;
      }

      // Method 4: If single user (testing), use them
      if (!userId) {
        const count = await db.user.count().catch(() => 0);
        if (count === 1) {
          const user = await db.user.findFirst();
          if (user) userId = user.id;
        }
      }

      console.log('[SUBMIT] userId resolved:', userId ? userId.slice(0, 8) + '...' : 'NULL', 'module:', module);

      if (userId) {
        // Find or create an assessment record for this user
        let assessment = await db.assessment.findFirst({
          where: { userId, status: 'in_progress' },
          orderBy: { startedAt: 'desc' },
        }).catch(() => null);

        if (!assessment) {
          // Create a new assessment record
          assessment = await db.assessment.create({
            data: {
              userId,
              status: 'in_progress',
              currentModule: module,
            },
          }).catch(() => null);
        }

        if (assessment) {
          // Build the update data based on module
          const updateData: Record<string, unknown> = { currentModule: module };

          // Add integrity flags if suspicious
          if (integrityAnalysis?.suspicious) {
            updateData.flagged = true;
            updateData.flagReason = integrityAnalysis.flags.map((f) => f.message).join('; ');
          }

          if (module === 'vocabulary' && scores) {
            updateData.voBand1 = scores.band1 ?? null;
            updateData.voBand2 = scores.band2 ?? null;
            updateData.voBand3 = scores.band3 ?? null;
            updateData.voBand4 = scores.band4 ?? null;
            updateData.voBand5 = scores.band5 ?? null;
            updateData.voEstimatedSize = scores.estimatedSize ?? null;
            updateData.voOverall = scores.overall ?? null;
            updateData.voLevel = scores.level ?? null;
          }

          if (module === 'grammar' && scores) {
            updateData.grPercentage = scores.percentage ?? scores.overall ?? null;
            updateData.grLevel = scores.level ?? null;
          }

          if (module === 'speaking' && scores) {
            updateData.spPronunciation = scores.pronunciation ?? null;
            updateData.spFluency = scores.fluency ?? null;
            updateData.spWordsPerMinute = scores.wordsPerMinute ?? null;
            updateData.spPhonemeAcc = scores.phonemeAccuracy ?? null;
            updateData.spGrammarAcc = scores.grammarAccuracy ?? null;
            updateData.spVocabRange = scores.vocabularyRange ?? null;
            updateData.spConfidence = scores.confidence ?? null;
            updateData.spRhythmMatch = scores.rhythmMatch ?? null;
            updateData.spOverall = scores.overall ?? null;
            updateData.spLevel = scores.level ?? null;
          }

          if (module === 'listening' && scores) {
            updateData.liLiteral = scores.literalComprehension ?? null;
            updateData.liInference = scores.inference ?? null;
            updateData.liOverall = scores.overall ?? null;
            updateData.liLevel = scores.level ?? null;
          }

          // Check if all modules are complete
          const currentAssessment = await db.assessment.findUnique({ where: { id: assessment.id } });
          const hasVocab = currentAssessment?.voOverall !== null || (module === 'vocabulary' && scores?.overall);
          const hasGrammar = currentAssessment?.grPercentage !== null || (module === 'grammar' && scores);
          const hasSpeaking = currentAssessment?.spOverall !== null || (module === 'speaking' && scores?.overall);
          const hasListening = currentAssessment?.liOverall !== null || (module === 'listening' && scores?.overall);

          if (hasVocab && hasGrammar && hasSpeaking && hasListening) {
            updateData.status = 'completed';
            updateData.completedAt = new Date();
          }

          await db.assessment.update({
            where: { id: assessment.id },
            data: updateData,
          });

          // Save individual answers
          if (answers && answers.length > 0) {
            await db.answer.createMany({
              data: (answers as AnswerInput[]).map((a) => ({
                assessmentId: assessment!.id,
                module,
                questionId: a.questionId,
                selectedAnswer: a.selectedAnswer,
                isCorrect: a.isCorrect,
                timeTaken: a.timeTaken,
              })),
            }).catch(() => {});
          }
        }
      }
    } catch (dbError) {
      console.log('DB save failed, continuing:', dbError);
    }

    return NextResponse.json({
      success: true,
      integrity: integrityAnalysis
        ? {
            suspicious: integrityAnalysis.suspicious,
            averageTime: Math.round(integrityAnalysis.averageTime * 10) / 10,
            flagCount: integrityAnalysis.flags.length,
          }
        : null,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Apply rate limiting and bot detection
export const POST = withApiProtection({ rateLimit: 'assessment' })(handler);
