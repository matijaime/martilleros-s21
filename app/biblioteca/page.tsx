'use client';

import {
  FolderOpen, BookOpen, FileText, Scale, TrendingUp, Globe,
  GraduationCap, ExternalLink, ChevronRight, Cloud, Search, Download,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';

const DRIVE_URL = 'https://drive.google.com/drive/folders/1YIFMARdYRsU5mHfeDN3NB4jw9jGHzdCa';

const driveCategories = [
  {
    name: 'Administración',
    icon: FolderOpen,
    color: 'from-gold/20 to-transparent',
    accent: 'border-gold/30',
    iconColor: 'text-gold',
    items: ['Gestión', 'Contenidos', 'Apuntes'],
  },
  {
    name: 'Contabilidad',
    icon: FileText,
    color: 'from-emerald-500/10 to-transparent',
    accent: 'border-emerald-400/30',
    iconColor: 'text-emerald-400',
    items: ['Libros', 'Ejercicios', 'Resúmenes'],
  },
  {
    name: 'Derecho Privado Civil',
    icon: Scale,
    color: 'from-blue-500/10 to-transparent',
    accent: 'border-blue-400/30',
    iconColor: 'text-blue-400',
    items: ['Código Civil', 'Contratos', 'Obligaciones'],
  },
  {
    name: 'Derecho Público',
    icon: Scale,
    color: 'from-cyan-500/10 to-transparent',
    accent: 'border-cyan-400/30',
    iconColor: 'text-cyan-400',
    items: ['Constitución', 'Administrativo', 'Penal'],
  },
  {
    name: 'Marketing I',
    icon: TrendingUp,
    color: 'from-orange-500/10 to-transparent',
    accent: 'border-orange-400/30',
    iconColor: 'text-orange-400',
    items: ['Estrategias', 'Consumidor', 'Comercial'],
  },
  {
    name: 'Tecnología & Humanidades',
    icon: Globe,
    color: 'from-purple-500/10 to-transparent',
    accent: 'border-purple-400/30',
    iconColor: 'text-purple-400',
    items: ['Globalización', 'Modelos', 'Tecnología'],
  },
  {
    name: 'Aprender en el Siglo 21',
    icon: GraduationCap,
    color: 'from-pink-500/10 to-transparent',
    accent: 'border-pink-400/30',
    iconColor: 'text-pink-400',
    items: ['Herramientas', 'Estrategias', 'Digital'],
  },
  {
    name: 'Sistemas / Recursos',
    icon: BookOpen,
    color: 'from-slate-500/10 to-transparent',
    accent: 'border-slate-400/30',
    iconColor: 'text-slate-400',
    items: ['Plataformas', 'Guías', 'Recursos'],
  },
];

const stats = [
  { value: '20+', label: 'Carpetas organizadas' },
  { value: '100+', label: 'Archivos disponibles' },
  { value: '8', label: 'Materias cubiertas' },
  { value: '24/7', label: 'Acceso libre' },
];

export default function BibliotecaPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Cloud className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Google Drive</span>
          </div>

          <h1 className="section-title text-4xl md:text-6xl mb-4">
            Biblioteca <span className="gold-gradient">Virtual</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
            Accedé a toda la nube de materiales de estudio: apuntes, resúmenes, TPs, bibliografía y más, organizados por materia.
          </p>

          {/* CTA Button */}
          <a
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="open-drive-btn"
            className="btn-gold text-base px-10 py-3.5 inline-flex items-center gap-2"
          >
            <FolderOpen className="w-5 h-5" />
            Abrir en Google Drive
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-center border border-white/5">
                <p className="text-3xl font-bold gold-gradient mb-1">{s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Grid ─────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-8 h-px gold-divider mb-4 mx-auto" />
            <h2 className="section-title text-2xl md:text-3xl mb-2">Contenido por Materia</h2>
            <p className="section-subtitle text-sm">Todo organizado y listo para estudiar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {driveCategories.map((cat, i) => {
              const CatIcon = cat.icon;
              return (
                <a
                  key={i}
                  href={DRIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass card-hover rounded-2xl p-5 bg-gradient-to-br ${cat.color} border ${cat.accent} group flex items-start gap-4 transition-all hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CatIcon size={20} className={cat.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-gold transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item, j) => (
                        <span
                          key={j}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/8"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Info Banner ─────────────────────────────────── */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 border border-gold/15 bg-gradient-to-br from-gold/5 to-transparent flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center flex-shrink-0">
              <Download className="w-8 h-8 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">¿No encontrás lo que buscás?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                También podés subir tus propios apuntes al Drive compartido o pedirme que añada algún material específico. La biblioteca la construimos entre todos.
              </p>
            </div>
            <a
              href={DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-sm px-6 py-2.5 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              Explorar Drive
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
