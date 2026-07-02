'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Trophy,
  ChevronRight,
  Loader2,
  Crown,
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
  TOEFL_LEVEL_THRESHOLDS,
  getSectionLevel,
  getTotalLevel,
} from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';
import { getLevelColor } from '@/services/scoring-service';

// ─── Types ────────────────────────────────────────────────

interface SectionResult {
  section: string;
  label: string;
  icon: typeof BookOpen;
  score: number; // 0-30
  color: string;
  completed: boolean;
}

// ─── Section Config ───────────────────────────────────────

const SECTIONS = [
  { key: 'reading', label: 'Reading', icon: BookOpen, color: '#c9a84c' },
  { key: 'listening', label: 'Listening', icon: Headphones, color: '#cd7f32' },
  { key: 'speaking', label: 'Speaking', icon: Mic, color: '#ff6b35' },
  { key: 'writing', label: 'Writing', icon: PenTool, color: '#9b59b6' },
];


// ─── Component ────────────────────────────────────────────

function ResultsContent() {
  const { data: session, status: authStatus } = useSession();
  const [sectionResults, setSectionResults] = useState<SectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      setError('Please log in to view your results.');
      setLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    async function loadResults() {
      try {
        const res = await fetch('/api/dashboard', { credentials: 'include' });
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        const mp = data.moduleProgress || {};

        // Map module progress to section scores (0-30 scale)
        const results: SectionResult[] = SECTIONS.map(s => {
          const moduleData = mp[s.key];
          let score = 0;
          let completed = false;

          if (moduleData?.score != null) {
            completed = true;
            // Convert percentage-based scores (0-100) to TOEFL section scores (0-30)
            if (s.key === 'reading' || s.key === 'writing') {
              // These already come as 0-30 from our new trials
              score = Math.min(30, Math.round(moduleData.score));
            } else {
              // Listening/Speaking come as 0-100 from old system
              score = Math.min(30, Math.round((moduleData.score / 100) * 30));
            }
          }

          return { section: s.key, label: s.label, icon: s.icon, score, color: s.color, completed };
        });

        setSectionResults(results);

        const hasAny = results.some(r => r.completed);
        if (!hasAny) {
          setError('No completed trials yet. Complete at least one trial to see results.');
        }
      } catch {
        setError('Complete at least one trial to see your results here.');
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [authStatus]);

  // Calculate totals
  const completedSections = sectionResults.filter(r => r.completed);
  const totalScore = sectionResults.reduce((sum, r) => sum + r.score, 0);
  const { level: imperialLevel, cefr } = getTotalLevel(totalScore);
  const allComplete = completedSections.length === 4;

  // ─── Loading ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <Crown className="w-12 h-12 text-[#c9a84c] mx-auto animate-pulse" />
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg">Loading Results...</p>
            <Loader2 className="w-5 h-5 text-[#c9a84c] mx-auto animate-spin" />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Error / No Results ──────────────────────────────────

  if (error && completedSections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10 px-4">
          <MetallicCard className="max-w-md w-full p-8 text-center" hover={false}>
            <Trophy className="w-12 h-12 text-[#8b7355] mx-auto mb-4 opacity-50" />
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] mb-3">No Results Yet</h2>
            <p className="text-[#8b7355] text-sm mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              {authStatus === 'unauthenticated' ? (
                <Link href="/login">
                  <ImperialButton variant="primary" size="md" className="gap-2 w-full">
                    <span>Log In to View Results</span>
                    <ChevronRight className="w-4 h-4" />
                  </ImperialButton>
                </Link>
              ) : (
                <Link href="/assessment">
                  <ImperialButton variant="primary" size="md" className="gap-2 w-full">
                    <span>Go to Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </ImperialButton>
                </Link>
              )}
            </div>
          </MetallicCard>
        </main>
        <Footer />
      </div>
    );
  }


  // ─── Results Display ─────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Hero: Total Score */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}>
              <ImperialRankBadge level={imperialLevel} size="lg" />
            </motion.div>
            <motion.h1
              className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#c9a84c] mt-4 mb-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
              {IMPERIAL_RANKS[imperialLevel]}
            </motion.h1>
            <motion.p
              className="text-[#8b7355] text-sm mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >
              {IMPERIAL_RANK_DESCRIPTIONS[imperialLevel]}
            </motion.p>

            {/* TOEFL Score Display */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <GlowingBorder color="gold" intensity="high">
                <MetallicCard className="p-6 sm:p-8 inline-block" hover={false}>
                  <div className="flex items-center gap-8 justify-center">
                    <div className="text-center">
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-1">Imperial Score</p>
                      <p className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-[#c9a84c]">{totalScore}</p>
                      <p className="text-[#8b7355] text-xs mt-1">out of 120</p>
                    </div>
                    <div className="w-px h-16 bg-[rgba(201,168,76,0.2)]" />
                    <div className="text-center">
                      <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs uppercase tracking-widest mb-1">CEFR Level</p>
                      <p className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[#cd7f32]">{cefr}</p>
                      <p className="text-[#8b7355] text-xs mt-1">equivalent</p>
                    </div>
                  </div>
                  {!allComplete && (
                    <p className="text-[#ff6b35] text-xs text-center mt-4 font-[family-name:var(--font-heading)]">
                      ⚠ {4 - completedSections.length} section{4 - completedSections.length > 1 ? 's' : ''} not yet completed — score is partial
                    </p>
                  )}
                </MetallicCard>
              </GlowingBorder>
            </motion.div>
          </motion.div>

          <SectionDivider />

          {/* Section Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] text-center mb-6 tracking-wide">
              Section Scores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionResults.map((result, idx) => {
                const Icon = result.icon;
                const sectionLevel = getSectionLevel(result.score);
                return (
                  <motion.div
                    key={result.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + idx * 0.15 }}
                  >
                    <MetallicCard className="p-5" hover={false}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: result.color, backgroundColor: `${result.color}15` }}>
                            <Icon className="w-5 h-5" style={{ color: result.color }} />
                          </div>
                          <div>
                            <h3 className="font-[family-name:var(--font-heading)] text-sm text-[#e8e8e8]">{result.label}</h3>
                            <p className="font-[family-name:var(--font-heading)] text-[10px] text-[#8b7355] uppercase tracking-wider">
                              {result.completed ? IMPERIAL_RANKS[sectionLevel] : 'Not Completed'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {result.completed ? (
                            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold" style={{ color: result.color }}>{result.score}</p>
                          ) : (
                            <p className="font-[family-name:var(--font-heading)] text-lg text-[#555]">—</p>
                          )}
                          <p className="text-[#8b7355] text-[10px]">/ 30</p>
                        </div>
                      </div>
                      {result.completed && (
                        <ProgressBar value={result.score} max={30} showPercentage={false} color={result.color} size="sm" />
                      )}
                      {!result.completed && (
                        <Link href={`/assessment/${result.section}`} className="block mt-2">
                          <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] hover:underline">
                            Take this trial →
                          </span>
                        </Link>
                      )}
                    </MetallicCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <SectionDivider />

          {/* Level Thresholds Reference */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#c9a84c] text-center mb-4 tracking-wide">
              Imperial Score Scale
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOEFL_LEVEL_THRESHOLDS.map((t, idx) => {
                const isActive = t.level === imperialLevel;
                const rankColors = ['#8b7355', '#cd7f32', '#c9a84c', '#ff6b35'];
                return (
                  <MetallicCard key={idx} className={`p-3 text-center ${isActive ? 'ring-1 ring-[#c9a84c]' : ''}`} hover={false}>
                    <p className="font-[family-name:var(--font-heading)] text-xs font-bold" style={{ color: rankColors[idx] }}>
                      {IMPERIAL_RANKS[t.level]}
                    </p>
                    <p className="text-[#8b7355] text-[10px] mt-0.5">{t.min}–{t.max} pts</p>
                    <p className="text-[#8b7355] text-[10px]">{t.cefr}</p>
                    {isActive && <p className="text-[#c9a84c] text-[10px] mt-1 font-bold">← You</p>}
                  </MetallicCard>
                );
              })}
            </div>
          </motion.div>

          <SectionDivider />

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          >
            {!allComplete && (
              <Link href="/assessment">
                <ImperialButton variant="primary" size="lg" className="gap-2">
                  <span>Complete Remaining Trials</span>
                  <ChevronRight className="w-5 h-5" />
                </ImperialButton>
              </Link>
            )}
            <Link href="/dashboard">
              <ImperialButton variant="outline" size="lg" className="gap-2">
                <span>View Dashboard</span>
              </ImperialButton>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Export with Suspense ──────────────────────────────────

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
        </main>
        <Footer />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
