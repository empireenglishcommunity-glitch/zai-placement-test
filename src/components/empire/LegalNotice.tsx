'use client';

/**
 * MACAL EMPIRE — Legal Protection Notice
 * Small, professional proprietary content notices for sensitive areas.
 */

interface LegalNoticeProps {
  /** Placement variant */
  variant?: 'footer' | 'inline' | 'banner' | 'watermark';
  /** Custom text override */
  customText?: string;
}

const DEFAULT_TEXT = 'Protected proprietary content of MACAL EMPIRE. Unauthorized copying or redistribution prohibited.';

export function LegalNotice({ variant = 'footer', customText }: LegalNoticeProps) {
  const text = customText || DEFAULT_TEXT;

  if (variant === 'footer') {
    return (
      <div className="flex items-center justify-center gap-2 py-3 px-4 mt-4 border-t border-[rgba(201,168,76,0.08)]">
        <span className="text-[9px] sm:text-[10px] font-[family-name:var(--font-heading)] tracking-widest uppercase text-[rgba(139,115,85,0.5)]">
          {text}
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="text-[8px] font-[family-name:var(--font-heading)] tracking-wider uppercase text-[rgba(139,115,85,0.4)] select-none">
        {text}
      </span>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-md mb-4"
        style={{
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid rgba(201,168,76,0.08)',
        }}
      >
        <span className="text-[9px] sm:text-[10px] font-[family-name:var(--font-heading)] tracking-wider uppercase text-[rgba(139,115,85,0.5)]">
          MACAL EMPIRE PROPRIETARY CONTENT
        </span>
        <span className="text-[rgba(139,115,85,0.2)]">|</span>
        <span className="text-[8px] sm:text-[9px] text-[rgba(139,115,85,0.35)]">
          Unauthorized reproduction prohibited
        </span>
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div
        className="absolute bottom-2 right-3 pointer-events-none select-none"
        style={{ opacity: 0.15 }}
      >
        <span className="text-[7px] font-[family-name:var(--font-heading)] tracking-[0.2em] uppercase text-[#8b7355]">
          MACAL EMPIRE
        </span>
      </div>
    );
  }

  return null;
}
