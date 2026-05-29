'use client';

import { motion } from 'framer-motion';
import { IMPERIAL_RANKS } from '@/lib/types';
import type { ImperialLevel } from '@/lib/types';

interface ImperialRankBadgeProps {
  level: ImperialLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RANK_COLORS: Record<ImperialLevel, string> = {
  0: '#8b7355',
  1: '#cd7f32',
  2: '#c9a84c',
  3: '#ff6b35',
};

const RANK_ICONS: Record<ImperialLevel, string> = {
  0: '🗡️',
  1: '⚔️',
  2: '🛡️',
  3: '👑',
};

export function ImperialRankBadge({ level, size = 'md', showLabel = true }: ImperialRankBadgeProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', icon: 'text-lg', text: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'text-2xl', text: 'text-sm' },
    lg: { container: 'w-24 h-24', icon: 'text-4xl', text: 'text-base' },
  };

  const s = sizes[size];
  const color = RANK_COLORS[level];

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`${s.container} rounded-full border-2 flex items-center justify-center relative`}
        style={{ borderColor: color, boxShadow: `0 0 15px ${color}40, inset 0 0 10px ${color}20` }}
        animate={{
          boxShadow: [
            `0 0 10px ${color}30, inset 0 0 8px ${color}15`,
            `0 0 20px ${color}50, inset 0 0 15px ${color}25`,
            `0 0 10px ${color}30, inset 0 0 8px ${color}15`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className={s.icon}>{RANK_ICONS[level]}</span>
      </motion.div>
      {showLabel && (
        <span className={`font-[family-name:var(--font-heading)] font-bold ${s.text}`} style={{ color }}>
          {IMPERIAL_RANKS[level]}
        </span>
      )}
    </div>
  );
}
