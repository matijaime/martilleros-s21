'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Clock, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import QuizComponent from '@/components/QuizComponent';
import { supabase } from '@/lib/supabaseClient';
import { Test, getSubjectBySlug } from '@/lib/constants';

export default function SimulacroPage() {
  const params = useParams();
  const slug   = params.slug as string;
  const testId = params.testId as string;
  const subject = getSubjectBySlug(slug);

  const [test, setTest]       = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setTest(data as Test);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/3 mb-8" />
            <div className="h-40 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !test) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <ClipboardList className="w-14 h-14 text-purple-400/20 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold mb-4">Simulacro no encontrado</h1>
          <p className="text-slate-400 mb-8">El simulacro que buscás no existe o fue eliminado.</p>
          <Link href={subject ? `/materia/${slug}#simulacros` : '/'} className="btn-gold text-sm px-6 py-3">
            {subject ? 'Volver a la materia' : 'Volver al inicio'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  let parsedQs = undefined;
  if (test.is_internal && test.link) {
    try {
      parsedQs = JSON.parse(test.link);
    } catch (e) {
      console.error("Error parsing test questions", e);
    }
  }

  const Icon = subject?.icon;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href={`/materia/${slug}#simulacros`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-gold text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a {subject?.title || 'la materia'}
          </Link>

          {/* Quiz Header */}
          <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
            <div className={`flex items-center gap-4 px-6 py-5 border-b border-purple-500/10 ${subject ? `bg-gradient-to-br ${subject.color}` : 'bg-purple-500/5'}`}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-lg font-bold">{test.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-purple-400 font-medium">🧠 Quiz Interactivo</span>
                  {subject && (
                    <>
                      <span className="text-slate-600">·</span>
                      <div className="flex items-center gap-1">
                        {Icon && <Icon size={12} className="text-gold" />}
                        <span className="text-gold text-xs font-medium">{subject.title}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz body */}
            <div className="p-6">
              {test.is_internal ? (
                <QuizComponent quizName={test.name} questionsData={parsedQs} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">Este simulacro es un enlace externo.</p>
                  <a
                    href={test.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-sm px-6 py-3"
                  >
                    Abrir Simulacro ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
