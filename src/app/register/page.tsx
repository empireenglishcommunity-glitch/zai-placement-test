'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Shield } from 'lucide-react';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, MetallicCard, ImperialButton, GlowingBorder } from '@/components/empire';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('The phrases do not match. Your oath must be consistent.');
      return;
    }

    if (password.length < 6) {
      setError('Your secret phrase must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. The Empire rejects your petition.');
        setIsLoading(false);
        return;
      }

      // Auto-login after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push('/login');
      } else {
        // First-time registration → show cinematic welcome
        router.push('/welcome');
      }
    } catch {
      setError('An error occurred. The gates are temporarily sealed.');
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
                  SWEAR THE OATH
                </h1>
                <p className="font-[family-name:var(--font-heading)] text-[8px] sm:text-[10px] tracking-[0.4em] uppercase text-[#8b7355] mb-2">
                  MACAL EMPIRE
                </p>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                  Take the oath. Begin your transformation.
                </p>
              </motion.div>

              {/* Oath Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-6 p-3 rounded-md border border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.03)] text-center"
              >
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs italic leading-relaxed">
                  &ldquo;By joining the Empire, I swear to undertake the Four Trials —
                  of Voice, of the Ear, of Words, and of Structure —
                  and to prove my worth before the Imperial Council.&rdquo;
                </p>
              </motion.div>

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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm">
                    Chosen Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your imperial name"
                      className="w-full pl-10 pr-4 py-2.5 bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md text-[#e8e0d0] placeholder:text-[#8b7355] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

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

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm">
                    Secret Phrase
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md text-[#e8e0d0] placeholder:text-[#8b7355] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7355] hover:text-[#c9a84c] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm">
                    Confirm Secret Phrase
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your secret phrase"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md text-[#e8e0d0] placeholder:text-[#8b7355] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7355] hover:text-[#c9a84c] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setTermsAgreed(!termsAgreed)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                      termsAgreed
                        ? 'border-[#c9a84c] bg-[#c9a84c]'
                        : 'border-[rgba(201,168,76,0.4)] bg-transparent hover:border-[#c9a84c]'
                    }`}
                    aria-label="Agree to Terms of Service"
                  >
                    {termsAgreed && (
                      <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <label className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed cursor-pointer" onClick={() => setTermsAgreed(!termsAgreed)}>
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-[#c9a84c] hover:text-[#e8d48b] underline underline-offset-2 transition-colors">
                      MACAL EMPIRE Terms of Service
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <ImperialButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !termsAgreed}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Swearing the Oath...
                    </span>
                  ) : (
                    'Swear the Oath'
                  )}
                </ImperialButton>
              </form>

              {/* Divider */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] tracking-wider">OR</span>
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-[#8b7355] text-sm">
                  Already a member?{' '}
                  <Link
                    href="/login"
                    className="text-[#c9a84c] hover:text-[#e8d48b] font-[family-name:var(--font-heading)] transition-colors"
                  >
                    Enter the Empire
                  </Link>
                </p>
              </div>

              {/* Demo Access */}
              <div className="mt-4 text-center">
                <p className="text-[#8b7355]/50 text-xs mb-2">or explore as a guest</p>
                <Link
                  href="/dashboard"
                  className="text-[#8b7355] hover:text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] transition-colors underline underline-offset-2"
                >
                  Enter as Guest
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
