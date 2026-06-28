'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Swords, Home, Scroll, Crown, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { ImperialButton } from './ImperialButton';

// Links visible to everyone
const publicLinks = [
  { href: '/', label: 'Hall', labelAr: 'الرئيسية', icon: Home },
  { href: '/assessment', label: 'Trials', labelAr: 'الاختبارات', icon: Swords },
  { href: '/terms', label: 'Terms', labelAr: 'الشروط', icon: Scroll },
  { href: '/ip-ownership', label: 'IP', labelAr: 'الملكية', icon: Crown },
];

// Links only visible when logged in
const authLinks = [
  { href: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: Shield },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session;
  const [isGuest, setIsGuest] = useState(false);

  // Check guest mode on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsGuest(sessionStorage.getItem('empire-guest-mode') === 'true');
    }
  }, []);

  const navLinks = (isLoggedIn || isGuest) ? [...publicLinks.slice(0, 1), ...(isLoggedIn ? authLinks : []), ...publicLinks.slice(1)] : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.9)] backdrop-blur-md border-b border-[rgba(201,168,76,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Empire English Community"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#c9a84c] text-sm tracking-wider group-hover:text-[#e8d48b] transition-colors">
              MACAL EMPIRE | EEC
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-[#8b7355] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-heading)] text-sm tracking-wide group"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                <span className="font-arabic text-[10px] text-[#8b7355]/60 group-hover:text-[#c9a84c]/60" dir="rtl">{link.labelAr}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons — changes based on login state */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">
                  {session.user?.name || session.user?.email?.split('@')[0] || 'Warrior'}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 text-[#8b7355] hover:text-[#e74c3c] transition-colors font-[family-name:var(--font-heading)] text-sm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : isGuest ? (
              <>
                <span className="text-[#8b7355] text-xs font-[family-name:var(--font-heading)]">Guest</span>
                <Link href="/register">
                  <ImperialButton variant="primary" size="sm">Sign Up to Save</ImperialButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <ImperialButton variant="ghost" size="sm">Enter</ImperialButton>
                </Link>
                <Link href="/register">
                  <ImperialButton variant="primary" size="sm">Join the Empire</ImperialButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#c9a84c]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(10,10,10,0.95)] border-b border-[rgba(201,168,76,0.15)]"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-[#8b7355] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-heading)]"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <span className="font-arabic text-xs text-[#8b7355]/60 mr-auto" dir="rtl">{link.labelAr}</span>
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                    className="flex items-center gap-2 text-[#8b7355] hover:text-[#e74c3c] transition-colors font-[family-name:var(--font-heading)]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                      <ImperialButton variant="ghost" size="sm" className="w-full">Enter</ImperialButton>
                    </Link>
                    <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                      <ImperialButton variant="primary" size="sm" className="w-full">Join</ImperialButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
