'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImperialButton } from './ImperialButton';
import { Download } from 'lucide-react';

interface EmpireCertificateProps {
  studentName: string;
  rankName: string;
  finalLevel: number;
  speakingScore: number;
  listeningScore: number;
  vocabularyScore: number;
  grammarScore: number;
  completionDate?: string;
  /** User email for watermark */
  studentEmail?: string;
}

const RANK_COLORS: Record<number, string> = {
  0: '#8b7355',
  1: '#cd7f32',
  2: '#c9a84c',
  3: '#ff6b35',
};

const RANK_EMOJIS: Record<number, string> = {
  0: '🗡️',
  1: '⚔️',
  2: '🛡️',
  3: '👑',
};

export function EmpireCertificate({
  studentName,
  rankName,
  finalLevel,
  speakingScore,
  listeningScore,
  vocabularyScore,
  grammarScore,
  completionDate,
  studentEmail,
}: EmpireCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const date = completionDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const accentColor = RANK_COLORS[finalLevel] || '#c9a84c';
  const rankEmoji = RANK_EMOJIS[finalLevel] || '🗡️';

  // Generate session stamp for watermark
  const sessionStamp = `SID-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      // Use html2canvas-like approach via the browser's built-in methods
      // Create a print-friendly version
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const certificateHTML = certificateRef.current.outerHTML;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Empire Certificate - ${studentName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0a; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          ${certificateHTML}
          <script>
            setTimeout(() => { window.print(); }, 1000);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Certificate download failed:', err);
    }
  }, [studentName]);

  return (
    <div className="space-y-6">
      {/* Certificate */}
      <div
        ref={certificateRef}
        className="relative overflow-hidden rounded-xl border-2 p-8 sm:p-12"
        style={{
          background: 'linear-gradient(145deg, #111118, #1a1a2e, #0d0d15)',
          borderColor: `${accentColor}50`,
          boxShadow: `0 0 40px ${accentColor}15, inset 0 0 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* ── Watermark Layer ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          {/* Diagonal repeating watermark */}
          <div
            style={{
              position: 'absolute',
              inset: '-50%',
              width: '200%',
              height: '200%',
              transform: 'rotate(-22deg)',
              opacity: 0.035,
            }}
          >
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  style={{
                    position: 'absolute',
                    left: col * 280 + (row % 2 === 0 ? 140 : 0),
                    top: row * 160,
                    fontSize: 13,
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    color: '#c9a84c',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.08em',
                    lineHeight: 1.5,
                  }}
                >
                  <div>{studentName || 'PROTECTED'}</div>
                  <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.7 }}>
                    {sessionStamp} | MACAL EMPIRE
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Imperial Seal Background Effect ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `
              radial-gradient(ellipse at 50% 40%, ${accentColor}06 0%, transparent 50%),
              radial-gradient(ellipse at 20% 70%, rgba(201,168,76,0.03) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(201,168,76,0.03) 0%, transparent 40%)
            `,
          }}
        />

        {/* ── Central Imperial Seal ── */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: '50%',
              border: `1px solid ${accentColor}08`,
              boxShadow: `0 0 80px ${accentColor}06, inset 0 0 60px ${accentColor}04`,
              opacity: 0.15,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: `1px solid ${accentColor}12`,
              opacity: 0.2,
            }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 rounded-tl-md" style={{ borderColor: `${accentColor}40`, zIndex: 2 }} />
        <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 rounded-tr-md" style={{ borderColor: `${accentColor}40`, zIndex: 2 }} />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 rounded-bl-md" style={{ borderColor: `${accentColor}40`, zIndex: 2 }} />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 rounded-br-md" style={{ borderColor: `${accentColor}40`, zIndex: 2 }} />

        {/* Inner glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 30%, ${accentColor}08 0%, transparent 60%)`, zIndex: 2 }} />

        {/* Top gold line */}
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`, zIndex: 2 }} />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="MACAL EMPIRE"
              width={60}
              height={60}
              className="object-contain mx-auto"
            />
          </div>

          {/* Brand */}
          <p className="font-[family-name:var(--font-heading)] text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-1">
            MACAL EMPIRE
          </p>

          {/* Title */}
          <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl md:text-3xl font-bold mb-1" style={{ color: accentColor }}>
            CERTIFICATE OF ACHIEVEMENT
          </h2>
          <p className="font-[family-name:var(--font-heading)] text-[10px] sm:text-xs tracking-[0.2em] text-[#8b7355] mb-6">
            EMPIRE ENGLISH COMMUNITY
          </p>

          {/* Decorative line */}
          <div className="w-32 h-px mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />

          {/* This certifies */}
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs sm:text-sm italic mb-4">
            This is to certify that
          </p>

          {/* Student Name */}
          <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e0d0] mb-4">
            {studentName}
          </h3>

          {/* Has been awarded */}
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs sm:text-sm italic mb-6">
            has successfully completed the Four Trials and has been awarded the Imperial Rank of
          </p>

          {/* Rank */}
          <div className="mb-6">
            <p className="text-4xl sm:text-5xl mb-2">{rankEmoji}</p>
            <p className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}>
              {rankName.toUpperCase()}
            </p>
          </div>

          {/* Scores row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap mb-6 text-[10px] sm:text-xs">
            <div>
              <p style={{ color: '#cd7f32' }} className="font-[family-name:var(--font-heading)]">{speakingScore}%</p>
              <p className="text-[#8b7355]">Speaking</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#c9a84c' }} className="font-[family-name:var(--font-heading)]">{listeningScore}%</p>
              <p className="text-[#8b7355]">Listening</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#ff6b35' }} className="font-[family-name:var(--font-heading)]">~{vocabularyScore.toLocaleString()}</p>
              <p className="text-[#8b7355]">Vocabulary</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#e74c3c' }} className="font-[family-name:var(--font-heading)]">{grammarScore}%</p>
              <p className="text-[#8b7355]">Grammar</p>
            </div>
          </div>

          {/* Decorative line */}
          <div className="w-32 h-px mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />

          {/* Date and tagline */}
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-xs italic mb-2">
            Awarded on {date}
          </p>
          <p className="font-[family-name:var(--font-heading)] text-[10px] sm:text-xs tracking-[0.15em] text-[#8b7355]">
            FORGED IN LANGUAGE. CROWNED IN MASTERY.
          </p>

          {/* ── Certificate Watermark Footer ── */}
          <div className="mt-6 pt-3 border-t border-[rgba(201,168,76,0.08)]">
            <p className="text-[7px] font-[family-name:var(--font-heading)] tracking-[0.2em] uppercase text-[rgba(139,115,85,0.35)]">
              MACAL EMPIRE PROPRIETARY CERTIFICATE — {studentEmail || studentName} — {sessionStamp}
            </p>
            <p className="text-[6px] text-[rgba(139,115,85,0.25)] mt-1">
              Protected proprietary content of MACAL EMPIRE. Unauthorized copying or redistribution prohibited.
            </p>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`, zIndex: 2 }} />
      </div>

      {/* Download button */}
      <div className="text-center">
        <ImperialButton variant="outline" size="md" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </ImperialButton>
      </div>
    </div>
  );
}
