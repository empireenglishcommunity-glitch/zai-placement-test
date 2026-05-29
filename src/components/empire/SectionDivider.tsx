export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />
      <div className="text-[#c9a84c] text-xl">⚔️</div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />
    </div>
  );
}
