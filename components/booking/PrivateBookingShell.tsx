'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Check,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

interface PrivateBookingShellProps {
  showTitle?: boolean;
}

export default function PrivateBookingShell({ showTitle = true }: PrivateBookingShellProps) {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(8);
  const [extras, setExtras] = useState<string[]>([]);

  const products = [
    { 
      id: 'private-aalto', 
      name: 'Yksityinen saunavuoro Aallossa',
      boat: 'Aalto',
      duration: '2 tuntia',
      capacity: '8-20 hlö',
      price: 800,
      popular: true
    },
    { 
      id: 'private-virta', 
      name: 'Yksityinen saunavuoro Virrassa',
      boat: 'Virta',
      duration: '2 tuntia',
      capacity: '4-10 hlö',
      price: 580,
    },
    { 
      id: 'private-extended', 
      name: 'Koko päivän saunaelämys',
      boat: 'Aalto',
      duration: '8 tuntia',
      capacity: '8-20 hlö',
      price: 2500,
      description: 'Sisältää ruokailun ja aktiviteetteja'
    },
  ];

  const extraOptions = [
    { id: 'catering', name: 'Catering-palvelu', price: 35, unit: 'henkilö' },
    { id: 'drinks', name: 'Tervetulojuomat', price: 15, unit: 'henkilö' },
    { id: 'towels', name: 'Premium-pyyhkeet', price: 10, unit: 'henkilö' },
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);
  
  const extrasTotal = extras.reduce((sum, extraId) => {
    const extra = extraOptions.find(e => e.id === extraId);
    return sum + (extra ? extra.price * groupSize : 0);
  }, 0);

  const totalPrice = (selectedProductData?.price || 0) + extrasTotal;

  const toggleExtra = (extraId: string) => {
    setExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(e => e !== extraId)
        : [...prev, extraId]
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      {showTitle && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900">Varaa yksityissauna</h2>
          <p className="mt-2 text-stone-600">
            Valitse sopiva paketti ryhmällesi
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Valitse paketti', 'Ryhmän koko', 'Lisäpalvelut', 'Varaa'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step > index + 1 
                  ? 'bg-[#3b82f6] text-white' 
                  : step === index + 1 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'bg-stone-200 text-stone-500'
              }`}>
                {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="ml-2 hidden text-sm font-medium sm:block">
                {label}
              </span>
              {index < 3 && <ChevronRight className="mx-2 h-4 w-4 text-stone-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-900">Valitse paketti</h3>
              <div className="space-y-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedProduct === product.id 
                        ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-stone-900">{product.name}</p>
                          {product.popular && (
                            <Badge className="bg-amber-500 text-white">Suosituin</Badge>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-stone-600">
                          <span className="rounded-full bg-stone-100 px-2 py-0.5">
                            {product.boat}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5">
                            {product.duration}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5">
                            {product.capacity}
                          </span>
                        </div>
                        {product.description && (
                          <p className="mt-2 text-sm text-stone-500">{product.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#3b82f6]">{product.price}€</p>
                        <p className="text-xs text-stone-500">/paketti</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Group Size */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-stone-900">Ryhmän koko</h3>
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#3b82f6]" />
                      <span className="text-stone-700">Osallistujien määrä</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGroupSize(Math.max(4, groupSize - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{groupSize}</span>
                      <button 
                        onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#3b82f6]/5 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 shrink-0 text-[#3b82f6]" />
                  <div>
                    <p className="font-medium text-stone-900">Vinkki</p>
                    <p className="mt-1 text-sm text-stone-600">
                      Suosittelemme varaamaan hieman isomman tilan kuin osallistujien määrä, 
                      jotta kaikille jää mukavasti tilaa saunoa ja viettää aikaa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Extras */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-stone-900">Lisäpalvelut</h3>
                <div className="space-y-3">
                  {extraOptions.map((extra) => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        extras.includes(extra.id)
                          ? 'border-[#3b82f6] bg-[#3b82f6]/5'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            extras.includes(extra.id) ? 'bg-[#3b82f6] text-white' : 'bg-stone-100'
                          }`}>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">{extra.name}</p>
                            <p className="text-sm text-stone-500">
                              +{extra.price}€/{extra.unit}
                            </p>
                          </div>
                        </div>
                        {extras.includes(extra.id) && (
                          <Check className="h-5 w-5 text-[#3b82f6]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  Haluatko räätälöidä tilaisuuden? Ota yhteyttä niin suunnitellaan 
                  yhdessä täydellinen paketti yrityksellenne tai ryhmällenne.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Summary & Date Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse päivämäärä ja aika</h3>
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <div className="flex items-center gap-3 text-stone-600">
                    <Calendar className="h-5 w-5 text-[#3b82f6]" />
                    <span>Kalenteri tähän (placeholder)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-stone-900">Yhteenveto</h3>
                <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Paketti</span>
                    <span className="font-medium">{selectedProductData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Ryhmän koko</span>
                    <span className="font-medium">{groupSize} henkilöä</span>
                  </div>
                  {extras.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-600">Lisäpalvelut</span>
                      <span className="font-medium">{extras.length} valittu</span>
                    </div>
                  )}
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Yhteensä</span>
                      <span>{totalPrice}€</span>
                    </div>
                    <p className="text-xs text-stone-500">Alv 25% sisältyy hintaan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Takaisin
              </Button>
            )}
            <div className="ml-auto">
              {step < 4 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                >
                  Jatka
                </Button>
              ) : (
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  Lähetä varauskysely
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Card className="sticky top-24 border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg">Varauksen tiedot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProductData && (
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Paketti</p>
                    <p className="font-medium text-sm">{selectedProductData.name}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#3b82f6]" />
                <div>
                  <p className="text-sm text-stone-500">Ryhmän koko</p>
                  <p className="font-medium">{groupSize} henkilöä</p>
                </div>
              </div>

              {extras.length > 0 && (
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Lisäpalvelut</p>
                    <p className="font-medium">{extras.length} valittu</p>
                  </div>
                </div>
              )}

              <div className="border-t border-stone-200 pt-4">
                <p className="text-sm text-stone-500">Hinta yhteensä</p>
                <p className="text-2xl font-bold">{totalPrice}€</p>
                <p className="text-xs text-stone-500">Sis. alv 25%</p>
              </div>

              <div className="rounded-lg bg-stone-50 p-3">
                <p className="text-xs text-stone-600">
                  Yksityisvaraus vaatii vahvistuksen. Saat vahvistuksen sähköpostiisi 24 tunnin sisällä.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
