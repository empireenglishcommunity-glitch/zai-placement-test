'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Swords, Home, Scroll } from 'lucide-react';
import Image from 'next/image';
import { ImperialButton } from './ImperialButton';

const navLinks = [
  { href: '/', label: 'Hall', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: Shield },
  { href: '/assessment', label: 'Trials', icon: Swords },
  { href: '/terms', label: 'Terms', icon: Scroll },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#c9a84c] text-lg tracking-wider group-hover:text-[#e8d48b] transition-colors">
              EMPIRE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-[#8b7355] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-heading)] text-sm tracking-wide"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <ImperialButton variant="ghost" size="sm">Enter</ImperialButton>
            </Link>
            <Link href="/register">
              <ImperialButton variant="primary" size="sm">Join the Empire</ImperialButton>
            </Link>
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
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <ImperialButton variant="ghost" size="sm" className="w-full">Enter</ImperialButton>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                  <ImperialButton variant="primary" size="sm" className="w-full">Join</ImperialButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
