import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import VibeBookingFrame from './VibeBookingFrame';
import VibeFaq from './VibeFaq';
import VibeClosingSummary from './VibeClosingSummary';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import '../../app/vibe/julkinen-sauna.css';

export default function VibeJulkinenSaunaContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const isEn = locale === 'en';
  const sessionPrices = data.prices?.slice(0, 2) ?? [];
  const admission = sessionPrices[0];
  const visitSteps = data.timeline ?? [];
  const bookingHref = '#varaus';

  const copy = {
    heroNote: isEn ? 'Alone, together or with friends' : 'Yksin, kaksin tai kaveriporukalla',
    heroLocation: isEn ? 'Puotila · Helsinki · By the sea' : 'Puotila · Helsinki · Meren äärellä',
    explore: isEn ? 'See what is included' : 'Katso, mitä vuoroon kuuluu',
    session: isEn ? 'per session' : 'yksi vuoro',
    photoCaption: isEn ? 'Hot stoves, two hours without rushing' : 'Kuumat kiukaat, kaksi tuntia ilman hoppua',
    pricing: isEn ? 'Simple pricing' : 'Selkeä hinnoittelu',
    pricingIntro: isEn
      ? 'Book one visit or get a punch card and come more often!'
      : 'Varaa kerta tai ota sarjakortti ja tule useammin!',
    earlyBird: isEn ? 'Punch cards' : 'Sarjakortit',
    passTitle: isEn ? 'More reasons to return.' : 'Lisää syitä palata lauteille.',
    passText: isEn
      ? 'Choose five or ten visits and make sauna a regular habit.'
      : 'Valitse viisi tai kymmenen käyntiä ja tee saunomisesta tapa.',
    punchCard: isEn ? 'punch card' : 'sarjakortti',
    regular: isEn ? 'Regular price' : 'Normaalihinta',
    firstVisit: isEn ? 'Your first visit' : 'Ensimmäinen kertasi',
    finalEyebrow: isEn ? 'The saunas are hot' : 'Saunat on kuumana',
    finalTitle: isEn ? 'See you at the löyly.' : 'Nähdään löylyissä.',
    back: isEn ? 'Back to all experiences' : 'Takaisin kaikkiin elämyksiin',
  };

  const punchCards = [
    { count: '5×', regular: '55 €' },
    { count: '10×', regular: '90 €' },
  ];

  const faqItems = isEn ? [
    { question: 'When are public sessions available?', answer: 'Public sessions run throughout the week. See the booking calendar for available times.' },
    { question: 'What should I bring?', answer: 'Bring a towel, swimwear and a water bottle. Weather-appropriate clothing and sandals are useful too.' },
    { question: 'Can I come for my first time?', answer: 'Yes. We guide first-timers through winter swimming, and you can also simply enjoy the sauna.' },
    { question: 'How much does a session cost?', answer: 'A public session costs 15 € / 2 h. Students, pensioners and children under 15 pay 12.50 € / 2 h.' },
    { question: 'Are changing rooms and toilets available?', answer: 'Yes. You also have access to the terrace during your session.' },
  ] : [
    { question: 'Milloin yleisiä vuoroja on?', answer: 'Yleisiä vuoroja järjestetään läpi viikon. Näet vapaat ajat varauskalenterista.' },
    { question: 'Mitä otan mukaan?', answer: 'Pyyhe, uimapuku ja juomapullo riittävät. Ota myös sään mukainen vaatetus ja tarvittaessa sandaalit.' },
    { question: 'Voinko tulla ensimmäistä kertaa?', answer: 'Kyllä. Opastamme ensikertalaisia talviuinnin pariin, ja voit myös vain saunoa.' },
    { question: 'Mitä vuoro maksaa?', answer: 'Yleinen vuoro maksaa 15 € / 2 h. Opiskelijat, eläkeläiset ja alle 15-vuotiaat saunovat hintaan 12,50 € / 2 h.' },
    { question: 'Onko käytössä pukuhuone ja WC?', answer: 'Kyllä. Myös terassi on käytössäsi vuoron ajan.' },
  ];

  return (
    <main id="main-content" className="vibe-julkinen-sauna-page">
      <section className="vibe-julkinen-sauna-hero" aria-labelledby="vibe-julkinen-sauna-title">
        <VibeHeroBackdrop />
        <div className="vibe-julkinen-sauna-hero-copy">
          <p className="vibe-julkinen-sauna-eyebrow">{data.eyebrow}</p>
          <h1 id="vibe-julkinen-sauna-title">{data.heroTitle}</h1>
          <p className="vibe-julkinen-sauna-hero-note">{copy.heroNote}</p>
          <p className="vibe-julkinen-sauna-hero-text">{data.heroText}</p>
          <div className="vibe-julkinen-sauna-hero-actions">
            <Link className="vibe-julkinen-sauna-book" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link className="vibe-julkinen-sauna-explore" href="#sisalto">
              {copy.explore}<ArrowDown size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="vibe-julkinen-sauna-location">{copy.heroLocation}</p>
        </div>

        <div className="vibe-julkinen-sauna-hero-visual">
          <div className="vibe-julkinen-sauna-hero-photo">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </div>
          <span className="vibe-julkinen-sauna-vertical-note" aria-hidden="true">
            {isEn ? 'FIRE · SEA · EVERYONE' : 'TULI · MERI · KAIKKI'}
          </span>
          {admission && (
            <div className="vibe-julkinen-sauna-admission">
              <span>{admission.label}</span>
              <strong>{admission.price}</strong>
              <small>{isEn ? 'Sauna, ice hole and guidance included' : 'Sauna, avanto ja ohjaus sisältyvät'}</small>
            </div>
          )}
        </div>
      </section>

      <section id="sisalto" className="vibe-julkinen-sauna-included" aria-labelledby="vibe-julkinen-sauna-included-title">
        <div className="vibe-julkinen-sauna-section-heading">
          <div>
            <p className="vibe-julkinen-sauna-eyebrow">{data.detailEyebrow}</p>
            <h2 id="vibe-julkinen-sauna-included-title">{data.detailTitle}</h2>
          </div>
          <p>{data.detailText}</p>
        </div>

        <div className="vibe-julkinen-sauna-included-layout">
          <figure className="vibe-julkinen-sauna-included-figure">
            <div className="vibe-julkinen-sauna-included-photo">
              <Image
                src="/images/gallery-sauna-interior.webp"
                alt={isEn ? 'Inside a warm wood-fired sauna' : 'Lämpimän puusaunan sisätila'}
                fill
                sizes="(max-width: 760px) 100vw, 38vw"
              />
            </div>
            <div className="vibe-julkinen-sauna-time-stamp" aria-label={isEn ? 'Two hours per session' : 'Kaksi tuntia yhdellä vuorolla'}>
              <strong>2 h</strong>
              <span>{copy.session}</span>
            </div>
            <figcaption>{copy.photoCaption}</figcaption>
          </figure>

          <ol className="vibe-julkinen-sauna-included-list">
            {data.features.map((feature) => (
              <li key={feature.number}>
                <span>{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="vibe-julkinen-sauna-pricing" aria-labelledby="vibe-julkinen-sauna-pricing-title">
        <div className="vibe-julkinen-sauna-pricing-inner">
          <div className="vibe-julkinen-sauna-pricing-heading">
            <div>
              <p className="vibe-julkinen-sauna-eyebrow">{copy.pricing}</p>
              <h2 id="vibe-julkinen-sauna-pricing-title">{data.priceTitle}</h2>
            </div>
            <p>{copy.pricingIntro}</p>
          </div>

          <dl className="vibe-julkinen-sauna-session-prices">
            {sessionPrices.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd className="vibe-julkinen-sauna-session-price">{row.price}</dd>
                <dd>{row.note}</dd>
              </div>
            ))}
          </dl>

          <div className="vibe-julkinen-sauna-passes">
            <div className="vibe-julkinen-sauna-passes-intro">
              <p>{copy.earlyBird}</p>
              <h3>{copy.passTitle}</h3>
              <span>{copy.passText}</span>
            </div>
            <div className="vibe-julkinen-sauna-pass-grid">
              {punchCards.map((card) => (
                <article className="vibe-julkinen-sauna-pass" key={card.count}>
                  <div className="vibe-julkinen-sauna-pass-name">
                    <span>{card.count}</span>
                    <h4>{copy.punchCard}</h4>
                  </div>
                  <dl className="vibe-julkinen-sauna-pass-prices">
                    <div>
                      <dt>{copy.regular}</dt>
                      <dd>{card.regular}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>

          {data.priceNote && <p className="vibe-julkinen-sauna-price-note">{data.priceNote}</p>}
        </div>
      </section>

      <VibeBookingFrame kind="public" locale={locale} />

      <section className="vibe-julkinen-sauna-visit" aria-labelledby="vibe-julkinen-sauna-visit-title">
        <div className="vibe-julkinen-sauna-visit-copy">
          <p className="vibe-julkinen-sauna-eyebrow">{copy.firstVisit}</p>
          <h2 id="vibe-julkinen-sauna-visit-title">{data.timelineTitle}</h2>
          <ol>
            {visitSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="vibe-julkinen-sauna-visit-photo">
          <Image
            src="/images/gallery-ice-swimming.webp"
            alt={isEn ? 'A winter swimmer climbing from the sea by the sauna raft' : 'Talviuimari nousee merestä saunalautan portaikkoa pitkin'}
            fill
            sizes="(max-width: 760px) calc(100vw - 44px), 44vw"
          />
          <p>{isEn ? 'Breathe slowly. Listen to your body.' : 'Hengitä rauhassa. Kuuntele kehoasi.'}</p>
        </div>
      </section>

      <section className="vibe-faq-section" aria-labelledby="vibe-julkinen-sauna-faq-title">
        <div className="vibe-faq-heading">
          <p className="vibe-eyebrow">{isEn ? 'Good to know' : 'Hyvä tietää'}</p>
          <h2 id="vibe-julkinen-sauna-faq-title">{isEn ? 'Questions before your session' : 'Usein kysyttyä ennen vuoroa'}</h2>
        </div>
        <VibeFaq items={faqItems} />
      </section>

      <VibeClosingSummary
        eyebrow={isEn ? 'Come as you are' : 'Tule sellaisena kuin olet'}
        title={isEn ? 'Our public sessions are a great way to enjoy your free time and discover winter swimming.' : 'Meidän Yleiset vuorot ovat loistava tapa tulla nauttimaan vapaa-ajasta ja tutustua talviuintiin.'}
        paragraphs={isEn ? [
          'Guided sessions teach first-timers how to enter the ice hole and control their breathing. It is not rocket science, but it is easier with a little encouragement! Public sessions are social occasions where you can leave your worries on the mainland.',
          'Want the whole place to yourself? Book all 17 available tickets or book a private session!',
        ] : [
          'Ohjatulla vuorolla ensikertalaisilla opastetaan avantoon meneminen ja hengityksen kontrollointi. Ei rakettitiedettä mutta tsempin kanssa helpompaa! Yleiset vuorot ovat yhteisöllisiä vuoroja, jolloin huolet voi jättää mantereen puolelle.',
          'Jos haluat koko paikan itsellesi, varaa joko kaikki vapaat liput (17kpl) tai varaa yksityinen vuoro!',
        ]}
        links={[
          { href: bookingHref, label: isEn ? 'Book all 17 places' : 'Varaa kaikki 17 paikkaa' },
          { href: isEn ? '/en/ice-swimming-sauna-helsinki/#varaus' : '/avanto/#varaus', label: isEn ? 'Book a private session' : 'Varaa yksityinen vuoro' },
        ]}
      />

      <section className="vibe-julkinen-sauna-next" aria-labelledby="vibe-julkinen-sauna-next-title">
        <p className="vibe-julkinen-sauna-eyebrow">{copy.finalEyebrow}</p>
        <h2 id="vibe-julkinen-sauna-next-title">{copy.finalTitle}</h2>
        <p className="vibe-julkinen-sauna-next-text">{data.heroText}</p>
        <Link className="vibe-julkinen-sauna-next-main" href={bookingHref}>
          <span>{data.ctaLabel}</span>
          <ArrowUpRight size={38} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <Link className="vibe-julkinen-sauna-back" href={isEn ? '/en/' : '/'}>
          {copy.back}<ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
