// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Extended Reading Passages (Batch 2)
// Academic topics: history, biology, technology, economics, art, sociology
// ═══════════════════════════════════════════════════════════

import type { ReadingPassage } from './reading-passages';

// ─── Easy Passages (batch 2) ────────────────────────────────

export const EASY_PASSAGES_B2: ReadingPassage[] = [
  {
    id: 'r-easy-3',
    difficulty: 'easy',
    title: 'How Bees Make Honey',
    topic: 'Biology',
    wordCount: 170,
    text: `Honey production is a remarkable process that involves thousands of worker bees cooperating in a highly organized system. Forager bees visit flowers and collect nectar, a sugary liquid, which they store in a special "honey stomach" separate from their digestive stomach. A single bee may visit up to 1,500 flowers to fill this pouch.

Upon returning to the hive, forager bees transfer the nectar to processor bees through mouth-to-mouth feeding. These processor bees chew the nectar for about 30 minutes, adding enzymes that break down complex sugars into simpler ones. The partially processed nectar is then deposited into honeycomb cells.

The final step involves evaporation. Bees fan their wings over the open cells to reduce the water content from about 70 percent to less than 18 percent. Once the honey reaches the right consistency, bees seal the cell with a wax cap. It takes approximately two million flower visits to produce a single pound of honey — a testament to the extraordinary work ethic of these small creatures.`,
    questions: [
      { id: 'r-easy-3-q1', type: 'main_idea', questionText: 'What is the passage mainly about?', options: ['Why bees are important for agriculture', 'The step-by-step process of honey production', 'The different types of bees in a colony', 'How flowers attract pollinating insects'], correctAnswer: 1 },
      { id: 'r-easy-3-q2', type: 'detail', questionText: 'According to the passage, what do processor bees add to the nectar?', options: ['Water to dilute the sugar content', 'Enzymes that break down complex sugars', 'Wax to preserve the nectar longer', 'Pollen to improve the nutritional value'], correctAnswer: 1 },
      { id: 'r-easy-3-q3', type: 'vocabulary', questionText: 'The word "testament" in the last sentence is closest in meaning to:', options: ['A legal document or will', 'Evidence or proof of something', 'A religious text or scripture', 'A type of scientific experiment'], correctAnswer: 1 },
      { id: 'r-easy-3-q4', type: 'detail', questionText: 'What water content must honey reach before bees seal the cell?', options: ['Less than 5 percent water content', 'Less than 18 percent water content', 'Less than 30 percent water content', 'Less than 70 percent water content'], correctAnswer: 1 },
      { id: 'r-easy-3-q5', type: 'inference', questionText: 'What can be inferred about the "honey stomach"?', options: ['It digests the nectar for the bee', 'It keeps nectar separate from food the bee eats', 'It is larger than the digestive stomach', 'It can only hold nectar from one flower'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-easy-4',
    difficulty: 'easy',
    title: 'The Invention of the Printing Press',
    topic: 'History & Technology',
    wordCount: 175,
    text: `Before Johannes Gutenberg invented the movable-type printing press around 1440, books in Europe were copied by hand — a process that could take months for a single volume. Only the wealthy and religious institutions could afford books, and literacy rates remained extremely low across the continent.

Gutenberg's innovation was not printing itself, which existed in China centuries earlier, but rather the creation of individual metal letter blocks that could be rearranged and reused. This system dramatically reduced production time. A page that once took days to copy could now be printed in minutes, and the same type blocks could produce thousands of identical copies.

The effects were revolutionary. Within 50 years, an estimated 20 million books had been printed across Europe. Information that was once controlled by elites became accessible to ordinary people. The printing press enabled the spread of scientific knowledge, religious reformation, and eventually democratic ideals. Many historians consider it the most important invention of the second millennium, arguing that it fundamentally transformed human civilization by democratizing access to knowledge.`,
    questions: [
      { id: 'r-easy-4-q1', type: 'main_idea', questionText: 'What is the central topic of this passage?', options: ['The life and achievements of Johannes Gutenberg', 'How the printing press changed European society', 'A comparison of European and Chinese printing methods', 'The history of literacy education in medieval Europe'], correctAnswer: 1 },
      { id: 'r-easy-4-q2', type: 'detail', questionText: 'According to the passage, what was Gutenberg\'s key innovation?', options: ['He invented printing for the first time ever', 'He created reusable individual metal letter blocks', 'He discovered a faster way to copy books by hand', 'He developed the first paper-making process in Europe'], correctAnswer: 1 },
      { id: 'r-easy-4-q3', type: 'inference', questionText: 'What can be inferred about China\'s role in printing history?', options: ['China invented movable type before Gutenberg did', 'China had some form of printing before Europe did', 'China helped Gutenberg develop his printing press', 'China rejected printing technology as unnecessary'], correctAnswer: 1 },
      { id: 'r-easy-4-q4', type: 'vocabulary', questionText: 'The word "democratizing" in the last paragraph is closest in meaning to:', options: ['Making something available to only a few people', 'Making something accessible to everyone equally', 'Making something more expensive and exclusive', 'Making something controlled by the government'], correctAnswer: 1 },
      { id: 'r-easy-4-q5', type: 'purpose', questionText: 'Why does the author mention "20 million books" printed within 50 years?', options: ['To criticize the quality of early printed books', 'To show the enormous scale of impact from the invention', 'To compare Gutenberg with modern publishing companies', 'To argue that too many books were produced too quickly'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-easy-5',
    difficulty: 'easy',
    title: 'Why We Dream',
    topic: 'Psychology & Neuroscience',
    wordCount: 168,
    text: `Despite decades of research, scientists still do not fully understand why humans dream. Several competing theories attempt to explain this universal human experience that occupies roughly two hours of each night's sleep.

The most widely discussed theory suggests that dreams help process emotions. During REM sleep, the brain replays emotionally charged experiences from the day, helping us work through difficult feelings in a safe mental environment. This may explain why people often dream about stressful situations.

Another prominent theory proposes that dreams serve a memory function. The brain sorts through the day's experiences during sleep, deciding what to keep and what to discard. Dreams might be the byproduct of this filing process — random neural activity that our minds attempt to organize into narratives.

A third perspective argues that dreams are essentially a form of mental rehearsal. By simulating threatening scenarios, dreams prepare us to handle real-world dangers. This "threat simulation theory" is supported by the fact that negative dreams significantly outnumber positive ones across all cultures studied.`,
    questions: [
      { id: 'r-easy-5-q1', type: 'main_idea', questionText: 'What is the passage primarily about?', options: ['How to improve your dream quality at night', 'Different scientific theories about why we dream', 'The stages of sleep and REM cycles explained', 'How dreams can predict future events accurately'], correctAnswer: 1 },
      { id: 'r-easy-5-q2', type: 'detail', questionText: 'According to the passage, approximately how long do we dream each night?', options: ['About thirty minutes each night total', 'About two hours of each night total', 'About four hours of each night total', 'About six hours of each night total'], correctAnswer: 1 },
      { id: 'r-easy-5-q3', type: 'vocabulary', questionText: 'The word "byproduct" in paragraph 3 is closest in meaning to:', options: ['A planned and intentional result or goal', 'A secondary or unintended result of something', 'A critical and essential part of a process', 'A mysterious and unexplainable phenomenon here'], correctAnswer: 1 },
      { id: 'r-easy-5-q4', type: 'inference', questionText: 'Based on the passage, what can be inferred about dream content?', options: ['Most dreams are happy and pleasant experiences', 'Negative or threatening dreams are more common than positive', 'People rarely dream about real-life situations', 'Dreams have no connection to daily experiences at all'], correctAnswer: 1 },
      { id: 'r-easy-5-q5', type: 'purpose', questionText: 'Why does the author mention that negative dreams "outnumber positive ones across all cultures"?', options: ['To discourage people from sleeping too much', 'To support the threat simulation theory of dreaming', 'To argue that dreams are harmful to mental health', 'To suggest that all humans share the same dreams'], correctAnswer: 1 },
    ],
  },

  {
    id: 'r-easy-6',
    difficulty: 'easy',
    title: 'The Water Cycle',
    topic: 'Earth Science',
    wordCount: 160,
    text: `The water cycle, also known as the hydrological cycle, describes the continuous movement of water through Earth's systems. This process has no beginning or end — it is a constant loop powered primarily by energy from the sun.

The cycle begins with evaporation, when solar heat transforms liquid water from oceans, lakes, and rivers into water vapor that rises into the atmosphere. Plants also contribute through transpiration, releasing water vapor through their leaves. Together, these processes move approximately 500,000 cubic kilometers of water into the atmosphere annually.

As water vapor rises, it cools and condenses around tiny particles of dust or pollen, forming clouds. When water droplets in clouds become too heavy, they fall as precipitation — rain, snow, sleet, or hail. Some of this water flows across the surface as runoff into rivers and eventually back to the ocean. Some seeps underground, replenishing aquifers that may store water for thousands of years before it resurfaces.`,
    questions: [
      { id: 'r-easy-6-q1', type: 'main_idea', questionText: 'What is the passage mainly about?', options: ['How pollution affects water quality globally', 'The continuous movement of water through natural systems', 'Why some regions receive more rainfall than others', 'The importance of conserving water resources today'], correctAnswer: 1 },
      { id: 'r-easy-6-q2', type: 'detail', questionText: 'According to the passage, what powers the water cycle?', options: ['Gravity pulling water downhill toward oceans', 'Wind moving clouds across the sky continuously', 'Energy from the sun heating water sources', 'The rotation of the Earth on its axis'], correctAnswer: 2 },
      { id: 'r-easy-6-q3', type: 'vocabulary', questionText: 'The word "replenishing" in the last paragraph is closest in meaning to:', options: ['Emptying or draining over time', 'Refilling or restoring the supply of', 'Contaminating or polluting the source', 'Measuring or calculating the amount of'], correctAnswer: 1 },
      { id: 'r-easy-6-q4', type: 'detail', questionText: 'What is transpiration?', options: ['Water evaporating from the ocean surface', 'Rain falling from clouds to the ground', 'Plants releasing water vapor through leaves', 'Water seeping underground into aquifers below'], correctAnswer: 2 },
      { id: 'r-easy-6-q5', type: 'inference', questionText: 'What can be inferred about aquifers?', options: ['They are located above the ground surface', 'They can hold water for very long periods', 'They only exist in desert environments', 'They release water faster than they receive it'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-easy-7',
    difficulty: 'easy',
    title: 'The Rise of Electric Vehicles',
    topic: 'Technology & Environment',
    wordCount: 172,
    text: `Electric vehicles have transformed from a niche curiosity into a mainstream transportation option in less than a decade. Global sales exceeded 10 million units in 2022, representing approximately 14 percent of all new car sales worldwide — up from just 2 percent in 2018.

Several factors have driven this rapid adoption. Battery technology has improved dramatically, with costs dropping 90 percent since 2010 while energy density has nearly tripled. Modern electric cars can travel 300-400 kilometers on a single charge, eliminating the "range anxiety" that once deterred buyers. Simultaneously, charging infrastructure has expanded, with over 2.7 million public charging points globally.

Government policies have also accelerated the transition. More than 30 countries have announced plans to phase out internal combustion engine vehicles, with Norway leading the way — over 80 percent of new cars sold there are electric. Tax incentives, emissions regulations, and outright bans on gasoline vehicles have created powerful market signals.

However, challenges remain. Battery production requires lithium, cobalt, and nickel — minerals whose extraction raises environmental and ethical concerns. The electricity powering these vehicles must also come from clean sources to achieve genuine emissions reductions.`,
    questions: [
      { id: 'r-easy-7-q1', type: 'main_idea', questionText: 'What is the passage primarily about?', options: ['How batteries are manufactured for electric cars', 'The growth of electric vehicles and factors behind it', 'Why Norway is the best country for electric cars', 'The environmental damage caused by mining minerals'], correctAnswer: 1 },
      { id: 'r-easy-7-q2', type: 'detail', questionText: 'By how much have battery costs dropped since 2010?', options: ['50 percent reduction in total cost', '70 percent reduction in total cost', '90 percent reduction in total cost', '95 percent reduction in total cost'], correctAnswer: 2 },
      { id: 'r-easy-7-q3', type: 'vocabulary', questionText: 'The phrase "range anxiety" most likely refers to:', options: ['Fear of driving at high speeds on highways', 'Worry that the car will run out of power', 'Concern about the high price of electricity', 'Stress about finding parking in busy cities'], correctAnswer: 1 },
      { id: 'r-easy-7-q4', type: 'detail', questionText: 'What percentage of new cars in Norway are electric?', options: ['About 14 percent of all new car sales', 'About 30 percent of all new car sales', 'About 50 percent of all new car sales', 'Over 80 percent of all new car sales'], correctAnswer: 3 },
      { id: 'r-easy-7-q5', type: 'inference', questionText: 'What does the author suggest about electric vehicles and the environment?', options: ['Electric vehicles are always completely carbon-neutral', 'Electric vehicles solve all environmental problems immediately', 'Electric vehicles are only beneficial if powered by clean energy', 'Electric vehicles cause more pollution than gasoline cars'], correctAnswer: 2 },
    ],
  },
];


// ─── Medium Passages (batch 2) ──────────────────────────────

export const MEDIUM_PASSAGES_B2: ReadingPassage[] = [
  {
    id: 'r-med-2',
    difficulty: 'medium',
    title: 'The Economics of Attention',
    topic: 'Economics & Technology',
    wordCount: 290,
    text: `In 1971, economist Herbert Simon observed that "a wealth of information creates a poverty of attention." Five decades later, his insight has become the foundational principle of the modern digital economy. Technology companies no longer primarily sell products or services — they sell access to human attention, measured in minutes, clicks, and scrolls.

The attention economy operates on a simple premise: human attention is a finite resource, but digital content is essentially infinite. Every app, website, and platform competes for the same limited pool of waking hours. The average person now encounters between 6,000 and 10,000 advertisements daily, compared to roughly 500 in the 1970s. Social media platforms are engineered with variable-reward mechanisms — similar to slot machines — that exploit neurological dopamine responses to maximize engagement time.

The consequences extend beyond mere distraction. Research from the University of California, Irvine found that after an interruption, it takes an average of 23 minutes to fully regain focus on a task. Given that office workers are interrupted approximately every 11 minutes, true deep focus has become increasingly rare. This fragmentation of attention may be reshaping cognitive abilities, particularly among younger generations who have never known a pre-smartphone world.

Critics argue that framing attention as an economic commodity creates perverse incentives. When revenue depends on maximizing screen time, platforms have no financial motivation to respect users' time or mental health. This has led to growing calls for regulation, including proposals for "attention taxes" on platforms that exceed certain engagement thresholds, and requirements for transparent reporting of algorithmic amplification.

Some technologists are pushing back against the attention economy model entirely, designing tools that prioritize "calm technology" — systems that inform without demanding attention, and that respect the user's right to disconnect.`,
    questions: [
      { id: 'r-med-2-q1', type: 'main_idea', questionText: 'What is the central argument of this passage?', options: ['Social media should be banned for children under 18', 'Human attention has become the primary commodity in the digital economy', 'Advertisements are more effective now than in the 1970s', 'Technology companies are more profitable than traditional businesses'], correctAnswer: 1 },
      { id: 'r-med-2-q2', type: 'detail', questionText: 'According to the passage, how long does it take to regain focus after an interruption?', options: ['About 5 minutes on average total', 'About 11 minutes on average total', 'About 23 minutes on average total', 'About 45 minutes on average total'], correctAnswer: 2 },
      { id: 'r-med-2-q3', type: 'vocabulary', questionText: 'The word "perverse" in paragraph 4 is closest in meaning to:', options: ['Reasonable and well-intentioned overall', 'Contrary to what is desired or expected', 'Extremely profitable for all parties involved', 'Completely illegal under current law today'], correctAnswer: 1 },
      { id: 'r-med-2-q4', type: 'purpose', questionText: 'Why does the author compare social media to slot machines?', options: ['To suggest both should be restricted to adults only', 'To show both use similar psychological reward mechanisms', 'To argue that social media is a form of illegal gambling', 'To prove that social media companies are dishonest always'], correctAnswer: 1 },
      { id: 'r-med-2-q5', type: 'inference', questionText: 'Based on the passage, what would "calm technology" likely prioritize?', options: ['Maximizing user engagement and screen time always', 'Delivering information without constantly demanding attention', 'Using brighter colors and louder notifications for users', 'Replacing all human communication with AI chatbots'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-med-3',
    difficulty: 'medium',
    title: 'Coral Reef Ecosystems Under Threat',
    topic: 'Marine Biology & Environment',
    wordCount: 280,
    text: `Coral reefs occupy less than 0.1 percent of the ocean floor yet support approximately 25 percent of all marine species — a biodiversity density that has earned them the nickname "rainforests of the sea." These complex ecosystems provide habitat for over 4,000 species of fish, 800 species of hard coral, and countless invertebrates, algae, and marine mammals.

Beyond their ecological importance, coral reefs provide substantial economic value to human communities. They protect coastlines from storm damage, reducing wave energy by an average of 97 percent before it reaches shore. The global economic value of reef ecosystem services — including tourism, fisheries, and coastal protection — is estimated at $375 billion annually, supporting the livelihoods of over 500 million people worldwide.

However, coral reefs face an unprecedented crisis. Rising ocean temperatures cause "coral bleaching," a stress response in which corals expel the symbiotic algae that provide them with food and color. The 2015-2017 global bleaching event affected 75 percent of the world's tropical reefs, killing approximately 30 percent of coral on the Great Barrier Reef alone. Ocean acidification, caused by absorption of atmospheric CO2, further weakens coral skeletons by reducing the availability of calcium carbonate.

Scientists project that if global temperatures rise by 2°C above pre-industrial levels, 99 percent of coral reefs will experience annual severe bleaching. Even the more optimistic 1.5°C target would still result in 70-90 percent coral loss. Some researchers are exploring interventions such as selective breeding for heat tolerance and assisted migration of coral populations to cooler waters, but these solutions remain experimental and cannot match the scale of the threat.`,
    questions: [
      { id: 'r-med-3-q1', type: 'main_idea', questionText: 'What is the passage primarily about?', options: ['How to build artificial coral reefs successfully', 'The ecological importance and threats facing coral reefs', 'Why coral bleaching only affects the Great Barrier Reef', 'The economic benefits of deep-sea mining near coral reefs'], correctAnswer: 1 },
      { id: 'r-med-3-q2', type: 'detail', questionText: 'How much of the ocean floor do coral reefs occupy?', options: ['Less than 0.1 percent of total area', 'Approximately 1 percent of total area', 'About 10 percent of total ocean floor', 'Approximately 25 percent of total area'], correctAnswer: 0 },
      { id: 'r-med-3-q3', type: 'vocabulary', questionText: 'The word "symbiotic" in paragraph 3 most likely describes:', options: ['A harmful and destructive relationship between organisms', 'A mutually beneficial relationship between organisms', 'A competitive relationship where one organism wins', 'A random and unimportant connection between organisms'], correctAnswer: 1 },
      { id: 'r-med-3-q4', type: 'detail', questionText: 'What percentage of coral reefs would be affected at 2°C warming?', options: ['About 30 percent would experience bleaching', 'About 50 percent would experience bleaching', 'About 75 percent would experience bleaching', 'About 99 percent would experience bleaching'], correctAnswer: 3 },
      { id: 'r-med-3-q5', type: 'inference', questionText: 'What can be inferred about current coral conservation efforts?', options: ['They are fully solving the coral crisis worldwide', 'They are too small-scale to address the full problem', 'They have already restored most damaged reef systems', 'They are focused only on tourism revenue not ecology'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-med-4',
    difficulty: 'medium',
    title: 'The Science of Habit Formation',
    topic: 'Psychology & Neuroscience',
    wordCount: 270,
    text: `Every habit follows the same neurological loop: cue, routine, reward. A cue triggers the brain to initiate a behavior; the routine is the behavior itself; and the reward is the positive reinforcement that tells the brain this loop is worth remembering. Over time, this cycle becomes automatic — the brain stops actively participating in decision-making and shifts the behavior to the basal ganglia, the region responsible for automatic actions.

Research by Phillippa Lally at University College London found that forming a new habit takes an average of 66 days — not the commonly cited 21 days. However, individual variation was enormous, ranging from 18 to 254 days depending on the complexity of the behavior and the person's circumstances. Simple habits like drinking water with lunch formed quickly; complex behaviors like daily exercise took significantly longer.

The most effective strategy for building new habits, according to behavioral scientists, is "habit stacking" — attaching a new behavior to an existing automatic routine. For example, "After I pour my morning coffee, I will meditate for two minutes." This leverages the existing neural pathway of the established habit to trigger the new one.

Breaking existing habits proves more difficult than forming new ones because neural pathways, once established, never fully disappear. Instead, the most successful approach is to replace the routine while keeping the same cue and reward. A person trying to quit stress-eating, for example, might replace the eating routine with a brief walk while maintaining the same cue (feeling stressed) and seeking the same reward (stress relief).`,
    questions: [
      { id: 'r-med-4-q1', type: 'main_idea', questionText: 'What is this passage primarily about?', options: ['How to cure addiction using modern medicine today', 'The neuroscience of how habits form and can be changed', 'Why some people have better willpower than others', 'The dangers of having too many automatic behaviors'], correctAnswer: 1 },
      { id: 'r-med-4-q2', type: 'detail', questionText: 'According to Phillippa Lally\'s research, how long does habit formation take on average?', options: ['Approximately 21 days on average per habit', 'Approximately 66 days on average per habit', 'Approximately 100 days on average per habit', 'Approximately 254 days on average per habit'], correctAnswer: 1 },
      { id: 'r-med-4-q3', type: 'vocabulary', questionText: 'The word "leverages" in paragraph 3 is closest in meaning to:', options: ['Ignores or disregards completely', 'Uses to maximum advantage', 'Destroys or eliminates permanently', 'Creates from scratch or invents'], correctAnswer: 1 },
      { id: 'r-med-4-q4', type: 'purpose', questionText: 'Why does the author provide the example of stress-eating?', options: ['To warn readers about the dangers of eating disorders', 'To illustrate how to replace a habit routine while keeping cue and reward', 'To prove that all habits are harmful to health', 'To argue that walking is better exercise than running'], correctAnswer: 1 },
      { id: 'r-med-4-q5', type: 'inference', questionText: 'What can be inferred about old habits from the passage?', options: ['They can be completely erased from the brain forever', 'The neural pathways remain even after the habit is broken', 'They automatically disappear after 66 days of not doing them', 'They are always replaced by healthier new behaviors naturally'], correctAnswer: 1 },
    ],
  },
];


// ─── Hard Passages (batch 2) ────────────────────────────────

export const HARD_PASSAGES_B2: ReadingPassage[] = [
  {
    id: 'r-hard-2',
    difficulty: 'hard',
    title: 'The Sapir-Whorf Hypothesis Revisited',
    topic: 'Linguistics & Cognitive Science',
    wordCount: 410,
    text: `The question of whether language shapes thought or merely reflects it has fascinated philosophers and linguists for centuries. The Sapir-Whorf hypothesis, named after linguists Edward Sapir and Benjamin Lee Whorf, proposes that the structure of a language influences the cognition and worldview of its speakers. In its strong form — linguistic determinism — the hypothesis claims that language determines thought entirely. In its weak form — linguistic relativity — it suggests that language influences thought and certain kinds of cognitive processes.

The strong form has been largely discredited. Speakers of languages that lack future tense can still plan ahead; speakers of languages without color terms can still perceive color differences. However, mounting evidence supports the weak form in surprising ways.

Lera Boroditsky's research at Stanford University has demonstrated that speakers of languages with grammatical gender assign gendered characteristics to inanimate objects. German speakers, for whom "bridge" is feminine, describe bridges as elegant and slender; Spanish speakers, for whom "bridge" is masculine, describe them as strong and towering — despite looking at identical photographs. This suggests that grammatical categories can subtly influence conceptual associations.

Perhaps more compelling is research on spatial reasoning. The Kuuk Thaayorre people of Australia use cardinal directions (north, south, east, west) rather than egocentric terms (left, right) for all spatial descriptions. Studies show they maintain an extraordinary internal compass, always aware of their absolute orientation — a cognitive ability that English speakers, who rely on relative spatial terms, typically lack.

Temporal reasoning also varies linguistically. English speakers tend to conceptualize time as flowing horizontally (the future is ahead, the past is behind). Mandarin speakers frequently use vertical metaphors (the future is down, the past is up). Experimental evidence shows these linguistic differences correlate with actual differences in how speakers mentally represent temporal sequences when performing nonlinguistic tasks.

Critics caution against overstating these findings. The observed effects, while statistically significant, are often subtle and context-dependent. Moreover, correlation between linguistic structure and cognitive tendency does not prove that language causes the cognitive difference — both might arise from shared cultural practices. Nevertheless, the accumulated evidence suggests that language is not merely a neutral vehicle for expressing pre-formed thoughts; it participates, however modestly, in shaping the thoughts themselves.`,
    questions: [
      { id: 'r-hard-2-q1', type: 'main_idea', questionText: 'What is the central argument of this passage?', options: ['Language completely determines all human thought patterns', 'The Sapir-Whorf hypothesis has been entirely proven wrong', 'There is growing evidence that language subtly influences thought', 'All languages express ideas in exactly the same way'], correctAnswer: 2 },
      { id: 'r-hard-2-q2', type: 'detail', questionText: 'How do Kuuk Thaayorre people describe spatial relationships?', options: ['Using left and right like English speakers do', 'Using cardinal directions like north and south', 'Using time-based references like before and after', 'Using emotional descriptions like close and far from heart'], correctAnswer: 1 },
      { id: 'r-hard-2-q3', type: 'vocabulary', questionText: 'The word "egocentric" in paragraph 4 most likely means:', options: ['Based on the speaker\'s own body position and orientation', 'Selfish and uncaring about other people\'s feelings', 'Extremely accurate and scientifically precise always', 'Related to the center of the Earth specifically'], correctAnswer: 0 },
      { id: 'r-hard-2-q4', type: 'inference', questionText: 'Based on the passage, what would the author likely agree with?', options: ['Learning a new language cannot change how you think', 'Language has a modest but real effect on cognition', 'The strong form of the Sapir-Whorf hypothesis is correct', 'All cognitive differences are caused by language alone'], correctAnswer: 1 },
      { id: 'r-hard-2-q5', type: 'purpose', questionText: 'Why does the author discuss the German and Spanish "bridge" example?', options: ['To prove that German is more descriptive than Spanish', 'To show that grammatical gender can influence conceptual thinking', 'To argue that bridge design differs across cultures significantly', 'To demonstrate that all languages describe objects identically'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-hard-3',
    difficulty: 'hard',
    title: 'Antibiotic Resistance: An Evolutionary Arms Race',
    topic: 'Biology & Public Health',
    wordCount: 395,
    text: `When Alexander Fleming discovered penicillin in 1928, he warned that bacteria could develop resistance if antibiotics were used carelessly. Nearly a century later, his prediction has become one of the most pressing public health crises of the modern era. The World Health Organization has declared antimicrobial resistance a top-ten global health threat, projecting that drug-resistant infections could cause 10 million deaths annually by 2050 — surpassing cancer as a cause of mortality.

Antibiotic resistance is not a malfunction of medicine but a natural consequence of evolution. When a population of bacteria is exposed to an antibiotic, most individual cells die. However, any bacterium that happens to carry a genetic mutation conferring resistance will survive and reproduce, passing the resistance trait to its offspring. Within days, what was once a tiny minority becomes the dominant population. This is natural selection operating at an accelerated pace.

What makes the situation particularly alarming is horizontal gene transfer — the ability of bacteria to share genetic material across species boundaries without reproduction. A resistant bacterium can pass its resistance genes to completely unrelated species through small circular DNA molecules called plasmids. This means resistance developed in one type of bacteria can rapidly spread to others, including those that cause entirely different diseases.

Human behavior has dramatically accelerated this evolutionary process. Approximately 70 percent of antibiotics produced globally are administered to livestock — not to treat infections but to promote growth and prevent disease in crowded factory farming conditions. This creates vast reservoirs of resistant bacteria that can transfer to humans through food, water, and environmental contamination. Meanwhile, in human medicine, antibiotics are frequently prescribed for viral infections where they have no effect, and patients often discontinue courses early, allowing partially resistant bacteria to survive.

The pipeline for new antibiotics has simultaneously dried up. Developing new antibiotics is expensive, and because they are used sparingly and for short durations, they offer poor financial returns compared to drugs for chronic conditions. Only 12 new antibiotics were approved between 2014 and 2019, and none belonged to novel chemical classes. Without economic incentives, pharmaceutical companies have largely abandoned antibiotic research.

The result is a closing window of treatment options. Some infections are already resistant to all available antibiotics, creating "superbugs" against which medicine has no defense. Public health experts increasingly warn that without coordinated global action, routine surgeries, chemotherapy, and even minor injuries could once again become life-threatening.`,
    questions: [
      { id: 'r-hard-3-q1', type: 'main_idea', questionText: 'What is the central concern discussed in this passage?', options: ['The life and achievements of Alexander Fleming as a scientist', 'How antibiotic resistance develops and why it threatens global health', 'Why pharmaceutical companies make too much profit from drugs', 'The benefits of using antibiotics in livestock agriculture'], correctAnswer: 1 },
      { id: 'r-hard-3-q2', type: 'detail', questionText: 'What percentage of global antibiotics is given to livestock?', options: ['Approximately 10 percent of all global production', 'Approximately 30 percent of all global production', 'Approximately 50 percent of all global production', 'Approximately 70 percent of all global production'], correctAnswer: 3 },
      { id: 'r-hard-3-q3', type: 'vocabulary', questionText: 'The word "conferring" in paragraph 2 is closest in meaning to:', options: ['Removing or taking away from something', 'Granting or providing a quality or ability', 'Discussing or talking about a topic together', 'Preventing or blocking from happening at all'], correctAnswer: 1 },
      { id: 'r-hard-3-q4', type: 'purpose', questionText: 'Why does the author mention that no new antibiotics belong to "novel chemical classes"?', options: ['To praise pharmaceutical companies for their efficiency', 'To show that even new antibiotics may face quick resistance', 'To argue that existing antibiotics are good enough already', 'To suggest that chemistry research should be defunded'], correctAnswer: 1 },
      { id: 'r-hard-3-q5', type: 'inference', questionText: 'Based on the passage, what does the author imply about the economic model for antibiotics?', options: ['It provides strong incentives for developing new antibiotics', 'The current financial model discourages new antibiotic development', 'Pharmaceutical companies are investing heavily in new antibiotics', 'Antibiotics are the most profitable class of drugs available today'], correctAnswer: 1 },
    ],
  },
];



// ─── Additional Easy Passages (batch 3) ─────────────────────

export const EASY_PASSAGES_B3: ReadingPassage[] = [
  {
    id: 'r-easy-8', difficulty: 'easy', title: 'How Vaccines Work', topic: 'Medicine & Health', wordCount: 165,
    text: `Vaccines are one of medicine's greatest achievements, preventing millions of deaths each year. They work by training the immune system to recognize and fight specific pathogens without causing the disease itself.\n\nWhen a vaccine is injected, it introduces a harmless version of a virus or bacterium — either weakened, killed, or just a fragment of it. The immune system responds by producing antibodies, specialized proteins that can neutralize the invader. Crucially, the immune system also creates "memory cells" that remember how to fight this pathogen.\n\nIf the person later encounters the real pathogen, these memory cells can mount a rapid defense, often destroying the threat before symptoms develop. This process typically takes two to three weeks after vaccination to fully develop.\n\nHerd immunity occurs when enough people in a community are vaccinated that the pathogen cannot spread easily, protecting even those who cannot be vaccinated due to medical conditions. Most diseases require 80 to 95 percent vaccination rates to achieve herd immunity.`,
    questions: [
      { id: 'r-easy-8-q1', type: 'main_idea', questionText: 'What is this passage mainly about?', options: ['The history of vaccine development over centuries', 'How vaccines train the immune system to fight disease', 'Why some people refuse to get vaccinated today', 'The different types of bacteria that cause disease'], correctAnswer: 1 },
      { id: 'r-easy-8-q2', type: 'detail', questionText: 'How long does it typically take for full protection after vaccination?', options: ['A few hours after the injection', 'Two to three days after injection', 'Two to three weeks after vaccination', 'Two to three months after vaccination'], correctAnswer: 2 },
      { id: 'r-easy-8-q3', type: 'vocabulary', questionText: 'The word "mount" in paragraph 3 is closest in meaning to:', options: ['Climb on top of something high', 'Launch or initiate a response quickly', 'Decrease or reduce in strength slowly', 'Display on a wall for others viewing'], correctAnswer: 1 },
      { id: 'r-easy-8-q4', type: 'detail', questionText: 'What vaccination rate is needed for herd immunity?', options: ['30 to 50 percent of the population', '50 to 70 percent of the population', '80 to 95 percent of the population', '100 percent of all the population'], correctAnswer: 2 },
      { id: 'r-easy-8-q5', type: 'inference', questionText: 'What can be inferred about people who cannot be vaccinated?', options: ['They are completely safe without any vaccines', 'They depend on others being vaccinated for protection', 'They naturally develop immunity without any help', 'They should avoid contact with all other people'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-easy-9', difficulty: 'easy', title: 'The Importance of Breakfast', topic: 'Nutrition & Health', wordCount: 158,
    text: `Despite the common saying that breakfast is "the most important meal of the day," approximately 25 percent of adults regularly skip it. Research suggests this habit may have consequences for both physical and mental performance.\n\nAfter fasting overnight for 8-12 hours, the body's glucose stores are depleted. Glucose is the brain's primary energy source, and without replenishment, cognitive functions such as concentration, memory, and problem-solving ability decline measurably. Studies of school children show that those who eat breakfast score 20-30 percent higher on memory tests than those who skip it.\n\nBreakfast also kickstarts metabolism. The body enters a conservation mode during sleep, slowing calorie burning. Eating in the morning signals the body to resume normal metabolic activity. Research shows breakfast skippers actually tend to consume more total calories throughout the day, often through unhealthy snacking.\n\nNutritionists recommend breakfasts combining protein, complex carbohydrates, and healthy fats for sustained energy — such as eggs with whole-grain toast, or yogurt with fruit and nuts.`,
    questions: [
      { id: 'r-easy-9-q1', type: 'main_idea', questionText: 'What is the main argument of this passage?', options: ['Everyone must eat a large breakfast every day', 'Skipping breakfast has measurable negative effects on health and performance', 'Children need breakfast more than adults do', 'The best breakfast foods are eggs and toast'], correctAnswer: 1 },
      { id: 'r-easy-9-q2', type: 'detail', questionText: 'What percentage of adults regularly skip breakfast?', options: ['About 10 percent of all adults', 'About 25 percent of all adults', 'About 50 percent of all adults', 'About 75 percent of all adults'], correctAnswer: 1 },
      { id: 'r-easy-9-q3', type: 'vocabulary', questionText: 'The word "depleted" in paragraph 2 is closest in meaning to:', options: ['Increased beyond normal levels here', 'Used up or emptied of supply', 'Stored for future use later on', 'Converted into a different useful form'], correctAnswer: 1 },
      { id: 'r-easy-9-q4', type: 'inference', questionText: 'Based on the passage, what would happen to someone who skips breakfast before an exam?', options: ['They would perform better due to less digestion', 'Their concentration and memory would likely be reduced', 'They would have more energy from overnight fasting', 'Their metabolism would speed up and help focus'], correctAnswer: 1 },
      { id: 'r-easy-9-q5', type: 'purpose', questionText: 'Why does the author mention school children studies?', options: ['To argue that only children need breakfast daily', 'To provide evidence that breakfast improves cognitive function', 'To suggest schools should provide free meals to all', 'To compare children and adult eating habits generally'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-easy-10', difficulty: 'easy', title: 'How GPS Works', topic: 'Technology', wordCount: 162,
    text: `The Global Positioning System, or GPS, has become so integrated into daily life that most people never consider how it works. Yet the technology behind those navigation directions involves a network of 31 satellites orbiting Earth at approximately 20,200 kilometers altitude.\n\nEach satellite continuously broadcasts a signal containing its exact position and the precise time the signal was sent. A GPS receiver on the ground picks up signals from multiple satellites simultaneously. By calculating how long each signal took to arrive — traveling at the speed of light — the receiver determines its exact distance from each satellite.\n\nWith signals from at least four satellites, the receiver can calculate its position in three dimensions: latitude, longitude, and altitude. This process, called trilateration, achieves accuracy within about 3-5 meters for civilian devices.\n\nThe system requires extraordinary precision. Each satellite carries atomic clocks accurate to within one billionth of a second. Even tiny timing errors would translate to positioning errors of hundreds of meters, since the signals travel at 300,000 kilometers per second.`,
    questions: [
      { id: 'r-easy-10-q1', type: 'main_idea', questionText: 'What is this passage primarily about?', options: ['The history of satellite technology development', 'How GPS determines location using satellite signals', 'Why GPS is more accurate than traditional maps', 'The cost of maintaining the GPS satellite network'], correctAnswer: 1 },
      { id: 'r-easy-10-q2', type: 'detail', questionText: 'How many satellites does GPS currently use?', options: ['12 satellites orbiting the Earth', '24 satellites orbiting the Earth', '31 satellites orbiting the Earth', '50 satellites orbiting the Earth'], correctAnswer: 2 },
      { id: 'r-easy-10-q3', type: 'detail', questionText: 'How many satellite signals are needed for a 3D position?', options: ['At least two satellite signals needed', 'At least three satellite signals needed', 'At least four satellite signals needed', 'At least six satellite signals needed'], correctAnswer: 2 },
      { id: 'r-easy-10-q4', type: 'vocabulary', questionText: 'The word "trilateration" most likely refers to:', options: ['A method of sending signals to satellites above', 'A process of calculating position from multiple distances', 'A type of satellite orbit around the Earth', 'A way of improving atomic clock accuracy levels'], correctAnswer: 1 },
      { id: 'r-easy-10-q5', type: 'purpose', questionText: 'Why does the author mention atomic clocks?', options: ['To explain why GPS satellites are expensive to build', 'To show that extreme precision is needed for accuracy', 'To argue that GPS should be made more accurate', 'To compare GPS with other navigation technologies'], correctAnswer: 1 },
    ],
  },
];



// ─── Additional Medium Passages (batch 3) ───────────────────

export const MEDIUM_PASSAGES_B3: ReadingPassage[] = [
  {
    id: 'r-med-5', difficulty: 'medium', title: 'The Placebo Effect', topic: 'Medical Science', wordCount: 275,
    text: `The placebo effect — the phenomenon in which patients experience real improvements after receiving treatments with no active therapeutic ingredients — has puzzled scientists for decades. Far from being merely "imagined," placebo responses produce measurable physiological changes including altered brain chemistry, reduced inflammation, and genuine pain relief.\n\nIn clinical trials, placebos typically produce improvement in 30 to 40 percent of patients across a wide range of conditions including pain, depression, anxiety, and even Parkinson's disease. Brain imaging studies have shown that placebo painkillers trigger the release of endorphins — the body's natural opioids — in the same brain regions activated by actual morphine.\n\nSeveral factors influence placebo strength. The color and size of pills matter: red placebos work better as stimulants, while blue ones are more effective as sedatives. Injections produce stronger placebo effects than pills. Even the perceived cost of a treatment affects outcomes — patients told a placebo costs $2.50 per pill report more relief than those told it costs $0.10, despite both receiving identical sugar pills.\n\nThe doctor-patient relationship also plays a crucial role. Patients who receive warm, empathetic care report stronger placebo responses than those receiving cold, clinical interactions. This suggests that healing is not purely biochemical but also fundamentally social.\n\nEthical questions arise about using placebos intentionally. Some argue that prescribing them deceives patients. However, recent studies show that "open-label" placebos — where patients are told explicitly that they are receiving placebos — still produce significant benefits, suggesting the mechanism operates partly below conscious awareness.`,
    questions: [
      { id: 'r-med-5-q1', type: 'main_idea', questionText: 'What is the central topic of this passage?', options: ['How pharmaceutical companies test new drugs', 'The placebo effect and what influences its strength', 'Why doctors should never prescribe placebos to patients', 'The differences between pain medications and sugar pills'], correctAnswer: 1 },
      { id: 'r-med-5-q2', type: 'detail', questionText: 'What percentage of patients typically respond to placebos?', options: ['5 to 10 percent of patients studied', '15 to 20 percent of patients studied', '30 to 40 percent of patients studied', '60 to 70 percent of patients studied'], correctAnswer: 2 },
      { id: 'r-med-5-q3', type: 'vocabulary', questionText: 'The word "mechanism" in the last paragraph refers to:', options: ['A physical machine used in hospitals', 'The underlying process that makes placebos work', 'A type of medical equipment for diagnosis', 'The legal system governing drug prescriptions'], correctAnswer: 1 },
      { id: 'r-med-5-q4', type: 'inference', questionText: 'What can be inferred about "open-label" placebos?', options: ['They never work because patients know the truth', 'They work even when patients know they are placebos', 'They are illegal in most countries around world', 'They are more expensive than real medications today'], correctAnswer: 1 },
      { id: 'r-med-5-q5', type: 'purpose', questionText: 'Why does the author discuss pill color and perceived cost?', options: ['To argue that placebos should be made more colorful', 'To show that psychological context affects treatment outcomes', 'To criticize pharmaceutical companies for overcharging patients', 'To prove that expensive medications always work better'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-med-6', difficulty: 'medium', title: 'The Decline of Insects', topic: 'Ecology & Environment', wordCount: 270,
    text: `A growing body of research suggests that insect populations worldwide are declining at alarming rates. A 2019 meta-analysis published in Biological Conservation reviewed 73 studies and concluded that 40 percent of insect species are declining, with a third classified as endangered. The total mass of insects is falling by approximately 2.5 percent per year — a rate that could lead to catastrophic ecological consequences within decades.\n\nThe causes are multiple and interconnected. Agricultural intensification — particularly the widespread use of neonicotinoid pesticides — is considered the primary driver. These chemicals, designed to kill pest insects, also harm beneficial species including pollinators. Habitat loss through urbanization and monoculture farming eliminates the diverse ecosystems insects depend on. Climate change disrupts seasonal timing, creating mismatches between insect emergence and food availability.\n\nThe implications extend far beyond insects themselves. Insects pollinate approximately 75 percent of food crops and 90 percent of wild plants. They serve as the primary food source for birds, bats, freshwater fish, and amphibians. They decompose organic matter, returning nutrients to soil. Without insects, entire food webs would collapse.\n\nSome scientists compare the current situation to the early stages of a mass extinction event. Unlike charismatic species like tigers or whales, insects receive little public attention or conservation funding. Yet their ecological importance far exceeds their visibility. As biologist E.O. Wilson noted, if insects were to vanish, the environment would collapse into chaos within decades. If humans vanished, it would flourish.`,
    questions: [
      { id: 'r-med-6-q1', type: 'main_idea', questionText: 'What is the passage primarily about?', options: ['How pesticides are manufactured for agriculture', 'The global decline of insect populations and its consequences', 'Why insects are more important than large mammals', 'The best methods for conserving endangered butterflies'], correctAnswer: 1 },
      { id: 'r-med-6-q2', type: 'detail', questionText: 'At what rate is total insect mass declining per year?', options: ['About 0.5 percent per year globally', 'About 2.5 percent per year globally', 'About 10 percent per year globally', 'About 25 percent per year globally'], correctAnswer: 1 },
      { id: 'r-med-6-q3', type: 'vocabulary', questionText: 'The word "charismatic" in the last paragraph most likely means:', options: ['Very small and difficult to observe closely', 'Popular and attractive to the general public', 'Extremely dangerous and feared by most people', 'Found only in tropical regions of the world'], correctAnswer: 1 },
      { id: 'r-med-6-q4', type: 'detail', questionText: 'What percentage of food crops depend on insect pollination?', options: ['About 25 percent of food crops globally', 'About 50 percent of food crops globally', 'About 75 percent of food crops globally', 'About 95 percent of food crops globally'], correctAnswer: 2 },
      { id: 'r-med-6-q5', type: 'purpose', questionText: 'Why does the author quote E.O. Wilson at the end?', options: ['To argue that humans should worry more about themselves', 'To emphasize how critical insects are to Earth ecosystems', 'To suggest that human extinction would be beneficial overall', 'To promote Wilson as a candidate for a science award'], correctAnswer: 1 },
    ],
  },
];

// ─── Additional Hard Passages (batch 3) ─────────────────────

export const HARD_PASSAGES_B3: ReadingPassage[] = [
  {
    id: 'r-hard-4', difficulty: 'hard', title: 'The Replication Crisis in Science', topic: 'Philosophy of Science', wordCount: 405,
    text: `In 2015, a landmark study attempted to replicate 100 psychology experiments published in top journals. The results were devastating: only 36 percent of the replications produced statistically significant results matching the original findings. This "replication crisis" has since been identified across multiple scientific disciplines including medicine, economics, and neuroscience, fundamentally challenging assumptions about the reliability of published research.\n\nSeveral structural factors contribute to the problem. Publication bias — the tendency of journals to publish positive results while rejecting null findings — creates a distorted scientific record. Researchers face intense pressure to produce novel, significant results for career advancement. This incentive structure encourages practices known collectively as "p-hacking": selectively reporting favorable outcomes, testing multiple hypotheses without correction, or stopping data collection when results reach significance.\n\nThe statistical threshold itself compounds the problem. The conventional significance level of p < 0.05 means that even with perfect methodology, 1 in 20 tested hypotheses will appear significant by chance alone. In fields where researchers test many hypotheses simultaneously, false positives accumulate rapidly. Some statisticians argue the threshold should be lowered to p < 0.005, which would reduce false positives but also reduce statistical power for detecting genuine effects.\n\nMethodological solutions have gained traction. Pre-registration — publicly committing to hypotheses and analysis plans before collecting data — prevents post-hoc rationalization. Registered Reports, a publishing format where journals accept papers based on methodology before results are known, eliminates publication bias entirely. Open data and code sharing enables independent verification.\n\nHowever, systemic reform faces resistance. The current system rewards productivity and novelty over rigor. Tenure committees and funding agencies still prioritize publication counts and journal prestige. Until incentive structures change, individual methodological improvements will struggle against institutional pressures that reward questionable practices.\n\nThe crisis has broader epistemological implications. If a substantial fraction of published findings are false, then textbooks, policy decisions, and medical treatments built on those findings may be unreliable. Some philosophers of science argue this reveals that scientific knowledge is more provisional and socially constructed than the public typically assumes — not because science is flawed in principle, but because it is conducted by humans operating within imperfect institutions.`,
    questions: [
      { id: 'r-hard-4-q1', type: 'main_idea', questionText: 'What is the central argument of this passage?', options: ['Psychology is not a legitimate scientific field at all', 'Published scientific findings are often unreliable due to structural problems', 'Statistical methods in science are always completely wrong', 'Open data sharing will solve all problems in scientific research'], correctAnswer: 1 },
      { id: 'r-hard-4-q2', type: 'detail', questionText: 'What percentage of psychology replications produced matching results?', options: ['Only 15 percent matched original findings', 'Only 36 percent matched original findings', 'About 64 percent matched original findings', 'About 85 percent matched original findings'], correctAnswer: 1 },
      { id: 'r-hard-4-q3', type: 'vocabulary', questionText: 'The term "p-hacking" as used in the passage refers to:', options: ['A legitimate statistical technique taught in universities', 'Manipulating data analysis to achieve significant results', 'A type of computer hacking that targets research databases', 'The standard process of setting statistical thresholds properly'], correctAnswer: 1 },
      { id: 'r-hard-4-q4', type: 'purpose', questionText: 'Why does the author discuss "Registered Reports"?', options: ['To criticize journals for accepting too many papers', 'To present a solution that eliminates publication bias', 'To argue that all research should be done in secret', 'To explain why some researchers refuse to share data'], correctAnswer: 1 },
      { id: 'r-hard-4-q5', type: 'inference', questionText: 'Based on the passage, what does the author imply about scientific reform?', options: ['It will happen quickly because everyone agrees on solutions', 'It is blocked by institutional incentives that reward current practices', 'It is unnecessary because science is already perfectly reliable', 'It should focus only on psychology and ignore other fields'], correctAnswer: 1 },
    ],
  },
  {
    id: 'r-hard-5', difficulty: 'hard', title: 'The Tragedy of the Commons Revisited', topic: 'Economics & Political Theory', wordCount: 390,
    text: `In 1968, ecologist Garrett Hardin published "The Tragedy of the Commons," arguing that individuals acting in rational self-interest will inevitably deplete shared resources. His classic example involved herders on a common pasture: each herder benefits from adding one more animal, while the cost of overgrazing is distributed among all users. Rational individual behavior thus leads to collective ruin.\n\nHardin's framework profoundly influenced environmental policy, providing intellectual justification for either privatization or state regulation of common resources. However, subsequent research — most notably by Nobel laureate Elinor Ostrom — demonstrated that Hardin's analysis was historically and empirically incomplete.\n\nOstrom studied communities worldwide that successfully managed common resources for centuries without either privatization or government intervention. From Swiss alpine meadows to Japanese fishing villages to Spanish irrigation systems, she documented how communities develop sophisticated institutional arrangements — including clear boundaries, graduated sanctions, conflict-resolution mechanisms, and participatory rule-making — that prevent overexploitation.\n\nThe critical insight was that Hardin assumed isolated, anonymous actors unable to communicate or establish trust. In reality, users of common resources typically know each other, communicate regularly, and can develop and enforce social norms. The "tragedy" only occurs under specific conditions: open access (no defined group of users), lack of communication, absence of social norms, and inability to sanction violators.\n\nOstrom's work has implications beyond resource management. Digital commons — open-source software, Wikipedia, creative commons content — demonstrate that complex collaborative production can thrive without either market or state coordination. These systems rely on intrinsic motivation, peer recognition, and community governance rather than profit incentives or regulatory mandates.\n\nContemporary environmental challenges complicate both Hardin's and Ostrom's frameworks. Climate change, ocean acidification, and biodiversity loss occur at scales that exceed any community's capacity for self-governance. The "users" of the atmospheric commons number eight billion and share no community bonds. Here, Hardin's pessimism may be more warranted — yet the institutional design principles Ostrom identified may still inform solutions, if they can be scaled through international cooperation.`,
    questions: [
      { id: 'r-hard-5-q1', type: 'main_idea', questionText: 'What is the passage primarily about?', options: ['Why all common resources should be privately owned', 'The debate over how shared resources can be managed successfully', 'A biography of Elinor Ostrom and her Nobel Prize work', 'Why climate change cannot be solved by any institution'], correctAnswer: 1 },
      { id: 'r-hard-5-q2', type: 'detail', questionText: 'According to the passage, what did Ostrom find communities developed?', options: ['Private property rights for all natural resources available', 'Sophisticated institutional arrangements to prevent overexploitation', 'Government regulations enforced by military force always', 'Technologies that made resources unlimited for everyone using them'], correctAnswer: 1 },
      { id: 'r-hard-5-q3', type: 'vocabulary', questionText: 'The phrase "graduated sanctions" most likely means:', options: ['Immediate severe punishment for any violation committed', 'Penalties that increase in severity for repeat offenses', 'University-level education about resource management topics', 'International trade restrictions between countries competing'], correctAnswer: 1 },
      { id: 'r-hard-5-q4', type: 'inference', questionText: 'Based on the passage, why is climate change harder to solve than local commons?', options: ['Because the science of climate change is not yet settled', 'Because the users are too numerous and lack community bonds', 'Because governments have already solved all local commons issues', 'Because Ostrom proved her methods work at any possible scale'], correctAnswer: 1 },
      { id: 'r-hard-5-q5', type: 'purpose', questionText: 'Why does the author mention Wikipedia and open-source software?', options: ['To argue that technology will solve all environmental problems', 'To show that commons can work in digital spaces without markets', 'To criticize companies that charge money for their software', 'To prove that Hardin was completely wrong about everything'], correctAnswer: 1 },
    ],
  },
];
