'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, MetallicCard, ImperialButton, GlowingBorder } from '@/components/empire';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // If next-auth fails, try the register API directly
        // For demo/first-time use, auto-navigate to dashboard
        setError('Invalid credentials. The Empire does not recognize you.');
      } else {
        router.push('/dashboard');
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
                <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow mb-1">
                  ENTER THE EMPIRE
                </h1>
                <p className="font-arabic text-[#8b7355] text-sm mb-2" dir="rtl">ادخل الإمبراطورية</p>
                <p className="font-[family-name:var(--font-heading)] text-[8px] sm:text-[10px] tracking-[0.4em] uppercase text-[#8b7355] mb-2">
                  MACAL EMPIRE
                </p>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                  The gates stand open for those who dare to enter.
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[#8b7355] font-[family-name:var(--font-heading)] text-sm">
                    Imperial Email / البريد الإلكتروني
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
                      placeholder="••••••••"
                      required
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[#8b7355] hover:text-[#c9a84c] text-sm font-[family-name:var(--font-heading)] transition-colors"
                  >
                    نسيت كلمة المرور؟ Forgotten your path?
                  </Link>
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
                      Entering...
                    </span>
                  ) : (
                    'ادخل / Enter the Empire'
                  )}
                </ImperialButton>
              </form>

              {/* Divider */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)] tracking-wider">OR</span>
                <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
              </div>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-[#8b7355] text-sm">
                  لا تملك حساب؟ Not yet a member?{' '}
                  <Link
                    href="/register"
                    className="text-[#c9a84c] hover:text-[#e8d48b] font-[family-name:var(--font-heading)] transition-colors"
                  >
                    Swear the Oath
                  </Link>
                </p>
              </div>

              {/* Guest Mode */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    sessionStorage.setItem('empire-guest-mode', 'true');
                    router.push('/assessment');
                  }}
                  className="text-[#8b7355] hover:text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] transition-colors underline underline-offset-4"
                >
                  الدخول كضيف (لن يتم حفظ النتائج) — Continue as Guest
                </button>
              </div>

              {/* Legal Links */}
              <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                <Link
                  href="/terms"
                  className="text-[#8b7355] hover:text-[#c9a84c] font-[family-name:var(--font-heading)] transition-colors"
                >
                  Terms of Service
                </Link>
                <span className="text-[rgba(201,168,76,0.2)]">|</span>
                <Link
                  href="/privacy"
                  className="text-[#8b7355] hover:text-[#c9a84c] font-[family-name:var(--font-heading)] transition-colors"
                >
                  Privacy Policy
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
