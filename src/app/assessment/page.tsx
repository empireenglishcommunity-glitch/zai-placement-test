'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useTermsGuard } from '@/hooks/useTermsGuard';
import { Crown, Loader2 } from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialButton,
  SectionDivider,
  GlowingBorder,
  TermsAcceptanceGate,
  ContentProtection,
  EmpireWatermark,
  LegalNotice,
} from '@/components/empire';
import Link from 'next/link';
import { Headphones, BookOpen, Shield, Mic, Volume2, Lock, CheckCircle, ChevronRight } from 'lucide-react';

// ─── Module Card Data ────────────────────────────────────────

interface TrialCardData {
  module: string;
  icon: React.ElementType;
  color: string;
  status: 'available' | 'locked' | 'completed';
  requiresMic: boolean;
  requiresAudio: boolean;
  trialDescription: string;
  arabicName: string;
  arabicDescription: string;
  name: string;
  empireTitle: string;
  description: string;
  duration: string;
  scoreRange: string;
  href: string;
}

const trialCards: TrialCardData[] = [
  {
    module: 'reading',
    icon: BookOpen,
    color: '#c9a84c',
    status: 'available',
    requiresMic: false,
    requiresAudio: false,
    name: 'Trial of Reading',
    empireTitle: 'The Comprehension Trial',
    description: 'Demonstrate your ability to understand written English at an academic level.',
    trialDescription:
      'Read 3 academic passages of increasing difficulty. Answer questions on main ideas, supporting details, vocabulary in context, inferences, and author\'s purpose. This is the core of English proficiency.',
    arabicName: 'اختبار القراءة',
    arabicDescription: 'اقرأ 3 نصوص أكاديمية وأجب عن أسئلة الفكرة الرئيسية والتفاصيل والمفردات والاستنتاج.',
    duration: '~20 min',
    scoreRange: '0-30',
    href: '/assessment/reading',
  },
  {
    module: 'listening',
    icon: Headphones,
    color: '#cd7f32',
    status: 'available',
    requiresMic: false,
    requiresAudio: true,
    name: 'Trial of Listening',
    empireTitle: 'The Perception Trial',
    description: 'Prove your ability to understand spoken English in academic contexts.',
    trialDescription:
      'Listen to academic lectures and conversations. Answer questions testing comprehension, inference, speaker attitude, and organizational structure. Passages increase in speed and complexity.',
    arabicName: 'اختبار الاستماع',
    arabicDescription: 'استمع لمحاضرات ومحادثات أكاديمية وأجب عن أسئلة الفهم والاستنتاج وموقف المتحدث.',
    duration: '~15 min',
    scoreRange: '0-30',
    href: '/assessment/listening',
  },
  {
    module: 'speaking',
    icon: Mic,
    color: '#ff6b35',
    status: 'available',
    requiresMic: true,
    requiresAudio: false,
    name: 'Trial of Speaking',
    empireTitle: 'The Oratory Trial',
    description: 'Demonstrate your spoken English fluency, coherence, and pronunciation.',
    trialDescription:
      'Complete 4 speaking tasks: express an opinion, summarize a reading, respond to a conversation, and discuss an academic topic. Your fluency, pronunciation, and coherence are evaluated by AI.',
    arabicName: 'اختبار التحدث',
    arabicDescription: 'أكمل 4 مهام تحدث: عبّر عن رأيك، لخّص نصاً، رد على محادثة، وناقش موضوعاً أكاديمياً.',
    duration: '~10 min',
    scoreRange: '0-30',
    href: '/assessment/speaking',
  },
  {
    module: 'writing',
    icon: Shield,
    color: '#9b59b6',
    status: 'available',
    requiresMic: false,
    requiresAudio: false,
    name: 'Trial of Writing',
    empireTitle: 'The Inscription Trial',
    description: 'Prove your ability to express ideas clearly in written English.',
    trialDescription:
      'Complete 2 writing tasks: summarize information from a reading passage (150-225 words), then write an independent essay expressing your opinion on a topic (300+ words). Grammar, coherence, and vocabulary are evaluated.',
    arabicName: 'اختبار الكتابة',
    arabicDescription: 'أكمل مهمتين كتابيتين: لخّص معلومات من نص، ثم اكتب مقالاً مستقلاً يعبر عن رأيك.',
    duration: '~20 min',
    scoreRange: '0-30',
    href: '/assessment/writing',
  },
];

// ─── Animation Variants ──────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// ─── Status Badge Component ──────────────────────────────────

function StatusBadge({ status }: { status: 'available' | 'locked' | 'completed' }) {
  const config = {
    available: { label: 'Available', color: 'text-[#c9a84c]', border: 'border-[rgba(201,168,76,0.4)]', bg: 'bg-[rgba(201,168,76,0.1)]' },
    locked: { label: 'Locked', color: 'text-[#8b7355]', border: 'border-[rgba(139,115,85,0.3)]', bg: 'bg-[rgba(139,115,85,0.1)]' },
    completed: { label: 'Completed', color: 'text-[#4ade80]', border: 'border-[rgba(74,222,128,0.3)]', bg: 'bg-[rgba(74,222,128,0.1)]' },
  };
  const c = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] tracking-wider uppercase border ${c.color} ${c.border} ${c.bg}`}>
      {status === 'completed' && <CheckCircle className="w-3 h-3" />}
      {status === 'locked' && <Lock className="w-3 h-3" />}
      {c.label}
    </span>
  );
}

// ─── Trial Card Component ────────────────────────────────────

function TrialCard({ data, index }: { data: TrialCardData; index: number }) {
  const isLocked = data.status === 'locked';
  const isCompleted = data.status === 'completed';

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="h-full"
    >
      <MetallicCard
        className={`p-6 sm:p-8 h-full flex flex-col ${isLocked ? 'opacity-60' : ''}`}
        hover={!isLocked}
        glowOnHover={!isLocked}
      >
        {/* Header: Icon + Status */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: data.color,
              boxShadow: `0 0 20px ${data.color}30, inset 0 0 12px ${data.color}15`,
            }}
          >
            <data.icon className="w-7 h-7" style={{ color: data.color }} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={data.status} />
            <span className="font-[family-name:var(--font-heading)] text-[10px] text-[#8b7355] tracking-wider">
              {data.duration} &middot; Score: {data.scoreRange}
            </span>
          </div>
        </div>

        {/* Module Name */}
        <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[#e8e0d0] mb-1">
          {data.name}
        </h3>
        <p className="font-arabic text-[#8b7355] text-sm mb-1" dir="rtl">{data.arabicName}</p>

        {/* Empire Title */}
        <span
          className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] uppercase mb-4"
          style={{ color: data.color }}
        >
          {data.empireTitle}
        </span>

        {/* Description */}
        <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm leading-relaxed mb-2">
          {data.description}
        </p>
        <p className="font-arabic text-[#8b7355] text-xs leading-relaxed mb-4" dir="rtl">
          {data.arabicDescription}
        </p>

        {/* Trial Details */}
        <div className="bg-[rgba(10,10,10,0.5)] rounded-md p-4 mb-4 border border-[rgba(201,168,76,0.1)]">
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs leading-relaxed italic">
            {data.trialDescription}
          </p>
        </div>

        {/* Requirement Notices */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.requiresMic && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-[family-name:var(--font-heading)] tracking-wider uppercase border border-[rgba(205,127,50,0.3)] text-[#cd7f32] bg-[rgba(205,127,50,0.08)]">
              <Mic className="w-3 h-3" />
              Requires Microphone
            </span>
          )}
          {data.requiresAudio && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-[family-name:var(--font-heading)] tracking-wider uppercase border border-[rgba(201,168,76,0.3)] text-[#c9a84c] bg-[rgba(201,168,76,0.08)]">
              <Volume2 className="w-3 h-3" />
              Requires Audio Playback
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="mt-auto" />

        {/* CTA Button */}
        <div className="mt-4">
          {isCompleted ? (
            <ImperialButton variant="outline" size="md" className="w-full" disabled>
              <CheckCircle className="w-4 h-4 mr-2" />
              Trial Completed
            </ImperialButton>
          ) : isLocked ? (
            <ImperialButton variant="ghost" size="md" className="w-full" disabled>
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </ImperialButton>
          ) : (
            <Link href={data.href} className="block">
              <GlowingBorder intensity="medium" color={data.color === '#c9a84c' ? 'gold' : data.color === '#cd7f32' ? 'bronze' : 'fire'}>
                <ImperialButton variant="primary" size="md" className="w-full">
                  Begin Trial
                  <ChevronRight className="w-4 h-4 ml-2" />
                </ImperialButton>
              </GlowingBorder>
            </Link>
          )}
        </div>
      </MetallicCard>
    </motion.div>
  );
}

// ─── Main Assessment Hub Page ────────────────────────────────

export default function AssessmentPage() {
  const { isLoading, isAuthenticated } = useAuthGuard();
  const { termsAccepted, showTermsGate, acceptTerms } = useTermsGuard();

  // Fetch real module progress from dashboard API
  const [moduleStatus, setModuleStatus] = useState<Record<string, 'available' | 'completed'>>({
    reading: 'available',
    listening: 'available',
    speaking: 'available',
    writing: 'available',
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/dashboard', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.moduleProgress) {
          const mp = data.moduleProgress;
          setModuleStatus({
            reading: mp.reading?.status === 'completed' ? 'completed' : 'available',
            listening: mp.listening?.status === 'completed' ? 'completed' : 'available',
            speaking: mp.speaking?.status === 'completed' ? 'completed' : 'available',
            writing: mp.writing?.status === 'completed' ? 'completed' : 'available',
          });
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Crown className="w-16 h-16 text-[#c9a84c] mx-auto" />
            </motion.div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-2">
                Verifying Your Identity
              </h2>
              <p className="text-[#8b7355] font-[family-name:var(--font-sans)]">
                The Empire must confirm your allegiance...
              </p>
            </div>
            <Loader2 className="w-6 h-6 text-[#c9a84c] mx-auto animate-spin" />
          </motion.div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  // Show terms acceptance gate if not accepted
  if (showTermsGate) {
    return (
      <div className="min-h-screen flex flex-col empire-bg">
        <ParticleBackground />
        <Navbar />
        <TermsAcceptanceGate onAccepted={acceptTerms} />
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col empire-bg protected-content">
      <ContentProtection
        detectDevTools={true}
        blockShortcuts={true}
        blockContextMenu={true}
        blockPrint={true}
        detectVisibilityChange={false}
      />
      <ParticleBackground />
      <EmpireWatermark context="Assessment Hub" />
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-12">
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
              width={100}
              height={100}
              className="object-contain mx-auto"
              priority
            />
          </motion.div>

          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-4">
            <span className="gold-shimmer">The Four Trials</span>
          </h1>
          <p className="font-arabic text-[#c9a84c] text-lg sm:text-xl mb-4" dir="rtl">الاختبارات الأربعة</p>
          <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl md:text-2xl text-[#8b7355] tracking-[0.2em] mb-4">
            Prove your worth. Earn your Imperial Rank.
          </h2>
          <p className="font-arabic text-[#8b7355] text-base mb-6" dir="rtl">
            أثبت قدرتك. احصل على رتبتك الإمبراطورية.
          </p>
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg md:text-xl italic max-w-2xl mx-auto mb-4">
            Every recruit must face the Four Trials. Reading, Listening, Speaking, and Writing — 
            the four pillars of English proficiency. Complete all four to earn your
            Imperial Score (0-120) and your place among the Empire.
          </p>
          <p className="font-arabic text-[#8b7355] text-sm max-w-2xl mx-auto leading-relaxed" dir="rtl">
            كل مجند يواجه الاختبارات الأربعة: القراءة، الاستماع، التحدث، والكتابة. أكمل الأربعة لتحصل على نتيجتك الإمبراطورية (0-120).
          </p>

          {/* TOEFL Score Scale */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)]">
            <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider">
              4 SECTIONS
            </span>
            <span className="text-[rgba(201,168,76,0.3)]">&middot;</span>
            <span className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider">
              0-30 PER SECTION
            </span>
            <span className="text-[rgba(201,168,76,0.3)]">&middot;</span>
            <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider">
              0-120 TOTAL
            </span>
            <span className="text-[rgba(201,168,76,0.3)]">&middot;</span>
            <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider">
              ~65 MIN
            </span>
          </div>
        </motion.div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      <SectionDivider />

      {/* ── Story Arc / Narrative ─────────────────────────── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg leading-relaxed italic">
              &ldquo;Every recruit must face the Four Trials. Each trial tests a different
              aspect of your command of the English language. Complete all four to earn your
              Imperial Rank.&rdquo;
            </p>
            <p className="font-arabic text-[#8b7355] text-sm mt-3 leading-relaxed" dir="rtl">
              &ldquo;كل مجند يواجه الاختبارات الأربعة. أكمل الجميع لتحصل على رتبتك.&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.4)]" />
              <div className="text-center">
                <span className="text-[#c9a84c] text-xs font-[family-name:var(--font-heading)] tracking-widest uppercase block">
                  Choose Your Trial
                </span>
                <span className="font-arabic text-[#8b7355] text-xs block mt-1" dir="rtl">اختر اختبارك</span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.4)]" />
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ── The Four Trial Cards ──────────────────────────── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {trialCards.map((card, i) => (
              <TrialCard key={card.module} data={{ ...card, status: moduleStatus[card.module] || 'available' }} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Journey Overview ──────────────────────────────── */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] text-glow mb-3">
              THE JOURNEY AWAITS
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
              Your path through the trials will reveal your true rank.
            </p>
          </motion.div>

          {/* Journey Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Choose', desc: 'Select the trial you wish to face', icon: '⚔️' },
              { step: 2, title: 'Endure', desc: 'Complete the questions and challenges', icon: '🛡️' },
              { step: 3, title: 'Reflect', desc: 'Review your performance and scores', icon: '📜' },
              { step: 4, title: 'Ascend', desc: 'Earn your Imperial Rank', icon: '👑' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm tracking-widest mb-1">
                  STEP {item.step}
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-lg font-bold mb-2">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Call to Action ────────────────────────────────── */}
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
                READY TO PROVE YOUR WORTH?
              </h2>
              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic mb-8">
                Select a trial above and begin your journey. The Empire awaits those with the courage to test their command of English.
              </p>
              <Link href="/assessment/reading">
                <ImperialButton variant="primary" size="lg">
                  Begin with Reading
                  <ChevronRight className="w-5 h-5 ml-2" />
                </ImperialButton>
              </Link>
            </MetallicCard>
          </GlowingBorder>
        </motion.div>
      </section>

      <div className="mt-auto">
        <LegalNotice variant="footer" />
        <Footer />
      </div>
    </div>
  );
}
