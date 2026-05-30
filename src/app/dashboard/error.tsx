'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Footer, ImperialButton } from '@/components/empire';
import { RefreshCw, Shield } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.05)] mx-auto">
            <Shield className="w-10 h-10 text-[#8b7355]" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#c9a84c]">
            Command Center Disrupted
          </h1>
          <p className="text-[#8b7355] text-sm font-[family-name:var(--font-sans)]">
            The Empire encountered an unexpected error while loading your dashboard.
            This is not a reflection of your standing — please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="font-[family-name:var(--font-heading)] font-semibold rounded-md transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#c9a84c] to-[#cd7f32] text-[#0a0a0a] hover:from-[#d4b55c] hover:to-[#d48f42] shadow-[0_0_15px_rgba(201,168,76,0.3)] px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Dashboard
            </button>
            <Link href="/">
              <ImperialButton variant="outline" size="md">
                Return to Hall
              </ImperialButton>
            </Link>
          </div>
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
