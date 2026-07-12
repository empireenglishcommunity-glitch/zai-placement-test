# zai-placement-test — AI Agent Steering Rules

> This file is automatically loaded by Kiro and any AI agent working on
> this repository.

## Session Protocol

Full session commands (`/start`, `/status`, `/sync`, `/sync dry`,
`/checkpoint`) and standing ecosystem-wide rules live in
`empireenglishcommunity-glitch/Kiro-Master-Index/.kiro/steering/AI-AGENT-PROTOCOL.md`.
Read that file at the start of every session, before anything below.

## Project Identity

- **Project:** Z.ai Placement Test — a 4-trial (Reading/Listening/Speaking/Writing) English placement assessment, TOEFL-style, 0-120 scoring with CEFR mapping.
- **Parent project:** Empire English Community — this is a sibling system to the Discord learning bot and practice platform, not part of the `EEC-REPO` monorepo itself (deliberately standalone).
- **Repository:** `empireenglishcommunity-glitch/zai-placement-test`
- **Live at:** https://assessment.empireenglish.online
- **Do not confuse with:** `Claude/empire-assessment/` — a genuinely separate, second assessment product live at `test.empireenglish.online`. Different codebase, different domain, both real.

## Repo-Specific Notes

- Uses Next.js, Prisma, Supabase/PostgreSQL, Groq for AI evaluation, Kokoro TTS for listening audio.
- `FIXES_REGISTRY.md` and `worklog.md` in this repo track fix history — read before assuming a known bug is still open.
- IRT (Item Response Theory) adaptive engine and 27+ reading passages are live on `main` — do not merge any branch/PR that predates this without diffing carefully (a stale PR #12 attempting exactly this was closed on 2026-07-12 for that reason).
- Legacy SHA-256 password hashes were force-migrated to bcrypt (PR #21) — if working on auth, confirm the migration script has actually run against production, not just merged in code.
- See `Kiro-Master-Index/README.md`'s "Active Decision: Voice Strategy" section for the open Kokoro/ElevenLabs/self-hosted TTS decision before making voice-related changes.
