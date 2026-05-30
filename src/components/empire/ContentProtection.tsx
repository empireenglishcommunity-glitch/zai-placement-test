'use client';

/**
 * MACAL EMPIRE — Content Protection Layer
 * Lightweight anti-inspection and copy-protection system.
 * Discourages DevTools usage, content copying, and screenshot-based scraping.
 */

import { useEffect, useCallback, useState } from 'react';
import { logSecurityEvent } from '@/lib/security-logger';

interface ContentProtectionProps {
  /** Enable DevTools detection (lightweight) */
  detectDevTools?: boolean;
  /** Block keyboard shortcuts (Ctrl+U, Ctrl+S, Ctrl+Shift+I, F12, etc.) */
  blockShortcuts?: boolean;
  /** Block right-click context menu */
  blockContextMenu?: boolean;
  /** Block print screen (Ctrl+P) */
  blockPrint?: boolean;
  /** Enable visibility change detection (tab switching during assessment) */
  detectVisibilityChange?: boolean;
  /** Callback when suspicious activity is detected */
  onSuspiciousActivity?: (type: string, details: string) => void;
  /** Show warning banner when activity detected */
  showWarningBanner?: boolean;
}

interface WarningState {
  show: boolean;
  message: string;
  type: 'warning' | 'danger';
}

/**
 * ContentProtection component — wraps assessment pages with protection measures.
 * Must be rendered as a sibling/parent of protected content.
 */
export function ContentProtection({
  detectDevTools = true,
  blockShortcuts = true,
  blockContextMenu = true,
  blockPrint = true,
  detectVisibilityChange = false,
  onSuspiciousActivity,
  showWarningBanner = true,
}: ContentProtectionProps) {
  const [warning, setWarning] = useState<WarningState>({ show: false, message: '', type: 'warning' });

  const triggerWarning = useCallback((message: string, type: 'warning' | 'danger' = 'warning') => {
    setWarning({ show: true, message, type });
    // Auto-dismiss after 4 seconds
    setTimeout(() => setWarning((prev) => ({ ...prev, show: false })), 4000);
  }, []);

  const reportActivity = useCallback((type: string, details: string) => {
    logSecurityEvent({
      type: 'devtools_inspection',
      severity: 'low',
      details: `${type}: ${details}`,
    });
    onSuspiciousActivity?.(type, details);
  }, [onSuspiciousActivity]);

  // ─── Block Keyboard Shortcuts ───────────────────────────────
  useEffect(() => {
    if (!blockShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 — DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        reportActivity('keyboard', 'F12 DevTools shortcut blocked');
        triggerWarning('Developer tools access is restricted during assessment.', 'danger');
        return;
      }

      // Ctrl+Shift+I — DevTools
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+Shift+I DevTools shortcut blocked');
        triggerWarning('Developer tools access is restricted during assessment.', 'danger');
        return;
      }

      // Ctrl+Shift+J — Console
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+Shift+J Console shortcut blocked');
        triggerWarning('Console access is restricted during assessment.', 'danger');
        return;
      }

      // Ctrl+Shift+C — Element Inspector
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+Shift+C Inspector shortcut blocked');
        return;
      }

      // Ctrl+U — View Source
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+U view source blocked');
        return;
      }

      // Ctrl+S — Save Page
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+S save page blocked');
        triggerWarning('Saving page content is not permitted.', 'warning');
        return;
      }

      // Ctrl+A — Select All (in protected areas)
      if (e.ctrlKey && (e.key === 'A' || e.key === 'a')) {
        const target = e.target as HTMLElement;
        if (target.closest('.protected-content') && !target.matches('input, textarea, [contenteditable]')) {
          e.preventDefault();
          return;
        }
      }

      // Ctrl+P — Print
      if (blockPrint && e.ctrlKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        reportActivity('keyboard', 'Ctrl+P print blocked');
        triggerWarning('Printing assessment content is not permitted.', 'warning');
        return;
      }

      // Ctrl+C — Copy (in protected areas only)
      if (e.ctrlKey && (e.key === 'C' || e.key === 'c')) {
        const target = e.target as HTMLElement;
        if (target.closest('.protected-content') && !target.matches('input, textarea, [contenteditable]')) {
          e.preventDefault();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [blockShortcuts, blockPrint, reportActivity, triggerWarning]);

  // ─── Block Right-Click Context Menu ─────────────────────────
  useEffect(() => {
    if (!blockContextMenu) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content') && !target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        reportActivity('context-menu', 'Right-click blocked in protected area');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    return () => window.removeEventListener('contextmenu', handleContextMenu, true);
  }, [blockContextMenu, reportActivity]);

  // ─── DevTools Detection (Lightweight) ──────────────────────
  useEffect(() => {
    if (!detectDevTools) return;

    let devtoolsOpen = false;
    const threshold = 160;

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if ((widthDiff || heightDiff) && !devtoolsOpen) {
        devtoolsOpen = true;
        reportActivity('devtools', 'Developer tools window detected');
        triggerWarning('Developer tools detected. This activity is logged.', 'danger');
      } else if (!widthDiff && !heightDiff && devtoolsOpen) {
        devtoolsOpen = false;
      }
    };

    const interval = setInterval(checkDevTools, 2000);
    return () => clearInterval(interval);
  }, [detectDevTools, reportActivity, triggerWarning]);

  // ─── Visibility Change Detection ───────────────────────────
  useEffect(() => {
    if (!detectVisibilityChange) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportActivity('visibility', 'Tab/window became hidden during assessment');
        triggerWarning('Leaving the assessment window is detected and logged.', 'warning');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [detectVisibilityChange, reportActivity, triggerWarning]);

  // ─── Block drag events on protected content ────────────────
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        e.preventDefault();
      }
    };

    window.addEventListener('dragstart', handleDragStart, true);
    return () => window.removeEventListener('dragstart', handleDragStart, true);
  }, []);

  // ─── Warning Banner ────────────────────────────────────────
  if (!showWarningBanner || !warning.show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center px-4 py-2"
      style={{
        background: warning.type === 'danger'
          ? 'linear-gradient(90deg, rgba(231,76,60,0.95), rgba(255,107,53,0.95))'
          : 'linear-gradient(90deg, rgba(201,168,76,0.95), rgba(205,127,50,0.95))',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-wider text-white font-semibold">
        {warning.message}
      </p>
    </div>
  );
}

/**
 * Hook version for programmatic use without rendering a component.
 */
export function useContentProtection(options: {
  blockShortcuts?: boolean;
  blockContextMenu?: boolean;
  detectVisibilityChange?: boolean;
  onSuspiciousActivity?: (type: string, details: string) => void;
} = {}) {
  const {
    blockShortcuts = true,
    blockContextMenu = true,
    detectVisibilityChange = false,
    onSuspiciousActivity,
  } = options;

  useEffect(() => {
    if (!blockShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const blocked = (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key))
      );

      if (blocked) {
        e.preventDefault();
        onSuspiciousActivity?.('keyboard', `Blocked shortcut: ${e.key}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [blockShortcuts, onSuspiciousActivity]);

  useEffect(() => {
    if (!blockContextMenu) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    return () => window.removeEventListener('contextmenu', handleContextMenu, true);
  }, [blockContextMenu]);

  useEffect(() => {
    if (!detectVisibilityChange) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onSuspiciousActivity?.('visibility', 'Tab hidden during assessment');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [detectVisibilityChange, onSuspiciousActivity]);
}
