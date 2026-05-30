import { NextRequest, NextResponse } from 'next/server';
import { withApiProtection } from '@/lib/api-protection';

// ─── System Health Check API ────────────────────────────────
// Validates all critical subsystems and returns PASS/FAIL status.
// Admin-only endpoint for production monitoring.

interface HealthCheckResult {
  module: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  latencyMs: number;
  details: string;
  error?: string;
}

async function runHealthChecks(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  // 1. Database connectivity (Prisma)
  try {
    const start = Date.now();
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    const latency = Date.now() - start;
    results.push({
      module: 'Database (Prisma/SQLite)',
      status: latency < 500 ? 'PASS' : 'WARN',
      latencyMs: latency,
      details: `Database connected and responsive (${latency}ms)`,
    });
  } catch (err) {
    results.push({
      module: 'Database (Prisma/SQLite)',
      status: 'FAIL',
      latencyMs: 0,
      details: 'Database connection failed',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 2. Email service (SMTP check)
  try {
    const start = Date.now();
    const hasSMTP = !!process.env.SMTP_HOST;
    results.push({
      module: 'Email Service (SMTP)',
      status: hasSMTP ? 'PASS' : 'WARN',
      latencyMs: Date.now() - start,
      details: hasSMTP
        ? `SMTP configured: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}`
        : 'No SMTP configured — using Ethereal (dev mode). Emails will not be delivered in production.',
    });
  } catch (err) {
    results.push({
      module: 'Email Service (SMTP)',
      status: 'FAIL',
      latencyMs: 0,
      details: 'Email service check failed',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 3. Auth system (NextAuth config)
  try {
    const start = Date.now();
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasDbUrl = !!process.env.DATABASE_URL;
    results.push({
      module: 'Authentication (NextAuth)',
      status: hasNextAuthSecret && hasDbUrl ? 'PASS' : 'WARN',
      latencyMs: Date.now() - start,
      details: hasNextAuthSecret
        ? 'NextAuth configured with secret'
        : 'NEXTAUTH_SECRET missing — sessions may not work correctly',
    });
  } catch (err) {
    results.push({
      module: 'Authentication (NextAuth)',
      status: 'FAIL',
      latencyMs: 0,
      details: 'Auth system check failed',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 4. Scoring engine
  try {
    const start = Date.now();
    const { calculateLevelAssignment } = await import('@/services/scoring-service');
    const testResult = calculateLevelAssignment({
      speakingScore: 50,
      listeningScore: 60,
      vocabularyScore: 1500,
      grammarScore: 55,
    });
    const latency = Date.now() - start;
    results.push({
      module: 'Scoring Engine',
      status: testResult.finalLevel !== undefined ? 'PASS' : 'FAIL',
      latencyMs: latency,
      details: `Scoring engine operational — test returned level ${testResult.finalLevel} (${latency}ms)`,
    });
  } catch (err) {
    results.push({
      module: 'Scoring Engine',
      status: 'FAIL',
      latencyMs: 0,
      details: 'Scoring engine failed',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 5. Assessment engine (anti-cheat)
  try {
    const start = Date.now();
    const { shuffleArray, calculateWeightedScore, selectQuestionsByCategory } = await import('@/services/assessment-engine');
    const shuffled = shuffleArray([1, 2, 3, 4, 5], 42);
    const weighted = calculateWeightedScore([{ attemptNumber: 1, score: 75 }]);
    const latency = Date.now() - start;
    results.push({
      module: 'Assessment Engine (Anti-Cheat)',
      status: shuffled.length === 5 && weighted.weightedScore > 0 ? 'PASS' : 'FAIL',
      latencyMs: latency,
      details: `Anti-cheat engine operational — shuffle & weighted scoring verified (${latency}ms)`,
    });
  } catch (err) {
    results.push({
      module: 'Assessment Engine (Anti-Cheat)',
      status: 'FAIL',
      latencyMs: 0,
      details: 'Assessment engine check failed',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 6. File system (public directory)
  try {
    const start = Date.now();
    const fs = await import('fs');
    const path = await import('path');
    const publicDir = path.join(process.cwd(), 'public');
    const logoExists = fs.existsSync(path.join(publicDir, 'logo.png'));
    const founderExists = fs.existsSync(path.join(publicDir, 'founder.png'));
    results.push({
      module: 'Static Assets',
      status: logoExists ? 'PASS' : 'WARN',
      latencyMs: Date.now() - start,
      details: `logo.png: ${logoExists ? 'found' : 'MISSING'}, founder.png: ${founderExists ? 'found' : 'MISSING'}`,
    });
  } catch (err) {
    results.push({
      module: 'Static Assets',
      status: 'WARN',
      latencyMs: 0,
      details: 'Could not check static assets',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  // 7. API routes availability
  try {
    const start = Date.now();
    const fs = await import('fs');
    const path = await import('path');
    const apiDir = path.join(process.cwd(), 'src/app/api');
    const expectedRoutes = [
      'auth/register/route.ts',
      'assessment/start/route.ts',
      'assessment/session/route.ts',
      'assessment/submit/route.ts',
      'assessment/calculate-level/route.ts',
      'email/route.ts',
      'questions/route.ts',
    ];
    const missing = expectedRoutes.filter(r => !fs.existsSync(path.join(apiDir, r)));
    results.push({
      module: 'API Routes',
      status: missing.length === 0 ? 'PASS' : 'WARN',
      latencyMs: Date.now() - start,
      details: missing.length === 0
        ? `All ${expectedRoutes.length} critical API routes found`
        : `Missing routes: ${missing.join(', ')}`,
    });
  } catch (err) {
    results.push({
      module: 'API Routes',
      status: 'WARN',
      latencyMs: 0,
      details: 'Could not verify API routes',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }

  return results;
}

async function handler(req: NextRequest) {
  try {
    const results = await runHealthChecks();
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    const warnCount = results.filter(r => r.status === 'WARN').length;

    const overallStatus = failCount > 0 ? 'DEGRADED' : warnCount > 0 ? 'OPERATIONAL' : 'HEALTHY';

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overallStatus,
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount,
        warnings: warnCount,
      },
      checks: results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[system_health] Health check failed:', message);
    return NextResponse.json(
      {
        overallStatus: 'CRITICAL',
        error: 'Health check system itself failed',
        details: message,
      },
      { status: 500 }
    );
  }
}

export const GET = withApiProtection({ rateLimit: 'admin', requireAuth: true })(handler);
