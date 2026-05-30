/**
 * MACAL EMPIRE — Bot Detection & Suspicious Behavior System
 * Lightweight detection of automated scraping, rapid navigation, and suspicious patterns.
 */

interface BehaviorEvent {
  timestamp: number;
  type: 'navigate' | 'api' | 'focus' | 'keydown' | 'mouse';
  path?: string;
}

interface BotDetectionResult {
  isSuspicious: boolean;
  score: number; // 0-100, higher = more suspicious
  reasons: string[];
}

// ─── Client-Side Behavior Tracker ─────────────────────────────

class BehaviorTracker {
  private events: BehaviorEvent[] = [];
  private maxEvents = 200;
  private navigationCount = 0;
  private apiCallCount = 0;
  private lastNavigationTime = 0;
  private rapidNavigationStreak = 0;

  /** Record a navigation event */
  recordNavigation(path: string) {
    const now = Date.now();
    this.events.push({ timestamp: now, type: 'navigate', path });
    this.navigationCount++;

    // Check for rapid navigation (less than 500ms between page changes)
    if (now - this.lastNavigationTime < 500) {
      this.rapidNavigationStreak++;
    } else {
      this.rapidNavigationStreak = 0;
    }
    this.lastNavigationTime = now;

    this.pruneEvents();
  }

  /** Record an API call */
  recordApiCall(endpoint: string) {
    this.events.push({ timestamp: Date.now(), type: 'api', path: endpoint });
    this.apiCallCount++;
    this.pruneEvents();
  }

  /** Analyze behavior for suspicious patterns */
  analyze(): BotDetectionResult {
    const now = Date.now();
    const reasons: string[] = [];
    let score = 0;

    // 1. Check rapid navigation streak
    if (this.rapidNavigationStreak >= 5) {
      reasons.push(`Rapid navigation: ${this.rapidNavigationStreak} pages in under 500ms intervals`);
      score += 30;
    } else if (this.rapidNavigationStreak >= 3) {
      reasons.push(`Fast navigation: ${this.rapidNavigationStreak} pages in quick succession`);
      score += 15;
    }

    // 2. Check total navigation in last 60 seconds
    const recentNavs = this.events.filter(
      (e) => e.type === 'navigate' && now - e.timestamp < 60_000
    );
    if (recentNavs.length > 20) {
      reasons.push(`Excessive page navigation: ${recentNavs.length} pages in 60s`);
      score += 25;
    } else if (recentNavs.length > 12) {
      reasons.push(`High page navigation: ${recentNavs.length} pages in 60s`);
      score += 10;
    }

    // 3. Check API call frequency
    const recentApis = this.events.filter(
      (e) => e.type === 'api' && now - e.timestamp < 60_000
    );
    if (recentApis.length > 30) {
      reasons.push(`Excessive API calls: ${recentApis.length} in 60s`);
      score += 25;
    } else if (recentApis.length > 15) {
      reasons.push(`High API usage: ${recentApis.length} in 60s`);
      score += 10;
    }

    // 4. Check for repetitive endpoint access
    const apiEndpoints = recentApis.map((e) => e.path);
    const endpointCounts = new Map<string, number>();
    apiEndpoints.forEach((ep) => {
      if (ep) endpointCounts.set(ep, (endpointCounts.get(ep) || 0) + 1);
    });
    for (const [, count] of endpointCounts) {
      if (count > 10) {
        reasons.push(`Repetitive API access: ${count} hits to same endpoint in 60s`);
        score += 20;
        break;
      }
    }

    // 5. No mouse/focus events at all (pure automation)
    const hasMouseEvents = this.events.some((e) => e.type === 'mouse');
    const hasFocusEvents = this.events.some((e) => e.type === 'focus');
    if (this.navigationCount > 5 && !hasMouseEvents && !hasFocusEvents) {
      reasons.push('No mouse or focus events detected despite navigation');
      score += 15;
    }

    return {
      isSuspicious: score >= 40,
      score: Math.min(score, 100),
      reasons,
    };
  }

  /** Get total counts */
  getStats() {
    return {
      navigationCount: this.navigationCount,
      apiCallCount: this.apiCallCount,
      rapidNavigationStreak: this.rapidNavigationStreak,
    };
  }

  /** Prune old events to keep memory bounded */
  private pruneEvents() {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }
}

// Singleton instance for client-side use
let trackerInstance: BehaviorTracker | null = null;

export function getBehaviorTracker(): BehaviorTracker {
  if (!trackerInstance) {
    trackerInstance = new BehaviorTracker();
  }
  return trackerInstance;
}

// ─── Server-Side Bot Detection Helpers ────────────────────────

interface ServerBotCheckResult {
  isSuspicious: boolean;
  reasons: string[];
}

/**
 * Server-side bot detection from request headers and patterns.
 */
export function detectServerSideBot(request: Request): ServerBotCheckResult {
  const reasons: string[] = [];
  const ua = request.headers.get('user-agent') || '';

  // 1. Known bot user agents
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i,
    /wget/i, /python-requests/i, /httpclient/i, /java\//i,
    /go-http/i, /node-fetch/i, /axios/i, /postman/i,
    /headless/i, /phantomjs/i, /selenium/i, /puppeteer/i,
    /playwright/i, /chrome-lighthouse/i,
  ];

  for (const pattern of botPatterns) {
    if (pattern.test(ua)) {
      reasons.push(`Bot user agent detected: ${ua.slice(0, 80)}`);
      break;
    }
  }

  // 2. Missing common browser headers
  const acceptHeader = request.headers.get('accept');
  const acceptLanguage = request.headers.get('accept-language');
  const acceptEncoding = request.headers.get('accept-encoding');
  const secFetchMode = request.headers.get('sec-fetch-mode');
  const secFetchDest = request.headers.get('sec-fetch-dest');

  if (!acceptHeader || acceptHeader === '*/*') {
    reasons.push('Missing or generic Accept header');
  }
  if (!acceptLanguage) {
    reasons.push('Missing Accept-Language header');
  }
  if (!acceptEncoding) {
    reasons.push('Missing Accept-Encoding header');
  }

  // 3. Check for headless browser indicators
  if (secFetchMode === 'cors' && !secFetchDest) {
    reasons.push('CORS fetch without destination (potential API scraping)');
  }

  return {
    isSuspicious: reasons.length >= 2,
    reasons,
  };
}
