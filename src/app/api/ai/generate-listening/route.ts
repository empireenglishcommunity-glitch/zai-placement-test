// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — AI Listening Content Generator
// Uses Gemini 2.5 Flash for generating listening passages + questions
// Falls back to curated content if AI unavailable
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

// ─── Fallback Content ───────────────────────────────────────

const FALLBACK_CONTENT: Record<string, { passage: string; speed: string; wpm: number; questions: { question: string; options: string[]; correctAnswer: number; type: string }[] }> = {
  slow: {
    passage: 'The old warrior sat by the fire. He told stories of the great battles. The young recruits listened carefully. They wanted to learn from his experience.',
    speed: 'slow',
    wpm: 80,
    questions: [
      { question: 'What was the warrior doing?', options: ['Fighting a battle', 'Sitting by the fire', 'Training recruits', 'Writing a book'], correctAnswer: 1, type: 'literal' },
      { question: 'Why did the recruits listen carefully?', options: ['They were ordered to', 'They wanted to learn', 'They were bored', 'They were scared'], correctAnswer: 1, type: 'inference' },
      { question: 'What did the warrior tell stories about?', options: ['His childhood', 'Cooking recipes', 'Great battles', 'The weather'], correctAnswer: 2, type: 'detail' },
    ],
  },
  natural: {
    passage: "The empire's training academy was known throughout the land for producing the most skilled warriors. Students underwent rigorous physical and mental training, learning not only combat techniques but also the art of strategy and leadership. Each year, hundreds applied but only the most dedicated were accepted.",
    speed: 'natural',
    wpm: 130,
    questions: [
      { question: 'What was the academy known for?', options: ['Beautiful architecture', 'Producing skilled warriors', 'Large library', 'Musical performances'], correctAnswer: 1, type: 'literal' },
      { question: 'What can be inferred about the training?', options: ['It was easy', 'It was comprehensive', 'It was only physical', 'It was short'], correctAnswer: 1, type: 'inference' },
      { question: 'Besides combat, what else did students learn?', options: ['Music and art', 'Strategy and leadership', 'Cooking and healing', 'Farming and trading'], correctAnswer: 1, type: 'detail' },
    ],
  },
  fast: {
    passage: "The council convened at dawn, their deliberations spanning the entire day as they weighed the consequences of the proposed alliance with the neighboring kingdom. Arguments were presented with meticulous detail, each delegate articulating their perspective with the precision of a seasoned diplomat, knowing that the decision would shape the empire's trajectory for generations to come.",
    speed: 'fast',
    wpm: 160,
    questions: [
      { question: 'When did the council meet?', options: ['At midnight', 'At dawn', 'At dusk', 'At noon'], correctAnswer: 1, type: 'literal' },
      { question: 'What can be inferred about the decision?', options: ['It was unimportant', 'It had far-reaching consequences', 'It was about trade only', 'It was quickly decided'], correctAnswer: 1, type: 'inference' },
      { question: 'How did the delegates present their arguments?', options: ['Emotionally', 'With meticulous detail', 'Briefly', 'Aggressively'], correctAnswer: 1, type: 'detail' },
    ],
  },
};

// Additional passages for variety (rotated based on attempt)
const EXTRA_PASSAGES: Record<string, { passage: string; speed: string; wpm: number; questions: { question: string; options: string[]; correctAnswer: number; type: string }[] }[]> = {
  slow: [
    {
      passage: 'Every morning, Sarah walks to the market. She buys fresh bread and milk. The baker always smiles at her. He knows she is a regular customer.',
      speed: 'slow', wpm: 80,
      questions: [
        { question: 'Where does Sarah go every morning?', options: ['To school', 'To the market', 'To the park', 'To work'], correctAnswer: 1, type: 'literal' },
        { question: 'What can we infer about Sarah?', options: ['She is new to the area', 'She visits the market regularly', 'She dislikes bread', 'She is in a hurry'], correctAnswer: 1, type: 'inference' },
        { question: 'What does Sarah buy?', options: ['Fruits and vegetables', 'Bread and milk', 'Meat and cheese', 'Coffee and sugar'], correctAnswer: 1, type: 'detail' },
      ],
    },
  ],
  natural: [
    {
      passage: "The city's new transportation system has completely transformed daily commutes for thousands of residents. Electric buses run every ten minutes along major routes, connecting suburbs to the downtown core. The reduction in traffic congestion has been remarkable, with average commute times dropping by nearly thirty percent since the system launched last autumn.",
      speed: 'natural', wpm: 130,
      questions: [
        { question: 'What transformed daily commutes?', options: ['A new highway', 'A new transportation system', 'A work-from-home policy', 'A new railway'], correctAnswer: 1, type: 'literal' },
        { question: 'What can be inferred about the old system?', options: ['It was better', 'It caused congestion', 'It was free', 'It was electric'], correctAnswer: 1, type: 'inference' },
        { question: 'By how much did commute times drop?', options: ['10 percent', 'Nearly 30 percent', '50 percent', '75 percent'], correctAnswer: 1, type: 'detail' },
      ],
    },
  ],
  fast: [
    {
      passage: "The archaeological expedition uncovered what appears to be a sophisticated irrigation system dating back approximately four thousand years, fundamentally challenging our understanding of early agricultural civilizations in the region. The intricate network of underground channels, constructed with precisely cut stones fitted together without mortar, demonstrates an engineering capability that scholars previously believed emerged only during much later periods of human development.",
      speed: 'fast', wpm: 160,
      questions: [
        { question: 'What did the expedition discover?', options: ['A temple', 'An irrigation system', 'A burial site', 'A city wall'], correctAnswer: 1, type: 'literal' },
        { question: 'Why is this discovery significant?', options: ['It is very old', 'It challenges existing beliefs about early civilizations', 'It contains gold', 'It is very large'], correctAnswer: 1, type: 'inference' },
        { question: 'How were the stones joined together?', options: ['With cement', 'With mortar', 'Without mortar', 'With rope'], correctAnswer: 2, type: 'detail' },
      ],
    },
  ],
};

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const { speed, attemptNumber } = await req.json();

    const wpmMap: Record<string, number> = { slow: 80, natural: 130, fast: 160 };
    const targetWPM = wpmMap[speed as string] || 130;
    const validSpeed = (speed as string) in wpmMap ? (speed as string) : 'natural';

    // Try AI generation first
    const prompt = `Create a short English listening passage for a placement test. The passage should be appropriate for ${validSpeed} speed (approximately ${targetWPM} words per minute reading pace). The passage should be 3-5 sentences about a general everyday topic (not fantasy/imperial themes).

Then create 3 multiple-choice questions about the passage:
- 1 literal comprehension question (directly stated in the text)
- 1 inference question (requires reading between the lines)
- 1 detail recognition question (specific detail from the text)

Each question must have exactly 4 options.

Respond in JSON format ONLY (no markdown, no code blocks):
{
  "passage": "<the passage text>",
  "speed": "${validSpeed}",
  "wpm": ${targetWPM},
  "questions": [
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctAnswer": 0,
      "type": "literal"
    },
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctAnswer": 1,
      "type": "inference"
    },
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctAnswer": 2,
      "type": "detail"
    }
  ]
}`;

    const responseText = await callGemini(prompt);

    if (responseText) {
      try {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const content = JSON.parse(cleanJson);
        // Validate structure
        if (content.passage && content.questions?.length >= 3) {
          return NextResponse.json({ content });
        }
      } catch {
        // JSON parse failed, use fallback
      }
    }

    // Fallback: Use curated content with rotation based on attemptNumber
    const attempt = typeof attemptNumber === 'number' ? attemptNumber : 1;
    const extras = EXTRA_PASSAGES[validSpeed] || [];

    let content;
    if (attempt > 1 && extras.length > 0) {
      // Rotate through extra passages on retakes
      content = extras[(attempt - 2) % extras.length];
    } else {
      content = FALLBACK_CONTENT[validSpeed] || FALLBACK_CONTENT.natural;
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Listening generation error:', error);
    return NextResponse.json({ content: FALLBACK_CONTENT.natural });
  }
}

// Apply strict rate limiting for AI endpoints
export const POST = withApiProtection({ rateLimit: 'aiEvaluation' })(handler);
