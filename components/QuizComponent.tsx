'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, AlertCircle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string; // letter: 'A' | 'B' | 'C' | 'D'
}

interface UserAnswer {
  questionId: number;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

type Phase = 'quiz' | 'results';

// ── Dataset ─────────────────────────────────────────────────────────────────
const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'La autorregulación del aprendizaje es:',
    options: [
      'A. Estudiar solo en silencio',
      'B. Planificar, ejecutar y monitorear el estudio',
      'C. Leer los apuntes antes del examen',
      'D. Depender del docente para aprender',
    ],
    correct: 'B',
  },
  {
    id: 2,
    question: 'La planificación consiste en:',
    options: [
      'A. Subrayar el texto con colores',
      'B. Estudiar sin descansos',
      'C. Definir metas y organizar el tiempo',
      'D. Memorizar todo antes del parcial',
    ],
    correct: 'C',
  },
  {
    id: 3,
    question: 'Una meta de proceso es:',
    options: [
      'A. Aprobar con 10 en el examen',
      'B. Recibirse en dos años',
      'C. Estudiar 1 hora por día',
      'D. Tener buenas notas',
    ],
    correct: 'C',
  },
  {
    id: 4,
    question: 'Las metas deben ser:',
    options: [
      'A. Imprecisas y flexibles',
      'B. Ambiciosas e imposibles',
      'C. Factibles, medibles y temporales',
      'D. Generales y sin fecha límite',
    ],
    correct: 'C',
  },
  {
    id: 5,
    question: 'La procrastinación es:',
    options: [
      'A. Estudiar en grupo',
      'B. Postergar tareas importantes',
      'C. Revisar el material antes de clase',
      'D. Dividir el tiempo en bloques',
    ],
    correct: 'B',
  },
  {
    id: 6,
    question: 'La procrastinación hedonista se da cuando:',
    options: [
      'A. Se trabaja sin descanso',
      'B. Se elige lo más placentero',
      'C. Se estudia con miedo',
      'D. Se planifica en exceso',
    ],
    correct: 'B',
  },
  {
    id: 7,
    question: 'La procrastinación ansiosa se relaciona con:',
    options: [
      'A. Falta de materiales',
      'B. Exceso de motivación',
      'C. Miedo a fallar',
      'D. Preferencias por el ocio',
    ],
    correct: 'C',
  },
  {
    id: 8,
    question: 'Una técnica de estudio profunda es:',
    options: [
      'A. Leer en voz alta',
      'B. Subrayar sin leer',
      'C. Comprender y relacionar',
      'D. Copiar textualmente',
    ],
    correct: 'C',
  },
  {
    id: 9,
    question: 'El estilo visual se basa en:',
    options: [
      'A. Escuchar podcasts',
      'B. Hacer actividades físicas',
      'C. Ver imágenes',
      'D. Repetir en voz alta',
    ],
    correct: 'C',
  },
  {
    id: 10,
    question: 'El estilo auditivo implica:',
    options: [
      'A. Usar mapas conceptuales',
      'B. Escuchar y explicar',
      'C. Hacer resúmenes escritos',
      'D. Ver esquemas en colores',
    ],
    correct: 'B',
  },
  {
    id: 11,
    question: 'El estilo kinestésico se relaciona con:',
    options: [
      'A. Leer diagramas',
      'B. Escuchar clases grabadas',
      'C. Hacer y experimentar',
      'D. Subrayar con colores',
    ],
    correct: 'C',
  },
  {
    id: 12,
    question: 'El monitoreo implica:',
    options: [
      'A. Solo tomar notas',
      'B. Evaluar y mejorar',
      'C. Estudiar en silencio',
      'D. Repetir el material varias veces',
    ],
    correct: 'B',
  },
  {
    id: 13,
    question: 'La autoeficacia es:',
    options: [
      'A. La nota máxima posible',
      'B. Creencia en uno mismo',
      'C. La habilidad para memorizar',
      'D. El apoyo del docente',
    ],
    correct: 'B',
  },
  {
    id: 14,
    question: 'El apoyo informativo proviene de:',
    options: [
      'A. Redes sociales',
      'B. Familia y amigos',
      'C. Docentes',
      'D. Compañeros de estudio exclusivamente',
    ],
    correct: 'C',
  },
  {
    id: 15,
    question: 'El apoyo emocional proviene de:',
    options: [
      'A. La bibliografía oficial',
      'B. Familia y amigos',
      'C. El campus virtual',
      'D. Los tutores académicos',
    ],
    correct: 'B',
  },
  {
    id: 16,
    question: 'Un hábito se forma por:',
    options: [
      'A. Motivación externa constante',
      'B. Repetición',
      'C. Recompensas económicas',
      'D. Presión social',
    ],
    correct: 'B',
  },
  {
    id: 17,
    question: 'La agenda sirve para:',
    options: [
      'A. Registrar calificaciones',
      'B. Organizar el tiempo',
      'C. Comunicarse con docentes',
      'D. Guardar materiales de estudio',
    ],
    correct: 'B',
  },
  {
    id: 18,
    question: 'Una técnica superficial es:',
    options: [
      'A. Elaborar mapas mentales',
      'B. Relacionar conceptos nuevos con conocidos',
      'C. Memorizar sin entender',
      'D. Hacer gráficos comparativos',
    ],
    correct: 'C',
  },
  {
    id: 19,
    question: 'Revisar errores corresponde a:',
    options: [
      'A. Planificación',
      'B. Motivación intrínseca',
      'C. Monitoreo',
      'D. Autorregulación inicial',
    ],
    correct: 'C',
  },
  {
    id: 20,
    question: 'El objetivo del aprendizaje autorregulado es:',
    options: [
      'A. Aprobar sin esfuerzo',
      'B. Aprender de forma autónoma',
      'C. Depender del grupo de estudio',
      'D. Estudiar solo en períodos de examen',
    ],
    correct: 'B',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getLetterFromOption(option: string): string {
  return option.charAt(0);
}

function getScoreColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-400';
  if (pct >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreMessage(pct: number): string {
  if (pct === 100) return '¡Perfecto! Dominás la materia 🏆';
  if (pct >= 80)   return '¡Excelente! Casi un crack 🎯';
  if (pct >= 60)   return 'Bien, pero hay margen para mejorar 📖';
  if (pct >= 40)   return 'Seguí estudiando, vas por buen camino 💪';
  return 'Necesitás repasar el material, ¡vos podés! 🔥';
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function QuizComponent({ quizName = 'Simulacro — Aprender en el Siglo 21' }: { quizName?: string }) {
  const [phase, setPhase]       = useState<Phase>('quiz');
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffle(QUESTIONS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]   = useState<UserAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const current   = questions[currentIdx];
  const progress  = ((currentIdx) / questions.length) * 100;
  const total     = questions.length;
  const score     = answers.filter(a => a.isCorrect).length;
  const scorePct  = Math.round((score / total) * 100);

  const handleSelect = (letter: string) => {
    if (confirmed) return;
    setSelected(letter);
  };

  const handleConfirm = () => {
    if (!selected) return;
    const isCorrect = selected === current.correct;
    setAnswers(prev => [
      ...prev,
      { questionId: current.id, selected, correct: current.correct, isCorrect },
    ]);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setPhase('results');
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRestart = useCallback(() => {
    setQuestions(shuffle(QUESTIONS));
    setAnswers([]);
    setCurrentIdx(0);
    setSelected(null);
    setConfirmed(false);
    setPhase('quiz');
  }, []);

  // ── Results Screen ─────────────────────────────────────────────────────────
  if (phase === 'results') {
    const wrong = answers.filter(a => !a.isCorrect);
    return (
      <div className="space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 border border-white/10 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-gold flex items-center justify-center">
            <Trophy className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-1">Resultado Final</h2>
          <p className="text-slate-500 text-sm mb-6">{quizName}</p>

          <div className={`text-6xl font-black mb-2 ${getScoreColor(scorePct)}`}>
            {score}<span className="text-2xl text-slate-500">/{total}</span>
          </div>
          <div className={`text-lg font-semibold mb-1 ${getScoreColor(scorePct)}`}>{scorePct}%</div>
          <p className="text-slate-400 text-sm">{getScoreMessage(scorePct)}</p>

          {/* Score bar */}
          <div className="mt-6 h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                scorePct >= 80 ? 'bg-emerald-400' :
                scorePct >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            />
          </div>
        </motion.div>

        {/* Wrong Answers Review */}
        {wrong.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Preguntas para repasar ({wrong.length})
            </h3>
            {wrong.map((answer, idx) => {
              const q = QUESTIONS.find(q => q.id === answer.questionId)!;
              const correctOption = q.options.find(o => getLetterFromOption(o) === answer.correct)!;
              const selectedOption = q.options.find(o => getLetterFromOption(o) === answer.selected)!;
              return (
                <motion.div
                  key={answer.questionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="glass rounded-xl p-4 border border-red-500/20"
                >
                  <p className="text-white text-sm font-semibold mb-3">{q.question}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-red-300 text-xs">Tu respuesta: {selectedOption}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-300 text-xs">Correcta: {correctOption}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {wrong.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-5 border border-emerald-500/20 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-300 text-sm font-semibold">¡Sin errores! Respondiste todo correctamente 🎉</p>
          </motion.div>
        )}

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="w-full flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold font-semibold border border-gold/30 rounded-xl px-5 py-3.5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reintentar (preguntas mezcladas)
        </button>
      </div>
    );
  }

  // ── Quiz Screen ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header / Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-medium">
            Pregunta {currentIdx + 1} de {total}
          </span>
          <span className="text-xs text-gold font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="glass rounded-2xl p-6 border border-white/10"
        >
          <p className="text-white font-semibold text-base leading-snug mb-5">
            <span className="text-gold mr-2">{currentIdx + 1}.</span>
            {current.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {current.options.map(option => {
              const letter = getLetterFromOption(option);
              const isSelected = selected === letter;
              const isCorrect  = letter === current.correct;

              let optionClass = 'border border-white/10 text-slate-300 hover:border-gold/40 hover:text-white hover:bg-gold/5';
              if (confirmed) {
                if (isCorrect) {
                  optionClass = 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border border-red-500/60 bg-red-500/10 text-red-300';
                } else {
                  optionClass = 'border border-white/5 text-slate-600 opacity-50';
                }
              } else if (isSelected) {
                optionClass = 'border border-gold/60 bg-gold/10 text-gold';
              }

              return (
                <button
                  key={letter}
                  onClick={() => handleSelect(letter)}
                  disabled={confirmed}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${optionClass} ${!confirmed ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Letter badge */}
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    confirmed && isCorrect ? 'bg-emerald-500/20 text-emerald-400' :
                    confirmed && isSelected && !isCorrect ? 'bg-red-500/20 text-red-400' :
                    isSelected ? 'bg-gold/20 text-gold' : 'bg-white/5 text-slate-500'
                  }`}>
                    {letter}
                  </span>
                  <span>{option.substring(3)}</span>
                  {confirmed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />}
                  {confirmed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 btn-gold justify-center py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar Respuesta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 btn-gold py-3 text-sm"
          >
            {currentIdx + 1 >= total ? 'Ver Resultados' : 'Siguiente Pregunta'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleRestart}
          title="Reiniciar quiz"
          className="px-4 flex items-center justify-center glass rounded-xl text-slate-500 hover:text-gold border border-white/5 hover:border-gold/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
