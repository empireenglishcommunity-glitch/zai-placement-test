'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Clock, ChevronRight, BookOpen, Trophy, ArrowRight, Sparkles, Shield, Star } from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialButton,
  GlowingBorder,
  ProgressBar,
  SectionDivider,
  ImperialRankBadge,
  TacticalPanel,
  ContentProtection,
  EmpireWatermark,
  LegalNotice,
} from '@/components/empire';
import { VOCABULARY_CONFIG, VOCABULARY_LEVELS, MODULE_INFO, EMPIRE_COLORS } from '@/lib/constants';
import { IMPERIAL_RANKS, IMPERIAL_RANK_DESCRIPTIONS } from '@/lib/types';
import type { VocabularyBand, ImperialLevel } from '@/lib/types';

// ─── Types ─────────────────────────────────────────────────

interface ApiQuestion {
  id: string;
  module: string;
  type: string | null;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  isActive: boolean;
}

interface Answer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

interface BandResult {
  band: VocabularyBand;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

type Phase = 'intro' | 'questions' | 'results';

// ─── Constants ─────────────────────────────────────────────

const BAND_ORDER: VocabularyBand[] = ['1-500', '501-1000', '1001-2000', '2001-3000', '3001-5000'];

const BAND_COLORS: Record<VocabularyBand, string> = {
  '1-500': '#cd7f32',
  '501-1000': '#b8860b',
  '1001-2000': '#c9a84c',
  '2001-3000': '#d4a017',
  '3001-5000': '#ff6b35',
};

const BAND_ICONS: Record<VocabularyBand, string> = {
  '1-500': '🪨',
  '501-1000': '⚒️',
  '1001-2000': '🗡️',
  '2001-3000': '⚔️',
  '3001-5000': '🔥',
};

const VOCAB_SIZE_MAP: Record<VocabularyBand, number> = {
  '1-500': 500,
  '501-1000': 1000,
  '1001-2000': 2000,
  '2001-3000': 3000,
  '3001-5000': 5000,
};

// ─── Animation Variants ────────────────────────────────────

const fadeSlideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// ─── Helper: Extract Word from Question ────────────────────

function extractWord(questionText: string): string {
  const match = questionText.match(/"([^"]+)"/);
  return match ? match[1] : questionText.replace(/What does the word /, '').replace(/ mean\?/, '').trim();
}

// ─── Component ─────────────────────────────────────────────

export default function VocabularyAssessmentPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session tracking
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isResumed, setIsResumed] = useState(false);
  const sessionFetchedRef = useRef(false);

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  // Results
  const [bandResults, setBandResults] = useState<BandResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [estimatedVocabSize, setEstimatedVocabSize] = useState(0);
  const [assignedLevel, setAssignedLevel] = useState<ImperialLevel>(0);

  // ─── Helper: Get User ID ────────────────────────────────

  // ─── Get real user from next-auth ─────────────────────
  const { data: authSession, status: authStatus } = useSession();
  const realUserId = (authSession?.user as Record<string, unknown>)?.id as string || authSession?.user?.email || '';

  // ─── Helper: Get User ID ────────────────────────────────
  // Gets the REAL database user ID from next-auth session

  function getUserId(): string {
    // Use the real session user ID or email
    if (realUserId) return realUserId;
    if (typeof window === 'undefined') return '';
    try {
      const storedId = localStorage.getItem('empire-user-id') || sessionStorage.getItem('empire-user-id');
      if (storedId && storedId.length > 10) return storedId;
    } catch {}
    return '';
  }

  // ─── Fetch Active Session on Load ────────────────────────

  useEffect(() => {
    async function checkActiveSession() {
      try {
        setIsLoading(true);
        const userId = getUserId();
        const res = await fetch('/api/assessment/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, module: 'vocabulary' }),
        });
        if (!res.ok) throw new Error('Failed to fetch session');
        const data = await res.json();

        if (data.session) {
          setSessionId(data.session.id);
          setAttemptNumber(data.session.attemptNumber ?? 1);
          setIsResumed(data.session.isResumed ?? false);
          // Questions from session are already shuffled — use as-is
          setQuestions((data.session.questions as ApiQuestion[]) ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    if (!sessionFetchedRef.current) {
      sessionFetchedRef.current = true;
      checkActiveSession();
    }
  }, []);

  // ─── Timer Management ────────────────────────────────────

  const startTimer = useCallback(() => {
    setElapsedTime(0);
    questionStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - questionStartRef.current) / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ─── Start Trial ─────────────────────────────────────────

  const handleStartTrial = useCallback(async () => {
    // If we already have a resumed session with questions, just start
    if (isResumed && questions.length > 0 && sessionId) {
      setPhase('questions');
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setIsAnswered(false);
      startTimer();
      return;
    }

    try {
      setIsLoading(true);
      const userId = getUserId();
      const res = await fetch('/api/assessment/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, module: 'vocabulary', forceNew: false }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();

      if (data.session) {
        setSessionId(data.session.id);
        setAttemptNumber(data.session.attemptNumber ?? 1);
        setIsResumed(data.session.isResumed ?? false);
        setQuestions((data.session.questions as ApiQuestion[]) ?? []);
      }

      setPhase('questions');
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setIsAnswered(false);
      startTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start trial');
    } finally {
      setIsLoading(false);
    }
  }, [startTimer, isResumed, questions.length, sessionId]);

  // ─── Select Option ───────────────────────────────────────

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  }, [isAnswered]);

  // ─── Submit Results to API ───────────────────────────────

  const submitResults = useCallback(async (
    score: number,
    results: BandResult[],
    estSize: number,
    level: ImperialLevel
  ) => {
    try {
      setIsSubmitting(true);

      // Submit results to assessment API (skip for guests)
      const isGuest = typeof window !== 'undefined' && sessionStorage.getItem('empire-guest-mode') === 'true';
      if (isGuest || !getUserId()) {
        // Guest mode — don't save, just show results
        return;
      }
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          assessmentId: sessionId ?? 'demo-assessment',
          module: 'vocabulary',
          userId: getUserId(),
          answers: answers.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
          })),
          scores: {
            band1: results[0]?.percentage ?? 0,
            band2: results[1]?.percentage ?? 0,
            band3: results[2]?.percentage ?? 0,
            band4: results[3]?.percentage ?? 0,
            band5: results[4]?.percentage ?? 0,
            estimatedSize: estSize,
            overall: score,
            level,
          },
        }),
      });

      // Mark session as completed via PATCH
      if (sessionId) {
        await fetch('/api/assessment/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      }
    } catch {
      // Silently fail — results are shown regardless
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, sessionId]);

  // ─── Calculate Results ───────────────────────────────────

  const calculateResults = useCallback(() => {
    stopTimer();

    const totalCorrect = answers.filter(a => a.isCorrect).length;
    const score = Math.round((totalCorrect / questions.length) * 100);
    setOverallScore(score);

    // Per-band scores
    const results: BandResult[] = BAND_ORDER.map(band => {
      const bandQuestions = questions.filter(q => q.topic === band);
      const bandAnswers = answers.filter(a =>
        bandQuestions.some(q => q.id === a.questionId)
      );
      const correct = bandAnswers.filter(a => a.isCorrect).length;
      const total = bandQuestions.length;
      return {
        band,
        label: VOCABULARY_CONFIG.bands[band].label,
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
    setBandResults(results);

    // Estimate vocabulary size: highest band with >50% correct
    let estimatedSize = 0;
    for (const band of BAND_ORDER) {
      const bandResult = results.find(r => r.band === band);
      if (bandResult && bandResult.percentage > 50) {
        estimatedSize = VOCAB_SIZE_MAP[band];
      }
    }
    // If no band passes, estimate 250 (some baseline)
    if (estimatedSize === 0) estimatedSize = 250;
    setEstimatedVocabSize(estimatedSize);

    // Determine level using VOCABULARY_LEVELS
    let level: ImperialLevel = 0;
    for (const threshold of VOCABULARY_LEVELS) {
      if (estimatedSize >= threshold.min && estimatedSize <= threshold.max) {
        level = threshold.level;
        break;
      }
    }
    setAssignedLevel(level);
    setPhase('results');

    // Submit to API
    submitResults(score, results, estimatedSize, level);
  }, [answers, questions, stopTimer, submitResults]);

  // ─── Confirm & Next ──────────────────────────────────────

  const handleConfirmAnswer = useCallback(() => {
    if (selectedOption === null || isAnswered) return;

    const question = questions[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const timeTaken = Date.now() - questionStartRef.current;

    setIsAnswered(true);
    stopTimer();

    setAnswers(prev => [...prev, {
      questionId: question.id,
      selectedAnswer: selectedOption,
      isCorrect,
      timeTaken,
    }]);
  }, [selectedOption, isAnswered, questions, currentIndex, stopTimer]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Calculate results
      calculateResults();
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      startTimer();
    }
  }, [currentIndex, questions, calculateResults, startTimer]);

  // ─── Current Question Info ───────────────────────────────

  const currentQuestion = questions[currentIndex] ?? null;
  const currentBand = currentQuestion?.topic as VocabularyBand | undefined;
  const currentWord = currentQuestion ? extractWord(currentQuestion.questionText) : '';

  // ─── Format Time ─────────────────────────────────────────

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ─── Render: Loading ─────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-4">📖</div>
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xl">
              Summoning the Lexicon...
            </p>
            <div className="mt-4 w-48 mx-auto h-1 bg-[rgba(201,168,76,0.2)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#c9a84c] rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '40%' }}
              />
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Render: Error ───────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16 relative z-10">
          <MetallicCard className="max-w-md w-full mx-4 p-8 text-center" hover={false}>
            <div className="text-4xl mb-4">⚔️</div>
            <h2 className="font-[family-name:var(--font-heading)] text-[#e74c3c] text-xl mb-2">
              The Scrolls Are Sealed
            </h2>
            <p className="text-[#8b7355] mb-6">{error}</p>
            <Link href="/assessment">
              <ImperialButton variant="secondary">Return to Trials</ImperialButton>
            </Link>
          </MetallicCard>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Render: Intro Screen ────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
        <ContentProtection
          detectDevTools={true}
          blockShortcuts={true}
          blockContextMenu={true}
          blockPrint={true}
          detectVisibilityChange={false}
        />
        <ParticleBackground />
        <EmpireWatermark context="Vocabulary Trial" />
        <Navbar />
        <main className="flex-1 pt-20 pb-12 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Proprietary Content Banner */}
            <LegalNotice variant="banner" />
            {/* Hero */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                📖
              </motion.div>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#c9a84c] mb-3 tracking-wide">
                Trial of Words
              </h1>
              <p className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-lg sm:text-xl tracking-widest uppercase">
                {MODULE_INFO.vocabulary.empireTitle}
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlowingBorder color="gold" intensity="medium">
                <MetallicCard className="p-6 sm:p-8 text-center" hover={false} glowOnHover={false}>
                  <p className="text-[#c0c0c0] text-base sm:text-lg leading-relaxed mb-4 font-[family-name:var(--font-sans)]">
                    The Lexicon Trial tests the breadth and depth of your vocabulary across
                    five frequency bands. From the foundational words that form the bedrock of
                    communication to the elite vocabulary that marks true mastery, each band
                    reveals the true extent of your lexical command.
                  </p>
                  <p className="text-[#8b7355] text-sm italic font-[family-name:var(--font-sans)]">
                    &ldquo;A warrior without words is a blade without edge. Sharpen your lexicon, and command the battlefield of language.&rdquo;
                  </p>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>

            <SectionDivider />

            {/* Band Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl text-[#c9a84c] text-center mb-6 tracking-wide">
                The Five Rings of Lexicon
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {BAND_ORDER.map((band, idx) => (
                  <motion.div
                    key={band}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                  >
                    <MetallicCard className="p-4 text-center" hover={true}>
                      <div className="text-2xl mb-2">{BAND_ICONS[band]}</div>
                      <p
                        className="font-[family-name:var(--font-heading)] text-sm font-bold mb-1"
                        style={{ color: BAND_COLORS[band] }}
                      >
                        {VOCABULARY_CONFIG.bands[band].label}
                      </p>
                      <p className="text-[#8b7355] text-xs">
                        Band {band} &bull; {VOCABULARY_CONFIG.bands[band].questions} questions
                      </p>
                    </MetallicCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <SectionDivider />

            {/* Trial Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <TacticalPanel accentColor="#c9a84c" className="mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#c9a84c]" />
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm">Questions</p>
                      <p className="text-[#c0c0c0]">{VOCABULARY_CONFIG.totalQuestions} words</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-[rgba(201,168,76,0.2)]" />
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#c9a84c]" />
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm">Duration</p>
                      <p className="text-[#c0c0c0]">~5–10 minutes</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-[rgba(201,168,76,0.2)]" />
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#c9a84c]" />
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm">Reward</p>
                      <p className="text-[#c0c0c0]">Vocabulary Level + Est. Size</p>
                    </div>
                  </div>
                </div>
              </TacticalPanel>
            </motion.div>

            {/* Start Button */}
            <motion.div
              className="text-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <ImperialButton
                variant="primary"
                size="lg"
                onClick={handleStartTrial}
                className="gap-2"
              >
                <span>{isResumed ? 'Resume the Trial' : 'Begin the Trial'}</span>
                <ChevronRight className="w-5 h-5" />
              </ImperialButton>
              <p className="text-[#8b7355] text-xs mt-3 font-[family-name:var(--font-sans)]">
                {isResumed ? 'Your previous session has been restored' : 'The words await your command'}
              </p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Render: Question Screen ─────────────────────────────

  if (phase === 'questions' && currentQuestion) {
    const bandColor = currentBand ? BAND_COLORS[currentBand] : '#c9a84c';
    const bandLabel = currentBand ? VOCABULARY_CONFIG.bands[currentBand].label : '';
    const bandIcon = currentBand ? BAND_ICONS[currentBand] : '📖';
    const isLastQuestion = currentIndex === questions.length - 1;
    const correctAnswer = currentQuestion.correctAnswer;

    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
        <ContentProtection
          detectDevTools={true}
          blockShortcuts={true}
          blockContextMenu={true}
          blockPrint={true}
          detectVisibilityChange={true}
        />
        <ParticleBackground />
        <EmpireWatermark context="Vocabulary Trial — Active" />
        <Navbar />
        <main className="flex-1 pt-20 pb-12 relative z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Active Assessment Banner */}
            <LegalNotice variant="banner" />
            {/* Header: Progress + Timer */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    Question {currentIndex + 1}
                  </span>
                  <span className="text-[rgba(201,168,76,0.3)]">|</span>
                  <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm">
                    {questions.length} Total
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#c9a84c]">
                  <Clock className="w-4 h-4" />
                  <span className="font-[family-name:var(--font-heading)] text-sm tabular-nums">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={currentIndex + 1}
                max={questions.length}
                showPercentage={true}
                color={bandColor}
                size="md"
              />
            </motion.div>

            {/* Band Indicator */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                style={{
                  borderColor: `${bandColor}40`,
                  backgroundColor: `${bandColor}10`,
                  boxShadow: `0 0 10px ${bandColor}20`,
                }}
              >
                <span className="text-base">{bandIcon}</span>
                <span
                  className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wide"
                  style={{ color: bandColor }}
                >
                  {bandLabel}
                </span>
                <span className="text-[#8b7355] text-xs">
                  (Band {currentBand})
                </span>
              </div>
            </motion.div>

            {/* Word Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <GlowingBorder color="gold" intensity={isAnswered && selectedOption === correctAnswer ? 'high' : 'medium'}>
                  <MetallicCard className="p-6 sm:p-8 text-center mb-8" hover={false} glowOnHover={false}>
                    <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)] mb-2 uppercase tracking-widest">
                      Define this word
                    </p>
                    <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#c9a84c] tracking-wide">
                      {currentWord}
                    </h2>
                  </MetallicCard>
                </GlowingBorder>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectOption = idx === correctAnswer;
                      const showCorrect = isAnswered && isCorrectOption;
                      const showWrong = isAnswered && isSelected && !isCorrectOption;

                      return (
                        <motion.div key={idx} variants={staggerItem}>
                          <button
                            type="button"
                            onClick={() => handleSelectOption(idx)}
                            disabled={isAnswered}
                            className="w-full text-left"
                          >
                            <div
                              className={`relative rounded-lg border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                                showCorrect
                                  ? 'border-[#4ade80] bg-[rgba(74,222,128,0.08)]'
                                  : showWrong
                                    ? 'border-[#e74c3c] bg-[rgba(231,76,60,0.08)]'
                                    : isSelected
                                      ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.08)]'
                                      : 'border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[#111118] to-[#1a1a2e] hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.04)]'
                              }`}
                              style={
                                isSelected && !isAnswered
                                  ? { boxShadow: '0 0 20px rgba(201,168,76,0.15), inset 0 0 10px rgba(201,168,76,0.05)' }
                                  : showCorrect
                                    ? { boxShadow: '0 0 20px rgba(74,222,128,0.15)' }
                                    : showWrong
                                      ? { boxShadow: '0 0 20px rgba(231,76,60,0.15)' }
                                      : undefined
                              }
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Option Letter */}
                                <div
                                  className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center font-[family-name:var(--font-heading)] text-sm font-bold transition-colors duration-300 ${
                                    showCorrect
                                      ? 'border-[#4ade80] text-[#4ade80] bg-[rgba(74,222,128,0.1)]'
                                      : showWrong
                                        ? 'border-[#e74c3c] text-[#e74c3c] bg-[rgba(231,76,60,0.1)]'
                                        : isSelected
                                          ? 'border-[#c9a84c] text-[#c9a84c] bg-[rgba(201,168,76,0.1)]'
                                          : 'border-[rgba(201,168,76,0.25)] text-[#8b7355]'
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                {/* Option Text */}
                                <span
                                  className={`text-sm sm:text-base font-[family-name:var(--font-sans)] ${
                                    showCorrect
                                      ? 'text-[#4ade80]'
                                      : showWrong
                                        ? 'text-[#e74c3c]'
                                        : isSelected
                                          ? 'text-[#e8d48b]'
                                          : 'text-[#c0c0c0]'
                                  }`}
                                >
                                  {option}
                                </span>
                                {/* Correct/Wrong Indicator */}
                                {isAnswered && isCorrectOption && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-auto flex-shrink-0"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-[rgba(74,222,128,0.15)] flex items-center justify-center">
                                      <span className="text-[#4ade80] text-sm">&#10003;</span>
                                    </div>
                                  </motion.div>
                                )}
                                {isAnswered && isSelected && !isCorrectOption && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-auto flex-shrink-0"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-[rgba(231,76,60,0.15)] flex items-center justify-center">
                                      <span className="text-[#e74c3c] text-sm">&#10007;</span>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  {!isAnswered ? (
                    <ImperialButton
                      variant="primary"
                      size="lg"
                      onClick={handleConfirmAnswer}
                      disabled={selectedOption === null}
                      className="gap-2 min-w-[200px]"
                    >
                      <span>Confirm Answer</span>
                      <Shield className="w-5 h-5" />
                    </ImperialButton>
                  ) : (
                    <ImperialButton
                      variant={isLastQuestion ? 'primary' : 'secondary'}
                      size="lg"
                      onClick={handleNextQuestion}
                      className="gap-2 min-w-[200px]"
                    >
                      <span>{isLastQuestion ? 'View Results' : 'Next Word'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </ImperialButton>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Render: Results Screen ──────────────────────────────

  if (phase === 'results') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] protected-content">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 pt-20 pb-12 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Hero */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <ImperialRankBadge level={assignedLevel} size="lg" />
              </motion.div>
              <motion.h1
                className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#c9a84c] mb-2 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Trial Complete
              </motion.h1>
              <motion.p
                className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-lg tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {MODULE_INFO.vocabulary.empireTitle}
              </motion.p>
              {attemptNumber > 1 && (
                <motion.p
                  className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm mt-1 tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  Attempt #{attemptNumber}
                </motion.p>
              )}
            </motion.div>

            {/* Level & Vocab Size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlowingBorder color="gold" intensity="high">
                <MetallicCard className="p-6 sm:p-8" hover={false} glowOnHover={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-2">
                        Imperial Rank
                      </p>
                      <p
                        className="font-[family-name:var(--font-heading)] text-2xl font-bold"
                        style={{
                          color: assignedLevel === 0 ? '#8b7355'
                            : assignedLevel === 1 ? '#cd7f32'
                              : assignedLevel === 2 ? '#c9a84c'
                                : '#ff6b35',
                        }}
                      >
                        {IMPERIAL_RANKS[assignedLevel]}
                      </p>
                      <p className="text-[#8b7355] text-xs mt-1 font-[family-name:var(--font-sans)]">
                        {IMPERIAL_RANK_DESCRIPTIONS[assignedLevel]}
                      </p>
                    </div>
                    <div className="sm:border-x sm:border-[rgba(201,168,76,0.15)]">
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-2">
                        Estimated Vocabulary
                      </p>
                      <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#c9a84c]">
                        ~{estimatedVocabSize.toLocaleString()}
                      </p>
                      <p className="text-[#8b7355] text-xs mt-1 font-[family-name:var(--font-sans)]">
                        words
                      </p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-2">
                        Overall Score
                      </p>
                      <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#c9a84c]">
                        {overallScore}%
                      </p>
                      <p className="text-[#8b7355] text-xs mt-1 font-[family-name:var(--font-sans)]">
                        {answers.filter(a => a.isCorrect).length} of {questions.length} correct
                      </p>
                    </div>
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>

            <SectionDivider />

            {/* Band Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl text-[#c9a84c] text-center mb-6 tracking-wide">
                Score by Frequency Band
              </h2>
              <div className="space-y-3">
                {bandResults.map((result, idx) => (
                  <motion.div
                    key={result.band}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + idx * 0.1 }}
                  >
                    <MetallicCard className="p-4" hover={false} glowOnHover={false}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-xl flex-shrink-0">{BAND_ICONS[result.band]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="font-[family-name:var(--font-heading)] text-sm font-bold truncate"
                                style={{ color: BAND_COLORS[result.band] }}
                              >
                                {result.label}
                              </span>
                              <span className="text-[#8b7355] text-xs flex-shrink-0">
                                (Band {result.band})
                              </span>
                            </div>
                            <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#c9a84c] flex-shrink-0 ml-2">
                              {result.correct}/{result.total}
                            </span>
                          </div>
                          <ProgressBar
                            value={result.percentage}
                            max={100}
                            showPercentage={true}
                            color={BAND_COLORS[result.band]}
                            size="sm"
                          />
                        </div>
                      </div>
                    </MetallicCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <SectionDivider />

            {/* Visual Vocabulary Size Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <TacticalPanel accentColor="#c9a84c" className="mb-8">
                <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm uppercase tracking-widest mb-4 text-center">
                  Vocabulary Size Spectrum
                </h3>
                <div className="relative w-full h-12 rounded-full bg-gradient-to-r from-[#8b7355] via-[#cd7f32] via-[#c9a84c] to-[#ff6b35] opacity-30 mb-2" />
                <div className="relative w-full">
                  {/* Marker */}
                  <motion.div
                    className="absolute top-0 -translate-x-1/2"
                    initial={{ left: '0%' }}
                    animate={{ left: `${Math.min((estimatedVocabSize / 5000) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 1.5 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#c9a84c] shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
                      <div className="w-px h-3 bg-[#c9a84c]" />
                      <span className="font-[family-name:var(--font-heading)] text-xs text-[#c9a84c] whitespace-nowrap">
                        ~{estimatedVocabSize.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                  {/* Scale labels */}
                  <div className="flex justify-between mt-12">
                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">0</span>
                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">1,250</span>
                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">2,500</span>
                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">3,750</span>
                    <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">5,000+</span>
                  </div>
                </div>
              </TacticalPanel>
            </motion.div>

            {/* Level Thresholds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] text-center mb-4 tracking-wide">
                Level Thresholds
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {VOCABULARY_LEVELS.map((threshold, idx) => {
                  const isActive = threshold.level === assignedLevel;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: isActive ? 1.05 : 1 }}
                      transition={{ delay: 1.6 + idx * 0.1 }}
                    >
                      <MetallicCard
                        className={`p-3 text-center ${isActive ? 'ring-1 ring-[#c9a84c]' : ''}`}
                        hover={false}
                        glowOnHover={false}
                      >
                        <div className="text-lg mb-1">
                          {idx === 0 ? '🗡️' : idx === 1 ? '⚔️' : idx === 2 ? '🛡️' : '👑'}
                        </div>
                        <p
                          className="font-[family-name:var(--font-heading)] text-xs font-bold"
                          style={{
                            color: idx === 0 ? '#8b7355'
                              : idx === 1 ? '#cd7f32'
                                : idx === 2 ? '#c9a84c'
                                  : '#ff6b35',
                          }}
                        >
                          {IMPERIAL_RANKS[threshold.level]}
                        </p>
                        <p className="text-[#8b7355] text-[10px] mt-1">
                          {threshold.min === 0 ? '0' : threshold.min.toLocaleString()}–{threshold.max.toLocaleString()} words
                        </p>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-1"
                          >
                            <Star className="w-4 h-4 text-[#c9a84c] mx-auto" />
                          </motion.div>
                        )}
                      </MetallicCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="text-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <ImperialButton variant="primary" size="lg" className="gap-2">
                    <span>Continue to Next Trial</span>
                    <ChevronRight className="w-5 h-5" />
                  </ImperialButton>
                </Link>
                {typeof window !== 'undefined' && sessionStorage.getItem('empire-guest-mode') === 'true' && (
                  <Link href="/register">
                    <ImperialButton variant="outline" size="lg" className="gap-2 border-[#c9a84c]">
                      <span>Create Account to Save Progress</span>
                    </ImperialButton>
                  </Link>
                )}
                <ImperialButton
                  variant="outline"
                  size="lg"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const userId = getUserId();
                      const res = await fetch('/api/assessment/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, module: 'vocabulary', forceNew: true }),
                      });
                      if (!res.ok) {
                        const errData = await res.json().catch(() => null);
                        if (res.status === 429 && errData?.message) {
                          setError(errData.message);
                        }
                        throw new Error('Failed to create new session');
                      }
                      const data = await res.json();
                      if (data.session) {
                        setSessionId(data.session.id);
                        setAttemptNumber(data.session.attemptNumber ?? attemptNumber + 1);
                        setIsResumed(false);
                        setQuestions((data.session.questions as ApiQuestion[]) ?? []);
                      }
                      setPhase('intro');
                      setCurrentIndex(0);
                      setAnswers([]);
                      setSelectedOption(null);
                      setIsAnswered(false);
                      setElapsedTime(0);
                    } catch {
                      // If retake fails, still go to intro (may show error)
                      setPhase('intro');
                      setCurrentIndex(0);
                      setAnswers([]);
                      setSelectedOption(null);
                      setIsAnswered(false);
                      setElapsedTime(0);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Retake Trial</span>
                </ImperialButton>
              </div>
              {isSubmitting && (
                <p className="text-[#8b7355] text-xs mt-3 font-[family-name:var(--font-sans)]">
                  Saving results to the Imperial Archives...
                </p>
              )}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback
  return null;
}
