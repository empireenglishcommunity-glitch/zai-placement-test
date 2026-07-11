#!/bin/sh
# ═══════════════════════════════════════════════════════════
# EMPIRE ENGLISH — Docker Entrypoint
# Creates SQLite database tables directly (no Prisma CLI needed)
# ═══════════════════════════════════════════════════════════

echo "🏛️ Empire Assessment — Starting..."

DB_PATH="/app/db/assessment.db"

if [ ! -f "$DB_PATH" ] || [ ! -s "$DB_PATH" ]; then
  echo "📦 Creating database tables..."
  sqlite3 "$DB_PATH" << 'SQL'
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "isAdmin" INTEGER NOT NULL DEFAULT 0,
    "emailVerified" INTEGER NOT NULL DEFAULT 0,
    "verifyToken" TEXT,
    "verifyTokenExpiry" DATETIME,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "assessmentCount" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "termsAccepted" INTEGER NOT NULL DEFAULT 0,
    "termsAcceptedAt" DATETIME,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_userId_key" ON "profiles"("userId");

CREATE TABLE IF NOT EXISTS "assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "currentModule" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "spPronunciation" REAL, "spFluency" REAL, "spWordsPerMinute" REAL,
    "spPhonemeAcc" REAL, "spGrammarAcc" REAL, "spVocabRange" REAL,
    "spConfidence" REAL, "spRhythmMatch" REAL, "spOverall" REAL, "spLevel" INTEGER,
    "liLiteral" REAL, "liInference" REAL, "liDetail" REAL, "liOverall" REAL, "liLevel" INTEGER,
    "voBand1" REAL, "voBand2" REAL, "voBand3" REAL, "voBand4" REAL, "voBand5" REAL,
    "voEstimatedSize" REAL, "voOverall" REAL, "voLevel" INTEGER,
    "grPercentage" REAL, "grLevel" INTEGER,
    "assignedLevel" INTEGER, "flagged" INTEGER NOT NULL DEFAULT 0, "flagReason" TEXT,
    CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "assessments_userId_idx" ON "assessments"("userId");
CREATE INDEX IF NOT EXISTS "assessments_status_idx" ON "assessments"("status");

CREATE TABLE IF NOT EXISTS "recordings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "part" TEXT,
    "audioUrl" TEXT NOT NULL,
    "duration" REAL,
    "transcript" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recordings_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recordings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "recordings_assessmentId_idx" ON "recordings"("assessmentId");

CREATE TABLE IF NOT EXISTS "answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" INTEGER,
    "isCorrect" INTEGER,
    "timeTaken" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "answers_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "answers_assessmentId_idx" ON "answers"("assessmentId");
CREATE INDEX IF NOT EXISTS "answers_module_idx" ON "answers"("module");

CREATE TABLE IF NOT EXISTS "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "type" TEXT,
    "topic" TEXT,
    "questionText" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "questions_module_idx" ON "questions"("module");
CREATE INDEX IF NOT EXISTS "questions_topic_idx" ON "questions"("topic");
CREATE INDEX IF NOT EXISTS "questions_isActive_idx" ON "questions"("isActive");

CREATE TABLE IF NOT EXISTS "review_flags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "resolved" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "review_flags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "review_flags_resolved_idx" ON "review_flags"("resolved");
CREATE INDEX IF NOT EXISTS "review_flags_userId_idx" ON "review_flags"("userId");

CREATE TABLE IF NOT EXISTS "admin_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_notes_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "admin_notes_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "admin_notes_targetUserId_idx" ON "admin_notes"("targetUserId");

CREATE TABLE IF NOT EXISTS "assessment_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "questionSet" TEXT NOT NULL,
    "optionMapping" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);
CREATE INDEX IF NOT EXISTS "assessment_sessions_userId_module_idx" ON "assessment_sessions"("userId", "module");
CREATE INDEX IF NOT EXISTS "assessment_sessions_status_idx" ON "assessment_sessions"("status");

CREATE TABLE IF NOT EXISTS "question_exposures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "attemptNum" INTEGER NOT NULL,
    "shownAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "question_exposures_userId_questionId_attemptNum_key" ON "question_exposures"("userId", "questionId", "attemptNum");
CREATE INDEX IF NOT EXISTS "question_exposures_userId_module_idx" ON "question_exposures"("userId", "module");

CREATE TABLE IF NOT EXISTS "invite_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "usedBy" TEXT,
    "expiresAt" DATETIME,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "invite_codes_code_key" ON "invite_codes"("code");
CREATE INDEX IF NOT EXISTS "invite_codes_isActive_idx" ON "invite_codes"("isActive");

-- Insert default invite codes for the founder
INSERT OR IGNORE INTO "invite_codes" ("id", "code", "type", "maxUses", "usedCount", "note") VALUES
  ('default-paid', 'EEC-PAID-2026', 'paid', -1, 0, 'Default code for paid students'),
  ('default-free', 'EEC-FREE-2026', 'free', -1, 0, 'Default code for free students'),
  ('default-vip', 'EMPIRE-VIP', 'vip', -1, 0, 'VIP access code');

CREATE TABLE IF NOT EXISTS "ownership_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "userId" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ownership_records_eventType_idx" ON "ownership_records"("eventType");
CREATE INDEX IF NOT EXISTS "ownership_records_createdAt_idx" ON "ownership_records"("createdAt");
SQL
  echo "✅ Database tables created"
else
  echo "✅ Database exists"
fi

# ─── Ensure new TOEFL score columns exist (added July 2026) ───
echo "📦 Ensuring TOEFL score columns exist..."
sqlite3 "$DB_PATH" << 'SQL'
-- Add TOEFL section score columns if they don't exist
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we use a trick
CREATE TABLE IF NOT EXISTS "_migration_check" ("id" INTEGER PRIMARY KEY);
-- readingScore
SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END FROM pragma_table_info('assessments') WHERE name = 'readingScore';
SQL

# Use a more reliable approach: try each ALTER and ignore errors
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN readingScore REAL;" 2>/dev/null || true
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN listeningScore REAL;" 2>/dev/null || true
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN speakingScore REAL;" 2>/dev/null || true
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN writingScore REAL;" 2>/dev/null || true
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN totalScore REAL;" 2>/dev/null || true
sqlite3 "$DB_PATH" "ALTER TABLE assessments ADD COLUMN cefrLevel TEXT;" 2>/dev/null || true
echo "✅ TOEFL score columns verified"

# ─── Force-reset legacy SHA-256 password hashes (companion to PR #20) ───
# bcrypt hashes always start with "$2" (e.g. $2a$, $2b$, $2y$). Any
# passwordHash that doesn't match this prefix predates the bcrypt
# migration and must be invalidated so the user is forced to reset
# their password. This UPDATE is idempotent: once a hash is set to
# 'RESET_REQUIRED' it also starts with 'R', not '$2', so re-running
# this on every deploy would re-mark it — we explicitly exclude the
# marker value itself to keep this safe to run on every startup.
echo "🔐 Checking for legacy (non-bcrypt) password hashes..."
sqlite3 "$DB_PATH" "UPDATE users SET passwordHash = 'RESET_REQUIRED' WHERE passwordHash IS NOT NULL AND passwordHash != 'RESET_REQUIRED' AND passwordHash NOT LIKE '\$2%';" 2>/dev/null || true
echo "✅ Legacy password hashes invalidated (if any)"

# Start the server
echo "🚀 Starting server on port ${PORT:-3000}..."
exec node server.js
