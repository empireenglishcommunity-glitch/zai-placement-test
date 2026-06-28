'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Redirects unauthenticated users to /login UNLESS guest mode is active.
 * Returns { isLoading, isAuthenticated, isGuest } for conditional rendering.
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if guest mode is active
    if (typeof window !== 'undefined') {
      const guestMode = sessionStorage.getItem('empire-guest-mode');
      if (guestMode === 'true') {
        setIsGuest(true);
        return;
      }
    }

    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return {
    isLoading: status === 'loading' && !isGuest,
    isAuthenticated: (status === 'authenticated' && !!session) || isGuest,
    isGuest,
    session,
  };
}

/**
 * Activate guest mode (call from "Continue as Guest" button)
 */
export function activateGuestMode() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('empire-guest-mode', 'true');
  }
}

/**
 * Check if current user is a guest
 */
export function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('empire-guest-mode') === 'true';
}
