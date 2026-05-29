import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ─── Fallback Questions ────────────────────────────────────
// Used when the database has no questions seeded

const FALLBACK_VOCABULARY_QUESTIONS = [
  // Band 1-500: Foundation Words
  { id: 'v1', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "water" mean?', options: ['A type of food', 'A clear liquid that falls as rain', 'A piece of clothing', 'A kind of animal'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v2', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "house" mean?', options: ['A vehicle', 'A building where people live', 'A type of tree', 'A game'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v3', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "walk" mean?', options: ['To run fast', 'To move on foot at a regular pace', 'To fly', 'To sleep'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v4', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "good" mean?', options: ['Bad quality', 'Of high quality or satisfactory', 'Very large', 'Extremely fast'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v5', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "child" mean?', options: ['An old person', 'A young human being', 'A type of animal', 'A tool'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v6', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "book" mean?', options: ['A written or printed work with pages', 'A type of food', 'A vehicle', 'A weapon'], correctAnswer: 0, difficulty: 1, isActive: true },
  { id: 'v7', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "eat" mean?', options: ['To drink', 'To put food in the mouth and swallow', 'To sleep', 'To jump'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'v8', module: 'vocabulary', type: null, topic: '1-500', questionText: 'What does the word "big" mean?', options: ['Small in size', 'Of considerable size or extent', 'Very fast', 'Extremely quiet'], correctAnswer: 1, difficulty: 1, isActive: true },

  // Band 501-1000: Common Words
  { id: 'v9', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "achieve" mean?', options: ['To fail at something', 'To successfully bring about or reach a goal', 'To destroy something', 'To forget something'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'v10', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "brief" mean?', options: ['Very long', 'Of short duration or concise', 'Extremely heavy', 'Very colorful'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'v11', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "convince" mean?', options: ['To argue angrily', 'To persuade someone to do something', 'To force someone physically', 'To ignore someone'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'v12', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "demand" mean?', options: ['To ask for something forcefully or urgently', 'To give something away', 'To sleep peacefully', 'To eat quickly'], correctAnswer: 0, difficulty: 2, isActive: true },
  { id: 'v13', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "essential" mean?', options: ['Unnecessary', 'Absolutely necessary or extremely important', 'Very small', 'Somewhat boring'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'v14', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "feature" mean?', options: ['A distinctive attribute or aspect of something', 'A type of animal', 'A cooking tool', 'A musical instrument'], correctAnswer: 0, difficulty: 2, isActive: true },
  { id: 'v15', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "genuine" mean?', options: ['Fake or artificial', 'Truly what something is said to be; authentic', 'Very expensive', 'Extremely loud'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'v16', module: 'vocabulary', type: null, topic: '501-1000', questionText: 'What does the word "hesitate" mean?', options: ['To act immediately', 'To pause before doing something due to uncertainty', 'To shout loudly', 'To run quickly'], correctAnswer: 1, difficulty: 2, isActive: true },

  // Band 1001-2000: Intermediate Words
  { id: 'v17', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "ambiguous" mean?', options: ['Very clear and specific', 'Open to more than one interpretation; unclear', 'Extremely bright', 'Completely empty'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v18', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "contemplate" mean?', options: ['To ignore completely', 'To look thoughtfully at something for a long time; to ponder', 'To destroy rapidly', 'To celebrate loudly'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v19', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "diligent" mean?', options: ['Lazy and careless', 'Having or showing care and effort in work', 'Very aggressive', 'Extremely quiet'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v20', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "eloquent" mean?', options: ['Unable to speak', 'Fluent or persuasive in speaking or writing', 'Very angry', 'Extremely shy'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v21', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "formidable" mean?', options: ['Weak and small', 'Inspiring fear or respect through being impressively large or powerful', 'Very friendly and warm', 'Completely invisible'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v22', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "gratitude" mean?', options: ['Anger and resentment', 'The quality of being thankful; appreciation', 'Extreme fear', 'Deep sadness'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v23', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "hypothesis" mean?', options: ['A proven fact', 'A proposed explanation made as a starting point for investigation', 'A type of poem', 'A musical instrument'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'v24', module: 'vocabulary', type: null, topic: '1001-2000', questionText: 'What does the word "imminent" mean?', options: ['Very distant', 'About to happen; approaching', 'Completely finished', 'Extremely old'], correctAnswer: 1, difficulty: 3, isActive: true },

  // Band 2001-3000: Advanced Words
  { id: 'v25', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "juxtapose" mean?', options: ['To separate completely', 'To place close together for contrasting effect', 'To erase permanently', 'To exaggerate greatly'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v26', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "lucid" mean?', options: ['Confused and unclear', 'Expressed clearly; easy to understand', 'Extremely dark', 'Very heavy'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v27', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "meticulous" mean?', options: ['Careless and sloppy', 'Showing great attention to detail; very careful', 'Very slow', 'Extremely loud'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v28', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "nonchalant" mean?', options: ['Extremely worried', 'Feeling or appearing casually calm and relaxed', 'Very aggressive', 'Deeply emotional'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v29', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "obscure" mean?', options: ['Very well-known and famous', 'Not discovered or known about; uncertain', 'Extremely bright', 'Very recent'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v30', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "pragmatic" mean?', options: ['Dealing with things sensibly and realistically', 'Completely unrealistic', 'Very emotional', 'Deeply philosophical'], correctAnswer: 0, difficulty: 4, isActive: true },
  { id: 'v31', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "quintessential" mean?', options: ['Completely ordinary', 'Representing the most perfect example of a quality', 'Very small', 'Extremely old'], correctAnswer: 1, difficulty: 4, isActive: true },
  { id: 'v32', module: 'vocabulary', type: null, topic: '2001-3000', questionText: 'What does the word "resilient" mean?', options: ['Easily broken', 'Able to recover quickly from difficult conditions', 'Very soft', 'Extremely rigid'], correctAnswer: 1, difficulty: 4, isActive: true },

  // Band 3001-5000: Elite Words
  { id: 'v33', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "sycophant" mean?', options: ['A brave warrior', 'A person who acts obsequiously toward someone important to gain advantage', 'A type of musician', 'A mathematical formula'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v34', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "ubiquitous" mean?', options: ['Very rare', 'Present, appearing, or found everywhere', 'Extremely small', 'Completely hidden'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v35', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "vicissitude" mean?', options: ['A stable condition', 'A change of circumstances, typically unwelcome or difficult', 'A type of celebration', 'A mathematical concept'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v36', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "whimsical" mean?', options: ['Very serious and formal', 'Acting in a capricious manner; playfully quaint', 'Extremely dangerous', 'Deeply philosophical'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v37', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "xenophobia" mean?', options: ['Love of foreign cultures', 'Dislike of or prejudice against people from other countries', 'Fear of the dark', 'A type of plant'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v38', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "yielding" mean?', options: ['Very strong and rigid', 'Giving way under pressure; flexible or compliant', 'Extremely fast', 'Completely dark'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v39', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "zealous" mean?', options: ['Lazy and indifferent', 'Having or showing zeal; enthusiastic and passionate', 'Very calm and quiet', 'Extremely tired'], correctAnswer: 1, difficulty: 5, isActive: true },
  { id: 'v40', module: 'vocabulary', type: null, topic: '3001-5000', questionText: 'What does the word "aberration" mean?', options: ['A normal occurrence', 'A departure from what is normal or expected; an anomaly', 'A type of music', 'A cooking technique'], correctAnswer: 1, difficulty: 5, isActive: true },
];

const FALLBACK_GRAMMAR_QUESTIONS = [
  // Present Simple
  { id: 'g1', module: 'grammar', type: 'completion', topic: 'present_simple', questionText: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'g2', module: 'grammar', type: 'error_identification', topic: 'present_simple', questionText: 'Which sentence is correct?', options: ['He don\'t like coffee', 'He doesn\'t likes coffee', 'He doesn\'t like coffee', 'He not like coffee'], correctAnswer: 2, difficulty: 1, isActive: true },
  { id: 'g3', module: 'grammar', type: 'transformation', topic: 'present_simple', questionText: 'Transform to negative: "They play football on Sundays."', options: ['They doesn\'t play football on Sundays', 'They don\'t play football on Sundays', 'They not play football on Sundays', 'They aren\'t play football on Sundays'], correctAnswer: 1, difficulty: 2, isActive: true },

  // Present Continuous
  { id: 'g4', module: 'grammar', type: 'completion', topic: 'present_continuous', questionText: 'I _____ reading a book right now.', options: ['am', 'is', 'are', 'be'], correctAnswer: 0, difficulty: 1, isActive: true },
  { id: 'g5', module: 'grammar', type: 'error_identification', topic: 'present_continuous', questionText: 'Which sentence is correct?', options: ['She is work at the office', 'She is working at the office', 'She working at the office', 'She works at the office now'], correctAnswer: 1, difficulty: 1, isActive: true },
  { id: 'g6', module: 'grammar', type: 'transformation', topic: 'present_continuous', questionText: 'Transform to question: "They are watching a movie."', options: ['Are they watching a movie?', 'Do they watching a movie?', 'Is they watching a movie?', 'They are watching a movie?'], correctAnswer: 0, difficulty: 2, isActive: true },

  // Past Simple
  { id: 'g7', module: 'grammar', type: 'completion', topic: 'past_simple', questionText: 'We _____ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2, difficulty: 2, isActive: true },
  { id: 'g8', module: 'grammar', type: 'error_identification', topic: 'past_simple', questionText: 'Which sentence is correct?', options: ['He didn\'t went to school', 'He didn\'t go to school', 'He not went to school', 'He don\'t went to school'], correctAnswer: 1, difficulty: 2, isActive: true },
  { id: 'g9', module: 'grammar', type: 'transformation', topic: 'past_simple', questionText: 'Transform to question: "She bought a new car."', options: ['Did she bought a new car?', 'Does she buy a new car?', 'Did she buy a new car?', 'Was she buy a new car?'], correctAnswer: 2, difficulty: 2, isActive: true },

  // Present Perfect
  { id: 'g10', module: 'grammar', type: 'completion', topic: 'present_perfect', questionText: 'I _____ already finished my homework.', options: ['has', 'have', 'had', 'having'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'g11', module: 'grammar', type: 'completion', topic: 'present_perfect', questionText: 'She _____ never been to Japan.', options: ['have', 'has', 'had', 'having'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'g12', module: 'grammar', type: 'error_identification', topic: 'present_perfect', questionText: 'Which sentence is correct?', options: ['I have went to Paris twice', 'I have go to Paris twice', 'I have been to Paris twice', 'I has been to Paris twice'], correctAnswer: 2, difficulty: 3, isActive: true },
  { id: 'g13', module: 'grammar', type: 'transformation', topic: 'present_perfect', questionText: 'Transform to negative: "They have seen that movie."', options: ['They haven\'t saw that movie', 'They haven\'t seen that movie', 'They didn\'t seen that movie', 'They hasn\'t seen that movie'], correctAnswer: 1, difficulty: 3, isActive: true },

  // Future Forms
  { id: 'g14', module: 'grammar', type: 'completion', topic: 'future_forms', questionText: 'I _____ visit my grandmother next week.', options: ['will', 'did', 'do', 'was'], correctAnswer: 0, difficulty: 2, isActive: true },
  { id: 'g15', module: 'grammar', type: 'error_identification', topic: 'future_forms', questionText: 'Which sentence uses the correct future form?', options: ['I will going to the store', 'I am going to go to the store', 'I will goes to the store', 'I going to the store tomorrow will'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'g16', module: 'grammar', type: 'transformation', topic: 'future_forms', questionText: 'Transform using "going to": "She will study medicine."', options: ['She is going study medicine', 'She is going to study medicine', 'She going to studies medicine', 'She was going to study medicine'], correctAnswer: 1, difficulty: 3, isActive: true },

  // Conditionals
  { id: 'g17', module: 'grammar', type: 'completion', topic: 'conditionals', questionText: 'If it rains, I _____ stay at home.', options: ['will', 'would', 'should', 'could'], correctAnswer: 0, difficulty: 3, isActive: true },
  { id: 'g18', module: 'grammar', type: 'completion', topic: 'conditionals', questionText: 'If I _____ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2, difficulty: 4, isActive: true },
  { id: 'g19', module: 'grammar', type: 'error_identification', topic: 'conditionals', questionText: 'Which conditional sentence is correct?', options: ['If I will study, I pass the exam', 'If I study, I will pass the exam', 'If I studied, I will pass the exam', 'If I study, I would pass the exam'], correctAnswer: 1, difficulty: 4, isActive: true },

  // Passive Voice
  { id: 'g20', module: 'grammar', type: 'completion', topic: 'passive_voice', questionText: 'The book _____ by the students last year.', options: ['was read', 'is read', 'read', 'reading'], correctAnswer: 0, difficulty: 3, isActive: true },
  { id: 'g21', module: 'grammar', type: 'error_identification', topic: 'passive_voice', questionText: 'Which sentence is in the passive voice?', options: ['The chef cooked the meal', 'The meal was cooked by the chef', 'The chef is cooking the meal', 'The chef cooks the meal'], correctAnswer: 1, difficulty: 3, isActive: true },
  { id: 'g22', module: 'grammar', type: 'transformation', topic: 'passive_voice', questionText: 'Transform to passive: "Someone stole my bicycle."', options: ['My bicycle was stolen', 'My bicycle is stolen', 'My bicycle stole', 'My bicycle were stolen'], correctAnswer: 0, difficulty: 4, isActive: true },

  // Question Formation
  { id: 'g23', module: 'grammar', type: 'transformation', topic: 'question_formation', questionText: 'Form a question: "The empire was founded in 1453."', options: ['When was the empire founded?', 'When the empire was founded?', 'When did the empire founded?', 'When the empire did founded?'], correctAnswer: 0, difficulty: 3, isActive: true },
  { id: 'g24', module: 'grammar', type: 'transformation', topic: 'question_formation', questionText: 'Form a question: "She speaks three languages."', options: ['How many languages does she speak?', 'How many languages do she speak?', 'How many languages she speaks?', 'How many languages she does speak?'], correctAnswer: 0, difficulty: 3, isActive: true },
  { id: 'g25', module: 'grammar', type: 'error_identification', topic: 'question_formation', questionText: 'Which question is correctly formed?', options: ['Where you are going?', 'Where are you going?', 'Where you going?', 'Where going you?'], correctAnswer: 1, difficulty: 2, isActive: true },
];

const ALL_FALLBACK = [...FALLBACK_VOCABULARY_QUESTIONS, ...FALLBACK_GRAMMAR_QUESTIONS];

export async function GET(req: NextRequest) {
  try {
    const moduleParam = req.nextUrl.searchParams.get('module');
    const topicParam = req.nextUrl.searchParams.get('topic');

    if (!moduleParam) {
      return NextResponse.json({ error: 'Module parameter required' }, { status: 400 });
    }

    // Try to get questions from the database
    let questions: unknown[] = [];
    try {
      const where: Record<string, string | boolean> = { module: moduleParam, isActive: true };
      if (topicParam) where.topic = topicParam;

      const dbQuestions = await db.question.findMany({
        where,
        orderBy: { difficulty: 'asc' },
      });

      // Parse options from JSON string
      questions = dbQuestions.map(q => ({
        ...q,
        options: JSON.parse(q.options as string),
      }));
    } catch (dbError) {
      console.log('DB query failed, using fallback questions:', dbError);
    }

    // If no questions in DB, use fallback
    if (questions.length === 0) {
      questions = ALL_FALLBACK.filter(q => {
        const matchModule = q.module === moduleParam;
        const matchTopic = !topicParam || q.topic === topicParam;
        return matchModule && matchTopic;
      });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Questions fetch error:', error);
    // Even on error, return fallback questions
    const moduleParam = req.nextUrl.searchParams.get('module');
    const topicParam = req.nextUrl.searchParams.get('topic');
    const fallback = ALL_FALLBACK.filter(q => {
      const matchModule = q.module === moduleParam;
      const matchTopic = !topicParam || q.topic === topicParam;
      return matchModule && matchTopic;
    });
    return NextResponse.json({ questions: fallback });
  }
}
