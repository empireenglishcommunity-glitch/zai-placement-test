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
  // ═══ Band 1-500: Foundation Words (16 questions) ═══
  // All options are 4-7 words, similar length. Correct answer position varies.
  { id: 'v1', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "water" mean?', options: ['A solid material for building', 'A clear liquid we drink', 'A tool used for cooking', 'A sound made by animals'], correctAnswer: 1 },
  { id: 'v2', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "house" mean?', options: ['A building where people live', 'A machine that makes things', 'A place to grow food', 'A container for carrying items'], correctAnswer: 0 },
  { id: 'v3', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "walk" mean?', options: ['To speak to other people', 'To prepare food for eating', 'To move forward on foot', 'To rest with eyes closed'], correctAnswer: 2 },
  { id: 'v4', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "good" mean?', options: ['Having a high quality level', 'Moving at a great speed', 'Being very large in size', 'Feeling tired and very weak'], correctAnswer: 0 },
  { id: 'v5', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "child" mean?', options: ['A tall strong plant outside', 'A heavy object made of metal', 'A place with lots of books', 'A young person not yet adult'], correctAnswer: 3 },
  { id: 'v6', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "book" mean?', options: ['A type of sweet food item', 'A written work with pages', 'A fast moving vehicle type', 'A small flying creature here'], correctAnswer: 1 },
  { id: 'v7', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "eat" mean?', options: ['To look at something carefully', 'To make a very loud sound', 'To put food in your mouth', 'To move things with your hands'], correctAnswer: 2 },
  { id: 'v8', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "big" mean?', options: ['Very quiet and very peaceful', 'Large in size or in amount', 'Extremely old and very ancient', 'Moving without making any noise'], correctAnswer: 1 },
  { id: 'v1b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "sun" mean?', options: ['A deep body of still water', 'A type of strong cold wind', 'The star that gives us light', 'A large flat area of land'], correctAnswer: 2 },
  { id: 'v2b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "tree" mean?', options: ['A tall plant with many branches', 'A small furry wild animal', 'A round stone found near rivers', 'A warm piece of winter clothing'], correctAnswer: 0 },
  { id: 'v3b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "run" mean?', options: ['To sit very still in one place', 'To sleep during the dark night', 'To eat a large meal very fast', 'To move quickly using your feet'], correctAnswer: 3 },
  { id: 'v4b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "happy" mean?', options: ['Feeling afraid of many things', 'Feeling pleasure and real joy', 'Feeling angry at other people', 'Feeling very tired all day long'], correctAnswer: 1 },
  { id: 'v5b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "cold" mean?', options: ['Having a very low temperature', 'Being extremely heavy to hold', 'Making a very loud sharp noise', 'Shining with many bright colors'], correctAnswer: 0 },
  { id: 'v6b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "open" mean?', options: ['To make something much smaller', 'To change the color of things', 'To allow people to pass through', 'To count many things one by one'], correctAnswer: 2 },
  { id: 'v7b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "dark" mean?', options: ['Without much light at all', 'Very smooth to the touch', 'Extremely sweet in its taste', 'Moving forward at great speed'], correctAnswer: 0 },
  { id: 'v8b', module: 'vocabulary', topic: '1-500', difficulty: 1, questionText: 'What does the word "old" mean?', options: ['Very small in every single way', 'Bright and very full of color', 'Having existed for a long time', 'Completely new and very fresh'], correctAnswer: 2 },

  // ═══ Band 501-1000: Common Words (16 questions) ═══
  { id: 'v9', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "achieve" mean?', options: ['To lose something of great value', 'To reach a goal successfully', 'To damage something beyond repair', 'To forget important information fast'], correctAnswer: 1 },
  { id: 'v10', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "brief" mean?', options: ['Lasting only a short time', 'Extremely heavy to carry around', 'Very bright and full of light', 'Completely silent with no sound'], correctAnswer: 0 },
  { id: 'v11', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "convince" mean?', options: ['To physically force someone to act', 'To scream at another person loudly', 'To persuade someone to believe you', 'To completely ignore what they said'], correctAnswer: 2 },
  { id: 'v12', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "demand" mean?', options: ['To give things away for free', 'To sleep for a very long time', 'To eat quickly without any thought', 'To ask for something with force'], correctAnswer: 3 },
  { id: 'v13', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "essential" mean?', options: ['Completely unnecessary and optional', 'Absolutely necessary and very important', 'Slightly boring but still useful', 'Extremely rare and hard to find'], correctAnswer: 1 },
  { id: 'v14', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "feature" mean?', options: ['A notable quality of something', 'A dangerous type of wild animal', 'A heavy tool for cutting wood', 'A loud instrument played at night'], correctAnswer: 0 },
  { id: 'v15', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "genuine" mean?', options: ['Completely fake and not real', 'Extremely loud and quite annoying', 'Very costly and hard to afford', 'Truly real and not pretended'], correctAnswer: 3 },
  { id: 'v16', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "hesitate" mean?', options: ['To act right away without thinking', 'To scream at the top of voice', 'To pause due to feeling uncertain', 'To run as fast as you can'], correctAnswer: 2 },
  { id: 'v9b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "abandon" mean?', options: ['To leave behind or give up', 'To protect and care for deeply', 'To hold something very tightly', 'To repair and fix broken things'], correctAnswer: 0 },
  { id: 'v10b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "capable" mean?', options: ['Unable to do anything at all', 'Moving at a very slow pace', 'Having the skill to do things', 'Extremely tiny and hard to see'], correctAnswer: 2 },
  { id: 'v11b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "decline" mean?', options: ['To refuse or become smaller', 'To increase rapidly over time', 'To accept with great enthusiasm', 'To remain the same as before'], correctAnswer: 0 },
  { id: 'v12b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "evident" mean?', options: ['Completely hidden from all people', 'Very confusing and hard to grasp', 'Totally false and not at all true', 'Clearly seen and easy to notice'], correctAnswer: 3 },
  { id: 'v13b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "fortune" mean?', options: ['A large amount of money or luck', 'A very small everyday problem', 'A type of common prepared food', 'A period of extremely bad luck'], correctAnswer: 0 },
  { id: 'v14b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "involve" mean?', options: ['To keep someone out of things', 'To forget about something entirely', 'To avoid all contact with others', 'To include as a necessary part'], correctAnswer: 3 },
  { id: 'v15b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "maintain" mean?', options: ['To destroy completely and fully', 'To keep in good working condition', 'To ignore and never think about', 'To replace with something brand new'], correctAnswer: 1 },
  { id: 'v16b', module: 'vocabulary', topic: '501-1000', difficulty: 2, questionText: 'What does the word "obvious" mean?', options: ['Very hard to see or understand', 'Totally hidden from everyone nearby', 'Easy to see and understand clearly', 'Somewhat confusing and quite unclear'], correctAnswer: 2 },

  // ═══ Band 1001-2000: Intermediate Words (16 questions) ═══
  { id: 'v17', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "ambiguous" mean?', options: ['Very specific and perfectly clear', 'Extremely bright and full of light', 'Having more than one possible meaning', 'Completely empty with nothing inside'], correctAnswer: 2 },
  { id: 'v18', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "contemplate" mean?', options: ['To destroy something very rapidly', 'To celebrate in a loud manner', 'To ignore someone on purpose fully', 'To think deeply about something'], correctAnswer: 3 },
  { id: 'v19', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "diligent" mean?', options: ['Showing great care in your work', 'Being lazy and not trying hard', 'Acting in a very aggressive way', 'Remaining extremely quiet all day'], correctAnswer: 0 },
  { id: 'v20', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "eloquent" mean?', options: ['Unable to speak any language well', 'Feeling very angry at all others', 'Extremely shy around other people', 'Skilled and persuasive in speech'], correctAnswer: 3 },
  { id: 'v21', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "formidable" mean?', options: ['Weak and easy to overcome fast', 'Inspiring fear or deep respect', 'Extremely friendly and very warm', 'Completely invisible to all people'], correctAnswer: 1 },
  { id: 'v22', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "gratitude" mean?', options: ['Anger and deep resentment felt', 'Extreme fear of future events', 'Deep sadness lasting a long time', 'The feeling of being truly thankful'], correctAnswer: 3 },
  { id: 'v23', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "hypothesis" mean?', options: ['A proven scientific fact or law', 'A proposed explanation to test', 'A type of classical written poem', 'A complex musical instrument type'], correctAnswer: 1 },
  { id: 'v24', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "imminent" mean?', options: ['About to happen very soon now', 'Very far away in the distance', 'Completely finished and fully done', 'Extremely old and from the past'], correctAnswer: 0 },
  { id: 'v17b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "benevolent" mean?', options: ['Wishing to cause harm to others', 'Very aggressive and quite hostile', 'Kind and wanting to help people', 'Completely silent and not speaking'], correctAnswer: 2 },
  { id: 'v18b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "coherent" mean?', options: ['Logical and making clear sense', 'Confused and without any order', 'Extremely loud and quite disturbing', 'Very colorful and highly decorated'], correctAnswer: 0 },
  { id: 'v19b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "meticulous" mean?', options: ['Careless and done without thought', 'Very slow in every single way', 'Extremely casual and not serious', 'Very careful with close attention'], correctAnswer: 3 },
  { id: 'v20b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "persistent" mean?', options: ['Continuing firmly despite difficulty', 'Giving up easily when things fail', 'Being very lazy about all tasks', 'Extremely quiet and never speaking'], correctAnswer: 0 },
  { id: 'v21b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "profound" mean?', options: ['Very shallow and lacking any depth', 'Only slightly interesting to people', 'Completely ordinary and quite normal', 'Very deep and full of meaning'], correctAnswer: 3 },
  { id: 'v22b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "reluctant" mean?', options: ['Very eager and ready to start', 'Unwilling and not wanting to act', 'Extremely brave facing all danger', 'Completely sure about a decision'], correctAnswer: 1 },
  { id: 'v23b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "subtle" mean?', options: ['Very obvious and easy to notice', 'Hard to detect or notice clearly', 'Extremely large and easy to see', 'Completely dark with no light at all'], correctAnswer: 1 },
  { id: 'v24b', module: 'vocabulary', topic: '1001-2000', difficulty: 3, questionText: 'What does the word "tenacious" mean?', options: ['Easily giving up on all tasks', 'Very lazy and lacking all drive', 'Extremely forgetful about all things', 'Holding on firmly and not quitting'], correctAnswer: 3 },

  // ═══ Band 2001-3000: Advanced Words (16 questions) ═══
  { id: 'v25', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "juxtapose" mean?', options: ['To separate things far apart', 'To erase something permanently now', 'To place side by side to compare', 'To exaggerate the size of things'], correctAnswer: 2 },
  { id: 'v26', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "lucid" mean?', options: ['Clear and easy to understand', 'Confused and very hard to follow', 'Extremely dark and hard to see', 'Very heavy and difficult to lift'], correctAnswer: 0 },
  { id: 'v27', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "mundane" mean?', options: ['Exciting and full of adventure', 'Extremely rare and quite unusual', 'Ordinary and lacking any excitement', 'Dangerous and filled with great risk'], correctAnswer: 2 },
  { id: 'v28', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "nonchalant" mean?', options: ['Extremely worried about all things', 'Calm and casually unconcerned now', 'Very aggressive toward other people', 'Deeply emotional about everything here'], correctAnswer: 1 },
  { id: 'v29', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "obscure" mean?', options: ['Very well-known to many people', 'Extremely bright and easy to see', 'Very recent and from modern times', 'Not well-known or hard to see'], correctAnswer: 3 },
  { id: 'v30', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "pragmatic" mean?', options: ['Focused on practical realistic results', 'Completely unrealistic in every way', 'Very emotional and not at all logical', 'Deeply philosophical and very abstract'], correctAnswer: 0 },
  { id: 'v31', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "quintessential" mean?', options: ['Completely ordinary and quite boring', 'Very small and hard to find here', 'Extremely old and no longer useful', 'The most perfect example of something'], correctAnswer: 3 },
  { id: 'v32', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "resilient" mean?', options: ['Easily broken by small amounts of pressure', 'Very soft and without any real strength', 'Extremely rigid and refusing to bend', 'Able to recover quickly from problems'], correctAnswer: 3 },
  { id: 'v25b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "ameliorate" mean?', options: ['To make a bad situation better', 'To make something much worse now', 'To destroy something beyond repair', 'To ignore a problem completely here'], correctAnswer: 0 },
  { id: 'v26b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "capricious" mean?', options: ['Very consistent and always steady', 'Extremely slow and never changing', 'Changing mood or mind suddenly often', 'Completely predictable in every way'], correctAnswer: 2 },
  { id: 'v27b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "delineate" mean?', options: ['To blur the edges of something', 'To describe or outline very precisely', 'To destroy completely and fully now', 'To ignore the details of all things'], correctAnswer: 1 },
  { id: 'v28b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "exacerbate" mean?', options: ['To make a bad situation even worse', 'To solve a serious problem quickly', 'To ignore an issue completely here', 'To create a brand new fresh problem'], correctAnswer: 0 },
  { id: 'v29b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "pernicious" mean?', options: ['Very helpful and good for others', 'Causing harm in a gradual way', 'Extremely beautiful to look at now', 'Completely harmless and very safe here'], correctAnswer: 1 },
  { id: 'v30b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "recalcitrant" mean?', options: ['Very obedient and always agreeable', 'Extremely helpful to all people here', 'Completely agreeable with all decisions', 'Stubbornly resistant to being controlled'], correctAnswer: 3 },
  { id: 'v31b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "surreptitious" mean?', options: ['Done openly for everyone to see', 'Done secretly to avoid being noticed', 'Very loud and extremely obvious now', 'Extremely bold and full of confidence'], correctAnswer: 1 },
  { id: 'v32b', module: 'vocabulary', topic: '2001-3000', difficulty: 4, questionText: 'What does the word "vindicate" mean?', options: ['To prove that someone was wrong', 'To clear someone of blame or doubt', 'To punish someone very harshly now', 'To accuse someone of doing wrong'], correctAnswer: 1 },

  // ═══ Band 3001-5000: Elite Words (16 questions) ═══
  { id: 'v33', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "sycophant" mean?', options: ['A brave and fearless warrior type', 'A person who flatters for gain', 'A talented and famous musician', 'A complex mathematical formula used'], correctAnswer: 1 },
  { id: 'v34', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "ubiquitous" mean?', options: ['Found everywhere all the time', 'Extremely rare and hard to find', 'Very tiny and nearly invisible here', 'Completely hidden from all people now'], correctAnswer: 0 },
  { id: 'v35', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "vicissitude" mean?', options: ['A stable and unchanging condition', 'A joyful and exciting celebration type', 'An unwelcome change in life events', 'A complex mathematical concept used'], correctAnswer: 2 },
  { id: 'v36', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "whimsical" mean?', options: ['Very serious and formal in manner', 'Playfully unpredictable and fanciful now', 'Extremely dangerous to be around here', 'Deeply philosophical about all of life'], correctAnswer: 1 },
  { id: 'v37', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "xenophobia" mean?', options: ['A deep love of foreign cultures', 'A strong fear of dark places here', 'A type of rare tropical plant now', 'A prejudice against foreign people'], correctAnswer: 3 },
  { id: 'v38', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "yielding" mean?', options: ['Very strong and completely rigid now', 'Flexible and giving way to pressure', 'Extremely fast and hard to catch', 'Completely dark without any light here'], correctAnswer: 1 },
  { id: 'v39', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "zealous" mean?', options: ['Lazy and lacking all motivation now', 'Very calm and quiet in all ways', 'Extremely tired all the time here', 'Full of passion and strong enthusiasm'], correctAnswer: 3 },
  { id: 'v40', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "aberration" mean?', options: ['A departure from what is normal', 'A common everyday occurrence here', 'A type of classical music style', 'A traditional cooking technique used'], correctAnswer: 0 },
  { id: 'v33b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "ephemeral" mean?', options: ['Lasting forever without any end here', 'Very strong and hard to break now', 'Extremely heavy and hard to move', 'Lasting only a very short time'], correctAnswer: 3 },
  { id: 'v34b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "laconic" mean?', options: ['Using very few words to speak', 'Very talkative and never stopping here', 'Extremely loud in all situations now', 'Deeply emotional about everything said'], correctAnswer: 0 },
  { id: 'v35b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "obfuscate" mean?', options: ['To make something much clearer now', 'To make something confusing or unclear', 'To light up a dark space brightly', 'To simplify complex ideas for people'], correctAnswer: 1 },
  { id: 'v36b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "parsimonious" mean?', options: ['Very generous with money and time', 'Extremely wealthy and living in luxury', 'Very careless with spending money now', 'Extremely unwilling to spend any money'], correctAnswer: 3 },
  { id: 'v37b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "perfunctory" mean?', options: ['Done with great care and attention', 'Done without real interest or effort', 'Very creative and full of new ideas', 'Extremely detailed and perfectly planned'], correctAnswer: 1 },
  { id: 'v38b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "sesquipedalian" mean?', options: ['Using very short and simple words', 'Very quiet and soft in all speech', 'Extremely brief and to the point', 'Using long and complex words often'], correctAnswer: 3 },
  { id: 'v39b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "truculent" mean?', options: ['Very peaceful and calm in nature', 'Eager to argue or fight with others', 'Extremely shy around other people now', 'Completely calm in all situations here'], correctAnswer: 1 },
  { id: 'v40b', module: 'vocabulary', topic: '3001-5000', difficulty: 5, questionText: 'What does the word "verisimilitude" mean?', options: ['A complete falsehood or outright lie', 'The appearance of being true or real', 'A type of modern art music style', 'A mathematical proof of a theorem'], correctAnswer: 1 },
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

export const POST = withApiProtection({ rateLimit: 'assessment' })(handler);
export const PATCH = withApiProtection({ rateLimit: 'assessment' })(handler);
