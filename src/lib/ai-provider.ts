// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Unified AI Provider with Triple-Fallback
// Primary: Groq llama-3.3-70b-versatile (1000 req/day)
// Fallback 1: Groq llama-3.1-8b-instant (14,400 req/day)
// Fallback 2: Deterministic scoring (no API, unlimited)
// Result: Students NEVER see an error
// ═══════════════════════════════════════════════════════════

// ─── Configuration ──────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const MODELS = {
  primary: 'llama-3.3-70b-versatile',
  fallback: 'llama-3.1-8b-instant',
} as const;

// ─── Types ──────────────────────────────────────────────────

export interface AIResponse {
  content: string;
  model: string;
  source: 'groq-70b' | 'groq-8b' | 'deterministic';
  latencyMs: number;
}

export interface AIRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

// ─── Core: Call Groq API ────────────────────────────────────

async function callGroq(
  model: string,
  options: AIRequestOptions,
  timeoutMs: number = 15000
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.userPrompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    };

    if (options.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const status = res.status;
      // 429 = rate limited, 503 = overloaded — both are retryable on fallback
      if (status === 429 || status === 503) return null;
      // Other errors (401 bad key, 400 bad request)
      console.error(`[ai-provider] Groq ${model} returned ${status}`);
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    clearTimeout(timeout);
    // Timeout or network error
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn(`[ai-provider] Groq ${model} timed out after ${timeoutMs}ms`);
    }
    return null;
  }
}

// ─── Legacy: Call Gemini (kept as optional last resort) ──────

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

// ─── Main: Triple-Fallback AI Call ──────────────────────────

/**
 * Calls AI with triple-fallback:
 * 1. Groq 70b (best quality, 1000 req/day)
 * 2. Groq 8b (good quality, 14,400 req/day)
 * 3. Returns null → caller uses deterministic fallback
 */
export async function callAI(options: AIRequestOptions): Promise<AIResponse | null> {
  const start = Date.now();

  // Try primary: Groq 70b
  const result70b = await callGroq(MODELS.primary, options);
  if (result70b) {
    return {
      content: result70b,
      model: MODELS.primary,
      source: 'groq-70b',
      latencyMs: Date.now() - start,
    };
  }

  // Try fallback: Groq 8b
  const result8b = await callGroq(MODELS.fallback, options);
  if (result8b) {
    return {
      content: result8b,
      model: MODELS.fallback,
      source: 'groq-8b',
      latencyMs: Date.now() - start,
    };
  }

  // Both Groq models failed — return null (caller handles deterministic)
  console.warn('[ai-provider] All AI providers failed, using deterministic fallback');
  return null;
}

/**
 * Calls AI expecting JSON response.
 * Parses the response and returns typed object, or null on failure.
 */
export async function callAIJson<T>(options: AIRequestOptions): Promise<{ data: T; source: AIResponse['source'] } | null> {
  const response = await callAI({ ...options, jsonMode: true });
  if (!response) return null;

  try {
    // Try to parse JSON from the response
    let jsonStr = response.content;
    // Sometimes models wrap JSON in markdown code blocks
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    // Or just clean leading/trailing whitespace
    jsonStr = jsonStr.trim();

    const data = JSON.parse(jsonStr) as T;
    return { data, source: response.source };
  } catch {
    console.warn('[ai-provider] JSON parse failed from', response.source);
    return null;
  }
}

// ─── Deterministic Scoring: Speaking ────────────────────────

export interface DeterministicSpeakingScore {
  pronunciation: number;
  fluency: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
  overall: number;
  feedback: string;
}

/**
 * Scores speaking WITHOUT any AI.
 * Uses text analysis metrics that correlate with speaking ability.
 */
export function scoreSpeakingDeterministic(
  transcript: string,
  expectedText: string = '',
  durationSeconds: number = 0,
): DeterministicSpeakingScore {
  if (!transcript || transcript.trim().length === 0) {
    return { pronunciation: 0, fluency: 0, grammar: 0, vocabulary: 0, coherence: 0, overall: 0, feedback: 'No speech detected.' };
  }

  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Word count scoring (target ~100 words for 60s)
  const targetWords = durationSeconds > 0 ? Math.round(durationSeconds * 1.5) : 100;
  const lengthScore = Math.min(100, Math.round((wordCount / targetWords) * 100));

  // Text similarity (for read-aloud tasks)
  let similarityScore = 70; // default for spontaneous
  if (expectedText) {
    const expectedWords = expectedText.toLowerCase().split(/\s+/);
    const actualWords = words.map(w => w.toLowerCase());
    let matches = 0;
    const used = new Set<number>();
    for (const w of actualWords) {
      const idx = expectedWords.findIndex((ew, i) => ew === w && !used.has(i));
      if (idx !== -1) { matches++; used.add(idx); }
    }
    similarityScore = Math.round((matches / Math.max(expectedWords.length, 1)) * 100);
  }

  // Fluency: words per minute
  const wpm = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 120;
  const fluencyScore = Math.min(100, Math.round(Math.min(wpm / 150, 1.3) * 77));

  // Vocabulary: unique word ratio (lexical diversity)
  const lexicalDiversity = uniqueWords.size / Math.max(wordCount, 1);
  const vocabScore = Math.min(100, Math.round(lexicalDiversity * 150));

  // Grammar proxy: average sentence length (longer = more complex)
  const avgSentLen = wordCount / Math.max(sentences.length, 1);
  const grammarScore = Math.min(100, Math.round(Math.min(avgSentLen / 15, 1.2) * 83));

  // Coherence: sentence count (more sentences = more structure)
  const coherenceScore = Math.min(100, Math.round(Math.min(sentences.length / 5, 1.3) * 77));

  // Pronunciation: based on similarity for read-aloud, else use length as proxy
  const pronunciationScore = expectedText ? similarityScore : Math.min(100, lengthScore + 10);

  // Overall: weighted average
  const overall = Math.round(
    pronunciationScore * 0.25 +
    fluencyScore * 0.25 +
    grammarScore * 0.15 +
    vocabScore * 0.15 +
    coherenceScore * 0.20
  );

  // Feedback
  let feedback = '';
  if (overall >= 75) feedback = 'Strong performance. Good fluency and vocabulary range demonstrated.';
  else if (overall >= 55) feedback = 'Adequate performance. Focus on speaking more fluently and using varied vocabulary.';
  else if (overall >= 35) feedback = 'Basic performance. Practice speaking in complete sentences with more detail.';
  else feedback = 'Needs improvement. Try to speak more and use the full time available.';

  return {
    pronunciation: Math.round(pronunciationScore * 0.3), // scale to 0-30
    fluency: Math.round(fluencyScore * 0.3),
    grammar: Math.round(grammarScore * 0.3),
    vocabulary: Math.round(vocabScore * 0.3),
    coherence: Math.round(coherenceScore * 0.3),
    overall: Math.round(overall * 0.3), // scale to 0-30
    feedback,
  };
}

// ─── Deterministic Scoring: Writing ─────────────────────────

export interface DeterministicWritingScore {
  grammar: number;
  coherence: number;
  vocabulary: number;
  development: number;
  overall: number;
  feedback: string;
}

// Common transition words for coherence scoring
const TRANSITION_WORDS = new Set([
  'however', 'therefore', 'moreover', 'furthermore', 'additionally', 'consequently',
  'nevertheless', 'although', 'despite', 'meanwhile', 'similarly', 'conversely',
  'in addition', 'on the other hand', 'as a result', 'for example', 'in contrast',
  'first', 'second', 'third', 'finally', 'in conclusion', 'to summarize',
]);

/**
 * Scores writing WITHOUT any AI.
 * Analyzes structure, vocabulary, and coherence through measurable metrics.
 */
export function scoreWritingDeterministic(
  text: string,
  targetMinWords: number = 150,
): DeterministicWritingScore {
  if (!text || text.trim().length === 0) {
    return { grammar: 0, coherence: 0, vocabulary: 0, development: 0, overall: 0, feedback: 'No text submitted.' };
  }

  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(w => w.length > 0));
  const lowerText = text.toLowerCase();

  // 1. Word count vs target (development)
  const lengthRatio = Math.min(wordCount / targetMinWords, 1.5);
  const developmentScore = Math.min(100, Math.round(lengthRatio * 67));

  // 2. Paragraph structure (coherence component)
  const paragraphScore = Math.min(100, Math.round(Math.min(paragraphs.length / 4, 1.3) * 77));

  // 3. Sentence variety (grammar proxy)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((s, l) => s + l, 0) / Math.max(sentenceLengths.length, 1);
  const variance = sentenceLengths.reduce((s, l) => s + Math.pow(l - avgLen, 2), 0) / Math.max(sentenceLengths.length, 1);
  const stdDev = Math.sqrt(variance);
  // Good writing has varied sentence lengths (stdDev 5-10 is ideal)
  const varietyScore = Math.min(100, Math.round(Math.min(stdDev / 7, 1.2) * 83));

  // 4. Transition words (coherence)
  let transitionCount = 0;
  for (const tw of TRANSITION_WORDS) {
    if (lowerText.includes(tw)) transitionCount++;
  }
  const transitionScore = Math.min(100, Math.round(Math.min(transitionCount / 5, 1.3) * 77));

  // 5. Lexical diversity (vocabulary)
  const lexicalDiversity = uniqueWords.size / Math.max(wordCount, 1);
  const vocabScore = Math.min(100, Math.round(lexicalDiversity * 170));

  // 6. Avg word length (vocabulary complexity proxy)
  const avgWordLen = words.reduce((s, w) => s + w.length, 0) / Math.max(wordCount, 1);
  const complexityBonus = Math.min(20, Math.round((avgWordLen - 4) * 10));

  // Composite scores
  const grammar = Math.min(100, varietyScore + Math.round(avgLen > 8 ? 10 : 0));
  const coherence = Math.round((paragraphScore * 0.5 + transitionScore * 0.5));
  const vocabulary = Math.min(100, vocabScore + complexityBonus);
  const development = developmentScore;

  // Overall: weighted
  const overall = Math.round(
    grammar * 0.25 +
    coherence * 0.25 +
    vocabulary * 0.25 +
    development * 0.25
  );

  // Scale to 0-25 (so AI can add up to 30 total with bonus)
  const scale = (n: number) => Math.min(25, Math.round(n * 0.25));

  // Feedback
  let feedback = '';
  if (overall >= 75) feedback = 'Well-developed response with good structure, vocabulary variety, and coherent argumentation.';
  else if (overall >= 55) feedback = 'Adequate response. Consider using more transition words and varying your sentence structure.';
  else if (overall >= 35) feedback = 'Basic response. Focus on developing your ideas more fully and organizing into clear paragraphs.';
  else if (wordCount < targetMinWords * 0.5) feedback = 'Response is too short. Try to develop your ideas more fully and meet the minimum word count.';
  else feedback = 'Needs improvement. Practice writing in organized paragraphs with a clear introduction, body, and conclusion.';

  return {
    grammar: scale(grammar),
    coherence: scale(coherence),
    vocabulary: scale(vocabulary),
    development: scale(development),
    overall: scale(overall),
    feedback,
  };
}
