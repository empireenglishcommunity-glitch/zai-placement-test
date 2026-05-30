'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ImperialButton } from './ImperialButton';
import { Loader2 } from 'lucide-react';

interface TermsAcceptanceGateProps {
  onAccepted: () => void;
}

export function TermsAcceptanceGate({ onAccepted }: TermsAcceptanceGateProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/terms', { method: 'POST' });
      if (!res.ok) {
        // Don't block the user — still proceed but log the issue
        console.warn('[TermsGate] Server returned non-OK response, proceeding with local acceptance');
      }
      // Always proceed — the useTermsGuard hook already saves to localStorage
      onAccepted();
    } catch {
      // Network error — don't block the user, proceed with local acceptance
      console.warn('[TermsGate] Network error, proceeding with local acceptance');
      onAccepted();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="rounded-xl border border-[rgba(201,168,76,0.3)] bg-gradient-to-br from-[#111118] to-[#1a1a2e] p-8 sm:p-10 shadow-[0_0_60px_rgba(201,168,76,0.08)]">
            {/* Logo */}
            <div className="text-center mb-6">
              <Image
                src="/logo.png"
                alt="MACAL EMPIRE"
                width={60}
                height={60}
                className="object-contain mx-auto mb-4"
                priority
              />
              <p className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.4em] uppercase text-[#8b7355] mb-2">
                MACAL EMPIRE
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow mb-2">
                IMPERIAL DECREE
              </h2>
              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                Before you enter the Empire, you must accept our laws.
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.4)] to-transparent" />

            {/* Terms Summary */}
            <div className="space-y-3 mb-6 p-4 rounded-lg border border-[rgba(201,168,76,0.1)] bg-[rgba(10,10,10,0.5)]">
              <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed">
                By entering the Empire English Community, you acknowledge that:
              </p>
              <ul className="space-y-2 text-sm text-[#8b7355] font-[family-name:var(--font-sans)]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a84c] mt-1">•</span>
                  <span>This platform is owned by <strong className="text-[#c9a84c]">MACAL EMPIRE</strong>. All content is proprietary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a84c] mt-1">•</span>
                  <span>You will not copy, reproduce, or distribute any content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a84c] mt-1">•</span>
                  <span>You will not reverse engineer or replicate system logic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a84c] mt-1">•</span>
                  <span>Unauthorized use may result in access termination.</span>
                </li>
              </ul>
            </div>

            {/* Read Full Terms Link */}
            <div className="text-center mb-6">
              <Link
                href="/terms"
                target="_blank"
                className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider hover:text-[#e8d48b] transition-colors underline underline-offset-4"
              >
                Read Full Terms of Service
              </Link>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  agreed
                    ? 'border-[#c9a84c] bg-[#c9a84c]'
                    : 'border-[rgba(201,168,76,0.4)] bg-transparent hover:border-[#c9a84c]'
                }`}
                aria-label="Agree to Terms of Service"
              >
                {agreed && (
                  <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed cursor-pointer" onClick={() => setAgreed(!agreed)}>
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#c9a84c] hover:text-[#e8d48b] underline underline-offset-2 transition-colors">
                  MACAL EMPIRE Terms of Service
                </Link>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#e74c3c] text-sm font-[family-name:var(--font-sans)] text-center mb-4">
                {error}
              </p>
            )}

            {/* Accept Button */}
            <div className="text-center">
              <ImperialButton
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!agreed || isSubmitting}
                onClick={handleAccept}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sealing the Oath...
                  </span>
                ) : (
                  'Accept & Enter the Empire'
                )}
              </ImperialButton>
            </div>

            {/* Decline */}
            <p className="text-center mt-4 font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider">
              If you decline, you will be returned to the gates.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
