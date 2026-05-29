'use client';

import { cn } from '@/lib/utils';

interface TacticalPanelProps {
  children: React.ReactNode;
  className?: string;
  accentSide?: 'left' | 'top';
  accentColor?: string;
}

export function TacticalPanel({ children, className = '', accentSide = 'left', accentColor = '#c9a84c' }: TacticalPanelProps) {
  const accentStyles = {
    left: 'border-l-2',
    top: 'border-t-2',
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-b from-[rgba(26,26,46,0.9)] to-[rgba(10,10,10,0.95)] border border-[rgba(201,168,76,0.15)] rounded-lg p-4',
        accentStyles[accentSide],
        className
      )}
      style={{
        borderColor: `${accentColor}40`,
        [accentSide === 'left' ? 'borderLeftColor' : 'borderTopColor']: accentColor,
      }}
    >
      {children}
    </div>
  );
}
