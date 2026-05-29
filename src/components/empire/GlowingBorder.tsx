'use client';

import { motion } from 'framer-motion';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlowingBorder({
  children,
  className = '',
  color = 'gold',
  intensity = 'medium',
}: GlowingBorderProps) {
  const colorMap = {
    gold: { border: 'rgba(201, 168, 76, VAR)', shadow: 'rgba(201, 168, 76, VAR)' },
    bronze: { border: 'rgba(205, 127, 50, VAR)', shadow: 'rgba(205, 127, 50, VAR)' },
    fire: { border: 'rgba(255, 107, 53, VAR)', shadow: 'rgba(255, 107, 53, VAR)' },
  };

  const intensityMap = {
    low: { base: 0.15, pulse: 0.25, shadow: 5 },
    medium: { base: 0.25, pulse: 0.45, shadow: 10 },
    high: { base: 0.4, pulse: 0.7, shadow: 20 },
  };

  const c = colorMap[color as keyof typeof colorMap] || colorMap.gold;
  const i = intensityMap[intensity];

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 ${i.shadow}px ${c.shadow.replace('VAR', String(i.base))}, inset 0 0 ${i.shadow / 2}px ${c.shadow.replace('VAR', String(i.base / 2))}`,
          `0 0 ${i.shadow * 2}px ${c.shadow.replace('VAR', String(i.pulse))}, inset 0 0 ${i.shadow}px ${c.shadow.replace('VAR', String(i.pulse / 2))}`,
          `0 0 ${i.shadow}px ${c.shadow.replace('VAR', String(i.base))}, inset 0 0 ${i.shadow / 2}px ${c.shadow.replace('VAR', String(i.base / 2))}`,
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
