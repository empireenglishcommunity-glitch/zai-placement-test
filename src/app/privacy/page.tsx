'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer, ParticleBackground, ImperialButton, SectionDivider } from '@/components/empire';
import {
  Eye,
  Lock,
  Share2,
  Cookie,
  UserCheck,
  Users,
  RefreshCw,
  Mail,
  Shield,
  Database,
  Server,
  Crown,
} from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content: [
      'When you create an account and use the Empire English Assessment System, MACAL EMPIRE may collect certain personal information that is necessary to provide and improve our services. This includes your full name, email address, and account credentials (such as your password, which is stored in an encrypted form and never displayed to anyone, including our team).',
      'We also collect assessment-related data, including your responses to the Four Trials (Speaking, Listening, Vocabulary, and Grammar), your scores, your assigned Imperial Rank, and any certificates issued to you. This information is essential for delivering the assessment experience and generating your results.',
      'Additionally, the platform may collect session and login activity, such as the times you access the platform, the duration of your sessions, and general device or browser technical information (such as browser type, operating system, and screen resolution). This technical data is collected automatically and is used solely for security monitoring, performance optimization, and improving your user experience.',
      'Information is collected only for purposes that are directly related to platform functionality, account management, assessment services, communication, and system security. We do not collect information beyond what is necessary for these stated purposes.',
    ],
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    content: [
      'The information we collect serves several important purposes. Primarily, your account credentials are used for user authentication — verifying your identity and allowing you secure access to the platform. Your assessment data is processed to evaluate your English proficiency across the Four Trials, calculate your scores, and assign your Imperial Rank.',
      'Your results and rank information are used to generate and send certificates and assessment reports. If you complete the assessment, an email containing your results may be sent to you, and a summary report may also be sent to the platform administrators at MACAL EMPIRE for quality assurance and record-keeping.',
      'We may also use aggregated, anonymized data to improve platform functionality, refine assessment algorithms, and enhance the overall user experience. For example, understanding general score distributions helps us calibrate difficulty levels and ensure fair assessments.',
      'Security monitoring and fraud prevention represent another critical use of collected information. We analyze session activity and technical data to detect unauthorized access attempts, suspicious behavior, and potential misuse of the platform. This helps protect both individual users and the integrity of the assessment system.',
      'Occasionally, we may use your contact information to communicate important updates about the platform, such as changes to our services, new features, or scheduled maintenance. You will always have the ability to manage your communication preferences.',
    ],
  },
  {
    icon: Lock,
    title: '3. Data Protection',
    content: [
      'MACAL EMPIRE takes reasonable and appropriate measures to protect user information from unauthorized access, misuse, loss, and unauthorized disclosure. We employ industry-standard security practices including encrypted data transmission (HTTPS/TLS), secure password storage using cryptographic hashing, and access controls that limit who can view personal data.',
      'Our platform implements session-based authentication, input validation, and protection against common web vulnerabilities to safeguard your information during transmission and storage. Assessment data and personal records are stored in secured databases with controlled access.',
      'While we are committed to protecting your information, no method of electronic storage or transmission is completely immune to all potential threats. We continuously review and improve our security practices, but we cannot guarantee absolute security. We encourage you to use strong, unique passwords and to keep your account credentials confidential.',
    ],
  },
  {
    icon: Share2,
    title: '4. Data Sharing',
    content: [
      'MACAL EMPIRE does not sell, rent, or trade your personal information to third parties for marketing or commercial purposes. Your data is treated as confidential and is used exclusively for the operation and improvement of the Empire English Assessment System.',
      'Information may only be shared in the following limited circumstances: when legally required by applicable law, regulation, or legal process; when necessary to protect the rights, safety, or property of MACAL EMPIRE, our users, or the public; or when required for the legitimate operation of the platform, such as sending assessment results via email service providers.',
      'If we engage third-party service providers to assist with platform operations (such as email delivery or infrastructure hosting), we ensure they are bound by appropriate data protection agreements and process information only as directed by us. These providers are not permitted to use your data for their own purposes.',
    ],
  },
  {
    icon: Cookie,
    title: '5. Cookies & Sessions',
    content: [
      'The Empire English Assessment System uses cookies and similar technologies to maintain your authenticated session, remember your preferences, and ensure the security and stability of the platform. When you log in, a session cookie is created to verify your identity across page requests without requiring you to re-enter your credentials each time.',
      'We may also use basic analytics or technical tracking tools to understand how the platform is used, identify performance issues, and improve the user experience. These tools collect general usage patterns and do not track you across other websites or applications.',
      'The specific purposes of our cookies and session technologies include: maintaining your login state and authentication, preserving your assessment progress during an active session, supporting security features such as fraud detection and rate limiting, and helping us understand platform performance to deliver a better experience.',
      'You can manage your cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of the platform, particularly your ability to remain logged in and to complete assessments without interruption.',
    ],
  },
  {
    icon: UserCheck,
    title: '6. Your Rights',
    content: [
      'We believe in transparency and respect for your personal information. You have the right to request access to the personal data we hold about you, including your account details, assessment results, and any other information associated with your profile.',
      'If any information we hold about you is inaccurate or outdated, you may request a correction. We will make reasonable efforts to update your records promptly upon verification of your identity and the nature of the correction.',
      'You may also request deletion of your account and associated data, subject to certain limitations. For example, we may need to retain certain records for legal or operational reasons, such as maintaining assessment integrity records or fulfilling regulatory obligations. When you submit a deletion request, we will inform you of any data that must be retained and the reasons for doing so.',
      'To exercise any of these rights, please contact us at the email address listed at the bottom of this page. We will respond to your request within a reasonable timeframe and may ask for verification of your identity before processing your request.',
    ],
  },
  {
    icon: Users,
    title: '7. Children & Age Notice',
    content: [
      'The Empire English Assessment System is designed as a general English proficiency assessment platform. It is not intended for unlawful use or misuse by minors without appropriate parental or guardian supervision. If a user under the applicable age of digital consent in their jurisdiction wishes to use the platform, they should do so only with the involvement and consent of a parent or guardian.',
      'MACAL EMPIRE does not knowingly collect personal information from children who are below the legally required age without verified parental consent. If we become aware that we have inadvertently collected personal data from a child in violation of applicable laws, we will take steps to delete such information as promptly as possible.',
    ],
  },
  {
    icon: RefreshCw,
    title: '8. Policy Changes',
    content: [
      'MACAL EMPIRE may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make changes, we will update the "Last Updated" date at the bottom of this page and, for significant changes, we may provide additional notice through the platform or by email.',
      'Your continued use of the Empire English Assessment System after any changes to this Privacy Policy indicates your acceptance of the updated terms. We encourage you to review this page periodically to stay informed about how we protect your information. If you do not agree with any changes, you may choose to discontinue use of the platform and request account deletion.',
    ],
  },
  {
    icon: Mail,
    title: '9. Contact',
    content: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, please contact us:',
    ],
    contact: true,
  },
];

export default function PrivacyPolicyPage() {
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
              <span className="gold-shimmer">PRIVACY POLICY</span>
            </h1>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-2xl mx-auto">
              Your privacy matters to us. This policy explains how MACAL EMPIRE handles your information with transparency and care.
            </p>
          </motion.div>

          <SectionDivider />

          {/* Trust Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center my-10 p-6 rounded-xl border border-[rgba(201,168,76,0.3)] bg-gradient-to-br from-[rgba(201,168,76,0.05)] to-transparent"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#c9a84c]" />
              <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-lg sm:text-xl font-bold">
                Your Data. Your Rights. Our Responsibility.
              </p>
            </div>
            <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm italic max-w-xl mx-auto">
              MACAL EMPIRE is committed to transparency, fairness, and responsible data handling in accordance with applicable privacy principles.
            </p>
          </motion.div>

          {/* Policy Sections */}
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

                  {/* Contact Block */}
                  {section.contact && (
                    <div className="mt-6 p-5 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.04)]">
                      <div className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-[#c9a84c] mt-0.5 shrink-0" />
                        <div>
                          <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-base font-bold mb-2">
                            MACAL EMPIRE
                          </p>
                          <div className="space-y-1.5">
                            <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-sm">
                              <span className="text-[#8b7355]">Email:</span>{' '}
                              <a
                                href="mailto:macalempire@gmail.com"
                                className="text-[#c9a84c] hover:text-[#e8d48b] underline underline-offset-2 transition-colors"
                              >
                                macalempire@gmail.com
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <SectionDivider />

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-8 space-y-6"
          >
            <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-wider">
              Related Documents
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/terms">
                <ImperialButton variant="outline" size="md">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Terms of Service
                  </span>
                </ImperialButton>
              </Link>
              <Link href="/ip-ownership">
                <ImperialButton variant="outline" size="md">
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    IP & Ownership
                  </span>
                </ImperialButton>
              </Link>
              <Link href="/register">
                <ImperialButton variant="primary" size="md">
                  <span className="flex items-center gap-2">
                    Accept & Continue
                  </span>
                </ImperialButton>
              </Link>
            </div>
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
