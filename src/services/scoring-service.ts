// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Scoring Engine Service
// Converts module scores into Imperial Levels
// ═══════════════════════════════════════════════════════════

import type { ImperialLevel, LevelAssignment } from '@/lib/types';
import {
  SPEAKING_LEVELS,
  LISTENING_LEVELS,
  VOCABULARY_LEVELS,
  GRAMMAR_LEVELS,
} from '@/lib/constants';
import { IMPERIAL_RANKS } from '@/lib/types';

// ─── Threshold Lookup ─────────────────────────────────────

function getLevelFromThresholds(
  score: number,
  thresholds: { min: number; max: number; level: ImperialLevel }[]
): ImperialLevel {
  for (const t of thresholds) {
    if (score >= t.min && score <= t.max) return t.level;
  }
  return 0;
}

// ─── Module Scores Input ──────────────────────────────────

export interface ModuleScores {
  speakingScore: number; // 0-100
  listeningScore: number; // 0-100
  vocabularyScore: number; // estimated vocab size
  grammarScore: number; // 0-100 percentage
}

// ─── Core Scoring Engine ──────────────────────────────────

export function calculateLevelAssignment(scores: ModuleScores): LevelAssignment {
  // Step 1: Convert each module score to a level
  const speakingLevel = getLevelFromThresholds(scores.speakingScore, SPEAKING_LEVELS);
  const listeningLevel = getLevelFromThresholds(scores.listeningScore, LISTENING_LEVELS);
  const vocabularyLevel = getLevelFromThresholds(scores.vocabularyScore, VOCABULARY_LEVELS);
  const grammarLevel = getLevelFromThresholds(scores.grammarScore, GRAMMAR_LEVELS);

  // Step 2: Majority rule
  const levels = [speakingLevel, listeningLevel, vocabularyLevel, grammarLevel];
  const levelCounts = new Map<ImperialLevel, number>();
  for (const l of levels) {
    levelCounts.set(l, (levelCounts.get(l) || 0) + 1);
  }

  let finalLevel: ImperialLevel = 0;
  let maxCount = 0;
  let isTie = false;

  for (const [level, count] of levelCounts) {
    if (count > maxCount) {
      maxCount = count;
      finalLevel = level;
      isTie = false;
    } else if (count === maxCount) {
      isTie = true;
    }
  }

  // Step 3: If tie, speaking score decides
  if (isTie) {
    finalLevel = speakingLevel;
  }

  // Step 4: Check for >20 point discrepancies (between percentage-based scores)
  const allScores = [scores.speakingScore, scores.listeningScore, scores.grammarScore];
  const maxScore = Math.max(...allScores);
  const minScore = Math.min(...allScores);
  const isFlagged = maxScore - minScore > 20;

  let flagReason: string | undefined;
  if (isFlagged) {
    flagReason = `Score discrepancy detected: range of ${maxScore - minScore} points across modules. Speaking: ${scores.speakingScore}, Listening: ${scores.listeningScore}, Grammar: ${scores.grammarScore}. Manual review recommended.`;
  }

  // Determine strengths and weaknesses
  const moduleLevels = [
    { name: 'Speaking', level: speakingLevel, score: scores.speakingScore },
    { name: 'Listening', level: listeningLevel, score: scores.listeningScore },
    { name: 'Vocabulary', level: vocabularyLevel, score: scores.vocabularyScore },
    { name: 'Grammar', level: grammarLevel, score: scores.grammarScore },
  ];

  const sorted = [...moduleLevels].sort((a, b) => b.level - a.level || b.score - a.score);
  const strengths = sorted.filter((m) => m.level >= finalLevel).map((m) => m.name);
  const weaknesses = sorted.filter((m) => m.level < finalLevel).map((m) => m.name);

  // Recommended path based on level
  const paths: Record<ImperialLevel, string> = {
    0: 'Begin with the Foundation Path: Focus on basic grammar structures, essential vocabulary (1-1000 words), listening at slow speeds, and pronunciation fundamentals.',
    1: 'Follow the Initiate Path: Strengthen grammar accuracy, expand vocabulary to 2000+ words, practice natural-speed listening, and work on fluency and confidence in speaking.',
    2: 'Embark on the Warrior Path: Master advanced grammar (conditionals, passive voice), push vocabulary to 3000+ words, train with fast listening, and develop natural speaking rhythm.',
    3: 'Enter the Champion Path: Perfect nuanced grammar, expand vocabulary beyond 5000 words, master rapid listening comprehension, and achieve near-native speaking proficiency.',
  };

  return {
    speakingLevel,
    listeningLevel,
    vocabularyLevel,
    grammarLevel,
    finalLevel,
    isFlagged,
    flagReason,
    strengths,
    weaknesses,
    recommendedPath: paths[finalLevel],
  };
}

// ─── Utility Functions ────────────────────────────────────

export function getLevelName(level: ImperialLevel): string {
  return IMPERIAL_RANKS[level];
}

export function getLevelColor(level: ImperialLevel): string {
  const colors: Record<ImperialLevel, string> = {
    0: '#8b7355',
    1: '#cd7f32',
    2: '#c9a84c',
    3: '#ff6b35',
  };
  return colors[level];
}
