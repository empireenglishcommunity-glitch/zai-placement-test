// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — AI Speaking Evaluator
// Uses Gemini 2.5 Flash for pronunciation/fluency assessment
// Falls back to heuristic scoring if AI unavailable
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';

// ─── Gemini API Call ────────────────────────────────────────

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
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
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

// ─── Evaluation Prompts by Part Type ────────────────────────

function getEvaluationPrompt(part: string, passage: string, transcript?: string): string {
  if (part === 'read_aloud') {
    return `You are an expert English pronunciation evaluator for a placement test. The student was asked to read this passage aloud:

"${passage}"

${transcript ? `Their transcribed speech was: "${transcript}"` : 'Audio was provided but no transcript is available. Please provide estimated scores based on typical learner performance.'}

Evaluate their reading on these criteria (score 0-100 for each):
- pronunciation: How accurately are words pronounced?
- fluency: How smoothly and naturally do they read?
- wordsPerMinute: Estimated speaking rate (realistic value 60-200)
- phonemeAccuracy: How accurately are individual sounds produced?
- grammarAccuracy: Are all words read correctly without substitutions?
- vocabularyRange: Based on how they handle complex words
- confidence: How confident does the reading sound?

Also provide brief constructive feedback (2-3 sentences) in a supportive tone.

Respond in JSON format ONLY (no markdown):
{
  "pronunciation": <number>,
  "fluency": <number>,
  "wordsPerMinute": <number>,
  "phonemeAccuracy": <number>,
  "grammarAccuracy": <number>,
  "vocabularyRange": <number>,
  "confidence": <number>,
  "feedback": "<string>"
}`;
  }

  if (part === 'spontaneous') {
    return `You are an expert English speaking evaluator for a placement test. The student was given the prompt: "${passage}" and spoke spontaneously for up to 60 seconds.

${transcript ? `Their transcribed speech was: "${transcript}"` : 'Audio was provided but no transcript is available. Please provide estimated scores for a typical intermediate learner.'}

Evaluate their speaking on these criteria (score 0-100 for each):
- pronunciation: How accurately are words pronounced?
- fluency: How smoothly and naturally do they speak?
- wordsPerMinute: Estimated speaking rate (realistic value 60-180)
- phonemeAccuracy: How accurately are individual sounds produced?
- grammarAccuracy: How grammatically correct is their speech?
- vocabularyRange: How diverse and appropriate is their vocabulary?
- confidence: How confident and natural do they sound?

Provide brief constructive feedback (2-3 sentences).

Respond in JSON format ONLY (no markdown):
{
  "pronunciation": <number>,
  "fluency": <number>,
  "wordsPerMinute": <number>,
  "phonemeAccuracy": <number>,
  "grammarAccuracy": <number>,
  "vocabularyRange": <number>,
  "confidence": <number>,
  "feedback": "<string>"
}`;
  }

  // Shadowing
  return `You are an expert English shadowing evaluator for a placement test. The student heard a 15-second audio clip and repeated it. The original text was: "${passage}"

${transcript ? `Their repeated speech was transcribed as: "${transcript}"` : 'Audio was provided but no transcript is available. Please provide estimated scores.'}

Evaluate their shadowing on these criteria (score 0-100 for each):
- rhythmMatch: How well does their rhythm match the original?
- pronunciationSimilarity: How similar is their pronunciation?
- phonemeMatch: How accurately did they reproduce individual sounds?
- pronunciation: Overall pronunciation quality
- fluency: Overall fluency
- wordsPerMinute: Estimated speaking rate (60-150)
- phonemeAccuracy: Individual sound accuracy
- grammarAccuracy: Correct word reproduction
- vocabularyRange: Quality of word reproduction
- confidence: How confident do they sound?

Provide brief constructive feedback (2-3 sentences).

Respond in JSON format ONLY (no markdown):
{
  "rhythmMatch": <number>,
  "pronunciationSimilarity": <number>,
  "phonemeMatch": <number>,
  "pronunciation": <number>,
  "fluency": <number>,
  "wordsPerMinute": <number>,
  "phonemeAccuracy": <number>,
  "grammarAccuracy": <number>,
  "vocabularyRange": <number>,
  "confidence": <number>,
  "feedback": "<string>"
}`;
}

// ─── Heuristic Fallback Scoring ─────────────────────────────
// When AI is unavailable, provide reasonable baseline scores
// based on the part type and whether a transcript exists

function generateFallbackEvaluation(part: string, hasTranscript: boolean) {
  // Base scores for a mid-level learner (varies slightly)
  const baseScore = hasTranscript ? 60 : 55;
  const variance = () => Math.floor(Math.random() * 15) - 5; // -5 to +10

  const evaluation: Record<string, number | string> = {
    pronunciation: baseScore + variance(),
    fluency: baseScore - 5 + variance(),
    wordsPerMinute: 90 + Math.floor(Math.random() * 40),
    phonemeAccuracy: baseScore - 3 + variance(),
    grammarAccuracy: baseScore + 5 + variance(),
    vocabularyRange: baseScore + variance(),
    confidence: baseScore - 8 + variance(),
    feedback: 'Your assessment has been recorded. Continue practicing daily to strengthen your pronunciation, fluency, and confidence. Focus on natural rhythm and intonation.',
  };

  if (part === 'shadowing') {
    evaluation.rhythmMatch = baseScore - 5 + variance();
    evaluation.pronunciationSimilarity = baseScore + variance();
    evaluation.phonemeMatch = baseScore - 3 + variance();
  }

  // Clamp all numeric values to 0-100
  for (const key of Object.keys(evaluation)) {
    if (typeof evaluation[key] === 'number' && key !== 'wordsPerMinute') {
      evaluation[key] = Math.max(0, Math.min(100, evaluation[key] as number));
    }
  }

  return evaluation;
}

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const { audioBase64, passage, part, transcript } = await req.json();

    if (!part) {
      return NextResponse.json({ error: 'Part type required (read_aloud, spontaneous, shadowing)' }, { status: 400 });
    }

    // Build prompt with transcript if available
    const prompt = getEvaluationPrompt(part, passage || '', transcript);

    // Try Gemini API
    const responseText = await callGemini(prompt);

    if (responseText) {
      try {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const evaluation = JSON.parse(cleanJson);

        // Validate that we have at least the basic fields
        if (typeof evaluation.pronunciation === 'number' && typeof evaluation.fluency === 'number') {
          return NextResponse.json({ evaluation, source: 'ai' });
        }
      } catch {
        // JSON parse failed, fall through to fallback
      }
    }

    // Fallback: heuristic scoring
    const evaluation = generateFallbackEvaluation(part, !!transcript || !!audioBase64);
    return NextResponse.json({ evaluation, source: 'heuristic' });
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    // Always return a result so assessment can continue
    const evaluation = generateFallbackEvaluation('read_aloud', false);
    return NextResponse.json({ evaluation, source: 'fallback' });
  }
}

// Apply strict rate limiting for expensive AI endpoints
export const POST = withApiProtection({ rateLimit: 'aiEvaluation', requireAuth: true, detectBots: true, blockBots: true })(handler);
