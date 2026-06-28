'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useUserId } from '@/hooks/useUserId';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Sword,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Target,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Shield,
} from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  ImperialButton,
  MetallicCard,
  GlowingBorder,
  ProgressBar,
  SectionDivider,
  ImperialRankBadge,
} from '@/components/empire';
import { GRAMMAR_CONFIG, GRAMMAR_LEVELS, MODULE_INFO } from '@/lib/constants';
import type { GrammarTopic, GrammarQuestionType, ImperialLevel } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────

type Phase = 'intro' | 'questions' | 'results';

interface ApiQuestion {
  id: string;
  module: string;
  type: string | null;
  topic: string | null;
  questionText: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  isActive?: boolean;
  _displayOrder?: number;
  _optionMapping?: number[];
  _originalCorrectAnswer?: number;
}

interface SessionData {
  id: string;
  module: string;
  attemptNumber: number;
  seed: number;
  questions: ApiQuestion[];
  isResumed: boolean;
}

interface TopicScore {
  correct: number;
  total: number;
}

interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

// ─── Topic Labels & Icons ─────────────────────────────────────

const TOPIC_META: Record<string, { label: string; icon: string; color: string }> = {
  present_simple: { label: 'Present Simple', icon: '⚡', color: '#c9a84c' },
  present_continuous: { label: 'Present Continuous', icon: '🔄', color: '#cd7f32' },
  past_simple: { label: 'Past Simple', icon: '📜', color: '#8b7355' },
  present_perfect: { label: 'Present Perfect', icon: '🔗', color: '#e8d48b' },
  future_forms: { label: 'Future Forms', icon: '🔮', color: '#ff6b35' },
  conditionals: { label: 'Conditionals', icon: '🔀', color: '#4ecdc4' },
  passive_voice: { label: 'Passive Voice', icon: '🛡️', color: '#9b59b6' },
  question_formation: { label: 'Question Formation', icon: '❓', color: '#3498db' },
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  completion: { label: 'Completion', color: '#c9a84c' },
  error_identification: { label: 'Error Identification', color: '#ff6b35' },
  transformation: { label: 'Transformation', color: '#9b59b6' },
};

// ─── Helpers ──────────────────────────────────────────────────

function getLevel(percentage: number): ImperialLevel {
  for (const l of GRAMMAR_LEVELS) {
    if (percentage >= l.min && percentage <= l.max) return l.level;
  }
  return 0;
}

function formatTopicKey(topic: string | null): string {
  return topic ?? 'unknown';
}

// ─── Component ────────────────────────────────────────────────

export default function GrammarAssessmentPage() {
  const router = useRouter();

  // Phase
  const [phase, setPhase] = useState<Phase>('intro');

  // Questions
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Session
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

  // Loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [percentage, setPercentage] = useState(0);
  const [level, setLevel] = useState<ImperialLevel>(0);
  const [topicScores, setTopicScores] = useState<Record<string, TopicScore>>({});
  // Get userId (works for auth + guest)
  const { userId: currentUserId, isGuest } = useUserId();
  const { status: authStatus } = useSession();
  // Auth guard: redirect if not logged in AND not guest
  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated" && !isGuest) router.push("/login");
  }, [authStatus, router, isGuest]);
  const getUserId = useCallback((): string => currentUserId || "guest", [currentUserId]);

  // Fetch session from Dynamic Assessment Engine
  const fetchQuestions = useCallback(async (forceNew = false) => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const res = await fetch('/api/assessment/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, module: 'grammar', forceNew }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to create assessment session');
      }
      const data = await res.json();
      const session: SessionData = data.session;
      if (!session.questions || session.questions.length === 0) {
        throw new Error('No grammar questions available');
      }
      setSessionId(session.id);
      setAttemptNumber(session.attemptNumber);
      // Questions are already shuffled by the session engine — use as-is
      setQuestions(session.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    if (phase === 'questions' && questions.length === 0) {
      fetchQuestions(false);
    }
  }, [phase, questions.length, fetchQuestions]);

  // Begin trial — forceNew when retrying (sessionId was previously set)
  const handleBegin = () => {
    const isRetry = attemptNumber > 1 || sessionId !== null;
    if (isRetry) {
      setQuestions([]);
      setSessionId(null);
      fetchQuestions(true).then(() => {
        setPhase('questions');
      });
    } else {
      setPhase('questions');
    }
  };

  // Select option
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
  };

  // Complete session on the server
  const completeSession = useCallback(async (sId: string) => {
    try {
      await fetch('/api/assessment/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sId }),
      });
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  }, []);

  // Next question
  const handleNext = () => {
    if (selectedOption === null) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    const newAnswer: AnswerRecord = {
      questionId: currentQ.id,
      selectedAnswer: selectedOption,
      isCorrect,
      timeTaken: 0,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    if (currentIndex + 1 >= questions.length) {
      // Calculate results
      calculateResults([...answers, newAnswer], questions);
      setPhase('results');
      // Mark session as completed
      if (sessionId) {
        completeSession(sessionId);
      }
      // Submit scores to assessment record for dashboard
      const allAnswers = [...answers, newAnswer];
      const totalCorrect = allAnswers.filter(a => a.isCorrect).length;
      const pct = Math.round((totalCorrect / questions.length) * 100);
      const lvl = pct <= 35 ? 0 : pct <= 60 ? 1 : pct <= 80 ? 2 : 3;
      fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          module: 'grammar',
          userId: getUserId(),
          answers: allAnswers.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
          })),
          scores: { percentage: pct, overall: pct, level: lvl },
        }),
      }).catch(() => {});
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  // Calculate results
  const calculateResults = (allAnswers: AnswerRecord[], allQuestions: ApiQuestion[]) => {
    const tScores: Record<string, TopicScore> = {};
    let totalCorrect = 0;

    // Initialize all topics
    for (const topicKey of Object.keys(GRAMMAR_CONFIG.topics)) {
      tScores[topicKey] = { correct: 0, total: 0 };
    }

    allAnswers.forEach((answer, idx) => {
      const q = allQuestions[idx];
      const topic = formatTopicKey(q.topic);
      if (!tScores[topic]) {
        tScores[topic] = { correct: 0, total: 0 };
      }
      tScores[topic].total++;
      if (answer.isCorrect) {
        tScores[topic].correct++;
        totalCorrect++;
      }
    });

    const pct = Math.round((totalCorrect / allQuestions.length) * 100);
    const lvl = getLevel(pct);

    setTopicScores(tScores);
    setPercentage(pct);
    setLevel(lvl);
  };

  // Retry
  const handleRetry = () => {
    setPhase('intro');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setPercentage(0);
    setLevel(0);
    setTopicScores({});
    setSessionId(null);
    // Next fetchQuestions call will use forceNew: true when triggered from handleBegin after retry
  };

  // Current question
  const currentQuestion = questions[currentIndex] ?? null;
  const currentTopic = currentQuestion ? formatTopicKey(currentQuestion.topic) : '';
  const currentType = currentQuestion?.type ?? '';

  // ─── Intro Screen ────────────────────────────────────────

  const IntroScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col protected-content"
    >
      <Navbar />
      <ParticleBackground />

      <main className="flex-1 pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <div className="text-5xl mb-4">⚔️</div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#c9a84c] mb-2 tracking-wider">
              Trial of Structure
            </h1>
            <p className="font-arabic text-[#8b7355] text-base mb-3" dir="rtl">اختبار القواعد</p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-[family-name:var(--font-heading)] text-lg text-[#8b7355] tracking-wide">
                {MODULE_INFO.grammar.empireTitle}
              </p>
              {attemptNumber > 1 && (
                <span className="px-2.5 py-0.5 rounded-full border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.1)] font-[family-name:var(--font-heading)] text-xs text-[#c9a84c] tracking-wide">
                  Attempt {attemptNumber}
                </span>
              )}
            </div>
          </motion.div>

          {/* Atmospheric Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlowingBorder intensity="medium">
              <MetallicCard hover={false} className="p-6 md:p-8">
                <div className="text-center">
                  <p className="font-[family-name:var(--font-sans)] text-[#c0c0c0] text-base md:text-lg leading-relaxed italic mb-3">
                    &ldquo;The foundation of every great empire rests upon the pillars of structure.
                    Grammar is the architecture of thought — without it, even the mightiest words crumble
                    into chaos. Prove your command of the structural foundations of English.&rdquo;
                  </p>
                  <p className="font-arabic text-[#8b7355] text-sm leading-relaxed mb-4" dir="rtl">
                    25 سؤال عبر 8 مواضيع نحوية. أكمل الجمل، حدد الأخطاء، وحوّل التراكيب. أثبت إتقانك لقواعد اللغة الإنجليزية.
                  </p>
                  <SectionDivider />
                  <div className="mt-4 space-y-2">
                    <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-wide">
                      25 QUESTIONS &middot; 8 TOPICS &middot; 3 QUESTION TYPES
                    </p>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs">
                      Completion &middot; Error Identification &middot; Transformation
                    </p>
                  </div>
                </div>
              </MetallicCard>
            </GlowingBorder>
          </motion.div>

          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-center text-[#c9a84c] text-lg mb-4 tracking-wide">
              Domains of Mastery
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {Object.entries(GRAMMAR_CONFIG.topics).map(([key, config]) => {
                const meta = TOPIC_META[key];
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + Object.keys(GRAMMAR_CONFIG.topics).indexOf(key) * 0.05 }}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm font-[family-name:var(--font-heading)] tracking-wide"
                    style={{
                      borderColor: `${meta.color}50`,
                      backgroundColor: `${meta.color}10`,
                      color: meta.color,
                    }}
                  >
                    <span className="mr-1.5">{meta.icon}</span>
                    {config.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Begin Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 text-center"
          >
            <ImperialButton variant="primary" size="lg" onClick={handleBegin}>
              <span className="flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Begin the Trial
              </span>
            </ImperialButton>
          </motion.div>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </motion.div>
  );

  // ─── Question Screen ─────────────────────────────────────

  const QuestionScreen = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <ParticleBackground />
          <main className="flex-1 flex items-center justify-center relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-4xl mb-4 animate-pulse">⚔️</div>
              <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg tracking-wide">
                Preparing your trial...
              </p>
            </motion.div>
          </main>
          <div className="mt-auto"><Footer /></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <ParticleBackground />
          <main className="flex-1 flex items-center justify-center relative z-10 px-4">
            <MetallicCard hover={false} className="p-8 max-w-md text-center">
              <XCircle className="w-12 h-12 text-[#e74c3c] mx-auto mb-4" />
              <p className="font-[family-name:var(--font-heading)] text-[#e74c3c] text-lg mb-4">{error}</p>
              <ImperialButton variant="secondary" onClick={() => fetchQuestions(false)}>
                Try Again
              </ImperialButton>
            </MetallicCard>
          </main>
          <div className="mt-auto"><Footer /></div>
        </div>
      );
    }

    if (!currentQuestion) return null;

    const topicMeta = TOPIC_META[currentTopic] ?? { label: currentTopic, icon: '📝', color: '#8b7355' };
    const typeMeta = TYPE_LABELS[currentType] ?? { label: currentType, color: '#8b7355' };

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ParticleBackground />

        <main className="flex-1 pt-20 pb-12 px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <ProgressBar
                value={currentIndex + 1}
                max={questions.length}
                label={`Question ${currentIndex + 1} of ${questions.length}`}
                size="md"
              />
            </motion.div>

            {/* Topic & Type indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center justify-between gap-2 mb-6"
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-[family-name:var(--font-heading)] tracking-wide"
                style={{
                  borderColor: `${topicMeta.color}50`,
                  backgroundColor: `${topicMeta.color}10`,
                  color: topicMeta.color,
                }}
              >
                <span>{topicMeta.icon}</span>
                {topicMeta.label}
              </div>
              <div
                className="px-3 py-1.5 rounded-full border text-xs font-[family-name:var(--font-heading)] tracking-wide"
                style={{
                  borderColor: `${typeMeta.color}40`,
                  backgroundColor: `${typeMeta.color}10`,
                  color: typeMeta.color,
                }}
              >
                {typeMeta.label}
              </div>
            </motion.div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <GlowingBorder intensity="low">
                  <MetallicCard hover={false} className="p-6 md:p-8">
                    {/* Question number */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                        <span className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm font-bold">
                          {currentIndex + 1}
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[rgba(201,168,76,0.2)] to-transparent" />
                    </div>

                    {/* Question text */}
                    <h2 className="font-[family-name:var(--font-sans)] text-[#e8e8e8] text-lg md:text-xl leading-relaxed mb-8">
                      {currentQuestion.questionText}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option: string, optIdx: number) => {
                        const isSelected = selectedOption === optIdx;
                        const isCorrect = isAnswered && optIdx === currentQuestion.correctAnswer;
                        const isWrong = isAnswered && isSelected && optIdx !== currentQuestion.correctAnswer;

                        let borderColor = 'rgba(201,168,76,0.15)';
                        let bgColor = 'from-[#111118] to-[#1a1a2e]';
                        let textColor = '#c0c0c0';

                        if (isSelected && !isAnswered) {
                          borderColor = 'rgba(201,168,76,0.6)';
                          bgColor = 'from-[rgba(201,168,76,0.1)] to-[rgba(201,168,76,0.05)]';
                          textColor = '#c9a84c';
                        }
                        if (isCorrect) {
                          borderColor = 'rgba(34,197,94,0.6)';
                          bgColor = 'from-[rgba(34,197,94,0.1)] to-[rgba(34,197,94,0.05)]';
                          textColor = '#22c55e';
                        }
                        if (isWrong) {
                          borderColor = 'rgba(239,68,68,0.6)';
                          bgColor = 'from-[rgba(239,68,68,0.1)] to-[rgba(239,68,68,0.05)]';
                          textColor = '#ef4444';
                        }

                        return (
                          <motion.button
                            key={optIdx}
                            className={`w-full text-left rounded-lg border bg-gradient-to-r ${bgColor} p-4 flex items-center gap-3 cursor-pointer transition-all duration-200`}
                            style={{ borderColor }}
                            onClick={() => handleSelectOption(optIdx)}
                            whileHover={!isAnswered ? { scale: 1.01, borderColor: 'rgba(201,168,76,0.4)' } : undefined}
                            whileTap={!isAnswered ? { scale: 0.99 } : undefined}
                            disabled={isAnswered}
                          >
                            {/* Option letter */}
                            <div
                              className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                              style={{
                                borderColor: isCorrect ? 'rgba(34,197,94,0.5)' : isWrong ? 'rgba(239,68,68,0.5)' : isSelected ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)',
                                backgroundColor: isCorrect ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : isSelected ? 'rgba(201,168,76,0.1)' : 'transparent',
                              }}
                            >
                              <span
                                className="font-[family-name:var(--font-heading)] text-sm font-bold"
                                style={{ color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? '#c9a84c' : '#8b7355' }}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                            </div>

                            {/* Option text */}
                            <span className="font-[family-name:var(--font-sans)] text-sm md:text-base" style={{ color: textColor }}>
                              {option}
                            </span>

                            {/* Correct/Wrong indicator */}
                            {isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-[#22c55e] ml-auto flex-shrink-0" />
                            )}
                            {isWrong && (
                              <XCircle className="w-5 h-5 text-[#ef4444] ml-auto flex-shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </MetallicCard>
                </GlowingBorder>
              </motion.div>
            </AnimatePresence>

            {/* Next button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-end"
            >
              <ImperialButton
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!isAnswered}
              >
                <span className="flex items-center gap-2">
                  {currentIndex + 1 >= questions.length ? 'Complete Trial' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </ImperialButton>
            </motion.div>
          </div>
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  };

  // ─── Results Screen ──────────────────────────────────────

  const ResultsScreen = () => {
    const totalCorrect = answers.filter((a) => a.isCorrect).length;

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ParticleBackground />

        <main className="flex-1 pt-24 pb-12 px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Trial Complete Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="text-5xl mb-4">🏆</div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#c9a84c] mb-2 tracking-wider">
                Trial Complete
              </h1>
              <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-base tracking-wide">
                The Foundation Trial has been conquered
              </p>
            </motion.div>

            {/* Score & Level Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlowingBorder intensity="high">
                <MetallicCard hover={false} className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* Level Badge */}
                    <div className="flex-shrink-0">
                      <ImperialRankBadge level={level} size="lg" />
                    </div>

                    {/* Score */}
                    <div className="flex-1 text-center md:text-left">
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-wide mb-1">
                        GRAMMAR MASTERY SCORE
                      </p>
                      <div className="flex items-baseline gap-2 justify-center md:justify-start">
                        <span className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[#c9a84c]">
                          {percentage}%
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm mt-2">
                        {totalCorrect} correct out of {questions.length} questions
                      </p>
                    </div>

                    {/* Score Ring Visual */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 md:w-28 md:h-28">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="rgba(201,168,76,0.1)"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="#c9a84c"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Target className="w-6 h-6 text-[#c9a84c]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>

            <SectionDivider />

            {/* Topic Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xl mb-4 tracking-wide text-center">
                Breakdown by Domain
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(GRAMMAR_CONFIG.topics).map(([key, config], idx) => {
                  const meta = TOPIC_META[key];
                  const score = topicScores[key] ?? { correct: 0, total: 0 };
                  const topicPct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                    >
                      <MetallicCard hover={false} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{meta.icon}</span>
                            <span className="font-[family-name:var(--font-heading)] text-sm text-[#e8e8e8] tracking-wide">
                              {config.label}
                            </span>
                          </div>
                          <span className="font-[family-name:var(--font-heading)] text-sm font-bold" style={{ color: meta.color }}>
                            {score.correct}/{score.total}
                          </span>
                        </div>
                        <ProgressBar
                          value={score.correct}
                          max={score.total}
                          showPercentage={false}
                          color={meta.color}
                          size="sm"
                        />
                        <div className="flex justify-between mt-1.5">
                          <span className="text-[10px] text-[#8b7355] font-[family-name:var(--font-heading)]">
                            {topicPct >= 80 ? 'Strong' : topicPct >= 50 ? 'Moderate' : 'Needs Work'}
                          </span>
                          <span className="text-[10px] font-[family-name:var(--font-heading)]" style={{ color: meta.color }}>
                            {topicPct}%
                          </span>
                        </div>
                      </MetallicCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <SectionDivider />

            {/* Radar / Strengths Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xl mb-4 tracking-wide text-center">
                Strengths & Weaknesses
              </h2>
              <GlowingBorder intensity="low">
                <MetallicCard hover={false} className="p-4 md:p-6">
                  {/* Visual radar representation */}
                  <div className="flex items-center justify-center mb-4">
                    <svg width="280" height="280" viewBox="0 0 280 280">
                      {/* Background circles */}
                      {[0.25, 0.5, 0.75, 1].map((r, i) => (
                        <circle
                          key={i}
                          cx="140" cy="140"
                          r={100 * r}
                          fill="none"
                          stroke="rgba(201,168,76,0.1)"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Axis lines and labels */}
                      {Object.entries(GRAMMAR_CONFIG.topics).map(([_key], idx) => {
                        const totalTopics = Object.keys(GRAMMAR_CONFIG.topics).length;
                        const angle = (2 * Math.PI * idx) / totalTopics - Math.PI / 2;
                        const x2 = 140 + 100 * Math.cos(angle);
                        const y2 = 140 + 100 * Math.sin(angle);
                        const labelR = 120;
                        const lx = 140 + labelR * Math.cos(angle);
                        const ly = 140 + labelR * Math.sin(angle);
                        const meta = TOPIC_META[_key];
                        const shortLabel = meta?.label.split(' ').map(w => w[0]).join('') ?? _key.slice(0, 3);

                        return (
                          <g key={_key}>
                            <line x1="140" y1="140" x2={x2} y2={y2} stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                            <text
                              x={lx}
                              y={ly}
                              fill={meta?.color ?? '#8b7355'}
                              fontSize="9"
                              fontFamily="var(--font-heading)"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {shortLabel}
                            </text>
                          </g>
                        );
                      })}

                      {/* Data polygon */}
                      {(() => {
                        const topics = Object.keys(GRAMMAR_CONFIG.topics);
                        const points = topics.map((key, idx) => {
                          const score = topicScores[key] ?? { correct: 0, total: 1 };
                          const pct = score.total > 0 ? score.correct / score.total : 0;
                          const angle = (2 * Math.PI * idx) / topics.length - Math.PI / 2;
                          const r = 100 * pct;
                          return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                        });
                        return (
                          <motion.polygon
                            points={points.join(' ')}
                            fill="rgba(201,168,76,0.15)"
                            stroke="#c9a84c"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        );
                      })()}

                      {/* Data points */}
                      {Object.entries(GRAMMAR_CONFIG.topics).map(([_key], idx) => {
                        const score = topicScores[_key] ?? { correct: 0, total: 1 };
                        const pct = score.total > 0 ? score.correct / score.total : 0;
                        const angle = (2 * Math.PI * idx) / Object.keys(GRAMMAR_CONFIG.topics).length - Math.PI / 2;
                        const r = 100 * pct;
                        const cx = 140 + r * Math.cos(angle);
                        const cy = 140 + r * Math.sin(angle);
                        const meta = TOPIC_META[_key];

                        return (
                          <motion.circle
                            key={_key}
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill={meta?.color ?? '#c9a84c'}
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ duration: 0.5, delay: 1 + idx * 0.05 }}
                          />
                        );
                      })}

                      {/* Center point */}
                      <circle cx="140" cy="140" r="3" fill="#c9a84c" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(GRAMMAR_CONFIG.topics).map(([key, config]) => {
                      const meta = TOPIC_META[key];
                      const score = topicScores[key] ?? { correct: 0, total: 0 };
                      const topicPct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

                      return (
                        <div key={key} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                          <span className="font-[family-name:var(--font-heading)] text-[#8b7355] truncate">
                            {config.label}
                          </span>
                          <span className="font-[family-name:var(--font-heading)] ml-auto" style={{ color: meta.color }}>
                            {topicPct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>

            <SectionDivider />

            {/* Level Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <MetallicCard hover={false} className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-[#c9a84c]" />
                  <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg tracking-wide">
                    Level Assessment
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {([0, 1, 2, 3] as ImperialLevel[]).map((lvl) => {
                    const isActive = lvl === level;
                    const rankColors = ['#8b7355', '#cd7f32', '#c9a84c', '#ff6b35'];
                    const rankLabels = ['Recruit', 'Initiate', 'Warrior', 'Champion'];
                    return (
                      <div key={lvl} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-40'}`}
                          style={{
                            borderColor: isActive ? rankColors[lvl] : 'rgba(139,115,85,0.3)',
                            backgroundColor: isActive ? `${rankColors[lvl]}20` : 'transparent',
                            boxShadow: isActive ? `0 0 12px ${rankColors[lvl]}40` : 'none',
                          }}
                        >
                          <span className="font-[family-name:var(--font-heading)] text-xs font-bold" style={{ color: isActive ? rankColors[lvl] : '#555' }}>
                            {lvl}
                          </span>
                        </div>
                        <span className={`font-[family-name:var(--font-heading)] text-[9px] tracking-wide ${isActive ? '' : 'opacity-40'}`} style={{ color: isActive ? rankColors[lvl] : '#555' }}>
                          {rankLabels[lvl]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm">
                  {level === 0 && 'Your structural foundations need reinforcement. Focus on the basics of English grammar.'}
                  {level === 1 && 'You have a basic grasp of English structure. Continue building your grammatical fortress.'}
                  {level === 2 && 'Your structural command is strong. A few areas need refinement to achieve mastery.'}
                  {level === 3 && 'Outstanding! Your command of English grammar is exemplary. You have mastered the structural foundations.'}
                </p>
              </MetallicCard>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <ImperialButton variant="secondary" onClick={handleRetry}>
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Retry Trial
                </span>
              </ImperialButton>
              <ImperialButton
                variant="primary"
                onClick={() => router.push('/assessment')}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Continue to Next Trial
                  <ArrowRight className="w-4 h-4" />
                </span>
              </ImperialButton>
            </motion.div>
          </div>
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' && <IntroScreen key="intro" />}
      {phase === 'questions' && <QuestionScreen key="questions" />}
      {phase === 'results' && <ResultsScreen key="results" />}
    </AnimatePresence>
  );
}
