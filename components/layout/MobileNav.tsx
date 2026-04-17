'use client';

import Link from 'next/link';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mainNavigation, footerNavigation } from '@/content/navigation';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 p-4">
            <span className="font-pacifico text-xl text-[#3b82f6]">Hyvän Tuulen Sauna</span>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Sulje valikko">
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
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
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 px-4">
              <Link href="/saunalauttaristeilyt-helsingissa#varaus" onClick={onClose}>
                <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  Varaa risteily
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 border-t border-stone-200 px-4 pt-6">
              <p className="mb-4 text-sm font-semibold text-stone-500">Yhteystiedot</p>
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
