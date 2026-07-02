// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Reading Comprehension Passages
// TOEFL-style: Academic passages with comprehension questions
// 3 difficulty levels × multiple passages per level
// Question types: main idea, detail, inference, vocab in context, purpose
// ═══════════════════════════════════════════════════════════

export interface ReadingQuestion {
  id: string;
  type: 'main_idea' | 'detail' | 'inference' | 'vocabulary' | 'purpose';
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface ReadingPassage {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  topic: string;
  text: string;
  wordCount: number;
  questions: ReadingQuestion[];
}

// ─── Easy Passages (~150-200 words) ─────────────────────────

const EASY_PASSAGES: ReadingPassage[] = [
  {
    id: 'r-easy-1',
    difficulty: 'easy',
    title: 'The Benefits of Walking',
    topic: 'Health & Lifestyle',
    wordCount: 165,
    text: `Walking is one of the simplest forms of exercise, yet its benefits are remarkable. Research shows that just 30 minutes of brisk walking each day can reduce the risk of heart disease by up to 35 percent. Unlike running or high-intensity workouts, walking places minimal stress on the joints, making it suitable for people of all ages and fitness levels.

Beyond physical health, walking has significant mental health benefits. Studies conducted at Stanford University found that walking increases creative thinking by an average of 60 percent. Many great thinkers, including Charles Darwin and Steve Jobs, were known for their habit of taking long walks while solving complex problems.

The accessibility of walking is perhaps its greatest advantage. It requires no special equipment, no gym membership, and can be done anywhere at any time. Health experts recommend incorporating walking into daily routines — such as taking the stairs instead of the elevator or walking to nearby destinations rather than driving.`,
    questions: [
      {
        id: 'r-easy-1-q1',
        type: 'main_idea',
        questionText: 'What is the passage primarily about?',
        options: ['The history of walking as exercise', 'The multiple benefits and accessibility of walking', 'A comparison between walking and running', 'Stanford University research on exercise'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-1-q2',
        type: 'detail',
        questionText: 'According to the passage, how much can walking reduce heart disease risk?',
        options: ['Up to 20 percent', 'Up to 35 percent', 'Up to 50 percent', 'Up to 60 percent'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-1-q3',
        type: 'vocabulary',
        questionText: 'The word "brisk" in paragraph 1 is closest in meaning to:',
        options: ['Slow and relaxed', 'Quick and energetic', 'Difficult and tiring', 'Short and occasional'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-1-q4',
        type: 'inference',
        questionText: 'What can be inferred about walking compared to running?',
        options: ['Walking burns more calories than running', 'Walking is safer for people with joint problems', 'Walking requires more time than running', 'Walking is only for elderly people'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-1-q5',
        type: 'purpose',
        questionText: 'Why does the author mention Charles Darwin and Steve Jobs?',
        options: ['To show that famous people preferred walking to driving', 'To support the claim that walking boosts creative thinking', 'To argue that walking is better than other exercise', 'To prove that walking was more popular in the past'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'r-easy-2',
    difficulty: 'easy',
    title: 'Sleep and Memory',
    topic: 'Science & Health',
    wordCount: 172,
    text: `Sleep plays a crucial role in how our brains process and store information. During sleep, the brain consolidates memories, transferring important information from short-term to long-term storage. This process, known as memory consolidation, is particularly active during deep sleep stages.

Research at Harvard Medical School demonstrated that students who slept after learning new material performed 20 to 30 percent better on tests than those who stayed awake. The study suggests that the brain actively rehearses and strengthens neural connections during sleep, essentially "replaying" the day's learning experiences.

Interestingly, different types of sleep benefit different types of memory. Deep sleep appears to be most important for factual knowledge — like vocabulary words or historical dates. REM sleep, the stage associated with dreaming, seems more critical for procedural memories — like how to ride a bicycle or play a musical instrument.

Experts recommend seven to nine hours of sleep per night for optimal cognitive function, with consistent sleep schedules being just as important as total sleep duration.`,
    questions: [
      {
        id: 'r-easy-2-q1',
        type: 'main_idea',
        questionText: 'What is the main topic of this passage?',
        options: ['How to improve study habits for students', 'The relationship between sleep and memory formation', 'Why REM sleep causes dreams at night', 'How Harvard Medical School conducts research'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-2-q2',
        type: 'detail',
        questionText: 'According to the passage, how much better did students perform after sleeping?',
        options: ['10 to 15 percent better', '20 to 30 percent better', '35 to 50 percent better', '60 to 70 percent better'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-2-q3',
        type: 'vocabulary',
        questionText: 'The word "consolidates" in paragraph 1 is closest in meaning to:',
        options: ['Deletes and removes permanently', 'Strengthens and makes more secure', 'Creates for the very first time', 'Temporarily stores for later review'],
        correctAnswer: 1,
      },
      {
        id: 'r-easy-2-q4',
        type: 'detail',
        questionText: 'According to the passage, which type of sleep benefits factual knowledge?',
        options: ['Light sleep only', 'REM sleep', 'Deep sleep', 'All stages equally'],
        correctAnswer: 2,
      },
      {
        id: 'r-easy-2-q5',
        type: 'inference',
        questionText: 'Based on the passage, what would the author likely recommend before an exam?',
        options: ['Staying up all night to study more material', 'Getting a good night of sleep after studying', 'Only sleeping during REM sleep cycles', 'Reducing sleep to have more study time'],
        correctAnswer: 1,
      },
    ],
  },
];


// ─── Medium Passages (~250-350 words) ───────────────────────

const MEDIUM_PASSAGES: ReadingPassage[] = [
  {
    id: 'r-med-1',
    difficulty: 'medium',
    title: 'The Urban Heat Island Effect',
    topic: 'Environmental Science',
    wordCount: 285,
    text: `Cities are significantly warmer than surrounding rural areas, a phenomenon known as the urban heat island effect. In large metropolitan areas, temperatures can be 5 to 10 degrees Fahrenheit higher than in nearby countryside, particularly during nighttime hours. This temperature difference has profound implications for energy consumption, public health, and urban planning.

The primary cause of urban heat islands is the replacement of natural vegetation with impervious surfaces such as concrete, asphalt, and buildings. These materials absorb solar radiation during the day and release it slowly at night, preventing the natural cooling that occurs in vegetated areas. Additionally, the geometric arrangement of tall buildings creates "urban canyons" that trap heat and reduce wind flow.

Human activities further exacerbate the problem. Air conditioning systems, vehicles, and industrial processes all generate waste heat that is released into the urban atmosphere. Ironically, the increased use of air conditioning to combat heat creates a feedback loop — as temperatures rise, more cooling is needed, which generates more waste heat.

Several mitigation strategies have shown promise. Green roofs — rooftops covered with vegetation — can reduce building temperatures by up to 40 degrees Fahrenheit. Strategic planting of trees along streets provides shade and cools the air through evapotranspiration. Some cities have also experimented with "cool pavements" that reflect more sunlight than traditional dark asphalt.

The challenge lies in implementation. Retrofitting existing infrastructure is expensive, and competing urban priorities often push environmental concerns to the background. However, as climate change intensifies, addressing urban heat islands becomes not merely an environmental preference but a public health necessity.`,
    questions: [
      {
        id: 'r-med-1-q1',
        type: 'main_idea',
        questionText: 'What is the passage primarily about?',
        options: ['How air conditioning damages the environment', 'The causes, effects, and solutions for urban heat islands', 'Why cities should plant more trees immediately', 'The differences between urban and rural living'],
        correctAnswer: 1,
      },
      {
        id: 'r-med-1-q2',
        type: 'detail',
        questionText: 'According to the passage, how much warmer can cities be compared to rural areas?',
        options: ['1 to 3 degrees Fahrenheit', '5 to 10 degrees Fahrenheit', '15 to 20 degrees Fahrenheit', '25 to 30 degrees Fahrenheit'],
        correctAnswer: 1,
      },
      {
        id: 'r-med-1-q3',
        type: 'vocabulary',
        questionText: 'The word "exacerbate" in paragraph 3 is closest in meaning to:',
        options: ['Slowly reduce over time', 'Completely eliminate forever', 'Make worse or more severe', 'Carefully measure and track'],
        correctAnswer: 2,
      },
      {
        id: 'r-med-1-q4',
        type: 'inference',
        questionText: 'What does the author suggest about the relationship between air conditioning and heat?',
        options: ['Air conditioning is the main cause of urban heat islands', 'Using air conditioning creates a cycle that increases overall heat', 'Cities should ban air conditioning to reduce temperatures', 'Air conditioning only affects indoor temperatures not outdoors'],
        correctAnswer: 1,
      },
      {
        id: 'r-med-1-q5',
        type: 'purpose',
        questionText: 'Why does the author mention "urban canyons" in paragraph 2?',
        options: ['To describe a tourist attraction in cities', 'To explain how building shapes trap heat', 'To argue against building tall structures', 'To compare cities to natural canyons in deserts'],
        correctAnswer: 1,
      },
    ],
  },
];

// ─── Hard Passages (~400-500 words) ─────────────────────────

const HARD_PASSAGES: ReadingPassage[] = [
  {
    id: 'r-hard-1',
    difficulty: 'hard',
    title: 'The Paradox of Choice',
    topic: 'Psychology & Behavioral Science',
    wordCount: 420,
    text: `In modern consumer societies, the prevailing assumption is that more choice leads to greater satisfaction. Supermarkets offer dozens of varieties of jam, streaming services provide thousands of films, and dating applications present endless potential partners. However, psychologist Barry Schwartz argues in his influential work that an abundance of options can paradoxically lead to decreased well-being — a phenomenon he terms "the paradox of choice."

Schwartz distinguishes between two types of decision-makers: "maximizers," who seek the absolute best option, and "satisficers," who choose the first option that meets their minimum criteria. Research consistently shows that maximizers, despite often making objectively better choices, report lower satisfaction with their decisions. The psychological burden of evaluating numerous alternatives, combined with the nagging possibility that a better option exists somewhere, creates what economists call "opportunity cost" — the haunting sense of what might have been.

A landmark study by Sheena Iyengar at Columbia University illustrates this principle vividly. When a supermarket displayed 24 varieties of jam, only 3 percent of shoppers made a purchase. When the display was reduced to 6 varieties, the purchase rate jumped to 30 percent — a tenfold increase. The larger display attracted more initial attention but ultimately paralyzed consumers with indecision.

The implications extend far beyond consumer goods. In healthcare, patients given extensive treatment options without clear guidance often experience "decision fatigue" and may delay critical medical decisions. In education, students offered an overwhelming array of courses without structured guidance frequently report anxiety about whether they have chosen correctly, even when their selections are perfectly reasonable.

Critics of the paradox of choice theory argue that it oversimplifies human behavior. Cultural factors, individual personality differences, and the domain of choice all influence how people respond to options. Furthermore, some researchers contend that having choices is intrinsically valuable because it provides a sense of autonomy and control, regardless of whether it maximizes satisfaction.

Nevertheless, practical applications of this research are increasingly visible. Successful technology companies now employ "choice architects" who design interfaces that guide users through decisions without overwhelming them. Netflix's recommendation algorithm, for instance, doesn't simply present its entire catalog; it curates a personalized selection that reduces cognitive load while maintaining the illusion of abundant choice.`,
    questions: [
      {
        id: 'r-hard-1-q1',
        type: 'main_idea',
        questionText: 'What is the central argument of the passage?',
        options: ['People should always choose the first available option', 'Having too many choices can reduce satisfaction and decision quality', 'Modern technology has solved the problem of too many choices', 'Maximizers are psychologically healthier than satisficers in life'],
        correctAnswer: 1,
      },
      {
        id: 'r-hard-1-q2',
        type: 'detail',
        questionText: 'According to the Iyengar study, what was the purchase rate with 6 jam varieties?',
        options: ['3 percent of all shoppers', '10 percent of all shoppers', '24 percent of all shoppers', '30 percent of all shoppers'],
        correctAnswer: 3,
      },
      {
        id: 'r-hard-1-q3',
        type: 'vocabulary',
        questionText: 'The word "paradoxically" in paragraph 1 is closest in meaning to:',
        options: ['Predictably and as one would expect', 'In a way that seems contradictory or opposite', 'Slowly and over a very long time period', 'Only in specific limited circumstances here'],
        correctAnswer: 1,
      },
      {
        id: 'r-hard-1-q4',
        type: 'inference',
        questionText: 'Based on the passage, what can be inferred about Netflix\'s recommendation system?',
        options: ['It randomly selects movies for all users', 'It deliberately limits visible options to help user decisions', 'It shows the entire catalog without any filtering', 'It only recommends movies with the highest ratings'],
        correctAnswer: 1,
      },
      {
        id: 'r-hard-1-q5',
        type: 'purpose',
        questionText: 'Why does the author discuss healthcare decisions in paragraph 4?',
        options: ['To argue that doctors give patients too many medications', 'To show the paradox of choice extends beyond shopping', 'To prove that patients should not make their own decisions', 'To compare healthcare systems across different countries'],
        correctAnswer: 1,
      },
    ],
  },
];

// ─── Export ─────────────────────────────────────────────────

import { EASY_PASSAGES_B2, MEDIUM_PASSAGES_B2, HARD_PASSAGES_B2, EASY_PASSAGES_B3, MEDIUM_PASSAGES_B3, HARD_PASSAGES_B3 } from './reading-passages-extended';

export const ALL_READING_PASSAGES: ReadingPassage[] = [
  ...EASY_PASSAGES,
  ...EASY_PASSAGES_B2,
  ...EASY_PASSAGES_B3,
  ...MEDIUM_PASSAGES,
  ...MEDIUM_PASSAGES_B2,
  ...MEDIUM_PASSAGES_B3,
  ...HARD_PASSAGES,
  ...HARD_PASSAGES_B2,
  ...HARD_PASSAGES_B3,
];

export function getReadingSet(): ReadingPassage[] {
  const allEasy = [...EASY_PASSAGES, ...EASY_PASSAGES_B2, ...EASY_PASSAGES_B3];
  const allMedium = [...MEDIUM_PASSAGES, ...MEDIUM_PASSAGES_B2, ...MEDIUM_PASSAGES_B3];
  const allHard = [...HARD_PASSAGES, ...HARD_PASSAGES_B2, ...HARD_PASSAGES_B3];

  const easy = allEasy[Math.floor(Math.random() * allEasy.length)];
  const medium = allMedium[Math.floor(Math.random() * allMedium.length)];
  const hard = allHard[Math.floor(Math.random() * allHard.length)];
  return [easy, medium, hard];
}

// Stats:
// Easy passages: 7 (with 5 questions each = 35 questions)
// Medium passages: 4 (with 5 questions = 20 questions)
// Hard passages: 3 (with 5 questions = 15 questions)
// Per test: 3 passages × 5 questions = 15 questions total
// Total unique tests possible: 7 × 4 × 3 = 84 combinations
// Students need many retakes before seeing the same test
