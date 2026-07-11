// ═══════════════════════════════════════════════════════════
// EMPIRE ENGLISH COMMUNITY — Force Password Reset Migration
// ═══════════════════════════════════════════════════════════
//
// One-time migration script for the SHA-256 → bcrypt password
// hashing migration (companion to PR #20).
//
// bcrypt hashes always start with "$2" (e.g. $2a$, $2b$, $2y$).
// Any user whose passwordHash does NOT start with "$2" is still
// on the legacy SHA-256+static-salt scheme and cannot be safely
// carried forward — the underlying hash is not resistant to the
// same attacks bcrypt protects against, and salts on the old
// scheme were static/shared, not per-user.
//
// This script finds every user with a legacy hash and marks
// their passwordHash as "RESET_REQUIRED", which forces them to
// go through the password reset flow before they can log in
// again. src/lib/auth.ts additionally rejects any login attempt
// against a non-bcrypt hash as a defense-in-depth measure.
//
// Usage:
//   npx tsx scripts/force-reset-all-passwords.ts
//
// This script is idempotent — re-running it is a no-op once all
// legacy hashes have been migrated.
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RESET_REQUIRED_MARKER = 'RESET_REQUIRED';

/**
 * Detects legacy (pre-bcrypt) password hashes.
 * Mirrors the isLegacyHash() check in src/lib/auth.ts.
 */
function isLegacyHash(hash: string | null): boolean {
  if (!hash) return false;
  if (hash === RESET_REQUIRED_MARKER) return false;
  return !hash.startsWith('$2');
}

async function main() {
  console.log('🔐 Empire English — Force Password Reset Migration');
  console.log('═══════════════════════════════════════════════════');

  const users = await prisma.user.findMany({
    select: { id: true, email: true, passwordHash: true },
  });

  const legacyUsers = users.filter((u) => isLegacyHash(u.passwordHash));

  if (legacyUsers.length === 0) {
    console.log('✅ No legacy (non-bcrypt) password hashes found. Nothing to do.');
    return;
  }

  console.log(`⚠️  Found ${legacyUsers.length} user(s) with legacy SHA-256 hashes.`);
  console.log('   Marking them as RESET_REQUIRED...');

  for (const user of legacyUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: RESET_REQUIRED_MARKER },
    });
    console.log(`   → ${user.email} marked for reset`);
  }

  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Done. ${legacyUsers.length} user(s) will be required to reset their password.`);
}

main()
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
