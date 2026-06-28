'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Wrap page content with this component to require authentication.
 * Shows a loading spinner while checking, redirects to /login if not authenticated.
 */
export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Crown className="w-12 h-12 text-[#c9a84c] mx-auto" />
          </motion.div>
          <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">Verifying your identity...</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
