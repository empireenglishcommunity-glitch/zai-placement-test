# FIXES REGISTRY — Empire English Assessment

> **CRITICAL:** This file documents every fix applied to the assessment system.
> Before making ANY changes, read this file. NEVER undo or break these fixes.
> If you edit a file listed here, verify the fix is still intact after your edit.

---

## FIX #1: Score Saving (Reading Trial)

**Date:** 2026-07-04
**File:** `src/app/assessment/reading/page.tsx`
**Root Cause:** Reading trial uses `adaptiveMode = true` by default. The adaptive flow (`handleAdaptiveAnswer`) transitions to results but NEVER called the submit API.
**Fix:** Added `submitReadingScore()` function called directly when `data.isComplete` in the adaptive handler.
**Verification:** Server logs must show `[SUBMIT] userId resolved: ... module: reading` after completing a reading trial.

### Rules:
- `submitReadingScore()` is defined BEFORE `handleAdaptiveAnswer` (order matters)
- Called with `data.results.score` from the adaptive API response
- Uses `fetch('/api/auth/session', { credentials: 'include' })` — the `credentials: 'include'` is MANDATORY
- NEVER use `useEffect` for score submission — it doesn't fire reliably in production

---

## FIX #2: Score Saving (Listening Trial)

**Date:** 2026-07-04
**File:** `src/app/assessment/listening/page.tsx`
**Root Cause:** Same as Reading — useEffect-based submission was unreliable.
**Fix:** `submitTrialScore()` called directly in `handleSkip` (last question) and `advanceQuestion` (last question).
**Verification:** Server logs must show `[SUBMIT] userId resolved: ... module: listening`

---

## FIX #3: Score Saving (Writing Trial)

**Date:** 2026-07-04
**File:** `src/app/assessment/writing/page.tsx`
**Root Cause:** Same pattern — useEffect never fired.
**Fix:** `submitWritingScore()` called directly in `handleSubmitTask2` after AI evaluation completes.
**Verification:** Server logs must show `[SUBMIT] userId resolved: ... module: writing`

---

## FIX #4: Score Saving (Speaking Trial)

**Date:** Already working (pre-existing)
**File:** `src/app/assessment/speaking/page.tsx`
**Why it works:** Uses `useUserId()` hook (reads from NextAuth React context, not fetch) + useEffect with `[phase]` dependency. This works because Speaking uses the hook-based auth pattern.
**DO NOT CHANGE the Speaking submission pattern.**

---

## FIX #5: Database Columns

**Date:** 2026-07-03
**File:** `docker-entrypoint.sh`
**Root Cause:** Production SQLite DB was created before TOEFL fields existed. Columns `readingScore`, `listeningScore`, `speakingScore`, `writingScore`, `totalScore`, `cefrLevel` didn't exist.
**Fix:** Added `ALTER TABLE` statements that run on every container start:
```bash
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN readingScore REAL;" 2>/dev/null || true
# ... (all 6 columns)
```
**NEVER remove these lines from docker-entrypoint.sh**

---

## FIX #6: Answer Randomization

**Date:** 2026-07-03
**File:** `src/lib/shuffle-options.ts`
**Root Cause:** Original code used question ID char-code sum as seed — similar IDs produced similar shuffles, causing all answers to cluster at one position.
**Fix:** Xorshift128 PRNG + MurmurHash3 seed combining + per-session random seed + position history (no 3 consecutive same).
**NEVER revert to simple linear congruential or static seeding.**

---

## FIX #7: Listening Blank Page on "I Don't Know"

**Date:** 2026-07-04
**File:** `src/app/assessment/listening/page.tsx`
**Root Cause:** Setting `setIsAnswered(true)` then `setIsAnswered(false)` in the same handler confused React batching. Also `setTimeout` caused state updates OUTSIDE React batch → render in intermediate state → blank page.
**Fix:** 
- Use `useRef(false)` for double-click guard (synchronous, no render trigger)
- Direct index values: `setCurrentQuestionIndex(currentQuestionIndex + 1)` not `prev => prev + 1`
- NO `setIsAnswered` toggling in skip handler
- NO `setTimeout` — all state updates synchronous in one batch
- Pre-computed booleans: `isLastQuestionInPassage`, `isLastPassage`
- Fallback render at end of component shows "Restart Trial" instead of blank page
**Verification:** Click "I Don't Know" on ALL questions — should never show blank page.

### NEVER DO in Listening skip handler:
- ❌ `setIsAnswered(true); ... setIsAnswered(false);` in same function
- ❌ `setTimeout(() => { setState... }, 50)`
- ❌ `prev => prev + 1` for index updates
- ❌ Calling `advanceQuestion()` from `handleSkip()`

---

## FIX #8: Kokoro TTS (Listening Audio)

**Date:** 2026-07-03
**File:** `src/components/empire/ListeningAudioPlayer.tsx`
**What:** Pre-generated audio files at `/public/audio/listening/*.mp3`, served via HTML5 `<audio>` element.
**Fallback:** Browser TTS if MP3 not found.
**NEVER remove the fallback — it ensures the trial works even without audio files.**

---

## FIX #9: Kokoro TTS (Speaking Shadowing)

**Date:** 2026-07-03
**File:** `src/app/assessment/speaking/page.tsx`
**What:** Pre-generated audio at `/public/audio/speaking/shadow-{0-7}.mp3`, preloaded on phase mount.
**NEVER remove the `fallbackTTS` function — it's the safety net.**

---

## FIX #10: Speed Buttons (Listening)

**Date:** 2026-07-03
**File:** `src/components/empire/ListeningAudioPlayer.tsx`
**Root Cause:** `handleSpeedChange` only applied `playbackRate` when `playerState === 'playing'`.
**Fix:** Always apply `playbackRate` to audio element immediately regardless of state.

---

## FIX #11: Retake Updates Dashboard Score

**Date:** 2026-07-04
**File:** `src/app/api/dashboard/route.ts` + `src/app/assessment/page.tsx`
**Root Cause:** Completed trials showed disabled "Trial Completed" button — students couldn't retake. Also, dashboard loop could overwrite newest score with older ones.
**Fix:**
- Assessment hub: "Trial Completed" button → "Retake Trial" link (clickable, goes to trial page)
- Dashboard API: Added `moduleProgress.X.status !== 'completed'` guard — only FIRST (newest) score is used, older scores don't overwrite
- Submit API creates new assessment record on retake (existing one is 'completed')
**Verification:** Retake a trial → dashboard shows NEW score (not old one).

```bash
# 1. Check container is running
docker ps | grep empire-assessment

# 2. Check DB columns exist
docker logs empire-assessment 2>&1 | grep "TOEFL score columns"
# Expected: "✅ TOEFL score columns verified"

# 3. After taking a trial, check submit was called
docker logs empire-assessment 2>&1 | grep "SUBMIT" | tail -5
# Expected: "[SUBMIT] userId resolved: xxx... module: reading/listening/writing/speaking"
```

---

## PATTERNS THAT DON'T WORK IN THIS PROJECT:

1. ❌ `useEffect([phase])` for score submission — doesn't fire reliably in Next.js 16 production
2. ❌ `sessionStorage.getItem('empire-user-id')` for authenticated users — never set
3. ❌ `fetch('/api/auth/session')` without `{ credentials: 'include' }` — session cookie not sent
4. ❌ Calling `advanceQuestion()` from `handleSkip()` — stale closure causes blank page
5. ❌ Simple char-code sum as shuffle seed — produces biased distribution

## PATTERNS THAT WORK:

1. ✅ Direct function call at `setPhase('results')` point
2. ✅ `fetch('/api/auth/session', { credentials: 'include' })` for getting userId
3. ✅ `useUserId()` hook (Speaking trial pattern) — reads from NextAuth context
4. ✅ Inline advance logic with `setTimeout(50ms)` for skip buttons
5. ✅ Xorshift128 + per-session seed for answer shuffling
