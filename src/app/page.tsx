'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, MetallicCard, ImperialButton, SectionDivider, ImperialRankBadge, ProgressBar, TacticalPanel, GlowingBorder, TestimonialsSection, SocialMediaSection, SponsorshipSection } from '@/components/empire';
import { Swords, Shield, BookOpen, Headphones } from 'lucide-react';

const trials = [
  {
    icon: Swords,
    title: 'Trial of Voice',
    subtitle: 'Speaking',
    description: 'Prove your spoken command of the language. Read aloud, respond spontaneously, and shadow the masters.',
    color: '#cd7f32',
  },
  {
    icon: Headphones,
    title: 'Trial of the Ear',
    subtitle: 'Listening',
    description: 'Demonstrate your ability to understand spoken English at varying speeds — from slow march to battle speed.',
    color: '#c9a84c',
  },
  {
    icon: BookOpen,
    title: 'Trial of Words',
    subtitle: 'Vocabulary',
    description: 'Show the breadth of your lexical knowledge across frequency bands, from foundation to elite words.',
    color: '#ff6b35',
  },
  {
    icon: Shield,
    title: 'Trial of Structure',
    subtitle: 'Grammar',
    description: 'Prove your mastery of the structural foundations of English — tenses, conditionals, and beyond.',
    color: '#e74c3c',
  },
];

const ranks = [
  { level: 0 as const, description: 'Stand at the gates. The journey begins.' },
  { level: 1 as const, description: 'First oath taken. Training awaits.' },
  { level: 2 as const, description: 'Mettle proven. Strength recognized.' },
  { level: 3 as const, description: 'Trials mastered. Among the elite.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Emblem */}
          <motion.div
            className="mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/logo.png"
              alt="Empire English Community"
              width={120}
              height={120}
              className="object-contain mx-auto"
              priority
            />
          </motion.div>

          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-4">
            <span className="gold-shimmer">EMPIRE ENGLISH</span>
          </h1>
          <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl md:text-2xl text-[#8b7355] tracking-[0.2em] mb-6">
            COMMUNITY
          </h2>
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg md:text-xl italic max-w-2xl mx-auto mb-10">
            &ldquo;Forged in Language. Crowned in Mastery.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <GlowingBorder intensity="high">
                <ImperialButton variant="primary" size="lg">
                  Begin Your Trials
                </ImperialButton>
              </GlowingBorder>
            </Link>
            <a href="#trials">
              <ImperialButton variant="outline" size="lg">
                Learn More
              </ImperialButton>
            </a>
          </div>
        </motion.div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      <SectionDivider />

      {/* ── The Four Trials ─────────────────────────────── */}
      <section id="trials" className="relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] text-glow mb-3">
              THE FOUR TRIALS
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
              Complete the trials. Prove your worth. Earn your Imperial Rank.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trials.map((trial, i) => (
              <motion.div
                key={trial.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <MetallicCard className="p-6 h-full flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-4"
                    style={{
                      borderColor: trial.color,
                      boxShadow: `0 0 15px ${trial.color}30, inset 0 0 10px ${trial.color}15`,
                    }}
                  >
                    <trial.icon className="w-6 h-6" style={{ color: trial.color }} />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold text-[#e8e0d0] mb-1">
                    {trial.title}
                  </h3>
                  <span
                    className="font-[family-name:var(--font-heading)] text-xs tracking-widest uppercase mb-3"
                    style={{ color: trial.color }}
                  >
                    {trial.subtitle}
                  </span>
                  <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm leading-relaxed">
                    {trial.description}
                  </p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Imperial Ranks ──────────────────────────────── */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] text-glow mb-3">
              IMPERAL RANKS
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
              Rise through the ranks. From Recruit to Champion.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ranks.map((rank, i) => (
              <motion.div
                key={rank.level}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <ImperialRankBadge level={rank.level} size="lg" />
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm mt-2 italic">
                  {rank.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Your Progress Preview ───────────────────────── */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] text-glow mb-3">
              TRACK YOUR ASCENT
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic">
              Every trial conquered brings you closer to mastery.
            </p>
          </motion.div>

          <TacticalPanel className="p-6 space-y-5">
            <ProgressBar value={65} max={100} label="Speaking" color="#cd7f32" />
            <ProgressBar value={40} max={100} label="Listening" color="#c9a84c" />
            <ProgressBar value={78} max={100} label="Vocabulary" color="#ff6b35" />
            <ProgressBar value={55} max={100} label="Grammar" color="#e74c3c" />
          </TacticalPanel>
        </div>
      </section>

      <SectionDivider />

      {/* ── Testimonials ───────────────────────────────── */}
      <TestimonialsSection />

      <SectionDivider />

      {/* ── Social Media Community ──────────────────────── */}
      <SocialMediaSection />

      <SectionDivider />

      {/* ── Sponsorship Authority ───────────────────────── */}
      <SponsorshipSection />

      <SectionDivider />

      {/* ── Call to Action ──────────────────────────────── */}
      <section className="relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <GlowingBorder intensity="high" className="rounded-lg">
            <MetallicCard hover={false} glowOnHover={false} className="p-10 sm:p-14">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c] text-glow mb-4">
                THE EMPIRE AWAITS
              </h2>
              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic mb-8">
                Enter the gates. Face the Four Trials. Claim your Imperial Rank.
              </p>
              <Link href="/register">
                <ImperialButton variant="primary" size="lg">
                  Join the Empire
                </ImperialButton>
              </Link>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
