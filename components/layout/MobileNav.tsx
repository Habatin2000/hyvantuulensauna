'use client';

import { useEffect, useRef } from 'react';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { mainNavigation, footerNavigation } from '@/content/navigation';
import { useModalA11y } from '@/hooks/useModalA11y';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations('nav');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useModalA11y<HTMLDivElement>(open, onClose, 'nav a');

  // Hide the rest of the page from assistive tech and keyboard focus while
  // the dialog is open (the drawer is positioned fixed above it).
  useEffect(() => {
    if (!open) return;
    const wrapper = wrapperRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !parent) return;
    const siblings = Array.from(parent.children).filter((el) => el !== wrapper);
    siblings.forEach((el) => el.setAttribute('inert', ''));
    return () => siblings.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      id="mobile-nav"
      inert={!open}
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        tabIndex={-1}
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 p-4">
            <span id="mobile-nav-title" className="font-pacifico text-xl text-[#3b82f6]">Hyvän Tuulen Sauna</span>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('closeMenu')}>
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-auto py-6">
            <div className="space-y-1 px-4">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-[#3b82f6]"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 px-4">
              <Link href="/saunalauttaristeilyt-helsingissa#boats" onClick={onClose}>
                <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  {t('bookNow')}
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 border-t border-stone-200 px-4 pt-6">
              <p className="mb-4 text-sm font-semibold text-stone-500">{t('contact')}</p>
              <div className="space-y-3">
                <a 
                  href={`tel:${footerNavigation.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-stone-600"
                >
                  <Phone className="h-4 w-4 text-[#3b82f6]" />
                  {footerNavigation.contact.phone}
                </a>
                <a 
                  href={`mailto:${footerNavigation.contact.email}`}
                  className="flex items-center gap-3 text-sm text-stone-600"
                >
                  <Mail className="h-4 w-4 text-[#3b82f6]" />
                  {footerNavigation.contact.email}
                </a>
                <div className="flex items-start gap-3 text-sm text-stone-600">
                  <MapPin className="h-4 w-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  {footerNavigation.contact.address}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
