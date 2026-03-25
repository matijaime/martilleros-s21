'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, FileText, PlayCircle, Download, ExternalLink,
  ClipboardList, Images, Clock, X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import GalleryOverlay from '@/components/GalleryOverlay';
import QuizComponent from '@/components/QuizComponent';
import { supabase } from '@/lib/supabaseClient';
import { Resource, Test, getSubjectBySlug } from '@/lib/constants';

export default function MateriaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const subject = getSubjectBySlug(slug);

  const [resources, setResources] = useState<Resource[]>([]);
  const [tests, setTests]         = useState<Test[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalTab, setModalTab]   = useState<'recursos' | 'simulacros'>('recursos');
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    if (!subject) return;
    (async () => {
      try {
        const [resResult, testResult] = await Promise.all([
          supabase.from('resources').select('*').eq('subject', subject.title).order('created_at', { ascending: false }),
          supabase.from('tests').select('*').eq('subject', subject.title).order('created_at', { ascending: false }),
        ]);
        setResources((resResult.data as Resource[]) || []);
        setTests((testResult.data as Test[]) || []);
      } catch {
        setResources([]);
        setTests([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [subject]);

  // Check hash for tab
  useEffect(() => {
    if (window.location.hash === '#simulacros') {
      setModalTab('simulacros');
    }
  }, []);

  if (!subject) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Materia no encontrada</h1>
          <p className="text-slate-400 mb-8">La materia que buscás no existe.</p>
          <Link href="/" className="btn-gold text-sm px-6 py-3">Volver al inicio</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = subject.icon;
  const files  = resources.filter(r => r.type === 'pdf');
  const videos = resources.filter(r => r.type === 'video');

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className={`pt-32 pb-8 px-6 bg-gradient-to-br ${subject.color}`}>
        <div className="max-w-4xl mx-auto">
          <Link href="/#materias" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold text-sm mb-6 transition-colors">
            ← Volver a materias
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
              <Icon size={28} className="text-gold" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">{subject.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gold" />
                <span className="text-gold text-xs font-medium">{subject.dates}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{subject.description}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6">
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
            {(resources.length > 0 || subject.title === 'DERECHO PRIVADO CIVIL') && (
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gold/10 text-gold">
                {resources.length + (subject.title === 'DERECHO PRIVADO CIVIL' ? 1 : 0)}
              </span>
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
            {tests.length > 0 && (
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400">{tests.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <section className="py-8 px-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Recursos Tab */}
              {modalTab === 'recursos' && (
                (resources.length === 0 && subject.title !== 'DERECHO PRIVADO CIVIL') ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-14 h-14 text-gold/20 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-1">Aún no hay recursos para esta materia.</p>
                    <p className="text-slate-500 text-sm">¡Mati los subirá pronto! 🚀</p>
                  </div>
                ) : (
                  <>
                    {subject.title === 'DERECHO PRIVADO CIVIL' && (
                      <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Images className="w-3.5 h-3.5" /> Presentaciones
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-4 glass rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Images className="w-4 h-4 text-gold flex-shrink-0" />
                              <p className="text-white text-sm truncate">Filminas de las clases de derecho</p>
                            </div>
                            <button
                              onClick={() => setGalleryOpen(true)}
                              className="flex-shrink-0 flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border border-gold/20"
                            >
                              <Images className="w-3.5 h-3.5" /> Ver Filminas
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

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

              {/* Simulacros Tab */}
              {modalTab === 'simulacros' && (
                tests.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="w-14 h-14 text-purple-400/20 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-1">Todavía no hay simulacros para esta materia.</p>
                    <p className="text-slate-500 text-sm">¡Mati los subirá pronto! 📋</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tests.map(test => (
                      <div key={test.id}>
                        {test.is_internal ? (
                          /* Internal Quiz Card */
                          <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
                            <div className="flex items-center gap-4 px-5 py-4 bg-purple-500/5 border-b border-purple-500/10">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <ClipboardList className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold">{test.name}</p>
                                <span className="text-xs text-purple-400 font-medium">🧠 Quiz Interactivo</span>
                              </div>
                              <Link
                                href={`/materia/${slug}/simulacro/${test.id}`}
                                className="flex-shrink-0 flex items-center gap-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border border-purple-500/20"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Abrir link
                              </Link>
                            </div>
                            <div className="p-5">
                              {(() => {
                                let parsedQs = undefined;
                                if (test.link) {
                                  try {
                                    parsedQs = JSON.parse(test.link);
                                  } catch (e) {
                                    console.error("Error parsing test questions", e);
                                  }
                                }
                                return <QuizComponent quizName={test.name} questionsData={parsedQs} />;
                              })()}
                            </div>
                          </div>
                        ) : (
                          /* External Link Card */
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
            </>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
      <GalleryOverlay open={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </div>
  );
}
