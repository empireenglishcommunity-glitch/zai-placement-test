'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const TERMS_LOCAL_KEY = 'empire-terms-accepted';

/**
 * Hook that checks if the authenticated user has accepted the Terms of Service.
 * Uses both server-side (DB) and client-side (localStorage) tracking.
 * Falls back to localStorage if the API is unavailable.
 */
export function useTermsGuard() {
  const { data: session, status } = useSession();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated' || !session?.user) {
      setTermsAccepted(false);
      setLoading(false);
      return;
    }

    // Check localStorage first for instant response
    const localAccepted = localStorage.getItem(TERMS_LOCAL_KEY);
    if (localAccepted === 'true') {
      setTermsAccepted(true);
      setLoading(false);
      // Still verify with server in background (don't block UI)
      fetch('/api/terms')
        .then((res) => res.json())
        .then((data) => {
          if (!data.termsAccepted) {
            // Server says not accepted but localStorage says yes — sync server
            fetch('/api/terms', { method: 'POST' }).catch(() => {});
          }
        })
        .catch(() => {});
      return;
    }

    // Check terms acceptance from API
    fetch('/api/terms')
      .then((res) => res.json())
      .then((data) => {
        const accepted = data.termsAccepted === true;
        setTermsAccepted(accepted);
        if (accepted) {
          localStorage.setItem(TERMS_LOCAL_KEY, 'true');
        }
      })
      .catch(() => {
        // API failed — check localStorage as fallback
        const fallback = localStorage.getItem(TERMS_LOCAL_KEY);
        setTermsAccepted(fallback === 'true');
      })
      .finally(() => setLoading(false));
  }, [session, status]);

  const acceptTerms = useCallback(() => {
    setTermsAccepted(true);
    localStorage.setItem(TERMS_LOCAL_KEY, 'true');
  }, []);

  return {
    termsAccepted,
    showTermsGate: status === 'authenticated' && !loading && !termsAccepted,
    acceptTerms,
    loading,
  };
}
