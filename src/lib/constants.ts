// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Application Constants
// ═══════════════════════════════════════════════════════════

export const APP_NAME = 'Empire English Community';
export const APP_TAGLINE = 'Forged in Language. Crowned in Mastery.';
export const APP_DESCRIPTION = 'An elite imperial English transformation academy. Enter the Empire, complete the Four Trials, prove your worth, and earn your Imperial Rank.';

// ─── Imperial Design Tokens ────────────────────────────────

export const EMPIRE_COLORS = {
  matteBlack: '#0a0a0a',
  deepCharcoal: '#1a1a2e',
  darkMetal: '#16213e',
  antiqueGold: '#c9a84c',
  bronze: '#cd7f32',
  fireGlow: '#ff6b35',
  ember: '#e74c3c',
  silver: '#c0c0c0',
  mutedGold: '#8b7355',
  darkBronze: '#8b6914',
  imperialPurple: '#4a0e4e',
  midnightBlue: '#0c0c24',
} as const;

// ─── Level Thresholds ──────────────────────────────────────

export const SPEAKING_LEVELS = [
  { min: 0, max: 30, level: 0 as const },
  { min: 31, max: 55, level: 1 as const },
  { min: 56, max: 75, level: 2 as const },
  { min: 76, max: 100, level: 3 as const },
];

export const LISTENING_LEVELS = [
  { min: 0, max: 35, level: 0 as const },
  { min: 36, max: 60, level: 1 as const },
  { min: 61, max: 80, level: 2 as const },
  { min: 81, max: 100, level: 3 as const },
];

export const VOCABULARY_LEVELS = [
  { min: 0, max: 400, level: 0 as const },
  { min: 401, max: 1200, level: 1 as const },
  { min: 1201, max: 2500, level: 2 as const },
  { min: 2501, max: 10000, level: 3 as const },
];

export const GRAMMAR_LEVELS = [
  { min: 0, max: 35, level: 0 as const },
  { min: 36, max: 60, level: 1 as const },
  { min: 61, max: 80, level: 2 as const },
  { min: 81, max: 100, level: 3 as const },
];

// ─── Assessment Configuration ──────────────────────────────

export const SPEAKING_CONFIG = {
  readAloudPassages: 3,
  spontaneousDuration: 60,      // seconds
  shadowingDuration: 15,        // seconds
  shadowingCount: 3,
};

export const LISTENING_CONFIG = {
  speeds: {
    slow: { wpm: 80, label: 'Slow March' },
    natural: { wpm: 130, label: 'Steady Pace' },
    fast: { wpm: 160, label: 'Battle Speed' },
  },
  questionsPerPassage: 3,
};

export const VOCABULARY_CONFIG = {
  totalQuestions: 40,
  bands: {
    '1-500': { questions: 8, label: 'Foundation Words' },
    '501-1000': { questions: 8, label: 'Common Words' },
    '1001-2000': { questions: 8, label: 'Intermediate Words' },
    '2001-3000': { questions: 8, label: 'Advanced Words' },
    '3001-5000': { questions: 8, label: 'Elite Words' },
  },
};

export const GRAMMAR_CONFIG = {
  totalQuestions: 25,
  topics: {
    present_simple: { questions: 3, label: 'Present Simple' },
    present_continuous: { questions: 3, label: 'Present Continuous' },
    past_simple: { questions: 3, label: 'Past Simple' },
    present_perfect: { questions: 4, label: 'Present Perfect' },
    future_forms: { questions: 3, label: 'Future Forms' },
    conditionals: { questions: 3, label: 'Conditionals' },
    passive_voice: { questions: 3, label: 'Passive Voice' },
    question_formation: { questions: 3, label: 'Question Formation' },
  },
};

// ─── Module Names & Descriptions ───────────────────────────

export const MODULE_INFO = {
  speaking: {
    name: 'Trial of Voice',
    icon: '🎤',
    description: 'Prove your spoken command of the language. Read, respond, and shadow.',
    empireTitle: 'The Oratory Trial',
  },
  listening: {
    name: 'Trial of the Ear',
    icon: '👂',
    description: 'Demonstrate your ability to understand spoken English at varying speeds.',
    empireTitle: 'The Perception Trial',
  },
  vocabulary: {
    name: 'Trial of Words',
    icon: '📖',
    description: 'Show the breadth of your lexical knowledge across frequency bands.',
    empireTitle: 'The Lexicon Trial',
  },
  grammar: {
    name: 'Trial of Structure',
    icon: '⚔️',
    description: 'Prove your mastery of the structural foundations of English.',
    empireTitle: 'The Foundation Trial',
  },
} as const;

// ─── Navigation ────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: 'Hall', href: '/', icon: 'home' },
  { label: 'Dashboard', href: '/dashboard', icon: 'shield' },
  { label: 'Trials', href: '/assessment', icon: 'swords' },
  { label: 'Results', href: '/results', icon: 'scroll' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Command Center', href: '/admin', icon: 'crown' },
  { label: 'Recruits', href: '/admin/students', icon: 'users' },
  { label: 'Review Flags', href: '/admin/flags', icon: 'flag' },
  { label: 'Questions', href: '/admin/questions', icon: 'book' },
] as const;
