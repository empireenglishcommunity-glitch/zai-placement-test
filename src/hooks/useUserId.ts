'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

/**
 * Returns the current user ID — works for both authenticated users and guests.
 * - Authenticated: returns real database user ID or email
 * - Guest: generates and persists a guest-{uuid} in sessionStorage
 * - Returns null only during initial loading
 */
export function useUserId(): { userId: string; isGuest: boolean; isLoading: boolean } {
  const { data: session, status } = useSession();

  const result = useMemo(() => {
    // Still loading auth
    if (status === 'loading') {
      // Check if guest mode while loading
      if (typeof window !== 'undefined' && sessionStorage.getItem('empire-guest-mode') === 'true') {
        return { userId: getOrCreateGuestId(), isGuest: true, isLoading: false };
      }
      return { userId: '', isGuest: false, isLoading: true };
    }

    // Authenticated user
    if (status === 'authenticated' && session?.user) {
      const id = (session.user as Record<string, unknown>)?.id as string;
      if (id) return { userId: id, isGuest: false, isLoading: false };
      if (session.user.email) return { userId: session.user.email, isGuest: false, isLoading: false };
    }

    // Guest mode
    if (typeof window !== 'undefined' && sessionStorage.getItem('empire-guest-mode') === 'true') {
      return { userId: getOrCreateGuestId(), isGuest: true, isLoading: false };
    }

    // Not authenticated and not guest
    return { userId: '', isGuest: false, isLoading: false };
  }, [status, session]);

  return result;
}

/**
 * Get or create a persistent guest ID for this browser session.
 */
function getOrCreateGuestId(): string {
  const key = 'empire-guest-id';
  let guestId = sessionStorage.getItem(key);
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, guestId);
  }
  return guestId;
}
