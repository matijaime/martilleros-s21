'use client';

import { ChevronRight, Clock, ShieldAlert, Calendar, BookOpen, Cloud, FolderOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { subjects } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')" }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Universidad Siglo 21</span>
          </div>

          <h1 className="section-title text-5xl md:text-7xl mb-6 text-shadow-gold">
            Academic <span className="gold-gradient">Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2 font-light">Martillero Público y Corredor Inmobiliario</p>
          <p className="text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">
            Tu centro de recursos académicos: materiales de estudio, fechas importantes y todo lo que necesitás para sobresalir en tu carrera.
          </p>

          <div className="flex justify-center mt-10">
            <a href="#materias" className="btn-gold text-base px-10 py-3.5">
              Ver Materias <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── Materias ────────────────────────────────────── */}
      <section id="materias" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-12 h-px gold-divider mb-4 mx-auto" />
            <h2 className="section-title mb-4">Materias del Período</h2>
            <p className="section-subtitle max-w-lg mx-auto">Cuatro materias distribuidas en dos bloques académicos durante el ciclo lectivo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects?.map((subject, idx) => {
              const Icon = subject.icon;
              return (
                <Link
                  key={idx}
                  href={`/materia/${subject.slug}`}
                  className={`glass card-hover rounded-2xl p-7 bg-gradient-to-br ${subject.color} border ${subject.accent} text-left w-full group transition-all hover:scale-[1.02] cursor-pointer block`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 min-w-[3rem] rounded-xl glass-gold flex items-center justify-center">
                      <Icon size={24} className="text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm tracking-wide">{String(subject.title)}</h3>
                        <span className="flex-shrink-0 text-xs text-gold border border-gold/30 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Ver recursos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3 h-3 text-gold" />
                        <span className="text-gold text-xs font-medium">{String(subject.dates)}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{String(subject.description)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Biblioteca Virtual ────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass rounded-2xl border border-gold/20 overflow-hidden bg-gradient-to-r from-gold/8 via-transparent to-blue-500/5">
            {/* Glow FX */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center flex-shrink-0">
                <Cloud className="w-8 h-8 text-gold" />
              </div>

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  <span className="text-gold text-xs font-semibold uppercase tracking-widest">Nuevo</span>
                </div>
                <h2 className="text-white font-bold text-xl md:text-2xl mb-1">Biblioteca Virtual</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                  Accedé a toda la nube de apuntes, resúmenes, TPs y bibliografía organizada por materia. Más de 100 archivos listos para estudiar.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="https://drive.google.com/drive/folders/1YIFMARdYRsU5mHfeDN3NB4jw9jGHzdCa"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/25 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  <FolderOpen className="w-4 h-4" />
                  Abrir Drive
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <Link
                  href="/biblioteca"
                  className="flex items-center gap-2 btn-gold text-sm px-5 py-2.5"
                >
                  Ver Biblioteca
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Links to Sections ────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="gold-divider w-full opacity-30 mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/guia"
              className="glass card-hover rounded-2xl p-6 border border-white/5 group text-center transition-all hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={24} className="text-gold" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Guía de Supervivencia</h3>
              <p className="text-slate-500 text-xs">Todo lo que necesitás saber antes de rendir</p>
              <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver guía <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/fechas"
              className="glass card-hover rounded-2xl p-6 border border-white/5 group text-center transition-all hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-gold" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Próximas Fechas</h3>
              <p className="text-slate-500 text-xs">Calendario sincronizado con Canvas</p>
              <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver fechas <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/recursos"
              className="glass card-hover rounded-2xl p-6 border border-white/5 group text-center transition-all hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-gold" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Recursos de Estudio</h3>
              <p className="text-slate-500 text-xs">PDFs, videos y materiales de apoyo</p>
              <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver recursos <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
