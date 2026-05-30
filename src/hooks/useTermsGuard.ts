'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook that checks if the authenticated user has accepted the Terms of Service.
 * Returns { termsAccepted, showTermsGate, acceptTerms, loading }.
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

    // Check terms acceptance from API
    fetch('/api/terms')
      .then((res) => res.json())
      .then((data) => {
        setTermsAccepted(data.termsAccepted === true);
      })
      .catch(() => {
        setTermsAccepted(false);
      })
      .finally(() => setLoading(false));
  }, [session, status]);

  const acceptTerms = useCallback(() => {
    setTermsAccepted(true);
  }, []);

  return {
    termsAccepted,
    showTermsGate: status === 'authenticated' && !loading && !termsAccepted,
    acceptTerms,
    loading,
  };
}
