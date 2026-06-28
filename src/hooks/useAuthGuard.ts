'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Redirects unauthenticated users to /login.
 * Returns { isLoading, isAuthenticated } for conditional rendering.
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login?message=Please+sign+in+to+access+the+trials');
    }
  }, [status, router]);

  return {
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated' && !!session,
    session,
  };
}
