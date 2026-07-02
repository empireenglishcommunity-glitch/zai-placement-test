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

const GRAMMAR_POOL: QuestionPoolItem[] = [
  // Present Simple (6 questions for pool rotation)
  { id: 'g1', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },
  { id: 'g2', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ['He don\'t like coffee', 'He doesn\'t likes coffee', 'He doesn\'t like coffee', 'He not like coffee'], correctAnswer: 2 },
  { id: 'g3', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to negative: "They play football on Sundays."', options: ['They doesn\'t play football on Sundays', 'They don\'t play football on Sundays', 'They not play football on Sundays', 'They aren\'t play football on Sundays'], correctAnswer: 1 },
  { id: 'g1b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Water _____ at 100 degrees Celsius.', options: ['boil', 'boils', 'boiling', 'boiled'], correctAnswer: 1 },
  { id: 'g2b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She have two brothers', 'She has two brothers', 'She haves two brothers', 'She having two brothers'], correctAnswer: 1 },
  { id: 'g3b', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to question: "He works in a hospital."', options: ['Does he works in a hospital?', 'Do he work in a hospital?', 'Does he work in a hospital?', 'He works in a hospital?'], correctAnswer: 2 },

  // Present Continuous (6 questions)
  { id: 'g4', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'I _____ reading a book right now.', options: ['am', 'is', 'are', 'be'], correctAnswer: 0 },
  { id: 'g5', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She is work at the office', 'She is working at the office', 'She working at the office', 'She works at the office now'], correctAnswer: 1 },
  { id: 'g6', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to question: "They are watching a movie."', options: ['Are they watching a movie?', 'Do they watching a movie?', 'Is they watching a movie?', 'They are watching a movie?'], correctAnswer: 0 },
  { id: 'g4b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'The children _____ in the garden at the moment.', options: ['plays', 'are playing', 'is playing', 'play'], correctAnswer: 1 },
  { id: 'g5b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['He is run in the park', 'He is running in the park', 'He running in the park', 'He runs in the park right now'], correctAnswer: 1 },
  { id: 'g6b', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to negative: "She is writing a letter."', options: ['She doesn\'t writing a letter', 'She isn\'t writing a letter', 'She not writing a letter', 'She don\'t writing a letter'], correctAnswer: 1 },

  // Past Simple (6 questions)
  { id: 'g7', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'We _____ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2 },
  { id: 'g8', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ['He didn\'t went to school', 'He didn\'t go to school', 'He not went to school', 'He don\'t went to school'], correctAnswer: 1 },
  { id: 'g9', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to question: "She bought a new car."', options: ['Did she bought a new car?', 'Does she buy a new car?', 'Did she buy a new car?', 'Was she buy a new car?'], correctAnswer: 2 },
  { id: 'g7b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'They _____ a great time at the party last night.', options: ['have', 'has', 'had', 'having'], correctAnswer: 2 },
  { id: 'g8b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ['She didn\'t saw the movie', 'She didn\'t see the movie', 'She not saw the movie', 'She don\'t saw the movie'], correctAnswer: 1 },
  { id: 'g9b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to negative: "He wrote a letter."', options: ['He didn\'t wrote a letter', 'He didn\'t write a letter', 'He not wrote a letter', 'He don\'t wrote a letter'], correctAnswer: 1 },

  // Present Perfect (6 questions)
  { id: 'g10', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'I _____ already finished my homework.', options: ['has', 'have', 'had', 'having'], correctAnswer: 1 },
  { id: 'g11', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'She _____ never been to Japan.', options: ['have', 'has', 'had', 'having'], correctAnswer: 1 },
  { id: 'g12', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I have went to Paris twice', 'I have go to Paris twice', 'I have been to Paris twice', 'I has been to Paris twice'], correctAnswer: 2 },
  { id: 'g13', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Transform to negative: "They have seen that movie."', options: ['They haven\'t saw that movie', 'They haven\'t seen that movie', 'They didn\'t seen that movie', 'They hasn\'t seen that movie'], correctAnswer: 1 },
  { id: 'g10b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'How long _____ you lived here?', options: ['has', 'have', 'had', 'do'], correctAnswer: 1 },
  { id: 'g11b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence uses the present perfect correctly?', options: ['I have visit London last year', 'I have visited London three times', 'I has visited London', 'I have visiting London now'], correctAnswer: 1 },

  // Future Forms (6 questions)
  { id: 'g14', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'I _____ visit my grandmother next week.', options: ['will', 'did', 'do', 'was'], correctAnswer: 0 },
  { id: 'g15', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence uses the correct future form?', options: ['I will going to the store', 'I am going to go to the store', 'I will goes to the store', 'I going to the store tomorrow will'], correctAnswer: 1 },
  { id: 'g16', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform using "going to": "She will study medicine."', options: ['She is going study medicine', 'She is going to study medicine', 'She going to studies medicine', 'She was going to study medicine'], correctAnswer: 1 },
  { id: 'g14b', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'Look at those clouds! It _____ rain soon.', options: ['will', 'is going to', 'shall', 'would'], correctAnswer: 1 },
  { id: 'g15b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I will to call you tomorrow', 'I will call you tomorrow', 'I will calling you tomorrow', 'I will called you tomorrow'], correctAnswer: 1 },
  { id: 'g16b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform to future with "will": "She is going to travel abroad."', options: ['She will travel abroad', 'She will travels abroad', 'She will traveling abroad', 'She will traveled abroad'], correctAnswer: 0 },

  // Conditionals (6 questions)
  { id: 'g17', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If it rains, I _____ stay at home.', options: ['will', 'would', 'should', 'could'], correctAnswer: 0 },
  { id: 'g18', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I _____ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2 },
  { id: 'g19', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which conditional sentence is correct?', options: ['If I will study, I pass the exam', 'If I study, I will pass the exam', 'If I studied, I will pass the exam', 'If I study, I would pass the exam'], correctAnswer: 1 },
  { id: 'g17b', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If she _____ harder, she would have passed the exam.', options: ['studied', 'had studied', 'studies', 'would study'], correctAnswer: 1 },
  { id: 'g18b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I were you, I _____ accept the offer.', options: ['will', 'would', 'shall', 'can'], correctAnswer: 1 },
  { id: 'g19b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which sentence is a correct third conditional?', options: ['If I had known, I would have helped', 'If I knew, I would help', 'If I know, I will help', 'If I would know, I help'], correctAnswer: 0 },

  // Passive Voice (6 questions)
  { id: 'g20', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The book _____ by the students last year.', options: ['was read', 'is read', 'read', 'reading'], correctAnswer: 0 },
  { id: 'g21', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The chef cooked the meal', 'The meal was cooked by the chef', 'The chef is cooking the meal', 'The chef cooks the meal'], correctAnswer: 1 },
  { id: 'g22', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "Someone stole my bicycle."', options: ['My bicycle was stolen', 'My bicycle is stolen', 'My bicycle stole', 'My bicycle were stolen'], correctAnswer: 0 },
  { id: 'g20b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The new bridge _____ next year.', options: ['will build', 'will be built', 'is building', 'built'], correctAnswer: 1 },
  { id: 'g21b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The company produces cars', 'Cars are produced by the company', 'The company is producing cars', 'The company will produce cars'], correctAnswer: 1 },
  { id: 'g22b', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "They are painting the house."', options: ['The house is being painted', 'The house was painted', 'The house is painted', 'The house painted'], correctAnswer: 0 },

  // Question Formation (6 questions)
  { id: 'g23', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "The empire was founded in 1453."', options: ['When was the empire founded?', 'When the empire was founded?', 'When did the empire founded?', 'When the empire did founded?'], correctAnswer: 0 },
  { id: 'g24', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "She speaks three languages."', options: ['How many languages does she speak?', 'How many languages do she speak?', 'How many languages she speaks?', 'How many languages she does speak?'], correctAnswer: 0 },
  { id: 'g25', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['Where you are going?', 'Where are you going?', 'Where you going?', 'Where going you?'], correctAnswer: 1 },
  { id: 'g23b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "He has been working here for five years."', options: ['How long has he been working here?', 'How long he has been working here?', 'How long have he been working here?', 'How long he been working here?'], correctAnswer: 0 },
  { id: 'g24b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "They will arrive tomorrow."', options: ['When will they arrive?', 'When they will arrive?', 'When do they arrive?', 'When they arrive?'], correctAnswer: 0 },
  { id: 'g25b', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['What time the train leaves?', 'What time does the train leave?', 'What time the train does leave?', 'What time leave the train?'], correctAnswer: 1 },
];

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
