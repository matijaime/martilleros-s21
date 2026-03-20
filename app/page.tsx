'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Calendar, Download, ExternalLink, Search,
  GraduationCap, Scale, TrendingUp, Globe, Clock, MapPin,
  FileText, PlayCircle, ChevronRight, ChevronDown, ShieldAlert,
  Key, Smartphone, Library, X, Bell,
  Users, AlertTriangle, MessageCircle, ClipboardList,
} from 'lucide-react';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import QuizComponent from '@/components/QuizComponent';
import { supabase } from '@/lib/supabaseClient';

// ── Types ──────────────────────────────────────────────
interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'archivo';
  url: string;
  created_at: string;
}

interface CalendarEvent {
  title: string;
  start: string;
  location: string;
}

interface TipParagraph {
  label: string | null;
  text: string;
  link?: { href: string; label: string };
}

interface DbSurvivalTip {
  id: string;
  title: string;
  icon_name: string;
  badge: string | null;
  border_color: string;
  icon_color: string;
  is_emergency: boolean;
  sort_order: number;
  paragraphs: TipParagraph[];
}

interface Subject {
  title: string;
  dates: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  description: string;
  color: string;
  accent: string;
}

interface Test {
  id: string;
  name: string;
  link: string;
  subject: string;
  is_internal: boolean;
  created_at: string;
}

// ── Constants ──────────────────────────────────────────
const WA_COMMUNITY = 'https://chat.whatsapp.com/FcgPPzJk6108mr1KyBoDLc?mode=gi_t';
const WA_PERSONAL  = 'https://wa.me/5492284470305';
const PORTAL_URL   = 'https://alumnos.21.edu.ar/';

// ── Icon name → Lucide component map ──────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number | string }>> = {
  ShieldAlert,
  Key,
  BookOpen,
  MessageCircle,
  Smartphone,
  Library,
  GraduationCap,
  Scale,
  TrendingUp,
  Globe,
  FileText,
  PlayCircle,
};

// ── Hardcoded fallback tips ───────────────────────────
const FALLBACK_TIPS: DbSurvivalTip[] = [
  {
    id: 'examenes', title: 'EXÁMENES Y PARCIALES', icon_name: 'ShieldAlert',
    badge: 'CRÍTICO', border_color: 'border-l-red-500', icon_color: 'text-red-400',
    is_emergency: true, sort_order: 1,
    paragraphs: [
      { label: 'Modalidad', text: 'Los parciales NO son presenciales. Son 100% online.' },
      { label: 'Monitoreo', text: 'Se rinden obligatoriamente con la app Klarway.', link: { href: 'https://klarway.com/', label: 'klarway.com' } },
      { label: 'Reglas', text: 'La app graba tu cámara, micrófono y pantalla. Cualquier interrupción o movimiento sospechoso puede anular el examen. ¡Probá la cámara 15 minutos antes!' },
    ],
  },
  {
    id: 'acceso', title: 'PROBLEMAS DE ACCESO / CLAVES', icon_name: 'Key',
    badge: null, border_color: 'border-l-amber-400', icon_color: 'text-amber-400',
    is_emergency: false, sort_order: 2,
    paragraphs: [
      { label: null, text: 'Si Canvas te pide una clave que no tenés o te rebota, intentá loguearte desde una pestaña de incógnito o desde el Portal del Alumno directo. A veces las cookies del navegador bloquean el acceso.' },
    ],
  },
  {
    id: 'material', title: '¿DÓNDE ESTÁ EL MATERIAL? (MÓDULOS 1 Y 2)', icon_name: 'BookOpen',
    badge: null, border_color: 'border-l-blue-400', icon_color: 'text-blue-400',
    is_emergency: false, sort_order: 3,
    paragraphs: [
      { label: null, text: 'Entrá a la materia → Clic en el botón "Comenzar" (está a la derecha o abajo). Ahí se despliegan los contenidos. Los TPs solo se habilitan cuando el sistema detecta que terminaste de leer los módulos correspondientes.' },
    ],
  },
  {
    id: 'app', title: 'LA APP VS. NAVEGADOR', icon_name: 'Smartphone',
    badge: null, border_color: 'border-l-purple-400', icon_color: 'text-purple-400',
    is_emergency: false, sort_order: 4,
    paragraphs: [
      { label: null, text: 'La App de la Siglo 21 suele fallar el primer día o en fechas de examen. Para registrarte o rendir, usá siempre Chrome en una PC/Notebook. Si tu compu falla, andá al CAU; las máquinas de ahí ya tienen todos los permisos configurados.' },
    ],
  },
  {
    id: 'biblio', title: 'BIBLIOGRAFÍA Y TPs', icon_name: 'Library',
    badge: null, border_color: 'border-l-emerald-400', icon_color: 'text-emerald-400',
    is_emergency: false, sort_order: 5,
    paragraphs: [
      { label: null, text: 'No estudies solo de resúmenes. Entrá a la pestaña "Programa" de cada materia y bajá la Bibliografía Básica. Los exámenes tienen preguntas "trampa" que solo salen de los textos oficiales.' },
    ],
  },
];

// ── Subjects ───────────────────────────────────────────
const subjects: Subject[] = [
  {
    title: 'APRENDER EN EL SIGLO 21',
    dates: '16 MAR — 16 MAY',
    icon: GraduationCap,
    description: 'Estrategias de aprendizaje y herramientas digitales para el estudiante universitario.',
    color: 'from-gold/20 to-transparent',
    accent: 'border-gold/40',
  },
  {
    title: 'DERECHO PRIVADO CIVIL',
    dates: '16 MAR — 16 MAY',
    icon: Scale,
    description: 'Principios del derecho civil, contratos, obligaciones y derechos reales.',
    color: 'from-blue-500/10 to-transparent',
    accent: 'border-blue-400/30',
  },
  {
    title: 'MARKETING I',
    dates: '18 MAY — 18 JUL',
    icon: TrendingUp,
    description: 'Fundamentos del marketing, comportamiento del consumidor y estrategias comerciales.',
    color: 'from-emerald-500/10 to-transparent',
    accent: 'border-emerald-400/30',
  },
  {
    title: 'TECNOLOGÍA, HUMANIDADES Y MODELOS GLOBALES',
    dates: '18 MAY — 18 JUL',
    icon: Globe,
    description: 'El impacto tecnológico en las humanidades y los modelos de globalización contemporánea.',
    color: 'from-purple-500/10 to-transparent',
    accent: 'border-purple-400/30',
  },
];

// ── Component ──────────────────────────────────────────
export default function HomePage() {
  const [resources, setResources]               = useState<Resource[]>([]);
  const [events, setEvents]                     = useState<CalendarEvent[]>([]);
  const [survivaltips, setSurvivalTips]         = useState<DbSurvivalTip[]>([]);
  const [search, setSearch]                     = useState('');
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingEvents, setLoadingEvents]       = useState(true);
  const [loadingTips, setLoadingTips]           = useState(true);
  const [openTipId, setOpenTipId]               = useState<string | null>(null);
  const [alertMessage, setAlertMessage]         = useState('');
  const [alertActive, setAlertActive]           = useState(false);
  const [alertDismissed, setAlertDismissed]     = useState(false);
  const [selectedSubject, setSelectedSubject]   = useState<Subject | null>(null);
  const [modalTab, setModalTab]                 = useState<'recursos' | 'simulacros'>('recursos');
  const [tests, setTests]                       = useState<Test[]>([]);

  // ── FETCH: Emergency Alert ──────────────────────────
  useEffect(() => {
    supabase.from('site_alerts').select('message, active').limit(1).single()
      .then(({ data }) => {
        if (data?.active && data?.message) {
          setAlertMessage(String(data.message));
          setAlertActive(true);
        }
      });
  }, []);

  // ── FETCH: Survival Tips ────────────────────────────
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

  // ── FETCH: Calendar events ──────────────────────────
  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  // ── FETCH: Resources ────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });
        setResources((data as Resource[]) || []);
      } catch {
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    })();
  }, []);

  // ── FETCH: Tests ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('tests')
          .select('*')
          .order('created_at', { ascending: false });
        setTests((data as Test[]) || []);
      } catch {
        setTests([]);
      }
    })();
  }, []);

  const filtered = resources?.filter(r =>
    r?.title?.toLowerCase()?.includes(search?.toLowerCase()) ||
    r?.subject?.toLowerCase()?.includes(search?.toLowerCase())
  ) || [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen">

      {/* ── Emergency Alert Banner ─────────────────────── */}
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

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav
        className="fixed left-0 right-0 z-50 glass-dark"
        style={{ top: alertActive && !alertDismissed ? '40px' : '0' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Academic Hub Logo" className="h-10 w-auto mr-1" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Academic Hub</p>
              <p className="text-gold text-xs opacity-80">Martillero · Corredor Inmobiliario</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm text-slate-400">
            <a href="#materias" className="hover:text-gold transition-colors">Materias</a>
            <a href="#guia"     className="hover:text-gold transition-colors">Guía</a>
            <a href="#fechas"   className="hover:text-gold transition-colors">Fechas</a>
            <a href="#recursos" className="hover:text-gold transition-colors">Recursos</a>
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

      {/* ── Hero ────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ paddingTop: alertActive && !alertDismissed ? '40px' : '0' }}
      >
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
                <button
                  key={idx}
                  onClick={() => setSelectedSubject(subject)}
                  className={`glass card-hover rounded-2xl p-7 bg-gradient-to-br ${subject.color} border ${subject.accent} text-left w-full group transition-all hover:scale-[1.02] cursor-pointer`}
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
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Subject Detail Modal ──────────────────────── */}
      {selectedSubject && (() => {
        const subjectResources = resources.filter(r => r.subject === selectedSubject.title);
        const subjectTests     = tests.filter(t => t.subject === selectedSubject.title);
        const files  = subjectResources.filter(r => r.type === 'pdf' || r.type === 'archivo');
        const videos = subjectResources.filter(r => r.type === 'video');
        const Icon   = selectedSubject.icon;
        return (
          <div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6"
            onClick={() => { setSelectedSubject(null); setModalTab('recursos'); }}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* card */}
            <div
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-3xl border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${selectedSubject.color} border-b border-white/5 p-6 sm:p-8`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg leading-tight">{selectedSubject.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gold" />
                        <span className="text-gold text-xs font-medium">{selectedSubject.dates}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedSubject(null); setModalTab('recursos'); }}
                    className="flex-shrink-0 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-4 leading-relaxed">{selectedSubject.description}</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                <button
                  onClick={() => setModalTab('recursos')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                    modalTab === 'recursos'
                      ? 'text-gold border-b-2 border-gold bg-gold/5'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Recursos
                  {subjectResources.length > 0 && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gold/10 text-gold">{subjectResources.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setModalTab('simulacros')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                    modalTab === 'simulacros'
                      ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/5'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Simulacros
                  {subjectTests.length > 0 && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400">{subjectTests.length}</span>
                  )}
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* ── Recursos Tab ── */}
                {modalTab === 'recursos' && (
                  subjectResources.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-14 h-14 text-gold/20 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-1">Aún no hay recursos para esta materia.</p>
                      <p className="text-slate-500 text-sm">¡Mati los subirá pronto! 🚀</p>
                    </div>
                  ) : (
                    <>
                      {files.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Documentos y Apuntes
                          </h3>
                          <div className="space-y-2">
                            {files.map(r => (
                              <div key={r.id} className="flex items-center justify-between gap-4 glass rounded-xl px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                                  <p className="text-white text-sm truncate">{r.title}</p>
                                </div>
                                <a href={r.url} download target="_blank" rel="noopener noreferrer"
                                  className="flex-shrink-0 flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border border-gold/20">
                                  <Download className="w-3.5 h-3.5" /> Descargar
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {videos.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <PlayCircle className="w-3.5 h-3.5" /> Videos
                          </h3>
                          <div className="space-y-2">
                            {videos.map(r => (
                              <div key={r.id} className="flex items-center justify-between gap-4 glass rounded-xl px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <PlayCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                  <p className="text-white text-sm truncate">{r.title}</p>
                                </div>
                                <a href={r.url} target="_blank" rel="noopener noreferrer"
                                  className="flex-shrink-0 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border border-blue-500/20">
                                  <ExternalLink className="w-3.5 h-3.5" /> Ver Video
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )
                )}

                {/* ── Simulacros Tab ── */}
                {modalTab === 'simulacros' && (
                  subjectTests.length === 0 ? (
                    <div className="text-center py-12">
                      <ClipboardList className="w-14 h-14 text-purple-400/20 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-1">Todavía no hay simulacros para esta materia.</p>
                      <p className="text-slate-500 text-sm">¡Mati los subirá pronto! 📋</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subjectTests.map(test => (
                        <div key={test.id}>
                          {test.is_internal ? (
                            /* ── Internal Quiz Card ── */
                            <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
                              {/* Quiz header */}
                              <div className="flex items-center gap-4 px-5 py-4 bg-purple-500/5 border-b border-purple-500/10">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                  <ClipboardList className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-bold">{test.name}</p>
                                  <span className="text-xs text-purple-400 font-medium">🧠 Quiz Interactivo · 20 preguntas</span>
                                </div>
                              </div>
                              {/* Render quiz inline */}
                              <div className="p-5">
                                <QuizComponent quizName={test.name} />
                              </div>
                            </div>
                          ) : (
                            /* ── External Link Card ── */
                            <a
                              href={test.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 glass card-hover rounded-xl px-5 py-4 border border-white/5 group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-all">
                                <ClipboardList className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold">{test.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5 truncate">{test.link}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Guía de Supervivencia ────────────────────────── */}
      <section id="guia" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-gold px-4 py-1.5 rounded-full mb-4">
              <ShieldAlert className="w-4 h-4 text-gold" />
              <span className="text-gold text-xs font-semibold tracking-widest uppercase">Kit de Supervivencia</span>
            </div>
            <h2 className="section-title mb-3">Guía de Supervivencia</h2>
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

      {/* ── Próximas Fechas ──────────────────────────────── */}
      <section id="fechas" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <div className="w-8 h-px gold-divider mb-4" style={{ margin: 0 }} />
              <h2 className="section-title text-3xl mb-3 mt-4">Próximas<br />Fechas</h2>
              <p className="section-subtitle text-sm">Sincronizado con tu calendario de Canvas.</p>
              <div className="mt-6 glass-gold rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="text-gold text-sm font-medium">Actualizado periódicamente</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
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
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="gold-divider w-full opacity-30" />
      </div>

      {/* ── Recursos ─────────────────────────────────────── */}
      <section id="recursos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="w-8 h-px gold-divider mb-4" style={{ margin: 0 }} />
              <h2 className="section-title text-3xl mt-4">Recursos de Estudio</h2>
              <p className="section-subtitle text-sm mt-2">PDFs y videos cargados para las materias.</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-dark pl-10"
              />
            </div>
          </div>

          {loadingResources ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
                </div>
              ))}
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/5">
              <FileText className="w-14 h-14 text-gold/20 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">
                {search ? 'Sin resultados para tu búsqueda.' : 'Todavía no hay materiales cargados.'}
              </p>
              <p className="text-slate-500 text-sm">
                {search ? 'Probá con otro término.' : '¡Revisá más tarde!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered?.map(resource => (
                <div key={resource.id} className="glass card-hover rounded-xl p-6 border border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg glass-gold flex items-center justify-center">
                      {resource.type !== 'video' ? <FileText size={24} className="text-gold" /> : <PlayCircle size={24} className="text-gold" />}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      resource.type !== 'video'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {resource.type === 'archivo' ? 'DOC' : String(resource.type).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{String(resource.title)}</h3>
                    <p className="text-slate-500 text-xs">{String(resource.subject)}</p>
                  </div>
                  {resource.type !== 'video' ? (
                    <a href={resource.url} download target="_blank" rel="noopener noreferrer" className="btn-gold w-full justify-center text-xs py-2.5">
                      <Download className="w-4 h-4" /> Descargar
                    </a>
                  ) : (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-outline-gold w-full justify-center text-xs py-2.5">
                      <ExternalLink className="w-4 h-4" /> Abrir Video
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
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

      <WhatsAppFAB />
    </div>
  );
}
