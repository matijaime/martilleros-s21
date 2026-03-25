import {
  BookOpen, GraduationCap, Scale, TrendingUp, Globe,
  ShieldAlert, Key, Smartphone, Library, MessageCircle,
  FileText, PlayCircle,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────
export interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'galeria';
  url: string;
  created_at: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
  location: string;
}

export interface TipParagraph {
  label: string | null;
  text: string;
  link?: { href: string; label: string };
}

export interface DbSurvivalTip {
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

export interface Subject {
  title: string;
  dates: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  description: string;
  color: string;
  accent: string;
  slug: string;
}

export interface Test {
  id: string;
  name: string;
  link: string;
  subject: string;
  is_internal: boolean;
  created_at: string;
}

// ── Constants ──────────────────────────────────────────
export const WA_COMMUNITY = 'https://chat.whatsapp.com/FcgPPzJk6108mr1KyBoDLc?mode=gi_t';
export const WA_PERSONAL  = 'https://wa.me/5492284470305';
export const PORTAL_URL   = 'https://alumnos.21.edu.ar/';

// ── Icon name → Lucide component map ──────────────────
export const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number | string }>> = {
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

// ── Subjects ───────────────────────────────────────────
export const subjects: Subject[] = [
  {
    title: 'APRENDER EN EL SIGLO 21',
    dates: '16 MAR — 16 MAY',
    icon: GraduationCap,
    description: 'Estrategias de aprendizaje y herramientas digitales para el estudiante universitario.',
    color: 'from-gold/20 to-transparent',
    accent: 'border-gold/40',
    slug: 'aprender-en-el-siglo-21',
  },
  {
    title: 'DERECHO PRIVADO CIVIL',
    dates: '16 MAR — 16 MAY',
    icon: Scale,
    description: 'Principios del derecho civil, contratos, obligaciones y derechos reales.',
    color: 'from-blue-500/10 to-transparent',
    accent: 'border-blue-400/30',
    slug: 'derecho-privado-civil',
  },
  {
    title: 'MARKETING I',
    dates: '18 MAY — 18 JUL',
    icon: TrendingUp,
    description: 'Fundamentos del marketing, comportamiento del consumidor y estrategias comerciales.',
    color: 'from-emerald-500/10 to-transparent',
    accent: 'border-emerald-400/30',
    slug: 'marketing-i',
  },
  {
    title: 'TECNOLOGÍA, HUMANIDADES Y MODELOS GLOBALES',
    dates: '18 MAY — 18 JUL',
    icon: Globe,
    description: 'El impacto tecnológico en las humanidades y los modelos de globalización contemporánea.',
    color: 'from-purple-500/10 to-transparent',
    accent: 'border-purple-400/30',
    slug: 'tecnologia-humanidades-y-modelos-globales',
  },
];

// ── Helper: find subject by slug ──────────────────────
export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find(s => s.slug === slug);
}

// ── Hardcoded fallback tips ───────────────────────────
export const FALLBACK_TIPS: DbSurvivalTip[] = [
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
