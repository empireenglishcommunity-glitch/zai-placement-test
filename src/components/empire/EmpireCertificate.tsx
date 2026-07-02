'use client';

import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImperialButton } from './ImperialButton';
import { Download, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface EmpireCertificateProps {
  studentName: string;
  rankName: string;
  finalLevel: number;
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  writingScore: number;
  totalScore: number;
  cefrLevel: string;
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

type DownloadState = 'idle' | 'generating' | 'success' | 'error';

export function EmpireCertificate({
  studentName,
  rankName,
  finalLevel,
  readingScore,
  listeningScore,
  speakingScore,
  writingScore,
  totalScore,
  cefrLevel,
  completionDate,
  studentEmail,
}: EmpireCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const date = completionDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const accentColor = RANK_COLORS[finalLevel] || '#c9a84c';

  // Generate session stamp for watermark
  const sessionStamp = `SID-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) {
      setDownloadState('error');
      setErrorMessage('Certificate element not found. Please refresh the page and try again.');
      return;
    }

    setDownloadState('generating');
    setErrorMessage('');

    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      // Log generation start
      console.log('[certificate_generation_status] Starting certificate generation for:', studentName);

      // Render the certificate DOM to canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        logging: false,
        width: certificateRef.current.scrollWidth,
        height: certificateRef.current.scrollHeight,
      });

      console.log('[certificate_generation_status] Canvas rendered successfully');

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF in landscape orientation for certificate
      const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `MACAL_EMPIRE_Certificate_${safeName}_${rankName}.pdf`;

      // Trigger download
      pdf.save(filename);

      console.log('[certificate_generation_status] PDF generated and download triggered:', filename);
      console.log('[download_trigger_status] Download initiated successfully');

      setDownloadState('success');

      // Reset to idle after 5 seconds
      setTimeout(() => setDownloadState('idle'), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[certificate_generation_status] Generation FAILED:', message);
      console.error('[download_trigger_status] Download NOT triggered due to error');

      setDownloadState('error');
      setErrorMessage('Certificate generation failed. Please try again or use Print instead.');

      // Reset error after 8 seconds
      setTimeout(() => {
        setDownloadState('idle');
        setErrorMessage('');
      }, 8000);
    }
  }, [studentName, rankName]);

  // Fallback: Print-based download (always available)
  const handlePrintFallback = useCallback(() => {
    if (!certificateRef.current) return;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setDownloadState('error');
        setErrorMessage('Pop-up blocked. Please allow pop-ups for this site and try again.');
        return;
      }

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
            setTimeout(() => { window.print(); }, 1500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      console.log('[download_trigger_status] Print fallback initiated');
    } catch (err) {
      console.error('[download_trigger_status] Print fallback failed:', err);
      setDownloadState('error');
      setErrorMessage('Could not open print dialog. Please check your browser settings.');
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
            <p className="text-4xl sm:text-5xl mb-2">{'🗡️⚔️🛡️👑'[finalLevel] || '🗡️'}</p>
            <p className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}>
              {rankName.toUpperCase()}
            </p>
          </div>

          {/* Scores row — TOEFL format */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap mb-4 text-[10px] sm:text-xs">
            <div>
              <p style={{ color: '#c9a84c' }} className="font-[family-name:var(--font-heading)] text-sm font-bold">{readingScore}/30</p>
              <p className="text-[#8b7355]">Reading</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#cd7f32' }} className="font-[family-name:var(--font-heading)] text-sm font-bold">{listeningScore}/30</p>
              <p className="text-[#8b7355]">Listening</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#ff6b35' }} className="font-[family-name:var(--font-heading)] text-sm font-bold">{speakingScore}/30</p>
              <p className="text-[#8b7355]">Speaking</p>
            </div>
            <div className="w-px h-6 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p style={{ color: '#9b59b6' }} className="font-[family-name:var(--font-heading)] text-sm font-bold">{writingScore}/30</p>
              <p className="text-[#8b7355]">Writing</p>
            </div>
          </div>

          {/* Total + CEFR */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold" style={{ color: accentColor }}>{totalScore}/120</p>
              <p className="text-[#8b7355] text-[10px]">Total Score</p>
            </div>
            <div className="w-px h-8 bg-[rgba(201,168,76,0.2)]" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#cd7f32]">{cefrLevel}</p>
              <p className="text-[#8b7355] text-[10px]">CEFR Level</p>
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

      {/* ── Download Controls ── */}
      <div className="space-y-4">
        {/* Primary download button */}
        <div className="text-center">
          <ImperialButton
            variant="primary"
            size="lg"
            onClick={handleDownload}
            disabled={downloadState === 'generating'}
          >
            {downloadState === 'generating' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating certificate...
              </span>
            ) : downloadState === 'success' ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Download started!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Certificate (PDF)
              </span>
            )}
          </ImperialButton>
        </div>

        {/* Success message */}
        {downloadState === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-heading)] text-[#c9a84c] text-xs tracking-wider flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Certificate PDF generated and download initiated successfully
            </p>
          </motion.div>
        )}

        {/* Error message */}
        {downloadState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.05)]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff6b35]" />
              <p className="text-[#ff6b35] text-xs font-[family-name:var(--font-sans)]">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Fallback print option */}
        <div className="text-center">
          <ImperialButton
            variant="ghost"
            size="sm"
            onClick={handlePrintFallback}
          >
            <span className="flex items-center gap-1.5 text-[#8b7355]">
              Or print/save as PDF via browser
            </span>
          </ImperialButton>
        </div>
      </div>
    </div>
  );
}
