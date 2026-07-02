'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Headphones, Mic, PenTool, Crown, ChevronRight,
  Target, Loader2,
} from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialRankBadge,
  ProgressBar,
  SectionDivider,
  ImperialButton,
  GlowingBorder,
} from '@/components/empire';
import {
  IMPERIAL_RANKS,
  IMPERIAL_RANK_DESCRIPTIONS,
  getTotalLevel,
  getSectionLevel,
} from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';

// ─── Types ──────────────────────────────────────────────────

interface SectionProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null; // 0-30
  level: number | null;
}

interface DashboardData {
  user: { id: string; email: string; displayName: string };
  sections: {
    reading: SectionProgress;
    listening: SectionProgress;
    speaking: SectionProgress;
    writing: SectionProgress;
  };
  totalScore: number;
  cefr: string;
  imperialLevel: ImperialLevel;
  completedCount: number;
}

// ─── Section Config ─────────────────────────────────────────

const SECTIONS = [
  { key: 'reading', label: 'Reading', icon: BookOpen, color: '#c9a84c', href: '/assessment/reading' },
  { key: 'listening', label: 'Listening', icon: Headphones, color: '#cd7f32', href: '/assessment/listening' },
  { key: 'speaking', label: 'Speaking', icon: Mic, color: '#ff6b35', href: '/assessment/speaking' },
  { key: 'writing', label: 'Writing', icon: PenTool, color: '#9b59b6', href: '/assessment/writing' },
];

// ─── Component ──────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/login');
  }, [authStatus, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        const raw = await res.json();

        const mp = raw.moduleProgress || {};

        // Map old module data to new TOEFL sections
        const sections = {
          reading: mapSection(mp.reading),
          listening: mapSection(mp.listening, mp.listening?.score),
          speaking: mapSection(mp.speaking, mp.speaking?.score),
          writing: mapSection(mp.writing),
        };

        // Calculate totals
        const scores = Object.values(sections)
          .filter(s => s.score !== null)
          .map(s => s.score as number);
        const totalScore = scores.reduce((sum, s) => sum + s, 0);
        const { level, cefr } = getTotalLevel(totalScore);
        const completedCount = Object.values(sections).filter(s => s.status === 'completed').length;

        setData({
          user: {
            id: raw.user?.id || '',
            email: raw.user?.email || session?.user?.email || '',
            displayName: raw.user?.displayName || session?.user?.name || 'Student',
          },
          sections,
          totalScore,
          cefr,
          imperialLevel: level,
          completedCount,
        });
      } catch {
        // Default empty state
        setData({
          user: { id: '', email: session?.user?.email || '', displayName: session?.user?.name || 'Student' },
          sections: {
            reading: { status: 'not_started', score: null, level: null },
            listening: { status: 'not_started', score: null, level: null },
            speaking: { status: 'not_started', score: null, level: null },
            writing: { status: 'not_started', score: null, level: null },
          },
          totalScore: 0,
          cefr: 'A1',
          imperialLevel: 0,
          completedCount: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    // Auto-refresh every 30 seconds when page is visible
    const interval = setInterval(() => {
      if (!document.hidden) loadDashboard();
    }, 30000);
    return () => clearInterval(interval);
  }, [authStatus, session]);

  // ─── Loading ────────────────────────────────────────────

  if (loading || authStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Crown className="w-12 h-12 text-[#c9a84c] mx-auto mb-4 animate-pulse" />
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c]">Loading your progress...</p>
            <Loader2 className="w-5 h-5 text-[#c9a84c] mx-auto mt-3 animate-spin" />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  const allComplete = data.completedCount === 4;

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Welcome + Score */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#8b7355] text-sm mb-2 font-[family-name:var(--font-heading)]">Welcome back,</p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#c9a84c] mb-2">
              {data.user.displayName}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <ImperialRankBadge level={data.imperialLevel} size="md" />
              <div className="text-left">
                <p className="font-[family-name:var(--font-heading)] text-lg font-bold" style={{ color: ['#8b7355', '#cd7f32', '#c9a84c', '#ff6b35'][data.imperialLevel] }}>
                  {IMPERIAL_RANKS[data.imperialLevel]}
                </p>
                <p className="text-[#8b7355] text-xs">{IMPERIAL_RANK_DESCRIPTIONS[data.imperialLevel]}</p>
              </div>
            </div>
          </motion.div>

          {/* Imperial Score Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlowingBorder color="gold" intensity={allComplete ? 'high' : 'medium'}>
              <MetallicCard className="p-6 sm:p-8" hover={false}>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-1">Imperial Score</p>
                    <p className="font-[family-name:var(--font-heading)] text-5xl font-bold text-[#c9a84c]">{data.totalScore}</p>
                    <p className="text-[#8b7355] text-xs mt-1">out of 120</p>
                  </div>
                  <div className="w-px h-16 bg-[rgba(201,168,76,0.2)]" />
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-1">CEFR</p>
                    <p className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#cd7f32]">{data.cefr}</p>
                    <p className="text-[#8b7355] text-xs mt-1">{data.completedCount}/4 sections</p>
                  </div>
                </div>
                {!allComplete && (
                  <p className="text-[#ff6b35] text-xs text-center mt-4 font-[family-name:var(--font-heading)]">
                    ⚠ {4 - data.completedCount} section{4 - data.completedCount > 1 ? 's' : ''} remaining — score is partial
                  </p>
                )}
              </MetallicCard>
            </GlowingBorder>
          </motion.div>

          <SectionDivider />

          {/* Section Progress Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] text-center mb-6 tracking-wide">
              Section Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTIONS.map((section, idx) => {
                const progress = data.sections[section.key as keyof typeof data.sections];
                const Icon = section.icon;
                const sectionLevel = progress.score !== null ? getSectionLevel(progress.score) : null;

                return (
                  <motion.div
                    key={section.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <MetallicCard className="p-5" hover={progress.status !== 'completed'}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: section.color, backgroundColor: `${section.color}15` }}>
                            <Icon className="w-5 h-5" style={{ color: section.color }} />
                          </div>
                          <div>
                            <h3 className="font-[family-name:var(--font-heading)] text-sm text-[#e8e8e8]">{section.label}</h3>
                            <p className="text-[#8b7355] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                              {progress.status === 'completed' ? (sectionLevel !== null ? IMPERIAL_RANKS[sectionLevel] : '—') : progress.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {progress.score !== null ? (
                            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold" style={{ color: section.color }}>{progress.score}</p>
                          ) : (
                            <p className="font-[family-name:var(--font-heading)] text-lg text-[#555]">—</p>
                          )}
                          <p className="text-[#8b7355] text-[10px]">/ 30</p>
                        </div>
                      </div>

                      {progress.score !== null ? (
                        <ProgressBar value={progress.score} max={30} showPercentage={false} color={section.color} size="sm" />
                      ) : (
                        <Link href={section.href}>
                          <div className="flex items-center justify-center gap-2 py-2 rounded border border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)] transition-colors">
                            <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)]">Start Trial</span>
                            <ChevronRight className="w-3 h-3 text-[#c9a84c]" />
                          </div>
                        </Link>
                      )}
                    </MetallicCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <SectionDivider />

          {/* CTA */}
          <motion.div className="text-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {allComplete ? (
              <Link href="/results">
                <ImperialButton variant="primary" size="lg" className="gap-2">
                  <Target className="w-5 h-5" />
                  <span>View Full Results</span>
                </ImperialButton>
              </Link>
            ) : (
              <Link href="/assessment">
                <ImperialButton variant="primary" size="lg" className="gap-2">
                  <span>Continue Assessment</span>
                  <ChevronRight className="w-5 h-5" />
                </ImperialButton>
              </Link>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Helper: Map API data to section progress ──────────────

function mapSection(moduleData: { status?: string; score?: number | null; level?: number | null } | undefined, rawScore?: number | null): SectionProgress {
  if (!moduleData) return { status: 'not_started', score: null, level: null };

  const status = moduleData.status === 'completed' ? 'completed'
    : moduleData.status === 'in_progress' ? 'in_progress'
    : 'not_started';

  let score: number | null = null;
  if (moduleData.score != null) {
    // If score is > 30, it's an old 0-100 score — convert to 0-30
    score = moduleData.score > 30 ? Math.round((moduleData.score / 100) * 30) : Math.round(moduleData.score);
  }

  return { status, score, level: moduleData.level ?? null };
}
