'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, ImperialButton, SectionDivider } from '@/components/empire';
import { Scroll, Shield, AlertTriangle, Scale, FileText, ChevronRight, Crown } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: '1. Ownership Declaration',
    content: [
      'This platform, including all content, assessment questions, design elements, branding, system logic, algorithms, scoring methodology, and user interface — is the exclusive property of MACAL EMPIRE. All intellectual property rights, including but not limited to copyright, trademark, trade secret, and patent rights, are fully reserved under MACAL EMPIRE.',
      'The Empire English Assessment System, its Four Trials framework (Speaking, Listening, Vocabulary, Grammar), the Imperial Rank system (Recruit, Initiate, Warrior, Champion), and all associated content are proprietary assets. No part of this platform may be considered public domain, open source, or freely distributable.',
      'The MACAL EMPIRE name, logo, visual identity, and all branding materials are protected trademarks. Any unauthorized use of these assets constitutes a violation of intellectual property law and the terms outlined herein.',
    ],
  },
  {
    icon: FileText,
    title: '2. User Agreement',
    content: [
      'By creating an account and accessing the Empire English Assessment System, you agree to the following binding terms:',
      'You shall not copy, reproduce, distribute, publish, display, modify, or create derivative works from any content, questions, assessments, scoring logic, or design elements found on this platform. This includes, but is not limited to, screenshots of assessment content, transcription of questions, replication of scoring algorithms, or redistribution of any proprietary materials.',
      'You shall not attempt to clone, reverse engineer, decompile, disassemble, or otherwise replicate the system logic, architecture, algorithms, or underlying technology of this platform. Any attempt to reconstruct the assessment system, scoring methodology, or user experience through observation, data extraction, or technical analysis is strictly prohibited.',
      'You shall not reuse, repurpose, or redistribute any assessment content — including questions, answer options, scoring rubrics, or evaluation criteria — for commercial purposes, educational replication, tutoring services, competitive platforms, or any other application outside of your personal use within this platform.',
      'Unauthorized use, access, or distribution of proprietary content will be treated as a breach of these terms and may result in immediate account termination, legal action, and pursuit of damages as permitted by applicable law.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '3. Liability Statement',
    content: [
      'MACAL EMPIRE reserves the right to restrict, suspend, or permanently terminate access to this platform for any user who violates these Terms of Service, engages in misuse of the system, or attempts to compromise the integrity of the assessment process.',
      'All usage of this platform is subject to the rules, policies, and guidelines established by MACAL EMPIRE. We retain the right to modify these terms at any time, and continued use of the platform constitutes acceptance of any updates.',
      'MACAL EMPIRE provides this platform on an "as is" basis without warranties of any kind, either express or implied. We do not guarantee that the platform will be error-free, uninterrupted, or free from defects. Assessment results are provided for educational and self-assessment purposes and should not be considered as formal academic credentials or professional certifications unless explicitly stated otherwise.',
      'MACAL EMPIRE shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use this platform, including but not limited to loss of data, loss of profits, or reputational harm.',
    ],
  },
  {
    icon: Scale,
    title: '4. Data & Privacy',
    content: [
      'By using this platform, you consent to the collection and processing of your personal data (including name, email, and assessment results) as necessary to operate the service. Your data will be handled in accordance with our privacy practices and will not be sold to third parties.',
      'Assessment results and user activity may be reviewed by authorized administrators for quality assurance, fraud detection, and platform improvement purposes. Users flagged for suspicious activity or policy violations may have their results reviewed and potentially invalidated.',
    ],
  },
  {
    icon: Scroll,
    title: '5. Governing Law',
    content: [
      'These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or the use of this platform shall be resolved through appropriate legal channels as determined by MACAL EMPIRE.',
      'MACAL EMPIRE reserves the right to update these Terms of Service at any time. Users will be notified of significant changes, and continued use of the platform after such updates constitutes acceptance of the revised terms.',
    ],
  },
];

export default function TermsOfServicePage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session;
  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              className="mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/logo.png"
                alt="MACAL EMPIRE"
                width={80}
                height={80}
                className="object-contain mx-auto"
                priority
              />
            </motion.div>
            <p className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-[0.4em] uppercase text-[#8b7355] mb-3">
              MACAL EMPIRE
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-shimmer">TERMS OF SERVICE</span>
            </h1>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-2xl mx-auto">
              The laws that govern the Empire. By entering, you accept these terms.
            </p>
          </motion.div>

          <SectionDivider />

          {/* Copyright Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center my-10 p-6 rounded-xl border border-[rgba(201,168,76,0.3)] bg-gradient-to-br from-[rgba(201,168,76,0.05)] to-transparent"
          >
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg sm:text-xl font-bold mb-2">
              © MACAL EMPIRE. All rights reserved.
            </p>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
              All content, design, logic, and branding are the exclusive property of MACAL EMPIRE.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-6 sm:p-8 rounded-xl border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[#111118] to-[#1a1a2e]">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                      <section.icon className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[#c9a84c]">
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Content */}
                  <div className="space-y-4">
                    {section.content.map((paragraph, j) => (
                      <p key={j} className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <SectionDivider />

          {/* Final Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-8 space-y-4"
          >
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg tracking-wider">
              &copy; MACAL EMPIRE. All rights reserved.
            </p>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/privacy"
                className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm hover:text-[#e8d48b] underline underline-offset-2 transition-colors"
              >
                Read our Privacy Policy
              </Link>
              <Link
                href="/ip-ownership"
                className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-sm hover:text-[#e8d48b] underline underline-offset-2 transition-colors flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                IP & Ownership
              </Link>
            </div>
            <div className="pt-4">
              <Link href={isLoggedIn ? '/assessment' : '/register'}>
                <ImperialButton variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    {isLoggedIn ? 'Back to Trials' : 'Accept & Continue'}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </ImperialButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
