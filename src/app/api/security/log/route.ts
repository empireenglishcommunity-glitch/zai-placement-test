import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';
import { logSecurityEvent } from '@/lib/security-logger';

/**
 * POST /api/security/log
 * Receives security events from the client-side and logs them server-side.
 * Rate-limited to prevent abuse.
 */
export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req);

    // Rate limit this endpoint to prevent abuse
    const rateResult = checkRateLimit(identifier, 'general');
    if (!rateResult.allowed) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    const body = await req.json();
    const { type, details, severity, path } = body;

    if (!type) {
      return NextResponse.json({ error: 'Event type required' }, { status: 400 });
    }

    logSecurityEvent({
      type,
      severity: severity || 'low',
      details: details || 'Client-reported security event',
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      path: path || new URL(req.url).pathname,
    });

    return NextResponse.json({ logged: true });
  } catch (error) {
    console.error('Security log error:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
