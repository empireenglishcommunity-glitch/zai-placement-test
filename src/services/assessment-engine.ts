// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Dynamic Assessment Engine
// Anti-Cheating + Anti-Memorization + Fair Difficulty Balance
// ═══════════════════════════════════════════════════════════

import type { VocabularyBand, GrammarTopic } from '@/lib/types';

// ─── Seeded Pseudo-Random Number Generator ──────────────────
// Uses a deterministic mulberry32 PRNG so that a session seed
// always produces the same shuffle, preventing refresh exploits.

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Fisher-Yates Shuffle (seeded) ──────────────────────────

export function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Shuffle Options for a Single Question ──────────────────
// Returns: { shuffledOptions, newCorrectIndex, mapping }
// mapping = [newIndex0, newIndex1, ...] where mapping[originalIdx] = newIdx

export type ShuffledQuestion<Q extends { options: string[]; correctAnswer: number }> = Omit<Q, 'options' | 'correctAnswer'> & {
  options: string[];
  correctAnswer: number;
  _originalCorrectAnswer: number;
  _optionMapping: number[]; // originalIdx → newIdx
};

export function shuffleQuestionOptions<Q extends { options: string[]; correctAnswer: number }>(
  question: Q,
  seed: number
): ShuffledQuestion<Q> {
  const rng = mulberry32(seed);
  const options = [...question.options];
  const indices = options.map((_, i) => i);

  // Fisher-Yates on indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const shuffledOptions = indices.map(idx => options[idx]);
  const newCorrectAnswer = indices.indexOf(question.correctAnswer);

  // Build mapping: originalIdx → newIndex
  const mapping: number[] = new Array(options.length);
  indices.forEach((origIdx, newIdx) => {
    mapping[origIdx] = newIdx;
  });

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    _originalCorrectAnswer: question.correctAnswer,
    _optionMapping: mapping,
  };
}

// ─── Category-Based Question Selection ──────────────────────
// Selects N questions per category, maintaining difficulty balance.
// Avoids recently exposed questions for the user.

export interface QuestionPoolItem {
  id: string;
  module: string;
  topic: string | null;
  difficulty: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  type?: string | null;
  isActive?: boolean;
}

export interface CategoryConfig {
  category: string; // topic/band key
  count: number;    // questions to select per category
}

export interface SelectionResult {
  selectedQuestions: QuestionPoolItem[];
  selectedIds: string[];
}

export function selectQuestionsByCategory(
  pool: QuestionPoolItem[],
  categories: CategoryConfig[],
  exposedIds: Set<string>,
  attemptNumber: number,
  seed: number
): SelectionResult {
  const rng = mulberry32(seed);
  const selectedQuestions: QuestionPoolItem[] = [];
  const selectedIds: string[] = [];

  for (const cat of categories) {
    // Get all questions in this category
    let categoryQuestions = pool.filter(q => q.topic === cat.category);

    if (categoryQuestions.length === 0) continue;

    // For attempt 2+, try to avoid previously exposed questions
    if (attemptNumber > 1 && exposedIds.size > 0) {
      const unexposed = categoryQuestions.filter(q => !exposedIds.has(q.id));

      if (unexposed.length >= cat.count) {
        // Enough unexposed questions — use them
        categoryQuestions = unexposed;
      } else if (unexposed.length > 0) {
        // Mix: use all unexposed + fill with exposed
        const exposed = categoryQuestions.filter(q => exposedIds.has(q.id));
        // Sort exposed by least-recently-seen (we don't have that data in memory,
        // so shuffle deterministically and pick)
        const shuffledExposed = shuffleArray(exposed, seed + exposed.length);
        const needed = cat.count - unexposed.length;
        categoryQuestions = [...unexposed, ...shuffledExposed.slice(0, needed)];
      }
      // If no unexposed at all, fall through and use all available
    }

    // For attempt 3+, increase variation by shuffling more aggressively
    if (attemptNumber >= 3) {
      categoryQuestions = shuffleArray(categoryQuestions, seed + attemptNumber * 17);
    } else {
      categoryQuestions = shuffleArray(categoryQuestions, seed);
    }

    // Ensure difficulty balance: sort into difficulty tiers, sample evenly
    const balanced = balanceDifficulty(categoryQuestions, cat.count, seed);
    
    for (const q of balanced) {
      if (!selectedIds.includes(q.id)) {
        selectedQuestions.push(q);
        selectedIds.push(q.id);
      }
    }
  }

  return { selectedQuestions, selectedIds };
}

// ─── Difficulty Balancer ────────────────────────────────────
// Ensures fair difficulty distribution across selected questions.
// Groups questions into tiers and samples proportionally.

function balanceDifficulty(
  questions: QuestionPoolItem[],
  count: number,
  seed: number
): QuestionPoolItem[] {
  if (questions.length <= count) return questions;

  // Group by difficulty
  const tiers: Map<number, QuestionPoolItem[]> = new Map();
  for (const q of questions) {
    const tier = q.difficulty;
    if (!tiers.has(tier)) tiers.set(tier, []);
    tiers.get(tier)!.push(q);
  }

  // Sort tiers
  const sortedTiers = [...tiers.entries()].sort((a, b) => a[0] - b[0]);
  const numTiers = sortedTiers.length;

  // Distribute count evenly across tiers
  const perTier = Math.floor(count / numTiers);
  const remainder = count % numTiers;

  const result: QuestionPoolItem[] = [];
  const rng = mulberry32(seed + 42);

  for (let i = 0; i < sortedTiers.length; i++) {
    const [_, tierQuestions] = sortedTiers[i];
    const tierCount = perTier + (i < remainder ? 1 : 0);

    // Shuffle within tier
    const shuffled = [...tierQuestions];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(rng() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }

    result.push(...shuffled.slice(0, tierCount));
  }

  return result;
}

// ─── Session Seed Generation ────────────────────────────────
// Generates a deterministic seed from userId + module + timestamp

export function generateSessionSeed(userId: string, module: string, attemptNumber: number): number {
  let hash = 0;
  const str = `${userId}:${module}:${attemptNumber}:${Date.now()}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ─── Attempt-Weighted Score Calculation ─────────────────────
// First attempt has highest weight. Subsequent attempts are
// used for refinement only — prevents "score farming".

export interface AttemptScore {
  attemptNumber: number;
  score: number; // 0-100
}

export interface WeightedResult {
  weightedScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  interpretation: string;
}

export function calculateWeightedScore(attempts: AttemptScore[]): WeightedResult {
  if (attempts.length === 0) {
    return { weightedScore: 0, confidenceLevel: 'low', interpretation: 'No attempts recorded.' };
  }

  // Weight decay: 1st=1.0, 2nd=0.7, 3rd=0.5, 4th+=0.3
  const WEIGHTS = [1.0, 0.7, 0.5, 0.3];

  let totalWeight = 0;
  let weightedSum = 0;

  // Sort by attempt number
  const sorted = [...attempts].sort((a, b) => a.attemptNumber - b.attemptNumber);

  for (let i = 0; i < sorted.length; i++) {
    const weight = WEIGHTS[Math.min(i, WEIGHTS.length - 1)];
    weightedSum += sorted[i].score * weight;
    totalWeight += weight;
  }

  const weightedScore = Math.round(weightedSum / totalWeight);

  // Determine confidence
  let confidenceLevel: 'high' | 'medium' | 'low';
  let interpretation: string;

  if (sorted.length === 1) {
    confidenceLevel = 'high';
    interpretation = 'First attempt — this is the most reliable indicator of true ability.';
  } else if (sorted.length === 2) {
    const diff = Math.abs(sorted[0].score - sorted[1].score);
    if (diff <= 10) {
      confidenceLevel = 'high';
      interpretation = 'Consistent results across attempts. Score reliably reflects ability.';
    } else {
      confidenceLevel = 'medium';
      interpretation = 'Some variation between attempts. First attempt weighted more heavily.';
    }
  } else {
    const maxDiff = Math.max(...sorted.map(a => a.score)) - Math.min(...sorted.map(a => a.score));
    if (maxDiff <= 15) {
      confidenceLevel = 'high';
      interpretation = 'Consistent results across multiple attempts. Strong confidence in placement.';
    } else if (maxDiff <= 30) {
      confidenceLevel = 'medium';
      interpretation = 'Moderate variation. Earlier attempts weighted more — reflects baseline ability.';
    } else {
      confidenceLevel = 'low';
      interpretation = 'High variation detected. Placement based on weighted average with first attempt prioritized.';
    }
  }

  return { weightedScore, confidenceLevel, interpretation };
}

// ─── Vocabulary Category Configuration ──────────────────────

export const VOCABULARY_CATEGORIES: CategoryConfig[] = [
  { category: '1-500', count: 8 },
  { category: '501-1000', count: 8 },
  { category: '1001-2000', count: 8 },
  { category: '2001-3000', count: 8 },
  { category: '3001-5000', count: 8 },
];

// ─── Grammar Category Configuration ────────────────────────

export const GRAMMAR_CATEGORIES: CategoryConfig[] = [
  { category: 'present_simple', count: 3 },
  { category: 'present_continuous', count: 3 },
  { category: 'past_simple', count: 3 },
  { category: 'present_perfect', count: 4 },
  { category: 'future_forms', count: 3 },
  { category: 'conditionals', count: 3 },
  { category: 'passive_voice', count: 3 },
  { category: 'question_formation', count: 3 },
];

// ─── Retake Cooldown Check ─────────────────────────────────
// Prevents rapid-fire retakes (minimum 5 minutes between attempts)

export const MINIMUM_RETAKE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function canRetake(lastCompletedAt: Date | null): { allowed: boolean; remainingMs: number } {
  if (!lastCompletedAt) return { allowed: true, remainingMs: 0 };

  const elapsed = Date.now() - new Date(lastCompletedAt).getTime();
  const remaining = MINIMUM_RETAKE_INTERVAL_MS - elapsed;

  return {
    allowed: remaining <= 0,
    remainingMs: Math.max(0, remaining),
  };
}

// ─── Format Remaining Time ─────────────────────────────────

export function formatRemainingTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
