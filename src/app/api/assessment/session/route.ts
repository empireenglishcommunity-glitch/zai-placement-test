// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Assessment Session API
// Manages locked question sets, session recovery, and exposure tracking
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';
import {
  shuffleArray,
  shuffleQuestionOptions,
  selectQuestionsByCategory,
  generateSessionSeed,
  VOCABULARY_CATEGORIES,
  GRAMMAR_CATEGORIES,
  canRetake,
  type QuestionPoolItem,
  type ShuffledQuestion,
} from '@/services/assessment-engine';
import { VOCABULARY_CONFIG, GRAMMAR_CONFIG } from '@/lib/constants';
import { VOCABULARY_POOL } from '@/data/vocabulary-pool';
import { GRAMMAR_POOL as IMPORTED_GRAMMAR_POOL } from '@/data/grammar-pool';

// ─── Types ──────────────────────────────────────────────────

interface SessionRequest {
  userId: string;
  module: 'vocabulary' | 'grammar';
  forceNew?: boolean; // force create new session (for retakes)
}

// ─── Fallback Question Pools ────────────────────────────────
// Expanded pools for better rotation

// VOCAB_POOL is now imported from @/data/vocabulary-pool as VOCABULARY_POOL
const VOCAB_POOL = VOCABULARY_POOL;

// GRAMMAR_POOL is now imported from @/data/grammar-pool
const GRAMMAR_POOL = IMPORTED_GRAMMAR_POOL;

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body: SessionRequest = await req.json();
      const { userId, module, forceNew } = body;

      if (!userId || !module) {
        return NextResponse.json({ error: 'userId and module are required' }, { status: 400 });
      }

      if (module !== 'vocabulary' && module !== 'grammar') {
        return NextResponse.json({ error: 'Module must be vocabulary or grammar' }, { status: 400 });
      }

      // Try to use DB for session management
      let attemptNumber = 1;
      let exposedIds = new Set<string>();
      let existingSession = null;

      try {
        const { db } = await import('@/lib/db');

        // Check for active session (refresh recovery)
        if (!forceNew) {
          existingSession = await db.assessmentSession.findFirst({
            where: { userId, module, status: 'active' },
            orderBy: { startedAt: 'desc' },
          });

          if (existingSession) {
            // Return existing locked session
            const questionIds: string[] = JSON.parse(existingSession.questionSet);
            const optionMapping: Record<string, number[]> = JSON.parse(existingSession.optionMapping);
            const pool = module === 'vocabulary' ? VOCAB_POOL : GRAMMAR_POOL;

            // Reconstruct questions with shuffled options
            const questions = questionIds.map((qId, idx) => {
              const poolQ = pool.find(q => q.id === qId);
              if (!poolQ) return null;

              const mapping = optionMapping[qId];
              if (mapping) {
                const shuffledOptions = mapping.map((origIdx: number) => poolQ.options[origIdx]);
                const newCorrect = mapping.indexOf(poolQ.correctAnswer);
                return {
                  ...poolQ,
                  options: shuffledOptions,
                  correctAnswer: newCorrect,
                  _originalCorrectAnswer: poolQ.correctAnswer,
                  _displayOrder: idx,
                };
              }
              return { ...poolQ, _displayOrder: idx };
            }).filter(Boolean);

            return NextResponse.json({
              session: {
                id: existingSession.id,
                module,
                attemptNumber: existingSession.attemptNumber,
                seed: existingSession.seed,
                questions,
                isResumed: true,
              },
            });
          }
        }

        // Check retake cooldown
        if (forceNew) {
          const lastSession = await db.assessmentSession.findFirst({
            where: { userId, module, status: 'completed' },
            orderBy: { completedAt: 'desc' },
          });

          if (lastSession?.completedAt) {
            const retake = canRetake(lastSession.completedAt);
            if (!retake.allowed) {
              return NextResponse.json({
                error: 'Retake cooldown active',
                cooldownMs: retake.remainingMs,
                message: `Please wait before retaking this trial.`,
              }, { status: 429 });
            }
          }
        }

        // Get attempt number
        const previousSessions = await db.assessmentSession.count({
          where: { userId, module },
        });
        attemptNumber = previousSessions + 1;

        // Get exposed question IDs
        const exposures = await db.questionExposure.findMany({
          where: { userId, module },
          select: { questionId: true },
        });
        exposedIds = new Set(exposures.map(e => e.questionId));

        // Mark old active sessions as abandoned
        await db.assessmentSession.updateMany({
          where: { userId, module, status: 'active' },
          data: { status: 'abandoned' },
        });
      } catch (dbError) {
        console.log('DB session management failed, using stateless mode:', dbError);
      }

      // Generate session
      const seed = generateSessionSeed(userId, module, attemptNumber);
      const pool = module === 'vocabulary' ? VOCAB_POOL : GRAMMAR_POOL;
      const categories = module === 'vocabulary' ? VOCABULARY_CATEGORIES : GRAMMAR_CATEGORIES;

      // Select questions by category with exposure avoidance
      const { selectedQuestions } = selectQuestionsByCategory(
        pool,
        categories,
        exposedIds,
        attemptNumber,
        seed
      );

      // Shuffle question order
      const shuffledQuestions = shuffleArray(selectedQuestions, seed + 1);

      // Shuffle options for each question with per-question seeds
      const processedQuestions = shuffledQuestions.map((q, idx) => {
        const shuffled = shuffleQuestionOptions(q, seed + idx + 100);
        return {
          ...shuffled,
          _displayOrder: idx,
        };
      });

      // Build question set and option mapping for storage
      const questionIds = processedQuestions.map(q => q.id);
      const optionMapping: Record<string, number[]> = {};
      for (const q of processedQuestions) {
        optionMapping[q.id] = q._optionMapping;
      }

      // Try to save session to DB
      let sessionId = `session_${userId}_${module}_${Date.now()}`;
      try {
        const { db } = await import('@/lib/db');
        const session = await db.assessmentSession.create({
          data: {
            userId,
            module,
            attemptNumber,
            questionSet: JSON.stringify(questionIds),
            optionMapping: JSON.stringify(optionMapping),
            seed,
            status: 'active',
          },
        });
        sessionId = session.id;

        // Record question exposures
        await db.questionExposure.createMany({
          data: processedQuestions.map(q => ({
            userId,
            questionId: q.id,
            module,
            attemptNum: attemptNumber,
          })).filter((item, index, self) =>
            index === self.findIndex(t => t.questionId === item.questionId)
          ),
        });
      } catch (dbError) {
        console.log('DB session save failed, continuing stateless:', dbError);
      }

      return NextResponse.json({
        session: {
          id: sessionId,
          module,
          attemptNumber,
          seed,
          questions: processedQuestions,
          isResumed: false,
        },
      });
    } catch (error) {
      console.error('Session creation error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // PATCH: Complete a session
  if (req.method === 'PATCH') {
    try {
      const { sessionId } = await req.json();
      if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
      }

      try {
        const { db } = await import('@/lib/db');
        await db.assessmentSession.update({
          where: { id: sessionId },
          data: { status: 'completed', completedAt: new Date() },
        });
      } catch (dbError) {
        console.log('DB session completion failed:', dbError);
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Session completion error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const POST = withApiProtection({ rateLimit: 'assessment' })(handler);
export const PATCH = withApiProtection({ rateLimit: 'assessment' })(handler);
