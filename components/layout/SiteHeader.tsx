'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mainNavigation } from '@/content/navigation';
import MobileNav from './MobileNav';

export default function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-padding mx-auto flex h-16 max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo.png"
                alt="Hyvän Tuulen Sauna"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-pacifico text-lg text-[#3b82f6] hidden sm:block">
              Hyvän Tuulen Sauna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-[#3b82f6]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link href="tel:+358401234567" className="hidden sm:flex" aria-label="Soita meille">
              <Button variant="ghost" size="icon" className="text-stone-600 hover:text-[#3b82f6]">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/saunalauttaristeilyt-helsingissa#varaus" className="hidden sm:block">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                Varaa risteily
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Avaa valikko"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
