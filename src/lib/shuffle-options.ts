/**
 * Shuffles answer options for a question while tracking the correct answer.
 * Uses Fisher-Yates shuffle with a seeded random for reproducibility per session.
 */
export function shuffleOptions(
  options: string[],
  correctAnswerIndex: number,
  seed?: number
): {
  shuffledOptions: string[];
  newCorrectIndex: number;
} {
  // Create index mapping
  const indices = options.map((_, i) => i);

  // Fisher-Yates shuffle with optional seed
  const random =
    seed !== undefined ? seededRandom(seed) : () => Math.random();

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const shuffledOptions = indices.map((i) => options[i]);
  const newCorrectIndex = indices.indexOf(correctAnswerIndex);

  return { shuffledOptions, newCorrectIndex };
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
