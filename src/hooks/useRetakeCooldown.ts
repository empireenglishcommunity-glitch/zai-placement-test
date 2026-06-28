'use client';

import { useState, useEffect, useCallback } from 'react';

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Manages retake cooldown for a specific trial module.
 * Uses localStorage to persist cooldown across page refreshes.
 */
export function useRetakeCooldown(module: string) {
  const [remainingMs, setRemainingMs] = useState(0);
  const storageKey = `empire-cooldown-${module}`;

  // Check cooldown on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const completedAt = parseInt(stored, 10);
      const elapsed = Date.now() - completedAt;
      const remaining = COOLDOWN_MS - elapsed;
      if (remaining > 0) {
        setRemainingMs(remaining);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Countdown timer
  useEffect(() => {
    if (remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          localStorage.removeItem(storageKey);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingMs, storageKey]);

  // Call this when a trial is completed
  const markCompleted = useCallback(() => {
    localStorage.setItem(storageKey, Date.now().toString());
    setRemainingMs(COOLDOWN_MS);
  }, [storageKey]);

  const isOnCooldown = remainingMs > 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const remainingFormatted = isOnCooldown
    ? `${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60).toString().padStart(2, '0')}`
    : '';

  return {
    isOnCooldown,
    remainingMs,
    remainingFormatted,
    markCompleted,
  };
}
