// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Speaking Trial Prompts (TOEFL-style)
// 4 task types with multiple prompts each
// ═══════════════════════════════════════════════════════════

// ─── Task 1: Read Aloud (Academic passages) ─────────────────

export const READ_ALOUD_PASSAGES = [
  "Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures are causing sea levels to increase, weather patterns to shift, and ecosystems to collapse. Scientists warn that without immediate action to reduce greenhouse gas emissions, the consequences will be irreversible within the coming decades.",
  "The development of artificial intelligence has raised fundamental questions about the nature of human consciousness and creativity. While machines can now compose music, write poetry, and create visual art, philosophers continue to debate whether these outputs represent genuine creativity or merely sophisticated pattern recognition.",
  "Universal access to education remains one of the most effective strategies for reducing poverty and promoting economic growth. Research consistently shows that each additional year of schooling increases an individual's earning potential by approximately ten percent, while also improving health outcomes and social mobility.",
  "The human brain contains approximately eighty-six billion neurons, each connected to thousands of others through synaptic connections. This vast neural network enables everything from simple reflexes to complex abstract thought, making the brain arguably the most sophisticated structure known to exist in the universe.",
  "International trade has transformed the global economy over the past century, lifting billions of people out of poverty while creating new forms of economic interdependence. However, the benefits of globalization have not been distributed equally, leading to growing debates about trade policy and economic justice.",
  "The discovery of antibiotics in the twentieth century is considered one of the greatest achievements in medical history. Before penicillin, even minor infections could prove fatal. Today, however, the overuse of antibiotics has led to the emergence of resistant bacteria, threatening to return us to a pre-antibiotic era.",
  "Modern cities face the challenge of providing adequate housing, transportation, and services to rapidly growing populations while minimizing environmental impact. Urban planners are increasingly turning to concepts like mixed-use development, public transit expansion, and green infrastructure to create more sustainable communities.",
  "The study of genetics has revealed that human behavior is influenced by a complex interaction between inherited traits and environmental factors. While genes may predispose individuals toward certain characteristics, the expression of those genes is heavily shaped by experiences, education, and social context.",
];

// ─── Task 2: Independent Speaking (Opinion prompts) ─────────

export const INDEPENDENT_PROMPTS = [
  { id: 'sp-ind-1', prompt: 'Some people prefer to study alone, while others prefer to study in groups. Which do you prefer and why? Give specific reasons.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-2', prompt: 'Do you agree or disagree that technology makes our lives easier? Use specific examples to support your opinion.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-3', prompt: 'Talk about a person who has had a significant influence on your life. Explain why this person is important to you.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-4', prompt: 'Some people think that children should start learning a foreign language at a young age. Others think they should wait until they are older. What is your opinion?', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-5', prompt: 'What is the most important quality a leader should have? Explain why you think this quality is essential.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-6', prompt: 'Do you think it is better to live in a city or in a rural area? Explain your preference with reasons.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-7', prompt: 'Describe a skill you would like to learn and explain why it would be useful to you.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-8', prompt: 'Some people prefer to save money for the future, while others prefer to spend it now. Which approach do you prefer and why?', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-9', prompt: 'What is one change you would make to your school or workplace to improve it? Explain your idea.', prepTime: 15, speakTime: 45 },
  { id: 'sp-ind-10', prompt: 'Do you agree or disagree that it is important to travel to other countries? Use reasons and examples.', prepTime: 15, speakTime: 45 },
];

// ─── Task 3: Integrated Speaking (Read → Speak) ─────────────

export const INTEGRATED_PROMPTS = [
  {
    id: 'sp-int-1',
    passage: 'The university has announced that it will close the campus library on weekends starting next semester. The administration states that budget constraints require reducing staff hours, and that weekend usage has declined by 40 percent since online resources became available.',
    prompt: 'The university plans to close the library on weekends. Summarize the reasons given and explain whether you think this is a good decision.',
    prepTime: 30,
    speakTime: 60,
  },
  {
    id: 'sp-int-2',
    passage: 'A new study suggests that taking short breaks every 25 minutes while studying — known as the Pomodoro Technique — improves long-term retention by 23 percent compared to continuous study sessions. Researchers believe this is because breaks allow the brain to consolidate information before new material is introduced.',
    prompt: 'Describe the Pomodoro Technique mentioned in the passage and explain why researchers think it works.',
    prepTime: 30,
    speakTime: 60,
  },
  {
    id: 'sp-int-3',
    passage: 'Starting next year, all first-year students will be required to take a course in digital literacy. The course will cover topics such as evaluating online sources, protecting personal data, and understanding how algorithms shape the information we see. The university believes these skills are essential for academic success in the modern world.',
    prompt: 'Explain the new digital literacy requirement and discuss why the university considers it important.',
    prepTime: 30,
    speakTime: 60,
  },
  {
    id: 'sp-int-4',
    passage: 'Research published in Nature shows that urban green spaces — parks, gardens, and tree-lined streets — reduce stress hormones by an average of 28 percent after just 20 minutes of exposure. The study recommends that cities allocate at least 15 percent of urban land to green spaces for public health benefits.',
    prompt: 'Summarize the research findings about green spaces and explain what the researchers recommend.',
    prepTime: 30,
    speakTime: 60,
  },
  {
    id: 'sp-int-5',
    passage: 'The student government has proposed replacing letter grades with a pass/fail system for all courses. Supporters argue that this would reduce student anxiety and encourage deeper learning rather than grade-focused studying. Opponents worry that it would make it harder for employers and graduate schools to evaluate candidates.',
    prompt: 'Describe the proposal to change the grading system. Present both sides of the argument.',
    prepTime: 30,
    speakTime: 60,
  },
];

// ─── Task 4: Shadowing (Academic sentences) ─────────────────

export const SHADOWING_TEXTS = [
  'The primary function of the scientific method is to establish reliable knowledge through systematic observation and experimentation.',
  'Effective communication requires not only the ability to express ideas clearly but also the skill to listen actively and respond thoughtfully.',
  'Economic development in emerging nations depends on investment in education, infrastructure, and institutional governance.',
  'The relationship between language and thought has been debated by philosophers and linguists for centuries without reaching consensus.',
  'Sustainable development means meeting the needs of the present without compromising the ability of future generations to meet their own needs.',
  'Critical thinking involves the ability to analyze arguments, identify assumptions, evaluate evidence, and draw logical conclusions.',
  'The diversity of life on Earth is the result of billions of years of evolution driven by natural selection and genetic variation.',
  'Democratic societies depend on an informed citizenry capable of evaluating complex policy issues and holding leaders accountable.',
];

// ─── Helper: Get Random Speaking Set ────────────────────────

export function getSpeakingSet() {
  const readAloud = READ_ALOUD_PASSAGES.sort(() => Math.random() - 0.5).slice(0, 3);
  const independent = INDEPENDENT_PROMPTS[Math.floor(Math.random() * INDEPENDENT_PROMPTS.length)];
  const integrated = INTEGRATED_PROMPTS[Math.floor(Math.random() * INTEGRATED_PROMPTS.length)];
  const shadowing = SHADOWING_TEXTS.sort(() => Math.random() - 0.5).slice(0, 3);

  return { readAloud, independent, integrated, shadowing };
}

// Stats:
// Read Aloud passages: 8 (3 selected per test)
// Independent prompts: 10 (1 selected per test)
// Integrated prompts: 5 (1 selected per test)
// Shadowing texts: 8 (3 selected per test)
// Total per test: 3 read-aloud + 1 independent + 1 integrated + 3 shadowing = 8 tasks
// Unique combinations: 56 × 10 × 5 × 56 = 1,568,000
