'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Crown, Eye, Shield, Star, Swords } from 'lucide-react';
import { MetallicCard, GlowingBorder, SectionDivider } from '@/components/empire';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export function FounderSection() {
  return (
    <section className="relative z-10 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* ── Section Title ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-[0.4em] uppercase mb-3">
            The Visionary Behind the Empire
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] text-glow mb-4">
            FOUNDER & VISION
          </h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c60, transparent)' }} />
        </motion.div>

        {/* ── Founder Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <GlowingBorder intensity="high" className="rounded-xl">
            <MetallicCard hover={false} glowOnHover={false} className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                {/* ── Founder Portrait ── */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    {/* Outer glow ring */}
                    <div
                      className="absolute -inset-3 rounded-full opacity-60 blur-md group-hover:opacity-90 transition-opacity duration-700"
                      style={{
                        background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 50%, transparent 70%)',
                      }}
                    />
                    {/* Cinematic border frame */}
                    <div
                      className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden"
                      style={{
                        border: '3px solid rgba(201,168,76,0.5)',
                        boxShadow: '0 0 30px rgba(201,168,76,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Image
                        src="/founder.png"
                        alt="Mahmoud Ashri — CEO & Founder of MACAL EMPIRE"
                        fill
                        className="object-cover object-top"
                        priority
                      />
                      {/* Subtle overlay for cinematic feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.3)] via-transparent to-transparent" />
                    </div>
                    {/* Corner seal decoration */}
                    <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1a1a2e, #0a0a0a)', border: '2px solid rgba(201,168,76,0.6)', boxShadow: '0 0 15px rgba(201,168,76,0.2)' }}>
                      <Crown className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                  </div>
                </div>

                {/* ── Founder Content ── */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  {/* Name & Title */}
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#e8e0d0] mb-2">
                      MAHMOUD ASHRI
                    </h3>
                    <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm sm:text-base tracking-[0.2em] uppercase mb-1">
                      CEO & Founder
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-[0.15em] uppercase">
                      MACAL EMPIRE
                    </p>
                  </div>

                  {/* Decorative divider */}
                  <div className="w-20 h-px mx-auto lg:mx-0" style={{ background: 'linear-gradient(90deg, #c9a84c60, transparent)' }} />

                  {/* Introduction */}
                  <p className="font-[family-name:var(--font-sans)] text-[#b8a88a] text-sm sm:text-base leading-relaxed max-w-xl">
                    Mahmoud Ashri founded MACAL EMPIRE with a singular conviction: that English proficiency
                    assessment should reveal genuine ability, not reward memorization. With extensive experience
                    in educational technology and language assessment design, he envisioned a system where every
                    test-taker faces a unique, fair, and tamper-resistant evaluation — one that measures truth,
                    not repetition. Under his leadership, the Empire English Community has grown into a
                    precision-driven placement platform trusted by learners who demand integrity in their results.
                  </p>

                  {/* Founder Quote */}
                  <div className="relative pl-5 border-l-2 border-[rgba(201,168,76,0.4)]">
                    <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-base sm:text-lg italic leading-relaxed">
                      &ldquo;This system was built to measure truth, not memory.&rdquo;
                    </p>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs mt-2 italic">
                      — Mahmoud Ashri, Founder of MACAL EMPIRE
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>

        {/* ── Vision Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Eye,
              title: 'True Ability Detection',
              description:
                'The Empire English assessment engine eliminates memorization-based scoring through dynamic question generation, seeded randomization, and anti-cheat protocols. Every test is unique, every result is authentic — no two sessions share the same question path.',
            },
            {
              icon: Swords,
              title: 'Structured Ranking System',
              description:
                'From Recruit to Champion, the Imperial Rank system provides clear, meaningful placement based on demonstrated skill. The four-module approach — Speaking, Listening, Vocabulary, and Grammar — ensures a comprehensive evaluation that reflects real-world English capability.',
            },
            {
              icon: Shield,
              title: 'System Integrity',
              description:
                'MACAL EMPIRE enforces rigorous anti-abuse safeguards: attempt-weighted scoring prevents rank inflation, session-locked questions block refresh exploits, and question exposure tracking ensures no one can farm answers across retakes. The system defends its own integrity.',
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <MetallicCard className="p-6 h-full flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4"
                  style={{
                    borderColor: '#c9a84c50',
                    boxShadow: '0 0 15px rgba(201,168,76,0.15), inset 0 0 10px rgba(201,168,76,0.08)',
                  }}
                >
                  <pillar.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h4 className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-sm sm:text-base font-bold mb-3">
                  {pillar.title}
                </h4>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs sm:text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </MetallicCard>
            </motion.div>
          ))}
        </div>

        {/* ── Empire Vision Statement ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12"
        >
          <GlowingBorder intensity="medium" className="rounded-lg">
            <MetallicCard hover={false} glowOnHover={false} className="p-8 sm:p-10 text-center">
              <Star className="w-8 h-8 text-[#c9a84c] mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[#c9a84c] mb-4">
                THE EMPIRE VISION
              </h3>
              <p className="font-[family-name:var(--font-sans)] text-[#b8a88a] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
                Empire English Community is not a test — it is a system built for real English level identification.
                It does not reward rote memorization, pattern recognition, or answer farming. Instead, it measures
                genuine ability through dynamic question delivery, anti-memorization engines, and weighted attempt
                analysis. The result is a placement system where your rank reflects your true command of the English
                language, earned fairly and defended rigorously.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {['Recruit', 'Initiate', 'Warrior', 'Champion'].map((rank, idx) => (
                  <span
                    key={rank}
                    className="font-[family-name:var(--font-heading)] text-xs sm:text-sm px-4 py-1.5 rounded-full border"
                    style={{
                      color: ['#8b7355', '#cd7f32', '#c9a84c', '#ff6b35'][idx],
                      borderColor: ['#8b735540', '#cd7f3240', '#c9a84c40', '#ff6b3540'][idx],
                      backgroundColor: ['#8b735510', '#cd7f3210', '#c9a84c10', '#ff6b3510'][idx],
                    }}
                  >
                    {rank}
                  </span>
                ))}
              </div>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>
      </div>
    </section>
  );
}
