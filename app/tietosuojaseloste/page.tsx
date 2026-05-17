import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tietosuojaseloste | Hyvän Tuulen Sauna',
  description: 'Tietosuojaseloste ja evästekäytäntö',
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-padding mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 md:p-12">
          <h1 className="text-3xl font-bold text-stone-900 mb-8">Tietosuojaseloste</h1>

          <div className="space-y-6 text-stone-600">
            <section>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">1. Rekisterinpitäjä</h2>
              <p>
                Hyvän Tuulen Sauna<br />
                Kalkkihiekantori<br />
                00980 Helsinki<br />
                info@hyvantuulensauna.fi
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">2. Kerättävät tiedot</h2>
              <p>Keräämme seuraavia tietoja:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Yhteystiedot (nimi, sähköposti, puhelin)</li>
                <li>Varaustiedot (palvelu, päivämäärä, aika)</li>
                <li>Evästetiedot (anonymisoitu analytiikka)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">3. Evästeet</h2>
              <p>
                Käytämme evästeitä sivuston toimintaan, analytiikkaan ja mainontaan.
                Voit hallita evästeasetuksiasi sivuston evästebannerista.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Välttämättömät:</strong> Sivuston toiminnalle pakollisia</li>
                <li><strong>Analytiikka:</strong> Google Analytics</li>
                <li><strong>Mainonta:</strong> Google Ads, Meta Pixel</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">4. Oikeutesi</h2>
              <p>
                Sinulla on oikeus tarkastaa, oikaista ja poistaa tietojasi.
                Ota yhteyttä: info@hyvantuulensauna.fi
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
