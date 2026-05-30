'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Mic,
  Headphones,
  BookOpen,
  Swords,
  Trophy,
  Shield,
  AlertTriangle,
  ChevronRight,
  Star,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  Crown,
  Download,
  Mail,
} from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialRankBadge,
  ProgressBar,
  TacticalPanel,
  SectionDivider,
  ImperialButton,
  GlowingBorder,
  EmpireCertificate,
  CelebrationAnimation,
  EmpireWatermark,
  ContentProtection,
  LegalNotice,
} from '@/components/empire';
import { MODULE_INFO } from '@/lib/constants';
import {
  IMPERIAL_RANKS,
  IMPERIAL_RANK_DESCRIPTIONS,
} from '@/lib/types';
import type { ImperialLevel, LevelAssignment } from '@/lib/types';
import { getLevelColor } from '@/services/scoring-service';

// ─── Types ────────────────────────────────────────────────

interface ResultsData {
  speakingScore: number;
  listeningScore: number;
  vocabularyScore: number;
  grammarScore: number;
  levelAssignment: LevelAssignment;
}

// ─── Mock Data ────────────────────────────────────────────

const mockResults: ResultsData = {
  speakingScore: 62,
  listeningScore: 71,
  vocabularyScore: 1500,
  grammarScore: 68,
  levelAssignment: {
    speakingLevel: 2 as ImperialLevel,
    listeningLevel: 2 as ImperialLevel,
    vocabularyLevel: 2 as ImperialLevel,
    grammarLevel: 2 as ImperialLevel,
    finalLevel: 2 as ImperialLevel,
    isFlagged: false,
    strengths: ['Speaking', 'Listening', 'Vocabulary', 'Grammar'],
    weaknesses: [],
    recommendedPath:
      'Embark on the Warrior Path: Master advanced grammar (conditionals, passive voice), push vocabulary to 3000+ words, train with fast listening, and develop natural speaking rhythm.',
  },
};

// ─── Enhanced Particle Background ─────────────────────────

function EnhancedParticleBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 20,
        opacity: Math.random() * 0.4 + 0.15,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#c9a84c]"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            animation: `float ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Module Config ────────────────────────────────────────

const MODULE_CARDS = [
  { key: 'speaking' as const, icon: Mic, label: 'Speaking', empireTitle: MODULE_INFO.speaking.empireTitle, scoreKey: 'speakingScore' as const, levelKey: 'speakingLevel' as const, maxScore: 100 },
  { key: 'listening' as const, icon: Headphones, label: 'Listening', empireTitle: MODULE_INFO.listening.empireTitle, scoreKey: 'listeningScore' as const, levelKey: 'listeningLevel' as const, maxScore: 100 },
  { key: 'vocabulary' as const, icon: BookOpen, label: 'Vocabulary', empireTitle: MODULE_INFO.vocabulary.empireTitle, scoreKey: 'vocabularyScore' as const, levelKey: 'vocabularyLevel' as const, maxScore: 5000 },
  { key: 'grammar' as const, icon: Swords, label: 'Grammar', empireTitle: MODULE_INFO.grammar.empireTitle, scoreKey: 'grammarScore' as const, levelKey: 'grammarLevel' as const, maxScore: 100 },
];

const WEAKNESS_SUGGESTIONS: Record<string, string> = {
  Speaking: 'Practice read-aloud exercises daily and record yourself for self-review.',
  Listening: 'Train with slower audio first, then gradually increase speed.',
  Vocabulary: 'Use spaced repetition flashcards and read extensively.',
  Grammar: 'Focus on one grammar topic at a time with targeted exercises.',
};

// ─── Animation Variants ──────────────────────────────────

const ceremonyVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.5, ease: 'easeOut' },
  },
};

const rankRevealVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 1.2 },
  },
};

const rankNameVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1.8, ease: 'easeOut' },
  },
};

const moduleCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 2.5 + i * 0.15, ease: 'easeOut' },
  }),
};

const strengthsVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 3.5, ease: 'easeOut' },
  },
};

const weaknessesVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 3.7, ease: 'easeOut' },
  },
};

const pathVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 4.2, ease: 'easeOut' },
  },
};

const flagVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 4.0, ease: 'easeOut' },
  },
};

const actionsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 4.8, ease: 'easeOut' },
  },
};

// ─── Loading Fallback ──────────────────────────────────────

function ResultsLoading() {
  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Crown className="w-16 h-16 text-[#c9a84c] mx-auto" />
          </motion.div>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-2">
              Consulting the Imperial Archives
            </h2>
            <p className="text-[#8b7355] font-[family-name:var(--font-sans)]">
              Analyzing your trial results...
            </p>
          </div>
          <Loader2 className="w-6 h-6 text-[#c9a84c] mx-auto animate-spin" />
        </motion.div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────

function ResultsContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessmentId');
  const { data: session } = useSession();

  const [results, setResults] = useState<ResultsData | null>(assessmentId ? null : mockResults);
  const [loading, setLoading] = useState(!!assessmentId);
  const [error, setError] = useState<string | null>(null);
  const [showCeremony, setShowCeremony] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load results from API when assessmentId is provided
  useEffect(() => {
    if (!assessmentId) return;

    let cancelled = false;

    fetch('/api/assessment/calculate-level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        speakingScore: 55,
        listeningScore: 65,
        vocabularyScore: 1200,
        grammarScore: 58,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.result) {
          setResults({
            speakingScore: 55,
            listeningScore: 65,
            vocabularyScore: 1200,
            grammarScore: 58,
            levelAssignment: data.result,
          });
        } else {
          setError(data.error || 'Failed to calculate level');
          setResults(mockResults);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Could not load assessment data. Showing demo results.');
        setResults(mockResults);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [assessmentId]);

  // Trigger ceremony animation after results are loaded
  useEffect(() => {
    if (results) {
      // Show celebration animation first
      setShowCelebration(true);
    }
  }, [results]);

  // Send results email after celebration completes
  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setShowCeremony(true);

    // Auto-send email if user is logged in
    if (session?.user && results && !emailSent) {
      setEmailSending(true);
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: session.user.name || session.user.email || 'Student',
          studentEmail: session.user.email,
          speakingScore: results.speakingScore,
          listeningScore: results.listeningScore,
          vocabularyScore: results.vocabularyScore,
          grammarScore: results.grammarScore,
          finalLevel: results.levelAssignment.finalLevel,
          completionTimestamp: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then(() => setEmailSent(true))
        .catch(() => {/* Email sending failed silently */})
        .finally(() => setEmailSending(false));
    }
  }, [session, results, emailSent]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Crown className="w-16 h-16 text-[#c9a84c] mx-auto" />
            </motion.div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-2">
                Consulting the Imperial Archives
              </h2>
              <p className="text-[#8b7355] font-[family-name:var(--font-sans)]">
                Analyzing your trial results...
              </p>
            </div>
            <Loader2 className="w-6 h-6 text-[#c9a84c] mx-auto animate-spin" />
          </motion.div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  if (!results) return null;

  const { levelAssignment: assignment } = results;
  const finalColor = getLevelColor(assignment.finalLevel);

  // Celebration Animation Overlay
  const celebrationOverlay = showCelebration && results ? (
    <CelebrationAnimation
      rankName={IMPERIAL_RANKS[assignment.finalLevel]}
      finalLevel={assignment.finalLevel}
      onComplete={handleCelebrationComplete}
    />
  ) : null;

  return (
    <div className="min-h-screen flex flex-col empire-bg protected-content">
      <ContentProtection
        detectDevTools={true}
        blockShortcuts={true}
        blockContextMenu={true}
        blockPrint={false}
        detectVisibilityChange={false}
      />
      <EnhancedParticleBackground />
      <EmpireWatermark context="Imperial Decree — Results" />
      <Navbar />

      {/* Celebration Animation Overlay */}
      {celebrationOverlay}

      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {showCeremony && (
            <motion.div
              key="ceremony"
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* ═══ Ceremony Header ═══ */}
              <motion.section variants={ceremonyVariants} className="text-center space-y-2">
                <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-[0.3em] uppercase">
                  The Imperial Decree
                </p>
                <motion.h1
                  className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-7xl font-bold gold-shimmer leading-tight"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.1)',
                      '0 0 40px rgba(201,168,76,0.6), 0 0 80px rgba(201,168,76,0.2)',
                      '0 0 20px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.1)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  The Empire Has Spoken
                </motion.h1>
                <p className="text-[#8b7355] text-base font-[family-name:var(--font-sans)] italic max-w-lg mx-auto">
                  Through fire and trial, your worth has been measured. Behold your rank.
                </p>
              </motion.section>

              {/* ═══ Rank Reveal ═══ */}
              <motion.section className="flex flex-col items-center gap-4 py-8">
                {/* Glow burst behind badge */}
                <motion.div
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2, 1.5],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{ duration: 1.5, delay: 1.0 }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${finalColor}60, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Rank badge */}
                <motion.div variants={rankRevealVariants} className="relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        `0 0 20px ${finalColor}30, 0 0 40px ${finalColor}15`,
                        `0 0 40px ${finalColor}60, 0 0 80px ${finalColor}30`,
                        `0 0 20px ${finalColor}30, 0 0 40px ${finalColor}15`,
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-full p-4"
                  >
                    <ImperialRankBadge
                      level={assignment.finalLevel}
                      size="lg"
                      showLabel={false}
                    />
                  </motion.div>
                </motion.div>

                {/* Rank name */}
                <motion.div variants={rankNameVariants} className="text-center space-y-2">
                  <h2
                    className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold"
                    style={{ color: finalColor }}
                  >
                    {IMPERIAL_RANKS[assignment.finalLevel]}
                  </h2>
                  <p className="text-[#8b7355] text-sm sm:text-base max-w-md mx-auto font-[family-name:var(--font-sans)] italic">
                    {IMPERIAL_RANK_DESCRIPTIONS[assignment.finalLevel]}
                  </p>
                </motion.div>
              </motion.section>

              <SectionDivider />

              {/* ═══ Module Breakdown ═══ */}
              <motion.section className="space-y-6">
                <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
                  The Four Trials — Performance Breakdown
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MODULE_CARDS.map((mod, i) => {
                    const score = results[mod.scoreKey];
                    const level = assignment[mod.levelKey];
                    const levelColor = getLevelColor(level);
                    const isStrength = assignment.strengths.includes(mod.label);
                    const isWeakness = assignment.weaknesses.includes(mod.label);
                    const displayScore = mod.maxScore === 5000
                      ? `~${score.toLocaleString()} words`
                      : `${score}%`;
                    const progressValue = mod.maxScore === 5000
                      ? Math.min((score / 5000) * 100, 100)
                      : score;

                    return (
                      <motion.div
                        key={mod.key}
                        custom={i}
                        variants={moduleCardVariants}
                      >
                        <MetallicCard className="p-5 h-full flex flex-col">
                          {/* Module header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className="w-10 h-10 rounded-full border flex items-center justify-center"
                              style={{
                                borderColor: `${levelColor}50`,
                                backgroundColor: `${levelColor}10`,
                              }}
                            >
                              <mod.icon className="w-5 h-5" style={{ color: levelColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-sm font-semibold truncate">
                                {mod.label}
                              </h3>
                              <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] truncate">
                                {mod.empireTitle}
                              </p>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">Score</span>
                              <span
                                className="font-[family-name:var(--font-heading)] text-sm font-bold"
                                style={{ color: levelColor }}
                              >
                                {displayScore}
                              </span>
                            </div>
                            <ProgressBar
                              value={progressValue}
                              max={100}
                              showPercentage={false}
                              color={levelColor}
                              size="sm"
                            />
                          </div>

                          {/* Level badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">Imperial Level</span>
                            <div className="flex items-center gap-2">
                              <ImperialRankBadge level={level} size="sm" />
                            </div>
                          </div>

                          {/* Assessment label */}
                          <div className="mt-auto pt-3 border-t border-[rgba(201,168,76,0.1)]">
                            {isStrength ? (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a84c]" />
                                <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)]">Strength</span>
                              </div>
                            ) : isWeakness ? (
                              <div className="flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-[#8b7355]" />
                                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">Needs Work</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-[#8b7355]" />
                                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">On Track</span>
                              </div>
                            )}
                          </div>
                        </MetallicCard>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>

              <SectionDivider />

              {/* ═══ Strengths & Weaknesses ═══ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <motion.section variants={strengthsVariants} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#c9a84c]" />
                    <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl">
                      Strengths
                    </h2>
                  </div>
                  <TacticalPanel accentSide="left" accentColor="#c9a84c">
                    {assignment.strengths.length > 0 ? (
                      <div className="space-y-3">
                        {assignment.strengths.map((strength, i) => {
                          const mod = MODULE_CARDS.find((m) => m.label === strength);
                          const level = mod ? assignment[mod.levelKey] : assignment.finalLevel;
                          return (
                            <motion.div
                              key={strength}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 3.8 + i * 0.1 }}
                              className="flex items-start gap-3 py-2 border-b border-[rgba(201,168,76,0.08)] last:border-b-0"
                            >
                              <div className="mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-[#c9a84c]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#e8e0d0] text-sm font-[family-name:var(--font-heading)]">
                                    {strength}
                                  </span>
                                  <span
                                    className="text-[10px] font-[family-name:var(--font-heading)] px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: getLevelColor(level),
                                      borderColor: `${getLevelColor(level)}30`,
                                      backgroundColor: `${getLevelColor(level)}10`,
                                    }}
                                  >
                                    {IMPERIAL_RANKS[level]}
                                  </span>
                                </div>
                                <p className="text-[#8b7355] text-xs mt-0.5 font-[family-name:var(--font-sans)]">
                                  Performing at or above your overall level
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[#8b7355] text-sm italic font-[family-name:var(--font-sans)]">
                        Continue your training to develop your strengths.
                      </p>
                    )}
                  </TacticalPanel>
                </motion.section>

                {/* Weaknesses */}
                <motion.section variants={weaknessesVariants} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#8b7355]" />
                    <h2 className="font-[family-name:var(--font-heading)] text-[#8b7355] text-2xl">
                      Areas for Improvement
                    </h2>
                  </div>
                  <TacticalPanel accentSide="left" accentColor="#8b7355">
                    {assignment.weaknesses.length > 0 ? (
                      <div className="space-y-3">
                        {assignment.weaknesses.map((weakness, i) => {
                          const mod = MODULE_CARDS.find((m) => m.label === weakness);
                          const level = mod ? assignment[mod.levelKey] : 0;
                          return (
                            <motion.div
                              key={weakness}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 4.0 + i * 0.1 }}
                              className="flex items-start gap-3 py-2 border-b border-[rgba(201,168,76,0.08)] last:border-b-0"
                            >
                              <div className="mt-0.5">
                                <XCircle className="w-4 h-4 text-[#8b7355]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#e8e0d0] text-sm font-[family-name:var(--font-heading)]">
                                    {weakness}
                                  </span>
                                  <span
                                    className="text-[10px] font-[family-name:var(--font-heading)] px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: getLevelColor(level),
                                      borderColor: `${getLevelColor(level)}30`,
                                      backgroundColor: `${getLevelColor(level)}10`,
                                    }}
                                  >
                                    {IMPERIAL_RANKS[level]}
                                  </span>
                                </div>
                                <p className="text-[#8b7355] text-xs mt-0.5 font-[family-name:var(--font-sans)]">
                                  {WEAKNESS_SUGGESTIONS[weakness] || 'Focus additional practice on this area.'}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2">
                        <CheckCircle2 className="w-5 h-5 text-[#c9a84c]" />
                        <div>
                          <p className="text-[#c9a84c] text-sm font-[family-name:var(--font-heading)]">
                            No Weaknesses Detected
                          </p>
                          <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">
                            All modules performing at or above your Imperial Level.
                          </p>
                        </div>
                      </div>
                    )}
                  </TacticalPanel>
                </motion.section>
              </div>

              <SectionDivider />

              {/* ═══ Flag Notice ═══ */}
              {assignment.isFlagged && (
                <motion.section variants={flagVariants}>
                  <GlowingBorder color="fire" intensity="high" className="rounded-lg">
                    <MetallicCard hover={false} glowOnHover={false} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[#ff6b35] flex items-center justify-center bg-[rgba(255,107,53,0.1)] shrink-0">
                          <AlertTriangle className="w-6 h-6 text-[#ff6b35]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-[family-name:var(--font-heading)] text-[#ff6b35] text-lg font-bold mb-1">
                            Imperial Review Required
                          </h3>
                          <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-sans)] mb-2">
                            Your assessment results show significant variation across modules. An Imperial instructor will review your performance.
                          </p>
                          {assignment.flagReason && (
                            <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)] italic border-l-2 border-[rgba(255,107,53,0.3)] pl-3">
                              {assignment.flagReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </MetallicCard>
                  </GlowingBorder>
                </motion.section>
              )}

              {/* ═══ Recommended Path ═══ */}
              <motion.section variants={pathVariants} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#cd7f32]" />
                  <h2 className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-2xl">
                    Your Imperial Training Path
                  </h2>
                </div>
                <TacticalPanel accentSide="left" accentColor={finalColor}>
                  <div className="space-y-4">
                    {/* Rank & Path Name */}
                    <div className="flex items-center gap-3">
                      <ImperialRankBadge level={assignment.finalLevel} size="sm" />
                      <div>
                        <p className="font-[family-name:var(--font-heading)] text-sm font-semibold" style={{ color: finalColor }}>
                          {IMPERIAL_RANKS[assignment.finalLevel]} — {assignment.finalLevel === 0 ? 'Foundation' : assignment.finalLevel === 1 ? 'Initiate' : assignment.finalLevel === 2 ? 'Warrior' : 'Champion'} Path
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                    {/* Path Description */}
                    <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-sans)] leading-relaxed">
                      {assignment.recommendedPath}
                    </p>

                    <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                    {/* Next Milestone */}
                    {assignment.finalLevel < 3 && (
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 text-[#cd7f32] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[#cd7f32] text-sm font-[family-name:var(--font-heading)]">
                            Next Rank: {IMPERIAL_RANKS[(assignment.finalLevel + 1) as ImperialLevel]}
                          </p>
                          <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)] mt-0.5">
                            Focus on your weaker modules to advance to the next Imperial Rank.
                          </p>
                        </div>
                      </div>
                    )}

                    {assignment.finalLevel === 3 && (
                      <div className="flex items-start gap-3">
                        <Crown className="w-4 h-4 text-[#ff6b35] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[#ff6b35] text-sm font-[family-name:var(--font-heading)]">
                            Maximum Rank Achieved
                          </p>
                          <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)] mt-0.5">
                            You stand among the Empire&apos;s finest. Continue to refine your mastery.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TacticalPanel>
              </motion.section>

              <SectionDivider />

              {/* ═══ Action Buttons ═══ */}
              <motion.section
                variants={actionsVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-4"
              >
                <Link href="/dashboard">
                  <ImperialButton variant="outline" size="lg">
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Return to Dashboard
                    </span>
                  </ImperialButton>
                </Link>
                <Link href="/assessment">
                  <ImperialButton variant="primary" size="lg">
                    <span className="flex items-center gap-2">
                      <Swords className="w-5 h-5" />
                      Begin Training
                    </span>
                  </ImperialButton>
                </Link>
              </motion.section>

              {/* ═══ Load from Assessment Button ═══ */}
              {!assessmentId && (
                <motion.div
                  variants={actionsVariants}
                  className="text-center pt-2 pb-4"
                >
                  <p className="text-[#8b7355]/60 text-xs font-[family-name:var(--font-sans)] mb-3">
                    Viewing demo results
                  </p>
                  <Link href="/results?assessmentId=demo">
                    <ImperialButton variant="ghost" size="sm">
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className="w-4 h-4" />
                        Load from Assessment
                      </span>
                    </ImperialButton>
                  </Link>
                </motion.div>
              )}

              <SectionDivider />

              {/* ═══ Empire Certificate ═══ */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow mb-3">
                    YOUR IMPERIAL CERTIFICATE
                  </h2>
                  <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic max-w-md mx-auto">
                    A testament to your achievement in the Four Trials. Download and share your imperial recognition.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <EmpireCertificate
                    studentName={session?.user?.name || session?.user?.email || 'Warrior'}
                    rankName={IMPERIAL_RANKS[assignment.finalLevel]}
                    finalLevel={assignment.finalLevel}
                    speakingScore={results.speakingScore}
                    listeningScore={results.listeningScore}
                    vocabularyScore={results.vocabularyScore}
                    grammarScore={results.grammarScore}
                    studentEmail={session?.user?.email || undefined}
                  />
                </div>
              </motion.section>

              {/* ═══ Email Status ═══ */}
              {session?.user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center py-4"
                >
                  {emailSending ? (
                    <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending your results to the Imperial Archives...
                    </p>
                  ) : emailSent ? (
                    <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider flex items-center justify-center gap-2">
                      <Mail className="w-3 h-3" />
                      Results have been sent to your email
                    </p>
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notice */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <MetallicCard hover={false} glowOnHover={false} className="p-4 border-[rgba(255,107,53,0.3)]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#ff6b35] shrink-0 mt-0.5" />
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">{error}</p>
              </div>
            </MetallicCard>
          </motion.div>
        )}
      </main>

      <div className="mt-auto">
        <LegalNotice variant="footer" />
        <Footer />
      </div>
    </div>
  );
}

// ─── Default Export with Suspense Boundary ────────────────
// useSearchParams() requires a Suspense boundary in Next.js 14+
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}
