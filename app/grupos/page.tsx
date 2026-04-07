'use client';

import { MessageCircle, Users, ExternalLink, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';

interface WaGroup {
  name: string;
  links: string[];
  badge?: string;
}

interface Semester {
  label: string;
  color: string;
  accent: string;
  iconColor: string;
  groups: WaGroup[];
}

const semesters: Semester[] = [
  {
    label: 'Materias Anuales',
    color: 'from-gold/20 to-transparent',
    accent: 'border-gold/30',
    iconColor: 'text-gold',
    groups: [
      {
        name: 'Aprender en el Siglo 21',
        links: [
          'https://chat.whatsapp.com/LtO5AudsAjL0R1JnV0l1P1',
          'https://chat.whatsapp.com/FnAeetqP6gYGlvhYCzH1wQ',
        ],
        badge: 'CUR027',
      },
      {
        name: 'Tecnología, Humanidades y Modelos Globales',
        links: [
          'https://chat.whatsapp.com/KkVdDHSjaZf2U8jD1wGeKS',
          'https://chat.whatsapp.com/K3Uo02FqI7DFgp6iiXwdE5',
        ],
        badge: 'CUR028',
      },
    ],
  },
  {
    label: 'Cuatrimestre I',
    color: 'from-blue-500/10 to-transparent',
    accent: 'border-blue-400/30',
    iconColor: 'text-blue-400',
    groups: [
      {
        name: 'Derecho Privado Civil',
        links: [
          'https://chat.whatsapp.com/IZw1rncbZbGF9ARDQr1bHD',
          'https://chat.whatsapp.com/JIcJU6vPEGf09RXLDFDhfK',
        ],
      },
      {
        name: 'Derecho Privado Comercial',
        links: [
          'https://chat.whatsapp.com/LPSZh2fHMRi8B5Yg3XIIsw',
          'https://chat.whatsapp.com/EmoSTosIvVJ8dERjBMdnl5',
        ],
      },
      {
        name: 'Marketing I (Plan Nuevo)',
        links: [
          'https://chat.whatsapp.com/CLehf8SukcE97fTLyi9kmb',
          'https://chat.whatsapp.com/EXmU2VfcI1a1NjRhl2daOw',
        ],
      },
      {
        name: 'Recursos Informáticos',
        links: [
          'https://chat.whatsapp.com/CaEwq0YQgt7AdoRPXl5Olt',
          'https://chat.whatsapp.com/LtTynDjbZqm35TikkUesAF',
          'https://chat.whatsapp.com/G8AgL41wO4VIbYSsSfCZub',
        ],
      },
      {
        name: 'Redacción Jurídica (Plan Viejo)',
        links: [
          'https://chat.whatsapp.com/G4adaekhRLH9fD3oxD9Nqi',
        ],
      },
    ],
  },
  {
    label: 'Cuatrimestre II',
    color: 'from-emerald-500/10 to-transparent',
    accent: 'border-emerald-400/30',
    iconColor: 'text-emerald-400',
    groups: [
      {
        name: 'Contabilidad Básica y de Gestión',
        links: [
          'https://chat.whatsapp.com/ITEjeZUqa6V3Iz1oZNxHiu',
          'https://chat.whatsapp.com/J9D0Wb8orVE9UhbnCtwJyW',
          'https://chat.whatsapp.com/G59yD1qcoqJ77MdAOP9DuV',
        ],
      },
      {
        name: 'Administración',
        links: [
          'https://chat.whatsapp.com/BxZzcly5HaE79zaQomCyXb',
          'https://chat.whatsapp.com/FfaecjpHXVVF7obyo1c2eF',
        ],
      },
      {
        name: 'Elementos Fundamentales de Derechos Reales',
        links: [
          'https://chat.whatsapp.com/EVQ7yp1tYtP6FSLBUh7jj7',
          'https://chat.whatsapp.com/GbH9Ktznt244uO1seYVXzF',
        ],
      },
      {
        name: 'Sistemas Jurídicos Administrativos Registrales (PP I)',
        links: [
          'https://chat.whatsapp.com/CIKzG2qxaCi1ltPJv5ahOg',
          'https://chat.whatsapp.com/BfPKdmbFrvmAFKaCdLBTOD',
          'https://chat.whatsapp.com/LMKBKW6ZBXk9NvCB84zRJ4',
        ],
        badge: 'PP I',
      },
    ],
  },
  {
    label: 'Cuatrimestre III',
    color: 'from-orange-500/10 to-transparent',
    accent: 'border-orange-400/30',
    iconColor: 'text-orange-400',
    groups: [
      {
        name: 'Derecho Procesal',
        links: [
          'https://chat.whatsapp.com/JQef6BLKUsh0f72Wm4i2UV',
          'https://chat.whatsapp.com/FYWAumnJhE4Bb6Zrbi8Fu5',
          'https://chat.whatsapp.com/CFQSa3lCScQ3hxVIFvowXk',
        ],
      },
      {
        name: 'Procedimientos de Ejec. y Conservación del Patrimonio',
        links: [
          'https://chat.whatsapp.com/LwBQ2SHGXOG3s8DbriFTki',
          'https://chat.whatsapp.com/F6V5rE69OO31qxMJjPIZPb',
        ],
      },
      {
        name: 'Tasación y Estimación de Bienes',
        links: [
          'https://chat.whatsapp.com/C4Wc5VfN35M9WKpSm1keY1',
          'https://chat.whatsapp.com/CxnoT95XJ96IMaubP1LX9v',
          'https://chat.whatsapp.com/F3Ck63147xQHviAp65ghsC',
        ],
      },
      {
        name: 'Subasta Judicial y Particular (PP II)',
        links: [
          'https://chat.whatsapp.com/I24XHIPUSiwKvABPTpmwtZ',
          'https://chat.whatsapp.com/JmeDEYFv33s23oNnd5L6s6',
          'https://chat.whatsapp.com/LJ33vSc2ssvBgNDEeD7juD',
        ],
        badge: 'PP II',
      },
    ],
  },
  {
    label: 'Cuatrimestre IV',
    color: 'from-purple-500/10 to-transparent',
    accent: 'border-purple-400/30',
    iconColor: 'text-purple-400',
    groups: [
      {
        name: 'Instituciones Políticas y Gubernamentales (D° Público)',
        links: [
          'https://chat.whatsapp.com/Jbqk0qd6sukDCqmeM060VA',
          'https://chat.whatsapp.com/DDdTuAZt4yU0j7rjQEtPWS',
        ],
      },
      {
        name: 'Administración y Gestión Inmobiliaria',
        links: [
          'https://chat.whatsapp.com/CPAwKutU10DBRpv544SR5n',
          'https://chat.whatsapp.com/JSCWSNuNsZt4GlTagSPGK7',
          'https://chat.whatsapp.com/JFYYavfw396ImqEAxQ7FLl',
        ],
      },
      {
        name: 'Informática Jurídica',
        links: [
          'https://chat.whatsapp.com/DZuQX8o4sWdITdLgw7ovmW',
          'https://chat.whatsapp.com/LA7sxICL8CnJ2kojqKIVHB',
          'https://chat.whatsapp.com/G7jfzJEwWDR6tAdM7v47ek',
        ],
      },
      {
        name: 'Corretaje Público Inmobiliario e Intermediación de Bienes (PP III)',
        links: [
          'https://chat.whatsapp.com/IDmITQBMxY7IQFe4sOo6uO',
          'https://chat.whatsapp.com/IOCjNK4LYIK8RsFRLPpJ2t',
          'https://chat.whatsapp.com/Gmu4Phdy0wb7zV1qkIWHgH',
          'https://chat.whatsapp.com/Brr3pTwZ34YAJW7yke1Pec',
        ],
        badge: 'PP III',
      },
    ],
  },
];

function getLinkLabel(url: string, index: number) {
  return `Grupo ${index + 1}`;
}

export default function GruposPage() {
  const totalLinks = semesters.reduce(
    (acc, s) => acc + s.groups.reduce((a, g) => a + g.links.length, 0),
    0
  );
  const totalGroups = semesters.reduce((acc, s) => acc + s.groups.length, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-medium tracking-widest uppercase">WhatsApp · 2025</span>
          </div>

          <h1 className="section-title text-4xl md:text-6xl mb-4">
            Grupos de la <span className="gold-gradient">Facultad</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Links de WhatsApp de todos los grupos de cada materia, organizados por cuatrimestre.
          </p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: String(semesters.length), label: 'Cuatrimestres' },
              { value: String(totalGroups), label: 'Materias' },
              { value: String(totalLinks), label: 'Links de grupos' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-center border border-white/5">
                <p className="text-3xl font-bold gold-gradient mb-1">{s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Semesters ──────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {semesters.map((sem, si) => (
            <div key={si}>
              {/* Semester header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px gold-divider" />
                <h2 className={`text-xs font-bold uppercase tracking-widest ${sem.iconColor}`}>
                  {sem.label}
                </h2>
              </div>

              {/* Groups */}
              <div className="space-y-3">
                {sem.groups.map((group, gi) => (
                  <div
                    key={gi}
                    className={`glass rounded-2xl border ${sem.accent} bg-gradient-to-br ${sem.color} p-5`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm leading-snug">{group.name}</h3>
                          {group.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 mt-1 inline-block">
                              {group.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0 mt-1">
                        {group.links.length} {group.links.length === 1 ? 'grupo' : 'grupos'}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                      {group.links.map((link, li) => (
                        <a
                          key={li}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {getLinkLabel(link, li)}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
