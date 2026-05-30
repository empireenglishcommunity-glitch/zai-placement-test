import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { withApiProtection } from '@/lib/api-protection';

async function handler(req: NextRequest) {
  try {
    const { speed } = await req.json();

    const wpmMap = { slow: 80, natural: 130, fast: 160 };
    const targetWPM = wpmMap[speed as keyof typeof wpmMap] || 130;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an English listening comprehension test creator. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: `Create a short English listening passage for a placement test. The passage should be approximately ${targetWPM} WPM level (${speed} speed). The passage should be 3-4 sentences about a general topic.

Then create 3 multiple-choice questions about the passage:
- 1 literal comprehension question
- 1 inference question
- 1 detail recognition question

Each question should have 4 options (as strings).

Respond in JSON format only:
{
  "passage": "<the passage text>",
  "speed": "${speed}",
  "wpm": ${targetWPM},
  "questions": [
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctAnswer": 0,
      "type": "literal"
    }
  ]
}`,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    let content;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      content = JSON.parse(cleanJson);
    } catch {
      content = {
        passage: 'The ancient library stood at the center of the empire, its walls lined with thousands of scrolls containing the wisdom of ages. Scholars from distant lands would travel for months just to study within its hallowed halls. The library was not merely a repository of knowledge, but a living institution where ideas were debated and refined.',
        speed,
        wpm: targetWPM,
        questions: [
          { question: 'Where was the library located?', options: ['At the edge of the empire', 'At the center of the empire', 'In a distant land', 'Underground'], correctAnswer: 1, type: 'literal' },
          { question: 'What can be inferred about the library?', options: ['It was small', 'It was highly respected', 'It was new', 'It was abandoned'], correctAnswer: 1, type: 'inference' },
          { question: 'How long would scholars travel to reach it?', options: ['Days', 'Weeks', 'Months', 'Years'], correctAnswer: 2, type: 'detail' },
        ],
      };
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Listening generation error:', error);
    // Return fallback content
    const wpmMap = { slow: 80, natural: 130, fast: 160 };
    const targetWPM = wpmMap[speed as keyof typeof wpmMap] || 130;
    const fallbackContent = {
      slow: {
        passage: 'The old warrior sat by the fire. He told stories of the great battles. The young recruits listened carefully. They wanted to learn from his experience.',
        speed: 'slow',
        wpm: targetWPM,
        questions: [
          { question: 'What was the warrior doing?', options: ['Fighting a battle', 'Sitting by the fire', 'Training recruits', 'Writing a book'], correctAnswer: 1, type: 'literal' },
          { question: 'Why did the recruits listen carefully?', options: ['They were ordered to', 'They wanted to learn', 'They were bored', 'They were scared'], correctAnswer: 1, type: 'inference' },
          { question: 'What did the warrior tell stories about?', options: ['His childhood', 'Cooking recipes', 'Great battles', 'The weather'], correctAnswer: 2, type: 'detail' },
        ],
      },
      natural: {
        passage: "The empire's training academy was known throughout the land for producing the most skilled warriors. Students underwent rigorous physical and mental training, learning not only combat techniques but also the art of strategy and leadership.",
        speed: 'natural',
        wpm: targetWPM,
        questions: [
          { question: 'What was the academy known for?', options: ['Beautiful architecture', 'Producing skilled warriors', 'Large library', 'Musical performances'], correctAnswer: 1, type: 'literal' },
          { question: 'What can be inferred about the training?', options: ['It was easy', 'It was comprehensive', 'It was only physical', 'It was short'], correctAnswer: 1, type: 'inference' },
          { question: 'Besides combat, what else did students learn?', options: ['Music and art', 'Strategy and leadership', 'Cooking and healing', 'Farming and trading'], correctAnswer: 1, type: 'detail' },
        ],
      },
      fast: {
        passage: 'The council convened at dawn, their deliberations spanning the entire day as they weighed the consequences of the proposed alliance with the neighboring kingdom. Arguments were presented with meticulous detail, each delegate articulating their perspective with the precision of a seasoned diplomat, knowing that the decision would shape the empire\'s trajectory for generations to come.',
        speed: 'fast',
        wpm: targetWPM,
        questions: [
          { question: 'When did the council meet?', options: ['At midnight', 'At dawn', 'At dusk', 'At noon'], correctAnswer: 1, type: 'literal' },
          { question: 'What can be inferred about the decision?', options: ['It was unimportant', 'It had far-reaching consequences', 'It was about trade only', 'It was quickly decided'], correctAnswer: 1, type: 'inference' },
          { question: 'How did the delegates present their arguments?', options: ['Emotionally', 'With meticulous detail', 'Briefly', 'Aggressively'], correctAnswer: 1, type: 'detail' },
        ],
      },
    };

    const fallback = fallbackContent[speed as keyof typeof fallbackContent] || fallbackContent.natural;
    return NextResponse.json({ content: fallback });
  }
}

// Apply strict rate limiting for expensive AI endpoints
export const POST = withApiProtection({ rateLimit: 'aiEvaluation', requireAuth: true, detectBots: true, blockBots: true })(handler);
