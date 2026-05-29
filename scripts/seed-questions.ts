// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Seed Questions Script
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Vocabulary Questions (8 per band × 5 bands = 40) ────────

const vocabularyQuestions = [
  // Band 1-500: Foundation Words
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "abandon" mean?', options: '["To give up completely","To hold tightly","To create something new","To move quickly"]', correctAnswer: 0, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "approach" mean?', options: '["To move away from","To come near to","To argue against","To agree with"]', correctAnswer: 1, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "brief" mean?', options: '["Very long","Extremely detailed","Short in duration","Complicated"]', correctAnswer: 2, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "convince" mean?', options: '["To confuse someone","To persuade someone","To argue loudly","To disagree with"]', correctAnswer: 1, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "eager" mean?', options: '["Reluctant","Tired","Very enthusiastic","Confused"]', correctAnswer: 2, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "frequent" mean?', options: '["Happening often","Very rare","Extremely loud","Quite soft"]', correctAnswer: 0, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "genuine" mean?', options: '["Fake","Real and authentic","Very old","Extremely small"]', correctAnswer: 1, difficulty: 1 },
  { module: 'vocabulary', topic: '1-500', questionText: 'What does the word "humble" mean?', options: '["Arrogant and proud","Not proud or arrogant","Very wealthy","Extremely tall"]', correctAnswer: 1, difficulty: 1 },

  // Band 501-1000: Common Words
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "adept" mean?', options: '["Clumsy","Highly skilled","Very lazy","Somewhat tired"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "bizarre" mean?', options: '["Very normal","Extremely strange","Somewhat tired","Quite ordinary"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "compile" mean?', options: '["To scatter around","To gather together","To tear apart","To ignore completely"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "diligent" mean?', options: '["Lazy and careless","Hardworking and careful","Quick and hasty","Slow and confused"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "eloquent" mean?', options: '["Unable to speak clearly","Fluent and persuasive in speech","Very quiet","Extremely loud"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "feasible" mean?', options: '["Impossible to do","Possible and practical","Very dangerous","Extremely expensive"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "gratitude" mean?', options: '["Anger and frustration","The quality of being thankful","Jealousy and envy","Sadness and grief"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '501-1000', questionText: 'What does the word "hostile" mean?', options: '["Very friendly","Unfriendly and aggressive","Quiet and shy","Happy and cheerful"]', correctAnswer: 1, difficulty: 2 },

  // Band 1001-2000: Intermediate Words
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "ambiguous" mean?', options: '["Very clear","Open to more than one interpretation","Extremely loud","Quite small"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "candid" mean?', options: '["Dishonest and deceptive","Truthful and straightforward","Very quiet","Extremely careful"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "deteriorate" mean?', options: '["To improve gradually","To become progressively worse","To remain unchanged","To move very quickly"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "exemplify" mean?', options: '["To hide something","To be a typical example of","To destroy completely","To ignore entirely"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "formidable" mean?', options: '["Weak and powerless","Inspiring fear or respect through power","Very small and insignificant","Extremely friendly"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "haphazard" mean?', options: '["Very carefully planned","Lacking any plan or order","Extremely dangerous","Quite beautiful"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "impeccable" mean?', options: '["Full of mistakes","Flawless and perfect","Very old","Somewhat average"]', correctAnswer: 1, difficulty: 2 },
  { module: 'vocabulary', topic: '1001-2000', questionText: 'What does the word "juxtapose" mean?', options: '["To separate completely","To place close together for contrast","To ignore entirely","To mix together thoroughly"]', correctAnswer: 1, difficulty: 2 },

  // Band 2001-3000: Advanced Words
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "aberration" mean?', options: '["A normal occurrence","A departure from what is normal","A type of musical instrument","A form of government"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "capitulate" mean?', options: '["To fight bravely","To surrender or give in","To celebrate","To investigate"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "debilitate" mean?', options: '["To strengthen considerably","To make weak and infirm","To argue persuasively","To decorate beautifully"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "ephemeral" mean?', options: '["Lasting forever","Lasting for a very short time","Extremely heavy","Very colorful"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "fastidious" mean?', options: '["Very careless","Extremely attentive to detail","Very quick","Quite relaxed"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "gregarious" mean?', options: '["Preferring solitude","Fond of company and sociable","Very aggressive","Extremely quiet"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "hegemony" mean?', options: '["A type of music","Leadership or dominance","A rare disease","An ancient building"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '2001-3000', questionText: 'What does the word "idiosyncratic" mean?', options: '["Very common and ordinary","Peculiar or individual in nature","Extremely dangerous","Quite boring"]', correctAnswer: 1, difficulty: 3 },

  // Band 3001-5000: Elite Words
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "abnegation" mean?', options: '["The act of giving something up","The process of learning","A type of celebration","A form of architecture"]', correctAnswer: 0, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "bellicose" mean?', options: '["Peaceful and calm","Demonstrating aggression and willingness to fight","Very beautiful","Extremely generous"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "convivial" mean?', options: '["Hostile and angry","Friendly and lively","Sad and depressed","Cold and distant"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "discursive" mean?', options: '["Very brief and concise","Digressing from subject to subject","Extremely formal","Quite rigid"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "equanimity" mean?', options: '["Extreme anger","Mental calmness and composure","Great excitement","Deep sadness"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "fortuitous" mean?', options: '["Very unlucky","Happening by accident or chance","Carefully planned","Extremely dangerous"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "grandiloquent" mean?', options: '["Very quiet and shy","Pompous and extravagant in language","Simple and direct","Old and outdated"]', correctAnswer: 1, difficulty: 3 },
  { module: 'vocabulary', topic: '3001-5000', questionText: 'What does the word "iconoclast" mean?', options: '["A religious leader","A person who attacks cherished beliefs","A famous artist","A military commander"]', correctAnswer: 1, difficulty: 3 },
];

// ─── Grammar Questions ────────────────────────────────────────

const grammarQuestions = [
  // Present Simple (3 questions)
  { module: 'grammar', type: 'completion', topic: 'present_simple', questionText: 'She ___ to school every day.', options: '["go","goes","going","gone"]', correctAnswer: 1, difficulty: 1 },
  { module: 'grammar', type: 'error_identification', topic: 'present_simple', questionText: 'Which sentence is correct?', options: '["He don\'t like coffee.","He doesn\'t like coffee.","He not like coffee.","He no like coffee."]', correctAnswer: 1, difficulty: 1 },
  { module: 'grammar', type: 'transformation', topic: 'present_simple', questionText: 'Transform to negative: "They play football on Sundays."', options: '["They doesn\'t play football on Sundays.","They don\'t play football on Sundays.","They not play football on Sundays.","They aren\'t play football on Sundays."]', correctAnswer: 1, difficulty: 1 },

  // Present Continuous (3 questions)
  { module: 'grammar', type: 'completion', topic: 'present_continuous', questionText: 'I ___ a book right now.', options: '["read","reads","am reading","reading"]', correctAnswer: 2, difficulty: 1 },
  { module: 'grammar', type: 'error_identification', topic: 'present_continuous', questionText: 'Which sentence is correct?', options: '["She is go to the store.","She going to the store.","She is going to the store.","She goes to the store right now."]', correctAnswer: 2, difficulty: 1 },
  { module: 'grammar', type: 'transformation', topic: 'present_continuous', questionText: 'Transform to a question: "They are watching TV."', options: '["Are they watching TV?","Do they watching TV?","Is they watching TV?","They are watching TV?"]', correctAnswer: 0, difficulty: 1 },

  // Past Simple (3 questions)
  { module: 'grammar', type: 'completion', topic: 'past_simple', questionText: 'We ___ to the cinema last night.', options: '["go","goes","went","going"]', correctAnswer: 2, difficulty: 1 },
  { module: 'grammar', type: 'error_identification', topic: 'past_simple', questionText: 'Which sentence is correct?', options: '["She did not went home.","She did not go home.","She not go home.","She don\'t went home."]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'transformation', topic: 'past_simple', questionText: 'Transform to affirmative: "He didn\'t finish his homework."', options: '["He finish his homework.","He finished his homework.","He finishing his homework.","He finishes his homework."]', correctAnswer: 1, difficulty: 2 },

  // Present Perfect (4 questions)
  { module: 'grammar', type: 'completion', topic: 'present_perfect', questionText: 'She ___ never ___ to Japan.', options: '["has / been","have / been","has / be","had / been"]', correctAnswer: 0, difficulty: 2 },
  { module: 'grammar', type: 'error_identification', topic: 'present_perfect', questionText: 'Which sentence is correct?', options: '["I have went to Paris twice.","I have gone to Paris twice.","I have go to Paris twice.","I has gone to Paris twice."]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'transformation', topic: 'present_perfect', questionText: 'Transform to present perfect: "I started learning English in 2020 (and I still learn it)."', options: '["I learn English since 2020.","I have been learning English since 2020.","I learned English since 2020.","I am learning English since 2020."]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'completion', topic: 'present_perfect', questionText: 'They ___ already ___ lunch.', options: '["have / eat","have / ate","have / eaten","has / eaten"]', correctAnswer: 2, difficulty: 2 },

  // Future Forms (3 questions)
  { module: 'grammar', type: 'completion', topic: 'future_forms', questionText: 'I think it ___ rain tomorrow.', options: '["will","is going to","shall","would"]', correctAnswer: 0, difficulty: 2 },
  { module: 'grammar', type: 'error_identification', topic: 'future_forms', questionText: 'Which sentence uses the correct future form for a planned intention?', options: '["I will visit my grandmother this weekend.","I am going to visit my grandmother this weekend.","I shall visit my grandmother this weekend.","I visit my grandmother this weekend."]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'transformation', topic: 'future_forms', questionText: 'Transform using "going to": "She will study medicine next year."', options: '["She going to study medicine next year.","She is going to study medicine next year.","She was going to study medicine next year.","She has going to study medicine next year."]', correctAnswer: 1, difficulty: 2 },

  // Conditionals (3 questions)
  { module: 'grammar', type: 'completion', topic: 'conditionals', questionText: 'If it rains, I ___ at home.', options: '["will stay","would stay","stayed","staying"]', correctAnswer: 0, difficulty: 2 },
  { module: 'grammar', type: 'error_identification', topic: 'conditionals', questionText: 'Which second conditional sentence is correct?', options: '["If I had money, I will buy a car.","If I had money, I would buy a car.","If I have money, I would buy a car.","If I would have money, I buy a car."]', correctAnswer: 1, difficulty: 3 },
  { module: 'grammar', type: 'transformation', topic: 'conditionals', questionText: 'Complete: "If I ___ you, I would apologize immediately."', options: '["am","was","were","be"]', correctAnswer: 2, difficulty: 3 },

  // Passive Voice (3 questions)
  { module: 'grammar', type: 'completion', topic: 'passive_voice', questionText: 'The book ___ by a famous author.', options: '["wrote","was written","written","writing"]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'error_identification', topic: 'passive_voice', questionText: 'Which sentence is in the correct passive form?', options: '["The cake was bake by my mother.","The cake was baked by my mother.","The cake baked by my mother.","The cake is bake by my mother."]', correctAnswer: 1, difficulty: 2 },
  { module: 'grammar', type: 'transformation', topic: 'passive_voice', questionText: 'Transform to passive: "Someone stole my bicycle."', options: '["My bicycle was stolen.","My bicycle is stolen.","My bicycle stolen.","My bicycle were stolen."]', correctAnswer: 0, difficulty: 3 },

  // Question Formation (3 questions)
  { module: 'grammar', type: 'completion', topic: 'question_formation', questionText: '___ you like coffee or tea?', options: '["Do","Does","Are","Is"]', correctAnswer: 0, difficulty: 1 },
  { module: 'grammar', type: 'error_identification', topic: 'question_formation', questionText: 'Which question is correctly formed?', options: '["Where you live?","Where do you live?","Where does you live?","Where are you live?"]', correctAnswer: 1, difficulty: 1 },
  { module: 'grammar', type: 'transformation', topic: 'question_formation', questionText: 'Form a question for the underlined word: "She visited London last summer."', options: '["Where did she visit last summer?","Where she visited last summer?","Where does she visit last summer?","Where she did visit last summer?"]', correctAnswer: 0, difficulty: 2 },
];

// ─── Main Seed Function ──────────────────────────────────────

async function main() {
  console.log('🗡️  Empire English Community — Seeding Questions...\n');

  // Clean slate: delete all existing questions
  const deleteResult = await prisma.question.deleteMany({});
  console.log(`🗑️  Deleted ${deleteResult.count} existing questions.\n`);

  // Insert vocabulary questions
  console.log('📖 Seeding vocabulary questions...');
  let vocabCount = 0;
  for (const q of vocabularyQuestions) {
    await prisma.question.create({
      data: {
        module: q.module,
        type: null,
        topic: q.topic,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        isActive: true,
      },
    });
    vocabCount++;
  }
  console.log(`   ✅ ${vocabCount} vocabulary questions seeded.\n`);

  // Insert grammar questions
  console.log('⚔️  Seeding grammar questions...');
  let grammarCount = 0;
  for (const q of grammarQuestions) {
    await prisma.question.create({
      data: {
        module: q.module,
        type: q.type,
        topic: q.topic,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        isActive: true,
      },
    });
    grammarCount++;
  }
  console.log(`   ✅ ${grammarCount} grammar questions seeded.\n`);

  // Summary
  const totalQuestions = vocabCount + grammarCount;
  console.log('═══════════════════════════════════════════');
  console.log(`🏆 TOTAL QUESTIONS SEEDED: ${totalQuestions}`);
  console.log('═══════════════════════════════════════════');
  console.log(`   📖 Vocabulary: ${vocabCount}`);
  console.log(`   ⚔️  Grammar: ${grammarCount}`);
  console.log('');

  // Verify by counting
  const dbVocab = await prisma.question.count({ where: { module: 'vocabulary' } });
  const dbGrammar = await prisma.question.count({ where: { module: 'grammar' } });
  console.log('🔍 Verification:');
  console.log(`   Vocabulary in DB: ${dbVocab}`);
  console.log(`   Grammar in DB: ${dbGrammar}`);
  console.log('\n✨ Seed complete! The trials await.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
