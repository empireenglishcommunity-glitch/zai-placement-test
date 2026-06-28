// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — AI Speaking Evaluator (Text-Based)
// Evaluates REAL transcripts from browser Speech Recognition
// No fake scores — if no text, score is 0.
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
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch { return null; }
}

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const { transcript, expectedText, part } = await req.json();

    // No transcript = no score (honest evaluation)
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        evaluation: {
          overallScore: 0, pronunciation: 0, fluency: 0,
          grammar: 0, vocabulary: 0, coherence: 0, similarity: 0,
          feedback: 'No speech detected.',
        },
      });
    }

    const cleanTranscript = transcript.trim();
    const wordCount = cleanTranscript.split(/\s+/).length;

    // Too few words
    if (wordCount < 3) {
      return NextResponse.json({
        evaluation: {
          overallScore: 5, pronunciation: 5, fluency: 5,
          grammar: 5, vocabulary: 5, coherence: 5, similarity: 0,
          feedback: 'Too few words spoken to evaluate properly.',
        },
      });
    }

    // Build evaluation prompt based on part type
    let prompt = '';
    if (part === 'read_aloud' || part === 'shadowing') {
      prompt = `You are an English language assessor. A student was asked to read/repeat this text:

EXPECTED: "${expectedText}"

WHAT THEY ACTUALLY SAID (transcribed by speech recognition):
"${cleanTranscript}"

Evaluate how accurately they reproduced the text. Score each 0-100:
- overallScore: Overall quality of their speaking
- pronunciation: Based on how well the words match (speech recognition accuracy reflects pronunciation)
- fluency: Speaking pace and smoothness (word count: ${wordCount}, indicates flow)
- grammar: Did they use correct grammar in what they said?
- vocabulary: Did they use the right words?
- coherence: Does what they said make sense?
- similarity: How closely does their speech match the expected text? (word overlap percentage)

Provide 1-2 sentences of constructive feedback.

IMPORTANT: Be STRICT. If they said completely different words, similarity should be very low.
If they only said a few words of a long passage, score should be proportionally low.

Respond in JSON ONLY (no markdown):
{"overallScore":<n>,"pronunciation":<n>,"fluency":<n>,"grammar":<n>,"vocabulary":<n>,"coherence":<n>,"similarity":<n>,"feedback":"<string>"}`;
    } else {
      prompt = `You are an English language assessor. A student was given this speaking prompt:

PROMPT: "${expectedText}"

WHAT THEY SAID (transcribed by speech recognition):
"${cleanTranscript}"

They spoke ${wordCount} words. Evaluate their spontaneous speaking:
- overallScore: Overall quality (0-100)
- pronunciation: Not directly measurable from text, estimate based on word choices (0-100)
- fluency: Based on word count and apparent flow (0-100)
- grammar: Grammatical accuracy of their sentences (0-100)
- vocabulary: Range and appropriateness of vocabulary used (0-100)
- coherence: How well-organized and relevant their response is (0-100)

Provide 1-2 sentences of constructive feedback.

IMPORTANT: Be FAIR but STRICT.
- If they said fewer than 10 words, fluency and coherence should be low.
- If grammar is poor, score grammar low.
- If vocabulary is basic/repetitive, score vocabulary low.

Respond in JSON ONLY (no markdown):
{"overallScore":<n>,"pronunciation":<n>,"fluency":<n>,"grammar":<n>,"vocabulary":<n>,"coherence":<n>,"feedback":"<string>"}`;
    }

    const responseText = await callGemini(prompt);

    if (responseText) {
      try {
        const clean = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const evaluation = JSON.parse(clean);
        if (typeof evaluation.overallScore === 'number') {
          return NextResponse.json({ evaluation, source: 'ai' });
        }
      } catch { /* fall through */ }
    }

    // If AI fails, return null — let frontend use its local evaluation
    return NextResponse.json({ evaluation: null, source: 'unavailable' });
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    return NextResponse.json({ evaluation: null, source: 'error' });
  }
}

export const POST = withApiProtection({ rateLimit: 'aiEvaluation' })(handler);
