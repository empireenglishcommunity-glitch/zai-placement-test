/**
 * MACAL EMPIRE — Security Event Logger
 * Lightweight logging system for suspicious scraping attempts,
 * excessive requests, unauthorized access, and other security events.
 */

import { db } from '@/lib/db';

// ─── Types ─────────────────────────────────────────────────────

export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'bot_detected'
  | 'suspicious_behavior'
  | 'unauthorized_access'
  | 'devtools_inspection'
  | 'scraping_attempt'
  | 'rapid_navigation'
  | 'repeated_api_access'
  | 'blocked_request';

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  path?: string;
  details?: string;
  severity: 'low' | 'medium' | 'high';
}

// ─── In-Memory Buffer ──────────────────────────────────────────

const eventBuffer: SecurityEvent[] = [];
const MAX_BUFFER_SIZE = 500;

// Flush to database every 30 seconds (if available)
let flushInterval: ReturnType<typeof setInterval> | null = null;

function startFlushInterval() {
  if (flushInterval || typeof setInterval === 'undefined') return;

  flushInterval = setInterval(async () => {
    await flushEvents();
  }, 30_000);
}

/**
 * Log a security event.
 * Events are buffered in memory and periodically flushed to the database.
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  eventBuffer.push(fullEvent);

  // Trim buffer if it gets too large
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.splice(0, eventBuffer.length - MAX_BUFFER_SIZE);
  }

  // Start flush interval if not already running
  startFlushInterval();

  // Log high-severity events to console immediately
  if (event.severity === 'high') {
    console.warn('[SECURITY]', fullEvent.type, fullEvent.details || '', {
      ip: event.ipAddress,
      path: event.path,
      userId: event.userId,
    });
  }
}

/**
 * Flush buffered events to the database.
 * Silently fails if database is unavailable.
 */
export async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) return;

  // Take all events from buffer
  const events = eventBuffer.splice(0, eventBuffer.length);

  try {
    // Store events as admin notes in the database
    // (Using the existing AdminNote model as a simple log store)
    for (const event of events) {
      await db.adminNote.create({
        data: {
          assessmentId: 'security-log',
          adminId: 'system',
          note: `[SECURITY] ${event.type} | ${event.severity} | ${event.details || 'No details'} | IP: ${event.ipAddress || 'unknown'} | Path: ${event.path || 'N/A'} | UA: ${event.userAgent?.slice(0, 100) || 'unknown'}`,
        },
      }).catch(() => {
        // Database write failed — that's OK, we tried
      });
    }
  } catch {
    // Silently fail — logging should never break the app
  }
}

/**
 * Create a security event from a Next.js Request object.
 */
export function createSecurityEventFromRequest(
  request: Request,
  type: SecurityEventType,
  details?: string,
  severity: SecurityEvent['severity'] = 'medium'
): Omit<SecurityEvent, 'timestamp'> {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');
  const ipAddress = cfIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : undefined);

  return {
    type,
    ipAddress,
    userAgent: request.headers.get('user-agent') || undefined,
    path: new URL(request.url).pathname,
    details,
    severity,
  };
}
