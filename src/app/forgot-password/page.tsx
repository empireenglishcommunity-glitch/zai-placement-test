'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, MetallicCard, ImperialButton, GlowingBorder } from '@/components/empire';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <GlowingBorder intensity="medium" className="rounded-lg">
            <MetallicCard hover={false} glowOnHover={false} className="p-8 sm:p-10">
              {/* Emblem */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.div
                  className="mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src="/logo.png"
                    alt="Empire English Community"
                    width={80}
                    height={80}
                    className="object-contain mx-auto"
                    priority
                  />
                </motion.div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow mb-2">
                  LOST YOUR PATH?
                </h1>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                  Even the mightiest warrior can lose their way. We shall guide you back.
                </p>
              </motion.div>

              {!isSubmitted ? (
                <>
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 flex items-center gap-2 p-3 rounded-md bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] text-[#e74c3c] text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm">
                        Imperial Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.name@empire.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md text-[#e8e0d0] placeholder:text-[#8b7355] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <ImperialButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Seeking your path...
                        </span>
                      ) : (
                        'Reclaim Your Path'
                      )}
                    </ImperialButton>
                  </form>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <div className="p-4 rounded-md border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)]">
                    <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed">
                      In production, a restoration link would be sent to your imperial email.
                      For now, please contact an administrator to reclaim your path.
                    </p>
                  </div>
                  <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs italic">
                    The Empire does not abandon its own.
                  </p>
                </motion.div>
              )}

              {/* Divider */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] tracking-wider">OR</span>
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
              </div>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-[#e8d48b] font-[family-name:var(--font-heading)] text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to the Gates
                </Link>
              </div>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
