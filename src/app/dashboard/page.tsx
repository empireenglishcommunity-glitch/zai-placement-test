'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Swords,
  Trophy,
  Clock,
  ChevronRight,
  Star,
  Target,
  Zap,
  TrendingUp,
  RefreshCw,
  Loader2,
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
} from '@/components/empire';
import { MODULE_INFO } from '@/lib/constants';
import {
  IMPERIAL_RANKS,
  IMPERIAL_RANK_DESCRIPTIONS,
} from '@/lib/types';
import type { ImperialLevel, ModuleType, AssessmentStatus } from '@/lib/types';

// ─── Types ──────────────────────────────────────────────────

interface ModuleProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  level: number | null;
}

interface DashboardData {
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  profile: {
    currentLevel: number;
    assessmentCount: number;
    streak: number;
  };
  moduleProgress: Record<string, ModuleProgress>;
  activity: {
    id: string;
    timestamp: string;
    module: string;
    action: string;
    score: number | null;
  }[];
  stats: {
    assessmentsCompleted: number;
    currentLevel: number;
    vocabularyEstimate: number | null;
    grammarScore: number | null;
  };
  hasAssessments: boolean;
}

// ─── Default data for NEW users (zero-state) ─────────────────

const DEFAULT_MODULE_PROGRESS: Record<string, ModuleProgress> = {
  speaking: { status: 'not_started', score: null, level: null },
  listening: { status: 'not_started', score: null, level: null },
  vocabulary: { status: 'not_started', score: null, level: null },
  grammar: { status: 'not_started', score: null, level: null },
};

const DEFAULT_DATA: DashboardData = {
  user: { id: '', email: '', displayName: 'Recruit' },
  profile: { currentLevel: 0, assessmentCount: 0, streak: 0 },
  moduleProgress: DEFAULT_MODULE_PROGRESS,
  activity: [],
  stats: { assessmentsCompleted: 0, currentLevel: 0, vocabularyEstimate: null, grammarScore: null },
  hasAssessments: false,
};

// ─── Animation Config ───────────────────────────────────────
// CRITICAL: We do NOT use opacity:0 on the container.
// Content must be VISIBLE by default. Animations are subtle slide-up
// that only trigger AFTER mount (using mounted state guard).
// This prevents the "invisible page" bug if JS hydration fails.

const itemVariants = {
  hidden: { y: 16 },
  visible: { y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Constants ──────────────────────────────────────────────

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const STATUS_COLORS: Record<AssessmentStatus, string> = {
  not_started: '#8b7355',
  in_progress: '#cd7f32',
  completed: '#c9a84c',
};

// ─── Page Component ─────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiData, setApiData] = useState<DashboardData | null>(null);
  const [apiError, setApiError] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasFetched = useRef(false);

  // Mark as mounted (client-side hydration complete)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard — redirect unauthenticated users
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch dashboard data — runs only when authenticated
  const fetchDashboard = useCallback(() => {
    setApiError(false);
    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((d: DashboardData) => {
        setApiData(d);
        setApiError(false);
        setDataLoaded(true);
      })
      .catch(() => {
        setApiError(true);
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && !hasFetched.current) {
      hasFetched.current = true;
      fetchDashboard();
    }
  }, [status, fetchDashboard]);

  // ═══ COMPUTE DISPLAY DATA ═══
  // Always use real data if available, otherwise fall back to defaults
  const displayData: DashboardData = apiData || {
    ...DEFAULT_DATA,
    user: {
      id: (session?.user as Record<string, unknown>)?.id as string || '',
      email: session?.user?.email || '',
      displayName:
        (session?.user as Record<string, unknown>)?.name as string ||
        session?.user?.email?.split('@')[0] ||
        'Recruit',
    },
  };

  const currentLevel = (displayData.profile?.currentLevel ?? 0) as ImperialLevel;
  const completedModules = Object.values(displayData.moduleProgress || DEFAULT_MODULE_PROGRESS).filter(
    (p) => p?.status === 'completed'
  ).length;
  const totalModules = 4;
  const isNewUser = !apiData || !displayData.hasAssessments;

  // ═══════════════════════════════════════════════════════════
  // ALWAYS RENDER THE FULL DASHBOARD IMMEDIATELY
  // Content is VISIBLE by default — no opacity:0 trap
  // Animations only add subtle motion after mount
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      {/* Main Content — always visible, no opacity trap */}
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="space-y-10">

          {/* ═══ Sync Banner (non-blocking, shows if API failed) ═══ */}
          {apiError && dataLoaded && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(205,127,50,0.1)] border border-[rgba(205,127,50,0.3)]">
              <RefreshCw className="w-4 h-4 text-[#cd7f32] shrink-0" />
              <p className="text-[#cd7f32] text-sm font-[family-name:var(--font-sans)] flex-1">
                Syncing your command center data...
              </p>
              <button onClick={fetchDashboard} className="text-[#cd7f32] hover:text-[#c9a84c] transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ═══ Welcome Section ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="text-center space-y-4"
          >
            <motion.div
              initial={mounted ? { scale: 0.95 } : false}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold gold-shimmer">
                Welcome, {displayData.user.displayName}
              </h1>
            </motion.div>

            <div className="flex items-center justify-center gap-3">
              <ImperialRankBadge level={currentLevel} size="md" />
            </div>

            <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-lg tracking-wide">
              Rank: {IMPERIAL_RANKS[currentLevel]}
            </p>

            <motion.p
              className="text-[#e8e0d0]/70 text-base italic font-[family-name:var(--font-sans)]"
              animate={mounted ? { opacity: [0.5, 1, 0.5] } : undefined}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              &ldquo;{currentLevel === 0 ? 'The Empire awaits your first trial' : 'The Empire awaits your next trial'}&rdquo;
            </motion.p>

            {/* New User Encouragement */}
            {isNewUser && (
              <div className="mt-4 p-4 rounded-lg bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] max-w-md mx-auto">
                <p className="text-[#c9a84c] text-sm font-[family-name:var(--font-heading)] mb-1">Your journey begins here</p>
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">
                  Complete your first assessment to unlock your rank and begin your rise through the Empire.
                </p>
              </div>
            )}

            <div className="pt-2">
              <ProgressBar
                value={completedModules}
                max={totalModules}
                label="Trial Progress"
                showPercentage
                color="#c9a84c"
                size="lg"
              />
            </div>
          </motion.section>

          <SectionDivider />

          {/* ═══ Imperial Rank Display ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="space-y-6"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              Imperial Rank
            </h2>

            <GlowingBorder color="gold" intensity="medium" className="rounded-lg">
              <MetallicCard hover={false} glowOnHover={false} className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  {/* Large rank badge */}
                  <div className="flex flex-col items-center gap-3">
                    <ImperialRankBadge level={currentLevel} size="lg" showLabel={false} />
                    <span className="font-[family-name:var(--font-heading)] font-bold text-2xl" style={{ color: STATUS_COLORS.completed }}>
                      {IMPERIAL_RANKS[currentLevel]}
                    </span>
                    <p className="text-[#8b7355] text-sm text-center max-w-[250px] font-[family-name:var(--font-sans)]">
                      {IMPERIAL_RANK_DESCRIPTIONS[currentLevel]}
                    </p>
                  </div>

                  {/* All 4 ranks visual */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {([0, 1, 2, 3] as ImperialLevel[]).map((lvl) => {
                        const isActive = lvl === currentLevel;
                        const isAchieved = lvl <= currentLevel;
                        return (
                          <motion.div
                            key={lvl}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                              isActive
                                ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.08)]'
                                : isAchieved
                                  ? 'border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.03)]'
                                  : 'border-[rgba(139,115,85,0.15)] bg-transparent opacity-50'
                            }`}
                            whileHover={mounted ? { scale: 1.05 } : undefined}
                          >
                            <ImperialRankBadge level={lvl} size="sm" />
                            <span
                              className={`font-[family-name:var(--font-heading)] text-xs ${
                                isActive ? 'text-[#c9a84c] font-bold' : isAchieved ? 'text-[#8b7355]' : 'text-[#8b7355]/50'
                              }`}
                            >
                              {IMPERIAL_RANKS[lvl]}
                            </span>
                            {isActive && (
                              <span className="text-[10px] text-[#c9a84c] bg-[rgba(201,168,76,0.1)] px-2 py-0.5 rounded-full font-[family-name:var(--font-heading)]">
                                CURRENT
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </MetallicCard>
            </GlowingBorder>
          </motion.section>

          <SectionDivider />

          {/* ═══ The Four Trials ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="space-y-6"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              The Four Trials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                Object.entries(MODULE_INFO) as [ModuleType, (typeof MODULE_INFO)[ModuleType]][]
              ).map(([moduleKey, info]) => {
                const progress = displayData.moduleProgress?.[moduleKey] || { status: 'not_started' as AssessmentStatus, score: null, level: null };
                const isCompleted = progress.status === 'completed';
                const isInProgress = progress.status === 'in_progress';

                return (
                  <motion.div
                    key={moduleKey}
                    whileHover={mounted ? { y: -4 } : undefined}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/assessment/${moduleKey}`} className="block">
                      <MetallicCard className="p-5 h-full flex flex-col">
                        {/* Module icon & name */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <h3 className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-sm font-semibold">{info.name}</h3>
                              <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">{info.empireTitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8b7355] mt-1" />
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[progress.status as AssessmentStatus] || STATUS_COLORS.not_started }} />
                          <span className="text-xs font-[family-name:var(--font-heading)]" style={{ color: STATUS_COLORS[progress.status as AssessmentStatus] || STATUS_COLORS.not_started }}>
                            {STATUS_LABELS[progress.status as AssessmentStatus] || STATUS_LABELS.not_started}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {isCompleted && progress.score !== null && (
                          <div className="mb-3">
                            <ProgressBar value={progress.score} max={100} label="Score" showPercentage color={STATUS_COLORS.completed} size="sm" />
                            {progress.level !== null && (
                              <p className="text-[#8b7355] text-xs mt-1 font-[family-name:var(--font-heading)]">Level: {IMPERIAL_RANKS[progress.level as ImperialLevel]}</p>
                            )}
                          </div>
                        )}
                        {isInProgress && (
                          <div className="mb-3">
                            <ProgressBar value={50} max={100} label="Progress" showPercentage color={STATUS_COLORS.in_progress} size="sm" />
                          </div>
                        )}
                        {progress.status === 'not_started' && (
                          <div className="mb-3">
                            <div className="h-1.5 w-full rounded-full bg-[rgba(201,168,76,0.1)]" />
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-[#8b7355]/70 text-xs mt-auto font-[family-name:var(--font-sans)] leading-relaxed">{info.description}</p>

                        {/* CTA */}
                        <div className="mt-3 pt-3 border-t border-[rgba(201,168,76,0.1)]">
                          <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] flex items-center gap-1 hover:gap-2 transition-all">
                            {isCompleted ? 'Retake Trial' : isInProgress ? 'Continue Trial' : 'Begin Trial'}
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </MetallicCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <SectionDivider />

          {/* ═══ Command Statistics ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="space-y-6"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              Command Statistics
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetallicCard className="p-4 sm:p-5 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                    <Trophy className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#c9a84c]">
                  {displayData.stats?.assessmentsCompleted ?? 0}
                </p>
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">Trials Completed</p>
              </MetallicCard>

              <MetallicCard className="p-4 sm:p-5 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                    <Shield className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#cd7f32]">
                  {IMPERIAL_RANKS[currentLevel]}
                </p>
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">Imperial Rank</p>
              </MetallicCard>

              <MetallicCard className="p-4 sm:p-5 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                    <BookOpen className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#c9a84c]">
                  {displayData.stats?.vocabularyEstimate ? displayData.stats.vocabularyEstimate.toLocaleString() : '\u2014'}
                </p>
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">Est. Vocabulary</p>
              </MetallicCard>

              <MetallicCard className="p-4 sm:p-5 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                    <Swords className="w-5 h-5 text-[#8b7355]" />
                  </div>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#8b7355]">
                  {displayData.stats?.grammarScore !== null && displayData.stats?.grammarScore !== undefined ? `${displayData.stats.grammarScore}%` : '\u2014'}
                </p>
                <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">Grammar Score</p>
              </MetallicCard>
            </div>
          </motion.section>

          <SectionDivider />

          {/* ═══ Recent Activity & Training Status ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.section
              variants={itemVariants}
              initial={mounted ? 'hidden' : false}
              animate="visible"
              className="space-y-4"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl">Recent Activity</h2>
              <TacticalPanel accentSide="left" accentColor="#c9a84c">
                {displayData.activity && displayData.activity.length > 0 ? (
                  <div className="space-y-0 max-h-96 overflow-y-auto">
                    {displayData.activity.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 py-3 border-b border-[rgba(201,168,76,0.08)] last:border-b-0"
                      >
                        <div className="mt-0.5"><Clock className="w-4 h-4 text-[#8b7355]" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-heading)] truncate">{entry.action}</p>
                            {entry.score !== null && (
                              <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] whitespace-nowrap">{entry.score}/100</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#8b7355] text-xs">{entry.module}</span>
                            <span className="text-[#8b7355]/40">&bull;</span>
                            <span className="text-[#8b7355]/60 text-xs">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Clock className="w-8 h-8 text-[#8b7355]/40 mx-auto mb-3" />
                    <p className="text-[#8b7355] text-sm font-[family-name:var(--font-sans)] italic">
                      No assessments completed yet.
                    </p>
                    <p className="text-[#8b7355]/60 text-xs font-[family-name:var(--font-sans)] mt-1">
                      Your journey begins here. Complete your first trial to see your history.
                    </p>
                  </div>
                )}
              </TacticalPanel>
            </motion.section>

            {/* Training Status */}
            <motion.section
              variants={itemVariants}
              initial={mounted ? 'hidden' : false}
              animate="visible"
              className="space-y-4"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl">Training Status</h2>
              <TacticalPanel accentSide="left" accentColor="#cd7f32">
                <div className="space-y-4">
                  {/* Current Path */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-[#cd7f32]" />
                      <h3 className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-sm font-semibold">Current Training Path</h3>
                    </div>
                    <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-sans)] ml-6">
                      {currentLevel === 0 ? 'Initiate Path — Building Foundations of Command'
                        : currentLevel === 1 ? 'Warrior Path — Strengthening Your Command'
                        : currentLevel === 2 ? 'Commander Path — Mastering the Language'
                        : 'Champion Path — Achieving Mastery'}
                    </p>
                    <p className="text-[#8b7355] text-xs mt-1 ml-6 font-[family-name:var(--font-sans)]">
                      {completedModules < 4
                        ? `Focus on completing all four trials to determine your true Imperial Rank. ${4 - completedModules} trial${4 - completedModules > 1 ? 's' : ''} remaining.`
                        : 'All four trials completed. Your Imperial Rank has been determined.'}
                    </p>
                  </div>

                  <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                  {/* Next Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-[#c9a84c]" />
                      <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm font-semibold">Recommended Next Actions</h3>
                    </div>
                    <div className="space-y-2 ml-6">
                      {getRecommendedActions(displayData.moduleProgress || DEFAULT_MODULE_PROGRESS).map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-[rgba(201,168,76,0.06)] last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-[#8b7355]" />
                            <div>
                              <p className="text-[#e8e0d0] text-sm">{action.label}</p>
                              <p className="text-[#8b7355] text-xs">{action.sublabel}</p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-[family-name:var(--font-heading)] px-2 py-0.5 rounded-full ${
                              action.priority === 'Urgent'
                                ? 'text-[#e74c3c] bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.2)]'
                                : action.priority === 'Next'
                                  ? 'text-[#cd7f32] bg-[rgba(205,127,50,0.1)] border border-[rgba(205,127,50,0.2)]'
                                  : 'text-[#8b7355] bg-[rgba(139,115,85,0.1)] border border-[rgba(139,115,85,0.2)]'
                            }`}
                          >
                            {action.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                  {/* Level Progress Hint */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8b7355]" />
                    <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">
                      {completedModules === 0
                        ? <>Complete your first trial to earn your initial rank — advance to <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">Initiate</span></>
                        : completedModules < 4
                          ? <>Complete {4 - completedModules} more trial{4 - completedModules > 1 ? 's' : ''} to advance to{' '}
                              <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">{IMPERIAL_RANKS[Math.min(currentLevel + 1, 3) as ImperialLevel]}</span>{' '}rank</>
                          : <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">All trials completed — Imperial Rank secured</span>}
                    </p>
                  </div>
                </div>
              </TacticalPanel>
            </motion.section>
          </div>

          <SectionDivider />

          {/* ═══ Achievements / Badges Section ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="space-y-6"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ACHIEVEMENTS.map((ach) => {
                const unlocked = isAchievementUnlocked(ach.id, displayData);
                return (
                  <div
                    key={ach.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      unlocked
                        ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.08)]'
                        : 'border-[rgba(139,115,85,0.1)] bg-[rgba(139,115,85,0.02)] opacity-40'
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className={`font-[family-name:var(--font-heading)] text-xs text-center ${unlocked ? 'text-[#c9a84c]' : 'text-[#8b7355]'}`}>
                      {ach.name}
                    </span>
                    {unlocked && (
                      <span className="text-[9px] text-[#c9a84c] bg-[rgba(201,168,76,0.1)] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-heading)]">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {!displayData.hasAssessments && (
              <p className="text-center text-[#8b7355]/60 text-xs font-[family-name:var(--font-sans)] italic">
                Complete assessments to unlock achievements and prove your worth to the Empire.
              </p>
            )}
          </motion.section>

          <SectionDivider />

          {/* ═══ Quick Actions ═══ */}
          <motion.section
            variants={itemVariants}
            initial={mounted ? 'hidden' : false}
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/assessment">
              <ImperialButton variant="primary" size="lg">
                <span className="flex items-center gap-2">
                  <Swords className="w-5 h-5" />
                  {completedModules === 0 ? 'Begin Your First Trial' : 'Begin Your Next Trial'}
                </span>
              </ImperialButton>
            </Link>
            <Link href="/results">
              <ImperialButton variant="outline" size="lg">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  View Full Results
                </span>
              </ImperialButton>
            </Link>
          </motion.section>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// ─── Achievements Data ──────────────────────────────────────

const ACHIEVEMENTS = [
  { id: 'first_trial', icon: '⚔️', name: 'First Blood' },
  { id: 'all_trials', icon: '🏆', name: 'Four Trials' },
  { id: 'vocabulary_1k', icon: '📖', name: 'Wordsmith' },
  { id: 'grammar_80', icon: '🏛️', name: 'Grammarian' },
  { id: 'rank_initiate', icon: '🗡️', name: 'Initiate' },
  { id: 'rank_champion', icon: '👑', name: 'Champion' },
];

function isAchievementUnlocked(id: string, data: DashboardData): boolean {
  if (!data.hasAssessments) return false;
  switch (id) {
    case 'first_trial':
      return (data.stats.assessmentsCompleted ?? 0) >= 1;
    case 'all_trials':
      return (data.stats.assessmentsCompleted ?? 0) >= 4;
    case 'vocabulary_1k':
      return (data.stats.vocabularyEstimate ?? 0) >= 1000;
    case 'grammar_80':
      return (data.stats.grammarScore ?? 0) >= 80;
    case 'rank_initiate':
      return (data.stats.currentLevel ?? 0) >= 1;
    case 'rank_champion':
      return (data.stats.currentLevel ?? 0) >= 3;
    default:
      return false;
  }
}

// ─── Helper: Generate Recommended Actions ───────────────────

function getRecommendedActions(moduleProgress: Record<string, ModuleProgress>) {
  const actions: { label: string; sublabel: string; priority: string }[] = [];

  const modules: { key: string; name: string; title: string }[] = [
    { key: 'vocabulary', name: 'Words', title: 'Vocabulary Assessment' },
    { key: 'grammar', name: 'Structure', title: 'Grammar Assessment' },
    { key: 'speaking', name: 'Voice', title: 'Speaking Assessment' },
    { key: 'listening', name: 'the Ear', title: 'Listening Assessment' },
  ];

  for (const mod of modules) {
    const progress = moduleProgress[mod.key];
    if (!progress || progress.status === 'not_started') {
      actions.push({ label: `Begin Trial of ${mod.name}`, sublabel: mod.title, priority: actions.length === 0 ? 'Urgent' : 'Next' });
    } else if (progress.status === 'in_progress') {
      actions.push({ label: `Continue Trial of ${mod.name}`, sublabel: mod.title, priority: actions.length === 0 ? 'Urgent' : 'Next' });
    }
  }

  if (actions.length === 0) {
    let lowestModule = modules[0];
    let lowestScore = Infinity;
    for (const mod of modules) {
      const progress = moduleProgress[mod.key];
      if (progress?.score !== null && progress?.score !== undefined && (progress?.score ?? 0) < lowestScore) {
        lowestScore = progress?.score ?? 0;
        lowestModule = mod;
      }
    }
    actions.push({ label: `Retake Trial of ${lowestModule.name}`, sublabel: 'Improve your score', priority: 'Optional' });
  }

  return actions.slice(0, 3);
}
