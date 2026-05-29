'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max, label, showPercentage = true, color = '#c9a84c', size = 'md' }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-[#8b7355] font-[family-name:var(--font-heading)]">{label}</span>}
          {showPercentage && <span className="text-sm text-[#c9a84c] font-[family-name:var(--font-heading)]">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full bg-[rgba(201,168,76,0.1)] overflow-hidden`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
