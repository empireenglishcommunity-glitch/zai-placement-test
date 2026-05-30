import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[rgba(10,10,10,0.9)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MACAL EMPIRE"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#c9a84c] tracking-wider">
              MACAL EMPIRE
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/terms"
              className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider hover:text-[#c9a84c] transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-[rgba(201,168,76,0.2)]">|</span>
            <Link
              href="/privacy"
              className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider hover:text-[#c9a84c] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[rgba(201,168,76,0.2)]">|</span>
            <Link
              href="/ip-ownership"
              className="font-[family-name:var(--font-heading)] text-[#8b7355] text-xs tracking-wider hover:text-[#c9a84c] transition-colors"
            >
              IP & Ownership
            </Link>
            <span className="text-[rgba(201,168,76,0.2)]">|</span>
            <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
              Forged in Language. Crowned in Mastery.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">
              &copy; {new Date().getFullYear()} MACAL EMPIRE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
