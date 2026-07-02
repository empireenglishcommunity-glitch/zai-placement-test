'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, PenTool } from 'lucide-react';
import {
  ParticleBackground,
  Navbar,
  Footer,
  MetallicCard,
  ImperialButton,
  GlowingBorder,
  SectionDivider,
} from '@/components/empire';

export default function WritingAssessmentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-6">✍️</div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#c9a84c] mb-2">
              Trial of Writing
            </h1>
            <p className="font-arabic text-[#8b7355] text-base mb-3" dir="rtl">
              اختبار الكتابة
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[#cd7f32] text-lg tracking-widest uppercase">
              The Inscription Trial
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <GlowingBorder color="gold" intensity="medium">
              <MetallicCard className="p-8 sm:p-12 text-center" hover={false}>
                <PenTool className="w-16 h-16 text-[#c9a84c] mx-auto mb-6 opacity-50" />
                <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#c9a84c] mb-4">
                  Coming Soon
                </h2>
                <p className="text-[#c0c0c0] text-base leading-relaxed mb-4 max-w-lg mx-auto">
                  The Writing Trial is being developed. You will complete two tasks:
                  summarize a reading passage (150-225 words) and write an independent
                  essay (300+ words). AI evaluation will score grammar, coherence,
                  vocabulary range, and argument development.
                </p>
                <p className="font-arabic text-[#8b7355] text-sm leading-relaxed mb-6" dir="rtl">
                  اختبار الكتابة قيد التطوير. ستكمل مهمتين: تلخيص نص (150-225 كلمة) وكتابة مقال مستقل (300+ كلمة). سيتم تقييم القواعد والتماسك والمفردات وتطوير الحجة بالذكاء الاصطناعي.
                </p>
                <SectionDivider />
                <div className="mt-6">
                  <Link href="/assessment">
                    <ImperialButton variant="secondary" size="md" className="gap-2">
                      <span>Return to Trials</span>
                      <ChevronRight className="w-4 h-4" />
                    </ImperialButton>
                  </Link>
                </div>
              </MetallicCard>
            </GlowingBorder>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
