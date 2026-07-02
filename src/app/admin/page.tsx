'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users, BookOpen, Headphones, Mic, PenTool, Crown,
  ChevronDown, ChevronUp, Search, RefreshCw, Shield,
} from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialButton,
  GlowingBorder,
  SectionDivider,
} from '@/components/empire';
import { IMPERIAL_RANKS } from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────

interface StudentData {
  id: string;
  displayName: string;
  email: string;
  currentLevel: number;
  cefr: string | null;
  assessmentCount: number;
  lastActiveAt: string;
  joinedAt: string;
  reading: number | null;
  listening: number | null;
  speaking: number | null;
  writing: number | null;
  total: number | null;
  completedSections: number;
  hasStarted: boolean;
  isComplete: boolean;
}

type SortField = 'displayName' | 'total' | 'reading' | 'listening' | 'speaking' | 'writing' | 'joinedAt';
type SortDir = 'asc' | 'desc';

// ─── Component ────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('total');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  // Filter + Sort
  const filtered = students.filter(s =>
    s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField] ?? -1;
    const bVal = b[sortField] ?? -1;
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  // Stats
  const totalStudents = students.length;
  const completedAll = students.filter(s => s.isComplete).length;
  const avgTotal = students.filter(s => s.total != null).length > 0
    ? Math.round(students.filter(s => s.total != null).reduce((sum, s) => sum + (s.total || 0), 0) / students.filter(s => s.total != null).length)
    : 0;
  const levelDist = [0, 1, 2, 3].map(l => students.filter(s => s.currentLevel === l).length);

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  // Level colors
  const levelColors = ['#8b7355', '#cd7f32', '#c9a84c', '#ff6b35'];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#c9a84c]">
                  Command Center
                </h1>
                <p className="text-[#8b7355] text-sm mt-1">TOEFL Score Administration</p>
              </div>
              <ImperialButton variant="outline" size="sm" onClick={fetchStudents} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </ImperialButton>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <MetallicCard className="p-4 text-center" hover={false}>
              <Users className="w-5 h-5 text-[#c9a84c] mx-auto mb-2" />
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#c9a84c]">{totalStudents}</p>
              <p className="text-[#8b7355] text-xs">Total Students</p>
            </MetallicCard>
            <MetallicCard className="p-4 text-center" hover={false}>
              <Shield className="w-5 h-5 text-[#4ade80] mx-auto mb-2" />
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#4ade80]">{completedAll}</p>
              <p className="text-[#8b7355] text-xs">Completed All 4</p>
            </MetallicCard>
            <MetallicCard className="p-4 text-center" hover={false}>
              <Crown className="w-5 h-5 text-[#cd7f32] mx-auto mb-2" />
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#cd7f32]">{avgTotal}/120</p>
              <p className="text-[#8b7355] text-xs">Avg Score</p>
            </MetallicCard>
            <MetallicCard className="p-4 text-center" hover={false}>
              <div className="flex justify-center gap-1 mb-2">
                {levelDist.map((count, i) => (
                  <div key={i} className="text-center">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold" style={{ borderColor: levelColors[i], color: levelColors[i] }}>{count}</div>
                  </div>
                ))}
              </div>
              <p className="text-[#8b7355] text-xs">Level Distribution</p>
            </MetallicCard>
          </motion.div>

          <SectionDivider />

          {/* Search */}
          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111118] border border-[rgba(201,168,76,0.2)] text-[#e8e8e8] text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(201,168,76,0.5)]"
              />
            </div>
          </motion.div>

          {/* Student Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlowingBorder color="gold" intensity="low">
              <MetallicCard className="p-0 overflow-hidden" hover={false}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)]">
                        <th className="text-left p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('displayName')}>
                          <span className="flex items-center gap-1">Student <SortIcon field="displayName" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('reading')}>
                          <span className="flex items-center justify-center gap-1"><BookOpen className="w-3 h-3" /> R <SortIcon field="reading" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('listening')}>
                          <span className="flex items-center justify-center gap-1"><Headphones className="w-3 h-3" /> L <SortIcon field="listening" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('speaking')}>
                          <span className="flex items-center justify-center gap-1"><Mic className="w-3 h-3" /> S <SortIcon field="speaking" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('writing')}>
                          <span className="flex items-center justify-center gap-1"><PenTool className="w-3 h-3" /> W <SortIcon field="writing" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider cursor-pointer hover:text-[#e8d48b]" onClick={() => handleSort('total')}>
                          <span className="flex items-center justify-center gap-1">Total <SortIcon field="total" /></span>
                        </th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider">CEFR</th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider">Level</th>
                        <th className="text-center p-3 font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={9} className="p-8 text-center text-[#8b7355]">Loading students...</td></tr>
                      ) : sorted.length === 0 ? (
                        <tr><td colSpan={9} className="p-8 text-center text-[#8b7355]">No students found</td></tr>
                      ) : sorted.map((student) => (
                        <tr key={student.id} className="border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                          <td className="p-3">
                            <div>
                              <p className="font-[family-name:var(--font-heading)] text-[#e8e8e8] text-sm">{student.displayName}</p>
                              <p className="text-[#8b7355] text-[10px]">{student.email}</p>
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <ScoreCell score={student.reading} />
                          </td>
                          <td className="text-center p-3">
                            <ScoreCell score={student.listening} />
                          </td>
                          <td className="text-center p-3">
                            <ScoreCell score={student.speaking} />
                          </td>
                          <td className="text-center p-3">
                            <ScoreCell score={student.writing} />
                          </td>
                          <td className="text-center p-3">
                            {student.total != null ? (
                              <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#c9a84c]">{student.total}</span>
                            ) : (
                              <span className="text-[#555]">—</span>
                            )}
                          </td>
                          <td className="text-center p-3">
                            {student.cefr ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-heading)] border border-[rgba(201,168,76,0.3)] text-[#c9a84c] bg-[rgba(201,168,76,0.05)]">
                                {student.cefr}
                              </span>
                            ) : (
                              <span className="text-[#555]">—</span>
                            )}
                          </td>
                          <td className="text-center p-3">
                            <span className="font-[family-name:var(--font-heading)] text-xs font-bold" style={{ color: levelColors[student.currentLevel] }}>
                              {IMPERIAL_RANKS[student.currentLevel as ImperialLevel]}
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-heading)] tracking-wider ${
                              student.isComplete ? 'border border-[rgba(74,222,128,0.3)] text-[#4ade80] bg-[rgba(74,222,128,0.05)]'
                              : student.hasStarted ? 'border border-[rgba(201,168,76,0.3)] text-[#c9a84c] bg-[rgba(201,168,76,0.05)]'
                              : 'border border-[rgba(139,115,85,0.3)] text-[#8b7355] bg-[rgba(139,115,85,0.05)]'
                            }`}>
                              {student.isComplete ? `${student.completedSections}/4 ✓` : student.hasStarted ? `${student.completedSections}/4` : 'New'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </MetallicCard>
            </GlowingBorder>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Score Cell Component ──────────────────────────────────

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#555]">—</span>;

  const color = score >= 24 ? '#4ade80' : score >= 15 ? '#c9a84c' : score >= 8 ? '#cd7f32' : '#8b7355';

  return (
    <span className="font-[family-name:var(--font-heading)] text-sm font-bold" style={{ color }}>
      {score}
    </span>
  );
}
