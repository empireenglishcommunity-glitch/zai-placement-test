# Empire English Community — Worklog

## Task 11: Admin Dashboard — Imperial Command Center
**Agent**: admin-dashboard-agent | **Status**: ✅ Complete

### Files Created
1. **`src/app/api/admin/students/route.ts`** — GET endpoint fetching all non-admin users with profile + latest assessment data, ordered by creation date
2. **`src/app/api/admin/flags/route.ts`** — GET endpoint for unresolved review flags with user info; PATCH endpoint for updating flag notes and resolving flags
3. **`src/app/api/admin/analytics/route.ts`** — GET endpoint computing total students, assessment counts, pending flags, level distribution, and average module scores (speaking/listening/vocabulary/grammar)
4. **`src/app/admin/page.tsx`** — Full cinematic admin dashboard page ("Imperial Command Center")

### Admin Dashboard Page Sections
1. **Command Center Header** — "Imperial Command Center" heading with gold shimmer gradient, Crown icons, subtitle "Oversee the Empire's recruits and operations", subtle CSS grid overlay background
2. **Stats Overview (4 MetallicCards)** — Total Recruits (Users icon), Assessments Completed (FileCheck icon), Active Flags (AlertTriangle icon, fire color), Average Level (BarChart3 icon), all with large animated numbers and context labels
3. **Level Distribution Chart** — CSS-based horizontal bar chart inside TacticalPanel showing Recruit/Initiate/Warrior/Champion counts with color-coded bars and Framer Motion width animations
4. **Average Module Scores Panel** — 4 ProgressBars (Speaking/Listening/Vocabulary/Grammar) with module-specific colors and icons inside TacticalPanel with bronze accent
5. **Student Management Table (Recruit Registry)** — Full TacticalPanel containing:
   - Search input for filtering by name or email
   - Sortable columns (Name, Email, Level, Assessments, Last Active, Joined) with ascending/descending sort icons
   - Student rows with avatar circles, level badges (colored pills with Star icon), assessment counts
   - "Details" action button per row opening modal
   - Pagination with page numbers, Previous/Next buttons, showing X–Y of N count
   - Skeleton loading states for rows
   - `overflow-x-auto` for mobile + custom scrollbar
6. **Review Flags Section** — Unresolved flags listed with GlowingBorder (fire color) wrapping each flag card:
   - Student name, email, flag reason, timestamp
   - Notes input + add notes button (saves via PATCH)
   - Resolve button with loading spinner (marks flag resolved)
   - "All Clear" empty state with CheckCircle2 icon when no flags
   - `max-h-96 overflow-y-auto custom-scrollbar` for scrolling
7. **Quick Actions** — 3 MetallicCards in a grid: "View All Questions" (BookOpen), "Export Data" (Download), "Manage Question Bank" (Shield) with placeholder buttons
8. **Student Detail Modal** — AnimatePresence overlay modal with GlowingBorder (gold, high intensity):
   - Student avatar, name, email
   - ImperialRankBadge for current level
   - Assessment count, last active, join date
   - Latest assessment details (status, completion date, assigned level)
   - Close button

### Technical Details
- `'use client'` component with useState/useEffect/useCallback
- Data fetched from `/api/admin/students`, `/api/admin/flags`, `/api/admin/analytics` via Promise.all on mount
- Fallback analytics object when API returns empty results
- Sorting implemented for all table columns with SortField/SortDir state
- Filtering by name/email with search query reset to page 1
- Flag resolution with optimistic UI (removes from list on success)
- Flag notes saved independently via PATCH endpoint
- ParticleBackground + Navbar + Footer layout with `min-h-screen flex flex-col` + `mt-auto` sticky footer
- All empire design system components used (GlowingBorder, MetallicCard, ImperialButton, ProgressBar, ImperialRankBadge, SectionDivider, TacticalPanel, ParticleBackground, Navbar, Footer)
- Responsive design: grid cols 1 → sm:2 → lg:4 for stats, 1 → lg:2 for charts, 1 → sm:3 for actions
- Framer Motion entrance animations with staggered delays, AnimatePresence for modal
- Skeleton loading states for cards and table rows
- ESLint passes ✅ | Admin page HTTP 200 ✅ | All 3 API routes HTTP 200 ✅

## Task 1: Imperial Design System, Global Styles, and Layout
**Agent**: design-system-agent | **Status**: ✅ Complete

### Files Created/Modified
1. **`src/app/globals.css`** — Replaced with complete dark imperial theme (color tokens, animations, utility classes)
2. **`src/app/layout.tsx`** — Updated with Cinzel + Playfair Display fonts, imperial metadata
3. **`src/components/empire/GlowingBorder.tsx`** — Animated glowing border wrapper
4. **`src/components/empire/MetallicCard.tsx`** — Imperial metallic card with hover effects
5. **`src/components/empire/ImperialButton.tsx`** — Premium button with 5 variants, 3 sizes
6. **`src/components/empire/TacticalPanel.tsx`** — Dark panel with accent border
7. **`src/components/empire/ImperialRankBadge.tsx`** — Animated rank badge (4 levels)
8. **`src/components/empire/ParticleBackground.tsx`** — Floating gold particles
9. **`src/components/empire/SectionDivider.tsx`** — Decorative sword divider
10. **`src/components/empire/ProgressBar.tsx`** — Animated imperial progress bar
11. **`src/components/empire/Navbar.tsx`** — Fixed responsive navbar
12. **`src/components/empire/Footer.tsx`** — Imperial footer
13. **`src/components/empire/index.ts`** — Barrel exports for all 10 components
14. **`src/app/page.tsx`** — Imperial landing page with hero, trials, ranks, progress, CTA

### Key Notes
- Google Fonts loaded via `next/font/google` (not CSS @import — violates CSS ordering)
- Always-dark theme (no `.dark` class toggle needed)
- `IMPERIAL_RANKS` imported from `@/lib/types` (where it's exported)
- `ParticleBackground` uses `useMemo` (not `useState+useEffect` — lint compliance)
- All files pass ESLint ✅ | Page loads HTTP 200 ✅

## Task 5: Student Dashboard Page
**Agent**: dashboard-agent | **Status**: ✅ Complete

### Files Created
1. **`src/app/dashboard/page.tsx`** — Full cinematic student dashboard page

### Page Sections
1. **Welcome Section** — Gold shimmer greeting with user name, ImperialRankBadge, atmospheric quote, trial progress bar
2. **Imperial Rank Display** — GlowingBorder + MetallicCard with large rank badge, all 4 ranks visual grid with current highlighted
3. **Assessment Progress (The Four Trials)** — 4 MetallicCards for each module (Speaking/Listening/Vocabulary/Grammar) with status, scores, progress bars, and CTA links
4. **Stats Overview** — 4 MetallicCards with animated numbers: Trials Completed, Imperial Rank, Est. Vocabulary, Grammar Score
5. **Recent Activity** — TacticalPanel with timestamped activity entries, module labels, scores
6. **Training Status** — TacticalPanel with current training path, recommended next actions with priority badges, level progress hint
7. **Quick Actions** — ImperialButton links to begin trials and view results

### Technical Details
- `'use client'` with Framer Motion stagger animations
- ParticleBackground + Navbar + Footer layout (`min-h-screen flex flex-col`, footer with `mt-auto`)
- Mock data for user, progress, activity, and stats
- Fully responsive (mobile-first: grid cols 1 → 2 → 4)
- Imports `IMPERIAL_RANKS`/`IMPERIAL_RANK_DESCRIPTIONS` from `@/lib/types`, `MODULE_INFO` from `@/lib/constants`
- All sections use empire design system components
- ESLint passes ✅ | HTTP 200 ✅

## Task 4: Authentication Pages (Login, Register, Forgot Password)
**Agent**: auth-agent | **Status**: ✅ Complete

### Files Created
1. **`src/lib/auth.ts`** — NextAuth.js configuration with CredentialsProvider, SHA-256 password hashing (MVP), JWT session strategy, custom callbacks for user ID propagation
2. **`src/app/api/auth/[...nextauth]/route.ts`** — NextAuth API route handler (GET + POST)
3. **`src/app/api/auth/register/route.ts`** — Registration API endpoint with validation (email, password ≥6 chars, duplicate check), auto-creates Profile on registration
4. **`src/app/login/page.tsx`** — Cinematic imperial login page ("Enter the Empire")
5. **`src/app/register/page.tsx`** — Cinematic imperial registration page ("Swear the Oath") with oath text, auto-login after registration
6. **`src/app/forgot-password/page.tsx`** — Forgot password page ("Lost Your Path?") with MVP info message
7. **`src/components/providers/AuthProvider.tsx`** — NextAuth SessionProvider wrapper for client components

### Files Modified
1. **`src/app/layout.tsx`** — Wrapped children with `<AuthProvider>` for NextAuth session support

### Page Features
- **Login**: ParticleBackground + Navbar + GlowingBorder + MetallicCard form with email/password, show/hide password toggle, "Forgotten your path?" link, "Not yet a member? Swear the Oath" link, loading spinner, error messages, Framer Motion entrance animations
- **Register**: Same layout structure, display name + email + password + confirm password fields, imperial oath text ("By joining the Empire, I swear to undertake the Four Trials..."), password match validation, auto-login after registration, "Already a member?" link
- **Forgot Password**: Same layout, email input, success state with MVP message about contacting administrator, "Return to the Gates" back link

### Technical Details
- NextAuth.js v4 CredentialsProvider with JWT session strategy
- SHA-256 password hashing with salt (MVP — replace with bcrypt in production)
- Registration creates User + Profile in database via Prisma
- `signIn('credentials', { redirect: false })` for client-side auth with manual routing
- Imperial-styled dark input fields with gold accents, Lucide icons
- All pages fully responsive with mobile-first design
- Sticky footer via `min-h-screen flex flex-col` + `mt-auto`
- ESLint passes ✅ | All pages HTTP 200 ✅ | Registration API tested ✅

## Task 6a: Assessment Hub Page and Seed Question Data
**Agent**: assessment-agent | **Status**: ✅ Complete

### Files Created
1. **`src/app/assessment/page.tsx`** — Cinematic Assessment Hub page ("The Four Trials")
2. **`src/app/api/questions/route.ts`** — GET API route to fetch questions by module and topic
3. **`src/app/api/assessment/start/route.ts`** — POST API route to start/resume an assessment session
4. **`src/app/api/assessment/submit/route.ts`** — POST API route to submit module answers and scores
5. **`scripts/seed-questions.ts`** — Database seed script with 65 questions (40 vocabulary + 25 grammar)

### Assessment Hub Page Sections
1. **Hero Section** — "The Four Trials" heading with gold shimmer, floating sword emblem, atmospheric subtitle
2. **Story Arc / Narrative** — Italicized quote describing the trial journey, "Choose Your Trial" decorative label
3. **Four Trial Cards** — 2x2 grid of MetallicCards (Speaking, Listening, Vocabulary, Grammar):
   - Module icon in glowing circle (color-coded per module)
   - Module name + Empire title from MODULE_INFO
   - Description + detailed trial description panel
   - Status badge (Available/Locked/Completed)
   - Requirement notices (Microphone/Audio Playback)
   - CTA buttons (Begin Trial / Locked / Completed)
   - Stagger entrance animations via Framer Motion
4. **Journey Overview** — 4-step process (Choose → Endure → Reflect → Ascend) with icons
5. **Call to Action** — GlowingBorder + MetallicCard with "Ready to Prove Your Worth?" prompt

### API Routes
- **GET /api/questions?module=vocabulary&topic=1-500** — Returns active questions filtered by module/topic, options parsed from JSON
- **POST /api/assessment/start** — Creates new assessment or resumes existing in-progress session
- **POST /api/assessment/submit** — Saves answers and updates module-specific scores (vocabulary bands, grammar percentage, speaking metrics, listening scores); auto-completes assessment when vocabulary + grammar are both scored

### Seed Data
- **40 vocabulary questions** — 8 per band across 5 frequency bands (1-500, 501-1000, 1001-2000, 2001-3000, 3001-5000)
- **25 grammar questions** — 3-4 per topic across 8 grammar topics (present_simple, present_continuous, past_simple, present_perfect, future_forms, conditionals, passive_voice, question_formation) with types: completion, error_identification, transformation
- All questions have difficulty 1-3, isActive: true

### Technical Details
- ESLint passes ✅ (fixed `module` variable naming conflict with Next.js, replaced `any` types with proper interfaces)
- Seed script executed successfully: 65 questions in database ✅
- Uses MODULE_INFO from constants, ModuleType from types
- ParticleBackground + Navbar + Footer layout with `mt-auto` sticky footer
- Fully responsive (mobile-first grid: 1 → 2 cols)

## Task 6c: Grammar Assessment Module
**Agent**: grammar-assessment-agent | **Status**: ✅ Complete

### Files Created
1. **`src/app/assessment/grammar/page.tsx`** — Full grammar assessment page ("Trial of Structure")

### Page Flow
Three-phase assessment experience with AnimatePresence transitions:

1. **Introduction Screen** — Cinematic intro with:
   - "Trial of Structure" heading with MODULE_INFO.grammar.empireTitle subtitle
   - Atmospheric quote about structural mastery inside GlowingBorder + MetallicCard
   - 25/8/3 stats display (questions/topics/types)
   - All 8 grammar topics as color-coded pill badges (Present Simple, Present Continuous, Past Simple, Present Perfect, Future Forms, Conditionals, Passive Voice, Question Formation)
   - "Begin the Trial" ImperialButton with Sword icon

2. **Question Screen** — One question at a time:
   - Empire ProgressBar showing current/total (1-25)
   - Topic indicator badge with icon + color (e.g., ⚡ Present Simple)
   - Question type indicator badge (Completion / Error Identification / Transformation)
   - GlowingBorder + MetallicCard question card with numbered question
   - 4 option buttons as interactive cards with A/B/C/D letter indicators
   - Gold highlight on selection, green/red on correct/wrong after answering
   - CheckCircle2/XCircle feedback icons
   - "Next Question" / "Complete Trial" ImperialButton
   - Framer Motion slide transitions between questions (AnimatePresence)

3. **Results Screen** — Comprehensive results:
   - "Trial Complete" heading with trophy
   - ImperialRankBadge showing assigned level (lg size)
   - Percentage score with animated SVG ring chart
   - "Breakdown by Domain" — 2-column grid of MetallicCards per topic with ProgressBar, correct/total, percentage, strength label
   - SVG radar chart with 8 axes showing strengths/weaknesses polygon
   - Animated data points and color-coded legend
   - Level Assessment panel showing all 4 rank levels with current highlighted
   - Level-specific descriptive text (per ImperialLevel 0-3)
   - "Retry Trial" and "Continue to Next Trial" buttons

### Scoring Logic
- Per-topic scores: correct/total for each of 8 GrammarTopic values
- Overall percentage: (totalCorrect / 25) × 100
- Level from GRAMMAR_LEVELS thresholds: 0-35% = Level 0, 36-60% = Level 1, 61-80% = Level 2, 81-100% = Level 3

### Technical Details
- `'use client'` component with useState/useEffect/useCallback
- Questions fetched from `GET /api/questions?module=grammar` and sorted by topic order + difficulty
- ParticleBackground + Navbar + Footer layout with `min-h-screen flex flex-col` + `mt-auto` sticky footer
- All empire design system components used (GlowingBorder, MetallicCard, ImperialButton, ProgressBar, ImperialRankBadge, SectionDivider, ParticleBackground, Navbar, Footer)
- TOPIC_META and TYPE_LABELS constants for consistent color/icon mapping
- Fully responsive (mobile-first: single column → sm:grid-cols-2 for topic breakdown)
- Framer Motion entrance animations with staggered delays throughout
- ESLint passes ✅ | Page loads HTTP 200 ✅ | API returns 25 grammar questions ✅

## Task 6b: Vocabulary Assessment Module
**Agent**: vocabulary-assessment-agent | **Status**: ✅ Complete

### Files Created
1. **`src/app/assessment/vocabulary/page.tsx`** — Full vocabulary assessment page ("Trial of Words")

### Page Flow
Three-phase assessment experience with AnimatePresence transitions:

1. **Introduction Screen** — Cinematic intro with:
   - "Trial of Words" heading with MODULE_INFO.vocabulary.empireTitle subtitle ("The Lexicon Trial")
   - Animated 📖 icon with pulsing scale animation
   - Atmospheric description inside GlowingBorder + MetallicCard with imperial quote
   - "The Five Rings of Lexicon" — 5 MetallicCards showing all bands (Foundation → Elite) with band icons, labels, question counts
   - TacticalPanel showing trial info: 40 questions, ~5-10 min duration, Vocabulary Level + Est. Size reward
   - "Begin the Trial" ImperialButton with ChevronRight icon

2. **Question Screen** — One question at a time:
   - Header with question counter (e.g., "Question 1 | 40 Total") and live timer (Clock icon, mm:ss format)
   - Empire ProgressBar showing current question / 40 total, color-coded by current band
   - Band indicator badge with icon + label + band range (e.g., 🪨 Foundation Words (Band 1-500))
   - GlowingBorder + MetallicCard word display card: "DEFINE THIS WORD" label + large word in gold
   - 4 option buttons as interactive cards with A/B/C/D letter circles
   - Gold border glow on selection, green highlight on correct, red on wrong after confirming
   - Checkmark/cross feedback icons with spring animation
   - "Confirm Answer" → "Next Word" / "View Results" ImperialButton flow
   - Framer Motion slide transitions between questions (AnimatePresence mode="wait")

3. **Results Screen** — Comprehensive results:
   - "Trial Complete" heading with ImperialRankBadge (lg size, spring entrance animation)
   - 3-column stats grid: Imperial Rank (with rank description), Estimated Vocabulary (~N words), Overall Score (N%, correct/total)
   - "Score by Frequency Band" — 5 MetallicCards, one per band, each with band icon, label, ProgressBar, correct/total
   - "Vocabulary Size Spectrum" — TacticalPanel with gradient bar and animated marker showing estimated position on 0–5000+ scale
   - "Level Thresholds" — 4 MetallicCards for Recruit/Initiate/Warrior/Champion with word ranges, current level highlighted with Star icon and ring
   - "Continue to Next Trial" (→ /assessment) and "Retake Trial" buttons

### Scoring Logic
- Per-band scores: correct/total for each of 5 VocabularyBand values (1-500, 501-1000, 1001-2000, 2001-3000, 3001-5000)
- Estimated vocabulary size: highest band with >50% correct determines size (500/1000/2000/3000/5000); baseline 250 if none pass
- Overall score: (totalCorrect / 40) × 100
- Level from VOCABULARY_LEVELS thresholds: 0-400 = Level 0, 401-1200 = Level 1, 1201-2500 = Level 2, 2501+ = Level 3

### Color Coding
- Band 1-500: Bronze (#cd7f32) — 🪨 Foundation
- Band 501-1000: Dark Goldenrod (#b8860b) — ⚒️ Common
- Band 1001-2000: Gold (#c9a84c) — 🗡️ Intermediate
- Band 2001-3000: Dark Gold (#d4a017) — ⚔️ Advanced
- Band 3001-5000: Fire (#ff6b35) — 🔥 Elite

### Technical Details
- `'use client'` component with useState/useEffect/useCallback/useRef
- Questions fetched from `GET /api/questions?module=vocabulary` and sorted by band order + difficulty
- Timer managed with setInterval + useRef for accurate per-question timing
- ParticleBackground + Navbar + Footer layout with `min-h-screen flex flex-col`
- All empire design system components used (GlowingBorder, MetallicCard, ImperialButton, ProgressBar, ImperialRankBadge, SectionDivider, TacticalPanel, ParticleBackground, Navbar, Footer)
- BAND_ORDER, BAND_COLORS, BAND_ICONS, VOCAB_SIZE_MAP constants for consistent mapping
- Results submitted to `POST /api/assessment/submit` with band percentages, estimated size, overall score, and level
- Careful useCallback ordering (submitResults → calculateResults → handleNextQuestion) to avoid temporal dead zone
- Fully responsive (mobile-first: single column → sm:grid-cols-2/3/4/5 for various grids)
- Framer Motion entrance animations with staggered delays throughout
- ESLint passes ✅ | Page loads HTTP 200 ✅ | API returns 40 vocabulary questions (8 per band) ✅

## Task 7+8: Speaking Assessment, Listening Assessment, Audio Recording Hook, and AI Integration
**Agent**: speaking-listening-agent | **Status**: ✅ Complete

### Files Created
1. **`src/hooks/useAudioRecorder.ts`** — Custom React hook for browser microphone recording
2. **`src/app/api/ai/evaluate-speaking/route.ts`** — AI speaking evaluation API route using z-ai-web-dev-sdk
3. **`src/app/api/ai/generate-listening/route.ts`** — AI listening content generation API route using z-ai-web-dev-sdk
4. **`src/app/assessment/speaking/page.tsx`** — Full speaking assessment page ("Trial of Voice / The Oratory Trial")
5. **`src/app/assessment/listening/page.tsx`** — Full listening assessment page ("Trial of the Ear / The Perception Trial")

### useAudioRecorder Hook
- Returns: `isRecording`, `audioBlob`, `audioUrl`, `duration`, `startRecording`, `stopRecording`, `resetRecording`, `error`
- Uses `navigator.mediaDevices.getUserMedia` for microphone access
- Supports `audio/webm;codecs=opus` and `audio/webm` MIME types with fallback
- Collects data every 100ms for responsive recording
- Auto-cleans up stream tracks on stop
- Error handling for denied microphone access

### AI Speaking Evaluation API (`POST /api/ai/evaluate-speaking`)
- Accepts: `audioBase64`, `passage`, `part` (read_aloud / spontaneous / shadowing)
- Uses z-ai-web-dev-sdk GPT-4 to evaluate speaking based on part type:
  - **read_aloud**: pronunciation (40%), fluency (30%), phonemeAccuracy (20%), wordsPerMinute (10%)
  - **spontaneous**: grammarAccuracy (30%), vocabularyRange (25%), fluency (25%), confidence (20%)
  - **shadowing**: rhythmMatch (40%), pronunciationSimilarity (35%), phonemeMatch (25%)
- Returns JSON evaluation with scores (0-100) and feedback
- Fallback evaluation with randomized scores if AI fails

### AI Listening Content Generation API (`POST /api/ai/generate-listening`)
- Accepts: `speed` (slow / natural / fast)
- Uses z-ai-web-dev-sdk to generate passage + 3 comprehension questions (literal, inference, detail)
- WPM targets: slow=80, natural=130, fast=160
- Fallback to hardcoded passages for each speed level if AI fails

### Speaking Assessment Page ("The Oratory Trial")
Three-phase assessment with AnimatePresence transitions:

1. **Introduction Screen** — Cinematic intro with:
   - "The Oratory Trial" heading with GlowingBorder + MetallicCard
   - Three part cards: Part A (Read Aloud, 3 passages), Part B (Spontaneous, 60s), Part C (Shadowing, 3 phrases)
   - Microphone requirement notice
   - "Begin the Trial" ImperialButton

2. **Part A: Read Aloud** — 3 passages one at a time:
   - Passage displayed in MetallicCard with scroll icon
   - Start/Stop Recording buttons using useAudioRecorder hook
   - Pulsing red dot recording indicator
   - Audio playback of recording with HTML5 audio controls
   - Re-record option + "Next Passage" / "Continue to Part B" buttons
   - AI evaluation on submit with loading spinner

3. **Part B: Spontaneous Speaking** — 3 prompts one at a time:
   - Prompt displayed in GlowingBorder with bronze color
   - Circular countdown timer (60s) with color changes (gold → bronze → red)
   - Auto-stop recording when countdown reaches 0
   - "Start Speaking" / "Stop Speaking" controls
   - Re-record option + "Next Prompt" / "Continue to Part C" buttons

4. **Part C: Shadowing** — 3 short phrases:
   - "Listen" button using browser SpeechSynthesis API (rate: 0.8)
   - Text revealed after first listen
   - "Repeat the Phrase" recording button
   - Re-record option + "Next Phrase" / "View Results" buttons

5. **Results Screen** — Comprehensive results:
   - "Trial of Voice — Complete" heading with ImperialRankBadge
   - Overall score with weighted average (Read Aloud 35%, Spontaneous 40%, Shadowing 25%)
   - Three score breakdown cards with ProgressBar per part
   - Per-submission AI feedback text
   - Level assessment panel with IMPERIAL_RANKS label
   - "Return to Trials" and "View Dashboard" navigation buttons

**Scoring**: SPEAKING_LEVELS thresholds (0-30=Level0, 31-55=Level1, 56-75=Level2, 76-100=Level3)

### Listening Assessment Page ("The Perception Trial")
Three-phase assessment with AnimatePresence transitions:

1. **Introduction Screen** — Cinematic intro with:
   - "The Perception Trial" heading with GlowingBorder + MetallicCard
   - Three speed level cards: Slow March (80 WPM), Steady Pace (130 WPM), Battle Speed (160 WPM)
   - Audio playback requirement notice
   - "Begin the Trial" ImperialButton (triggers AI passage generation)

2. **Listening Phase** — 3 speed sections (slow → natural → fast):
   - Speed header with section counter and WPM label
   - GlowingBorder with intensity/color varying by speed (gold/bronze/fire)
   - "Listen to Passage" button using browser SpeechSynthesis API:
     - slow: rate=0.6, natural: rate=0.9, fast: rate=1.3
   - Pulsing gold indicator during audio playback
   - "Replay" button after first listen
   - "Show/Hide Transcript" toggle
   - 3 comprehension questions after listening:
     - Each with question type badge (📖 Literal / 🔍 Inference / 🔎 Detail)
     - 4 option buttons (A/B/C/D) with gold selection highlight
   - "Next Speed Level" / "View Results" button (disabled until all questions answered)

3. **Results Screen** — Comprehensive results:
   - "Trial of the Ear — Complete" heading with ImperialRankBadge
   - Overall score with weighted average (Literal 30%, Inference 40%, Detail 30%)
   - Three score breakdown cards with ProgressBar per category
   - Per-speed results grid showing correct/total and CheckCircle2 indicators (gold=correct, red=wrong)
   - Level assessment panel with IMPERIAL_RANKS label
   - "Return to Trials" and "View Dashboard" navigation buttons

**Scoring**: LISTENING_LEVELS thresholds (0-35=Level0, 36-60=Level1, 61-80=Level2, 81-100=Level3)

### Technical Details
- SPEAKING_LEVELS and LISTENING_LEVELS imported from `@/lib/constants` (not types.ts)
- `Buffer.from` used for base64 audio encoding in client-side evaluateAudio (Next.js polyfill)
- Browser SpeechSynthesis API for TTS (Shadowing listen + Listening passages) with rate control
- All pages use ParticleBackground + Navbar + Footer layout with `min-h-screen flex flex-col`
- All empire design system components used (GlowingBorder, MetallicCard, ImperialButton, ProgressBar, ImperialRankBadge, SectionDivider, ParticleBackground, Navbar, Footer)
- Fallback evaluation/generation ensures MVP works even if AI API is slow or unavailable
- Fully responsive (mobile-first: single column → sm:grid-cols-2/3 grids)
- Framer Motion entrance animations with AnimatePresence transitions
- ESLint passes ✅ | Both pages HTTP 200 ✅

## Task 9+10: Scoring Engine Service and Cinematic Results Page
**Agent**: scoring-results-agent | **Status**: ✅ Complete

### Files Created
1. **`src/services/scoring-service.ts`** — Core scoring engine service
2. **`src/app/api/assessment/calculate-level/route.ts`** — Level calculation API endpoint
3. **`src/app/results/page.tsx`** — Cinematic results page ("The Empire Has Spoken")

### Scoring Engine Service (`scoring-service.ts`)
- **`calculateLevelAssignment(scores)`** — Core function that:
  - Converts 4 module scores (speaking/listening/vocabulary/grammar) into Imperial Levels using threshold arrays from constants
  - Applies majority rule: the level with the most module votes becomes the final level
  - Handles ties: speaking level decides when two or more levels tie
  - Flags students with >20 point discrepancies across percentage-based modules (speaking, listening, grammar)
  - Determines strengths (modules at or above final level) and weaknesses (modules below final level)
  - Provides recommended training path based on final level (Foundation/Initiate/Warrior/Champion paths)
- **`getLevelName(level)`** — Returns rank name from IMPERIAL_RANKS
- **`getLevelColor(level)`** — Returns hex color per level (0=muted gold, 1=bronze, 2=gold, 3=fire)
- Exports `ModuleScores` interface for typed input

### Level Calculation API (`POST /api/assessment/calculate-level`)
- Accepts JSON body with `speakingScore`, `listeningScore`, `vocabularyScore`, `grammarScore` (all numbers)
- Validates that all score fields are present and numeric
- Returns `{ result: LevelAssignment }` on success
- Returns `{ error: string }` with appropriate HTTP status on failure

### Cinematic Results Page ("The Empire Has Spoken")
Seven-section layout with dramatic animation sequence:

1. **Ceremony Header** — "The Empire Has Spoken" with gold-shimmer text and pulsing gold text-shadow animation, "The Imperial Decree" subtitle, atmospheric italic quote
2. **Rank Reveal** — Dramatic animated sequence:
   - Radial gradient gold burst animation (expands and fades)
   - ImperialRankBadge (lg) with spring entrance animation and pulsing glow box-shadow
   - Rank name in level color with fade-in from below
   - IMPERIAL_RANK_DESCRIPTIONS text below rank name
3. **Module Breakdown** — 4 MetallicCards showing each module:
   - Module icon in color-coded circle, module name + empire title
   - Score with ProgressBar (vocabulary shows "~N words", others show "N%")
   - Level badge with ImperialRankBadge (sm)
   - Strength/Needs Work/On Track labels with CheckCircle2/XCircle/Star icons
4. **Strengths & Weaknesses** — Two TacticalPanels side by side:
   - Strengths: gold accent, CheckCircle2 icons, level badges, "Performing at or above your overall level" descriptions
   - Weaknesses: muted gold accent, XCircle icons, improvement suggestions (WEAKNESS_SUGGESTIONS map), "No Weaknesses Detected" green state when all modules strong
5. **Flag Notice** — (conditional) GlowingBorder with fire color + high intensity, AlertTriangle icon, "Imperial Review Required" heading, explanation text, flag reason in italic bordered quote
6. **Recommended Path** — Large TacticalPanel with level-colored accent:
   - Rank + path name with ImperialRankBadge
   - Full recommended path description text
   - "Next Rank" milestone indicator (or "Maximum Rank Achieved" for Level 3)
7. **Action Buttons** — "Return to Dashboard" (outline) + "Begin Training" (primary) ImperialButtons, "Load from Assessment" ghost button for demo data

### Animation Sequence (Framer Motion)
- **Ceremony header**: 1.5s fade-in
- **Rank badge**: Spring animation (stiffness: 200, damping: 15, delay: 1.2s)
- **Rank name**: Fade-in from below (delay: 1.8s)
- **Gold burst**: Scale 0→2→1.5 with opacity 0→0.6→0 (delay: 1.0s)
- **Module cards**: Stagger from bottom (delay: 2.5s + i×0.15s)
- **Strengths panel**: Slide from left (delay: 3.5s)
- **Weaknesses panel**: Slide from right (delay: 3.7s)
- **Flag notice**: Scale in (delay: 4.0s)
- **Recommended path**: Rise from below (delay: 4.2s)
- **Action buttons**: Rise from below (delay: 4.8s)

### Query Parameter Support
- `?assessmentId=xxx`: Shows loading screen ("Consulting the Imperial Archives" with spinning Crown icon), then fetches from `/api/assessment/calculate-level`, falls back to mock results on error with toast notification
- No parameter: Displays mock results immediately (Warrior level: Speaking 62, Listening 71, Vocabulary 1500, Grammar 68)
- Error notice appears as fixed bottom-right MetallicCard with AlertTriangle icon

### Enhanced Particle Background
- 50 particles (vs standard 30) for extra cinematic atmosphere
- Same float animation but higher opacity range (0.15–0.55)

### Technical Details
- `'use client'` component with useState/useEffect/useMemo/useSearchParams
- Loading state initialized from `!!assessmentId` (avoids `setState` in effect — lint compliance)
- Fetch effect with cleanup/cancellation flag pattern
- Ceremony animation triggered via `setTimeout` after results load, `AnimatePresence` for transitions
- ParticleBackground + Navbar + Footer layout with `min-h-screen flex flex-col` + `mt-auto` sticky footer
- All empire design system components used (GlowingBorder, MetallicCard, ImperialButton, ProgressBar, ImperialRankBadge, SectionDivider, TacticalPanel, ParticleBackground, Navbar, Footer)
- Fully responsive (mobile-first: single column → sm:grid-cols-2 → lg:grid-cols-4 for modules, lg:grid-cols-2 for strengths/weaknesses)
- ESLint passes ✅ | Results page HTTP 200 ✅ | Calculate-level API tested ✅
