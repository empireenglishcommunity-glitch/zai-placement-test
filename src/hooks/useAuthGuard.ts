'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Hook that protects pages requiring authentication.
 * Redirects to /login if user is not authenticated.
 * Returns { isLoading, isAuthenticated, user } for conditional rendering.
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading, wait

    if (status === 'unauthenticated') {
      setIsRedirecting(true);
      router.push('/login');
    }
  }, [status, router]);

  return {
    isLoading: status === 'loading' || isRedirecting,
    isAuthenticated: status === 'authenticated',
    user: session?.user ?? null,
    session,
  };
}
