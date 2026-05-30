'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Track active assessment session globally
let isAssessmentActive = false;

export function setAssessmentActive(active: boolean) {
  isAssessmentActive = active;
}

export function getAssessmentActive() {
  return isAssessmentActive;
}

/**
 * Hook that triggers browser beforeunload warning during active assessment.
 * Also intercepts Next.js route changes.
 */
export function useAssessmentGuard(active: boolean) {
  const router = useRouter();

  useEffect(() => {
    setAssessmentActive(active);
  }, [active]);

  // Browser refresh/close warning
  useEffect(() => {
    if (!active) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers require this pattern
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [active]);
}
