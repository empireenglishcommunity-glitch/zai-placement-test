/**
 * TOEFL-style answer option shuffling.
 * 
 * Ensures:
 * 1. Correct answer position is truly random (not biased by question ID patterns)
 * 2. Uses per-session randomness (different every test attempt)
 * 3. Maintains consistency within a single question (won't change on re-render)
 * 4. No position appears more than 3 times consecutively
 */

// Per-session random seed (changes every time the page loads)
let sessionSeed: number | null = null;

function getSessionSeed(): number {
  if (sessionSeed === null) {
    sessionSeed = Date.now() ^ (Math.random() * 0xffffffff);
  }
  return sessionSeed;
}

// Track correct answer positions within a session to enforce TOEFL distribution
const positionHistory: number[] = [];

/**
 * Shuffles answer options for a question with TOEFL-level randomization.
 */
export function shuffleOptions(
  options: string[],
  correctAnswerIndex: number,
  questionSeed?: number
): {
  shuffledOptions: string[];
  newCorrectIndex: number;
} {
  if (options.length <= 1) {
    return { shuffledOptions: [...options], newCorrectIndex: correctAnswerIndex };
  }

  const numOptions = options.length;
  const combinedSeed = hashCombine(getSessionSeed(), questionSeed ?? 0);
  const random = xorshiftRandom(combinedSeed);

  // Determine target position for correct answer
  // Use random but avoid 3+ consecutive same position
  let targetPosition = Math.floor(random() * numOptions);
  
  // Check if this would create 3+ consecutive same position
  if (positionHistory.length >= 2) {
    const last2 = positionHistory.slice(-2);
    if (last2[0] === last2[1] && last2[1] === targetPosition) {
      // Would be 3 in a row — shift to a different position
      const alternatives = Array.from({ length: numOptions }, (_, i) => i).filter(i => i !== targetPosition);
      targetPosition = alternatives[Math.floor(random() * alternatives.length)];
    }
  }
  
  positionHistory.push(targetPosition);
  // Keep history bounded
  if (positionHistory.length > 50) positionHistory.splice(0, positionHistory.length - 20);

  // Build shuffled array with correct answer at targetPosition
  const wrongOptions = options.filter((_, i) => i !== correctAnswerIndex);
  
  // Shuffle wrong options
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }

  // Place correct answer at target position, fill rest with shuffled wrong options
  const shuffledOptions: string[] = [];
  let wrongIdx = 0;
  for (let i = 0; i < numOptions; i++) {
    if (i === targetPosition) {
      shuffledOptions.push(options[correctAnswerIndex]);
    } else {
      shuffledOptions.push(wrongOptions[wrongIdx++]);
    }
  }

  return { shuffledOptions, newCorrectIndex: targetPosition };
}

/**
 * Xorshift128 — much better distribution than linear congruential.
 */
function xorshiftRandom(seed: number): () => number {
  let state = seed | 1;
  for (let i = 0; i < 8; i++) {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
  }
  return () => {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
}

/**
 * Hash combine — mixes two numbers into a single hash.
 */
function hashCombine(a: number, b: number): number {
  let h = a ^ (b * 0x5bd1e995);
  h ^= h >> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >> 15;
  return h | 0;
}
