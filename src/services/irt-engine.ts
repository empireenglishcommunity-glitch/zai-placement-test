// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — IRT (Item Response Theory) Adaptive Engine
// Selects optimal questions based on student ability estimation
// Makes every test unique per student — impossible to memorize
// ═══════════════════════════════════════════════════════════

// ─── Types ──────────────────────────────────────────────────

export interface IRTItem {
  id: string;
  difficulty: number;      // b parameter: -3 (very easy) to +3 (very hard)
  discrimination: number;  // a parameter: how well item separates abilities (0.5-2.5)
  guessing: number;        // c parameter: probability of guessing correctly (0.25 for 4-choice)
}

export interface IRTResponse {
  itemId: string;
  correct: boolean;
  responseTime?: number;   // milliseconds (optional, for future use)
}

export interface AbilityEstimate {
  theta: number;           // Current ability estimate (-3 to +3)
  standardError: number;   // Uncertainty in the estimate
  confidence: number;      // 1 - SE (higher = more confident)
  responses: number;       // Number of items answered
  history: { theta: number; se: number }[];  // History of estimates
}

export interface IRTConfig {
  /** Starting ability estimate (default: 0 = average) */
  initialTheta: number;
  /** Minimum items before stopping (default: 5) */
  minItems: number;
  /** Maximum items (hard stop) (default: 20) */
  maxItems: number;
  /** Standard error threshold to stop (default: 0.4) */
  seThreshold: number;
  /** Number of options per question (for guessing parameter) */
  numOptions: number;
}

// ─── Default Configuration ──────────────────────────────────

export const DEFAULT_IRT_CONFIG: IRTConfig = {
  initialTheta: 0,
  minItems: 5,
  maxItems: 15,
  seThreshold: 0.45,
  numOptions: 4,
};

// ─── 3PL IRT Model ─────────────────────────────────────────
// P(correct | theta, a, b, c) = c + (1-c) / (1 + exp(-a*(theta-b)))

/**
 * Calculate probability of correct response given ability and item parameters
 */
export function probability(theta: number, item: IRTItem): number {
  const { difficulty: b, discrimination: a, guessing: c } = item;
  const exponent = -a * (theta - b);
  return c + (1 - c) / (1 + Math.exp(exponent));
}

/**
 * Calculate item information at a given ability level.
 * Higher information = more useful for estimating ability at this level.
 */
export function itemInformation(theta: number, item: IRTItem): number {
  const p = probability(theta, item);
  const q = 1 - p;
  const { discrimination: a, guessing: c } = item;

  // Fisher information for 3PL model
  const numerator = a * a * Math.pow(p - c, 2) * q;
  const denominator = Math.pow(1 - c, 2) * p;

  if (denominator === 0) return 0;
  return numerator / denominator;
}

// ─── Ability Estimation (EAP - Expected A Posteriori) ───────

/**
 * Estimate student ability using EAP (Bayesian estimation).
 * More robust than MLE for short tests.
 */
export function estimateAbility(
  responses: IRTResponse[],
  items: Map<string, IRTItem>,
  priorMean: number = 0,
  priorSD: number = 1,
): AbilityEstimate {
  if (responses.length === 0) {
    return {
      theta: priorMean,
      standardError: priorSD,
      confidence: 0,
      responses: 0,
      history: [],
    };
  }

  // EAP estimation using quadrature points
  const numPoints = 41;
  const thetaMin = -4;
  const thetaMax = 4;
  const step = (thetaMax - thetaMin) / (numPoints - 1);

  let numerator = 0;
  let denominator = 0;
  let numerator2 = 0; // For variance calculation

  for (let i = 0; i < numPoints; i++) {
    const theta = thetaMin + i * step;

    // Calculate likelihood of all responses at this theta
    let logLikelihood = 0;
    for (const response of responses) {
      const item = items.get(response.itemId);
      if (!item) continue;

      const p = probability(theta, item);
      if (response.correct) {
        logLikelihood += Math.log(Math.max(p, 0.0001));
      } else {
        logLikelihood += Math.log(Math.max(1 - p, 0.0001));
      }
    }

    // Prior: normal distribution
    const priorLogDensity = -0.5 * Math.pow((theta - priorMean) / priorSD, 2);

    // Posterior (unnormalized)
    const logPosterior = logLikelihood + priorLogDensity;
    const posterior = Math.exp(logPosterior);

    numerator += theta * posterior * step;
    numerator2 += theta * theta * posterior * step;
    denominator += posterior * step;
  }

  // EAP estimate
  const thetaEAP = denominator > 0 ? numerator / denominator : priorMean;

  // Standard error (posterior SD)
  const variance = denominator > 0
    ? (numerator2 / denominator) - thetaEAP * thetaEAP
    : priorSD * priorSD;
  const se = Math.sqrt(Math.max(variance, 0.01));

  // Build history
  const history: { theta: number; se: number }[] = [];
  for (let r = 1; r <= responses.length; r++) {
    const subResponses = responses.slice(0, r);
    // Quick re-estimate for history (simplified)
    let correct = 0;
    for (const resp of subResponses) {
      if (resp.correct) correct++;
    }
    const ratio = correct / r;
    // Simple logit transform for history visualization
    const histTheta = Math.log((ratio + 0.01) / (1 - ratio + 0.01));
    const histSE = 1 / Math.sqrt(r);
    history.push({ theta: Math.max(-3, Math.min(3, histTheta)), se: histSE });
  }

  return {
    theta: Math.max(-3, Math.min(3, thetaEAP)),
    standardError: Math.min(se, 2),
    confidence: Math.max(0, 1 - se),
    responses: responses.length,
    history,
  };
}

// ─── Item Selection (Maximum Information) ───────────────────

/**
 * Select the next best item to administer.
 * Chooses the item with maximum information at current ability estimate.
 * Excludes already-administered items.
 */
export function selectNextItem(
  currentTheta: number,
  availableItems: IRTItem[],
  administeredIds: Set<string>,
): IRTItem | null {
  const remaining = availableItems.filter(item => !administeredIds.has(item.id));

  if (remaining.length === 0) return null;

  // Find item with maximum information at current theta
  let bestItem: IRTItem | null = null;
  let bestInfo = -Infinity;

  for (const item of remaining) {
    const info = itemInformation(currentTheta, item);
    if (info > bestInfo) {
      bestInfo = info;
      bestItem = item;
    }
  }

  return bestItem;
}

// ─── Stopping Rule ──────────────────────────────────────────

/**
 * Determine whether to stop testing.
 * Stops when: SE < threshold AND min items reached, OR max items reached.
 */
export function shouldStop(
  estimate: AbilityEstimate,
  config: IRTConfig = DEFAULT_IRT_CONFIG,
): boolean {
  // Hard stop at max items
  if (estimate.responses >= config.maxItems) return true;

  // Don't stop before minimum items
  if (estimate.responses < config.minItems) return false;

  // Stop when standard error is below threshold (confident enough)
  return estimate.standardError <= config.seThreshold;
}

// ─── Convert Theta to Score ─────────────────────────────────

/**
 * Convert IRT ability (theta: -3 to +3) to a 0-30 TOEFL section score.
 * Uses a linear transformation with floor/ceiling.
 */
export function thetaToScore(theta: number): number {
  // Map theta range [-3, +3] to score range [0, 30]
  // theta -3 = score 0, theta 0 = score 15, theta +3 = score 30
  const score = Math.round((theta + 3) / 6 * 30);
  return Math.max(0, Math.min(30, score));
}

/**
 * Convert IRT ability to Imperial Level (0-3).
 */
export function thetaToLevel(theta: number): 0 | 1 | 2 | 3 {
  if (theta < -1.5) return 0;  // Recruit
  if (theta < 0) return 1;     // Initiate
  if (theta < 1.5) return 2;   // Warrior
  return 3;                     // Champion
}

// ─── Assign Difficulty to Reading Questions ─────────────────

/**
 * Map passage difficulty labels to IRT difficulty parameters.
 * These are initial estimates; they would be calibrated from real data over time.
 */
export function getReadingItemDifficulty(passageDifficulty: 'easy' | 'medium' | 'hard', questionIndex: number): IRTItem {
  // Base difficulty by passage level
  const baseDifficulty: Record<string, number> = {
    easy: -1.5,
    medium: 0,
    hard: 1.5,
  };

  // Slight variation per question within a passage
  // Main idea questions are slightly easier, vocabulary/inference slightly harder
  const questionOffsets = [-0.3, 0, 0.2, 0.3, 0.1]; // q1 easiest, q4 hardest

  const b = baseDifficulty[passageDifficulty] + (questionOffsets[questionIndex] || 0);

  return {
    id: '', // Set by caller
    difficulty: b,
    discrimination: passageDifficulty === 'hard' ? 1.5 : passageDifficulty === 'medium' ? 1.2 : 1.0,
    guessing: 0.25, // 4-choice questions
  };
}

// ─── Adaptive Reading Test Controller ───────────────────────

export interface AdaptiveReadingState {
  /** Current ability estimate */
  estimate: AbilityEstimate;
  /** Items administered so far */
  administeredIds: Set<string>;
  /** Responses recorded */
  responses: IRTResponse[];
  /** Available item pool with IRT parameters */
  itemPool: IRTItem[];
  /** Configuration */
  config: IRTConfig;
  /** Whether the test is complete */
  isComplete: boolean;
  /** Final score (0-30) once complete */
  finalScore: number | null;
}

/**
 * Initialize a new adaptive reading test.
 */
export function initAdaptiveTest(
  itemPool: IRTItem[],
  config: IRTConfig = DEFAULT_IRT_CONFIG,
): AdaptiveReadingState {
  return {
    estimate: {
      theta: config.initialTheta,
      standardError: 1.0,
      confidence: 0,
      responses: 0,
      history: [],
    },
    administeredIds: new Set(),
    responses: [],
    itemPool,
    config,
    isComplete: false,
    finalScore: null,
  };
}

/**
 * Process a response and determine next action.
 * Returns updated state + whether to continue or stop.
 */
export function processResponse(
  state: AdaptiveReadingState,
  response: IRTResponse,
): AdaptiveReadingState {
  // Add response
  const newResponses = [...state.responses, response];
  const newAdministered = new Set(state.administeredIds);
  newAdministered.add(response.itemId);

  // Re-estimate ability
  const itemMap = new Map(state.itemPool.map(item => [item.id, item]));
  const newEstimate = estimateAbility(newResponses, itemMap);

  // Check stopping rule
  const complete = shouldStop(newEstimate, state.config);

  return {
    ...state,
    estimate: newEstimate,
    administeredIds: newAdministered,
    responses: newResponses,
    isComplete: complete,
    finalScore: complete ? thetaToScore(newEstimate.theta) : null,
  };
}

/**
 * Get the next item to administer.
 * Returns null if test is complete.
 */
export function getNextItem(state: AdaptiveReadingState): IRTItem | null {
  if (state.isComplete) return null;
  return selectNextItem(state.estimate.theta, state.itemPool, state.administeredIds);
}
