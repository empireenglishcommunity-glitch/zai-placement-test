'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Mic,
  Headphones,
  BookOpen,
  Swords,
  Trophy,
  Clock,
  ChevronRight,
  Star,
  Target,
  Zap,
  Loader2,
  Crown,
  Scroll,
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

// ─── Animation Config ───────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ─── Module Icon Map ────────────────────────────────────────

const MODULE_ICONS: Record<ModuleType, React.ReactNode> = {
  speaking: <Mic className="w-5 h-5" />,
  listening: <Headphones className="w-5 h-5" />,
  vocabulary: <BookOpen className="w-5 h-5" />,
  grammar: <Swords className="w-5 h-5" />,
};

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard');
        return res.json();
      })
      .then((dashboardData: DashboardData) => {
        setData(dashboardData);
      })
      .catch((err) => {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load your command center data.');
      })
      .finally(() => setIsLoading(false));
  }, [status]);

  // Loading state
  if (isLoading || status === 'loading') {
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
                Loading Your Command Center
              </h2>
              <p className="text-[#8b7355] font-[family-name:var(--font-sans)]">
                The Empire is preparing your records...
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

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-6">
            <Crown className="w-16 h-16 text-[#8b7355] mx-auto" />
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-2">
              Unable to Load Command Center
            </h2>
            <p className="text-[#8b7355] font-[family-name:var(--font-sans)]">
              {error || 'Something went wrong. Please try again.'}
            </p>
            <Link href="/dashboard">
              <ImperialButton variant="primary" size="md">Retry</ImperialButton>
            </Link>
          </div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  const currentLevel = data.profile.currentLevel as ImperialLevel;
  const completedModules = Object.values(data.moduleProgress).filter(
    (p) => p.status === 'completed'
  ).length;
  const totalModules = 4;
  const overallProgress = Math.round((completedModules / totalModules) * 100);
  const isNewUser = !data.hasAssessments;

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* ═══ Welcome Section ═══ */}
          <motion.section variants={itemVariants} className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold gold-shimmer">
                Welcome, {data.user.displayName}
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
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }>
              {isNewUser
                ? '\u201CYour journey begins with a single trial\u201D'
                : '\u201CThe Empire awaits your next trial\u201D'
              }
            </motion.p>

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

          {/* ═══ New User CTA ═══ */}
          {isNewUser && (
            <motion.section variants={itemVariants}>
              <GlowingBorder intensity="high" className="rounded-lg">
                <MetallicCard hover={false} glowOnHover={false} className="p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-6"
                  >
                    <Scroll className="w-12 h-12 text-[#c9a84c] mx-auto" />
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow">
                      YOUR JOURNEY AWAITS
                    </h2>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
                      You have not yet faced the Four Trials. Prove your command of English
                      and earn your Imperial Rank. Each trial tests a different skill —
                      speaking, listening, vocabulary, and grammar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                      <Link href="/assessment">
                        <ImperialButton variant="primary" size="lg">
                          <span className="flex items-center gap-2">
                            <Swords className="w-5 h-5" />
                            Begin Your First Trial
                          </span>
                        </ImperialButton>
                      </Link>
                    </div>
                  </motion.div>
                </MetallicCard>
              </GlowingBorder>
            </motion.section>
          )}

          {/* ═══ Imperial Rank Display (only for users with assessments) ═══ */}
          {!isNewUser && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
                Imperial Rank
              </h2>

              <GlowingBorder color="gold" intensity="medium" className="rounded-lg">
                <MetallicCard hover={false} glowOnHover={false} className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    {/* Large rank badge */}
                    <div className="flex flex-col items-center gap-3">
                      <ImperialRankBadge
                        level={currentLevel}
                        size="lg"
                        showLabel={false}
                      />
                      <span
                        className="font-[family-name:var(--font-heading)] font-bold text-2xl"
                        style={{ color: STATUS_COLORS.completed }}
                      >
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
                              whileHover={{ scale: 1.05 }}
                            >
                              <ImperialRankBadge level={lvl} size="sm" />
                              <span
                                className={`font-[family-name:var(--font-heading)] text-xs ${
                                  isActive
                                    ? 'text-[#c9a84c] font-bold'
                                    : isAchieved
                                      ? 'text-[#8b7355]'
                                      : 'text-[#8b7355]/50'
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
          )}

          <SectionDivider />

          {/* ═══ Assessment Progress ═══ */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              The Four Trials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                Object.entries(MODULE_INFO) as [
                  ModuleType,
                  (typeof MODULE_INFO)[ModuleType],
                ][]
              ).map(([moduleKey, info]) => {
                const progress = data.moduleProgress[moduleKey] || { status: 'not_started', score: null, level: null };
                const isCompleted = progress.status === 'completed';
                const isInProgress = progress.status === 'in_progress';

                return (
                  <motion.div
                    key={moduleKey}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/assessment/${moduleKey}`} className="block">
                      <MetallicCard className="p-5 h-full flex flex-col">
                        {/* Module icon & name */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <h3 className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-sm font-semibold">
                                {info.name}
                              </h3>
                              <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">
                                {info.empireTitle}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8b7355] mt-1" />
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: STATUS_COLORS[progress.status as AssessmentStatus] || STATUS_COLORS.not_started }}
                          />
                          <span
                            className="text-xs font-[family-name:var(--font-heading)]"
                            style={{ color: STATUS_COLORS[progress.status as AssessmentStatus] || STATUS_COLORS.not_started }}
                          >
                            {STATUS_LABELS[progress.status as AssessmentStatus] || STATUS_LABELS.not_started}
                          </span>
                        </div>

                        {/* Score or Progress */}
                        {isCompleted && progress.score !== null && (
                          <div className="mb-3">
                            <ProgressBar
                              value={progress.score}
                              max={100}
                              label="Score"
                              showPercentage
                              color={STATUS_COLORS.completed}
                              size="sm"
                            />
                            {progress.level !== null && (
                              <p className="text-[#8b7355] text-xs mt-1 font-[family-name:var(--font-heading)]">
                                Level: {IMPERIAL_RANKS[progress.level as ImperialLevel]}
                              </p>
                            )}
                          </div>
                        )}

                        {isInProgress && (
                          <div className="mb-3">
                            <ProgressBar
                              value={50}
                              max={100}
                              label="Progress"
                              showPercentage
                              color={STATUS_COLORS.in_progress}
                              size="sm"
                            />
                          </div>
                        )}

                        {progress.status === 'not_started' && (
                          <div className="mb-3">
                            <div className="h-1.5 w-full rounded-full bg-[rgba(201,168,76,0.1)]" />
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-[#8b7355]/70 text-xs mt-auto font-[family-name:var(--font-sans)] leading-relaxed">
                          {info.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-3 pt-3 border-t border-[rgba(201,168,76,0.1)]">
                          <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] flex items-center gap-1 hover:gap-2 transition-all">
                            {isCompleted
                              ? 'Retake Trial'
                              : isInProgress
                                ? 'Continue Trial'
                                : 'Begin Trial'}
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

          {/* ═══ Stats Overview (only show real data) ═══ */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl text-center">
              Command Statistics
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Assessments Completed */}
              <motion.div variants={itemVariants}>
                <MetallicCard className="p-4 sm:p-5 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                      <Trophy className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                  </div>
                  <motion.p
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#c9a84c]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {data.stats.assessmentsCompleted}
                  </motion.p>
                  <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">
                    Trials Completed
                  </p>
                </MetallicCard>
              </motion.div>

              {/* Current Level */}
              <motion.div variants={itemVariants}>
                <MetallicCard className="p-4 sm:p-5 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                      <Shield className="w-5 h-5 text-[#cd7f32]" />
                    </div>
                  </div>
                  <motion.p
                    className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#cd7f32]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {IMPERIAL_RANKS[currentLevel]}
                  </motion.p>
                  <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">
                    Imperial Rank
                  </p>
                </MetallicCard>
              </motion.div>

              {/* Vocabulary Estimate */}
              <motion.div variants={itemVariants}>
                <MetallicCard className="p-4 sm:p-5 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                      <BookOpen className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                  </div>
                  <motion.p
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#c9a84c]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    {data.stats.vocabularyEstimate
                      ? data.stats.vocabularyEstimate.toLocaleString()
                      : '\u2014'}
                  </motion.p>
                  <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">
                    Est. Vocabulary
                  </p>
                </MetallicCard>
              </motion.div>

              {/* Grammar Score */}
              <motion.div variants={itemVariants}>
                <MetallicCard className="p-4 sm:p-5 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)]">
                      <Swords className="w-5 h-5 text-[#8b7355]" />
                    </div>
                  </div>
                  <motion.p
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#8b7355]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {data.stats.grammarScore !== null
                      ? `${data.stats.grammarScore}%`
                      : '\u2014'}
                  </motion.p>
                  <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mt-1">
                    Grammar Score
                  </p>
                </MetallicCard>
              </motion.div>
            </div>
          </motion.section>

          <SectionDivider />

          {/* ═══ Recent Activity & Training Status ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl">
                Recent Activity
              </h2>
              <TacticalPanel accentSide="left" accentColor="#c9a84c">
                {data.activity.length > 0 ? (
                  <div className="space-y-0 max-h-96 overflow-y-auto">
                    {data.activity.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-start gap-3 py-3 border-b border-[rgba(201,168,76,0.08)] last:border-b-0"
                      >
                        <div className="mt-0.5">
                          <Clock className="w-4 h-4 text-[#8b7355]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-heading)] truncate">
                              {entry.action}
                            </p>
                            {entry.score !== null && (
                              <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] whitespace-nowrap">
                                {entry.score}/100
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#8b7355] text-xs">
                              {entry.module}
                            </span>
                            <span className="text-[#8b7355]/40">•</span>
                            <span className="text-[#8b7355]/60 text-xs">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Scroll className="w-8 h-8 text-[#8b7355]/40 mx-auto mb-3" />
                    <p className="text-[#8b7355] text-sm font-[family-name:var(--font-sans)] italic">
                      No activity yet. Begin your first trial to see your progress here.
                    </p>
                  </div>
                )}
              </TacticalPanel>
            </motion.section>

            {/* Training Status */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-2xl">
                Training Status
              </h2>
              <TacticalPanel accentSide="left" accentColor="#cd7f32">
                <div className="space-y-4">
                  {/* Current Path */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-[#cd7f32]" />
                      <h3 className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-sm font-semibold">
                        Current Training Path
                      </h3>
                    </div>
                    <p className="text-[#e8e0d0] text-sm font-[family-name:var(--font-sans)] ml-6">
                      {isNewUser
                        ? 'Recruit Path — Begin Your Journey'
                        : currentLevel === 0
                          ? 'Initiate Path — Building Foundations of Command'
                          : currentLevel === 1
                            ? 'Warrior Path — Strengthening Your Command'
                            : currentLevel === 2
                              ? 'Commander Path — Mastering the Language'
                              : 'Champion Path — Achieving Mastery'}
                    </p>
                    <p className="text-[#8b7355] text-xs mt-1 ml-6 font-[family-name:var(--font-sans)]">
                      {isNewUser
                        ? 'Start with the Four Trials to discover your current level and receive personalized training recommendations.'
                        : completedModules < 4
                          ? `Complete ${4 - completedModules} more trial${4 - completedModules > 1 ? 's' : ''} to unlock your full Imperial Rank assessment.`
                          : 'All four trials completed. Your Imperial Rank has been determined.'}
                    </p>
                  </div>

                  <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                  {/* Next Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-[#c9a84c]" />
                      <h3 className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm font-semibold">
                        Recommended Next Actions
                      </h3>
                    </div>
                    <div className="space-y-2 ml-6">
                      {getRecommendedActions(data.moduleProgress).map((action, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center justify-between py-2 border-b border-[rgba(201,168,76,0.06)] last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-[#8b7355]" />
                            <div>
                              <p className="text-[#e8e0d0] text-sm">
                                {action.label}
                              </p>
                              <p className="text-[#8b7355] text-xs">
                                {action.sublabel}
                              </p>
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
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(201,168,76,0.1)]" />

                  {/* Level Progress Hint */}
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#8b7355]" />
                    <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">
                      {completedModules === 0
                        ? 'Complete your first trial to earn your initial rank'
                        : completedModules < 4
                          ? <>Complete {4 - completedModules} more trial{4 - completedModules > 1 ? 's' : ''} to advance to{' '}
                              <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">
                                {IMPERIAL_RANKS[Math.min(currentLevel + 1, 3) as ImperialLevel]}
                              </span>{' '}
                              rank</>
                          : <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">All trials completed — Imperial Rank secured</span>}
                    </p>
                  </div>
                </div>
              </TacticalPanel>
            </motion.section>
          </div>

          <SectionDivider />

          {/* ═══ Quick Actions ═══ */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/assessment">
              <ImperialButton variant="primary" size="lg">
                <span className="flex items-center gap-2">
                  <Swords className="w-5 h-5" />
                  {isNewUser ? 'Begin Your First Trial' : 'Begin Your Next Trial'}
                </span>
              </ImperialButton>
            </Link>
            {!isNewUser && (
              <Link href="/results">
                <ImperialButton variant="outline" size="lg">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    View Full Results
                  </span>
                </ImperialButton>
              </Link>
            )}
          </motion.section>
        </motion.div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// ─── Helper: Generate Recommended Actions ───────────────────

function getRecommendedActions(moduleProgress: Record<string, ModuleProgress>) {
  const actions: { label: string; sublabel: string; priority: string }[] = [];

  const modules: { key: string; name: string; title: string }[] = [
    { key: 'vocabulary', name: 'Vocabulary', title: 'Vocabulary Assessment' },
    { key: 'grammar', name: 'Grammar', title: 'Grammar Assessment' },
    { key: 'speaking', name: 'Speaking', title: 'Speaking Assessment' },
    { key: 'listening', name: 'Listening', title: 'Listening Assessment' },
  ];

  // Priority: not_started > in_progress > completed (for retaking)
  for (const mod of modules) {
    const progress = moduleProgress[mod.key];
    if (!progress) {
      actions.push({
        label: `Begin Trial of ${mod.name}`,
        sublabel: mod.title,
        priority: actions.length === 0 ? 'Urgent' : 'Next',
      });
    } else if (progress.status === 'not_started') {
      actions.push({
        label: `Begin Trial of ${mod.name}`,
        sublabel: mod.title,
        priority: actions.length === 0 ? 'Urgent' : 'Next',
      });
    } else if (progress.status === 'in_progress') {
      actions.push({
        label: `Continue Trial of ${mod.name}`,
        sublabel: mod.title,
        priority: actions.length === 0 ? 'Urgent' : 'Next',
      });
    }
  }

  // If all are completed, suggest retaking lowest score
  if (actions.length === 0) {
    let lowestModule = modules[0];
    let lowestScore = Infinity;
    for (const mod of modules) {
      const progress = moduleProgress[mod.key];
      if (progress?.score !== null && progress?.score !== undefined && progress.score < lowestScore) {
        lowestScore = progress.score;
        lowestModule = mod;
      }
    }
    actions.push({
      label: `Retake Trial of ${lowestModule.name}`,
      sublabel: 'Improve your score',
      priority: 'Optional',
    });
  }

  return actions.slice(0, 3);
}
