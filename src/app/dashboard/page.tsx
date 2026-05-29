'use client';

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
  TrendingUp,
  ChevronRight,
  Star,
  Target,
  Zap,
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

// ─── Mock Data ──────────────────────────────────────────────

const mockUser = {
  displayName: 'Commander',
  currentLevel: 1 as ImperialLevel,
  assessmentCount: 1,
  email: 'commander@empire.com',
};

const mockProgress: Record<
  ModuleType,
  { status: AssessmentStatus; score: number | null; level: ImperialLevel | null }
> = {
  speaking: { status: 'completed', score: 45, level: 1 },
  listening: { status: 'completed', score: 62, level: 2 },
  vocabulary: { status: 'in_progress', score: null, level: null },
  grammar: { status: 'not_started', score: null, level: null },
};

const mockActivity = [
  {
    id: '1',
    timestamp: '2025-03-04 14:23',
    module: 'Listening',
    action: 'Completed Trial of the Ear',
    score: 62,
  },
  {
    id: '2',
    timestamp: '2025-03-04 13:05',
    module: 'Speaking',
    action: 'Completed Trial of Voice',
    score: 45,
  },
  {
    id: '3',
    timestamp: '2025-03-04 12:40',
    module: 'Vocabulary',
    action: 'Started Trial of Words',
    score: null,
  },
  {
    id: '4',
    timestamp: '2025-03-03 18:10',
    module: 'Speaking',
    action: 'Practiced Read-Aloud Drill',
    score: 38,
  },
  {
    id: '5',
    timestamp: '2025-03-02 09:30',
    module: 'Listening',
    action: 'Shadowing Exercise (Slow March)',
    score: 55,
  },
];

const mockStats = {
  assessmentsCompleted: 2,
  currentLevel: 1,
  vocabularyEstimate: 850,
  grammarScore: null as number | null,
};

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
  const completedModules = Object.values(mockProgress).filter(
    (p) => p.status === 'completed'
  ).length;
  const totalModules = 4;
  const overallProgress = Math.round((completedModules / totalModules) * 100);

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
                Welcome, {mockUser.displayName}
              </h1>
            </motion.div>

            <div className="flex items-center justify-center gap-3">
              <ImperialRankBadge level={mockUser.currentLevel} size="md" />
            </div>

            <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-lg tracking-wide">
              Rank: {IMPERIAL_RANKS[mockUser.currentLevel]}
            </p>

            <motion.p
              className="text-[#e8e0d0]/70 text-base italic font-[family-name:var(--font-sans)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              &ldquo;The Empire awaits your next trial&rdquo;
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

          {/* ═══ Imperial Rank Display ═══ */}
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
                      level={mockUser.currentLevel}
                      size="lg"
                      showLabel={false}
                    />
                    <span
                      className="font-[family-name:var(--font-heading)] font-bold text-2xl"
                      style={{ color: STATUS_COLORS.completed }}
                    >
                      {IMPERIAL_RANKS[mockUser.currentLevel]}
                    </span>
                    <p className="text-[#8b7355] text-sm text-center max-w-[250px] font-[family-name:var(--font-sans)]">
                      {IMPERIAL_RANK_DESCRIPTIONS[mockUser.currentLevel]}
                    </p>
                  </div>

                  {/* All 4 ranks visual */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {([0, 1, 2, 3] as ImperialLevel[]).map((lvl) => {
                        const isActive = lvl === mockUser.currentLevel;
                        const isAchieved = lvl <= mockUser.currentLevel;
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
                const progress = mockProgress[moduleKey];
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
                            style={{ backgroundColor: STATUS_COLORS[progress.status] }}
                          />
                          <span
                            className="text-xs font-[family-name:var(--font-heading)]"
                            style={{ color: STATUS_COLORS[progress.status] }}
                          >
                            {STATUS_LABELS[progress.status]}
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
                                Level: {IMPERIAL_RANKS[progress.level]}
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

          {/* ═══ Stats Overview ═══ */}
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
                    {mockStats.assessmentsCompleted}
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
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#cd7f32]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {IMPERIAL_RANKS[mockStats.currentLevel as ImperialLevel]}
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
                    {mockStats.vocabularyEstimate.toLocaleString()}
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
                    {mockStats.grammarScore !== null
                      ? `${mockStats.grammarScore}%`
                      : '—'}
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
                <div className="space-y-0 max-h-96 overflow-y-auto">
                  {mockActivity.map((entry, index) => (
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
                            {entry.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                      Initiate Path — Building Foundations of Command
                    </p>
                    <p className="text-[#8b7355] text-xs mt-1 ml-6 font-[family-name:var(--font-sans)]">
                      Focus on vocabulary expansion and grammar fundamentals to
                      advance to Warrior rank.
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
                      {[
                        {
                          label: 'Complete Trial of Words',
                          sublabel: 'Vocabulary Assessment',
                          priority: 'Urgent',
                        },
                        {
                          label: 'Begin Trial of Structure',
                          sublabel: 'Grammar Assessment',
                          priority: 'Next',
                        },
                        {
                          label: 'Retake Trial of Voice',
                          sublabel: 'Improve Speaking Score',
                          priority: 'Optional',
                        },
                      ].map((action, i) => (
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
                    <TrendingUp className="w-4 h-4 text-[#8b7355]" />
                    <p className="text-[#8b7355] text-xs font-[family-name:var(--font-sans)]">
                      Complete 2 more trials to advance to{' '}
                      <span className="text-[#c9a84c] font-[family-name:var(--font-heading)]">
                        Warrior
                      </span>{' '}
                      rank
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
                  Begin Your Next Trial
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
        </motion.div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
