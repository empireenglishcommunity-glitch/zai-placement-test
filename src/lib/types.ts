// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Core Type Definitions
// ═══════════════════════════════════════════════════════════

// ─── Assessment Module Types ───────────────────────────────

export type ModuleType = 'speaking' | 'listening' | 'vocabulary' | 'grammar';

export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed';

export type ImperialLevel = 0 | 1 | 2 | 3;

export const IMPERIAL_RANKS: Record<ImperialLevel, string> = {
  0: 'Recruit',
  1: 'Initiate',
  2: 'Warrior',
  3: 'Champion',
};

export const IMPERIAL_RANK_DESCRIPTIONS: Record<ImperialLevel, string> = {
  0: 'You stand at the gates of the Empire. The journey begins here.',
  1: 'You have taken your first oath. The training grounds await.',
  2: 'You have proven your mettle. The Empire recognizes your strength.',
  3: 'You have mastered the trials. You stand among the elite.',
};

// ─── Speaking Assessment ───────────────────────────────────

export interface SpeakingReadAloud {
  id: string;
  passage: string;
  order: number;
}

export interface SpeakingPrompt {
  id: string;
  prompt: string;
  category: 'daily_routine' | 'goals' | 'places' | 'opinions' | 'experiences';
}

export interface SpeakingShadowing {
  id: string;
  transcript: string;
  audioUrl: string;
  duration: number; // seconds
}

export interface SpeakingScore {
  pronunciation: number;    // 0-100
  fluency: number;          // 0-100
  wordsPerMinute: number;   // actual WPM
  phonemeAccuracy: number;  // 0-100
  grammarAccuracy: number;  // 0-100
  vocabularyRange: number;  // 0-100
  confidence: number;       // 0-100
  rhythmMatch: number;      // 0-100 (shadowing)
  overallScore: number;     // 0-100 weighted
  level: ImperialLevel;
}

// ─── Listening Assessment ──────────────────────────────────

export type ListeningSpeed = 'slow' | 'natural' | 'fast';

export interface ListeningPassage {
  id: string;
  audioUrl: string;
  transcript: string;
  speed: ListeningSpeed;    // slow=80wpm, natural=130wpm, fast=160wpm
  duration: number;
}

export interface ListeningQuestion {
  id: string;
  passageId: string;
  question: string;
  options: string[];
  correctAnswer: number;    // index
  type: 'literal' | 'inference' | 'detail';
}

export interface ListeningScore {
  literalComprehension: number;  // 0-100
  inference: number;             // 0-100
  detailRecognition: number;     // 0-100
  overallScore: number;          // 0-100
  level: ImperialLevel;
}

// ─── Vocabulary Assessment ─────────────────────────────────

export type VocabularyBand = '1-500' | '501-1000' | '1001-2000' | '2001-3000' | '3001-5000';

export interface VocabularyQuestion {
  id: string;
  word: string;
  options: string[];
  correctAnswer: number;    // index
  band: VocabularyBand;
}

export interface VocabularyScore {
  correctByBand: Record<VocabularyBand, { correct: number; total: number }>;
  estimatedVocabularySize: number;
  overallScore: number;     // 0-100
  level: ImperialLevel;
}

// ─── Grammar Assessment ────────────────────────────────────

export type GrammarTopic =
  | 'present_simple'
  | 'present_continuous'
  | 'past_simple'
  | 'present_perfect'
  | 'future_forms'
  | 'conditionals'
  | 'passive_voice'
  | 'question_formation';

export type GrammarQuestionType = 'completion' | 'error_identification' | 'transformation';

export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;    // index
  topic: GrammarTopic;
  questionType: GrammarQuestionType;
}

export interface GrammarScore {
  correctByTopic: Record<GrammarTopic, { correct: number; total: number }>;
  percentage: number;       // 0-100
  level: ImperialLevel;
}

// ─── Assessment Session ────────────────────────────────────

export interface AssessmentSession {
  id: string;
  userId: string;
  status: AssessmentStatus;
  startedAt: Date;
  completedAt?: Date;
  speakingScore?: SpeakingScore;
  listeningScore?: ListeningScore;
  vocabularyScore?: VocabularyScore;
  grammarScore?: GrammarScore;
  assignedLevel?: ImperialLevel;
  flagged: boolean;
  flagReason?: string;
}

// ─── Level Assignment ──────────────────────────────────────

export interface LevelAssignment {
  speakingLevel: ImperialLevel;
  listeningLevel: ImperialLevel;
  vocabularyLevel: ImperialLevel;
  grammarLevel: ImperialLevel;
  finalLevel: ImperialLevel;
  isFlagged: boolean;
  flagReason?: string;
  strengths: string[];
  weaknesses: string[];
  recommendedPath: string;
}

// ─── User & Profile ────────────────────────────────────────

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  currentLevel: ImperialLevel | null;
  assessmentCount: number;
  joinedAt: Date;
  avatarUrl?: string;
  isAdmin: boolean;
}

// ─── Admin Types ───────────────────────────────────────────

export interface ReviewFlag {
  id: string;
  userId: string;
  assessmentId: string;
  reason: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  resolved: boolean;
  notes?: string;
}

export interface AdminNote {
  id: string;
  adminId: string;
  targetUserId: string;
  content: string;
  createdAt: Date;
}

// ─── API Response Types ────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AISpeakingEvaluation {
  transcript: string;
  pronunciation: number;
  fluency: number;
  wordsPerMinute: number;
  phonemeAccuracy: number;
  grammarAccuracy: number;
  vocabularyRange: number;
  confidence: number;
  feedback: string;
}

export interface AIShadowingEvaluation {
  rhythmMatch: number;
  pronunciationSimilarity: number;
  phonemeMatch: number;
  feedback: string;
}
