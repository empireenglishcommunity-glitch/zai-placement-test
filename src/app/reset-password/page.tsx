'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Navbar, Footer, ParticleBackground, MetallicCard, ImperialButton, GlowingBorder } from '@/components/empire';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Reset failed. The link may have expired.');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
          <MetallicCard className="max-w-md w-full p-8 text-center" hover={false}>
            <AlertCircle className="w-12 h-12 text-[#e74c3c] mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#e74c3c] mb-2">Invalid Reset Link</h2>
            <p className="text-[#8b7355] mb-6">This reset link is invalid or has expired.</p>
            <Link href="/forgot-password"><ImperialButton variant="primary">Request New Link</ImperialButton></Link>
          </MetallicCard>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
          <MetallicCard className="max-w-md w-full p-8 text-center" hover={false}>
            <CheckCircle2 className="w-12 h-12 text-[#4ade80] mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#4ade80] mb-2">Password Reset!</h2>
            <p className="text-[#8b7355]">Redirecting to login...</p>
          </MetallicCard>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <GlowingBorder intensity="medium">
            <MetallicCard className="p-8" hover={false}>
              <div className="text-center mb-6">
                <Lock className="w-10 h-10 text-[#c9a84c] mx-auto mb-3" />
                <h1 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-1">Create New Password</h1>
                <p className="text-[#8b7355] text-sm">Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md px-4 py-3 text-[#c0c0c0] focus:border-[#c9a84c] focus:outline-none"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-[#8b7355] text-xs font-[family-name:var(--font-heading)] mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(201,168,76,0.2)] rounded-md px-4 py-3 text-[#c0c0c0] focus:border-[#c9a84c] focus:outline-none"
                    placeholder="Repeat your password"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#e74c3c] text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <ImperialButton variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </ImperialButton>
              </form>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen empire-bg flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
