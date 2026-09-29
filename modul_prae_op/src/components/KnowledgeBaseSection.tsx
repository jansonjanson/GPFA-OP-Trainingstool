import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Activity, Utensils, Bath, ClipboardCheck, BookOpen, FileText, AlertCircle, TestTube, ChevronDown, CheckCircle, RotateCcw, Check, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import { playSound } from '../utils/audio';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
  onNuggetComplete: (index: number) => void;
  completedNuggets: Record<number, boolean>;
  onAchievement?: (title: string, desc: string) => void;
}

// --- Shared Utility ---
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// --- Lightbox Component for Medical Figures ---
function LightboxImage({ src, fallbackSrc, alt, className }: { src: string; fallbackSrc?: string; alt: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <>
      <div className="relative group inline-block cursor-pointer" onClick={() => setIsOpen(true)}>
        <img 
          src={currentSrc} 
          alt={alt} 
          onError={() => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            }
          }}
          className={`${className} transition-transform duration-200 group-hover:scale-[1.02]`}
        />
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
          <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <ZoomIn className="w-3 h-3" />
            <span>Klicken zum Vergrößern</span>
          </span>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={currentSrc} 
                alt={alt} 
                className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto" 
              />
              <div className="p-3 text-center text-xs text-slate-700 font-medium flex items-center justify-between">
                <span>{alt}</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold transition-colors cursor-pointer"
                >
                  Schließen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper to gently scroll to an unlocked Learning Nugget without jumping
export function scrollToLearningNugget(nuggetId: string) {
  const el = document.getElementById(nuggetId);
  if (el) {
    const btn = el.querySelector('button');
    if (btn && btn.getAttribute('data-isopen') !== 'true') {
      btn.click();
    }
    // Allow accordion opening to stabilize before scrolling gently to the top of the nugget
    setTimeout(() => {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: 'smooth'
      });
    }, 80);
  }
}

// --- Independent Learning Nugget Accordion ---
function LearningNugget({ id, title, children, isVisible }: { id?: string; title: string; children: React.ReactNode; isVisible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!isVisible) return null;
  
  return (
    <div id={id} className="mt-5 rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white overflow-hidden shadow-xs scroll-mt-24">
      <button 
        type="button"
        data-isopen={isOpen ? 'true' : 'false'}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-indigo-950 bg-indigo-100/60 hover:bg-indigo-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base">Learning Nugget: {title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full border border-indigo-200">
            {isOpen ? 'Einklappen' : 'Freigespielt • Aufklappen'}
          </span>
          <ChevronDown className={`w-5 h-5 text-indigo-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 text-sm text-slate-800 leading-relaxed bg-white border-t border-indigo-100/80">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Quiz Feedback Banner ---
function QuizFeedback({ 
  status, 
  feedback, 
  onRetry,
  nuggetId,
  nuggetTitle
}: { 
  status: 'idle' | 'correct' | 'incorrect'; 
  feedback: string; 
  onRetry?: () => void;
  nuggetId?: string;
  nuggetTitle?: string;
}) {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 8, height: 0 }} 
          animate={{ opacity: 1, y: 0, height: 'auto' }} 
          exit={{ opacity: 0, y: 8, height: 0 }}
          className="mt-4 overflow-hidden relative z-10"
        >
          <div className={`p-4 rounded-xl border-2 flex flex-col space-y-2.5 text-sm font-medium shadow-xs ${
            status === 'correct' 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
              : 'bg-rose-50 border-rose-500 text-rose-950'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {status === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <span className="leading-relaxed">{feedback}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/50">
              {status === 'correct' && nuggetId ? (
                <button
                  type="button"
                  onClick={() => scrollToLearningNugget(nuggetId)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Zum freigeschalteten Learning Nugget</span>
                </button>
              ) : <div></div>}

              {onRetry && (
                <button 
                  type="button"
                  onClick={onRetry}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    status === 'correct' 
                      ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' 
                      : 'bg-rose-200 hover:bg-rose-300 text-rose-900'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Aufgabe wiederholen & neu mischen</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// THEMA 1: GRUNDLAGEN & RECHTLICHES
// ==========================================

// Quiz 1: Lückentext Definition
function QuizLueckentext({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [answers, setAnswers] = useState<string[]>(isDone ? ['präoperative', 'Tätigkeiten', 'vor', 'optimal', 'Risiken'] : ['', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');
  
  const correctAnswers = useMemo(() => ['präoperative', 'Tätigkeiten', 'vor', 'optimal', 'Risiken'], []);
  const initialPool = useMemo(() => ['postoperative', 'Risiken', 'nach', 'präoperative', 'Tätigkeiten', 'optimal', 'vor', 'Bedenken'], []);
  const [options, setOptions] = useState(() => shuffleArray(initialPool));

  const handleDrop = (index: number, word: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    const newAnswers = [...answers];
    newAnswers[index] = word;
    setAnswers(newAnswers);
  };

  const handleSelectWord = (word: string) => {
    if (status === 'correct') return;
    const firstEmpty = answers.findIndex(a => a === '');
    if (firstEmpty !== -1) {
      handleDrop(firstEmpty, word);
    }
  };

  const checkAnswers = () => {
    if (answers.every((a, i) => a === correctAnswers[i])) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => {
    setStatus('idle');
    setAnswers(['', '', '', '', '']);
    setOptions(shuffleArray(initialPool));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-blue-100/90 border-l-4 border-blue-600 p-4 rounded-r-xl mb-5 text-blue-950 shadow-xs">
        <Brain className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-blue-700 block mb-1">
            Quiz 1 • Definition der präoperativen Pflege
          </span>
          Definieren Sie die präoperative Pflege. Ziehen Sie die Begriffe in die Lücken oder klicken Sie darauf.
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <span 
            key={i} 
            onClick={() => handleSelectWord(opt)}
            draggable 
            onDragStart={(e) => e.dataTransfer.setData('text/plain', opt)}
            className="px-3.5 py-1.5 bg-white border-2 border-blue-300 hover:border-blue-500 rounded-full text-blue-800 font-bold text-xs sm:text-sm cursor-grab active:cursor-grabbing hover:bg-blue-50 shadow-xs transition-all active:scale-95"
          >
            {opt}
          </span>
        ))}
      </div>

      <div className="p-4 bg-white/95 rounded-xl border-2 border-blue-100 text-slate-800 leading-loose text-xs sm:text-sm shadow-inner">
        Unter dem Begriff „
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2.5 pb-0.5 transition-colors ${
            answers[0] 
              ? status === 'correct' 
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold rounded-t'
                : status === 'incorrect' && answers[0] !== correctAnswers[0]
                ? 'border-rose-500 text-rose-800 bg-rose-50 font-bold rounded-t'
                : 'border-blue-500 text-blue-800 bg-blue-50 font-bold rounded-t'
              : 'border-slate-300 text-slate-400 border-dashed'
          }`}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleDrop(0, e.dataTransfer.getData('text/plain'))}
          onClick={() => { if (answers[0] && status !== 'correct') { const next = [...answers]; next[0] = ''; setAnswers(next); } }}
        >{answers[0] || '___'}</span>
        Pflege“ versteht man alle pflegerischen 
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2.5 pb-0.5 transition-colors ${
            answers[1] 
              ? status === 'correct' 
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold rounded-t'
                : status === 'incorrect' && answers[1] !== correctAnswers[1]
                ? 'border-rose-500 text-rose-800 bg-rose-50 font-bold rounded-t'
                : 'border-blue-500 text-blue-800 bg-blue-50 font-bold rounded-t'
              : 'border-slate-300 text-slate-400 border-dashed'
          }`}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleDrop(1, e.dataTransfer.getData('text/plain'))}
          onClick={() => { if (answers[1] && status !== 'correct') { const next = [...answers]; next[1] = ''; setAnswers(next); } }}
        >{answers[1] || '___'}</span>
        und Handlungen, die 
        <span 
          className={`inline-block min-w-[80px] text-center border-b-2 mx-1 px-2.5 pb-0.5 transition-colors ${
            answers[2] 
              ? status === 'correct' 
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold rounded-t'
                : status === 'incorrect' && answers[2] !== correctAnswers[2]
                ? 'border-rose-500 text-rose-800 bg-rose-50 font-bold rounded-t'
                : 'border-blue-500 text-blue-800 bg-blue-50 font-bold rounded-t'
              : 'border-slate-300 text-slate-400 border-dashed'
          }`}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleDrop(2, e.dataTransfer.getData('text/plain'))}
          onClick={() => { if (answers[2] && status !== 'correct') { const next = [...answers]; next[2] = ''; setAnswers(next); } }}
        >{answers[2] || '___'}</span>
        einer Operation durchgeführt werden. Ziel der präoperativen Phase ist es, den Patienten 
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2.5 pb-0.5 transition-colors ${
            answers[3] 
              ? status === 'correct' 
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold rounded-t'
                : status === 'incorrect' && answers[3] !== correctAnswers[3]
                ? 'border-rose-500 text-rose-800 bg-rose-50 font-bold rounded-t'
                : 'border-blue-500 text-blue-800 bg-blue-50 font-bold rounded-t'
              : 'border-slate-300 text-slate-400 border-dashed'
          }`}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleDrop(3, e.dataTransfer.getData('text/plain'))}
          onClick={() => { if (answers[3] && status !== 'correct') { const next = [...answers]; next[3] = ''; setAnswers(next); } }}
        >{answers[3] || '___'}</span>
        auf die geplante Operation vorzubereiten und dadurch mögliche 
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2.5 pb-0.5 transition-colors ${
            answers[4] 
              ? status === 'correct' 
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold rounded-t'
                : status === 'incorrect' && answers[4] !== correctAnswers[4]
                ? 'border-rose-500 text-rose-800 bg-rose-50 font-bold rounded-t'
                : 'border-blue-500 text-blue-800 bg-blue-50 font-bold rounded-t'
              : 'border-slate-300 text-slate-400 border-dashed'
          }`}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleDrop(4, e.dataTransfer.getData('text/plain'))}
          onClick={() => { if (answers[4] && status !== 'correct') { const next = [...answers]; next[4] = ''; setAnswers(next); } }}
        >{answers[4] || '___'}</span>
        und Komplikationen nach Möglichkeit auszuschließen.
      </div>

      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={answers.some(a => a === '')} 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Satz prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Perfekt! Die Definition stimmt haargenau mit dem Fachstandard überein." : "Da ist noch ein Begriff an der falschen Stelle. Rote Lücken prüfen und erneut versuchen."} 
        onRetry={retry} 
      />
    </div>
  );
}

// Quiz 2: Flashcards
function QuizFlipCards({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>(
    isDone ? { '1': true, '2': true, '3': true, '4': true } : { '1': false, '2': false, '3': false, '4': false }
  );
  const [status, setStatus] = useState<'idle' | 'correct'>(isDone ? 'correct' : 'idle');

  const rawCards = useMemo(() => [
    { id: '1', front: 'Offene OP', back: 'Hautschnitt, bei dem z.B. Bauchdecke oder Thorax eröffnet wird.' },
    { id: '2', front: 'Minimalinvasiv', back: 'Endoskopischer Eingriff (z.B. Laparoskopie) mit dem Ziel kleinstmöglicher Verletzung von Haut und Weichteilen.' },
    { id: '3', front: 'Elektiv', back: 'Medizinisch indiziert, aber nicht umgehend erforderlich. Vorbereitungen oft ambulant, um stationäre Verweildauer zu kürzen.' },
    { id: '4', front: 'Notfall', back: 'Ungeplanter, dringlicher Eingriff. Bei fehlender Ansprechbarkeit greift der mutmaßliche Wille (Notfallindikation).' }
  ], []);

  const [cards, setCards] = useState(() => shuffleArray(rawCards));

  const toggleCard = (id: string) => {
    const nextFlipped = { ...flipped, [id]: !flipped[id] };
    setFlipped(nextFlipped);
    if (Object.values(nextFlipped).every(Boolean) && status !== 'correct') {
      setStatus('correct');
      onComplete();
    }
  };

  const retry = () => {
    setFlipped({ '1': false, '2': false, '3': false, '4': false });
    setStatus('idle');
    setCards(shuffleArray(rawCards));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-blue-100/90 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6 text-blue-950 shadow-xs">
        <Brain className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-blue-700 block mb-1">
            Quiz 2 • Flashcards: OP-Arten & Einteilung
          </span>
          Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet. Drehen Sie alle 4 Karten um, um die Aufgabe abzuschließen!
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(c => {
          const isFlipped = flipped[c.id];
          return (
            <div 
              key={c.id} 
              className="h-36 cursor-pointer group" 
              onClick={() => toggleCard(c.id)} 
              style={{ perspective: '1000px' }}
            >
              <div 
                className="relative w-full h-full transition-transform duration-500" 
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                <div 
                  className="absolute inset-0 bg-white border-2 border-blue-300 rounded-xl flex items-center justify-center p-4 shadow-sm group-hover:border-blue-500 group-hover:shadow-md transition-all" 
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="font-extrabold text-blue-900 text-base sm:text-lg text-center">{c.front}</span>
                </div>
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-xl flex items-center justify-center p-4 shadow-sm" 
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="font-semibold text-emerald-950 text-xs sm:text-sm text-center leading-relaxed">{c.back}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <QuizFeedback 
        status={status} 
        feedback="Super! Sie haben alle Karten umgedreht und die Begrifflichkeiten verinnerlicht." 
        onRetry={retry}
        nuggetId="nugget-einteilung"
        nuggetTitle="Einteilung von Operationen"
      />
    </div>
  );
}

// Quiz 3: Voruntersuchungen
function QuizVoruntersuchungen({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const correctAnswers = useMemo(() => ['Blutbild', 'Gerinnungsfaktoren', 'EKG', 'Röntgenthorax', 'Elektrolyte'], []);
  const initialPool = useMemo(() => ['Blutbild', 'Vitamin D-Spiegel', 'Gerinnungsfaktoren', 'Langzeit-Blutdruck', 'EKG', 'Röntgenthorax', 'MRT Kopf', 'Elektrolyte'], []);
  
  const [options, setOptions] = useState(() => shuffleArray(initialPool));
  const [bucket, setBucket] = useState<string[]>(isDone ? [...correctAnswers] : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const toggleItem = (item: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setBucket(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const checkAnswers = () => {
    const isCorrect = bucket.length === correctAnswers.length && correctAnswers.every(ans => bucket.includes(ans));
    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => {
    setStatus('idle');
    setBucket([]);
    setOptions(shuffleArray(initialPool));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-blue-100/90 border-l-4 border-blue-600 p-4 rounded-r-xl mb-4 text-blue-950 shadow-xs">
        <TestTube className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-blue-700 block mb-1">
            Quiz 3 • Präoperative Voruntersuchungen
          </span>
          Welche Untersuchungen gehören typischerweise (je nach Alter und Eingriff) zu den allgemeinen präoperativen Voruntersuchungen? Wählen Sie genau die 5 richtigen aus!
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(opt => {
          const inBucket = bucket.includes(opt);
          const isCorrect = correctAnswers.includes(opt);

          let btnStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
          if (status !== 'idle') {
            if (inBucket) {
              btnStyle = isCorrect 
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (isCorrect) {
              btnStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/60 text-emerald-900 font-semibold";
            }
          } else if (inBucket) {
            btnStyle = "border-blue-500 bg-blue-100 text-blue-950 font-bold shadow-xs";
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={status === 'correct'}
              onClick={() => toggleItem(opt)}
              className={`px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {inBucket && (
                status !== 'idle' ? (
                  isCorrect ? <Check className="w-4 h-4 inline-block ml-1.5 text-emerald-700" /> : <X className="w-4 h-4 inline-block ml-1.5 text-rose-700" />
                ) : (
                  <CheckCircle className="w-4 h-4 inline-block ml-1.5 text-blue-600" />
                )
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-white/70 min-h-[70px] flex flex-col items-center justify-center mb-4">
        {bucket.length === 0 ? (
          <span className="text-slate-400 text-xs sm:text-sm font-medium text-center">Klicken Sie oben auf die Untersuchungen, um sie hier auszuwählen</span>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {bucket.map(b => (
              <span key={b} className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-900 shadow-xs flex items-center">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers}
          disabled={bucket.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Auswahl überprüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Blutbild, Gerinnungsfaktoren, EKG, Röntgenthorax und Elektrolyte sind die Standarduntersuchungen." : "Nicht ganz. Überlegen Sie: Braucht man standardmäßig ein Kopf-MRT oder einen Vitamin-D-Spiegel für eine Routine-OP? Grün markiert ist richtig, rot falsch."} 
        onRetry={retry}
        nuggetId="nugget-voruntersuchungen"
        nuggetTitle="Präoperative Voruntersuchungen"
      />
    </div>
  );
}

// Quiz 4: Rechtliches Szenario 1
function QuizScenario1({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Sie lassen ihn unterschreiben, da er über 14 Jahre alt ist und einsichtsfähig wirkt.' },
    { id: 'b', text: 'Sie informieren den Arzt. Zwar können Jugendliche über 14 u. U. selbst einwilligen, aber der Arzt muss den Fall individuell bewerten und ggf. die Eltern telefonisch kontaktieren.' },
    { id: 'c', text: 'Sie als Pflegefachkraft klären ihn einfach schnell selbst auf, damit der Zettel unterschrieben ist.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));

  const checkAnswer = () => {
    if (selected === 'b') {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => {
    setStatus('idle');
    setSelected(null);
    setOptions(shuffleArray(rawOptions));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-blue-100/90 border-l-4 border-blue-600 p-4 rounded-r-xl mb-4 text-blue-950 shadow-xs">
        <Brain className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-blue-700 block mb-1">
            Quiz 4 • Rechtliches Szenario 1: OP-Einwilligung Minderjährige
          </span>
          Ein 15-jähriger Patient kommt mit Verdacht auf akute Appendizitis (Blinddarmentzündung) zur Aufnahme. Es ist eine dringliche OP, aber es bleibt noch Zeit zur Abwägung. Seine Eltern sind im Urlaub. Er möchte den Aufklärungsbogen zur Narkose selbst unterschreiben. Was tun Sie?
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected === opt.id;
          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

          if (status !== 'idle') {
            if (isSelected) {
              optStyle = opt.id === 'b'
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (opt.id === 'b') {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-blue-500 bg-blue-50 text-blue-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${optStyle}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswer} 
          disabled={!selected} 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Antwort prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Jugendliche über 14 können einsichtsfähig sein, aber der Arzt entscheidet im Einzelfall und muss die Schwere des Eingriffs berücksichtigen." : "Das ist leider nicht richtig. Denken Sie an den Arztvorbehalt und den Schutz Minderjähriger."} 
        onRetry={retry} 
        nuggetId="nugget-recht"
        nuggetTitle="Rechtliche Grundlagen & Aufklärung"
      />
    </div>
  );
}

// Quiz 5: Rechtliches Szenario 2
function QuizScenario2({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Sie händigen der Patientin den Bogen aus, erklären kurz den Ablauf und lassen sie unterschreiben.' },
    { id: 'b', text: 'Sie weigern sich. Das ärztliche Aufklärungsgespräch (sowohl chirurgisch als auch anästhesiologisch) ist nicht an Pflegefachkräfte delegierbar. Zudem fehlt die gesetzliche Bedenkzeit.' },
    { id: 'c', text: 'Sie informieren die Anästhesie und verschieben die Operation eigenmächtig auf morgen.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));

  const checkAnswer = () => {
    if (selected === 'b') {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => {
    setStatus('idle');
    setSelected(null);
    setOptions(shuffleArray(rawOptions));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-blue-100/90 border-l-4 border-blue-600 p-4 rounded-r-xl mb-4 text-blue-950 shadow-xs">
        <Brain className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-blue-700 block mb-1">
            Quiz 5 • Rechtliches Szenario 2: Ärztliche Aufklärung
          </span>
          Ihnen fällt auf, dass eine Patientin, die für heute zu einer elektiven Operation geplant ist, noch nicht aufgeklärt wurde. Telefonisch teilt Ihnen der zuständige Oberarzt mit, dass er gerade im OP steht. Sie sollen der Patientin den Aufklärungsbogen aushändigen, kurz erklären was passiert und sie unterschreiben lassen. Wie reagieren Sie korrekt?
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected === opt.id;
          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

          if (status !== 'idle') {
            if (isSelected) {
              optStyle = opt.id === 'b'
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (opt.id === 'b') {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-blue-500 bg-blue-50 text-blue-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${optStyle}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswer} 
          disabled={!selected} 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Antwort prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Die Aufklärung muss durch einen Arzt erfolgen und ist nicht delegierbar (§ 630e BGB). Zudem muss der Patientin Bedenkzeit gewährt werden." : "Falsch! Die Aufklärungspflicht unterliegt dem strengen Arztvorbehalt."} 
        onRetry={retry} 
        nuggetId="nugget-recht"
        nuggetTitle="Rechtliche Grundlagen & Aufklärung"
      />
    </div>
  );
}

// ==========================================
// THEMA 2: PRÄHABILITATION
// ==========================================

// Quiz 6: Multi Select Fähigkeiten
function QuizFaehigkeiten({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const correctAnswers = useMemo(() => ['a', 'b', 'd', 'e'], []);
  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Atemübungen / Einsatz eines Atemtrainers' },
    { id: 'b', text: 'En-bloc-Aufstehen aus dem Bett' },
    { id: 'c', text: 'Eigenständig mit dem i. v. - Zugang umgehen können' },
    { id: 'd', text: 'Korrekte Anwendung von Hilfsmitteln (z. B. Unterarmgehstützen)' },
    { id: 'e', text: 'Patientenkontrollierte Analgesie (PCA) / Schmerzpumpe bedienen' },
    { id: 'f', text: 'Das chirurgische OP-Besteck auswendig benennen' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const toggleSelect = (id: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const checkAnswers = () => {
    const isCorrect = selected.length === correctAnswers.length && correctAnswers.every(ans => selected.includes(ans));
    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => { 
    setStatus('idle'); 
    setSelected([]); 
    setOptions(shuffleArray(rawOptions)); 
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white rounded-2xl border-2 border-emerald-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-emerald-100/90 border-l-4 border-emerald-600 p-4 rounded-r-xl mb-4 text-emerald-950 shadow-xs">
        <Activity className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-emerald-700 block mb-1">
            Quiz 6 • Prähabilitation: Postoperative Fähigkeiten einüben
          </span>
          Welche Maßnahmen sind für die Zeit NACH der Operation relevant und sollten präoperativ (Prähabilitation) eingeübt werden? (Wählen Sie die 4 korrekten Optionen)
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected.includes(opt.id);
          const isCorrect = correctAnswers.includes(opt.id);

          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
          if (status !== 'idle') {
            if (isSelected) {
              optStyle = isCorrect
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (isCorrect) {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => toggleSelect(opt.id)} 
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
            >
              <span>{opt.text}</span>
              {isSelected && (
                status !== 'idle' ? (
                  isCorrect ? <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" /> : <X className="w-4 h-4 text-rose-700 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                )
              )}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={selected.length === 0}
          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Auswahl überprüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Atemübungen, En-bloc-Aufstehen, Hilfsmittel und PCA-Pumpe sind wichtige Schulungsinhalte der Prähabilitation." : "Fehlerhaft! Wählen Sie genau 4 Optionen aus, die der Patient wirklich selbst erlernen muss. Grün ist richtig, rot falsch."} 
        onRetry={retry} 
        nuggetId="nugget-faehigkeiten"
        nuggetTitle="Fähigkeiten präoperativ üben"
      />
    </div>
  );
}

// ==========================================
// THEMA 3: NÜCHTERNHEIT & ABFÜHREN
// ==========================================

// Quiz 7: Nüchternheit
function QuizNuechternheit({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const correctAnswers = useMemo(() => ['b', 'c'], []);
  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Ein 5-jähriges Kind verschluckt 2 Stunden vor OP versehentlich beim Zähneputzen einen halben Becher klares Wasser.' },
    { id: 'b', text: 'Ein Kind isst 2 Stunden vor OP heimlich einen Schokoriegel.' },
    { id: 'c', text: 'Eine Patientin trinkt 3 Stunden vor OP einen Cappuccino mit Milch.' },
    { id: 'd', text: 'Ein Säugling (< 1 Jahr) wird 5 Stunden vor OP mit Formulanahrung (Flasche) gefüttert.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const checkAnswers = () => {
    const isCorrect = selected.length === correctAnswers.length && correctAnswers.every(ans => selected.includes(ans));
    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const toggleSelect = (id: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const retry = () => {
    setStatus('idle');
    setSelected([]);
    setOptions(shuffleArray(rawOptions));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white rounded-2xl border-2 border-amber-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-amber-100/90 border-l-4 border-amber-600 p-4 rounded-r-xl mb-4 text-amber-950 shadow-xs">
        <Utensils className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-amber-700 block mb-1">
            Quiz 7 • Nüchternheitsregeln im klinischen Alltag
          </span>
          Welche Situationen führen zu einer Unterbrechung der Nüchternheit und gefährden die OP-Freigabe? (Wählen Sie die 2 zutreffenden Situationen)
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected.includes(opt.id);
          const isCorrect = correctAnswers.includes(opt.id);

          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
          if (status !== 'idle') {
            if (isSelected) {
              optStyle = isCorrect
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (isCorrect) {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => toggleSelect(opt.id)} 
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
            >
              <span>{opt.text}</span>
              {isSelected && (
                status !== 'idle' ? (
                  isCorrect ? <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" /> : <X className="w-4 h-4 text-rose-700 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )
              )}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={selected.length === 0}
          className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Schokoriegel (feste Nahrung: 6h) und Milchkaffee (Milch = Nahrung) unterbrechen die Nüchternheit. Klares Wasser bis 2h und Formulanahrung bis 4–6h sind erlaubt." : "Nicht ganz richtig. Denken Sie an die 6-Stunden-Regel für feste Nahrung/Milch und die 2-Stunden-Regel für klare Flüssigkeit."} 
        onRetry={retry} 
        nuggetId="nugget-nuechternheit"
        nuggetTitle="Nüchternheit & präoperatives Abführen"
      />
    </div>
  );
}

// Quiz 8: Abführen Wahr oder Falsch
function QuizAbfuhren({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': false, '2': true, '3': true } : { '1': null, '2': null, '3': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawStatements = useMemo(() => [
    { id: '1', text: 'Eine orthograde Darmlavage (z.B. 4 Liter trinken zum Durchspülen) wird heute bei fast jeder OP durchgeführt.', correct: false },
    { id: '2', text: 'Bei Eingriffen außerhalb des Intestinaltrakts (z.B. Knie-OP) wird manchmal am Vorabend ein Microklist verabreicht, um eine Darmentleerung während der Narkose zu vermeiden.', correct: true },
    { id: '3', text: 'Ob abgeführt wird, hängt stark vom geplanten Eingriff und dem Hausstandard der Klinik ab.', correct: true }
  ], []);

  const [statements, setStatements] = useState(() => shuffleArray(rawStatements));

  const checkAnswers = () => {
    const isCorrect = statements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { 
      setStatus('correct'); 
      onComplete(); 
    } else { 
      setStatus('incorrect'); 
      playSound('error'); 
    }
  };

  const retry = () => {
    setStatus('idle');
    setAnswers({ '1': null, '2': null, '3': null });
    setStatements(shuffleArray(rawStatements));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white rounded-2xl border-2 border-amber-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-amber-100/90 border-l-4 border-amber-600 p-4 rounded-r-xl mb-4 text-amber-950 shadow-xs">
        <Utensils className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-amber-700 block mb-1">
            Quiz 8 • Wahr oder Falsch: Präoperatives Abführen
          </span>
          Bewerten Sie die Aussagen zum präoperativen Abführen als Wahr oder Falsch.
        </div>
      </div>
      <div className="space-y-3">
        {statements.map(s => {
          const userVal = answers[s.id];
          const isEvaluated = status !== 'idle';
          const isUserCorrect = userVal === s.correct;

          return (
            <div key={s.id} className="p-4 rounded-xl border-2 border-slate-200 bg-white/90 shadow-2xs">
              <p className="font-medium text-slate-800 text-xs sm:text-sm mb-3">{s.text}</p>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  disabled={status === 'correct'} 
                  onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} 
                  className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs transition-all cursor-pointer ${
                    userVal === true 
                      ? isEvaluated
                        ? isUserCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300' : 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-300'
                        : 'border-amber-500 bg-amber-50 text-amber-950' 
                      : isEvaluated && s.correct === true
                      ? 'border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Wahr
                </button>
                <button 
                  type="button"
                  disabled={status === 'correct'} 
                  onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} 
                  className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs transition-all cursor-pointer ${
                    userVal === false 
                      ? isEvaluated
                        ? isUserCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300' : 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-300'
                        : 'border-amber-500 bg-amber-50 text-amber-950' 
                      : isEvaluated && s.correct === false
                      ? 'border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Falsch
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={Object.values(answers).some(a => a === null)} 
          className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Bewertungen prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Alle korrekt bewertet! Orthograde Darmlavagen sind heute selten; Mikro-Klistiere werden indikationsbezogen eingesetzt." : "Einige Aussagen sind noch falsch bewertet. Bitte die farbigen Rückmeldungen beachten."} 
        onRetry={retry} 
        nuggetId="nugget-nuechternheit"
        nuggetTitle="Nüchternheit & präoperatives Abführen"
      />
    </div>
  );
}

// ==========================================
// THEMA 4: KÖRPERPFLEGE & SCHMUCK
// ==========================================

// Quiz 9: Körperpflege, Schmuck & Nabel
function QuizPflege({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': false, '2': false, '3': true, '4': true, '5': false, '6': true, '7': true } : { '1': null, '2': null, '3': null, '4': null, '5': null, '6': null, '7': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawStatements = useMemo(() => [
    { id: '1', text: 'Zahnprothesen, Brillen und Hörgeräte werden IMMER zusammen im Zimmer belassen, damit der Patient im OP nichts verliert.', correct: false },
    { id: '2', text: 'Make-up und Körperlotion/Parfüm sind vor der OP unproblematisch.', correct: false },
    { id: '3', text: 'Ein sehr fester Ehering darf unter Umständen in der Praxis mit Pflaster abgeklebt werden, obwohl das Tragen von Schmuck streng vermieden werden sollte.', correct: true },
    { id: '4', text: 'Schmuck und Piercings (Metalle) bergen bei Einsatz der Hochfrequenz-Chirurgie das Risiko thermischer Verbrennungen.', correct: true },
    { id: '5', text: 'Haarentfernung sollte am besten 2 Tage vor der OP mit einem Nassrasierer erfolgen.', correct: false },
    { id: '6', text: 'Die Haarentfernung im OP-Gebiet sollte idealerweise erst unmittelbar vor dem Eingriff (am OP-Tag mit Clipper) und keinesfalls am Vorabend erfolgen.', correct: true },
    { id: '7', text: 'Bei abdominellen Eingriffen (z. B. Cholezystektomie) muss der Bauchnabel gezielt von Talg, Keimen und Ablagerungen gereinigt werden.', correct: true }
  ], []);

  const [statements, setStatements] = useState(() => shuffleArray(rawStatements));

  const checkAnswers = () => {
    const isCorrect = statements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { 
      setStatus('correct'); 
      onComplete(); 
    } else { 
      setStatus('incorrect'); 
      playSound('error'); 
    }
  };

  const retry = () => {
    setStatus('idle');
    setAnswers({ '1': null, '2': null, '3': null, '4': null, '5': null, '6': null, '7': null });
    setStatements(shuffleArray(rawStatements));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-cyan-50/70 via-teal-50/40 to-white rounded-2xl border-2 border-cyan-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-cyan-100/90 border-l-4 border-cyan-600 p-4 rounded-r-xl mb-4 text-cyan-950 shadow-xs">
        <Bath className="w-6 h-6 text-cyan-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-cyan-700 block mb-1">
            Quiz 9 • Wahr oder Falsch: Körperpflege, Schmuck, Haare & Nabel
          </span>
          Beurteilen Sie jede Aussage zu Körperpflege, Haarentfernung und Schmuck am OP-Tag:
        </div>
      </div>
      <div className="space-y-3">
        {statements.map(s => {
          const userVal = answers[s.id];
          const isEvaluated = status !== 'idle';
          const isUserCorrect = userVal === s.correct;

          return (
            <div key={s.id} className="p-4 rounded-xl border-2 border-slate-200 bg-white/90 shadow-2xs">
              <p className="font-medium text-slate-800 text-xs sm:text-sm mb-3">{s.text}</p>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  disabled={status === 'correct'} 
                  onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} 
                  className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs transition-all cursor-pointer ${
                    userVal === true 
                      ? isEvaluated
                        ? isUserCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300' : 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-300'
                        : 'border-cyan-500 bg-cyan-50 text-cyan-950' 
                      : isEvaluated && s.correct === true
                      ? 'border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Wahr
                </button>
                <button 
                  type="button"
                  disabled={status === 'correct'} 
                  onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} 
                  className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs transition-all cursor-pointer ${
                    userVal === false 
                      ? isEvaluated
                        ? isUserCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300' : 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-300'
                        : 'border-cyan-500 bg-cyan-50 text-cyan-950' 
                      : isEvaluated && s.correct === false
                      ? 'border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Falsch
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={Object.values(answers).some(a => a === null)} 
          className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Aussagen überprüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Korrekt! Haarentfernung erst unmittelbar präoperativ (Clipper), Nabel gründlich säubern, Lotionen meiden und Schmuck ablegen (Verbrennungsgefahr)." : "Überprüfen Sie Ihre Eingaben. Es gibt hier einige wichtige Mythen aufzudecken."} 
        onRetry={retry} 
        nuggetId="nugget-koerperpflege"
        nuggetTitle="Körperpflege und Vorbereitung im Zimmer"
      />
    </div>
  );
}

// ==========================================
// THEMA 5: MEDIKATION & TRANSPORT
// ==========================================

// Quiz 10: Thromboseprophylaxe
function QuizThrombose({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Heparin als Spritze am Morgen der Operation ist zwingend.' },
    { id: 'b', text: 'Am OP-Tag gibt es KEINE medikamentöse Prophylaxe (z.B. Heparin). MTS (Strümpfe) werden angezogen (Größe ausmessen!).' },
    { id: 'c', text: 'Thromboseprophylaxe erfolgt ausschließlich postoperativ durch Mobilisation.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));

  const checkAnswers = () => { 
    if (selected === 'b') { 
      setStatus('correct'); 
      onComplete(); 
    } else { 
      setStatus('incorrect'); 
      playSound('error'); 
    } 
  };

  const retry = () => {
    setStatus('idle');
    setSelected(null);
    setOptions(shuffleArray(rawOptions));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-2xl border-2 border-indigo-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-indigo-100/90 border-l-4 border-indigo-600 p-4 rounded-r-xl mb-4 text-indigo-950 shadow-xs">
        <Brain className="w-6 h-6 text-indigo-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-indigo-700 block mb-1">
            Quiz 10 • Thromboseprophylaxe am OP-Tag
          </span>
          Wie erfolgt die Thromboseprophylaxe am OP-Tag präoperativ?
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected === opt.id;
          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

          if (status !== 'idle') {
            if (isSelected) {
              optStyle = opt.id === 'b'
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (opt.id === 'b') {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-indigo-500 bg-indigo-50 text-indigo-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }} 
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${optStyle}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={!selected} 
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Richtig! Heparin wird am OP-Tag morgens wegen Blutungsgefahr weggelassen. MTS (Strümpfe) sind Standard und müssen ausgemessen werden." : "Falsch. Denken Sie an die akute Blutungsgefahr im OP."} 
        onRetry={retry} 
        nuggetId="nugget-dauermedikation"
        nuggetTitle="Dauermedikation & Allergie-Management"
      />
    </div>
  );
}

// Quiz 11: Dauermedikation & Allergien
function QuizDauermedikation({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Alle Dauermedikamente (auch Antidiabetika wie Metformin) müssen am OP-Morgen regulär mit viel Wasser geschluckt werden, damit keine Entzugssymptome auftreten.' },
    { id: 'b', text: 'Orale Antidiabetika (wie Metformin) werden bei Nüchternheit pausiert (Gefahr von Hypoglykämie/Laktatazidose). Lebenswichtige Herz-Kreislauf-Medikamente werden nur nach ärztlicher Anästhesievorgabe mit einem winzigen Schluck Wasser eingenommen. Allergien (Latex, Pflaster, Penicillin) müssen zwingend vorab dokumentiert und per rotem Armband gekennzeichnet werden.' },
    { id: 'c', text: 'Wegen der Nüchternheitsgrenze darf absolut keine Tablette genommen werden, selbst wenn der Anästhesist die morgendliche Betablocker-Gabe schriftlich angeordnet hat.' },
    { id: 'd', text: 'Allergien spielen erst während des Schnitts im OP eine Rolle und müssen auf Normalstation nicht erfasst oder markiert werden.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));

  const checkAnswers = () => { 
    if (selected === 'b') { 
      setStatus('correct'); 
      onComplete(); 
    } else { 
      setStatus('incorrect'); 
      playSound('error'); 
    } 
  };

  const retry = () => {
    setStatus('idle');
    setSelected(null);
    setOptions(shuffleArray(rawOptions));
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-2xl border-2 border-indigo-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-indigo-100/90 border-l-4 border-indigo-600 p-4 rounded-r-xl mb-4 text-indigo-950 shadow-xs">
        <Brain className="w-6 h-6 text-indigo-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-indigo-700 block mb-1">
            Quiz 11 • Fall-Entscheidung: Dauermedikation & Allergien am OP-Morgen
          </span>
          Frau Meinhardt fragt Sie: <em>„Schwester, ich nehme morgens immer mein Metformin gegen den Diabetes und meine Blutdrucktablette. Soll ich die jetzt schnell noch schlucken? Und der Pfleger gestern sprach von einer Kennzeichnung meiner Pflaster- und Penicillinallergie...“</em> Was ist fachlich korrekt?
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected === opt.id;
          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

          if (status !== 'idle') {
            if (isSelected) {
              optStyle = opt.id === 'b'
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (opt.id === 'b') {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-indigo-500 bg-indigo-50 text-indigo-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }} 
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${optStyle}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={!selected} 
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Hervorragend! Antidiabetika werden bei Nüchternheit pausiert (Hypoglykämie- & Laktatazidosegefahr), essenzielle Medikation nach Anästhesievorgabe (Schluck Wasser) genommen und Allergien vorab mit Allergiearmband & Dokumentation gesichert." : "Falsch. Denken Sie an die Hypoglykämiegefahr bei Antidiabetika und das Risiko unentdeckter Allergien im OP (z.B. Latex oder Pflaster)."} 
        onRetry={retry} 
        nuggetId="nugget-dauermedikation"
        nuggetTitle="Dauermedikation & Allergie-Management"
      />
    </div>
  );
}

// Quiz 12: Multiple Choice Prämedikation
function QuizPraemedikation({ onComplete, isDone }: { onComplete: () => void; isDone: boolean }) {
  const correctAnswers = useMemo(() => ['a', 'b', 'c', 'e'], []);
  const rawOptions = useMemo(() => [
    { id: 'a', text: 'Kontrolle der korrekten Haarentfernung im OP-Gebiet.' },
    { id: 'b', text: 'Überprüfung des Patientenidentifikationsarmbands.' },
    { id: 'c', text: 'Nachfragen, ob Patient:in nochmals zur Toilette möchte.' },
    { id: 'd', text: 'Eigenständige Durchführung der ärztlichen Aufklärung durch die Pflegekraft.' },
    { id: 'e', text: 'Prüfen, ob frische OP-Kleidung und MTS (Thrombosestrümpfe) getragen werden.' },
    { id: 'f', text: 'Durchführung eines ausgiebigen Mobilisationstests auf dem Stationsflur unmittelbar nach Schlucken der Tablette.' }
  ], []);

  const [options, setOptions] = useState(() => shuffleArray(rawOptions));
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const toggleSelect = (id: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const checkAnswers = () => {
    const isCorrect = selected.length === correctAnswers.length && correctAnswers.every(ans => selected.includes(ans));
    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => { 
    setStatus('idle'); 
    setSelected([]); 
    setOptions(shuffleArray(rawOptions)); 
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-2xl border-2 border-indigo-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 bg-indigo-100/90 border-l-4 border-indigo-600 p-4 rounded-r-xl mb-4 text-indigo-950 shadow-xs">
        <Brain className="w-6 h-6 text-indigo-700 flex-shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">
          <span className="uppercase tracking-wider text-xs font-bold text-indigo-700 block mb-1">
            Quiz 12 • Patientensicherheit vor der Prämedikation (Mehrere Antworten)
          </span>
          Was muss zwingend VOR der Verabreichung der Prämedikation (Beruhigungs-/Schmerzmittel am OP-Morgen) kontrolliert oder erledigt werden? (Wählen Sie genau die 4 korrekten Maßnahmen)
        </div>
      </div>
      <div className="space-y-2.5">
        {options.map(opt => {
          const isSelected = selected.includes(opt.id);
          const isCorrect = correctAnswers.includes(opt.id);

          let optStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
          if (status !== 'idle') {
            if (isSelected) {
              optStyle = isCorrect
                ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-300"
                : "border-rose-500 bg-rose-100 text-rose-950 font-bold ring-2 ring-rose-300";
            } else if (isCorrect) {
              optStyle = "border-2 border-dashed border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold";
            }
          } else if (isSelected) {
            optStyle = "border-indigo-500 bg-indigo-50 text-indigo-950 font-bold shadow-xs";
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => toggleSelect(opt.id)} 
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
            >
              <span>{opt.text}</span>
              {isSelected && (
                status !== 'idle' ? (
                  isCorrect ? <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" /> : <X className="w-4 h-4 text-rose-700 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                )
              )}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers} 
          disabled={selected.length === 0}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Antworten prüfen
        </button>
      )}
      <QuizFeedback 
        status={status} 
        feedback={status === 'correct' ? "Exakt gelöst! Die 4 richtigen Schritte sind: Haarentfernung kontrollieren, Identitätsarmband prüfen, Toilettengang anbieten (vor Sedierung!) und OP-Hemd/MTS prüfen. Die Aufklärung obliegt dem Arzt, und nach der Beruhigungstablette gilt strikte Bettruhe wegen akuter Sturzgefahr!" : "Nicht ganz. Richtig sind: Haare, Armband, Toilette und OP-Kleidung/MTS. Falsch sind: Die Aufklärung durch Pflegekräfte (Arztvorbehalt!) und das Herumlaufen nach der Tablette (Sturzgefahr!). Grün ist richtig, rot falsch."} 
        onRetry={retry} 
        nuggetId="nugget-praemedikation"
        nuggetTitle="Prämedikation & Transport"
      />
    </div>
  );
}

// ==========================================
// HAUPTKOMPONENTE KNOWLEDGEBASE SECTION
// ==========================================

export default function KnowledgeBaseSection({ onNavigate, onNuggetComplete, completedNuggets, onAchievement }: Props) {
  const requiredQuizzes = 12;
  const completedCount = Object.values(completedNuggets).filter(Boolean).length;
  const allCompleted = completedCount >= requiredQuizzes;

  useEffect(() => {
    if (allCompleted && onAchievement) {
      onAchievement("Wissens-Meister!", "Alle 12 Learning Nuggets erfolgreich absolviert! OP-Schleuse und Simulator sind freigeschaltet.");
    }
  }, [allCompleted, onAchievement]);

  return (
    <section className="max-w-5xl mx-auto w-full">
      {/* Header & Arbeitsauftrag */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          2. Die Wissens-Base (Nuggets)
        </h2>
        <ModuleMeta 
          time="Doppelstunde 5" 
          mode="Einzel- oder Partnerarbeit" 
          goal="Fachwissen aufbauen & alle 12 Learning Nuggets freispielen" 
        />
        
        {/* Originalgetreuer Arbeitsauftrag */}
        <div className="mt-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-2 border-blue-200 p-6 rounded-3xl text-left shadow-xs">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-sm mt-1 flex-shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-blue-950 text-lg">Arbeitsauftrag</h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                Bitte lesen Sie sich den folgenden Fachtext vollständig durch. Das Wissen benötigen Sie zur Bearbeitung der folgenden Aufgaben und Quizformate.
              </p>
              <p className="text-slate-700 text-xs sm:text-sm font-semibold">
                Sie können jederzeit im Skript nach Antworten suchen oder unseren KI-Helfer fragen, wenn Sie sich nicht sicher sind. Viel Erfolg!
              </p>
              <div className="pt-2">
                <a 
                  href="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/ICare%20Pflege%20pr%C3%A4%20OP%20Kapitel%20-%20Reduced.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>I Care Fachtext (Primärquelle) als PDF öffnen</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-10 text-left">
        
        {/* THEMA 1 */}
        <div className="flex flex-col items-center justify-center py-2 text-blue-600">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-200 to-blue-500 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
            Thema 1 von 5
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce text-blue-600 mt-1" />
        </div>

        <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-sm border-l-8 border-l-blue-600 border-2 border-blue-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3.5 border-b border-blue-100 pb-4">
              <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Thema 1
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Grundlagen & Rechtliches
                </h3>
              </div>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Starten wir mit den Grundlagen der präoperativen Pflege und Einteilungen von Operationen, sowie den rechtlichen Fallstricken rund um Aufklärung und Einwilligung.
            </p>

            <QuizLueckentext 
              onComplete={() => { onNuggetComplete(1); onAchievement?.("Definition gemeistert!", "Sie haben die Grundlagen der präoperativen Pflege fehlerfrei definiert."); }} 
              isDone={!!completedNuggets[1]} 
            />

            <QuizFlipCards 
              onComplete={() => { onNuggetComplete(2); onAchievement?.("Kategorien-Spezialist", "Die verschiedenen OP-Arten sitzen jetzt perfekt."); }} 
              isDone={!!completedNuggets[2]} 
            />

            <LearningNugget id="nugget-einteilung" title="Einteilung von Operationen" isVisible={!!completedNuggets[2]}>
              <p className="mb-2"><strong>Elektive Operation:</strong> „Elektiv“ bedeutet „auswählend“. In der Medizin sind mit elektiven Operationen solche gemeint, die medizinisch zwar indiziert sind, aber nicht umgehend durchgeführt werden müssen.</p>
              <p className="mb-4">Bei geplanten, nicht dringlichen Eingriffen (z. B. Knie-OP bei Arthrose), die vorbereitet werden können, werden die Voruntersuchungen und Aufklärungsgespräche heute meist ambulant durchgeführt, da so die stationäre Verweildauer kürzer ist.</p>
              
              <p className="mb-2"><strong>Notfalloperation:</strong> Bei einer Notfalloperation handelt es sich um einen ungeplanten, dringlichen Eingriff, der sich nicht aufschieben lässt, da das Leben des Patienten sonst akut gefährdet ist.</p>
              <p>Ist der Patient nicht ansprechbar und konnte nicht rechtzeitig eine Einwilligung eingeholt werden (z. B. Polytrauma mit Hirnblutung), kommt die mutmaßliche Einwilligung in Betracht (oft gefasst unter dem Begriff „Notfallindikation“).</p>
            </LearningNugget>
            
            <QuizVoruntersuchungen 
              onComplete={() => { onNuggetComplete(3); onAchievement?.("Voruntersuchungs-Profi", "Präoperative Standarduntersuchungen korrekt erkannt."); }} 
              isDone={!!completedNuggets[3]} 
            />

            <LearningNugget id="nugget-voruntersuchungen" title="Präoperative Voruntersuchungen" isVisible={!!completedNuggets[3]}>
              <p className="mb-2">Je nach Alter und Vorerkrankung des Patienten werden verschiedene klinische Untersuchungen angeordnet:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li><strong>Labor:</strong> Kleines/großes Blutbild, Blutgerinnung (Quick/INR, PTT), Elektrolyte, Kreuzblut.</li>
                <li><strong>EKG:</strong> Häufig ab einem bestimmten Alter oder bei kardiologischen Vorerkrankungen.</li>
                <li><strong>Röntgen-Thorax:</strong> Um Herz und Lunge vor der Narkose zu beurteilen.</li>
                <li><strong>Lungenfunktionstest:</strong> Bei bestehenden Atemwegserkrankungen (z.B. COPD).</li>
              </ul>
              <p className="text-xs text-slate-500 italic">Quelle: I Care Pflege, perioperative Phase, „Klinische Voruntersuchungen“.</p>
            </LearningNugget>
            
            <QuizScenario1 
              onComplete={() => { onNuggetComplete(4); onAchievement?.("Jura-Basics Check", "Rechtssicher bei der Aufklärung von Minderjährigen gehandelt."); }} 
              isDone={!!completedNuggets[4]} 
            />

            <QuizScenario2 
              onComplete={() => { onNuggetComplete(5); onAchievement?.("Delegations-Profi", "Korrekte Abgrenzung pflegerischer und ärztlicher Aufgaben."); }} 
              isDone={!!completedNuggets[5]} 
            />
            
            <LearningNugget id="nugget-recht" title="Rechtliche Grundlagen & Aufklärung" isVisible={!!completedNuggets[5]}>
              <p className="mb-2"><strong>Aufklärung und Einwilligung</strong></p>
              <p className="mb-4">Sowohl das chirurgische als auch das anästhesiologische Aufklärungsgespräch muss ein Arzt durchführen – es ist nicht delegierbar. Ärzte müssen über den geplanten Eingriff, mögliche Alternativen, mögliche Komplikationen und bestehende Risiken ausführlich aufklären. Anschließend muss der Patient Zeit haben, um sich mithilfe dieser Informationen für oder gegen die Operation zu entscheiden. Zeit heißt laut Gesetz: einen Tag zuvor; gleichwohl kann in dringenden Fällen die Zeit kürzer sein. Durch Unterzeichnung des Einverständniserklärungsformulars ist sein Einverständnis dokumentiert.</p>

              <p className="mb-2"><strong>Kinder und Jugendliche</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Bei Kindern bis zum 14. Lebensjahr obliegt es den Erziehungsberechtigten, die Einverständniserklärungen zu unterzeichnen (nach Aufklärung).</li>
                <li>Jugendliche über 14 Jahre können schon selbst rechtswirksam einwilligen, allerdings muss der Arzt die Art und Schwere des konkreten Eingriffs berücksichtigen und von der Einsichts- und Urteilsfähigkeit des Jugendlichen zur sachgemäßen Bewertung ausgehen können. Im Zweifelsfall sollte der Arzt sowohl die Zustimmung der Eltern als auch des Minderjährigen einholen.</li>
              </ul>

              <p className="mb-2"><strong>Menschen unter Betreuung</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bei Patienten, die unter (gesetzlicher) Betreuung stehen, entscheidet der Betreuer im Anschluss an die Aufklärung über die Durchführung des geplanten Eingriffs. Er dokumentiert sein Einverständnis ebenfalls durch seine Unterschrift.</li>
              </ul>
            </LearningNugget>
          </div>
        </div>

        {/* THEMA 2 */}
        <div className="flex flex-col items-center justify-center py-2 text-emerald-600">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-200 to-emerald-500 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            Thema 2 von 5
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce text-emerald-600 mt-1" />
        </div>

        <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 rounded-3xl shadow-sm border-l-8 border-l-emerald-600 border-2 border-emerald-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3.5 border-b border-emerald-100 pb-4">
              <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Thema 2
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Postoperative Fähigkeiten einüben (Prähabilitation)
                </h3>
              </div>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Der Patient wird gezielt in die präoperativen Vorbereitungen einbezogen und gewinnt durch das Einüben postoperativer Fähigkeiten an Sicherheit. Dies kann Ängste reduzieren und sich positiv auf die Genesung auswirken.
            </p>

            <QuizFaehigkeiten 
              onComplete={() => { onNuggetComplete(6); onAchievement?.("Prähabilitations-Experte", "Die Vorbereitung auf die postoperative Phase meistern Sie spielend."); }} 
              isDone={!!completedNuggets[6]} 
            />

            <LearningNugget id="nugget-faehigkeiten" title="Fähigkeiten präoperativ üben" isVisible={!!completedNuggets[6]}>
              <p className="mb-2">Um Komplikationen wie eine Thrombose, Pneumonie, Stürze oder bewegungsbedingte Schmerzen nach der Operation zu vermeiden, können Pflegefachkräfte gemeinsam mit dem Patienten bereits präoperativ Fähigkeiten und Techniken einüben, die postoperativ notwendig sind.</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Postoperative Mobilisation (En-bloc-Aufstehen)</li>
                <li>Anwendung eines Atemtrainers, einfache Atemübungen</li>
                <li>Anheben des Gesäßes (bei alten Menschen)</li>
                <li>Essen und Trinken in Rückenlage</li>
                <li>einfache Gymnastikübungen (Steigerung des venösen Rückflusses der Beine)</li>
                <li>Gebrauch von Hilfsmitteln (Unterarmgehstützen/Gehwagen)</li>
                <li>Umgang mit dem Rollstuhl</li>
              </ul>
              <p>Lernt der Patient dies bereits vor der Operation, gibt ihm diese Vorbereitung deutlich mehr Sicherheit und erleichtert die spätere Umsetzung, wenn Schmerzen oder Erschöpfung auftreten.</p>
            </LearningNugget>
          </div>
        </div>

        {/* THEMA 3 */}
        <div className="flex flex-col items-center justify-center py-2 text-amber-600">
          <div className="w-1 h-8 bg-gradient-to-b from-amber-200 to-amber-500 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
            Thema 3 von 5
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce text-amber-600 mt-1" />
        </div>

        <div className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 rounded-3xl shadow-sm border-l-8 border-l-amber-600 border-2 border-amber-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3.5 border-b border-amber-100 pb-4">
              <div className="bg-amber-600 p-2.5 rounded-2xl text-white shadow-xs">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Thema 3
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Nüchternheit und Darmentleerung
                </h3>
              </div>
            </div>

            <QuizNuechternheit 
              onComplete={() => { onNuggetComplete(7); onAchievement?.("Nüchternheits-Ninja", "Sie wissen genau, wann die Nahrungskarenz unterbrochen ist."); }} 
              isDone={!!completedNuggets[7]} 
            />

            <QuizAbfuhren 
              onComplete={() => { onNuggetComplete(8); onAchievement?.("Darm-Detailwissen", "Mythen rund ums präoperative Abführen erfolgreich aufgedeckt."); }} 
              isDone={!!completedNuggets[8]} 
            />

            <LearningNugget id="nugget-nuechternheit" title="Nüchternheit & präoperatives Abführen" isVisible={!!completedNuggets[8]}>
              <p className="mb-2"><strong>Nüchternheit:</strong> Um bei der Narkoseeinleitung eine Aspiration von Mageninhalt zu verhindern, sollte eine Nahrungskarenz von mind. 4–6 h eingehalten werden. Klare Flüssigkeitsgabe ist bis 2 Stunden vorher möglich.</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Kinder &lt; 1 Jahr: bis zu 4h vor OP Muttermilch bzw. 4–6h Formulanahrung.</li>
                <li>Patient:innen mit kognitiven Einschränkungen: darauf achten, dass keine Nahrungsmittel in Reichweite stehen (auch Zahnputzwasser nicht trinken lassen!).</li>
              </ul>
              
              <div className="my-4 flex justify-center">
                <LightboxImage src="/images/prae_op/Nuechtern_jpg.jpg" fallbackSrc="https://archive.org/download/abfuehren-jpg/Nuechtern%20jpg.jpg" alt="Nüchternheitsregeln" className="rounded-xl shadow-sm w-full max-w-sm h-auto max-h-48 object-contain cursor-pointer border border-amber-200" />
              </div>

              <h4 className="font-bold text-slate-900 mb-2 mt-6">Präoperatives Abführen</h4>
              <div className="text-slate-800 text-sm space-y-2 mb-4">
                <p>Ob und wie präoperativ abgeführt wird, richtet sich nach der Art des geplanten Eingriffs und dem jeweiligen Standard der Klinik. Über das präoperative Abführen kann einer intraoperativen Inkontinenz (bedingt durch die Erschlaffung verschiedener Muskeln und Sphinkter durch die Narkose) und erhöhten Flatulenzen vorgebeugt werden.</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Eingriffe außerhalb des Intestinaltrakts</strong> (z. B. Extremitäten, Kopf/Hals): Hier wird manchmal mittels Microklist eine Leerung der Rektumampulle am Operationsvorabend oder -morgen empfohlen.</li>
                  <li><strong>Eingriffe im oberen Intestinaltrakt mit Eröffnung des Peritoneums</strong> (z. B. Galle, Magen): Ein Klistier über ein Darmrohr zur Dickdarmentleerung wird empfohlen, um bei einer Darmverletzung das Peritonitisrisiko zu senken.</li>
                  <li><strong>Eingriffe am Dickdarm</strong> (z. B. Kolektomie, Rektumexstirpation): Orthograde Darmlavagen werden heute nur noch selten durchgeführt (z.B. bei Stomaanlage).</li>
                </ul>
              </div>

              <div className="my-4 flex flex-wrap justify-center gap-4 max-w-md mx-auto">
                <LightboxImage src="/images/prae_op/Klistier.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Klistier.jpg" alt="Klistier" className="rounded-xl shadow-sm w-28 sm:w-36 h-auto object-contain bg-white cursor-pointer border border-slate-200 p-1" />
                <LightboxImage src="/images/prae_op/Microklist.png" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Microklist.png" alt="Microklist" className="rounded-xl shadow-sm w-28 sm:w-36 h-auto object-contain bg-white cursor-pointer border border-slate-200 p-1" />
              </div>
            </LearningNugget>
          </div>
        </div>

        {/* THEMA 4 */}
        <div className="flex flex-col items-center justify-center py-2 text-cyan-600">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-200 to-cyan-500 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest bg-cyan-100 text-cyan-800 px-4 py-1.5 rounded-full border border-cyan-200 shadow-xs">
            Thema 4 von 5
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce text-cyan-600 mt-1" />
        </div>

        <div className="bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/20 rounded-3xl shadow-sm border-l-8 border-l-cyan-600 border-2 border-cyan-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3.5 border-b border-cyan-100 pb-4">
              <div className="bg-cyan-600 p-2.5 rounded-2xl text-white shadow-xs">
                <Bath className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-md">
                  Thema 4
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Körperpflege, Schmuck, Haare & Bauchnabel
                </h3>
              </div>
            </div>

            <QuizPflege 
              onComplete={() => { onNuggetComplete(9); onAchievement?.("Körperpflege-Spezialist", "Nagellack, Schmuck und Haare korrekt bewertet."); }} 
              isDone={!!completedNuggets[9]} 
            />

            <LearningNugget id="nugget-koerperpflege" title="Körperpflege und Vorbereitung im Zimmer" isVisible={!!completedNuggets[9]}>
              <p className="mb-2"><strong>Körperreinigung:</strong> Die Anzahl der Hautkeime soll auf ein Minimum reduziert werden (Infektionsprophylaxe). Haut nicht eincremen (schlecht für Desinfektion und EKG-Elektroden). Danach frische Kleidung anziehen (Patientenhemd, Netzhose, Vorlage, MTS).</p>
              
              <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-3.5 text-amber-950 text-xs sm:text-sm rounded-r-xl">
                <strong>Besonderheit Bauchnabelpflege:</strong> Bei allen abdominalen Eingriffen (z. B. laparoskopische Cholezystektomie) muss der Bauchnabel besonders gründlich mit Wattestäbchen gereinigt und entfettet werden, da sich dort Keim-, Schmutz- und Talgdepots sammeln, die sonst bei der Trokareinführung direkt in die Bauchhöhle verschleppt werden könnten.
              </div>

              <div className="my-4 flex flex-wrap justify-center gap-4">
                <LightboxImage src="/images/prae_op/OP_Haube.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/OP%20Haube.jpg" alt="OP Haube" className="rounded-xl shadow-sm max-h-32 object-cover border border-slate-200" />
                <LightboxImage src="/images/prae_op/Netzhose.png" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Netzhose.png" alt="Netzhose" className="rounded-xl shadow-sm max-h-32 object-cover border border-slate-200" />
                <LightboxImage src="/images/prae_op/ATS.jpg" fallbackSrc="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/ATS.jpg" alt="MTS / ATS" className="rounded-xl shadow-sm max-h-32 object-cover border border-slate-200" />
              </div>

              <p className="mb-2"><strong>Nagellack, Schmuck, Make-up:</strong> Nagellack entfernen (Erkennung Zyanose / Pulsoxymetrie), Make-up weglassen (Beobachtung Hautfarbe). Schmuck/Piercings entfernen (Verbrennungsgefahr bei Hochfrequenz-Elektrochirurgie).</p>
              
              <p className="mb-2"><strong>Haarentfernung:</strong></p>
              <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-full">
                <LightboxImage src="/images/prae_op/Clipper.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Clipper.jpg" alt="Clipper" className="rounded-xl shadow-sm w-full h-24 object-cover bg-white border border-slate-200" />
                <LightboxImage src="/images/prae_op/Clipper_Anwendung_nah.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Clipper%20Anwendung%20nah.jpg" alt="Clipper Anwendung nah" className="rounded-xl shadow-sm w-full h-24 object-cover bg-white border border-slate-200" />
                <LightboxImage src="/images/prae_op/Rasierer_1.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Rasierer%201.jpg" alt="Einmalrasierer" className="rounded-xl shadow-sm w-full h-24 object-cover bg-white border border-slate-200" />
                <LightboxImage src="/images/prae_op/Rasierer_2.png" fallbackSrc="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/Rasierer%202.png" alt="Einmalrasierer 2" className="rounded-xl shadow-sm w-full h-24 object-contain bg-white border border-slate-200" />
              </div>
              <p className="mb-2">Von einer Nassrasur (Einmalrasierer) sollte abgesehen werden, da dies zu Mikroverletzungen führt, welche die Infektionsgefahr drastisch steigern. Stattdessen werden Haare mit einem elektrischen Clipper gekürzt.</p>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 border-l-4 border-slate-400 p-3 rounded-r-xl"><strong>Optimaler Zeitpunkt:</strong> Die Haarkürzung erfolgt so kurz wie möglich vor dem Eingriff (am OP-Tag). Niemals am Vorabend rasieren!</p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mt-4">
                <h4 className="font-bold text-red-900 mb-2">Mögliche Komplikationen: Mikroverletzungen, Hautirritationen & Ekzeme</h4>
                <p className="text-xs text-red-800 mb-3 leading-relaxed">
                  Mikrotraumata, Schnitte und Hautirritationen durch Klingenrasur bieten Keimen ideale Eintrittspforten und vervielfachen das Risiko postoperativer Wundinfektionen (SSI):
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <LightboxImage src="/images/prae_op/Hautverletzung_1.png" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautverletzung%201.png" alt="Mikroverletzung & Schnittwunde nach Nassrasur" className="rounded-lg shadow-sm w-full object-cover h-32 bg-white border border-red-200" />
                  <LightboxImage src="/images/prae_op/Hautbverletzung_2.jpg" fallbackSrc="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautbverletzung%202.jpg" alt="Hautirritation, Rötung & Mikroläsionen" className="rounded-lg shadow-sm w-full object-cover h-32 bg-white border border-red-200" />
                </div>
              </div>
            </LearningNugget>
          </div>
        </div>

        {/* THEMA 5 */}
        <div className="flex flex-col items-center justify-center py-2 text-indigo-600">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-200 to-indigo-500 rounded-full mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full border border-indigo-200 shadow-xs">
            Thema 5 von 5
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce text-indigo-600 mt-1" />
        </div>

        <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 rounded-3xl shadow-sm border-l-8 border-l-indigo-600 border-2 border-indigo-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3.5 border-b border-indigo-100 pb-4">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xs">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                  Thema 5
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Medikation, Thromboseprophylaxe & Transport
                </h3>
              </div>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Am Operationstag sind die korrekte Verabreichung von Medikamenten, die Thromboseprophylaxe und die sichere Übergabe essenziell.
            </p>
            
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200">
              <h4 className="font-extrabold text-indigo-950 text-xs sm:text-sm mb-2">
                Medizinische Thromboseprophylaxestrümpfe (MTS/ATS)
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <LightboxImage src="/images/prae_op/ATS.jpg" fallbackSrc="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/ATS.jpg" alt="MTS" className="rounded-xl shadow-xs max-w-[180px] border border-indigo-200" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Am OP-Tag selbst erhält der Patient meist keine medikamentöse Thromboseprophylaxe (z.B. Heparin) wegen der akuten Blutungsgefahr. Wichtig sind stattdessen die Strümpfe (MTS), deren Größe vorab exakt am Bein ausgemessen werden muss.
                </p>
              </div>
            </div>

            <QuizThrombose 
              onComplete={() => { onNuggetComplete(10); onAchievement?.("Thrombose-Checker", "Wissen zur Thromboseprophylaxe am OP-Tag gesichert."); }} 
              isDone={!!completedNuggets[10]} 
            />
            
            <QuizDauermedikation 
              onComplete={() => { onNuggetComplete(11); onAchievement?.("Medikations- & Allergie-Checker", "Wissen zu Dauermedikation und Allergiekennzeichnung gesichert."); }} 
              isDone={!!completedNuggets[11]} 
            />

            <LearningNugget id="nugget-dauermedikation" title="Dauermedikation & Allergie-Management" isVisible={!!completedNuggets[11]}>
              <p className="mb-2"><strong>Dauermedikation am OP-Morgen:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-sm text-slate-800">
                <li><strong>Orale Antidiabetika & Insulin:</strong> Bei Nahrungskarenz müssen blutzuckersenkende Tabletten (z. B. Metformin) pausiert werden (Gefahr von Hypoglykämie und Laktatazidose).</li>
                <li><strong>Kardiovaskuläre Medikamente:</strong> Essenzielle Herz-Kreislauf-Medikamente (insb. Betablocker) werden nach schriftlicher Anordnung des Anästhesisten mit einem winzigen Schluck Wasser eingenommen.</li>
                <li><strong>Gerinnungshemmer (Antikoagulation):</strong> Müssen streng nach präoperativem ärztlichem Schema rechtzeitig pausiert oder überbrückt werden (Bridging).</li>
              </ul>
              
              <p className="mb-2"><strong>Allergie-Check & Kennzeichnung:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                <li><strong>Latexallergie:</strong> Höchste Alarmstufe! OP-Saal muss vorab latexfrei gerüstet werden.</li>
                <li><strong>Pflaster & Desinfektionsmittel:</strong> Allergien dokumentieren und alternatives Hautantiseptikum (z.B. Octenidin) verwenden.</li>
                <li><strong>Sichtbare Kennzeichnung:</strong> Rotes Allergiearmband anlegen und bei Übergabe explizit melden.</li>
              </ul>
            </LearningNugget>

            <QuizPraemedikation 
              onComplete={() => { onNuggetComplete(12); onAchievement?.("Prämedikations-Profi", "Die letzten Schritte vor dem OP sitzen absolut sicher."); }} 
              isDone={!!completedNuggets[12]} 
            />
            
            <LearningNugget id="nugget-praemedikation" title="Prämedikation & Transport" isVisible={!!completedNuggets[12]}>
              <p className="mb-2"><strong>Prämedikation:</strong> Dient der Anxiolyse (Angstlösung) und Sedierung (Beruhigung).</p>
              <p className="mb-4 text-rose-800 font-bold border-l-4 border-rose-500 pl-3 bg-rose-50 py-2 rounded-r-xl">
                WICHTIG: Nach der Verabreichung der Prämedikation besteht erhöhte Sturzgefahr! Die Toilette muss vorher aufgesucht werden, danach darf die Person keinesfalls mehr alleine aufstehen.
              </p>
              
              <p className="mb-2"><strong>Transport und Übergabe:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1.5 text-sm text-slate-800">
                <li><strong>Dokumente & Armband:</strong> Vollständige Patientenakte (OP- & Narkoseeinwilligung) und Identitätsarmband prüfen.</li>
                <li><strong>OP-Gebiet:</strong> Vor der Prämedikation durch den Operateur seitenrichtig markieren lassen.</li>
                <li><strong>Wertsachen & Brille/Hörgerät:</strong> Wertgegenstände sicher verwahren. Seh- und Hörhilfen dürfen zur Orientierung bis zur Schleuse mitgeführt werden.</li>
                <li><strong>Schleusenübergabe:</strong> Patient mit Name und geplanter OP vorstellen (Verwechslungsausschluss).</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mt-4">
                <h4 className="font-bold text-blue-950 mb-1">Praxiswissen Zahnprothesen: Warum entfernen – und wann nicht?</h4>
                <p className="text-xs sm:text-sm text-slate-700 mb-2 leading-relaxed">
                  <strong>Standardvorgehen:</strong> Prothesen werden vor dem Transfer herausgenommen, gereinigt und namentlich beschriftet im Nachttisch verwahrt (Niemals in Zellstoff wickeln – Verlustgefahr!).
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <em>Klinische Ausnahme (I Care):</em> Bei völlig zahnlosen Patienten belässt die Anästhesie die Vollprothese bis zur Narkoseeinleitung im Mund, damit die Beatmungsmaske dicht abschließt. Vor der Intubation wird sie entnommen.
                </p>
              </div>
            </LearningNugget>
          </div>
        </div>

      </div>

      <NavigationButtons current="wissen" onNavigate={onNavigate} />
    </section>
  );
}
