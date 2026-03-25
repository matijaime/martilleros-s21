'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { CalendarEvent } from '@/lib/constants';

export default function FechasPage() {
  const [events, setEvents]           = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="w-8 h-px gold-divider mb-4" style={{ margin: 0 }} />
            <h1 className="section-title text-4xl md:text-5xl mb-3 mt-4">Próximas Fechas</h1>
            <p className="section-subtitle text-sm">Sincronizado con tu calendario de Canvas.</p>
            <div className="mt-6 glass-gold rounded-xl p-4 inline-flex">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="text-gold text-sm font-medium">Actualizado periódicamente</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loadingEvents
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                ))
              : !Array.isArray(events) || events.length === 0
                ? (
                  <div className="glass rounded-xl p-8 text-center">
                    <Calendar className="w-10 h-10 text-gold/40 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No hay eventos próximos disponibles.</p>
                  </div>
                )
                : events.map((event, idx) => (
                    <div key={idx} className="glass card-hover rounded-xl p-5 border border-white/5 flex items-start gap-4">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-gold font-bold text-lg leading-none">{new Date(event.start).getDate()}</div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider">
                          {new Date(event.start).toLocaleDateString('es-AR', { month: 'short' })}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-white/10 self-center" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium mb-1">{String(event.title)}</p>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-500 text-xs">{String(event.location)}</span>
                          </div>
                        )}
                        <p className="text-slate-600 text-xs mt-1">{formatDate(event.start)}</p>
                      </div>
                    </div>
                  ))
            }
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
