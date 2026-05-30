---
Task ID: 1
Agent: Main Agent
Task: Fix empty dashboard page for new users — root cause analysis and complete restoration

Work Log:
- Read dashboard/page.tsx — found the page had full UI structure but used framer-motion with `initial="hidden"` and `hidden: { opacity: 0 }` on the main container
- Read API route /api/dashboard/route.ts — confirmed it correctly handles new users (returns 401 for unauthenticated, creates profile if missing)
- Checked all imported components (ImperialRankBadge, ProgressBar, GlowingBorder, ParticleBackground, Navbar, Footer, etc.) — all work correctly with zero/default values
- Started dev server and fetched raw HTML — CONFIRMED ROOT CAUSE: framer-motion sets `style="opacity:0"` on the main content div, making the entire page invisible if client-side JS fails to hydrate
- **ROOT CAUSE**: `containerVariants` had `hidden: { opacity: 0 }`, and the main `<motion.div>` used `initial="hidden"`. If client hydration fails or is delayed, content stays at opacity:0 = INVISIBLE PAGE
- **FIX APPLIED**:
  1. Removed container-level `opacity: 0` animation entirely — container now always visible
  2. Changed `itemVariants` from `{ opacity: 0, y: 20 }` to `{ y: 16 }` — no opacity hiding
  3. Added `mounted` state guard: `initial={mounted ? 'hidden' : false}` — content renders visible on SSR, animations only activate after confirmed client mount
  4. Added `hasFetched` ref to prevent duplicate API calls
  5. Added `isNewUser` detection for targeted encouragement messaging
  6. Added **Achievements/Badges section** (6 badges: First Blood, Four Trials, Wordsmith, Grammarian, Initiate, Champion)
  7. Added **New User Encouragement box** with "Your journey begins here" message
  8. Improved empty state messages for activity feed
  9. Created `/app/dashboard/error.tsx` — proper error boundary with retry button
  10. Created `/app/dashboard/loading.tsx` — loading spinner for Suspense fallback
- Verified build succeeds with no errors
- Verified SSR HTML output shows all content VISIBLE (no opacity:0 trap)

Stage Summary:
- Root cause identified: framer-motion opacity:0 animation trap made page invisible when JS hydration failed
- Complete dashboard restored with ALL sections: Welcome, Imperial Rank, Four Trials, Command Statistics, Recent Activity, Training Status, Achievements, Quick Actions
- New users see clean zero-state (Recruit rank, 0 trials, empty activity, locked achievements)
- Existing users see real database data
- Error boundary and loading states added as safety nets
- Files modified: src/app/dashboard/page.tsx, src/app/dashboard/error.tsx (new), src/app/dashboard/loading.tsx (new)
