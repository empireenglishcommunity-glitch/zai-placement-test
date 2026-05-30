'use client';

/**
 * MACAL EMPIRE — Dynamic Watermark System
 * Renders subtle diagonal watermark overlays containing user info + MACAL EMPIRE branding.
 * Designed to discourage screenshots, leaks, and unauthorized redistribution.
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';

interface EmpireWatermarkProps {
  /** Additional text to display (e.g., assessment module name) */
  context?: string;
  /** Opacity of the watermark (0-1), default 0.04 */
  opacity?: number;
  /** Rotation angle in degrees, default -22 */
  rotation?: number;
  /** Font size in px, default 14 */
  fontSize?: number;
  /** Gap between watermarks in px, default 280 */
  gapX?: number;
  /** Vertical gap between watermark rows in px, default 180 */
  gapY?: number;
  /** Whether this is for a certificate (more prominent) */
  isCertificate?: boolean;
  /** Custom user identifier (overrides session) */
  userName?: string;
  /** Custom session identifier */
  sessionId?: string;
}

export function EmpireWatermark({
  context,
  opacity = 0.04,
  rotation = -22,
  fontSize = 14,
  gapX = 280,
  gapY = 180,
  isCertificate = false,
  userName,
  sessionId,
}: EmpireWatermarkProps) {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // User identification for watermark
  const displayName = userName || session?.user?.name || session?.user?.email || 'PROTECTED';
  const sessionStamp = sessionId || `SID-${Date.now().toString(36).toUpperCase()}`;

  // Timestamp that stays stable per render cycle
  const timestamp = useMemo(() => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
  }, []);

  // Observe container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Generate watermark grid positions
  const watermarks = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];

    const cols = Math.ceil(dimensions.width / gapX) + 2;
    const rows = Math.ceil(dimensions.height / gapY) + 2;
    const items: Array<{ x: number; y: number; line1: string; line2: string; line3: string }> = [];

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * gapX + (row % 2 === 0 ? gapX / 2 : 0);
        const y = row * gapY;

        items.push({
          x,
          y,
          line1: displayName,
          line2: `${sessionStamp} | ${context || 'MACAL EMPIRE'}`,
          line3: timestamp,
        });
      }
    }

    return items;
  }, [dimensions, gapX, gapY, displayName, sessionStamp, context, timestamp]);

  const certOpacity = isCertificate ? Math.max(opacity, 0.06) : opacity;
  const certFontSize = isCertificate ? fontSize + 2 : fontSize;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-50"
      style={{ userSelect: 'none' }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          width: '200%',
          height: '200%',
          transform: `rotate(${rotation}deg)`,
          opacity: certOpacity,
        }}
      >
        {watermarks.map((wm, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: wm.x,
              top: wm.y,
              fontSize: certFontSize,
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              color: isCertificate ? '#c9a84c' : '#8b7355',
              whiteSpace: 'nowrap',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
              textShadow: isCertificate ? '0 0 8px rgba(201,168,76,0.3)' : 'none',
            }}
          >
            <div>{wm.line1}</div>
            <div style={{ fontSize: certFontSize - 3, fontWeight: 400, opacity: 0.7 }}>
              {wm.line2}
            </div>
            <div style={{ fontSize: certFontSize - 4, fontWeight: 300, opacity: 0.5 }}>
              {wm.line3}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact inline watermark for specific content blocks.
 * Shows a single line of watermark text.
 */
export function InlineWatermark({
  text,
  opacity = 0.08,
}: {
  text?: string;
  opacity?: number;
}) {
  const { data: session } = useSession();
  const displayText = text || `${session?.user?.name || session?.user?.email || 'PROTECTED'} | MACAL EMPIRE`;

  return (
    <span
      className="inline-block select-none pointer-events-none"
      style={{
        opacity,
        fontSize: 10,
        fontFamily: "'Cinzel', serif",
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#c9a84c',
        textShadow: '0 0 4px rgba(201,168,76,0.2)',
      }}
      aria-hidden="true"
    >
      {displayText}
    </span>
  );
}
