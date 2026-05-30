'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEmpireAudio } from './EmpireAudioProvider';

export function EmpireAudioOverlay() {
  const { showOverlay, activate, skipActivation } = useEmpireAudio();

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0a0a0a]" />

          {/* Atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Central radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.08)_0%,rgba(201,168,76,0.02)_40%,transparent_70%)]" />
            {/* Side vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="relative z-10 text-center px-6 max-w-lg"
          >
            {/* Decorative top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="w-32 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
            />

            {/* Sword icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[#c9a84c] text-3xl mb-4"
            >
              ⚔️
            </motion.div>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider mb-4"
            >
              <span className="gold-shimmer">ENTER THE EMPIRE</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm sm:text-base italic mb-10"
            >
              Activate the cinematic Empire experience
            </motion.p>

            {/* Activation Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(201,168,76,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={activate}
              className="group relative px-10 py-4 rounded-md font-[family-name:var(--font-heading)] font-semibold text-base sm:text-lg tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#c9a84c] to-[#cd7f32] cursor-pointer transition-all duration-300 hover:from-[#d4b55c] hover:to-[#d48f42] shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              {/* Button border glow */}
              <div className="absolute inset-0 rounded-md border border-[rgba(232,212,139,0.3)] pointer-events-none" />
              ACTIVATE EXPERIENCE
            </motion.button>

            {/* Skip link */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              whileHover={{ opacity: 0.8 }}
              onClick={skipActivation}
              className="block mx-auto mt-6 font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-[0.2em] uppercase cursor-pointer bg-transparent border-none hover:text-[#c9a84c] transition-colors"
            >
              Enter silently
            </motion.button>

            {/* Decorative bottom line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.5 }}
              className="w-32 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
            />
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#c9a84c]"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  opacity: [0, 0.4, 0],
                  y: [0, -30 - Math.random() * 50],
                  x: [0, (Math.random() - 0.5) * 20],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
