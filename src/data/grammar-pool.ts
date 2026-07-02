// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Grammar Question Pool
// 100+ questions across 8 grammatical topics
// Question types: completion, error identification, transformation, sentence improvement
// ═══════════════════════════════════════════════════════════

import type { QuestionPoolItem } from '@/services/assessment-engine';

// ─── Present Simple (12 questions) ──────────────────────────

const PRESENT_SIMPLE: QuestionPoolItem[] = [
  { id: 'g1', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },
  { id: 'g2', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ["He don't like coffee", "He doesn't likes coffee", "He doesn't like coffee", 'He not like coffee'], correctAnswer: 2 },
  { id: 'g3', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to negative: "They play football on Sundays."', options: ["They doesn't play football on Sundays", "They don't play football on Sundays", 'They not play football on Sundays', "They aren't play football on Sundays"], correctAnswer: 1 },
  { id: 'g1b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Water _____ at 100 degrees Celsius.', options: ['boil', 'boils', 'boiling', 'boiled'], correctAnswer: 1 },
  { id: 'g2b', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She have two brothers', 'She has two brothers', 'She haves two brothers', 'She having two brothers'], correctAnswer: 1 },
  { id: 'g3b', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Transform to question: "He works in a hospital."', options: ['Does he works in a hospital?', 'Do he work in a hospital?', 'Does he work in a hospital?', 'He works in a hospital?'], correctAnswer: 2 },
  // New additions
  { id: 'g1c', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'The sun _____ in the east every morning.', options: ['rise', 'rises', 'rising', 'risen'], correctAnswer: 1 },
  { id: 'g2c', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Find the error: "My brother don\'t understand the question."', options: ['My brother', "don't", 'understand', 'the question'], correctAnswer: 1 },
  { id: 'g3c', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Which sentence uses the present simple correctly?', options: ['I am go to work daily', 'She is speaks English well', 'They usually eat lunch at noon', 'He are working every day'], correctAnswer: 2 },
  { id: 'g4c', module: 'grammar', topic: 'present_simple', difficulty: 1, questionText: 'My parents _____ in a small town near the coast.', options: ['lives', 'live', 'living', 'is living'], correctAnswer: 1 },
  { id: 'g5c', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'Choose the best sentence improvement: "She don\'t go to the gym."', options: ["She doesn't go to the gym", "She isn't go to the gym", "She not goes to the gym", "She don't goes to the gym"], correctAnswer: 0 },
  { id: 'g6c', module: 'grammar', topic: 'present_simple', difficulty: 2, questionText: 'The Earth _____ around the Sun once every year.', options: ['travel', 'travels', 'is traveling', 'traveled'], correctAnswer: 1 },
];


// ─── Present Continuous (12 questions) ──────────────────────

const PRESENT_CONTINUOUS: QuestionPoolItem[] = [
  { id: 'g4', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'I _____ reading a book right now.', options: ['am', 'is', 'are', 'be'], correctAnswer: 0 },
  { id: 'g5', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['She is work at the office', 'She is working at the office', 'She working at the office', 'She are working at the office'], correctAnswer: 1 },
  { id: 'g6', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to question: "They are watching a movie."', options: ['Are they watching a movie?', 'Do they watching a movie?', 'Is they watching a movie?', 'They are watching a movie?'], correctAnswer: 0 },
  { id: 'g4b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'The children _____ in the garden at the moment.', options: ['plays', 'are playing', 'is playing', 'play'], correctAnswer: 1 },
  { id: 'g5b', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Which sentence is correct?', options: ['He is run in the park', 'He is running in the park', 'He running in the park', 'He runs in the park right now'], correctAnswer: 1 },
  { id: 'g6b', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Transform to negative: "She is writing a letter."', options: ["She doesn't writing a letter", "She isn't writing a letter", 'She not writing a letter', "She don't writing a letter"], correctAnswer: 1 },
  { id: 'g4c', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Look! The baby _____ to walk for the first time.', options: ['tries', 'is trying', 'try', 'trying'], correctAnswer: 1 },
  { id: 'g5c', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Find the error: "We is waiting for the bus right now."', options: ['We', 'is', 'waiting', 'right now'], correctAnswer: 1 },
  { id: 'g6c', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Which verb CANNOT be used in present continuous?', options: ['run', 'eat', 'know', 'write'], correctAnswer: 2 },
  { id: 'g7c', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: '"Be quiet! The baby _____." Choose the correct form.', options: ['sleeps', 'is sleeping', 'sleep', 'slept'], correctAnswer: 1 },
  { id: 'g8c', module: 'grammar', topic: 'present_continuous', difficulty: 1, questionText: 'Right now, my sister _____ dinner in the kitchen.', options: ['cooks', 'is cooking', 'cook', 'cooked'], correctAnswer: 1 },
  { id: 'g9c', module: 'grammar', topic: 'present_continuous', difficulty: 2, questionText: 'Which sentence is NOT correct?', options: ['They are studying for the exam', 'She is wanting a new car', 'I am learning Arabic this year', 'He is working from home today'], correctAnswer: 1 },
];


// ─── Past Simple (12 questions) ─────────────────────────────

const PAST_SIMPLE: QuestionPoolItem[] = [
  { id: 'g7', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'We _____ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2 },
  { id: 'g8', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ["He didn't went to school", "He didn't go to school", 'He not went to school', "He don't went to school"], correctAnswer: 1 },
  { id: 'g9', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to question: "She bought a new car."', options: ['Did she bought a new car?', 'Does she buy a new car?', 'Did she buy a new car?', 'Was she buy a new car?'], correctAnswer: 2 },
  { id: 'g7b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'They _____ a great time at the party last night.', options: ['have', 'has', 'had', 'having'], correctAnswer: 2 },
  { id: 'g8b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Which sentence is correct?', options: ["She didn't saw the movie", "She didn't see the movie", 'She not saw the movie', "She don't saw the movie"], correctAnswer: 1 },
  { id: 'g9b', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Transform to negative: "He wrote a letter."', options: ["He didn't wrote a letter", "He didn't write a letter", 'He not wrote a letter', "He don't wrote a letter"], correctAnswer: 1 },
  { id: 'g7c', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'The meeting _____ at 9 AM and finished at noon.', options: ['starts', 'started', 'start', 'starting'], correctAnswer: 1 },
  { id: 'g8c', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Find the error: "Yesterday I goed to the supermarket."', options: ['Yesterday', 'I', 'goed', 'to the supermarket'], correctAnswer: 2 },
  { id: 'g9c', module: 'grammar', topic: 'past_simple', difficulty: 3, questionText: 'Which sentence correctly uses the irregular past?', options: ['She bringed the books yesterday', 'He teached English for five years', 'They caught the early train this morning', 'I buyed a new phone last week'], correctAnswer: 2 },
  { id: 'g10c', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: '"When _____ you last see him?" Choose the correct word.', options: ['do', 'did', 'does', 'are'], correctAnswer: 1 },
  { id: 'g11c', module: 'grammar', topic: 'past_simple', difficulty: 3, questionText: 'The ancient Romans _____ a vast empire across Europe.', options: ['build', 'builded', 'built', 'building'], correctAnswer: 2 },
  { id: 'g12c', module: 'grammar', topic: 'past_simple', difficulty: 2, questionText: 'Choose the best improvement: "I didn\'t knew the answer."', options: ["I didn't know the answer", "I don't knew the answer", "I wasn't know the answer", "I not know the answer"], correctAnswer: 0 },
];

// ─── Present Perfect (14 questions) ─────────────────────────

const PRESENT_PERFECT: QuestionPoolItem[] = [
  { id: 'g10', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'I _____ already finished my homework.', options: ['has', 'have', 'had', 'having'], correctAnswer: 1 },
  { id: 'g11', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'She _____ never been to Japan.', options: ['have', 'has', 'had', 'having'], correctAnswer: 1 },
  { id: 'g12', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I have went to Paris twice', 'I have go to Paris twice', 'I have been to Paris twice', 'I has been to Paris twice'], correctAnswer: 2 },
  { id: 'g13', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Transform to negative: "They have seen that movie."', options: ["They haven't saw that movie", "They haven't seen that movie", "They didn't seen that movie", "They hasn't seen that movie"], correctAnswer: 1 },
  { id: 'g10b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'How long _____ you lived here?', options: ['has', 'have', 'had', 'do'], correctAnswer: 1 },
  { id: 'g11b', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which sentence uses the present perfect correctly?', options: ['I have visit London last year', 'I have visited London three times', 'I has visited London', 'I have visiting London now'], correctAnswer: 1 },
  { id: 'g10c', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'She _____ in this company since 2018.', options: ['works', 'worked', 'has worked', 'is working'], correctAnswer: 2 },
  { id: 'g11c', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Find the error: "He has went to the store already."', options: ['He', 'has went', 'to the store', 'already'], correctAnswer: 1 },
  { id: 'g12c', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'Which word signals present perfect, NOT past simple?', options: ['yesterday', 'last week', 'already', 'two days ago'], correctAnswer: 2 },
  { id: 'g13c', module: 'grammar', topic: 'present_perfect', difficulty: 4, questionText: '"I _____ this book. You can borrow it." (finished reading)', options: ["'ve read", "'ve been reading", 'read', 'was reading'], correctAnswer: 0 },
  { id: 'g14c', module: 'grammar', topic: 'present_perfect', difficulty: 4, questionText: 'Choose the correct sentence:', options: ['I have seen him yesterday', 'I saw him yesterday', 'I have saw him yesterday', 'I did seen him yesterday'], correctAnswer: 1 },
  { id: 'g15c', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'They _____ just arrived at the airport.', options: ['has', 'have', 'had', 'are'], correctAnswer: 1 },
  { id: 'g16c', module: 'grammar', topic: 'present_perfect', difficulty: 4, questionText: '"_____ you ever tried Japanese food?"', options: ['Did', 'Have', 'Do', 'Are'], correctAnswer: 1 },
  { id: 'g17c', module: 'grammar', topic: 'present_perfect', difficulty: 3, questionText: 'We _____ known each other for over ten years now.', options: ['has', 'have', 'are', 'did'], correctAnswer: 1 },
];


// ─── Future Forms (12 questions) ────────────────────────────

const FUTURE_FORMS: QuestionPoolItem[] = [
  { id: 'g14', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'I _____ visit my grandmother next week.', options: ['will', 'did', 'do', 'was'], correctAnswer: 0 },
  { id: 'g15', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence uses the correct future form?', options: ['I will going to the store', 'I am going to go to the store', 'I will goes to the store', 'I going to the store tomorrow'], correctAnswer: 1 },
  { id: 'g16', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform using "going to": "She will study medicine."', options: ['She is going study medicine', 'She is going to study medicine', 'She going to studies medicine', 'She was going to study medicine'], correctAnswer: 1 },
  { id: 'g14b', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'Look at those clouds! It _____ rain soon.', options: ['will', 'is going to', 'shall', 'would'], correctAnswer: 1 },
  { id: 'g15b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which sentence is correct?', options: ['I will to call you tomorrow', 'I will call you tomorrow', 'I will calling you tomorrow', 'I will called you tomorrow'], correctAnswer: 1 },
  { id: 'g16b', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Transform to future with "will": "She travels abroad."', options: ['She will travel abroad', 'She will travels abroad', 'She will traveling abroad', 'She will traveled abroad'], correctAnswer: 0 },
  { id: 'g14c', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: '"The train _____ at 6:30 PM." (scheduled timetable)', options: ['will leave', 'leaves', 'is going to leave', 'leaving'], correctAnswer: 1 },
  { id: 'g15c', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: '"I think she _____ the exam." (prediction without evidence)', options: ['passes', 'is going to pass', 'will pass', 'is passing'], correctAnswer: 2 },
  { id: 'g16c', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Find the error: "They will going to the concert tonight."', options: ['They', 'will going', 'to the concert', 'tonight'], correctAnswer: 1 },
  { id: 'g17d', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: '"Don\'t worry, I _____ you with the project." (spontaneous offer)', options: ['am going to help', 'will help', 'help', 'am helping'], correctAnswer: 1 },
  { id: 'g18d', module: 'grammar', topic: 'future_forms', difficulty: 2, questionText: 'This time next week, we _____ on a beach in Spain.', options: ['will be lying', 'will lie', 'are lying', 'lie'], correctAnswer: 0 },
  { id: 'g19d', module: 'grammar', topic: 'future_forms', difficulty: 3, questionText: 'Which future form shows a planned decision made earlier?', options: ["I'll have tea, please", "I'm going to start a business", 'The match starts at 8 PM', 'I think it will rain'], correctAnswer: 1 },
];

// ─── Conditionals (12 questions) ────────────────────────────

const CONDITIONALS: QuestionPoolItem[] = [
  { id: 'g17', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If it rains, I _____ stay at home.', options: ['will', 'would', 'should', 'could'], correctAnswer: 0 },
  { id: 'g18', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I _____ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2 },
  { id: 'g19', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which conditional sentence is correct?', options: ['If I will study, I pass the exam', 'If I study, I will pass the exam', 'If I studied, I will pass the exam', 'If I study, I would pass the exam'], correctAnswer: 1 },
  { id: 'g17b', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If she _____ harder, she would have passed the exam.', options: ['studied', 'had studied', 'studies', 'would study'], correctAnswer: 1 },
  { id: 'g18b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'If I were you, I _____ accept the offer.', options: ['will', 'would', 'shall', 'can'], correctAnswer: 1 },
  { id: 'g19b', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which sentence is a correct third conditional?', options: ['If I had known, I would have helped', 'If I knew, I would help', 'If I know, I will help', 'If I would know, I help'], correctAnswer: 0 },
  { id: 'g17c', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'If you heat water to 100°C, it _____. (zero conditional)', options: ['will boil', 'would boil', 'boils', 'boiled'], correctAnswer: 2 },
  { id: 'g18c', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Find the error: "If I would have money, I would buy a house."', options: ['If', 'would have', 'I would', 'buy a house'], correctAnswer: 1 },
  { id: 'g19c', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: '"If she _____ the bus, she wouldn\'t have been late." (3rd conditional)', options: ["didn't miss", "hadn't missed", "wouldn't miss", "hasn't missed"], correctAnswer: 1 },
  { id: 'g20d', module: 'grammar', topic: 'conditionals', difficulty: 3, questionText: 'Unless you hurry, you _____ the flight.', options: ['miss', 'will miss', 'would miss', 'missed'], correctAnswer: 1 },
  { id: 'g21d', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: 'Which type of conditional is: "If I won the lottery, I would quit my job"?', options: ['Zero conditional', 'First conditional', 'Second conditional', 'Third conditional'], correctAnswer: 2 },
  { id: 'g22d', module: 'grammar', topic: 'conditionals', difficulty: 4, questionText: '"I wish I _____ speak French." What form is needed?', options: ['can', 'could', 'will', 'am able to'], correctAnswer: 1 },
];


// ─── Passive Voice (12 questions) ───────────────────────────

const PASSIVE_VOICE: QuestionPoolItem[] = [
  { id: 'g20', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The book _____ by the students last year.', options: ['was read', 'is read', 'read', 'reading'], correctAnswer: 0 },
  { id: 'g21', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The chef cooked the meal', 'The meal was cooked by the chef', 'The chef is cooking the meal', 'The chef cooks every day'], correctAnswer: 1 },
  { id: 'g22', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "Someone stole my bicycle."', options: ['My bicycle was stolen', 'My bicycle is stolen', 'My bicycle stole', 'My bicycle were stolen'], correctAnswer: 0 },
  { id: 'g20b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'The new bridge _____ next year.', options: ['will build', 'will be built', 'is building', 'built'], correctAnswer: 1 },
  { id: 'g21b', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'Which sentence is in the passive voice?', options: ['The company produces cars', 'Cars are produced by the company', 'The company is producing cars', 'The company will produce cars'], correctAnswer: 1 },
  { id: 'g22b', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "They are painting the house."', options: ['The house is being painted', 'The house was painted', 'The house is painted', 'The house painted'], correctAnswer: 0 },
  { id: 'g20c', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: 'English _____ in many countries around the world.', options: ['speaks', 'is spoken', 'is speaking', 'spoke'], correctAnswer: 1 },
  { id: 'g21c', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Transform to passive: "The government has approved the new law."', options: ['The new law has been approved', 'The new law is approved', 'The new law was approved', 'The new law has approved'], correctAnswer: 0 },
  { id: 'g22c', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Find the error: "The homework must to be completed by Friday."', options: ['The homework', 'must to be', 'completed', 'by Friday'], correctAnswer: 1 },
  { id: 'g23d', module: 'grammar', topic: 'passive_voice', difficulty: 3, questionText: '"The Mona Lisa _____ by millions of tourists every year."', options: ['visits', 'is visited', 'visited', 'has visited'], correctAnswer: 1 },
  { id: 'g24d', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: 'Which sentence CANNOT be converted to passive?', options: ['She wrote a letter', 'He arrived late', 'They built the bridge', 'Someone broke the window'], correctAnswer: 1 },
  { id: 'g25d', module: 'grammar', topic: 'passive_voice', difficulty: 4, questionText: '"The suspect _____ by the police at 3 AM." (past passive)', options: ['arrested', 'was arrested', 'is arrested', 'has arrested'], correctAnswer: 1 },
];

// ─── Question Formation (12 questions) ──────────────────────

const QUESTION_FORMATION: QuestionPoolItem[] = [
  { id: 'g23', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "The empire was founded in 1453."', options: ['When was the empire founded?', 'When the empire was founded?', 'When did the empire founded?', 'When the empire did founded?'], correctAnswer: 0 },
  { id: 'g24', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "She speaks three languages."', options: ['How many languages does she speak?', 'How many languages do she speak?', 'How many languages she speaks?', 'How many languages she does speak?'], correctAnswer: 0 },
  { id: 'g25', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['Where you are going?', 'Where are you going?', 'Where you going?', 'Where going you?'], correctAnswer: 1 },
  { id: 'g23b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "He has been working here for five years."', options: ['How long has he been working here?', 'How long he has been working here?', 'How long have he been working here?', 'How long he been working here?'], correctAnswer: 0 },
  { id: 'g24b', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Form a question: "They will arrive tomorrow."', options: ['When will they arrive?', 'When they will arrive?', 'When do they arrive?', 'When they arrive?'], correctAnswer: 0 },
  { id: 'g25b', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: 'Which question is correctly formed?', options: ['What time the train leaves?', 'What time does the train leave?', 'What time the train does leave?', 'What time leave the train?'], correctAnswer: 1 },
  { id: 'g23c', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: '"_____ did you choose this university?"', options: ['What', 'Why', 'When', 'Where'], correctAnswer: 1 },
  { id: 'g24c', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Which is a correct indirect question?', options: ['Can you tell me where is the bank?', 'Can you tell me where the bank is?', 'Can you tell me where does the bank?', 'Can you tell me where the bank?'], correctAnswer: 1 },
  { id: 'g25c', module: 'grammar', topic: 'question_formation', difficulty: 2, questionText: '"_____ book is this?" — "It\'s mine."', options: ['Who', 'Whose', 'Which', 'What'], correctAnswer: 1 },
  { id: 'g26d', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: 'Find the error: "Where does she lives now?"', options: ['Where', 'does', 'she', 'lives'], correctAnswer: 3 },
  { id: 'g27d', module: 'grammar', topic: 'question_formation', difficulty: 3, questionText: '"_____ you rather have tea or coffee?"', options: ['Do', 'Would', 'Are', 'Will'], correctAnswer: 1 },
  { id: 'g28d', module: 'grammar', topic: 'question_formation', difficulty: 4, questionText: 'Which is a correct tag question?', options: ["She can swim, doesn't she?", "She can swim, can't she?", "She can swim, isn't she?", "She can swim, can she?"], correctAnswer: 1 },
];

// ─── Export Combined Pool ────────────────────────────────────

export const GRAMMAR_POOL: QuestionPoolItem[] = [
  ...PRESENT_SIMPLE,
  ...PRESENT_CONTINUOUS,
  ...PAST_SIMPLE,
  ...PRESENT_PERFECT,
  ...FUTURE_FORMS,
  ...CONDITIONALS,
  ...PASSIVE_VOICE,
  ...QUESTION_FORMATION,
];

// Pool stats:
// Present Simple:      12 questions
// Present Continuous:  12 questions
// Past Simple:         12 questions
// Present Perfect:     14 questions
// Future Forms:        12 questions
// Conditionals:        12 questions
// Passive Voice:       12 questions
// Question Formation:  12 questions
// TOTAL: 98 questions
// Each test pulls 25 (3-4 per topic) = 4 retakes before repeats
