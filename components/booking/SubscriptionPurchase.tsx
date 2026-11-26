'use client';

import { useState } from 'react';
import { Loader2, X, Sparkles, User, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';
import { trackLead, trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/meta';

interface SubscriptionPurchaseProps {
  locale: 'fi' | 'en' | 'es' | 'fr' | 'de';
}

const PRODUCTS = {
  '5x': {
    id: 'ca646e7f-4a9c-4c5c-af59-b9538c49ecb3',
    price: 55,
    fi: { name: '5 x saunavuoroa', perSession: '11 € / vuoro', cta: 'Osta 5 x -kortti' },
    en: { name: '5 x sauna sessions', perSession: '11 € / session', cta: 'Buy 5 x card' },
    es: { name: '5 sesiones de sauna', perSession: '11 € / sesión', cta: 'Comprar bono de 5 sesiones' },
    fr: { name: '5 séances de sauna', perSession: '11 € / séance', cta: 'Acheter la carte 5 séances' },
    de: { name: '5 Saunabesuche', perSession: '11 € / Besuch', cta: '5er-Karte kaufen' },
  },
  '10x': {
    id: '74e4fe83-5aa6-46e7-8248-9b39d5451a3a',
    price: 90,
    fi: { name: '10 x saunavuoroa', perSession: '9 € / vuoro', cta: 'Osta 10 x -kortti' },
    en: { name: '10 x sauna sessions', perSession: '9 € / session', cta: 'Buy 10 x card' },
    es: { name: '10 sesiones de sauna', perSession: '9 € / sesión', cta: 'Comprar bono de 10 sesiones' },
    fr: { name: '10 séances de sauna', perSession: '9 € / séance', cta: 'Acheter la carte 10 séances' },
    de: { name: '10 Saunabesuche', perSession: '9 € / Besuch', cta: '10er-Karte kaufen' },
  },
};

const textsByLocale = {
  fi: {
    seasonPass: 'Kausikortit',
    title: 'Sarjakortit',
    subtitle: 'Yleiseen saunaan edullisemmin',
    modalTitle: 'Osta sarjakortti',
    modalDescription: 'Valitse kortti ja täytä yhteystietosi. Sinut ohjataan turvalliseen Stripe-maksuun.',
    hintTitle: 'Tärkeää',
    hint: 'Käytä ostoa tehdessäsi samaa sähköpostiosoitetta kuin varatessasi. Jatkossa sähköpostiosoitteesi toimii käyttäjätunnuksenasi!',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelinnumero',
    marketingConsent: 'Haluan saada Hyvän Tuulen Saunan tarjouksia ja uutisia sähköpostiini. Voin perua suostumuksen milloin tahansa. (Vapaaehtoinen)',
    required: 'Pakollinen',
    invalidEmail: 'Tarkista sähköpostiosoite',
    submit: 'Jatka maksuun',
    submitting: 'Ohjataan maksuun…',
    close: 'Sulje',
    errorGeneric: 'Oston aloittaminen epäonnistui. Yritä uudelleen.',
    errorNoPaymentUrl: 'Maksulinkin luominen epäonnistui. Ota yhteyttä meihin.',
    firstNamePlaceholder: 'Matti',
    lastNamePlaceholder: 'Meikäläinen',
    emailPlaceholder: 'matti@example.com',
  },
  en: {
    seasonPass: 'Season passes',
    title: 'Sauna cards',
    subtitle: 'Cheaper access to the public sauna',
    modalTitle: 'Buy a sauna card',
    modalDescription: 'Choose a card and fill in your details. You will be redirected to a secure Stripe checkout.',
    hintTitle: 'Important',
    hint: 'Use the same email address for the purchase as you do for booking. From now on, your email address will be your username!',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    marketingConsent: 'I want to receive offers and news from Hyvän Tuulen Sauna by email. I can withdraw my consent at any time. (Optional)',
    required: 'Required',
    invalidEmail: 'Please check the email address',
    submit: 'Continue to payment',
    submitting: 'Redirecting…',
    close: 'Close',
    errorGeneric: 'Could not start the purchase. Please try again.',
    errorNoPaymentUrl: 'Payment link could not be created. Please contact us.',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
    emailPlaceholder: 'john@example.com',
  },
  es: {
    seasonPass: 'Abonos',
    title: 'Bonos de sauna',
    subtitle: 'Acceso más económico a la sauna pública',
    modalTitle: 'Comprar un bono de sauna',
    modalDescription: 'Elige un bono e introduce tus datos. Te redirigiremos a una pasarela de pago segura de Stripe.',
    hintTitle: 'Importante',
    hint: 'Usa la misma dirección de correo electrónico para la compra y las reservas. A partir de ahora, tu correo electrónico será tu nombre de usuario.',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico',
    phone: 'Número de teléfono',
    marketingConsent: 'Quiero recibir ofertas y noticias de Hyvän Tuulen Sauna por correo electrónico. Puedo retirar mi consentimiento en cualquier momento. (Opcional)',
    required: 'Obligatorio',
    invalidEmail: 'Comprueba la dirección de correo electrónico',
    submit: 'Continuar al pago',
    submitting: 'Redirigiendo…',
    close: 'Cerrar',
    errorGeneric: 'No se ha podido iniciar la compra. Inténtalo de nuevo.',
    errorNoPaymentUrl: 'No se ha podido crear el enlace de pago. Ponte en contacto con nosotros.',
    firstNamePlaceholder: 'Juan',
    lastNamePlaceholder: 'García',
    emailPlaceholder: 'juan@example.com',
  },
  fr: {
    seasonPass: 'Cartes d’abonnement',
    title: 'Cartes de sauna',
    subtitle: 'Accédez plus économiquement au sauna public',
    modalTitle: 'Acheter une carte de sauna',
    modalDescription: 'Choisissez une carte et renseignez vos coordonnées. Vous serez redirigé vers le paiement sécurisé Stripe.',
    hintTitle: 'Important',
    hint: 'Utilisez la même adresse e-mail pour votre achat et vos réservations. Désormais, votre adresse e-mail servira de nom d’utilisateur !',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Numéro de téléphone',
    marketingConsent: 'Je souhaite recevoir les offres et actualités de Hyvän Tuulen Sauna par e-mail. Je peux retirer mon consentement à tout moment. (Facultatif)',
    required: 'Obligatoire',
    invalidEmail: 'Veuillez vérifier l’adresse e-mail',
    submit: 'Continuer vers le paiement',
    submitting: 'Redirection…',
    close: 'Fermer',
    errorGeneric: 'Impossible de lancer l’achat. Veuillez réessayer.',
    errorNoPaymentUrl: 'Le lien de paiement n’a pas pu être créé. Veuillez nous contacter.',
    firstNamePlaceholder: 'Jean',
    lastNamePlaceholder: 'Dupont',
    emailPlaceholder: 'jean@example.com',
  },
  de: {
    seasonPass: 'Saisonkarten',
    title: 'Saunakarten',
    subtitle: 'Günstiger Zugang zur öffentlichen Sauna',
    modalTitle: 'Saunakarte kaufen',
    modalDescription: 'Wähle eine Karte und gib deine Daten ein. Du wirst zur sicheren Stripe-Kasse weitergeleitet.',
    hintTitle: 'Wichtig',
    hint: 'Verwende für den Kauf dieselbe E-Mail-Adresse wie für deine Buchungen. Ab jetzt dient deine E-Mail-Adresse als Benutzername!',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefonnummer',
    marketingConsent: 'Ich möchte Angebote und Neuigkeiten von Hyvän Tuulen Sauna per E-Mail erhalten. Ich kann meine Einwilligung jederzeit widerrufen. (Optional)',
    required: 'Pflichtfeld',
    invalidEmail: 'Bitte überprüfe die E-Mail-Adresse',
    submit: 'Weiter zur Zahlung',
    submitting: 'Weiterleitung…',
    close: 'Schließen',
    errorGeneric: 'Der Kauf konnte nicht gestartet werden. Bitte versuche es erneut.',
    errorNoPaymentUrl: 'Der Zahlungslink konnte nicht erstellt werden. Bitte kontaktiere uns.',
    firstNamePlaceholder: 'Max',
    lastNamePlaceholder: 'Mustermann',
    emailPlaceholder: 'max@example.com',
  },
};

type ProductKey = keyof typeof PRODUCTS;

export default function SubscriptionPurchase({ locale }: SubscriptionPurchaseProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProductKey>('10x');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const texts = textsByLocale[locale];

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
          marketingConsent,
          attribution: {
            ...getAttribution(),
            itemName: product[locale].name,
            value: product.price,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentURL) {
        throw new Error(data.error || texts.errorNoPaymentUrl);
      }

      const subTxId = data.clientId || `${selected}-card-` + Date.now();
      // Always paid via Stripe: the Bookla webhook fires the GA4 purchase and
      // the Google Ads conversion once payment is confirmed (same tx id
      // dedupes if it ever fires twice). Here we only mark checkout intent.
      trackBookingStarted({ value: product.price, currency: 'EUR' });
      trackPurchase({
        content_ids: [product.id],
        content_name: product[locale].name,
        currency: 'EUR',
        value: product.price,
        transaction_id: subTxId,
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
    'w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake';

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
            ? 'border-lake bg-lake/5 ring-1 ring-lake'
            : 'border-stone-200 bg-white hover:border-stone-300'
        }`}
      >
        {isSelected && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-lake text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
        <span className="text-sm font-medium text-stone-600">{labels.name}</span>
        <span className="mt-1 text-2xl font-extrabold text-lake">{product.price} €</span>
        <span className="mt-1 text-xs text-stone-500">{labels.perSession}</span>
      </button>
    );
  };

  return (
    <div>
      <Card className="overflow-hidden border-lake/20 bg-gradient-to-br from-lake/5 to-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-lake">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {texts.seasonPass}
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
                  className="group relative flex flex-col items-start rounded-xl border border-stone-200 bg-white p-4 text-left transition-all hover:border-lake/50 hover:shadow-sm"
                >
                  <span className="text-sm font-medium text-stone-600">{labels.name}</span>
                  <span className="mt-1 text-2xl font-extrabold text-lake">{product.price} €</span>
                  <span className="mt-1 text-xs text-stone-500">{labels.perSession}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lake">
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
                      placeholder={texts.firstNamePlaceholder}
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
                      placeholder={texts.lastNamePlaceholder}
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
                      placeholder={texts.emailPlaceholder}
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

                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-lake focus:ring-lake"
                  />
                  <span className="text-xs leading-relaxed text-stone-600">{texts.marketingConsent}</span>
                </label>

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-lake text-white hover:bg-lake-deep disabled:opacity-70"
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
