'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { GlowingBorder } from './GlowingBorder';

const socialAccounts = [
  {
    platform: 'TikTok',
    handle: '@macal.empire',
    url: 'https://www.tiktok.com/@macal.empire',
    description: 'Witness the Empire in motion. Short-form content that ignites your discipline and fuels your transformation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.81a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.22z" />
      </svg>
    ),
    gradient: 'from-[#ff0050]/20 via-[#00f2ea]/10 to-[#ff0050]/5',
    accentColor: '#ff0050',
    glowColor: 'rgba(255, 0, 80, 0.3)',
    borderGradient: 'from-[#ff0050] via-[#ff0050]/50 to-[#00f2ea]',
  },
  {
    platform: 'Instagram',
    handle: 'macals_empire_official',
    url: 'https://www.instagram.com/macals_empire_official',
    description: 'Enter the visual chronicles of the Empire. Every post is a testament to growth, discipline, and imperial ambition.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    gradient: 'from-[#f09433]/20 via-[#dc2743]/10 to-[#bc1888]/5',
    accentColor: '#dc2743',
    glowColor: 'rgba(220, 39, 67, 0.3)',
    borderGradient: 'from-[#f09433] via-[#dc2743]/50 to-[#bc1888]',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: 'easeOut' },
  }),
};

export function SocialMediaSection() {
  return (
    <section className="relative z-10 px-4 py-20 overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(205,127,50,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(255,107,53,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-[0.35em] uppercase text-[#8b7355] mb-3"
          >
            Beyond the Platform
          </motion.p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#c9a84c] text-glow mb-4">
            ENTER THE EMPIRE
          </h2>
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
            The conquest does not end here. Follow the Empire across the realms and stay connected to the movement.
          </p>
        </motion.div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {socialAccounts.map((account, i) => (
            <motion.a
              key={account.platform}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[#111118] to-[#1a1a2e] transition-all duration-500 hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(201,168,76,0.08)]">
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${account.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Top edge shimmer line */}
                <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${account.borderGradient} opacity-30 group-hover:opacity-80 transition-opacity duration-500`} />

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                  <div className="absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: account.accentColor }} />
                </div>

                <div className="relative z-10 p-8 sm:p-10">
                  {/* Platform Icon + Name Row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex-shrink-0 p-3 rounded-lg border transition-all duration-500 group-hover:scale-110"
                      style={{
                        borderColor: `${account.accentColor}40`,
                        color: account.accentColor,
                        boxShadow: `0 0 0px ${account.accentColor}00`,
                      }}
                    >
                      <div className="group-hover:[filter:drop-shadow(0_0_8px_var(--glow))] transition-all duration-500" style={{ '--glow': account.glowColor } as React.CSSProperties}>
                        {account.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[#e8e0d0] group-hover:text-[#c9a84c] transition-colors duration-300">
                        {account.platform}
                      </h3>
                      <p className="font-[family-name:var(--font-heading)] text-sm tracking-wider mt-1 transition-colors duration-300" style={{ color: account.accentColor }}>
                        {account.handle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base leading-relaxed mb-6 group-hover:text-[#a09080] transition-colors duration-300">
                    {account.description}
                  </p>

                  {/* CTA Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-heading)] text-xs tracking-[0.25em] uppercase text-[#8b7355] group-hover:text-[#c9a84c] transition-colors duration-300">
                      Follow the Empire
                    </span>
                    <div
                      className="flex items-center gap-1.5 text-sm font-[family-name:var(--font-heading)] transition-all duration-300 group-hover:translate-x-1"
                      style={{ color: account.accentColor }}
                    >
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">Enter</span>
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom glow bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`h-full bg-gradient-to-r ${account.borderGradient}`} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-[0.2em] uppercase">
            The Empire expands beyond borders
          </p>
        </motion.div>
      </div>
    </section>
  );
}
