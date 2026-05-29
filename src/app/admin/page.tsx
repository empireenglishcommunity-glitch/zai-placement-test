'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, FileCheck, AlertTriangle, BarChart3,
  Search, ChevronUp, ChevronDown, Eye, CheckCircle2,
  Flag, MessageSquare, Download, BookOpen, Crown,
  Activity, Swords, Clock, Star, XCircle, Loader2,
} from 'lucide-react';
import {
  ParticleBackground, Navbar, Footer, MetallicCard,
  GlowingBorder, TacticalPanel, ImperialButton,
  ImperialRankBadge, SectionDivider, ProgressBar,
} from '@/components/empire';
import { IMPERIAL_RANKS } from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────

interface StudentRow {
  id: string;
  displayName: string;
  email: string;
  currentLevel: number;
  assessmentCount: number;
  lastActiveAt: string;
  joinedAt: string;
  latestAssessment: {
    id: string;
    status: string;
    completedAt: string | null;
    assignedLevel: number | null;
  } | null;
}

interface FlagRow {
  id: string;
  userId: string;
  assessmentId: string;
  reason: string;
  resolved: boolean;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    email: string;
  };
}

interface AnalyticsData {
  totalStudents: number;
  totalAssessments: number;
  completedAssessments: number;
  pendingFlags: number;
  levelDistribution: { level: number; count: number }[];
  avgScores: {
    speaking: number;
    listening: number;
    vocabulary: number;
    grammar: number;
  };
}

// ─── Level Colors & Labels ────────────────────────────────────

const LEVEL_COLORS: Record<number, string> = {
  0: '#8b7355',
  1: '#cd7f32',
  2: '#c9a84c',
  3: '#ff6b35',
};

const LEVEL_BG: Record<number, string> = {
  0: 'rgba(139, 115, 85, 0.15)',
  1: 'rgba(205, 127, 50, 0.15)',
  2: 'rgba(201, 168, 76, 0.15)',
  3: 'rgba(255, 107, 53, 0.15)',
};

const MODULE_SCORE_CONFIG = [
  { key: 'speaking' as const, label: 'Speaking', color: '#cd7f32', icon: '🎤' },
  { key: 'listening' as const, label: 'Listening', color: '#c9a84c', icon: '👂' },
  { key: 'vocabulary' as const, label: 'Vocabulary', color: '#ff6b35', icon: '📖' },
  { key: 'grammar' as const, label: 'Grammar', color: '#8b7355', icon: '⚔️' },
];

type SortField = 'displayName' | 'email' | 'currentLevel' | 'assessmentCount' | 'lastActiveAt' | 'joinedAt';
type SortDir = 'asc' | 'desc';

// ─── Skeleton Components ──────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[#111118] to-[#1a1a2e] p-6">
      <div className="h-4 w-24 bg-[rgba(201,168,76,0.1)] rounded mb-3" />
      <div className="h-8 w-16 bg-[rgba(201,168,76,0.1)] rounded mb-2" />
      <div className="h-3 w-32 bg-[rgba(201,168,76,0.05)] rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[rgba(201,168,76,0.1)]">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[rgba(201,168,76,0.08)] rounded w-20" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Page Component ──────────────────────────────────────

export default function AdminDashboardPage() {
  // Data state
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Flag state
  const [flagNotes, setFlagNotes] = useState<Record<string, string>>({});
  const [resolvingFlag, setResolvingFlag] = useState<string | null>(null);

  // Detail modal state
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  // Fetch all data on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, flagsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/flags'),
        fetch('/api/admin/analytics'),
      ]);

      const studentsData = await studentsRes.json();
      const flagsData = await flagsRes.json();
      const analyticsData = await analyticsRes.json();

      if (studentsData.students) setStudents(studentsData.students);
      if (flagsData.flags) setFlags(flagsData.flags);
      if (analyticsData.totalStudents !== undefined) setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Filtered & sorted students
  const filteredStudents = students
    .filter(s =>
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'displayName' || sortField === 'email') {
        cmp = a[sortField].localeCompare(b[sortField]);
      } else if (sortField === 'currentLevel' || sortField === 'assessmentCount') {
        cmp = a[sortField] - b[sortField];
      } else {
        cmp = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  // Resolve flag handler
  const handleResolveFlag = async (flagId: string) => {
    setResolvingFlag(flagId);
    try {
      const notes = flagNotes[flagId] || '';
      const res = await fetch('/api/admin/flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId, resolved: true, notes }),
      });
      if (res.ok) {
        setFlags(prev => prev.filter(f => f.id !== flagId));
        setFlagNotes(prev => {
          const next = { ...prev };
          delete next[flagId];
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to resolve flag:', err);
    } finally {
      setResolvingFlag(null);
    }
  };

  // Add notes to flag
  const handleAddNotes = async (flagId: string) => {
    const notes = flagNotes[flagId];
    if (!notes) return;
    try {
      await fetch('/api/admin/flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId, notes }),
      });
    } catch (err) {
      console.error('Failed to add notes:', err);
    }
  };

  // Date formatting
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  // Sort icon
  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={`w-3 h-3 ${sortField === field && sortDir === 'asc' ? 'text-[#c9a84c]' : 'text-[#8b7355]/40'}`} />
      <ChevronDown className={`w-3 h-3 -mt-1 ${sortField === field && sortDir === 'desc' ? 'text-[#c9a84c]' : 'text-[#8b7355]/40'}`} />
    </span>
  );

  // Fallback analytics for empty state
  const displayAnalytics: AnalyticsData = analytics ?? {
    totalStudents: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    pendingFlags: 0,
    levelDistribution: [
      { level: 0, count: 0 },
      { level: 1, count: 0 },
      { level: 2, count: 0 },
      { level: 3, count: 0 },
    ],
    avgScores: { speaking: 0, listening: 0, vocabulary: 0, grammar: 0 },
  };

  const maxLevelCount = Math.max(1, ...displayAnalytics.levelDistribution.map(l => l.count));

  // ─── Animation Variants ───────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#e8e8e8] relative">
      <ParticleBackground />
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══ Command Center Header ═══ */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Grid overlay background */}
            <div className="relative">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Crown className="w-8 h-8 text-[#c9a84c]" />
                  <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] via-[#e8d48b] to-[#cd7f32]">
                    Imperial Command Center
                  </h1>
                  <Crown className="w-8 h-8 text-[#c9a84c]" />
                </div>
                <p className="text-[#8b7355] font-[family-name:var(--font-heading)] text-lg tracking-wide">
                  Oversee the Empire&apos;s recruits and operations
                </p>
              </div>
            </div>
          </motion.div>

          {/* ═══ Stats Overview ═══ */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                {/* Total Recruits */}
                <motion.div variants={itemVariants}>
                  <MetallicCard className="p-6" hover glowOnHover>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm tracking-wide mb-1">Total Recruits</p>
                        <p className="text-3xl font-bold text-[#c9a84c] font-[family-name:var(--font-heading)]">
                          {displayAnalytics.totalStudents}
                        </p>
                        <p className="text-[#8b7355]/60 text-xs mt-1">Enlisted warriors</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#c9a84c]" />
                      </div>
                    </div>
                  </MetallicCard>
                </motion.div>

                {/* Assessments Completed */}
                <motion.div variants={itemVariants}>
                  <MetallicCard className="p-6" hover glowOnHover>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm tracking-wide mb-1">Assessments Completed</p>
                        <p className="text-3xl font-bold text-[#cd7f32] font-[family-name:var(--font-heading)]">
                          {displayAnalytics.completedAssessments}
                        </p>
                        <p className="text-[#8b7355]/60 text-xs mt-1">of {displayAnalytics.totalAssessments} total</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[rgba(205,127,50,0.1)] flex items-center justify-center">
                        <FileCheck className="w-6 h-6 text-[#cd7f32]" />
                      </div>
                    </div>
                  </MetallicCard>
                </motion.div>

                {/* Active Flags */}
                <motion.div variants={itemVariants}>
                  <MetallicCard className="p-6" hover glowOnHover>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm tracking-wide mb-1">Active Flags</p>
                        <p className="text-3xl font-bold text-[#ff6b35] font-[family-name:var(--font-heading)]">
                          {displayAnalytics.pendingFlags}
                        </p>
                        <p className="text-[#8b7355]/60 text-xs mt-1">Awaiting review</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-[#ff6b35]" />
                      </div>
                    </div>
                  </MetallicCard>
                </motion.div>

                {/* Average Level */}
                <motion.div variants={itemVariants}>
                  <MetallicCard className="p-6" hover glowOnHover>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm tracking-wide mb-1">Average Level</p>
                        <p className="text-3xl font-bold text-[#c9a84c] font-[family-name:var(--font-heading)]">
                          {displayAnalytics.totalStudents > 0
                            ? (displayAnalytics.levelDistribution.reduce((sum, l) => sum + l.level * l.count, 0) / displayAnalytics.totalStudents).toFixed(1)
                            : '0.0'}
                        </p>
                        <p className="text-[#8b7355]/60 text-xs mt-1">Imperial rank index</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-[#c9a84c]" />
                      </div>
                    </div>
                  </MetallicCard>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* ═══ Level Distribution + Average Scores ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Level Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TacticalPanel accentColor="#c9a84c">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
                  <Swords className="w-5 h-5" />
                  Level Distribution
                </h3>
                <div className="space-y-4">
                  {displayAnalytics.levelDistribution.map((item) => {
                    const rankName = IMPERIAL_RANKS[item.level as ImperialLevel];
                    const color = LEVEL_COLORS[item.level];
                    const widthPct = maxLevelCount > 0 ? (item.count / maxLevelCount) * 100 : 0;
                    return (
                      <div key={item.level} className="flex items-center gap-3">
                        <div
                          className="w-24 text-sm font-[family-name:var(--font-heading)] font-semibold shrink-0"
                          style={{ color }}
                        >
                          {rankName}
                        </div>
                        <div className="flex-1 h-8 bg-[rgba(201,168,76,0.08)] rounded overflow-hidden relative">
                          <motion.div
                            className="h-full rounded"
                            style={{ backgroundColor: color, opacity: 0.6 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + item.level * 0.15 }}
                          />
                          <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-bold text-[#e8e8e8]">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TacticalPanel>
            </motion.div>

            {/* Average Scores Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TacticalPanel accentColor="#cd7f32">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Average Module Scores
                </h3>
                <div className="space-y-5">
                  {MODULE_SCORE_CONFIG.map((mod) => (
                    <div key={mod.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[#8b7355] font-[family-name:var(--font-heading)] flex items-center gap-1.5">
                          <span>{mod.icon}</span>
                          {mod.label}
                        </span>
                        <span className="text-sm font-bold font-[family-name:var(--font-heading)]" style={{ color: mod.color }}>
                          {Math.round(displayAnalytics.avgScores[mod.key])}%
                        </span>
                      </div>
                      <ProgressBar
                        value={displayAnalytics.avgScores[mod.key]}
                        max={100}
                        color={mod.color}
                        size="md"
                        showPercentage={false}
                      />
                    </div>
                  ))}
                </div>
              </TacticalPanel>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ Student Management Table ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <TacticalPanel accentColor="#c9a84c" className="p-0 overflow-hidden">
              {/* Table Header */}
              <div className="p-4 sm:p-6 border-b border-[rgba(201,168,76,0.15)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c] flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Recruit Registry
                    <span className="text-sm font-normal text-[#8b7355]">({filteredStudents.length})</span>
                  </h3>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                      className="w-full pl-10 pr-4 py-2 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] rounded-md text-sm text-[#e8e8e8] placeholder:text-[#8b7355]/50 focus:outline-none focus:border-[rgba(201,168,76,0.4)] focus:ring-1 focus:ring-[rgba(201,168,76,0.2)] font-[family-name:var(--font-heading)]"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.03)]">
                      {([
                        { field: 'displayName' as SortField, label: 'Name' },
                        { field: 'email' as SortField, label: 'Email' },
                        { field: 'currentLevel' as SortField, label: 'Level' },
                        { field: 'assessmentCount' as SortField, label: 'Assessments' },
                        { field: 'lastActiveAt' as SortField, label: 'Last Active' },
                        { field: 'joinedAt' as SortField, label: 'Joined' },
                      ]).map(col => (
                        <th
                          key={col.field}
                          className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-[#8b7355] font-semibold cursor-pointer hover:text-[#c9a84c] transition-colors select-none whitespace-nowrap"
                          onClick={() => handleSort(col.field)}
                        >
                          <span className="flex items-center">
                            {col.label}
                            <SortIcon field={col.field} />
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-[#8b7355] font-semibold whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-[#8b7355] font-[family-name:var(--font-heading)]">
                          {searchQuery ? 'No recruits match your search.' : 'No recruits have enlisted yet.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student, idx) => (
                        <motion.tr
                          key={student.id}
                          className="border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.04)] transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <td className="px-4 py-3 font-medium text-[#e8e8e8] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: LEVEL_BG[student.currentLevel], color: LEVEL_COLORS[student.currentLevel] }}
                              >
                                {student.displayName.charAt(0).toUpperCase()}
                              </div>
                              {student.displayName}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#8b7355] whitespace-nowrap">{student.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] font-semibold"
                              style={{ backgroundColor: LEVEL_BG[student.currentLevel], color: LEVEL_COLORS[student.currentLevel] }}
                            >
                              <Star className="w-3 h-3" />
                              {IMPERIAL_RANKS[student.currentLevel as ImperialLevel]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#c9a84c] font-semibold whitespace-nowrap">{student.assessmentCount}</td>
                          <td className="px-4 py-3 text-[#8b7355] whitespace-nowrap">{formatDate(student.lastActiveAt)}</td>
                          <td className="px-4 py-3 text-[#8b7355] whitespace-nowrap">{formatDate(student.joinedAt)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <ImperialButton
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Details
                            </ImperialButton>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filteredStudents.length > 0 && (
                <div className="p-4 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-between">
                  <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredStudents.length)} of {filteredStudents.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <ImperialButton
                      variant="ghost"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </ImperialButton>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-8 h-8 rounded text-sm font-[family-name:var(--font-heading)] transition-colors ${
                          page === i + 1
                            ? 'bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.3)]'
                            : 'text-[#8b7355] hover:text-[#c9a84c]'
                        }`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <ImperialButton
                      variant="ghost"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </ImperialButton>
                  </div>
                </div>
              )}
            </TacticalPanel>
          </motion.div>

          {/* ═══ Review Flags Section ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10"
          >
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#ff6b35]" />
              Review Flags
              {flags.length > 0 && (
                <span className="text-sm font-normal text-[#ff6b35]">({flags.length} unresolved)</span>
              )}
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : flags.length === 0 ? (
              <MetallicCard className="p-8 text-center" hover={false} glowOnHover={false}>
                <CheckCircle2 className="w-12 h-12 text-[#c9a84c] mx-auto mb-3" />
                <p className="text-[#c9a84c] font-[family-name:var(--font-heading)] text-lg font-semibold">All Clear</p>
                <p className="text-[#8b7355] text-sm mt-1">No unresolved flags in the Empire.</p>
              </MetallicCard>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {flags.map((flag, idx) => (
                  <motion.div
                    key={flag.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlowingBorder color="fire" intensity="medium">
                      <MetallicCard className="p-4" hover={false} glowOnHover={false}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-[#ff6b35] shrink-0" />
                              <span className="font-[family-name:var(--font-heading)] font-semibold text-[#e8e8e8]">
                                {flag.user.displayName || flag.user.email.split('@')[0]}
                              </span>
                              <span className="text-[#8b7355] text-xs">
                                ({flag.user.email})
                              </span>
                            </div>
                            <p className="text-[#8b7355] text-sm mb-2 leading-relaxed">
                              {flag.reason}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-[#8b7355]/70">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(flag.createdAt)}
                              </span>
                              {flag.notes && (
                                <span className="flex items-center gap-1 text-[#c9a84c]/60">
                                  <MessageSquare className="w-3 h-3" />
                                  Notes: {flag.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:min-w-[180px]">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Add notes..."
                                value={flagNotes[flag.id] || ''}
                                onChange={e => setFlagNotes(prev => ({ ...prev, [flag.id]: e.target.value }))}
                                className="flex-1 px-3 py-1.5 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] rounded text-xs text-[#e8e8e8] placeholder:text-[#8b7355]/40 focus:outline-none focus:border-[rgba(201,168,76,0.4)] font-[family-name:var(--font-heading)]"
                              />
                              <ImperialButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddNotes(flag.id)}
                                className="text-xs px-2"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </ImperialButton>
                            </div>
                            <ImperialButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleResolveFlag(flag.id)}
                              disabled={resolvingFlag === flag.id}
                              className="flex items-center gap-1.5 justify-center text-xs"
                            >
                              {resolvingFlag === flag.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Resolve
                            </ImperialButton>
                          </div>
                        </div>
                      </MetallicCard>
                    </GlowingBorder>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <SectionDivider />

          {/* ═══ Quick Actions ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetallicCard className="p-6 text-center" hover glowOnHover>
                <BookOpen className="w-8 h-8 text-[#c9a84c] mx-auto mb-3" />
                <h4 className="font-[family-name:var(--font-heading)] font-semibold text-[#e8e8e8] mb-2">View All Questions</h4>
                <p className="text-[#8b7355] text-xs mb-4">Browse and manage the question bank</p>
                <ImperialButton variant="secondary" size="sm" onClick={() => {
                  fetch('/api/questions?module=vocabulary')
                    .then(r => r.json())
                    .then(data => alert(`Question Bank:\n\nVocabulary: ${data.questions?.length ?? 0} questions\n\nVisit /api/questions?module=vocabulary to see all.`))
                    .catch(() => alert('Failed to load questions.'));
                }}>
                  Question Bank
                </ImperialButton>
              </MetallicCard>

              <MetallicCard className="p-6 text-center" hover glowOnHover>
                <Download className="w-8 h-8 text-[#cd7f32] mx-auto mb-3" />
                <h4 className="font-[family-name:var(--font-heading)] font-semibold text-[#e8e8e8] mb-2">Export Data</h4>
                <p className="text-[#8b7355] text-xs mb-4">Download reports and analytics data</p>
                <ImperialButton variant="secondary" size="sm" onClick={() => {
                  const data = { students: students.length, flags: flags.length, analytics: displayAnalytics };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'empire-analytics-export.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  Export
                </ImperialButton>
              </MetallicCard>

              <MetallicCard className="p-6 text-center" hover glowOnHover>
                <Shield className="w-8 h-8 text-[#ff6b35] mx-auto mb-3" />
                <h4 className="font-[family-name:var(--font-heading)] font-semibold text-[#e8e8e8] mb-2">Manage Question Bank</h4>
                <p className="text-[#8b7355] text-xs mb-4">Create, edit, and organize questions</p>
                <ImperialButton variant="secondary" size="sm" onClick={() => alert('Question Bank Management coming soon. Use the API endpoints at /api/questions to manage questions programmatically.')}>
                  Manage
                </ImperialButton>
              </MetallicCard>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer className="mt-auto" />

      {/* ═══ Student Detail Modal ═══ */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedStudent(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg z-10"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <GlowingBorder color="gold" intensity="high">
                <MetallicCard className="p-6" hover={false} glowOnHover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#c9a84c]">
                      Recruit Profile
                    </h3>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-[#8b7355] hover:text-[#c9a84c] transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: LEVEL_BG[selectedStudent.currentLevel], color: LEVEL_COLORS[selectedStudent.currentLevel] }}
                    >
                      {selectedStudent.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[#e8e8e8] font-[family-name:var(--font-heading)]">
                        {selectedStudent.displayName}
                      </p>
                      <p className="text-sm text-[#8b7355]">{selectedStudent.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Imperial Rank</span>
                      <ImperialRankBadge level={selectedStudent.currentLevel as ImperialLevel} size="sm" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Assessments</span>
                      <span className="text-[#c9a84c] font-semibold">{selectedStudent.assessmentCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Last Active</span>
                      <span className="text-[#e8e8e8] text-sm">{formatDateTime(selectedStudent.lastActiveAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Joined</span>
                      <span className="text-[#e8e8e8] text-sm">{formatDate(selectedStudent.joinedAt)}</span>
                    </div>

                    {selectedStudent.latestAssessment && (
                      <>
                        <div className="border-t border-[rgba(201,168,76,0.15)] pt-4 mt-4">
                          <p className="text-[#c9a84c] font-[family-name:var(--font-heading)] font-semibold text-sm mb-2">
                            Latest Assessment
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#8b7355]">Status</span>
                            <span className="text-[#c9a84c] capitalize">{selectedStudent.latestAssessment.status}</span>
                          </div>
                          {selectedStudent.latestAssessment.completedAt && (
                            <div className="flex items-center justify-between text-sm mt-2">
                              <span className="text-[#8b7355]">Completed</span>
                              <span className="text-[#e8e8e8]">{formatDate(selectedStudent.latestAssessment.completedAt)}</span>
                            </div>
                          )}
                          {selectedStudent.latestAssessment.assignedLevel !== null && (
                            <div className="flex items-center justify-between text-sm mt-2">
                              <span className="text-[#8b7355]">Assigned Level</span>
                              <span style={{ color: LEVEL_COLORS[selectedStudent.latestAssessment.assignedLevel] }}>
                                {IMPERIAL_RANKS[selectedStudent.latestAssessment.assignedLevel as ImperialLevel]}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <ImperialButton variant="secondary" size="sm" onClick={() => setSelectedStudent(null)}>
                      Close
                    </ImperialButton>
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
