'use client';

import Link from 'next/link';
import { CurrencySelector } from './CurrencySelector';
import { DateDisplay } from './DateDisplay';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-emerald-700">ZakahNisab</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/calculator" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
            Calculator
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
            Learn
          </Link>
          <Link href="/methodology" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
            Methodology
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <DateDisplay />
          <CurrencySelector />
        </div>
      </div>
    </header>
  );
}
