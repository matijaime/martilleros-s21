'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert, ChevronDown, AlertTriangle, MessageCircle, Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { supabase } from '@/lib/supabaseClient';
import {
  DbSurvivalTip, FALLBACK_TIPS, ICON_MAP, WA_COMMUNITY,
} from '@/lib/constants';

export default function GuiaPage() {
  const [survivaltips, setSurvivalTips] = useState<DbSurvivalTip[]>([]);
  const [loadingTips, setLoadingTips]   = useState(true);
  const [openTipId, setOpenTipId]       = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('survival_tips')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setSurvivalTips(data as DbSurvivalTip[]);
          const first = (data as DbSurvivalTip[]).find(t => t.is_emergency) ?? data[0];
          setOpenTipId(String(first.id));
        } else {
          setSurvivalTips(FALLBACK_TIPS);
          setOpenTipId('examenes');
        }
      } catch {
        setSurvivalTips(FALLBACK_TIPS);
        setOpenTipId('examenes');
      } finally {
        setLoadingTips(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-gold px-4 py-1.5 rounded-full mb-4">
              <ShieldAlert className="w-4 h-4 text-gold" />
              <span className="text-gold text-xs font-semibold tracking-widest uppercase">Kit de Supervivencia</span>
            </div>
            <h1 className="section-title text-4xl md:text-5xl mb-3">Guía de Supervivencia</h1>
            <p className="section-subtitle max-w-md mx-auto">Todo lo que nadie te explica al arrancar. Leé esto antes de rendir.</p>
          </div>

          <div className="space-y-3">
            {loadingTips
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                ))
              : survivaltips?.map(tip => {
                  const Icon = ICON_MAP[tip.icon_name] ?? ShieldAlert;
                  const isOpen = openTipId === tip.id;

                  return (
                    <div
                      key={tip.id}
                      className={`glass rounded-2xl border border-white/5 border-l-4 ${tip.border_color} overflow-hidden transition-all duration-300 ${tip.is_emergency ? 'ring-1 ring-gold/20' : ''}`}
                    >
                      <button
                        onClick={() => setOpenTipId(isOpen ? null : tip.id)}
                        className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg glass flex items-center justify-center ${tip.icon_color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <span className="text-white font-semibold text-sm">{String(tip.title)}</span>
                          {tip.badge && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${tip.is_emergency ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-gold/10 text-gold border-gold/30'}`}>
                              {String(tip.badge)}
                            </span>
                          )}
                          {tip.is_emergency && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-4">
                          {Array.isArray(tip.paragraphs) && tip.paragraphs.map((p, i) => (
                            <p key={i} className="text-slate-300 text-sm leading-relaxed">
                              {p.label && <span className="text-white font-semibold">{String(p.label)}: </span>}
                              {String(p.text)}
                              {p.link && (
                                <> <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{String(p.link.label)} ↗</a></>
                              )}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>

          <div className="mt-8 glass-gold rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />
              <p className="text-sm text-slate-300">¿Todavía tenés dudas? Preguntá en el grupo de compañeros.</p>
            </div>
            <a href={WA_COMMUNITY} target="_blank" rel="noopener noreferrer" className="btn-gold whitespace-nowrap text-xs py-2.5">
              <Users className="w-4 h-4" />
              Ir al grupo de WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
