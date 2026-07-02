// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — AI Reading Passage Generator
// Uses Gemini 2.0 Flash to generate unique academic passages + questions
// Falls back to static bank if AI is unavailable
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';

// ─── Topics Pool (for variety) ──────────────────────────────

const EASY_TOPICS = [
  'the benefits of regular exercise',
  'how recycling helps the environment',
  'the history of the internet',
  'why sleep is important for health',
  'how plants grow from seeds',
  'the role of bees in pollination',
  'benefits of reading books regularly',
  'how the human heart works',
  'the invention of the telephone',
  'why breakfast is important',
  'how weather forecasting works',
  'the basics of nutrition and diet',
  'how airplanes fly',
  'the importance of clean water',
  'how cameras capture images',
];

const MEDIUM_TOPICS = [
  'the psychology of procrastination',
  'how social media affects teen mental health',
  'the economics of renewable energy',
  'the impact of urbanization on wildlife',
  'how artificial intelligence learns from data',
  'the history of vaccination and public health',
  'climate change effects on ocean ecosystems',
  'the neuroscience of habit formation',
  'why some species go extinct faster than others',
  'the ethical implications of genetic engineering',
  'how globalization affects local cultures',
  'the science behind memory and forgetting',
  'the role of microbiome in human health',
  'space exploration and its economic returns',
  'how language shapes our perception of reality',
];

const HARD_TOPICS = [
  'the paradox of choice in consumer behavior',
  'epistemic humility in scientific research',
  'the prisoner dilemma and game theory applications',
  'cognitive biases in judicial decision-making',
  'the relationship between income inequality and social trust',
  'quantum computing implications for cryptography',
  'the evolution of democratic institutions',
  'neuroplasticity and its limits in adult brains',
  'the tragedy of the commons in digital spaces',
  'post-colonial perspectives on development economics',
  'the philosophy of consciousness and AI',
  'systemic risk in interconnected financial markets',
  'the anthropology of gift economies',
  'epigenetics and transgenerational trauma',
  'the paradox of tolerance in liberal democracies',
];

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
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 3000,
            responseMimeType: 'application/json',
          },
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

// ─── Generate Passage Prompt ────────────────────────────────

function buildPrompt(topic: string, difficulty: 'easy' | 'medium' | 'hard'): string {
  const wordCounts = { easy: '150-180', medium: '250-300', hard: '380-420' };
  const vocabLevel = { easy: 'simple everyday vocabulary (A2-B1 level)', medium: 'intermediate academic vocabulary (B1-B2 level)', hard: 'advanced academic vocabulary with complex sentence structures (C1-C2 level)' };

  return `Generate an academic reading passage and 5 comprehension questions about "${topic}".

REQUIREMENTS:
- Passage length: ${wordCounts[difficulty]} words
- Vocabulary level: ${vocabLevel[difficulty]}
- Style: Academic/informational (like a textbook or journal article)
- Include specific data, examples, or research references for credibility
- Write in 3-4 paragraphs

QUESTIONS (5 total, one of each type):
1. Main Idea question — asks what the passage is primarily about
2. Detail question — asks about a specific fact stated in the passage
3. Inference question — requires reading between the lines
4. Vocabulary question — asks what a specific word/phrase means in context (format: 'The word "X" in paragraph Y is closest in meaning to:')
5. Purpose question — asks why the author mentions something specific

ANSWER OPTIONS: Each question must have exactly 4 options (A, B, C, D). All options should be similar length (5-8 words each). Only one option is correct.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "passage title",
  "text": "full passage text here",
  "wordCount": 175,
  "questions": [
    {
      "type": "main_idea",
      "questionText": "What is the passage primarily about?",
      "options": ["Option A text here", "Option B text here", "Option C text here", "Option D text here"],
      "correctAnswer": 1
    },
    {
      "type": "detail",
      "questionText": "According to the passage, what...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2
    },
    {
      "type": "inference",
      "questionText": "What can be inferred about...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    },
    {
      "type": "vocabulary",
      "questionText": "The word X in paragraph Y is closest in meaning to:",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 3
    },
    {
      "type": "purpose",
      "questionText": "Why does the author mention...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1
    }
  ]
}`;
}

// ─── Route Handler ──────────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { difficulty = 'medium' } = body as { difficulty?: 'easy' | 'medium' | 'hard' };

    // Pick a random topic based on difficulty
    const topicPool = difficulty === 'easy' ? EASY_TOPICS : difficulty === 'hard' ? HARD_TOPICS : MEDIUM_TOPICS;
    const topic = topicPool[Math.floor(Math.random() * topicPool.length)];

    // Try AI generation
    const prompt = buildPrompt(topic, difficulty);
    const aiResponse = await callGemini(prompt);

    if (aiResponse) {
      try {
        // Parse JSON response
        const parsed = JSON.parse(aiResponse);

        // Validate structure
        if (parsed.title && parsed.text && Array.isArray(parsed.questions) && parsed.questions.length === 5) {
          // Add metadata
          const passage = {
            id: `ai-${difficulty}-${Date.now()}`,
            difficulty,
            title: parsed.title,
            topic,
            text: parsed.text,
            wordCount: parsed.wordCount || parsed.text.split(/\s+/).length,
            questions: parsed.questions.map((q: { type: string; questionText: string; options: string[]; correctAnswer: number }, idx: number) => ({
              id: `ai-${difficulty}-${Date.now()}-q${idx + 1}`,
              type: q.type,
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
            })),
            isAIGenerated: true,
          };

          return NextResponse.json({ passage, source: 'ai' });
        }
      } catch {
        // JSON parsing failed — fall through to fallback
        console.log('[ai-reading] JSON parse failed, using fallback');
      }
    }

    // Fallback: return null (client will use static bank)
    return NextResponse.json({ passage: null, source: 'fallback' });
  } catch (error) {
    console.error('[ai-reading] Generation error:', error);
    return NextResponse.json({ passage: null, source: 'error' });
  }
}

export const POST = withApiProtection({ rateLimit: 'aiEvaluation' })(handler);
