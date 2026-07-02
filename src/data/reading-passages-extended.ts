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
