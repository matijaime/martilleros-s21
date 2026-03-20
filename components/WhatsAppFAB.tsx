'use client';

import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '5492284470305';
const MESSAGE = encodeURIComponent('Hola! Tengo una consulta sobre los materiales de estudio.');

export default function WhatsAppFAB() {
  return (
    <a
      id="whatsapp-fab"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />

      {/* Button */}
      <div className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-green-500/50">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-navy-800 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none border border-white/10">
        Consultar por WhatsApp
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-2 h-2 bg-navy-800 border-r border-t border-white/10 rotate-45" />
      </div>
    </a>
  );
}
