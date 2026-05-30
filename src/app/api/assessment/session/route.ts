// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Assessment Session API
// Manages locked question sets, session recovery, and exposure tracking
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';
import {
  shuffleArray,
  shuffleQuestionOptions,
  selectQuestionsByCategory,
  generateSessionSeed,
  VOCABULARY_CATEGORIES,
  GRAMMAR_CATEGORIES,
  canRetake,
  type QuestionPoolItem,
  type ShuffledQuestion,
} from '@/services/assessment-engine';
import { VOCABULARY_CONFIG, GRAMMAR_CONFIG } from '@/lib/constants';

// ─── Types ──────────────────────────────────────────────────

interface SessionRequest {
  userId: string;
  module: 'vocabulary' | 'grammar';
  forceNew?: boolean; // force create new session (for retakes)
}

// ─── Fallback Question Pools ────────────────────────────────
// Expanded pools for better rotation

const VOCAB_POOL: QuestionPoolItem[] = [
  // Band 1-500: Foundation Words (16 questions for pool rotation)
  { id: 'v1', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "water" mean?', options: ['A type of food', 'A clear liquid that falls as rain', 'A piece of clothing', 'A kind of animal'], correctAnswer: 1 },
  { id: 'v2', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "house" mean?', options: ['A vehicle', 'A building where people live', 'A type of tree', 'A game'], correctAnswer: 1 },
  { id: 'v3', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "walk" mean?', options: ['To run fast', 'To move on foot at a regular pace', 'To fly', 'To sleep'], correctAnswer: 1 },
  { id: 'v4', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "good" mean?', options: ['Bad quality', 'Of high quality or satisfactory', 'Very large', 'Extremely fast'], correctAnswer: 1 },
  { id: 'v5', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "child" mean?', options: ['An old person', 'A young human being', 'A type of animal', 'A tool'], correctAnswer: 1 },
  { id: 'v6', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "book" mean?', options: ['A written or printed work with pages', 'A type of food', 'A vehicle', 'A weapon'], correctAnswer: 0 },
  { id: 'v7', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "eat" mean?', options: ['To drink', 'To put food in the mouth and swallow', 'To sleep', 'To jump'], correctAnswer: 1 },
  { id: 'v8', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "big" mean?', options: ['Small in size', 'Of considerable size or extent', 'Very fast', 'Extremely quiet'], correctAnswer: 1 },
  // Additional pool questions for rotation
  { id: 'v1b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "sun" mean?', options: ['The moon at night', 'The star that gives light and heat to Earth', 'A type of cloud', 'A kind of rain'], correctAnswer: 1 },
  { id: 'v2b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "tree" mean?', options: ['A tall plant with a trunk and branches', 'A type of rock', 'A body of water', 'A small animal'], correctAnswer: 0 },
  { id: 'v3b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "run" mean?', options: ['To walk slowly', 'To move swiftly on foot', 'To sit down', 'To eat quickly'], correctAnswer: 1 },
  { id: 'v4b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "happy" mean?', options: ['Feeling sad', 'Feeling or showing pleasure and contentment', 'Feeling angry', 'Feeling tired'], correctAnswer: 1 },
  { id: 'v5b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "cold" mean?', options: ['Very hot temperature', 'Of low temperature; not warm', 'Very fast', 'Very loud'], correctAnswer: 1 },
  { id: 'v6b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "open" mean?', options: ['To close something', 'To allow access or passage through', 'To hide something', 'To break something'], correctAnswer: 1 },
  { id: 'v7b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "dark" mean?', options: ['Full of light', 'With little or no light', 'Very colorful', 'Extremely loud'], correctAnswer: 1 },
  { id: 'v8b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "old" mean?', options: ['Newly made', 'Having lived or existed for a long time', 'Very small', 'Extremely fast'], correctAnswer: 1 },

  // Band 501-1000: Common Words (16 questions)
  { id: 'v9', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "achieve" mean?', options: ['To fail at something', 'To successfully bring about or reach a goal', 'To destroy something', 'To forget something'], correctAnswer: 1 },
  { id: 'v10', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "brief" mean?', options: ['Very long', 'Of short duration or concise', 'Extremely heavy', 'Very colorful'], correctAnswer: 1 },
  { id: 'v11', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "convince" mean?', options: ['To argue angrily', 'To persuade someone to do something', 'To force someone physically', 'To ignore someone'], correctAnswer: 1 },
  { id: 'v12', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "demand" mean?', options: ['To ask for something forcefully or urgently', 'To give something away', 'To sleep peacefully', 'To eat quickly'], correctAnswer: 0 },
  { id: 'v13', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "essential" mean?', options: ['Unnecessary', 'Absolutely necessary or extremely important', 'Very small', 'Somewhat boring'], correctAnswer: 1 },
  { id: 'v14', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "feature" mean?', options: ['A distinctive attribute or aspect of something', 'A type of animal', 'A cooking tool', 'A musical instrument'], correctAnswer: 0 },
  { id: 'v15', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "genuine" mean?', options: ['Fake or artificial', 'Truly what something is said to be; authentic', 'Very expensive', 'Extremely loud'], correctAnswer: 1 },
  { id: 'v16', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "hesitate" mean?', options: ['To act immediately', 'To pause before doing something due to uncertainty', 'To shout loudly', 'To run quickly'], correctAnswer: 1 },
  { id: 'v9b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "abandon" mean?', options: ['To care for deeply', 'To leave behind or give up completely', 'To hold tightly', 'To repair something'], correctAnswer: 1 },
  { id: 'v10b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "capable" mean?', options: ['Unable to do something', 'Having the ability or skill to do something', 'Very slow', 'Extremely small'], correctAnswer: 1 },
  { id: 'v11b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "decline" mean?', options: ['To increase rapidly', 'To politely refuse or to decrease', 'To accept eagerly', 'To remain unchanged'], correctAnswer: 1 },
  { id: 'v12b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "evident" mean?', options: ['Hidden or secret', 'Plainly clear or obvious', 'Very confusing', 'Completely false'], correctAnswer: 1 },
  { id: 'v13b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "fortune" mean?', options: ['Bad luck', 'A large amount of money or good luck', 'A type of food', 'A small problem'], correctAnswer: 1 },
  { id: 'v14b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "involve" mean?', options: ['To exclude from an activity', 'To include as a necessary part', 'To avoid completely', 'To forget about'], correctAnswer: 1 },
  { id: 'v15b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "maintain" mean?', options: ['To destroy completely', 'To keep in good condition or continue', 'To ignore entirely', 'To replace with something new'], correctAnswer: 1 },
  { id: 'v16b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "obvious" mean?', options: ['Very difficult to see', 'Easily perceived or understood; clear', 'Completely hidden', 'Somewhat unclear'], correctAnswer: 1 },

  // Band 1001-2000: Intermediate Words (16 questions)
  { id: 'v17', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "ambiguous" mean?', options: ['Very clear and specific', 'Open to more than one interpretation; unclear', 'Extremely bright', 'Completely empty'], correctAnswer: 1 },
  { id: 'v18', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "contemplate" mean?', options: ['To ignore completely', 'To look thoughtfully at something for a long time; to ponder', 'To destroy rapidly', 'To celebrate loudly'], correctAnswer: 1 },
  { id: 'v19', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "diligent" mean?', options: ['Lazy and careless', 'Having or showing care and effort in work', 'Very aggressive', 'Extremely quiet'], correctAnswer: 1 },
  { id: 'v20', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "eloquent" mean?', options: ['Unable to speak', 'Fluent or persuasive in speaking or writing', 'Very angry', 'Extremely shy'], correctAnswer: 1 },
  { id: 'v21', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "formidable" mean?', options: ['Weak and small', 'Inspiring fear or respect through being impressively large or powerful', 'Very friendly and warm', 'Completely invisible'], correctAnswer: 1 },
  { id: 'v22', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "gratitude" mean?', options: ['Anger and resentment', 'The quality of being thankful; appreciation', 'Extreme fear', 'Deep sadness'], correctAnswer: 1 },
  { id: 'v23', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "hypothesis" mean?', options: ['A proven fact', 'A proposed explanation made as a starting point for investigation', 'A type of poem', 'A musical instrument'], correctAnswer: 1 },
  { id: 'v24', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "imminent" mean?', options: ['Very distant', 'About to happen; approaching', 'Completely finished', 'Extremely old'], correctAnswer: 1 },
  { id: 'v17b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "benevolent" mean?', options: ['Wishing harm on others', 'Well-meaning and kindly; charitable', 'Very aggressive', 'Completely silent'], correctAnswer: 1 },
  { id: 'v18b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "coherent" mean?', options: ['Confused and disorganized', 'Logical and consistent; making sense', 'Extremely loud', 'Very colorful'], correctAnswer: 1 },
  { id: 'v19b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "meticulous" mean?', options: ['Careless and hasty', 'Showing great attention to detail; very careful and precise', 'Very slow', 'Extremely casual'], correctAnswer: 1 },
  { id: 'v20b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "persistent" mean?', options: ['Giving up easily', 'Continuing firmly despite difficulty or opposition', 'Very lazy', 'Extremely quiet'], correctAnswer: 1 },
  { id: 'v21b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "profound" mean?', options: ['Very shallow', 'Very great, intense, or having deep insight', 'Slightly interesting', 'Completely ordinary'], correctAnswer: 1 },
  { id: 'v22b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "reluctant" mean?', options: ['Very eager', 'Unwilling and hesitant', 'Extremely brave', 'Completely certain'], correctAnswer: 1 },
  { id: 'v23b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "subtle" mean?', options: ['Very obvious and loud', 'So delicate or precise as to be difficult to detect', 'Extremely large', 'Completely dark'], correctAnswer: 1 },
  { id: 'v24b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "tenacious" mean?', options: ['Easily discouraged', 'Holding firmly to something; persistent and determined', 'Very lazy', 'Extremely forgetful'], correctAnswer: 1 },

  // Band 2001-3000: Advanced Words (16 questions)
  { id: 'v25', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "juxtapose" mean?', options: ['To separate completely', 'To place close together for contrasting effect', 'To erase permanently', 'To exaggerate greatly'], correctAnswer: 1 },
  { id: 'v26', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "lucid" mean?', options: ['Confused and unclear', 'Expressed clearly; easy to understand', 'Extremely dark', 'Very heavy'], correctAnswer: 1 },
  { id: 'v27', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "meticulous" mean?', options: ['Careless and sloppy', 'Showing great attention to detail; very careful', 'Very slow', 'Extremely loud'], correctAnswer: 1 },
  { id: 'v28', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "nonchalant" mean?', options: ['Extremely worried', 'Feeling or appearing casually calm and relaxed', 'Very aggressive', 'Deeply emotional'], correctAnswer: 1 },
  { id: 'v29', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "obscure" mean?', options: ['Very well-known and famous', 'Not discovered or known about; uncertain', 'Extremely bright', 'Very recent'], correctAnswer: 1 },
  { id: 'v30', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "pragmatic" mean?', options: ['Dealing with things sensibly and realistically', 'Completely unrealistic', 'Very emotional', 'Deeply philosophical'], correctAnswer: 0 },
  { id: 'v31', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "quintessential" mean?', options: ['Completely ordinary', 'Representing the most perfect example of a quality', 'Very small', 'Extremely old'], correctAnswer: 1 },
  { id: 'v32', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "resilient" mean?', options: ['Easily broken', 'Able to recover quickly from difficult conditions', 'Very soft', 'Extremely rigid'], correctAnswer: 1 },
  { id: 'v25b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "ameliorate" mean?', options: ['To make worse', 'To make something bad better; improve', 'To destroy completely', 'To ignore entirely'], correctAnswer: 1 },
  { id: 'v26b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "capricious" mean?', options: ['Very consistent', 'Given to sudden changes of mood or behavior', 'Extremely slow', 'Completely predictable'], correctAnswer: 1 },
  { id: 'v27b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "delineate" mean?', options: ['To blur boundaries', 'To describe or portray something precisely', 'To destroy completely', 'To ignore entirely'], correctAnswer: 1 },
  { id: 'v28b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "exacerbate" mean?', options: ['To make a problem better', 'To make a bad situation worse', 'To ignore a problem', 'To create a new problem'], correctAnswer: 1 },
  { id: 'v29b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "pernicious" mean?', options: ['Very helpful', 'Having a harmful effect, especially gradually', 'Extremely beautiful', 'Completely harmless'], correctAnswer: 1 },
  { id: 'v30b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "recalcitrant" mean?', options: ['Very obedient', 'Having an obstinately uncooperative attitude', 'Extremely helpful', 'Completely agreeable'], correctAnswer: 1 },
  { id: 'v31b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "surreptitious" mean?', options: ['Done openly', 'Kept secret because it would not be approved', 'Very loud', 'Extremely obvious'], correctAnswer: 1 },
  { id: 'v32b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "vindicate" mean?', options: ['To prove wrong', 'To clear of blame or suspicion; justify', 'To make guilty', 'To punish severely'], correctAnswer: 1 },

  // Band 3001-5000: Elite Words (16 questions)
  { id: 'v33', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "sycophant" mean?', options: ['A brave warrior', 'A person who acts obsequiously toward someone important to gain advantage', 'A type of musician', 'A mathematical formula'], correctAnswer: 1 },
  { id: 'v34', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "ubiquitous" mean?', options: ['Very rare', 'Present, appearing, or found everywhere', 'Extremely small', 'Completely hidden'], correctAnswer: 1 },
  { id: 'v35', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "vicissitude" mean?', options: ['A stable condition', 'A change of circumstances, typically unwelcome or difficult', 'A type of celebration', 'A mathematical concept'], correctAnswer: 1 },
  { id: 'v36', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "whimsical" mean?', options: ['Very serious and formal', 'Acting in a capricious manner; playfully quaint', 'Extremely dangerous', 'Deeply philosophical'], correctAnswer: 1 },
  { id: 'v37', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "xenophobia" mean?', options: ['Love of foreign cultures', 'Dislike of or prejudice against people from other countries', 'Fear of the dark', 'A type of plant'], correctAnswer: 1 },
  { id: 'v38', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "yielding" mean?', options: ['Very strong and rigid', 'Giving way under pressure; flexible or compliant', 'Extremely fast', 'Completely dark'], correctAnswer: 1 },
  { id: 'v39', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "zealous" mean?', options: ['Lazy and indifferent', 'Having or showing zeal; enthusiastic and passionate', 'Very calm and quiet', 'Extremely tired'], correctAnswer: 1 },
  { id: 'v40', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "aberration" mean?', options: ['A normal occurrence', 'A departure from what is normal or expected; an anomaly', 'A type of music', 'A cooking technique'], correctAnswer: 1 },
  { id: 'v33b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "ephemeral" mean?', options: ['Lasting forever', 'Lasting for a very short time', 'Very strong', 'Extremely heavy'], correctAnswer: 1 },
  { id: 'v34b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "laconic" mean?', options: ['Very talkative', 'Using very few words; concise to the point of seeming rude', 'Extremely loud', 'Deeply emotional'], correctAnswer: 1 },
  { id: 'v35b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "obfuscate" mean?', options: ['To make clearer', 'To render obscure or unclear; to confuse', 'To illuminate brightly', 'To simplify greatly'], correctAnswer: 1 },
  { id: 'v36b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "parsimonious" mean?', options: ['Very generous', 'Unwilling to spend money; extremely frugal', 'Extremely wealthy', 'Very careless with money'], correctAnswer: 1 },
  { id: 'v37b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "recalcitrant" mean?', options: ['Very obedient and compliant', 'Stubbornly resistant to authority or control', 'Extremely helpful', 'Always agreeable'], correctAnswer: 1 },
  { id: 'v38b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "sesquipedalian" mean?', options: ['Using very short words', 'Characterized by long words; long-winded', 'Very quiet', 'Extremely brief'], correctAnswer: 1 },
  { id: 'v39b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "truculent" mean?', options: ['Very peaceful', 'Eager to argue or fight; aggressively defiant', 'Extremely shy', 'Completely calm'], correctAnswer: 1 },
  { id: 'v40b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "verisimilitude" mean?', options: ['Complete falsehood', 'The appearance of being true or real', 'A type of music', 'A mathematical proof'], correctAnswer: 1 },
];

const GRAMMAR_POOL: QuestionPoolItem[] = [
  // Present Simple (6 questions for pool rotation)
  { id: 'g1', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },
  { id: 'g2', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ['He don\'t like coffee', 'He doesn\'t likes coffee', 'He doesn\'t like coffee', 'He not like coffee'], correctAnswer: 2 },
  { id: 'g3', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to negative: "They play football on Sundays."', options: ['They doesn\'t play football on Sundays', 'They don\'t play football on Sundays', 'They not play football on Sundays', 'They aren\'t play football on Sundays'], correctAnswer: 1 },
  { id: 'g1b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Water _____ at 100 degrees Celsius.', options: ['boil', 'boils', 'boiling', 'boiled'], correctAnswer: 1 },
  { id: 'g2b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She have two brothers', 'She has two brothers', 'She haves two brothers', 'She having two brothers'], correctAnswer: 1 },
  { id: 'g3b', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to question: "He works in a hospital."', options: ['Does he works in a hospital?', 'Do he work in a hospital?', 'Does he work in a hospital?', 'He works in a hospital?'], correctAnswer: 2 },

  // Present Continuous (6 questions)
  { id: 'g4', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'I _____ reading a book right now.', options: ['am', 'is', 'are', 'be'], correctAnswer: 0 },
  { id: 'g5', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She is work at the office', 'She is working at the office', 'She working at the office', 'She works at the office now'], correctAnswer: 1 },
  { id: 'g6', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to question: "They are watching a movie."', options: ['Are they watching a movie?', 'Do they watching a movie?', 'Is they watching a movie?', 'They are watching a movie?'], correctAnswer: 0 },
  { id: 'g4b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'The children _____ in the garden at the moment.', options: ['plays', 'are playing', 'is playing', 'play'], correctAnswer: 1 },
  { id: 'g5b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['He is run in the park', 'He is running in the park', 'He running in the park', 'He runs in the park right now'], correctAnswer: 1 },
  { id: 'g6b', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to negative: "She is writing a letter."', options: ['She doesn\'t writing a letter', 'She isn\'t writing a letter', 'She not writing a letter', 'She don\'t writing a letter'], correctAnswer: 1 },

  // Past Simple (6 questions)
  { id: 'g7', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'We _____ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2 },
  { id: 'g8', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ['He didn\'t went to school', 'He didn\'t go to school', 'He not went to school', 'He don\'t went to school'], correctAnswer: 1 },
  { id: 'g9', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to question: "She bought a new car."', options: ['Did she bought a new car?', 'Does she buy a new car?', 'Did she buy a new car?', 'Was she buy a new car?'], correctAnswer: 2 },
  { id: 'g7b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'They _____ a great time at the party last night.', options: ['have', 'has', 'had', 'having'], correctAnswer: 2 },
  { id: 'g8b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ['She didn\'t saw the movie', 'She didn\'t see the movie', 'She not saw the movie', 'She don\'t saw the movie'], correctAnswer: 1 },
  { id: 'g9b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to negative: "He wrote a letter."', options: ['He didn\'t wrote a letter', 'He didn\'t write a letter', 'He not wrote a letter', 'He don\'t wrote a letter'], correctAnswer: 1 },

  // Present Perfect (6 questions)
  { id: 'g10', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'I _____ already finished my homework.', options: ['has', 'have', 'had', 'having'], correctAnswer: 1 },
  { id: 'g11', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'She _____ never been to Japan.', options: ['have', 'has', 'had', 'having'], correctAnswer: 1 },
  { id: 'g12', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I have went to Paris twice', 'I have go to Paris twice', 'I have been to Paris twice', 'I has been to Paris twice'], correctAnswer: 2 },
  { id: 'g13', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Transform to negative: "They have seen that movie."', options: ['They haven\'t saw that movie', 'They haven\'t seen that movie', 'They didn\'t seen that movie', 'They hasn\'t seen that movie'], correctAnswer: 1 },
  { id: 'g10b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'How long _____ you lived here?', options: ['has', 'have', 'had', 'do'], correctAnswer: 1 },
  { id: 'g11b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence uses the present perfect correctly?', options: ['I have visit London last year', 'I have visited London three times', 'I has visited London', 'I have visiting London now'], correctAnswer: 1 },

  // Future Forms (6 questions)
  { id: 'g14', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'I _____ visit my grandmother next week.', options: ['will', 'did', 'do', 'was'], correctAnswer: 0 },
  { id: 'g15', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence uses the correct future form?', options: ['I will going to the store', 'I am going to go to the store', 'I will goes to the store', 'I going to the store tomorrow will'], correctAnswer: 1 },
  { id: 'g16', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform using "going to": "She will study medicine."', options: ['She is going study medicine', 'She is going to study medicine', 'She going to studies medicine', 'She was going to study medicine'], correctAnswer: 1 },
  { id: 'g14b', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'Look at those clouds! It _____ rain soon.', options: ['will', 'is going to', 'shall', 'would'], correctAnswer: 1 },
  { id: 'g15b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I will to call you tomorrow', 'I will call you tomorrow', 'I will calling you tomorrow', 'I will called you tomorrow'], correctAnswer: 1 },
  { id: 'g16b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform to future with "will": "She is going to travel abroad."', options: ['She will travel abroad', 'She will travels abroad', 'She will traveling abroad', 'She will traveled abroad'], correctAnswer: 0 },

  // Conditionals (6 questions)
  { id: 'g17', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If it rains, I _____ stay at home.', options: ['will', 'would', 'should', 'could'], correctAnswer: 0 },
  { id: 'g18', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I _____ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2 },
  { id: 'g19', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which conditional sentence is correct?', options: ['If I will study, I pass the exam', 'If I study, I will pass the exam', 'If I studied, I will pass the exam', 'If I study, I would pass the exam'], correctAnswer: 1 },
  { id: 'g17b', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If she _____ harder, she would have passed the exam.', options: ['studied', 'had studied', 'studies', 'would study'], correctAnswer: 1 },
  { id: 'g18b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I were you, I _____ accept the offer.', options: ['will', 'would', 'shall', 'can'], correctAnswer: 1 },
  { id: 'g19b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which sentence is a correct third conditional?', options: ['If I had known, I would have helped', 'If I knew, I would help', 'If I know, I will help', 'If I would know, I help'], correctAnswer: 0 },

  // Passive Voice (6 questions)
  { id: 'g20', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The book _____ by the students last year.', options: ['was read', 'is read', 'read', 'reading'], correctAnswer: 0 },
  { id: 'g21', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The chef cooked the meal', 'The meal was cooked by the chef', 'The chef is cooking the meal', 'The chef cooks the meal'], correctAnswer: 1 },
  { id: 'g22', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "Someone stole my bicycle."', options: ['My bicycle was stolen', 'My bicycle is stolen', 'My bicycle stole', 'My bicycle were stolen'], correctAnswer: 0 },
  { id: 'g20b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The new bridge _____ next year.', options: ['will build', 'will be built', 'is building', 'built'], correctAnswer: 1 },
  { id: 'g21b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The company produces cars', 'Cars are produced by the company', 'The company is producing cars', 'The company will produce cars'], correctAnswer: 1 },
  { id: 'g22b', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "They are painting the house."', options: ['The house is being painted', 'The house was painted', 'The house is painted', 'The house painted'], correctAnswer: 0 },

  // Question Formation (6 questions)
  { id: 'g23', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "The empire was founded in 1453."', options: ['When was the empire founded?', 'When the empire was founded?', 'When did the empire founded?', 'When the empire did founded?'], correctAnswer: 0 },
  { id: 'g24', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "She speaks three languages."', options: ['How many languages does she speak?', 'How many languages do she speak?', 'How many languages she speaks?', 'How many languages she does speak?'], correctAnswer: 0 },
  { id: 'g25', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['Where you are going?', 'Where are you going?', 'Where you going?', 'Where going you?'], correctAnswer: 1 },
  { id: 'g23b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "He has been working here for five years."', options: ['How long has he been working here?', 'How long he has been working here?', 'How long have he been working here?', 'How long he been working here?'], correctAnswer: 0 },
  { id: 'g24b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "They will arrive tomorrow."', options: ['When will they arrive?', 'When they will arrive?', 'When do they arrive?', 'When they arrive?'], correctAnswer: 0 },
  { id: 'g25b', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['What time the train leaves?', 'What time does the train leave?', 'What time the train does leave?', 'What time leave the train?'], correctAnswer: 1 },
];

// ─── Handler ────────────────────────────────────────────────

async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body: SessionRequest = await req.json();
      const { userId, module, forceNew } = body;

      if (!userId || !module) {
        return NextResponse.json({ error: 'userId and module are required' }, { status: 400 });
      }

      if (module !== 'vocabulary' && module !== 'grammar') {
        return NextResponse.json({ error: 'Module must be vocabulary or grammar' }, { status: 400 });
      }

      // Try to use DB for session management
      let attemptNumber = 1;
      let exposedIds = new Set<string>();
      let existingSession = null;

      try {
        const { db } = await import('@/lib/db');

        // Check for active session (refresh recovery)
        if (!forceNew) {
          existingSession = await db.assessmentSession.findFirst({
            where: { userId, module, status: 'active' },
            orderBy: { startedAt: 'desc' },
          });

          if (existingSession) {
            // Return existing locked session
            const questionIds: string[] = JSON.parse(existingSession.questionSet);
            const optionMapping: Record<string, number[]> = JSON.parse(existingSession.optionMapping);
            const pool = module === 'vocabulary' ? VOCAB_POOL : GRAMMAR_POOL;

            // Reconstruct questions with shuffled options
            const questions = questionIds.map((qId, idx) => {
              const poolQ = pool.find(q => q.id === qId);
              if (!poolQ) return null;

              const mapping = optionMapping[qId];
              if (mapping) {
                const shuffledOptions = mapping.map((origIdx: number) => poolQ.options[origIdx]);
                const newCorrect = mapping.indexOf(poolQ.correctAnswer);
                return {
                  ...poolQ,
                  options: shuffledOptions,
                  correctAnswer: newCorrect,
                  _originalCorrectAnswer: poolQ.correctAnswer,
                  _displayOrder: idx,
                };
              }
              return { ...poolQ, _displayOrder: idx };
            }).filter(Boolean);

            return NextResponse.json({
              session: {
                id: existingSession.id,
                module,
                attemptNumber: existingSession.attemptNumber,
                seed: existingSession.seed,
                questions,
                isResumed: true,
              },
            });
          }
        }

        // Check retake cooldown
        if (forceNew) {
          const lastSession = await db.assessmentSession.findFirst({
            where: { userId, module, status: 'completed' },
            orderBy: { completedAt: 'desc' },
          });

          if (lastSession?.completedAt) {
            const retake = canRetake(lastSession.completedAt);
            if (!retake.allowed) {
              return NextResponse.json({
                error: 'Retake cooldown active',
                cooldownMs: retake.remainingMs,
                message: `Please wait before retaking this trial.`,
              }, { status: 429 });
            }
          }
        }

        // Get attempt number
        const previousSessions = await db.assessmentSession.count({
          where: { userId, module },
        });
        attemptNumber = previousSessions + 1;

        // Get exposed question IDs
        const exposures = await db.questionExposure.findMany({
          where: { userId, module },
          select: { questionId: true },
        });
        exposedIds = new Set(exposures.map(e => e.questionId));

        // Mark old active sessions as abandoned
        await db.assessmentSession.updateMany({
          where: { userId, module, status: 'active' },
          data: { status: 'abandoned' },
        });
      } catch (dbError) {
        console.log('DB session management failed, using stateless mode:', dbError);
      }

      // Generate session
      const seed = generateSessionSeed(userId, module, attemptNumber);
      const pool = module === 'vocabulary' ? VOCAB_POOL : GRAMMAR_POOL;
      const categories = module === 'vocabulary' ? VOCABULARY_CATEGORIES : GRAMMAR_CATEGORIES;

      // Select questions by category with exposure avoidance
      const { selectedQuestions } = selectQuestionsByCategory(
        pool,
        categories,
        exposedIds,
        attemptNumber,
        seed
      );

      // Shuffle question order
      const shuffledQuestions = shuffleArray(selectedQuestions, seed + 1);

      // Shuffle options for each question with per-question seeds
      const processedQuestions = shuffledQuestions.map((q, idx) => {
        const shuffled = shuffleQuestionOptions(q, seed + idx + 100);
        return {
          ...shuffled,
          _displayOrder: idx,
        };
      });

      // Build question set and option mapping for storage
      const questionIds = processedQuestions.map(q => q.id);
      const optionMapping: Record<string, number[]> = {};
      for (const q of processedQuestions) {
        optionMapping[q.id] = q._optionMapping;
      }

      // Try to save session to DB
      let sessionId = `session_${userId}_${module}_${Date.now()}`;
      try {
        const { db } = await import('@/lib/db');
        const session = await db.assessmentSession.create({
          data: {
            userId,
            module,
            attemptNumber,
            questionSet: JSON.stringify(questionIds),
            optionMapping: JSON.stringify(optionMapping),
            seed,
            status: 'active',
          },
        });
        sessionId = session.id;

        // Record question exposures
        await db.questionExposure.createMany({
          data: processedQuestions.map(q => ({
            userId,
            questionId: q.id,
            module,
            attemptNum: attemptNumber,
          })).filter((item, index, self) =>
            index === self.findIndex(t => t.questionId === item.questionId)
          ),
        });
      } catch (dbError) {
        console.log('DB session save failed, continuing stateless:', dbError);
      }

      return NextResponse.json({
        session: {
          id: sessionId,
          module,
          attemptNumber,
          seed,
          questions: processedQuestions,
          isResumed: false,
        },
      });
    } catch (error) {
      console.error('Session creation error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // PATCH: Complete a session
  if (req.method === 'PATCH') {
    try {
      const { sessionId } = await req.json();
      if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
      }

      try {
        const { db } = await import('@/lib/db');
        await db.assessmentSession.update({
          where: { id: sessionId },
          data: { status: 'completed', completedAt: new Date() },
        });
      } catch (dbError) {
        console.log('DB session completion failed:', dbError);
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Session completion error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const POST = withApiProtection({ rateLimit: 'assessment', detectBots: true })(handler);
export const PATCH = withApiProtection({ rateLimit: 'assessment', detectBots: true })(handler);
