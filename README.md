# Z.ai Placement Test

A 4-trial (Reading, Listening, Speaking, Writing) English placement
assessment, TOEFL-style scoring (0-120) with CEFR level mapping,
computer-adaptive reading via Item Response Theory (IRT), anti-cheat
measures, and bilingual (English/Arabic) support.

**Live at:** https://assessment.empireenglish.online

**Parent project:** Empire English Community — for full cross-project
context, history, and infrastructure state, see
`empireenglishcommunity-glitch/Kiro-Master-Index` (start with its
`README.md` and `SESSION_CONTINUITY.md`).

> **Not to be confused with** `Claude/empire-assessment/` — a genuinely
> separate, second assessment product live at `test.empireenglish.online`.
> Both are real, both are live, they are different codebases.

## Stack

Next.js, Prisma + PostgreSQL/SQLite, NextAuth.js, Groq (AI evaluation),
Kokoro TTS (listening audio).

## Key scripts

```bash
npm run dev                          # local dev server
npm run db:migrate                   # Prisma migration
npm run generate:audio               # generate Kokoro TTS listening audio
npm run migrate:force-reset-passwords # force legacy SHA-256 users to reset (bcrypt migration)
```

## Where to look first

- `FIXES_REGISTRY.md` — history of fixes; check before assuming a known bug is still open
- `worklog.md` — development log
- `.env.example` — required environment variables

## AI Agent Notes

See `.kiro/steering/project-rules.md` for the session protocol and
repo-specific rules (including a note on a stale PR that was closed
without merging on 2026-07-12 — do not merge old feature branches into
this repo without diffing carefully against current `main` first).
