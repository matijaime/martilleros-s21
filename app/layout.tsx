import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Academic Hub — Martillero Público y Corredor Inmobiliario',
  description:
    'Portal académico de apoyo para la carrera de Martillero Público y Corredor Inmobiliario en el Siglo 21.',
  keywords: ['martillero público', 'corredor inmobiliario', 'siglo 21', 'materias', 'recursos'],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Academic Hub — Martillero Público y Corredor Inmobiliario',
    description: 'Portal académico con materiales, fechas y recursos de estudio.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="navy-gradient min-h-screen">{children}</body>
    </html>
  );
}
