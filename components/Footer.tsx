'use client';

import { MessageCircle } from 'lucide-react';
import { WA_COMMUNITY, WA_PERSONAL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="glass-dark border-t border-white/5 py-10 px-6 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Academic Hub Logo" className="h-8 w-auto mr-1" />
            <span className="text-white font-semibold text-sm">Academic Hub</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={WA_COMMUNITY}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-500 hover:text-green-400 text-sm font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Grupo de WhatsApp
            </a>
            <a
              href={WA_PERSONAL}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-gold text-sm font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Contacto con Matias Jaime
            </a>
          </div>
        </div>

        <div className="gold-divider opacity-10 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-600 text-xs leading-relaxed">
            Martillero Público y Corredor Inmobiliario<br/>
            Universidad Siglo 21 · © {new Date().getFullYear()}
          </p>
          <p className="text-slate-500 text-xs">
            Plataforma creada por{' '}
            <a href={WA_PERSONAL} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline font-medium">
              Matias Jaime
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
