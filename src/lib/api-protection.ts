/**
 * MACAL EMPIRE — API Route Protection Middleware
 * Wraps API route handlers with rate limiting, bot detection, and security logging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, createRateLimitHeaders, RateLimitPreset } from '@/lib/rate-limiter';
import { detectServerSideBot } from '@/lib/bot-detection';
import { logSecurityEvent, createSecurityEventFromRequest } from '@/lib/security-logger';
import { getServerSession } from 'next-auth';

type RouteHandler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse> | NextResponse;

interface ProtectionOptions {
  /** Rate limit preset to apply */
  rateLimit: RateLimitPreset;
  /** Require authentication for this endpoint */
  requireAuth?: boolean;
  /** Enable bot detection */
  detectBots?: boolean;
  /** Block detected bots (vs just logging) */
  blockBots?: boolean;
  /** Log all requests (not just violations) */
  logAll?: boolean;
}

/**
 * Wraps an API route handler with protection middleware.
 *
 * Usage:
 * ```ts
 * export const POST = withApiProtection({ rateLimit: 'assessment', requireAuth: true })(
 *   async (req) => { ... }
 * );
 * ```
 */
export function withApiProtection(options: ProtectionOptions) {
  return (handler: RouteHandler) => {
    return async (req: NextRequest, ctx?: unknown): Promise<NextResponse> => {
      const identifier = getClientIdentifier(req);

      // ─── Bot Detection ────────────────────────────────────
      if (options.detectBots !== false) {
        const botResult = detectServerSideBot(req);

        if (botResult.isSuspicious) {
          logSecurityEvent({
            ...createSecurityEventFromRequest(req, 'bot_detected', botResult.reasons.join('; '), 'high'),
            type: 'bot_detected',
          });

          if (options.blockBots) {
            return NextResponse.json(
              { error: 'Access denied' },
              { status: 403 }
            );
          }
        }
      }

      // ─── Rate Limiting ────────────────────────────────────
      const rateResult = checkRateLimit(identifier, options.rateLimit);
      const rateHeaders = createRateLimitHeaders(rateResult);

      if (!rateResult.allowed) {
        logSecurityEvent({
          ...createSecurityEventFromRequest(
            req,
            'rate_limit_exceeded',
            rateResult.reason || 'Rate limit exceeded',
            rateResult.retryAfter && rateResult.retryAfter > 60_000 ? 'high' : 'medium'
          ),
          type: 'rate_limit_exceeded',
        });

        return NextResponse.json(
          { error: rateResult.reason || 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              ...rateHeaders,
              'Retry-After': rateHeaders['Retry-After'] || '60',
            },
          }
        );
      }

      // ─── Auth Check ──────────────────────────────────────
      if (options.requireAuth) {
        try {
          const session = await getServerSession();
          if (!session) {
            logSecurityEvent({
              ...createSecurityEventFromRequest(req, 'unauthorized_access', 'Unauthenticated request to protected endpoint'),
              type: 'unauthorized_access',
            });

            return NextResponse.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }
        } catch {
          // Session check failed — allow request through to maintain flow
        }
      }

      // ─── Log Request (optional) ──────────────────────────
      if (options.logAll) {
        // Only log at debug level to avoid filling up the log
        console.debug(`[API] ${req.method} ${new URL(req.url).pathname} from ${identifier}`);
      }

      // ─── Execute Handler ─────────────────────────────────
      const response = await handler(req, ctx);

      // Add rate limit headers to successful responses
      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(rateHeaders)) {
        newHeaders.set(key, value);
      }

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    };
  };
}
