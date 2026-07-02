// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Listening Comprehension Passages
// TOEFL-style: Academic lectures and campus conversations
// 3 difficulty levels, 5 questions per passage
// Question types: main_idea, detail, inference, attitude, purpose
// ═══════════════════════════════════════════════════════════

export interface ListeningQuestion {
  id: string;
  type: 'main_idea' | 'detail' | 'inference' | 'attitude' | 'purpose';
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface ListeningPassage {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  format: 'lecture' | 'conversation';
  topic: string;
  transcript: string;
  wordCount: number;
  wpm: number; // words per minute for TTS speed
  questions: ListeningQuestion[];
}

// ─── Easy Passages (80-100 WPM, simpler vocabulary) ─────────

const EASY_PASSAGES: ListeningPassage[] = [
  {
    id: 'l-easy-1',
    difficulty: 'easy',
    format: 'lecture',
    title: 'Introduction to Photosynthesis',
    topic: 'Biology',
    wordCount: 140,
    wpm: 90,
    transcript: `Today we're going to talk about photosynthesis — the process by which plants make their own food. Plants use energy from sunlight to convert carbon dioxide from the air and water from the soil into glucose, which is a type of sugar. This sugar provides the energy that plants need to grow.

The process takes place mainly in the leaves, in tiny structures called chloroplasts. These contain a green pigment called chlorophyll — that's what gives leaves their green color. An important byproduct of photosynthesis is oxygen, which is released into the air.

So basically, plants take in carbon dioxide and water, use sunlight as energy, and produce glucose and oxygen. Without this process, there would be very little oxygen in our atmosphere, and most life on Earth could not exist.`,
    questions: [
      { id: 'l-easy-1-q1', type: 'main_idea', questionText: 'What is the lecture mainly about?', options: ['How animals get energy from food', 'The process plants use to make food', 'Why leaves change color in autumn', 'The structure of plant root systems'], correctAnswer: 1 },
      { id: 'l-easy-1-q2', type: 'detail', questionText: 'What gives leaves their green color?', options: ['Glucose stored in the cells', 'Chlorophyll in the chloroplasts', 'Carbon dioxide from the air', 'Water absorbed from the soil'], correctAnswer: 1 },
      { id: 'l-easy-1-q3', type: 'detail', questionText: 'What is a byproduct of photosynthesis?', options: ['Carbon dioxide is released', 'Oxygen is released into the air', 'Water is released into soil', 'Sunlight is absorbed and stored'], correctAnswer: 1 },
      { id: 'l-easy-1-q4', type: 'inference', questionText: 'What would happen without photosynthesis?', options: ['Plants would grow faster than normal', 'The atmosphere would lack sufficient oxygen', 'Animals would produce their own food instead', 'The sun would become less powerful over time'], correctAnswer: 1 },
      { id: 'l-easy-1-q5', type: 'purpose', questionText: 'Why does the professor mention chloroplasts?', options: ['To explain where photosynthesis takes place', 'To describe how plants reproduce themselves', 'To compare plants with animal cells directly', 'To show why some plants grow in darkness'], correctAnswer: 0 },
    ],
  },
  {
    id: 'l-easy-2',
    difficulty: 'easy',
    format: 'conversation',
    title: 'Registering for Classes',
    topic: 'Campus Life',
    wordCount: 150,
    wpm: 95,
    transcript: `Student: Hi, I'm trying to register for Professor Chen's biology class, but the system says it's full. Is there anything I can do?

Advisor: Well, the class is at capacity right now with 35 students. But there are a few options. First, you could add yourself to the waitlist. If anyone drops the course in the first two weeks, you'd automatically be enrolled.

Student: How likely is that to happen?

Advisor: Honestly, about 3 to 5 students usually drop each semester, so your chances are pretty good. Your second option is to email Professor Chen directly and ask for permission to exceed the class limit. Some professors allow one or two extra students.

Student: Oh, that's good to know. And if neither works?

Advisor: Then you could take the same course with Professor Martinez — she teaches it on Tuesdays and Thursdays. Same material, just different time slot. That section still has 8 open seats.

Student: I think I'll try the waitlist first and email the professor. Thanks!`,
    questions: [
      { id: 'l-easy-2-q1', type: 'main_idea', questionText: 'What is the main purpose of this conversation?', options: ['The student is complaining about a grade', 'The student needs help registering for a full class', 'The advisor is recommending a new major', 'The student wants to drop a course immediately'], correctAnswer: 1 },
      { id: 'l-easy-2-q2', type: 'detail', questionText: 'How many students does Professor Chen\'s class currently hold?', options: ['25 students at capacity', '30 students at capacity', '35 students at capacity', '40 students at capacity'], correctAnswer: 2 },
      { id: 'l-easy-2-q3', type: 'detail', questionText: 'How many students typically drop the course each semester?', options: ['1 to 2 students on average', '3 to 5 students on average', '8 to 10 students on average', '15 to 20 students on average'], correctAnswer: 1 },
      { id: 'l-easy-2-q4', type: 'inference', questionText: 'What can be inferred about the student\'s schedule?', options: ['The student cannot attend Tuesday/Thursday classes easily', 'The student prefers Professor Chen over Professor Martinez', 'The student has already taken biology once before', 'The student plans to change their major soon'], correctAnswer: 1 },
      { id: 'l-easy-2-q5', type: 'attitude', questionText: 'What is the advisor\'s attitude toward the student\'s chances on the waitlist?', options: ['Very pessimistic about the chances of getting in', 'Cautiously optimistic that it will likely work out', 'Completely indifferent to the student situation', 'Angry that the system allowed this problem to happen'], correctAnswer: 1 },
    ],
  },
  {
    id: 'l-easy-3',
    difficulty: 'easy',
    format: 'lecture',
    title: 'The Water Cycle Explained',
    topic: 'Earth Science',
    wordCount: 135,
    wpm: 85,
    transcript: `Let me explain the water cycle in simple terms. Water from oceans, lakes, and rivers is heated by the sun and turns into vapor — that's evaporation. This water vapor rises into the atmosphere where it cools down and forms clouds — we call that condensation.

When the clouds become heavy with water droplets, the water falls back to Earth as rain, snow, or hail — that's precipitation. Some of this water flows into rivers and streams, eventually returning to the ocean. Some soaks into the ground and becomes groundwater.

The important thing to understand is that this is a continuous cycle. The same water has been cycling through this system for billions of years. The water you drink today might have once been part of a glacier, a cloud, or even a dinosaur. The total amount of water on Earth stays roughly the same — it just changes form and location.`,
    questions: [
      { id: 'l-easy-3-q1', type: 'main_idea', questionText: 'What is the lecture mainly explaining?', options: ['How to purify water for drinking', 'The continuous cycle of water on Earth', 'Why some areas get more rain than others', 'The chemical composition of water molecules'], correctAnswer: 1 },
      { id: 'l-easy-3-q2', type: 'detail', questionText: 'What causes evaporation according to the lecture?', options: ['Wind blowing across water surfaces', 'The sun heating water in oceans and lakes', 'Cold temperatures freezing water into ice', 'Gravity pulling water into the ground below'], correctAnswer: 1 },
      { id: 'l-easy-3-q3', type: 'vocabulary', questionText: 'When the professor says "condensation," what process is being described?', options: ['Water vapor cooling and forming clouds', 'Water falling from clouds as rain', 'Water soaking into the ground below', 'Water flowing from rivers into oceans'], correctAnswer: 0 },
      { id: 'l-easy-3-q4', type: 'inference', questionText: 'What does the professor imply about the total water on Earth?', options: ['It is slowly decreasing every year', 'It remains approximately constant over time', 'It is rapidly increasing due to melting ice', 'It was much greater during dinosaur times'], correctAnswer: 1 },
      { id: 'l-easy-3-q5', type: 'purpose', questionText: 'Why does the professor mention dinosaurs?', options: ['To explain how dinosaurs became extinct', 'To illustrate how old the water cycle is', 'To argue that water quality has declined', 'To suggest students should study paleontology'], correctAnswer: 1 },
    ],
  },
];

// ─── Medium Passages (120-140 WPM, academic vocabulary) ─────

const MEDIUM_PASSAGES: ListeningPassage[] = [
  {
    id: 'l-med-1',
    difficulty: 'medium',
    format: 'lecture',
    title: 'The Psychology of First Impressions',
    topic: 'Psychology',
    wordCount: 185,
    wpm: 130,
    transcript: `Research in social psychology has consistently shown that first impressions form remarkably quickly — often within the first seven seconds of meeting someone. What's perhaps more surprising is how difficult these initial judgments are to change, even when presented with contradictory evidence later.

This phenomenon is known as the "primacy effect." Once we form an impression of someone, we tend to interpret subsequent information in ways that confirm our initial assessment. If we decide someone is intelligent in the first few seconds, we'll tend to interpret their future statements as evidence of intelligence, even when those statements are ambiguous.

The cues we rely on are largely nonverbal. Studies show that approximately 55 percent of a first impression is based on appearance and body language, 38 percent on tone of voice, and only 7 percent on the actual words spoken. This is why people who maintain eye contact, smile genuinely, and adopt an open posture are consistently rated more favorably — regardless of what they actually say.

Understanding this bias is crucial in professional contexts. Job interviews, client meetings, and networking events are all situations where the primacy effect operates powerfully. Some researchers have even found that interview outcomes can be predicted with 70 percent accuracy based solely on the first 30 seconds.`,
    questions: [
      { id: 'l-med-1-q1', type: 'main_idea', questionText: 'What is the lecture primarily about?', options: ['How to improve your public speaking ability', 'How first impressions form and why they persist', 'The difference between introverts and extroverts', 'Why body language varies across different cultures'], correctAnswer: 1 },
      { id: 'l-med-1-q2', type: 'detail', questionText: 'According to the lecture, what percentage of first impressions is based on words spoken?', options: ['7 percent of the overall impression', '38 percent of the overall impression', '55 percent of the overall impression', '70 percent of the overall impression'], correctAnswer: 0 },
      { id: 'l-med-1-q3', type: 'vocabulary', questionText: 'What does "primacy effect" refer to in this context?', options: ['The tendency for later information to be most memorable', 'The tendency for first information to dominate our judgments', 'The tendency to forget all information equally over time', 'The tendency to only remember negative interactions with others'], correctAnswer: 1 },
      { id: 'l-med-1-q4', type: 'inference', questionText: 'Based on the lecture, what would the professor likely advise before a job interview?', options: ['Focus only on what you plan to say during questions', 'Pay attention to appearance and nonverbal communication', 'Arrive late to appear confident and important to them', 'Avoid eye contact to seem mysterious and interesting'], correctAnswer: 1 },
      { id: 'l-med-1-q5', type: 'purpose', questionText: 'Why does the professor mention that interview outcomes can be predicted in 30 seconds?', options: ['To argue that interviews are a waste of time', 'To emphasize how powerful and fast first impressions are', 'To suggest that hiring practices are completely fair', 'To encourage students to become career counselors'], correctAnswer: 1 },
    ],
  },
  {
    id: 'l-med-2',
    difficulty: 'medium',
    format: 'conversation',
    title: 'Discussing a Research Paper',
    topic: 'Academic Life',
    wordCount: 175,
    wpm: 125,
    transcript: `Professor: So, Sarah, I've read your draft on renewable energy adoption in developing nations. You've gathered good data, but I have some concerns about your methodology.

Student: Oh, what specifically?

Professor: Well, you've relied almost entirely on government statistics for your analysis. The problem is that government data in some of these countries may be unreliable or politically motivated. Have you considered triangulating with independent sources?

Student: I hadn't thought of that. What kind of sources would you suggest?

Professor: NGO reports, academic studies from local universities, and satellite data can all provide independent verification. For example, the International Energy Agency publishes independent assessments that you could cross-reference with the government figures.

Student: That makes sense. Should I redo the entire analysis?

Professor: Not necessarily. I'd suggest adding a limitations section acknowledging the data quality concern, and then supplementing your key findings with at least one independent source for each country. That should be sufficient for this stage.

Student: Okay, I'll revise it this week. Should I also expand the literature review?

Professor: Yes, actually. Your review is thin on recent publications — there have been several major studies in the last two years you should incorporate.`,
    questions: [
      { id: 'l-med-2-q1', type: 'main_idea', questionText: 'What is the main purpose of this conversation?', options: ['The professor is assigning a new research topic', 'The professor is giving feedback on a research draft', 'The student is requesting an extension on her deadline', 'The student is asking about graduation requirements'], correctAnswer: 1 },
      { id: 'l-med-2-q2', type: 'detail', questionText: 'What is the professor\'s main concern about the paper?', options: ['The topic is not interesting or relevant enough', 'The paper relies too heavily on potentially unreliable government data', 'The paper is too long and needs to be shortened', 'The writing quality and grammar need significant improvement'], correctAnswer: 1 },
      { id: 'l-med-2-q3', type: 'detail', questionText: 'What does the professor suggest as an independent source?', options: ['Social media posts from local communities', 'International Energy Agency reports and assessments', 'Personal interviews with government officials', 'Television news broadcasts from the countries studied'], correctAnswer: 1 },
      { id: 'l-med-2-q4', type: 'inference', questionText: 'What can be inferred about the student\'s literature review?', options: ['It includes too many sources from the last decade', 'It is missing important recent research publications', 'It focuses too much on developed nations only', 'It contains factual errors that need correction now'], correctAnswer: 1 },
      { id: 'l-med-2-q5', type: 'attitude', questionText: 'What is the professor\'s overall attitude toward the student\'s work?', options: ['Disappointed and considering failing the paper entirely', 'Constructive — sees promise but identifies specific improvements needed', 'Completely satisfied and ready to accept the draft as final', 'Indifferent and uninterested in the student research topic'], correctAnswer: 1 },
    ],
  },
];

// ─── Hard Passages (150-170 WPM, complex academic content) ──

const HARD_PASSAGES: ListeningPassage[] = [
  {
    id: 'l-hard-1',
    difficulty: 'hard',
    format: 'lecture',
    title: 'Behavioral Economics: The Endowment Effect',
    topic: 'Economics & Psychology',
    wordCount: 220,
    wpm: 155,
    transcript: `One of the most robust findings in behavioral economics is the endowment effect — the tendency for people to value things more highly simply because they own them. In a classic experiment by Kahneman, Knetsch, and Thaler, participants were randomly given coffee mugs. When asked how much they would sell the mug for, owners demanded approximately twice what non-owners were willing to pay for the identical item.

This contradicts standard economic theory, which assumes that a person's valuation of an object should be independent of whether they currently possess it. According to rational choice theory, there should be no difference between the buying price and selling price. Yet the endowment effect has been replicated hundreds of times across different cultures and product categories.

The dominant explanation involves loss aversion — a core principle of prospect theory developed by Kahneman and Tversky. Losses are psychologically approximately twice as painful as equivalent gains are pleasurable. When you own something, giving it up is experienced as a loss, which feels more significant than the gain of acquiring the same item would feel.

The implications extend far beyond coffee mugs. The endowment effect helps explain why homeowners often set unrealistically high asking prices, why employees resist giving up existing benefits even for objectively better alternatives, and why nations struggle to make territorial concessions in peace negotiations. Once something is "ours," we overvalue it — a bias that shapes economic behavior at every scale from household decisions to international diplomacy.`,
    questions: [
      { id: 'l-hard-1-q1', type: 'main_idea', questionText: 'What is the lecture primarily about?', options: ['How coffee mug production has changed over time', 'The psychological tendency to overvalue things we already own', 'Why standard economic theory is always perfectly correct', 'The differences between behavioral and classical economics overall'], correctAnswer: 1 },
      { id: 'l-hard-1-q2', type: 'detail', questionText: 'In the coffee mug experiment, how did sellers\' prices compare to buyers\'?', options: ['Sellers asked for half what buyers offered', 'Sellers asked approximately the same as buyers offered', 'Sellers asked approximately twice what buyers offered', 'Sellers asked approximately ten times what buyers offered'], correctAnswer: 2 },
      { id: 'l-hard-1-q3', type: 'vocabulary', questionText: 'What does "loss aversion" mean as used in the lecture?', options: ['A preference for taking large financial risks', 'Losses feeling more painful than equivalent gains feel good', 'The inability to make any decisions under uncertainty', 'A tendency to always choose the cheapest available option'], correctAnswer: 1 },
      { id: 'l-hard-1-q4', type: 'purpose', questionText: 'Why does the professor mention homeowners, employees, and nations?', options: ['To show the endowment effect only applies in laboratories', 'To demonstrate that the effect operates at many different scales', 'To argue that economics cannot explain real-world behavior', 'To suggest that people should never sell property they own'], correctAnswer: 1 },
      { id: 'l-hard-1-q5', type: 'inference', questionText: 'Based on the lecture, what would behavioral economists predict about salary negotiations?', options: ['Employees would easily accept pay cuts for more vacation time', 'Employees would overvalue their current salary compared to new offers', 'Employees would always choose the highest possible salary offer', 'Employees would ignore money and focus only on job satisfaction'], correctAnswer: 1 },
    ],
  },
];

// ─── Export ─────────────────────────────────────────────────

export const ALL_LISTENING_PASSAGES: ListeningPassage[] = [
  ...EASY_PASSAGES,
  ...MEDIUM_PASSAGES,
  ...HARD_PASSAGES,
];

export function getListeningSet(): ListeningPassage[] {
  // Select 1 passage from each difficulty for a balanced test
  const easy = EASY_PASSAGES[Math.floor(Math.random() * EASY_PASSAGES.length)];
  const medium = MEDIUM_PASSAGES[Math.floor(Math.random() * MEDIUM_PASSAGES.length)];
  const hard = HARD_PASSAGES[Math.floor(Math.random() * HARD_PASSAGES.length)];
  return [easy, medium, hard];
}

// Stats:
// Easy: 3 passages (2 lectures + 1 conversation)
// Medium: 2 passages (1 lecture + 1 conversation)
// Hard: 1 passage (1 lecture)
// Total: 6 passages, 30 questions
// Per test: 3 passages × 5 questions = 15 questions
// Unique combinations: 3 × 2 × 1 = 6 (expand in future)
// Score: 0-30 TOEFL scale
