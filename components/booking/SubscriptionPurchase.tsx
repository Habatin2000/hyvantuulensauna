'use client';

import { useState } from 'react';
import { Loader2, X, Sparkles, User, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import { trackLead, trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/meta';

interface SubscriptionPurchaseProps {
  locale: 'fi' | 'en';
}

const PRODUCTS = {
  '5x': {
    id: 'ca646e7f-4a9c-4c5c-af59-b9538c49ecb3',
    price: 55,
    fi: { name: '5 x saunavuoroa', perSession: '11 € / vuoro', cta: 'Osta 5 x -kortti' },
    en: { name: '5 x sauna sessions', perSession: '11 € / session', cta: 'Buy 5 x card' },
  },
  '10x': {
    id: '74e4fe83-5aa6-46e7-8248-9b39d5451a3a',
    price: 90,
    fi: { name: '10 x saunavuoroa', perSession: '9 € / vuoro', cta: 'Osta 10 x -kortti' },
    en: { name: '10 x sauna sessions', perSession: '9 € / session', cta: 'Buy 10 x card' },
  },
};

type ProductKey = keyof typeof PRODUCTS;

export default function SubscriptionPurchase({ locale }: SubscriptionPurchaseProps) {
  const isEn = locale === 'en';
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProductKey>('10x');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const texts = {
    title: isEn ? 'Sauna cards' : 'Sarjakortit',
    subtitle: isEn ? 'Save when you visit more often' : 'Säästä käydessäsi useammin',
    modalTitle: isEn ? 'Buy a sauna card' : 'Osta sarjakortti',
    modalDescription: isEn
      ? 'Choose a card and fill in your details. You will be redirected to a secure Stripe checkout.'
      : 'Valitse kortti ja täytä yhteystietosi. Sinut ohjataan turvalliseen Stripe-maksuun.',
    hintTitle: isEn ? 'Important' : 'Tärkeää',
    hint: isEn
      ? 'Use the same email address for the purchase as you do for booking. From now on, your email address will be your username!'
      : 'Käytä ostoa tehdessäsi samaa sähköpostiosoitetta kuin varatessasi. Jatkossa sähköpostiosoitteesi toimii käyttäjätunnuksenasi!',
    firstName: isEn ? 'First name' : 'Etunimi',
    lastName: isEn ? 'Last name' : 'Sukunimi',
    email: isEn ? 'Email' : 'Sähköposti',
    phone: isEn ? 'Phone number' : 'Puhelinnumero',
    required: isEn ? 'Required' : 'Pakollinen',
    invalidEmail: isEn ? 'Please check the email address' : 'Tarkista sähköpostiosoite',
    submit: isEn ? 'Continue to payment' : 'Jatka maksuun',
    submitting: isEn ? 'Redirecting…' : 'Ohjataan maksuun…',
    close: isEn ? 'Close' : 'Sulje',
    errorGeneric: isEn
      ? 'Could not start the purchase. Please try again.'
      : 'Oston aloittaminen epäonnistui. Yritä uudelleen.',
    errorNoPaymentUrl: isEn
      ? 'Payment link could not be created. Please contact us.'
      : 'Maksulinkin luominen epäonnistui. Ota yhteyttä meihin.',
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = texts.required;
    if (!form.lastName.trim()) nextErrors.lastName = texts.required;
    if (!form.email.trim()) nextErrors.email = texts.required;
    else if (!isValidEmail(form.email)) nextErrors.email = texts.invalidEmail;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openModal = (key: ProductKey) => {
    setSelected(key);
    setOpen(true);
    trackLead({ content_name: 'Sauna card modal opened' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const product = PRODUCTS[selected];
    setIsSubmitting(true);
    trackBookingStarted({ value: product.price, currency: 'EUR' });
    trackInitiateCheckout({
      content_ids: [product.id],
      content_name: product[locale].name,
      currency: 'EUR',
      value: product.price,
    });
    trackAddPaymentInfo({
      content_ids: [product.id],
      content_name: product[locale].name,
      currency: 'EUR',
      value: product.price,
    });

    try {
      const res = await fetch('/api/bookla/subscription-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          subscriptionId: product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentURL) {
        throw new Error(data.error || texts.errorNoPaymentUrl);
      }

      trackBookingCompleted({
        value: product.price,
        currency: 'EUR',
        transaction_id: data.clientId || `${selected}-card-` + Date.now(),
        items: [
          {
            item_id: product.id,
            item_name: product[locale].name,
            price: product.price,
            quantity: 1,
          },
        ],
      });
      trackPurchase({
        content_ids: [product.id],
        content_name: product[locale].name,
        currency: 'EUR',
        value: product.price,
        transaction_id: data.clientId || `${selected}-card-` + Date.now(),
        num_items: 1,
      });

      window.location.href = data.paymentURL;
    } catch (err) {
      console.error('Subscription purchase failed:', err);
      setSubmitError(err instanceof Error ? err.message : texts.errorGeneric);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]';

  const ProductOption = ({ productKey }: { productKey: ProductKey }) => {
    const product = PRODUCTS[productKey];
    const labels = product[locale];
    const isSelected = selected === productKey;

    return (
      <button
        type="button"
        onClick={() => setSelected(productKey)}
        className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
          isSelected
            ? 'border-[#3b82f6] bg-[#3b82f6]/5 ring-1 ring-[#3b82f6]'
            : 'border-stone-200 bg-white hover:border-stone-300'
        }`}
      >
        {isSelected && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#3b82f6] text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
        <span className="text-sm font-medium text-stone-600">{labels.name}</span>
        <span className="mt-1 text-2xl font-extrabold text-[#3b82f6]">{product.price} €</span>
        <span className="mt-1 text-xs text-stone-500">{labels.perSession}</span>
      </button>
    );
  };

  return (
    <div>
      <Card className="overflow-hidden border-[#3b82f6]/20 bg-gradient-to-br from-[#3b82f6]/5 to-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-[#3b82f6]">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isEn ? 'Season passes' : 'Kausikortit'}
            </span>
          </div>
          <CardTitle className="text-xl font-bold text-stone-900">{texts.title}</CardTitle>
          <CardDescription className="text-stone-600">{texts.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['5x', '10x'] as ProductKey[]).map((key) => {
              const product = PRODUCTS[key];
              const labels = product[locale];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openModal(key)}
                  className="group relative flex flex-col items-start rounded-xl border border-stone-200 bg-white p-4 text-left transition-all hover:border-[#3b82f6]/50 hover:shadow-sm"
                >
                  <span className="text-sm font-medium text-stone-600">{labels.name}</span>
                  <span className="mt-1 text-2xl font-extrabold text-[#3b82f6]">{product.price} €</span>
                  <span className="mt-1 text-xs text-stone-500">{labels.perSession}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#3b82f6]">
                    {labels.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700"
              aria-label={texts.close}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-8">
              <h2 className="text-lg font-semibold text-stone-900">{texts.modalTitle}</h2>
              <p className="text-sm text-stone-600">{texts.modalDescription}</p>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ProductOption productKey="5x" />
                <ProductOption productKey="10x" />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">{texts.hintTitle}</p>
                <p className="mt-1 text-sm text-amber-800">{texts.hint}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">
                    {texts.firstName} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={inputClass}
                      placeholder={isEn ? 'John' : 'Matti'}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">
                    {texts.lastName} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={inputClass}
                      placeholder={isEn ? 'Doe' : 'Meikäläinen'}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">
                    {texts.email} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder={isEn ? 'john@example.com' : 'matti@example.com'}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">{texts.phone}</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                      placeholder="+358 40 123 4567"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="contents">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {texts.submitting}
                    </span>
                  ) : (
                    <span className="contents">
                      {texts.submit}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
