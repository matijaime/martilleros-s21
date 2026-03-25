'use client';

import { Bell, X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { WA_COMMUNITY } from '@/lib/constants';

export default function Navbar() {
  const [alertMessage, setAlertMessage]   = useState('');
  const [alertActive, setAlertActive]     = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    supabase.from('site_alerts').select('message, active').limit(1).single()
      .then(({ data }) => {
        if (data?.active && data?.message) {
          setAlertMessage(String(data.message));
          setAlertActive(true);
        }
      });
  }, []);

  return (
    <>
      {/* Emergency Alert Banner */}
      {alertActive && !alertDismissed && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 px-4 py-2.5 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2 flex-1">
            <Bell className="w-4 h-4 text-white flex-shrink-0 animate-pulse" />
            <p className="text-white text-sm font-semibold">{alertMessage}</p>
          </div>
          <button onClick={() => setAlertDismissed(true)} className="text-white/70 hover:text-white transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav
        className="fixed left-0 right-0 z-50 glass-dark"
        style={{ top: alertActive && !alertDismissed ? '40px' : '0' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Academic Hub Logo" className="h-10 w-auto mr-1" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Academic Hub</p>
              <p className="text-gold text-xs opacity-80">Martillero · Corredor Inmobiliario</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm text-slate-400">
            <Link href="/#materias" className="hover:text-gold transition-colors">Materias</Link>
            <Link href="/guia"      className="hover:text-gold transition-colors">Guía</Link>
            <Link href="/fechas"    className="hover:text-gold transition-colors">Fechas</Link>
            <Link href="/recursos"  className="hover:text-gold transition-colors">Recursos</Link>
            <a
              href={WA_COMMUNITY}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Comunidad
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
