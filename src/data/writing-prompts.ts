// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH — Writing Trial Prompts
// Task 1: Integrated Summary (read passage → summarize)
// Task 2: Independent Essay (opinion/argument)
// 12 prompts per task type = 144 possible combinations
// ═══════════════════════════════════════════════════════════

export interface WritingPrompt {
  id: string;
  passage?: string;
  passageTitle?: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  timeMinutes: number;
}

// ─── Task 1: Integrated Summary Prompts (12) ────────────────

export const TASK1_PROMPTS: WritingPrompt[] = [
  {
    id: 'w-t1-1',
    passageTitle: 'The Rise of Remote Work',
    passage: `The COVID-19 pandemic accelerated a shift toward remote work that had been gradually building for decades. Before 2020, approximately 5 percent of full-time employees worked from home. By 2023, that figure had risen to nearly 30 percent, with another 30 percent working in hybrid arrangements. Companies discovered that many roles could be performed effectively without physical office presence, leading to reduced real estate costs and access to a wider talent pool. However, critics argue that remote work erodes company culture, makes collaboration more difficult, and can lead to employee isolation and burnout. Studies show mixed results: while productivity often increases in the short term, long-term innovation and mentorship may suffer without face-to-face interaction.`,
    prompt: 'Summarize the main points of the passage above. Include both the benefits and drawbacks of remote work mentioned in the text. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-2',
    passageTitle: 'Social Media and Mental Health',
    passage: `Research into the relationship between social media use and mental health has produced complex and sometimes contradictory findings. A 2019 study published in the Journal of Social and Clinical Psychology found that limiting social media use to 30 minutes per day significantly reduced levels of anxiety, depression, and loneliness compared to a control group. The study attributed this to decreased social comparison and fear of missing out (FOMO). However, other researchers point out that social media also provides valuable social connection, particularly for isolated individuals and marginalized communities who may lack local support networks. The platform design itself matters: passive scrolling appears more harmful than active engagement such as commenting and messaging. Mental health professionals generally recommend mindful usage rather than complete abstinence.`,
    prompt: 'Summarize the key findings and perspectives presented in the passage. Include both positive and negative effects discussed. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-3',
    passageTitle: 'Artificial Intelligence in Healthcare',
    passage: `Artificial intelligence is transforming healthcare in ways that were unimaginable a decade ago. AI systems can now analyze medical images with accuracy matching or exceeding that of experienced radiologists, detecting cancers, fractures, and eye diseases at early stages. In drug discovery, AI has reduced the time to identify promising drug candidates from years to months. Predictive models can identify patients at risk of developing conditions like diabetes or heart disease before symptoms appear, enabling preventive interventions. However, significant challenges remain. AI systems trained on biased datasets may perpetuate health disparities, performing less accurately for underrepresented populations. Questions of liability arise when AI makes errors — who is responsible when an algorithm misses a diagnosis? Additionally, the "black box" nature of deep learning models makes it difficult for doctors to understand and explain AI recommendations to patients.`,
    prompt: 'Summarize the passage, covering both the advances and challenges of AI in healthcare. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-4',
    passageTitle: 'The Decline of Biodiversity',
    passage: `Earth is experiencing its sixth mass extinction event, but unlike previous ones caused by asteroids or volcanic eruptions, this one is driven entirely by human activity. The Living Planet Index reports a 69 percent average decline in monitored wildlife populations between 1970 and 2018. Habitat destruction — primarily from agriculture, which now occupies 50 percent of habitable land — is the leading cause, followed by overexploitation, invasive species, pollution, and climate change. The loss is not merely aesthetic; biodiversity underpins ecosystem services worth an estimated $125 trillion annually, including pollination, water purification, carbon sequestration, and disease regulation. Once species disappear, these services cannot be artificially replicated at scale. Conservation efforts have shown that recovery is possible — protected areas, species reintroduction programs, and habitat restoration have produced measurable results — but the pace of protection lags far behind the rate of destruction.`,
    prompt: 'Summarize the main arguments of the passage, including causes of biodiversity loss, its importance, and potential solutions mentioned. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-5',
    passageTitle: 'The Gig Economy',
    passage: `The gig economy — characterized by short-term contracts and freelance work as opposed to permanent jobs — has grown explosively in the past decade. Platforms like Uber, Fiverr, and DoorDash have created opportunities for millions to earn income with unprecedented flexibility. Workers can choose their hours, work from anywhere, and pursue multiple income streams simultaneously. Proponents argue this represents a democratization of work, freeing people from rigid corporate structures. However, critics point to serious downsides: gig workers typically lack health insurance, retirement benefits, sick pay, and job security. They bear all business risks while platforms capture most of the value. Research shows that while top earners thrive, the majority of gig workers earn less than minimum wage after accounting for expenses. Labor advocates call for regulatory frameworks that provide basic protections without eliminating the flexibility that makes gig work attractive.`,
    prompt: 'Summarize the passage, presenting both the advantages and disadvantages of the gig economy as discussed by the author. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-6',
    passageTitle: 'Space Exploration: Public vs Private',
    passage: `For decades, space exploration was exclusively the domain of government agencies like NASA and Roscosmos. The enormous costs, high risks, and uncertain returns made space unattractive to private enterprise. This changed dramatically in the 2010s when companies like SpaceX demonstrated that rockets could be built and launched at a fraction of government costs. SpaceX's reusable Falcon 9 reduced launch costs by approximately 90 percent compared to traditional expendable rockets. Private companies now deliver cargo to the International Space Station, launch commercial satellites, and plan ambitious missions to Mars. Supporters argue that competition and profit motivation drive innovation faster than government bureaucracy. Critics counter that privatization may lead to the commercialization of space resources without adequate international oversight, potentially creating new forms of inequality. They also note that private companies focus on profitable activities while fundamental science — which rarely generates immediate revenue — may be neglected.`,
    prompt: 'Summarize the shift from public to private space exploration described in the passage, including arguments for and against this change. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-7',
    passageTitle: 'Urban Farming Revolution',
    passage: `Vertical farms — indoor facilities that grow crops in stacked layers using LED lighting and hydroponic systems — are emerging as a potential solution to urban food insecurity. These farms can produce up to 350 times more food per square meter than traditional agriculture, use 95 percent less water, and eliminate the need for pesticides. Because they operate year-round regardless of weather, they provide consistent supply without the transportation emissions associated with shipping food long distances. Several major cities, including Singapore, Dubai, and Tokyo, have invested heavily in vertical farming infrastructure. However, the technology faces significant obstacles. Energy consumption is extremely high — artificial lighting requires substantial electricity, and unless powered by renewable sources, the carbon footprint may exceed that of conventional farming. Initial capital costs are also prohibitive, often requiring $10-30 million per facility. Currently, vertical farms remain economically viable primarily for high-value leafy greens and herbs, not staple crops like wheat or rice.`,
    prompt: 'Summarize the passage, including the benefits of vertical farming and the challenges it faces. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-8',
    passageTitle: 'The Psychology of Procrastination',
    passage: `Procrastination is not simply a matter of poor time management or laziness — it is fundamentally an emotion regulation problem. Research by Timothy Pychyl at Carleton University shows that people procrastinate to avoid negative emotions associated with a task: boredom, anxiety, frustration, or self-doubt. The immediate mood repair of avoiding the task outweighs the long-term consequences in the procrastinator's mind, a phenomenon psychologists call "temporal discounting." Chronic procrastinators show structural differences in the amygdala — the brain's emotional processing center — suggesting a neurological basis for the behavior. Effective interventions focus on emotional regulation rather than scheduling techniques. "Implementation intentions" — specific if-then plans like "If I feel the urge to check my phone, I will take three deep breaths and continue working" — have been shown to reduce procrastination by 40 percent. Self-compassion also helps: studies find that people who forgive themselves for past procrastination are less likely to repeat the behavior.`,
    prompt: 'Summarize the passage, explaining what causes procrastination and what methods are effective in addressing it. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-9',
    passageTitle: 'Microplastics in the Food Chain',
    passage: `Microplastics — plastic fragments smaller than 5 millimeters — have been found in every environment on Earth, from Arctic ice to the deep ocean floor. Recent studies have revealed their pervasive presence in the human food chain. Research published in Environmental Science & Technology estimated that the average person ingests approximately 50,000 microplastic particles annually through food and water, with an additional 50,000 inhaled. Seafood is a primary vector: mussels contain an average of 90 particles per serving, and fish accumulate microplastics in their digestive systems. Bottled water contains significantly more microplastics than tap water — up to 22 times more per liter. The health effects of chronic microplastic ingestion remain poorly understood. Laboratory studies suggest they may cause inflammation, cellular damage, and serve as carriers for toxic chemicals. However, translating laboratory findings to real-world health impacts is difficult, and long-term epidemiological studies are only beginning.`,
    prompt: 'Summarize the passage, covering the sources of microplastic exposure and what is currently known about health risks. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-10',
    passageTitle: 'The Future of Work: Automation and Jobs',
    passage: `A widely cited 2013 Oxford University study predicted that 47 percent of US jobs were at high risk of automation within two decades. This alarming figure sparked global debate about technological unemployment. However, the reality has proven more nuanced. While automation has eliminated specific tasks within jobs, it has rarely eliminated entire occupations. Bank tellers were not replaced by ATMs — instead, their roles shifted toward customer service and financial advising. Similarly, spreadsheet software did not eliminate accounting jobs but transformed them. Economists distinguish between "task displacement" and "job displacement," arguing that most jobs involve a bundle of tasks, only some of which are automatable. Historical evidence suggests that technology creates more jobs than it destroys, though the new jobs require different skills and may emerge in different locations. The critical challenge is not total job loss but the speed of transition and the adequacy of retraining programs for displaced workers.`,
    prompt: 'Summarize the passage, explaining the predicted impact of automation on jobs and what the evidence actually shows. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-11',
    passageTitle: 'Sleep Deprivation in Modern Society',
    passage: `The Centers for Disease Control has called insufficient sleep a "public health epidemic." Over one-third of adults in developed nations regularly fail to achieve the recommended seven to nine hours of sleep, with average sleep duration declining by over an hour compared to 50 years ago. The consequences are severe and wide-ranging. Sleep deprivation impairs cognitive function equivalent to alcohol intoxication — after 17 hours awake, performance deteriorates to the level of a 0.05% blood alcohol concentration. Chronic sleep loss increases risk of obesity by 55 percent, heart disease by 48 percent, and type 2 diabetes by 33 percent. The economic cost is estimated at $411 billion annually in the US alone, primarily through lost productivity and healthcare costs. Despite these facts, society continues to undervalue sleep. Work cultures that celebrate long hours, 24-hour digital connectivity, and insufficient school start times for adolescents all contribute to systematic sleep deprivation.`,
    prompt: 'Summarize the passage, including the health consequences of sleep deprivation and the societal factors contributing to it. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
  {
    id: 'w-t1-12',
    passageTitle: 'The Digital Divide',
    passage: `Despite rapid global internet expansion, a significant digital divide persists between and within nations. Approximately 2.7 billion people — roughly one-third of humanity — remain offline. The gap disproportionately affects rural communities, women, elderly populations, and people in low-income countries. In sub-Saharan Africa, only 36 percent of the population has internet access, compared to 93 percent in Europe. The consequences extend beyond mere connectivity. As government services, education, healthcare, and economic opportunities increasingly move online, those without access face compounding disadvantages. During the COVID-19 pandemic, students without reliable internet fell months behind their connected peers. However, the divide is not merely about infrastructure. Even where connectivity exists, barriers including digital literacy, language (80 percent of online content is in just 10 languages), affordability, and relevant local content prevent meaningful participation. Bridging the digital divide requires addressing all these dimensions simultaneously.`,
    prompt: 'Summarize the passage, explaining the scope of the digital divide and the multiple barriers to meaningful internet access. Write 150-225 words.',
    minWords: 150, maxWords: 225, timeMinutes: 20,
  },
];


// ─── Task 2: Independent Essay Prompts (12) ─────────────────

export const TASK2_PROMPTS: WritingPrompt[] = [
  {
    id: 'w-t2-1',
    prompt: 'Do you agree or disagree with the following statement? "Technology has made people less creative than they were in the past." Use specific reasons and examples to support your opinion. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-2',
    prompt: 'Some people believe that university education should be free for everyone, while others argue that students should pay for their education. Which view do you support? Use specific reasons and examples to explain your position. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-3',
    prompt: 'Do you agree or disagree with the following statement? "Success in life comes more from taking risks than from careful planning." Use specific reasons and examples to support your answer. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-4',
    prompt: 'Some people prefer to live in a big city, while others prefer a small town or rural area. Which do you prefer and why? Use specific reasons and examples to develop your essay. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-5',
    prompt: 'Do you agree or disagree with the following statement? "It is better to have a broad knowledge of many subjects than to specialize in one area." Use specific reasons and examples to support your answer. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-6',
    prompt: 'Some people believe that children should begin learning a foreign language in primary school. Others think it is better to wait until secondary school. Which position do you support? Use reasons and examples. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-7',
    prompt: 'Do you agree or disagree with the following statement? "People are never too old to learn new things." Use specific reasons and examples from your own experience or observations. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-8',
    prompt: '"The best way to learn about a country is to visit it in person rather than read about it in books or online." Do you agree or disagree? Use specific reasons and examples to support your position. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-9',
    prompt: 'Some people think that governments should spend money on exploring outer space. Others think this money should be used to solve problems on Earth. Which view do you agree with? Explain your reasoning with examples. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-10',
    prompt: 'Do you agree or disagree with the following statement? "Working from home is better for both employees and employers than working in an office." Use specific reasons and examples. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-11',
    prompt: '"In the modern world, it is more important to have practical skills than academic knowledge." Do you agree or disagree with this statement? Support your answer with specific reasons and examples. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
  {
    id: 'w-t2-12',
    prompt: 'Some people believe that competition between students in school is beneficial, while others think cooperation is more important. Which approach do you think is better for learning? Use specific reasons and examples. Write at least 300 words.',
    minWords: 300, maxWords: 600, timeMinutes: 25,
  },
];

// Stats:
// Task 1 (Integrated Summary): 12 prompts
// Task 2 (Independent Essay): 12 prompts
// Unique combinations per test: 12 × 12 = 144
// Topics span: technology, education, health, environment, economics,
//   society, psychology, science, work, space, food, digital equity
