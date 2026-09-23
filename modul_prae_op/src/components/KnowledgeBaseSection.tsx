import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Brain, Activity, Utensils, Bath, ClipboardCheck, Trophy, BookOpen, FileText, AlertCircle, TestTube, ChevronDown, CheckCircle, RotateCcw } from 'lucide-react';
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

// --- Shared Components ---

function LightboxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsOpen(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <motion.img 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function LearningNugget({ title, children, isVisible }: { title: string, children: React.ReactNode, isVisible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!isVisible) return null;
  
  return (
    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-blue-900 bg-blue-100/50 hover:bg-blue-200 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>Learning Nugget: {title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 text-sm text-slate-700 leading-relaxed bg-white border-t border-blue-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizFeedback({ status, feedback, onRetry }: { status: 'idle' | 'correct' | 'incorrect', feedback: string, onRetry?: () => void }) {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 10, height: 0 }} 
          animate={{ opacity: 1, y: 0, height: 'auto' }} 
          exit={{ opacity: 0, y: 10, height: 0 }}
          className="mt-4 overflow-hidden relative z-10"
        >
          <div className={`p-4 rounded-xl border-2 flex flex-col space-y-3 text-sm font-medium ${
            status === 'correct' 
              ? 'bg-green-100 border-green-500 text-green-800' 
              : 'bg-red-100 border-red-500 text-red-800'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {status === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-green-700" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-700" />
                )}
              </div>
              <span>{feedback}</span>
            </div>
            {onRetry && (
              <div className="flex justify-end mt-2">
                <button 
                  onClick={onRetry}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                    status === 'correct' 
                      ? 'bg-green-200 hover:bg-green-300 text-green-900' 
                      : 'bg-red-200 hover:bg-red-300 text-red-900'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Wiederholen</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Quizzes ---

// Quiz 0.0: Lückentext Definition
function QuizLueckentext({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<string[]>(isDone ? ['präoperative', 'Tätigkeiten', 'vor', 'optimal', 'Risiken'] : ['', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');
  
  const correctAnswers = ['präoperative', 'Tätigkeiten', 'vor', 'optimal', 'Risiken'];
  const options = ['postoperative', 'Risiken', 'nach', 'präoperative', 'Tätigkeiten', 'optimal', 'vor', 'Bedenken'];

  const handleDrop = (index: number, word: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    const newAnswers = [...answers];
    newAnswers[index] = word;
    setAnswers(newAnswers);
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

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Aufgabe: Definieren Sie die präoperative Pflege. Ziehen Sie die richtigen Begriffe in die passenden Lücken.</span>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <span key={i} className="px-3 py-1 bg-white border-2 border-blue-200 rounded-full text-blue-700 font-medium text-sm cursor-grab active:cursor-grabbing hover:bg-blue-50"
                draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', opt)}>
            {opt}
          </span>
        ))}
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 leading-loose">
        Unter dem Begriff „
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2 pb-0.5 ${answers[0] ? 'border-blue-500 text-blue-700 font-bold' : 'border-slate-300 text-slate-400 border-dashed'}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(0, e.dataTransfer.getData('text/plain'))}
        >{answers[0] || '___'}</span>
        Pflege“ versteht man alle pflegerischen
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2 pb-0.5 ${answers[1] ? 'border-blue-500 text-blue-700 font-bold' : 'border-slate-300 text-slate-400 border-dashed'}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(1, e.dataTransfer.getData('text/plain'))}
        >{answers[1] || '___'}</span>
        und Handlungen, die
        <span 
          className={`inline-block min-w-[80px] text-center border-b-2 mx-1 px-2 pb-0.5 ${answers[2] ? 'border-blue-500 text-blue-700 font-bold' : 'border-slate-300 text-slate-400 border-dashed'}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(2, e.dataTransfer.getData('text/plain'))}
        >{answers[2] || '___'}</span>
        einer Operation durchgeführt werden. Ziel der präoperativen Phase ist es, den Patienten 
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2 pb-0.5 ${answers[3] ? 'border-blue-500 text-blue-700 font-bold' : 'border-slate-300 text-slate-400 border-dashed'}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(3, e.dataTransfer.getData('text/plain'))}
        >{answers[3] || '___'}</span>
        auf die geplante Operation vorzubereiten und dadurch mögliche 
        <span 
          className={`inline-block min-w-[100px] text-center border-b-2 mx-1 px-2 pb-0.5 ${answers[4] ? 'border-blue-500 text-blue-700 font-bold' : 'border-slate-300 text-slate-400 border-dashed'}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(4, e.dataTransfer.getData('text/plain'))}
        >{answers[4] || '___'}</span>
        und Komplikationen nach Möglichkeit auszuschließen. (Ziehen Sie die Wörter in die Lücken)
      </div>

      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={answers.some(a => a === '')} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Satz prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Perfekt! Die Definition stimmt." : "Da ist noch ein Fehler in den Lücken."} onRetry={() => { setStatus('idle'); setAnswers(['', '', '', '', '']); }} />
    </div>
  );
}


// Quiz 0.1
function QuizFlipCards({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>(
    isDone ? { '1': true, '2': true, '3': true, '4': true } : { '1': false, '2': false, '3': false, '4': false }
  );
  const [status, setStatus] = useState<'idle' | 'correct'>(isDone ? 'correct' : 'idle');

  const cards = useMemo(() => [
    { id: '1', front: 'Offene OP', back: 'Hautschnitt, bei dem z.B. Bauchdecke oder Thorax eröffnet wird.' },
    { id: '2', front: 'Minimalinvasiv', back: 'Endoskopischer Eingriff (z.B. Laparoskopie) mit dem Ziel kleinstmöglicher Verletzung von Haut und Weichteilen.' },
    { id: '3', front: 'Elektiv', back: 'Medizinisch indiziert, aber nicht umgehend erforderlich. Vorbereitungen oft ambulant, um stationäre Verweildauer zu kürzen.' },
    { id: '4', front: 'Notfall', back: 'Ungeplanter, dringlicher Eingriff. Bei fehlender Ansprechbarkeit greift der mutmaßliche Wille (Notfallindikation).' }
  ], []);

  const toggleCard = (id: string) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (Object.values(flipped).every(Boolean) && status !== 'correct') {
      setStatus('correct');
      onComplete();
    }
  }, [flipped, status, onComplete]);

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Lernmethode Flashcards: Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet. Drehen Sie die Karte um! Wichtig: Lassen Sie alle Karten am Ende aufgedeckt, um diese Aufgabe abzuschließen.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <div key={c.id} className="h-40 cursor-pointer group" onClick={() => toggleCard(c.id)} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: flipped[c.id] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              <div className="absolute inset-0 bg-white border-2 border-blue-200 rounded-xl flex items-center justify-center p-4 shadow-sm" style={{ backfaceVisibility: 'hidden' }}>
                <span className="font-bold text-blue-800 text-lg text-center">{c.front}</span>
              </div>
              <div className="absolute inset-0 bg-blue-50 border-2 border-blue-400 rounded-xl flex items-center justify-center p-4 shadow-sm" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span className="font-medium text-blue-900 text-sm text-center">{c.back}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {status === 'correct' && <QuizFeedback status="correct" feedback="Super! Sie haben alle Karten umgedreht." />}
    </div>
  );
}

// Quiz 0.3 Scenarios (Recht) - Separated
function QuizScenario1({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => shuffleArray([
    { id: 'a', text: 'Sie lassen ihn unterschreiben, da er über 14 Jahre alt ist und einsichtsfähig wirkt.' },
    { id: 'b', text: 'Sie informieren den Arzt. Zwar können Jugendliche über 14 u. U. selbst einwilligen, aber der Arzt muss den Fall individuell bewerten und ggf. die Eltern telefonisch kontaktieren.' },
    { id: 'c', text: 'Sie als Pflegefachkraft klären ihn einfach schnell selbst auf, damit der Zettel unterschrieben ist.' }
  ]), [status === 'idle' ? status : null]); // Re-shuffle on reset if needed, but useMemo with empty array is fine for now, we shuffle on mount.
  // Actually, to reshuffle on retry:
  const [shuffledOptions, setShuffledOptions] = useState(options);
  
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
    setShuffledOptions(shuffleArray([...options]));
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Rechtliches Szenario 1: OP-Einwilligung Minderjährige</span>
      </div>
      <div className="mb-6">
        <p className="font-medium text-slate-800 mb-2">Ein 15-jähriger Patient kommt mit Verdacht auf akute Appendizitis (Blinddarmentzündung) zur Aufnahme. Es ist eine dringliche OP, aber es bleibt noch Zeit zur Abwägung. Seine Eltern sind im Urlaub. Er möchte den Aufklärungsbogen zur Narkose selbst unterschreiben. Was tun Sie?</p>
        <div className="space-y-2">
          {shuffledOptions.map(opt => (
            <div 
              key={opt.id} onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}
            >{opt.text}</div>
          ))}
        </div>
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswer} disabled={!selected} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Antwort prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Jugendliche über 14 können einsichtsfähig sein, aber der Arzt entscheidet im Einzelfall und muss die Schwere des Eingriffs berücksichtigen." : "Das ist leider nicht richtig."} onRetry={retry} />
    </div>
  );
}

function QuizScenario2({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => [
    { id: 'a', text: 'Sie händigen der Patientin den Bogen aus, erklären kurz den Ablauf und lassen sie unterschreiben.' },
    { id: 'b', text: 'Sie weigern sich. Das ärztliche Aufklärungsgespräch (sowohl chirurgisch als auch anästhesiologisch) ist nicht an Pflegefachkräfte delegierbar. Zudem fehlt die gesetzliche Bedenkzeit.' },
    { id: 'c', text: 'Sie informieren die Pflegedienstleitung und verschieben die Operation eigenmächtig auf morgen.' }
  ], []);
  
  const [shuffledOptions, setShuffledOptions] = useState(shuffleArray([...options]));

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
    setShuffledOptions(shuffleArray([...options]));
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Rechtliches Szenario 2: Ärztliche Aufklärung</span>
      </div>
      <div className="mb-6">
        <p className="font-medium text-slate-800 mb-2">Ihnen fällt auf, dass eine Patientin, die für heute zu einer elektiven Operation geplant ist, noch nicht aufgeklärt wurde. Telefonisch teilt Ihnen der zuständige Oberarzt mit, dass er gerade im OP steht. Sie sollen der Patientin den Aufklärungsbogen aushändigen, kurz erklären was passiert und sie unterschreiben lassen. Wie reagieren Sie korrekt?</p>
        <div className="space-y-2">
          {shuffledOptions.map(opt => (
            <div 
              key={opt.id} onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}
            >{opt.text}</div>
          ))}
        </div>
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswer} disabled={!selected} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Antwort prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Die Aufklärung muss durch einen Arzt erfolgen und ist nicht delegierbar. Außerdem muss die Patientin Zeit haben (z.B. einen Tag zuvor), um sich nach der Aufklärung entscheiden zu können." : "Falsch! Denken Sie an die gesetzlichen Vorgaben zur Aufklärung."} onRetry={retry} />
    </div>
  );
}

// Quiz 1.1: Multi Select Fähigkeiten (Postoperativ)
function QuizFaehigkeiten({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const correctAnswers = ['a', 'b', 'd', 'e'];
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => [
    { id: 'a', text: 'Atemübungen / Einsatz eines Atemtrainers' },
    { id: 'b', text: 'En-bloc-Aufstehen aus dem Bett' },
    { id: 'c', text: 'Eigenständig mit dem i. v. - Zugang umgehen können' },
    { id: 'd', text: 'Korrekte Anwendung von Hilfsmitteln (z. B. Unterarmgehstützen)' },
    { id: 'e', text: 'Patientenkontrollierte Analgesie (PCA) / Schmerzpumpe bedienen' },
    { id: 'f', text: 'Das OP-Besteck benennen' }
  ], []);
  
  const [shuffledOptions, setShuffledOptions] = useState(shuffleArray([...options]));

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

  const retry = () => { setStatus('idle'); setSelected([]); setShuffledOptions(shuffleArray([...options])); };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Auftrag: Welche Maßnahmen sind für die Zeit NACH der Operation relevant und sollten präoperativ (Prähabilitation) eingeübt werden? (Mehrere Antworten)</span>
      </div>
      <div className="space-y-2">
        {shuffledOptions.map(opt => (
          <div key={opt.id} onClick={() => toggleSelect(opt.id)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected.includes(opt.id) ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Antwort prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Atemübungen, En-bloc-Aufstehen, Hilfsmittel und PCA-Pumpe sind wichtige Schulungsinhalte." : "Fehlerhaft! Wählen Sie genau 4 Optionen aus, die der Patient wirklich selbst durchführen muss."} onRetry={retry} />
    </div>
  );
}

// Quiz 2.1: Multi Select Abführen & Nüchternheit
function QuizNuechternheit({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string[]>(isDone ? ['b', 'c'] : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => [
    { id: 'a', text: 'Ein 8-jähriges Kind trinkt 2 Stunden vor OP ein halbes Glas klares Wasser.' },
    { id: 'b', text: 'Ein Patient isst heimlich Süßigkeiten.' },
    { id: 'c', text: 'Ein Patient mit Demenz trinkt versehentlich trüben Fruchtsaft 3 Stunden vor OP.' },
    { id: 'd', text: 'Ein Säugling (< 1 Jahr) wird 5 Stunden vor OP mit Formulanahrung (Flasche) gefüttert.' }
  ], []);
  
  const [shuffledOptions, setShuffledOptions] = useState(shuffleArray([...options]));

  const checkAnswers = () => {
    const correctAnswers = ['b', 'c'];
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

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Welche Situationen führen zu einer Unterbrechung der Nüchternheit und gefährden die OP-Freigabe? (Mehrere Antworten)</span>
      </div>
      <div className="space-y-2">
        {shuffledOptions.map(opt => (
          <div key={opt.id} onClick={() => toggleSelect(opt.id)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected.includes(opt.id) ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Süßigkeiten und trübe Säfte brechen die Nüchternheit. Klares Wasser bis 2h und Formulanahrung bis 4-6h (je nach Alter) sind erlaubt." : "Nicht ganz richtig. Denken Sie an die 6-Stunden-Regel für feste Nahrung/trübe Getränke und die 2-Stunden-Regel für klare Flüssigkeit."} onRetry={() => { setStatus('idle'); setSelected([]); setShuffledOptions(shuffleArray([...options])); }} />
    </div>
  );
}

function QuizAbfuhren({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': false, '2': true, '3': true } : { '1': null, '2': null, '3': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const statements = useMemo(() => [
    { id: '1', text: 'Eine orthograde Darmlavage (z.B. 4 Liter trinken zum Durchspülen) wird heute bei fast jeder OP durchgeführt.', correct: false },
    { id: '2', text: 'Bei Eingriffen außerhalb des Intestinaltrakts (z.B. Knie-OP) wird manchmal am Vorabend ein Microklist verabreicht, um eine Darmentleerung während der Narkose zu vermeiden.', correct: true },
    { id: '3', text: 'Ob abgeführt wird, hängt stark vom geplanten Eingriff und dem Hausstandard der Klinik ab.', correct: true }
  ], []);
  
  const [shuffledStatements, setShuffledStatements] = useState(shuffleArray([...statements]));

  const checkAnswers = () => {
    const isCorrect = shuffledStatements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); }
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wahr oder Falsch? (Thema Abführen)</span>
      </div>
      <div className="space-y-3">
        {shuffledStatements.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <p className="font-medium text-slate-800 mb-3">{s.text}</p>
            <div className="flex space-x-3">
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} className={`flex-1 py-2 rounded-lg border-2 font-medium ${answers[s.id] === true ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}`}>Wahr</button>
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} className={`flex-1 py-2 rounded-lg border-2 font-medium ${answers[s.id] === false ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}`}>Falsch</button>
            </div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={Object.values(answers).some(a => a === null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Alle korrekt bewertet!" : "Einige Aussagen sind falsch bewertet."} onRetry={() => { setStatus('idle'); setAnswers({ '1': null, '2': null, '3': null }); setShuffledStatements(shuffleArray([...statements])); }} />
    </div>
  );
}

// Quiz 3: Körperpflege / Schmuck
function QuizPflege({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': false, '2': false, '3': true, '4': true, '5': false } : { '1': null, '2': null, '3': null, '4': null, '5': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const statements = useMemo(() => [
    { id: '1', text: 'Zahnprothesen, Brillen und Hörgeräte werden IMMER zusammen im Zimmer belassen, damit der Patient im OP nichts verliert.', correct: false },
    { id: '2', text: 'Make-up und Körperlotion/Parfüm sind vor der OP unproblematisch.', correct: false },
    { id: '3', text: 'Ein sehr fester Ehering darf unter Umständen in der Praxis mit Pflaster abgeklebt werden, obwohl das Tragen von Schmuck streng vermieden werden sollte.', correct: true },
    { id: '4', text: 'Schmuck und Piercings (Metalle) bergen bei Einsatz der Hochfrequenz-Chirurgie das Risiko thermischer Verbrennungen.', correct: true },
    { id: '5', text: 'Haarentfernung sollte am besten 2 Tage vor der OP mit einem Nassrasierer erfolgen.', correct: false }
  ], []);
  
  const [shuffledStatements, setShuffledStatements] = useState(shuffleArray([...statements]));

  const checkAnswers = () => {
    const isCorrect = shuffledStatements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); }
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wahr oder Falsch? (Körperpflege, Schmuck, Haare)</span>
      </div>
      <div className="space-y-3">
        {shuffledStatements.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <p className="font-medium text-slate-800 mb-3">{s.text}</p>
            <div className="flex space-x-3">
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} className={`flex-1 py-2 rounded-lg border-2 font-medium ${answers[s.id] === true ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}`}>Wahr</button>
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} className={`flex-1 py-2 rounded-lg border-2 font-medium ${answers[s.id] === false ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}`}>Falsch</button>
            </div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={Object.values(answers).some(a => a === null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Lotionen behindern EKG-Elektroden, Make-up verbirgt Zyanose, Rasierer verursachen Mikroläsionen (Keime!). Zahnprothesen werden i.d.R. abgelegt, Seh-/Hörhilfen jedoch erst im OP-Vorraum entfernt, um Kommunikation zu ermöglichen." : "Überprüfen Sie Ihre Eingaben. Es gibt hier einige Mythen aufzudecken."} onRetry={() => { setStatus('idle'); setAnswers({ '1': null, '2': null, '3': null, '4': null, '5': null }); setShuffledStatements(shuffleArray([...statements])); }} />
    </div>
  );
}

// Quiz 4.1: Medikamente und Thrombose
function QuizThrombose({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => [
    { id: 'a', text: 'Heparin als Spritze am Morgen der Operation ist zwingend.' },
    { id: 'b', text: 'Am OP-Tag gibt es KEINE medikamentöse Prophylaxe (z.B. Heparin). MTPS (Strümpfe) werden angezogen (Größe ausmessen!).' },
    { id: 'c', text: 'Thromboseprophylaxe erfolgt ausschließlich postoperativ durch Mobilisation.' }
  ], []);
  
  const [shuffledOptions, setShuffledOptions] = useState(shuffleArray([...options]));

  const checkAnswers = () => { if (selected === 'b') { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); } };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wie erfolgt die Thromboseprophylaxe am OP-Tag präoperativ?</span>
      </div>
      <div className="space-y-2">
        {shuffledOptions.map(opt => (
          <div key={opt.id} onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }} className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && <button onClick={checkAnswers} disabled={!selected} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Richtig! Heparin wird am OP-Tag meist weggelassen wegen Blutungsgefahr. MTPS (Strümpfe) sind Standard." : "Falsch. Denken Sie an die Blutungsgefahr bei OPs."} onRetry={() => { setStatus('idle'); setSelected(null); setShuffledOptions(shuffleArray([...options])); }} />
    </div>
  );
}

// Quiz 4.2: Multiple Choice Prämedikation
function QuizPraemedikation({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const correctAnswers = ['a', 'b', 'c', 'e'];
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => [
    { id: 'a', text: 'Kontrolle der korrekten Haarentfernung im OP-Gebiet.' },
    { id: 'b', text: 'Überprüfung des Patientenidentifikationsarmbands.' },
    { id: 'c', text: 'Nachfragen, ob Patient:in nochmals zur Toilette möchte.' },
    { id: 'd', text: 'Durchführung der ärztlichen Aufklärung.' },
    { id: 'e', text: 'Prüfen, ob frische Kleidung und MTPS getragen werden.' },
    { id: 'f', text: 'Sofortige Mobilisation zur Kreislaufstabilisierung nach Tablettengabe.' }
  ], []);
  
  const [shuffledOptions, setShuffledOptions] = useState(shuffleArray([...options]));

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

  const retry = () => { setStatus('idle'); setSelected([]); setShuffledOptions(shuffleArray([...options])); };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Was muss zwingend VOR der Verabreichung der Prämedikation (Beruhigungs-/Schmerzmittel am OP-Morgen) kontrolliert oder erledigt werden? (Mehrere Antworten)</span>
      </div>
      <div className="space-y-2">
        {shuffledOptions.map(opt => (
          <div key={opt.id} onClick={() => toggleSelect(opt.id)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${selected.includes(opt.id) ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Antworten prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Exakt! Die Aufklärung macht der Arzt vorab. NACH der Medikamentengabe besteht erhöhte Sturzgefahr, d.h. vorher Toilette erledigen, und der Patient darf nicht mehr allein aufstehen." : "Nicht ganz. Denken Sie daran, wer für Aufklärung zuständig ist und welche Gefahr NACH der Medikamentengabe besteht."} onRetry={retry} />
    </div>
  );
}

// --- Main Section ---

export default function KnowledgeBaseSection({ onNavigate, onNuggetComplete, completedNuggets, onAchievement }: Props) {
  const requiredQuizzes = 9;
  const allCompleted = Object.values(completedNuggets).filter(Boolean).length >= requiredQuizzes;

  useEffect(() => {
    if (allCompleted && onAchievement) {
      onAchievement("Wissens-Meister!", "Alle Learning Nuggets erfolgreich absolviert!");
    }
  }, [allCompleted, onAchievement]);

  return (
    <section className="max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Die Wissens-Base</h2>
        <ModuleMeta time="Doppelstunde 5 (Modul 3)" mode="Einzelarbeit (eigenes Tempo)" goal="Fachwissen aufbauen & überprüfen" />
        
        <div className="mt-6 bg-blue-50/50 border border-blue-200 p-6 rounded-2xl text-left">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">Arbeitsauftrag</h3>
              <p className="text-slate-700 mb-2">
                Bitte lesen Sie sich den folgenden Fachtext vollständig durch. Das Wissen benötigen Sie zur Bearbeitung der folgenden Aufgaben und Quizformate.
              </p>
              <p className="text-slate-700 mb-4 font-medium">
                Sie können jederzeit im Skript nach Antworten suchen oder unseren KI-Helfer (unten rechts) fragen, wenn Sie sich nicht sicher sind. Viel Erfolg!
              </p>
              <a href="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/ICare%20Pflege%20pr%C3%A4%20OP%20Kapitel%20-%20Reduced.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                <FileText className="w-4 h-4" /><span>I Care Text (Primärquelle) öffnen</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8 text-left">
        {/* Sektion 0: Grundlagen */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-blue-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><BookOpen className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 0: Grundlagen & Rechtliches</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Starten wir mit den Grundlagen der präoperativen Pflege und Einteilungen von Operationen, sowie den rechtlichen Fallstricken rund um Aufklärung und Einwilligung.</p>
            <QuizLueckentext onComplete={() => { onNuggetComplete(1); if(onAchievement) onAchievement("Definition gemeistert!", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[1]} />
            <QuizFlipCards onComplete={() => { onNuggetComplete(2); if(onAchievement) onAchievement("Risikofaktor-Spezialist", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[2]} />
            <LearningNugget title="Einteilung von Operationen" isVisible={!!completedNuggets[2]}>
              <p className="mb-2"><strong>Elektive Operation:</strong> „Elektiv“ bedeutet „auswählend“. In der Medizin sind mit elektiven Operationen solche gemeint, die medizinisch zwar indiziert sind, aber nicht umgehend durchgeführt werden müssen.</p>
              <p className="mb-4">Bei geplanten, nicht dringlichen Eingriffen (z. B. Knie-OP bei Arthrose), die vorbereitet werden können, werden die Voruntersuchungen und Aufklärungsgespräche heute meist ambulant durchgeführt, da so die stationäre Verweildauer kürzer ist.</p>
              
              <p className="mb-2"><strong>Notfalloperation:</strong> Bei einer Notfalloperation handelt es sich um einen ungeplanten, dringlichen Eingriff, der sich nicht aufschieben lässt, da das Leben des Patienten sonst akut gefährdet ist.</p>
              <p>Ist der Patient nicht ansprechbar und konnte nicht rechtzeitig eine Einwilligung eingeholt werden (z. B. Polytrauma mit Hirnblutung), kommt die mutmaßliche Einwilligung in Betracht (oft gefasst unter dem Begriff „Notfallindikation“).</p>
            </LearningNugget>
            
            <QuizScenario1 onComplete={() => { onNuggetComplete(3); if(onAchievement) onAchievement("Post-OP Profi", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[3]} />
            <QuizScenario2 onComplete={() => { onNuggetComplete(4); if(onAchievement) onAchievement("Nüchternheits-Ninja", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[4]} />
          </div>
        </div>

        
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Prähabilitation</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Sektion 1: Prähabilitation */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-emerald-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Activity className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 1: Postoperative Fähigkeiten einüben (Prähabilitation)</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Der Patient wird gezielt in die präoperativen Vorbereitungen einbezogen und gewinnt durch das Einüben postoperativer Fähigkeiten an Sicherheit. Dies kann Ängste reduzieren und sich positiv auf die Genesung auswirken.</p>
            <QuizFaehigkeiten onComplete={() => { onNuggetComplete(5); if(onAchievement) onAchievement("Körperpflege-Experte", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[5]} />
            <LearningNugget title="Fähigkeiten präoperativ üben" isVisible={!!completedNuggets[5]}>
              <p className="mb-2">Um Komplikationen wie eine Thrombose, Pneumonie, Stürze oder bewegungsbedingte Schmerzen nach der Operation zu vermeiden, können Pflegefachkräfte gemeinsam mit dem Patienten bereits präoperativ Fähigkeiten und Techniken einüben, die postoperativ notwendig sind.</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Postoperative Mobilisation (En-bloc-Aufstehen)</li>
                <li>Anwendung eines Atemtrainers, einfache Atemübungen</li>
                <li>Korrekte Anwendung von Hilfsmitteln</li>
              </ul>
              <p>Lernt der Patient dies bereits vor der Operation, gibt ihm diese Vorbereitung deutlich mehr Sicherheit und erleichtert die spätere Umsetzung, wenn Schmerzen oder Erschöpfung auftreten.</p>
            </LearningNugget>
          </div>
        </div>

        
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Ernährung & Ausscheidung</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Sektion 2: Nüchternheit und Abführen */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-amber-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Utensils className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 2: Nüchternheit und Darmentleerung</h3>
            </div>
            <QuizNuechternheit onComplete={() => { onNuggetComplete(6); if(onAchievement) onAchievement("Transport-Meister", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[6]} />
            <QuizAbfuhren onComplete={() => { onNuggetComplete(7); if(onAchievement) onAchievement("Medikamenten-Kenner", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[7]} />
            <LearningNugget title="Maßnahmen am OP-Tag & Präoperatives Abführen" isVisible={!!completedNuggets[7]}>
              <p className="mb-2"><strong>Nüchternheit:</strong> Um bei der Narkoseeinleitung eine Aspiration von Mageninhalt zu verhindern, sollte eine Nahrungskarenz von mind. 4–6 h eingehalten werden. Klare Flüssigkeitsgabe ist bis 2 Stunden vorher möglich.</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Kinder &lt; 1 Jahr: bis zu 4h vor OP Muttermilch bzw. 4-6h Formulanahrung.</li>
                <li>Patient:innen mit kognitiven Einschränkungen: darauf achten, dass keine Nahrungsmittel in Reichweite stehen (auch Zahnputzwasser nicht trinken lassen!).</li>
              </ul>
              
              <div className="my-4 grid grid-cols-2 gap-4">
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Klistier.jpg" alt="Klistier" className="rounded-lg shadow-sm w-full h-auto object-contain max-h-24 bg-white" />
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Microklist.png" alt="Microklist" className="rounded-lg shadow-sm w-full h-auto object-contain max-h-24 bg-white" />
              </div>

              <p className="mb-2"><strong>Abführen:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Richtet sich nach Eingriff und Standard. Beugt intraoperativer Inkontinenz (Muskelerschlaffung in Narkose) vor.</li>
                <li>Orthograde Darmlavage (Literweise Trinken) wird heute nur noch selten durchgeführt (z.B. bei Stoma-Anlage).</li>
              </ul>
            </LearningNugget>
          </div>
        </div>

        
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Körperpflege</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Sektion 3: Körperpflege / OP Tag */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-cyan-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600"><Bath className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 3: Körperpflege & Schmuck</h3>
            </div>
            <QuizPflege onComplete={() => { onNuggetComplete(8); if(onAchievement) onAchievement("Abführ-Ass", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[8]} />
            <LearningNugget title="Körperpflege und Vorbereitung im Zimmer" isVisible={!!completedNuggets[8]}>
              <p className="mb-2"><strong>Körperreinigung:</strong> Die Anzahl der Hautkeime soll auf ein Minimum reduziert werden (Infektionsprophylaxe). Haut nicht eincremen (schlecht für Desinfektion und EKG-Elektroden). Danach frische Kleidung anziehen (Patientenhemd, Netzhose, Vorlage, MTPS).</p>
              
              <div className="my-4 flex justify-center space-x-4">
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/OP%20Haube.jpg" alt="OP Haube" className="rounded-lg shadow-sm max-h-32 object-cover" />
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Netzhose.png" alt="Netzhose" className="rounded-lg shadow-sm max-h-32 object-cover" />
   <LightboxImage src="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/ATS.jpg" alt="MTPS / ATS" className="rounded-lg shadow-sm max-h-32 object-cover" />
              </div>

              <p className="mb-2"><strong>Nagellack, Schmuck, Make-up:</strong> Nagellack entfernen (Erkennung Zyanose / Pulsoxymetrie), Make-up verzichten (Beobachtung Hautfarbe). Schmuck/Piercings entfernen (Verbrennungsgefahr bei Elektro-Chirurgie).</p>
              
              <p className="mb-2"><strong>Haarentfernung:</strong></p>
              <div className="my-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Clipper.jpg" alt="Clipper" className="rounded-lg shadow-sm w-full object-cover" />
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Rasierer%201.jpg" alt="Einmalrasierer" className="rounded-lg shadow-sm w-full object-cover" />
                <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautverletzung%201.png" alt="Mikroverletzung 1" className="rounded-lg shadow-sm w-full object-cover h-32" />
   <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautbverletzung%202.jpg" alt="Mikroverletzung 2" className="rounded-lg shadow-sm w-full object-cover h-32" />
              </div>
              <p>Von einer Nassrasur (Einmalrasierer) sollte abgesehen werden, da dies zu Mikroverletzungen führt, welche die Infektionsgefahr deutlich steigern. Stattdessen werden Haare mit einem Clipper (elektrisch) gekürzt.</p>
            </LearningNugget>
          </div>
        </div>

        
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit dem Transport in den OP</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Sektion 4: Medikation & Transport */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-indigo-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><ClipboardCheck className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 4: Medikation, Thromboseprophylaxe & Transport</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Am Operationstag sind die korrekte Verabreichung von Medikamenten, die Thromboseprophylaxe und die sichere Übergabe essenziell.</p>
            
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-indigo-900 mb-2">Kurzinfo: Medizinische Thromboseprophylaxestrümpfe (MTPS/ATS)</h4>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <LightboxImage src="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/ATS.jpg" alt="MTPS" className="rounded-lg shadow-sm max-w-[200px]" />
                <p className="text-sm text-slate-700">Am OP-Tag selbst erhält der Patient meist keine medikamentöse Thromboseprophylaxe (z.B. Heparin) wegen der Blutungsgefahr. Wichtig sind stattdessen die Strümpfe, deren Größe vorab exakt ausgemessen werden muss.</p>
              </div>
            </div>

            <QuizThrombose onComplete={() => { onNuggetComplete(9); if(onAchievement) onAchievement("Prämedikations-Profi", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[9]} />
            <QuizPraemedikation onComplete={() => { onNuggetComplete(10); if(onAchievement) onAchievement("Nugget 11 gemeistert!", "Wissens-Nugget erfolgreich abgeschlossen!"); }} isDone={!!completedNuggets[10]} />
            
            <LearningNugget title="Prämedikation & Transport" isVisible={!!completedNuggets[10]}>
              <p className="mb-2"><strong>Prämedikation:</strong> Dient der Anxiolyse (Angstlösung) und Sedierung (Beruhigung). Achtung: Bei Benzodiazepinen bei älteren Menschen kritisch hinterfragen (verlängerte Aufwachzeit).</p>
              <p className="mb-4 text-red-600 font-bold border-l-4 border-red-500 pl-3 bg-red-50 py-2">WICHTIG: Nach der Prämedikation besteht erhöhte Sturzgefahr! Die Toilette muss vorher aufgesucht werden, danach darf die Person nicht mehr alleine aufstehen.</p>
              
              <p className="mb-2"><strong>Transport und Übergabe:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Zahnprothesen und Wertgegenstände ablegen (Ausnahme: Seh-/Hörhilfen bis zum Vorraum / OP-Schleuse).</li>
                <li>Im Eingangsbereich der OP-Abteilung (Schleuse) wird der Patient übergeben: Patient:in vorstellen, Name nennen, geplante Operation nennen (Verwechslungsgefahr!).</li>
                <li>Bett ggf. frisch beziehen (Keimverschleppung vermeiden).</li>
              </ul>
            </LearningNugget>
          </div>
        </div>

      </div>
      <NavigationButtons current="wissen" onNavigate={onNavigate} />
    </section>
  );
}
