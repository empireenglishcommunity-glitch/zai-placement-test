'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Navbar, Footer, ParticleBackground, ImperialButton,
  SectionDivider, MetallicCard, GlowingBorder, LegalNotice,
} from '@/components/empire';
import {
  Shield, Crown, FileText, Clock, Scale, Download,
  ChevronRight, ChevronDown, BookOpen, Lock, Stamp,
  Archive, Calendar, CheckCircle2, AlertCircle, Loader2,
  Building2, Fingerprint, Palette, Code2, Brain, Award,
  Database, Layers, PenTool, Volume2, Eye, Scroll,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// OWNERSHIP CATEGORIES
// ═══════════════════════════════════════════════════════════

const OWNERSHIP_CATEGORIES = [
  {
    icon: Building2,
    title: 'Branding & Identity',
    description: 'The MACAL EMPIRE name, logo, visual identity system, color palette, typography selections, and all associated brand materials are the exclusive intellectual property of MACAL EMPIRE. This encompasses the imperial aesthetic design language, the matte black and antique gold color system, the Cinzel and Playfair Display font pairings, and all visual communication standards that define the MACAL EMPIRE brand presence across digital and print media.',
    items: ['MACAL EMPIRE name and wordmark', 'Official logo and icon variations', 'Color system (antique gold, bronze, matte black)', 'Typography selections (Cinzel, Playfair Display)', 'Visual identity guidelines and standards'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'All user interface designs, interaction patterns, layout structures, animation systems, and user experience flows created for the Empire English Assessment System are proprietary. This includes the immersive dark fantasy imperial theme, the card-based navigation system, the assessment flow architecture, the celebration and rank reveal animations, and all micro-interaction designs that collectively create the distinctive MACAL EMPIRE digital experience.',
    items: ['Dark fantasy imperial theme system', 'Card-based UI component library', 'Assessment flow architecture', 'Animation and transition systems', 'Micro-interaction design patterns'],
  },
  {
    icon: Brain,
    title: 'Assessment Structures',
    description: 'The Four Trials framework — comprising the Speaking, Listening, Vocabulary, and Grammar assessment modules — along with the Imperial Rank classification system, represents a proprietary assessment methodology developed by MACAL EMPIRE. The structure, sequencing, difficulty calibration, and pedagogical approach of these assessments are original intellectual property. This includes the specific combination of assessment types, the weighted scoring algorithms, and the progressive difficulty bands unique to this platform.',
    items: ['Four Trials framework architecture', 'Imperial Rank system (Recruit through Champion)', 'Module sequencing and integration logic', 'Difficulty calibration methodology', 'Assessment time allocation strategies'],
  },
  {
    icon: FileText,
    title: 'Question Systems',
    description: 'All assessment questions, answer options, question-type taxonomies, and the organizational structure of the question bank are proprietary content. This includes vocabulary band classifications, grammar topic categorizations, listening comprehension passage designs, and speaking prompt architectures. The question generation templates, difficulty scaling algorithms, and topic distribution models that govern how questions are presented to users are also protected.',
    items: ['Complete question bank content', 'Question-type classification system', 'Vocabulary band framework', 'Grammar topic taxonomy', 'Question selection and ordering algorithms'],
  },
  {
    icon: Scale,
    title: 'Scoring Systems',
    description: 'The scoring methodology, level assignment algorithms, and result calculation processes constitute proprietary business logic. This includes the weighted scoring formulas for each module, the majority-rule level assignment system, the speaking module tiebreaker logic, the 20-point discrepancy flagging mechanism, and all calibration parameters that determine how raw assessment data is transformed into Imperial Rank assignments.',
    items: ['Weighted scoring algorithms', 'Level assignment decision logic', 'Speaking tiebreaker mechanism', 'Discrepancy flagging system', 'Score normalization processes'],
  },
  {
    icon: Award,
    title: 'Certificates & Results',
    description: 'All certificate designs, result presentation formats, rank badge visuals, and ceremonial result delivery systems are proprietary creative works of MACAL EMPIRE. The certificate template, including its imperial seal design, decorative borders, typography layout, and official language, represents original creative content. The results ceremony experience, including rank reveal animations and module breakdown presentations, is also protected.',
    items: ['Certificate template and seal design', 'Result ceremony presentation format', 'Rank badge visual designs', 'Module breakdown display architecture', 'Official certification language'],
  },
  {
    icon: PenTool,
    title: 'Written Content',
    description: 'All textual content throughout the platform — including but not limited to assessment instructions, user interface copy, error messages, educational feedback, progress descriptions, rank titles, narrative elements, Terms of Service, Privacy Policy, and this Intellectual Property Declaration — constitutes original written content that is the exclusive property of MACAL EMPIRE. The distinctive imperial narrative voice and thematic language style used throughout the platform are also protected.',
    items: ['Assessment instructions and prompts', 'User interface copy and microcopy', 'Imperial narrative voice and thematic style', 'Educational feedback and guidance text', 'Legal and policy documentation'],
  },
  {
    icon: Fingerprint,
    title: 'Graphics & Media',
    description: 'All graphical assets, illustrations, icon designs, particle effects, background textures, and audio content used within the platform are proprietary creative works. This includes the particle background system, the metallic card rendering effects, the glowing border animations, the empire soundtrack, and all visual effects that contribute to the immersive imperial atmosphere of the platform.',
    items: ['Icon and illustration assets', 'Particle effect and background systems', 'Metallic and glowing visual effects', 'Empire soundtrack and audio content', 'Decorative and atmospheric assets'],
  },
  {
    icon: Database,
    title: 'Database Structures',
    description: 'The database schema, table designs, relationship models, indexing strategies, and data organization patterns that underpin the Empire English Assessment System represent proprietary technical architecture. This includes the user profile structure, the assessment data model with its multi-module scoring fields, the question bank organization, the review flag system, and all data access patterns designed for the platform.',
    items: ['Complete database schema design', 'Table relationship architecture', 'Assessment data model structure', 'Question bank data organization', 'Data access and indexing strategies'],
  },
  {
    icon: Layers,
    title: 'Educational Methodologies',
    description: 'The pedagogical approaches, learning assessment frameworks, and educational design principles embedded within the platform represent proprietary methodology. This encompasses the multi-modal assessment approach combining productive and receptive skills, the adaptive difficulty calibration system, the progressive skill measurement methodology, and the integrated feedback mechanisms that distinguish this platform from conventional English assessment tools.',
    items: ['Multi-modal assessment framework', 'Adaptive difficulty calibration approach', 'Progressive skill measurement methodology', 'Integrated feedback design principles', 'Skill integration assessment strategy'],
  },
  {
    icon: Code2,
    title: 'Source Code & Architecture',
    description: 'The application source code, software architecture, component design patterns, API endpoint structures, middleware configurations, and all technical implementation details are proprietary. This includes the Next.js application architecture, the React component hierarchy, the server-side API design, the authentication flow implementation, the content protection mechanisms, and all custom-built libraries and utilities created for this platform.',
    items: ['Application architecture and design patterns', 'Component hierarchy and state management', 'API endpoint structure and logic', 'Authentication and authorization flows', 'Content protection and security systems'],
  },
  {
    icon: Volume2,
    title: 'Audio & Sound Design',
    description: 'All audio content, sound design elements, voice synthesis configurations, and auditory experience designs are proprietary. This includes the empire soundtrack composition, the text-to-speech voice configurations used in listening assessments, the audio recording and playback system design, and the immersive audio overlay system that creates the platform\'s distinctive sonic atmosphere.',
    items: ['Empire soundtrack composition', 'Text-to-speech voice configurations', 'Audio recording system architecture', 'Immersive audio overlay design', 'Sound effect and atmosphere elements'],
  },
];

// ═══════════════════════════════════════════════════════════
// CREATION TIMELINE DATA
// ═══════════════════════════════════════════════════════════

interface TimelineEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  category: 'foundation' | 'feature' | 'security' | 'legal' | 'content' | 'design';
}

const CREATION_TIMELINE: TimelineEntry[] = [
  {
    version: '1.0.0',
    date: '2025-01-01',
    title: 'Platform Foundation',
    description: 'Initial conception and architectural planning of the Empire English Assessment System. Core technology stack selected, imperial brand identity established, and foundational design system created including the dark fantasy aesthetic, color palette, and typography selections.',
    category: 'foundation',
  },
  {
    version: '1.1.0',
    date: '2025-02-01',
    title: 'Assessment Framework',
    description: 'Development of the Four Trials assessment framework — Speaking, Listening, Vocabulary, and Grammar modules. Design and implementation of the Imperial Rank classification system with four progressive levels from Recruit to Champion. Scoring algorithms and level assignment logic completed.',
    category: 'feature',
  },
  {
    version: '1.2.0',
    date: '2025-03-01',
    title: 'Question Bank & Content',
    description: 'Creation of the comprehensive question bank covering vocabulary bands, grammar topics, listening comprehension, and speaking prompts. Educational methodology refined with progressive difficulty calibration and adaptive selection algorithms.',
    category: 'content',
  },
  {
    version: '1.3.0',
    date: '2025-04-01',
    title: 'UI/UX Design System',
    description: 'Implementation of the complete imperial design system — MetallicCard, GlowingBorder, ImperialButton, ParticleBackground, and all custom UI components. The dark fantasy aesthetic fully realized with animations, transitions, and micro-interactions throughout.',
    category: 'design',
  },
  {
    version: '1.4.0',
    date: '2025-05-01',
    title: 'Authentication & Security',
    description: 'Integration of user authentication system with NextAuth.js, content protection mechanisms, rate limiting middleware, bot detection, and security event logging. Admin command center with student management, review flags, and analytics dashboard.',
    category: 'security',
  },
  {
    version: '1.5.0',
    date: '2025-06-01',
    title: 'Legal & IP Framework',
    description: 'Establishment of Terms of Service, Privacy Policy, and this Intellectual Property & Ownership declaration. Digital ownership record system created for timestamped evidence. Copyright notices standardized across all platform pages and components.',
    category: 'legal',
  },
  {
    version: '1.6.0',
    date: '2025-06-30',
    title: 'Immersive Experience',
    description: 'Addition of the Empire Audio Experience with cinematic soundtrack, audio overlay, and floating controls. Social media integration, testimonials section, and sponsorship branding. Enhanced certificate system with watermark protection and celebration animations.',
    category: 'design',
  },
  {
    version: '2.0.0',
    date: '2025-07-15',
    title: 'Production Release',
    description: 'Complete platform deployment with all systems operational. Full assessment flow from registration through assessment to results and certificate generation. Netlify deployment configuration, performance optimization, and production security hardening.',
    category: 'foundation',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  foundation: '#c9a84c',
  feature: '#cd7f32',
  security: '#ff6b35',
  legal: '#8b7355',
  content: '#4a9eff',
  design: '#9b59b6',
};

const CATEGORY_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  feature: 'Feature',
  security: 'Security',
  legal: 'Legal',
  content: 'Content',
  design: 'Design',
};

// ═══════════════════════════════════════════════════════════
// OWNERSHIP RECORDS INTERFACE
// ═══════════════════════════════════════════════════════════

interface OwnershipRecord {
  id: string;
  eventType: string;
  description: string;
  metadata: string | null;
  userId: string | null;
  createdBy: string | null;
  createdAt: string;
}

const EVENT_TYPE_ICONS: Record<string, typeof Shield> = {
  terms_acceptance: CheckCircle2,
  content_publication: BookOpen,
  certificate_generation: Award,
  system_update: Clock,
  ownership_declaration: Stamp,
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  terms_acceptance: 'Terms Acceptance',
  content_publication: 'Content Publication',
  certificate_generation: 'Certificate Generation',
  system_update: 'System Update',
  ownership_declaration: 'Ownership Declaration',
};

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function IPOwnershipPage() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [records, setRecords] = useState<OwnershipRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('declaration');

  // Fetch ownership records
  const fetchRecords = useCallback(async () => {
    setRecordsLoading(true);
    try {
      const res = await fetch('/api/ownership/records');
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
      }
    } catch {
      // Silent fail — records are supplementary
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Export documentation package
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/ownership/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MACAL-EMPIRE-IP-Documentation-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open a printable HTML version
      window.open('/api/ownership/export?format=html', '_blank');
    } finally {
      setExporting(false);
    }
  };

  // Section navigation
  const sections = [
    { id: 'declaration', label: 'Ownership Declaration', icon: Crown },
    { id: 'categories', label: 'IP Categories', icon: Layers },
    { id: 'timeline', label: 'Creation Timeline', icon: Clock },
    { id: 'records', label: 'Digital Records', icon: Archive },
    { id: 'export', label: 'Documentation Package', icon: Download },
    { id: 'rights', label: 'Rights Reserved', icon: Scale },
  ];

  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <ParticleBackground />
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ═══ Header ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
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
              <span className="gold-shimmer">INTELLECTUAL PROPERTY</span>
            </h1>
            <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl text-[#c9a84c] mb-4">
              & Ownership Documentation
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-3xl mx-auto">
              Establishing structured ownership documentation, evidence, and IP registration readiness for the Empire English Assessment System.
            </p>
          </motion.div>

          <SectionDivider />

          {/* ═══ Section Navigation ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-[family-name:var(--font-heading)] tracking-wide transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.3)]'
                      : 'text-[#8b7355] hover:text-[#c9a84c] border border-transparent hover:border-[rgba(201,168,76,0.1)]'
                  }`}
                >
                  <section.icon className="w-3.5 h-3.5" />
                  {section.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ═══ SECTION 1: Ownership Declaration ═══ */}
          <div id="section-declaration" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <MetallicCard className="p-6 sm:p-10" hover={false} glowOnHover={false}>
                {/* Section Title */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full border border-[rgba(201,168,76,0.4)] flex items-center justify-center bg-[rgba(201,168,76,0.1)]">
                    <Crown className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <div>
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                      Platform Ownership Declaration
                    </h2>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
                      Formal declaration of proprietary ownership
                    </p>
                  </div>
                </div>

                {/* Declaration Content */}
                <div className="space-y-6">
                  {/* Formal Declaration */}
                  <GlowingBorder color="gold" intensity="medium">
                    <div className="p-6 rounded-lg bg-[rgba(10,10,10,0.5)]">
                      <div className="flex items-center gap-2 mb-4">
                        <Stamp className="w-5 h-5 text-[#c9a84c]" />
                        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c]">
                          Official Declaration
                        </h3>
                      </div>
                      <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed mb-4">
                        The <strong className="text-[#c9a84c]">Empire English Assessment System</strong>, including all associated platforms, applications, and services, is the exclusive proprietary property of <strong className="text-[#c9a84c]">MACAL EMPIRE</strong>. All intellectual property rights — including but not limited to copyright, trademark, trade secret, and patent rights — are fully and exclusively reserved under MACAL EMPIRE.
                      </p>
                      <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed mb-4">
                        This declaration encompasses the entirety of the platform: its source code, design systems, assessment methodologies, scoring algorithms, question content, database architectures, branding materials, user interface designs, audio compositions, written content, educational frameworks, and all derivative works. No element of this platform, whether individually or collectively, may be considered public domain, open source, or freely distributable unless explicitly stated in writing by MACAL EMPIRE.
                      </p>
                      <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed">
                        The MACAL EMPIRE name, logo, visual identity, and all branding materials are protected property. Any unauthorized use, reproduction, or imitation of these assets constitutes a violation of intellectual property rights and the terms governing this platform.
                      </p>
                    </div>
                  </GlowingBorder>

                  {/* Property Scope */}
                  <div className="p-6 rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(10,10,10,0.3)]">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Scope of Proprietary Property
                    </h3>
                    <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed mb-4">
                      The following categories of intellectual property are declared as proprietary assets of MACAL EMPIRE. Each category represents a distinct domain of creative, technical, or strategic work that has been independently developed and is maintained as protected proprietary content.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {OWNERSHIP_CATEGORIES.map((cat, i) => (
                        <div
                          key={cat.title}
                          className="flex items-start gap-2 p-3 rounded-lg border border-[rgba(201,168,76,0.08)] bg-[rgba(201,168,76,0.03)]"
                        >
                          <cat.icon className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                          <span className="font-[family-name:var(--font-heading)] text-xs sm:text-sm text-[#e8e0d0] tracking-wide">
                            {cat.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legal Notice */}
                  <LegalNotice variant="banner" />
                </div>
              </MetallicCard>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ SECTION 2: IP Categories Detail ═══ */}
          <div id="section-categories" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                  <Layers className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                  Intellectual Property Categories
                </h2>
              </div>

              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic mb-8 max-w-3xl">
                Detailed breakdown of each proprietary category, including scope descriptions and specific protected elements within the Empire English Assessment System.
              </p>

              <div className="space-y-4">
                {OWNERSHIP_CATEGORIES.map((category, i) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <MetallicCard className="overflow-hidden" hover glowOnHover={expandedCategory !== i}>
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === i ? null : i)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                            <category.icon className="w-4 h-4 text-[#c9a84c]" />
                          </div>
                          <h3 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold text-[#c9a84c]">
                            {category.title}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-[#8b7355] transition-transform duration-300 ${expandedCategory === i ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedCategory === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[rgba(201,168,76,0.1)] pt-4">
                              <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed mb-4">
                                {category.description}
                              </p>
                              <div className="space-y-2">
                                <p className="font-[family-name:var(--font-heading)] text-xs text-[#8b7355] tracking-wider uppercase mb-2">
                                  Protected Elements
                                </p>
                                {category.items.map((item, j) => (
                                  <div key={j} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                                    <span className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-3 border-t border-[rgba(201,168,76,0.08)]">
                                <LegalNotice variant="inline" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </MetallicCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ SECTION 3: Creation Timeline ═══ */}
          <div id="section-timeline" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                  <Clock className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                  Creation Timeline
                </h2>
              </div>

              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic mb-4 max-w-3xl">
                Development timeline documenting the evolution of the Empire English Assessment System. This record serves as evidence of creation dates, development milestones, and the progressive build-out of platform capabilities.
              </p>

              {/* Category Legend */}
              <div className="flex flex-wrap gap-3 mb-8">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
                    <span className="font-[family-name:var(--font-heading)] text-xs text-[#8b7355] tracking-wide">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 sm:left-7 top-0 bottom-0 w-px bg-gradient-to-b from-[rgba(201,168,76,0.3)] via-[rgba(201,168,76,0.15)] to-transparent" />

                <div className="space-y-6">
                  {CREATION_TIMELINE.map((entry, i) => (
                    <motion.div
                      key={entry.version}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-14 sm:pl-20"
                    >
                      {/* Timeline dot */}
                      <div
                        className="absolute left-3 sm:left-5 top-2 w-4 h-4 sm:w-4 sm:h-4 rounded-full border-2"
                        style={{
                          borderColor: CATEGORY_COLORS[entry.category],
                          backgroundColor: `${CATEGORY_COLORS[entry.category]}33`,
                        }}
                      />

                      {/* Content */}
                      <MetallicCard className="p-4 sm:p-6" hover glowOnHover>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded text-xs font-[family-name:var(--font-heading)] font-bold"
                              style={{
                                backgroundColor: `${CATEGORY_COLORS[entry.category]}20`,
                                color: CATEGORY_COLORS[entry.category],
                                border: `1px solid ${CATEGORY_COLORS[entry.category]}40`,
                              }}
                            >
                              v{entry.version}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded text-xs font-[family-name:var(--font-heading)]"
                              style={{
                                backgroundColor: `${CATEGORY_COLORS[entry.category]}15`,
                                color: CATEGORY_COLORS[entry.category],
                              }}
                            >
                              {CATEGORY_LABELS[entry.category]}
                            </span>
                          </div>
                          <span className="font-[family-name:var(--font-heading)] text-xs text-[#8b7355] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold text-[#c9a84c] mb-2">
                          {entry.title}
                        </h4>
                        <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed">
                          {entry.description}
                        </p>
                      </MetallicCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ SECTION 4: Digital Ownership Records ═══ */}
          <div id="section-records" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                  <Archive className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                  Digital Ownership Records
                </h2>
              </div>

              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic mb-8 max-w-3xl">
                Lightweight timestamped records that establish a historical evidence trail for key platform events. These records document terms acceptances, content publications, certificate generations, and major system updates — creating an auditable chronology of ownership-relevant activities.
              </p>

              <MetallicCard className="overflow-hidden" hover={false} glowOnHover={false}>
                {/* Records Header */}
                <div className="p-5 sm:p-6 border-b border-[rgba(201,168,76,0.15)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#c9a84c] flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Event Log
                    </h3>
                    <button
                      onClick={fetchRecords}
                      className="font-[family-name:var(--font-heading)] text-xs text-[#8b7355] hover:text-[#c9a84c] transition-colors tracking-wide"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Records List */}
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {recordsLoading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin mx-auto mb-3" />
                      <p className="font-[family-name:var(--font-heading)] text-sm text-[#8b7355]">
                        Loading records...
                      </p>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle2 className="w-8 h-8 text-[#c9a84c] mx-auto mb-3" />
                      <p className="font-[family-name:var(--font-heading)] text-sm text-[#8b7355]">
                        Ownership records will appear as platform events occur.
                      </p>
                      <p className="font-[family-name:var(--font-sans)] text-xs text-[#8b7355]/60 mt-1">
                        Records are created automatically for terms acceptances, certificate generations, and system updates.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[rgba(201,168,76,0.08)]">
                      {records.map((record) => {
                        const Icon = EVENT_TYPE_ICONS[record.eventType] || Shield;
                        const label = EVENT_TYPE_LABELS[record.eventType] || record.eventType;
                        return (
                          <div key={record.id} className="p-4 sm:p-5 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center bg-[rgba(201,168,76,0.06)] shrink-0">
                                <Icon className="w-3.5 h-3.5 text-[#c9a84c]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#e8e0d0]">
                                    {label}
                                  </span>
                                  {record.createdBy && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(201,168,76,0.08)] text-[#8b7355] font-[family-name:var(--font-heading)] tracking-wide uppercase">
                                      {record.createdBy}
                                    </span>
                                  )}
                                </div>
                                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs sm:text-sm leading-relaxed">
                                  {record.description}
                                </p>
                                <p className="font-[family-name:var(--font-heading)] text-[10px] text-[#8b7355]/50 mt-1.5 tracking-wide">
                                  {new Date(record.createdAt).toLocaleString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Records Footer */}
                <div className="p-4 border-t border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.02)]">
                  <LegalNotice variant="footer" />
                </div>
              </MetallicCard>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ SECTION 5: Exportable Documentation Package ═══ */}
          <div id="section-export" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                  <Download className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                  Documentation Package
                </h2>
              </div>

              <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic mb-8 max-w-3xl">
                Download a comprehensive, professionally formatted documentation package containing all legal and ownership documents for the Empire English Assessment System. This package is designed to support future IP registration preparation and legal documentation needs.
              </p>

              <GlowingBorder color="gold" intensity="high">
                <MetallicCard className="p-6 sm:p-8" hover={false} glowOnHover={false}>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.1)] mx-auto mb-4">
                      <Scroll className="w-8 h-8 text-[#c9a84c]" />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#c9a84c] mb-2">
                      MACAL EMPIRE Documentation Package
                    </h3>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm">
                      Complete legal and ownership documentation bundle
                    </p>
                  </div>

                  {/* Package Contents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {[
                      { icon: Scale, title: 'Terms of Service', desc: 'Complete user agreement and liability terms' },
                      { icon: Lock, title: 'Privacy Policy', desc: 'Data handling and privacy practices' },
                      { icon: Crown, title: 'Ownership Declaration', desc: 'Formal IP ownership statement' },
                      { icon: Shield, title: 'Copyright Notices', desc: 'Standardized copyright declarations' },
                      { icon: Palette, title: 'Branding References', desc: 'MACAL EMPIRE identity documentation' },
                      { icon: Clock, title: 'Version History', desc: 'Creation timeline and update records' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg border border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.03)]">
                        <item.icon className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                        <div>
                          <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#e8e0d0]">
                            {item.title}
                          </p>
                          <p className="font-[family-name:var(--font-sans)] text-xs text-[#8b7355]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Export Format Info */}
                  <div className="p-4 rounded-lg border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)] mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-[#c9a84c]" />
                      <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#c9a84c]">
                        Export Format
                      </p>
                    </div>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs leading-relaxed">
                      The documentation package is generated as a professionally formatted PDF document suitable for legal reference, IP registration preparation, and archival purposes. All documents are consolidated into a single, organized file with consistent branding and professional formatting.
                    </p>
                  </div>

                  {/* Export Button */}
                  <div className="text-center">
                    <ImperialButton
                      variant="primary"
                      size="lg"
                      onClick={handleExport}
                      disabled={exporting}
                      className="min-w-[250px]"
                    >
                      {exporting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Package...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Documentation Package
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </ImperialButton>
                    <p className="font-[family-name:var(--font-sans)] text-[#8b7355]/50 text-xs mt-3 italic">
                      PDF format — Professional documentation for IP registration readiness
                    </p>
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ SECTION 6: Rights Reserved ═══ */}
          <div id="section-rights" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center bg-[rgba(201,168,76,0.08)]">
                  <Scale className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#c9a84c]">
                  Rights Reserved
                </h2>
              </div>

              {/* Formal Rights Notice */}
              <GlowingBorder color="bronze" intensity="medium">
                <MetallicCard className="p-6 sm:p-8" hover={false} glowOnHover={false}>
                  <div className="text-center mb-6">
                    <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xl sm:text-2xl font-bold mb-4">
                      &copy; MACAL EMPIRE. All rights reserved.
                    </p>
                    <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
                      All rights reserved by MACAL EMPIRE. Unauthorized copying, redistribution, replication, or commercial reproduction of any content, design, code, assessment materials, scoring methodologies, branding elements, or any other proprietary assets of the Empire English Assessment System is strictly prohibited.
                    </p>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="p-4 rounded-lg border border-[rgba(201,168,76,0.12)] bg-[rgba(10,10,10,0.4)]">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#c9a84c] mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Prohibited Activities
                      </h4>
                      <ul className="space-y-1.5">
                        {[
                          'Copying, reproducing, or distributing any portion of the platform content without written authorization',
                          'Reverse engineering, decompiling, or disassembling the platform architecture or source code',
                          'Creating derivative works based on the assessment framework, scoring logic, or design system',
                          'Using the MACAL EMPIRE brand identity, logo, or visual elements without explicit permission',
                          'Replicating the assessment methodology, question structures, or ranking system for commercial purposes',
                          'Selling, licensing, or sublicensing any content obtained from or through this platform',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#ff6b35] mt-2 shrink-0" />
                            <span className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border border-[rgba(201,168,76,0.12)] bg-[rgba(10,10,10,0.4)]">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#c9a84c] mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        IP Registration Readiness
                      </h4>
                      <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed mb-3">
                        This documentation system is structured to support future intellectual property registration processes. The organized ownership records, timestamped evidence trail, and comprehensive documentation package are designed to facilitate:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          'Copyright registration applications',
                          'Trademark filing preparation',
                          'Evidence of creation and first publication',
                          'Ownership chain documentation',
                          'Trade secret identification and cataloging',
                          'Legal dispute supporting materials',
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-[#c9a84c] shrink-0" />
                            <span className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-xs">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Legal Safety Notice */}
                    <div className="p-4 rounded-lg border border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.04)]">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#ff6b35] mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Legal Safety Notice
                      </h4>
                      <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm leading-relaxed">
                        This documentation system does not constitute official government copyright registration, trademark registration, or any form of government-issued legal certification. It is designed solely to organize and document ownership evidence, structure IP-related information, and prepare materials that may support future legal registration processes. No fake compliance seals, government certifications, or official registrations are claimed or represented within this system.
                      </p>
                    </div>
                  </div>
                </MetallicCard>
              </GlowingBorder>
            </motion.div>
          </div>

          <SectionDivider />

          {/* ═══ Related Links & Navigation ═══ */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-8 space-y-6"
          >
            <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-wider">
              Related Legal Documents
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/terms">
                <ImperialButton variant="outline" size="md">
                  <span className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Terms of Service
                  </span>
                </ImperialButton>
              </Link>
              <Link href="/privacy">
                <ImperialButton variant="outline" size="md">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Privacy Policy
                  </span>
                </ImperialButton>
              </Link>
            </div>
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg tracking-wider">
              &copy; {new Date().getFullYear()} MACAL EMPIRE. All rights reserved.
            </p>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
