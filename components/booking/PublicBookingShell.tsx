'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Ticket,
  Check,
  Info
} from 'lucide-react';

interface PublicBookingShellProps {
  showTitle?: boolean;
}

export default function PublicBookingShell({ showTitle = true }: PublicBookingShellProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState<'adult' | 'child'>('adult');

  // Mock sessions data
  const sessions = [
    { 
      id: 'tue-18', 
      day: 'Tiistai', 
      date: '15.7.', 
      time: '18:00-21:00',
      available: 8,
      price: 25 
    },
    { 
      id: 'thu-18', 
      day: 'Torstai', 
      date: '17.7.', 
      time: '18:00-21:00',
      available: 12,
      price: 25 
    },
    { 
      id: 'sat-14', 
      day: 'Lauantai', 
      date: '19.7.', 
      time: '14:00-17:00',
      available: 5,
      price: 25,
      theme: 'Löylykilpailu'
    },
  ];

  const selectedSessionData = sessions.find(s => s.id === selectedSession);
  const totalPrice = selectedSessionData ? selectedSessionData.price * ticketCount : 0;

  return (
    <div className="mx-auto max-w-4xl">
      {showTitle && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900">Varaa paikka julkiselta vuorolta</h2>
          <p className="mt-2 text-stone-600">
            Valitse sopiva vuoro ja osta liput etukäteen
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Type Selection */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900">Lipputyyppi</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setTicketType('adult')}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                  ticketType === 'adult' 
                    ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    ticketType === 'adult' ? 'bg-[#3b82f6] text-white' : 'bg-stone-100'
                  }`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Aikuinen</p>
                    <p className="text-xs text-stone-500">Yli 16-vuotias</p>
                  </div>
                </div>
                <p className="font-semibold">25€</p>
              </button>

              <button
                onClick={() => setTicketType('child')}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                  ticketType === 'child' 
                    ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    ticketType === 'child' ? 'bg-[#3b82f6] text-white' : 'bg-stone-100'
                  }`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Lapsi</p>
                    <p className="text-xs text-stone-500">7-15 vuotta</p>
                  </div>
                </div>
                <p className="font-semibold">15€</p>
              </button>
            </div>
          </div>

          {/* Session Selection */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-stone-900">Saatavilla olevat vuorot</h3>
            <div className="space-y-3">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedSession === session.id 
                      ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-900">
                          {session.day} {session.date}
                        </p>
                        {session.theme && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            {session.theme}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className={`font-medium ${
                          session.available < 6 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {session.available}
                        </span>
                        <span className="text-stone-500"> paikkaa jäljellä</span>
                      </p>
                      {session.available < 6 && (
                        <p className="text-xs text-amber-600">Vain muutama jäljellä!</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Count */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900">Lippujen määrä</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 text-xl text-stone-600 hover:bg-stone-50"
              >
                -
              </button>
              <div className="text-center">
                <p className="text-2xl font-bold">{ticketCount}</p>
                <p className="text-xs text-stone-500">
                  {ticketCount === 1 ? 'lippu' : 'lippua'}
                </p>
              </div>
              <button 
                onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 text-xl text-stone-600 hover:bg-stone-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-[#3b82f6]/5 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 shrink-0 text-[#3b82f6]" />
              <div>
                <p className="font-medium text-stone-900">Mitä mukaan?</p>
                <p className="mt-1 text-sm text-stone-600">
                  Tarjoamme pyyhkeet ja saunajuomat. Ota mukaan uimapuku ja vaihtovaatteet. 
                  Halutessasi voit tuoda omia juomia ja pikkupurtavaa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24 border-stone-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-stone-900">Yhteenveto</h3>
              
              {selectedSessionData ? (
                <>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#3b82f6]" />
                    <div>
                      <p className="text-sm text-stone-500">Päivämäärä</p>
                      <p className="font-medium">{selectedSessionData.day} {selectedSessionData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#3b82f6]" />
                    <div>
                      <p className="text-sm text-stone-500">Aika</p>
                      <p className="font-medium">{selectedSessionData.time}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500">Valitse vuoro jatkaaksesi</p>
              )}

              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-[#3b82f6]" />
                <div>
                  <p className="text-sm text-stone-500">Liput</p>
                  <p className="font-medium">{ticketCount}x {ticketType === 'adult' ? 'Aikuinen' : 'Lapsi'}</p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between items-baseline">
                  <p className="text-stone-600">Yhteensä</p>
                  <p className="text-2xl font-bold">{totalPrice}€</p>
                </div>
                <p className="text-xs text-stone-500">Sis. alv 25%</p>
              </div>

              <Button 
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                disabled={!selectedSession}
              >
                {selectedSession ? 'Siirry maksamaan' : 'Valitse vuoro'}
              </Button>

              <p className="text-xs text-center text-stone-500">
                Maksu tapahtuu turvallisesti verkkomaksuna
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
