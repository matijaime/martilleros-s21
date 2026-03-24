'use client';

import {
  Music, FileCheck2, ExternalLink, ArrowRight, ChevronLeft,
} from 'lucide-react';

export default function SpotifyPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Navbar mínimo ────────────────────────────────── */}
      <nav className="glass-dark border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Academic Hub Logo" className="h-9 w-auto" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Academic Hub</p>
              <p className="text-gold text-xs opacity-80">Martillero · Corredor Inmobiliario</p>
            </div>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-gold text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al inicio
          </a>
        </div>
      </nav>

      {/* ── Contenido principal ───────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-2xl">
          <div className="glass rounded-3xl border border-white/5 overflow-hidden">

            {/* Header con gradiente verde Spotify */}
            <div className="bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-transparent border-b border-white/5 p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center">
                  <Music className="w-8 h-8 text-[#1DB954]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1DB954] tracking-widest uppercase">Beneficio Estudiantil</span>
                  <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Spotify Premium <span className="text-[#1DB954]">Gratis</span>
                  </h1>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Como estudiante de la Siglo 21, podés acceder a Spotify Premium con descuento exclusivo.
                Seguí estos dos pasos simples y disfrutá de música sin anuncios mientras estudiás. 🎧
              </p>
            </div>

            {/* Pasos */}
            <div className="p-8 sm:p-10 space-y-8">

              {/* Paso 1 */}
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold font-bold text-base">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-base mb-2">Descargá tu Certificado de Alumno Regular</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    Ingresá al portal de estudiantes de la Siglo 21, dirigite a la sección de certificados y descargá el{' '}
                    <strong className="text-white">Certificado de Alumno Regular</strong> en formato PDF. Este es el documento que Spotify te va a pedir para verificar que sos estudiante.
                  </p>
                  <a
                    href="https://estudiantes.uesiglo21.edu.ar/es-AR/certificados"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-semibold px-6 py-3 rounded-xl transition-all border border-gold/20 hover:border-gold/40"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Ir al Portal de Certificados
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 ml-16" />

              {/* Paso 2 */}
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 flex items-center justify-center">
                  <span className="text-[#1DB954] font-bold text-base">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-base mb-2">Verificá tu cuenta en Spotify</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    Entrá a la página de Spotify para Estudiantes, iniciá sesión con tu cuenta y subí el PDF del certificado que descargaste en el paso anterior. Spotify verificará tu condición de alumno y activará el beneficio automáticamente.
                  </p>
                  <a
                    href="https://www.spotify.com/ar/student/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] text-sm font-semibold px-6 py-3 rounded-xl transition-all border border-[#1DB954]/20 hover:border-[#1DB954]/40"
                  >
                    <Music className="w-4 h-4" />
                    Ir a Spotify Estudiantes
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>

            {/* Tip informativo */}
            <div className="px-8 sm:px-10 pb-8 sm:pb-10">
              <div className="glass-gold rounded-xl p-4 flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400 leading-relaxed">
                  <strong className="text-gold">Tip:</strong> Si el certificado tarda en verificarse, intentá de nuevo en unas horas. El proceso suele ser automático e instantáneo.
                </p>
              </div>
            </div>
          </div>

          {/* Volver al inicio */}
          <div className="text-center mt-8">
            <a href="/" className="text-slate-500 hover:text-gold text-sm font-medium transition-colors">
              ← Volver a Academic Hub
            </a>
          </div>
        </div>
      </main>

      {/* ── Footer mínimo ────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <p className="text-slate-600 text-xs">
          Academic Hub · Universidad Siglo 21 · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
