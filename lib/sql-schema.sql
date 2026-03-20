-- ============================================================
-- Academic Hub — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Resources table
create table if not exists public.resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subject     text not null,
  type        text check (type in ('pdf', 'video')) not null,
  url         text not null,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table public.resources enable row level security;

-- Policy: anyone can read resources (public hub)
create policy "Public read access"
  on public.resources
  for select
  using (true);

-- Policy: only authenticated users can insert (admin dashboard)
create policy "Authenticated insert"
  on public.resources
  for insert
  with check (auth.role() = 'authenticated');

-- Policy: only authenticated users can delete
create policy "Authenticated delete"
  on public.resources
  for delete
  using (auth.role() = 'authenticated');

-- Confirm storage bucket 'materiales' exists (created via Supabase dashboard)
-- Ensure bucket is set to: Public read = true

-- ============================================================
-- Emergency Alert Banner
-- ============================================================
create table if not exists public.site_alerts (
  id          uuid primary key default gen_random_uuid(),
  message     text not null default '',
  active      boolean default false,
  updated_at  timestamptz default now()
);

alter table public.site_alerts enable row level security;

-- Anyone can read alerts (for the public banner)
create policy "Public read alerts"
  on public.site_alerts for select using (true);

-- Admin (anon key from dashboard) can write alerts
create policy "Anon manage alerts"
  on public.site_alerts for all using (true) with check (true);

-- Insert a default (inactive) alert row
insert into public.site_alerts (message, active)
values ('', false)
on conflict do nothing;

-- ============================================================
-- Guía de Supervivencia — survival_tips
-- ============================================================
create table if not exists public.survival_tips (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  icon_name    text not null default 'Shield',
  badge        text,
  border_color text not null default 'border-l-gold',
  icon_color   text not null default 'text-gold',
  is_emergency boolean default false,
  sort_order   int default 0,
  paragraphs   jsonb not null default '[]'::jsonb,
  created_at   timestamptz default now()
);

alter table public.survival_tips enable row level security;

create policy "Public read tips"
  on public.survival_tips for select using (true);

create policy "Anon manage tips"
  on public.survival_tips for all using (true) with check (true);

-- Seed the 5 predefined tips
insert into public.survival_tips (title, icon_name, badge, border_color, icon_color, is_emergency, sort_order, paragraphs) values
(
  'EXÁMENES Y PARCIALES',
  'ShieldAlert',
  'CRÍTICO',
  'border-l-red-500',
  'text-red-400',
  true,
  1,
  '[
    {"label":"Modalidad","text":"Los parciales NO son presenciales. Son 100% online."},
    {"label":"Monitoreo","text":"Se rinden obligatoriamente con la app Klarway.","link":{"href":"https://klarway.com/","label":"klarway.com"}},
    {"label":"Reglas","text":"La app graba tu cámara, micrófono y pantalla. Cualquier interrupción o movimiento sospechoso puede anular el examen. ¡Probá la cámara 15 minutos antes!"}
  ]'::jsonb
),
(
  'PROBLEMAS DE ACCESO / CLAVES',
  'Key',
  null,
  'border-l-amber-400',
  'text-amber-400',
  false,
  2,
  '[{"label":null,"text":"Si Canvas te pide una clave que no tenés o te rebota, intentá loguearte desde una pestaña de incógnito o desde el Portal del Alumno directo. A veces las cookies del navegador bloquean el acceso."}]'::jsonb
),
(
  '¿DÓNDE ESTÁ EL MATERIAL? (MÓDULOS 1 Y 2)',
  'BookOpen',
  null,
  'border-l-blue-400',
  'text-blue-400',
  false,
  3,
  '[{"label":null,"text":"Entrá a la materia → Clic en el botón \"Comenzar\" (está a la derecha o abajo). Ahí se despliegan los contenidos. Los TPs solo se habilitan cuando el sistema detecta que terminaste de leer los módulos correspondientes."}]'::jsonb
),
(
  'LA APP VS. NAVEGADOR',
  'Smartphone',
  null,
  'border-l-purple-400',
  'text-purple-400',
  false,
  4,
  '[{"label":null,"text":"La App de la Siglo 21 suele fallar el primer día o en fechas de examen. Para registrarte o rendir, usá siempre Chrome en una PC/Notebook. Si tu compu falla, andá al CAU; las máquinas de ahí ya tienen todos los permisos configurados."}]'::jsonb
),
(
  'BIBLIOGRAFÍA Y TPs',
  'Library',
  null,
  'border-l-emerald-400',
  'text-emerald-400',
  false,
  5,
  '[{"label":null,"text":"No estudies solo de resúmenes. Entrá a la pestaña \"Programa\" de cada materia y bajá la Bibliografía Básica. Los exámenes tienen preguntas \"trampa\" que solo salen de los textos oficiales."}]'::jsonb
)
on conflict do nothing;


-- ============================================================
-- Tests / Simulacros (Daypo integration)
-- ============================================================
create table if not exists public.tests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  link        text not null,
  subject     text not null,
  created_at  timestamptz default now()
);

alter table public.tests enable row level security;

-- Anyone can read tests (public student view)
create policy "Public read tests"
  on public.tests for select using (true);

-- Admin (anon key) can manage tests
create policy "Anon manage tests"
  on public.tests for all using (true) with check (true);
