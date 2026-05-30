'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Mark welcome as seen
    const hasSeenWelcome = localStorage.getItem('empire-welcome-seen');
    if (hasSeenWelcome) {
      router.push('/dashboard');
      return;
    }
    localStorage.setItem('empire-welcome-seen', 'true');

    // Stagger content reveal
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center empire-bg relative overflow-hidden">
      {/* Atmospheric background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.1)_0%,rgba(201,168,76,0.02)_40%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#c9a84c]"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, -40 - Math.random() * 60],
              x: [0, (Math.random() - 0.5) * 30],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 text-center px-6 max-w-2xl"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <Image
                  src="/logo.png"
                  alt="MACAL EMPIRE"
                  width={120}
                  height={120}
                  className="object-contain mx-auto"
                  priority
                />
                <motion.div
                  className="absolute inset-0 -z-10 scale-200"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-full h-full bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_60%)]" />
                </motion.div>
              </div>
            </motion.div>

            {/* MACAL EMPIRE brand */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-[0.5em] uppercase text-[#8b7355] mb-3"
            >
              MACAL EMPIRE PRESENTS
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="gold-shimmer">YOU ARE NOW ONE OF US</span>
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="w-40 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
            />

            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="space-y-4 mb-10"
            >
              <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-base sm:text-lg italic leading-relaxed">
                You have taken the first step toward your greatness.
              </p>
              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base leading-relaxed">
                The Empire does not accept the weak — and you have proven your will simply by walking through these gates. Now, you must prove your worth through the Four Trials. Your journey from Recruit to Champion begins now.
              </p>
              <p className="font-[family-name:var(--font-sans)] text-[#c9a84c] text-sm sm:text-base italic">
                &ldquo;Forged in Language. Crowned in Mastery.&rdquo;
              </p>
            </motion.div>

            {/* Swords */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="text-[#c9a84c] text-2xl mb-8"
            >
              ⚔️
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.3 }}
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(201,168,76,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-md font-[family-name:var(--font-heading)] font-semibold text-base sm:text-lg tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#c9a84c] to-[#cd7f32] cursor-pointer transition-all duration-300 hover:from-[#d4b55c] hover:to-[#d48f42] shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                >
                  ENTER THE EMPIRE
                </motion.button>
              </Link>
            </motion.div>

            {/* Auto-redirect notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="mt-6 font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider"
            >
              Proceeding to your command center...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
