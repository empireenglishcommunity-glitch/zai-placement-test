import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[rgba(10,10,10,0.9)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Empire English Community"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#c9a84c] tracking-wider">
              EMPIRE ENGLISH COMMUNITY
            </span>
          </div>
          <p className="text-[#8b7355] text-sm font-[family-name:var(--font-heading)]">
            Forged in Language. Crowned in Mastery.
          </p>
          <p className="text-[#8b7355] text-xs">
            © {new Date().getFullYear()} Empire English Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
