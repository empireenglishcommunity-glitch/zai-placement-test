/**
 * MACAL EMPIRE — Rate Limiting System
 * Lightweight in-memory rate limiter for API routes and page requests.
 * Tracks requests per IP/session with configurable windows.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil: number;
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Block duration in milliseconds after exceeding limit */
  blockDurationMs: number;
}

// ─── Preset Configurations ─────────────────────────────────────

export const RATE_LIMIT_PRESETS = {
  /** Assessment API: 10 requests per minute */
  assessment: { maxRequests: 10, windowMs: 60_000, blockDurationMs: 120_000 },
  /** Question fetching: 20 requests per minute */
  questions: { maxRequests: 20, windowMs: 60_000, blockDurationMs: 60_000 },
  /** AI evaluation: 6 requests per minute (expensive) */
  aiEvaluation: { maxRequests: 6, windowMs: 60_000, blockDurationMs: 180_000 },
  /** Email sending: 5 requests per minute */
  email: { maxRequests: 5, windowMs: 60_000, blockDurationMs: 300_000 },
  /** Auth endpoints: 8 requests per minute */
  auth: { maxRequests: 8, windowMs: 60_000, blockDurationMs: 300_000 },
  /** General API: 30 requests per minute */
  general: { maxRequests: 30, windowMs: 60_000, blockDurationMs: 60_000 },
  /** Admin endpoints: 15 requests per minute */
  admin: { maxRequests: 15, windowMs: 60_000, blockDurationMs: 120_000 },
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMIT_PRESETS;

// ─── In-Memory Store ───────────────────────────────────────────

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime && now > entry.blockUntil) {
        store.delete(key);
      }
    }
  }, 5 * 60_000);
}

// ─── Rate Limit Check ─────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number; // ms until block expires
  reason?: string;
}

/**
 * Check if a request is within rate limits.
 * @param identifier - IP address, session ID, or user ID
 * @param config - Rate limit configuration or preset name
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig | RateLimitPreset
): RateLimitResult {
  const limitConfig: RateLimitConfig =
    typeof config === 'string' ? RATE_LIMIT_PRESETS[config] : config;

  const key = `${identifier}:${limitConfig.windowMs}:${limitConfig.maxRequests}`;
  const now = Date.now();

  let entry = store.get(key);

  // If no entry exists or window has expired, create fresh entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + limitConfig.windowMs,
      blocked: false,
      blockUntil: 0,
    };
    store.set(key, entry);
  }

  // If currently blocked, reject
  if (entry.blocked && now < entry.blockUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: entry.blockUntil - now,
      reason: 'Rate limit exceeded. Temporary block active.',
    };
  }

  // If block has expired, unblock
  if (entry.blocked && now >= entry.blockUntil) {
    entry.blocked = false;
    entry.count = 0;
    entry.resetTime = now + limitConfig.windowMs;
  }

  // Increment request count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > limitConfig.maxRequests) {
    entry.blocked = true;
    entry.blockUntil = now + limitConfig.blockDurationMs;

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: entry.blockUntil - now,
      reason: `Rate limit of ${limitConfig.maxRequests} requests per ${limitConfig.windowMs / 1000}s exceeded.`,
    };
  }

  return {
    allowed: true,
    remaining: limitConfig.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Extract client identifier from a Next.js request.
 * Uses IP from headers, falling back to a session-based identifier.
 */
export function getClientIdentifier(request: Request): string {
  // Try various header sources for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');

  if (cfIp) return `ip:${cfIp}`;
  if (realIp) return `ip:${realIp}`;
  if (forwarded) return `ip:${forwarded.split(',')[0].trim()}`;

  // Fallback: use user agent hash as a rough identifier
  const ua = request.headers.get('user-agent') || 'unknown';
  return `ua:${ua.slice(0, 50)}`;
}

/**
 * Create rate limit headers for the response.
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  };

  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = String(Math.ceil(result.retryAfter / 1000));
  }

  return headers;
}
