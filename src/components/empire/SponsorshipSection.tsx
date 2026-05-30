'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function SponsorshipSection() {
  return (
    <section className="relative z-10 px-4 py-20 overflow-hidden">
      {/* Atmospheric background - stronger radial glow for authority */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.07)_0%,rgba(201,168,76,0.02)_40%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.1)] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.1)] to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main authority card */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.25)] bg-gradient-to-b from-[#111118] via-[#161625] to-[#0d0d15]">
            {/* Animated top gold line */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent)',
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Decorative corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[rgba(201,168,76,0.3)] rounded-tl-sm" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[rgba(201,168,76,0.3)] rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[rgba(201,168,76,0.3)] rounded-bl-sm" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[rgba(201,168,76,0.3)] rounded-br-sm" />

            {/* Inner glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.05)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 px-8 py-14 sm:px-14 sm:py-16 text-center">
              {/* Sponsor label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-[0.4em] uppercase text-[#8b7355] mb-6"
              >
                Imperial Alliance
              </motion.p>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <Image
                    src="/logo.png"
                    alt="MACAL EMPIRE"
                    width={80}
                    height={80}
                    className="object-contain mx-auto"
                    priority
                  />
                  {/* Glow behind logo */}
                  <div className="absolute inset-0 -z-10 scale-150 bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)]" />
                </div>
              </motion.div>

              {/* Sponsorship statement */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg mb-3">
                  Empire English Community is proudly sponsored by
                </p>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  <span className="gold-shimmer">MACAL EMPIRE</span>
                </h3>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="w-24 h-px mx-auto my-6 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
              />

              {/* Authority statement */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic max-w-lg mx-auto leading-relaxed"
              >
                Forged under the banner of MACAL EMPIRE, this community stands as a testament to the power of discipline, language, and the relentless pursuit of mastery. Where empires unite, warriors rise.
              </motion.p>

              {/* Shield icons row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.4)]" />
                <span className="text-[#c9a84c] text-lg">⚔️</span>
                <span className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-[0.3em] uppercase">Strength in Unity</span>
                <span className="text-[#c9a84c] text-lg">⚔️</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.4)]" />
              </motion.div>
            </div>

            {/* Animated bottom gold line */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #cd7f32, #c9a84c, #cd7f32, transparent)',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
