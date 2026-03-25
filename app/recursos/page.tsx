'use client';

import { useState, useEffect } from 'react';
import {
  Search, FileText, PlayCircle, Download, ExternalLink, Images,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import GalleryOverlay from '@/components/GalleryOverlay';
import { supabase } from '@/lib/supabaseClient';
import { Resource } from '@/lib/constants';

export default function RecursosPage() {
  const [resources, setResources]             = useState<Resource[]>([]);
  const [search, setSearch]                   = useState('');
  const [loadingResources, setLoadingResources] = useState(true);
  const [galleryOpen, setGalleryOpen]         = useState(false);

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

  const hardcodedGalleryResource: Resource = {
    id: 'filminas-civil',
    title: 'Filminas de las clases de derecho',
    subject: 'DERECHO PRIVADO CIVIL',
    type: 'galeria',
    url: '#filminas',
    created_at: new Date().toISOString(),
  };

  const allResources = [hardcodedGalleryResource, ...(resources || [])];

  const filtered = allResources.filter(r =>
    r?.title?.toLowerCase()?.includes(search?.toLowerCase()) ||
    r?.subject?.toLowerCase()?.includes(search?.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="w-8 h-px gold-divider mb-4" style={{ margin: 0 }} />
              <h1 className="section-title text-4xl md:text-5xl mt-4">Recursos de Estudio</h1>
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
                      {resource.type === 'pdf' ? <FileText size={24} className="text-gold" /> : resource.type === 'galeria' ? <Images size={24} className="text-gold" /> : <PlayCircle size={24} className="text-gold" />}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      resource.type === 'pdf'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : resource.type === 'galeria'
                        ? 'bg-gold/10 text-gold border-gold/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {resource.type === 'pdf' ? 'DOC' : String(resource.type).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{String(resource.title)}</h3>
                    <p className="text-slate-500 text-xs">{String(resource.subject)}</p>
                  </div>
                  {resource.type === 'pdf' ? (
                    <a href={resource.url} download target="_blank" rel="noopener noreferrer" className="btn-gold w-full justify-center text-xs py-2.5">
                      <Download className="w-4 h-4" /> Descargar
                    </a>
                  ) : resource.type === 'galeria' ? (
                    <button
                      onClick={() => setGalleryOpen(true)}
                      className="btn-gold w-full justify-center text-xs py-2.5"
                    >
                      <Images className="w-4 h-4" /> Ver Galería
                    </button>
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

      <Footer />
      <WhatsAppFAB />
      <GalleryOverlay open={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </div>
  );
}
