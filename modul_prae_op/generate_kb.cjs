const fs = require('fs');

const content = `import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
        <ChevronDown className={\`w-5 h-5 text-blue-600 transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
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
          <div className={\`p-4 rounded-xl border-2 flex flex-col space-y-3 text-sm font-medium \${
            status === 'correct' 
              ? 'bg-green-100 border-green-500 text-green-800' 
              : 'bg-red-100 border-red-500 text-red-800'
          }\`}>
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
                  className={\`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors \${
                    status === 'correct' 
                      ? 'bg-green-200 hover:bg-green-300 text-green-900' 
                      : 'bg-red-200 hover:bg-red-300 text-red-900'
                  }\`}
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

// Quiz 0.1
function QuizFlipCards({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>(
    isDone ? { '1': true, '2': true, '3': true, '4': true } : { '1': false, '2': false, '3': false, '4': false }
  );
  const [status, setStatus] = useState<'idle' | 'correct'>(isDone ? 'correct' : 'idle');

  const cards = useMemo(() => [
    { id: '1', front: 'Offene OP', back: 'Hautschnitt, bei dem z.B. Bauchdecke oder Thorax eröffnet wird.' },
    { id: '2', front: 'Minimalinvasiv', back: 'Laparoskopie. Vorteil: kleinere Wunden, weniger Infektionen.' },
    { id: '3', front: 'Elektiv', back: 'Frei wählbarer Zeitpunkt (z.B. Knie-OP). Nicht umgehend durchzuführen.' },
    { id: '4', front: 'Notfall', back: 'Sofortige OP zwingend zur Lebensrettung.' }
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
        <span className="mt-1">Lernmethode Flashcards: Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <div key={c.id} className="h-36 cursor-pointer group" onClick={() => toggleCard(c.id)} style={{ perspective: '1000px' }}>
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

// Quiz 0.3 Scenarios (Recht)
function QuizScenario({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected1, setSelected1] = useState<string | null>(isDone ? 'b' : null);
  const [selected2, setSelected2] = useState<string | null>(isDone ? 'c' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options1 = useMemo(() => shuffleArray([
    { id: 'a', text: 'Sie lassen ihn unterschreiben, da er über 14 Jahre alt ist und einsichtsfähig wirkt.' },
    { id: 'b', text: 'Sie informieren den Arzt. Zwar können Jugendliche über 14 u. U. selbst einwilligen, aber der Arzt muss den Fall individuell bewerten und ggf. die Eltern telefonisch kontaktieren.' },
    { id: 'c', text: 'Sie als Pflegefachkraft klären ihn einfach schnell selbst auf, damit der Zettel unterschrieben ist.' }
  ]), []);

  const options2 = useMemo(() => shuffleArray([
    { id: 'a', text: 'Sie verschieben die OP auf den nächsten Tag.' },
    { id: 'b', text: 'Sie holen die Einwilligung eines Angehörigen per Telefon ein, die Pflegekraft führt das Aufklärungsgespräch.' },
    { id: 'c', text: 'Zwei Ärzte dokumentieren die vitale Indikation (mutmaßlicher Wille) und operieren ohne vorherige Einwilligung des Patienten.' }
  ]), []);

  const checkAnswers = () => {
    if (selected1 === 'b' && selected2 === 'c') {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const retry = () => {
    setStatus('idle');
    setSelected1(null);
    setSelected2(null);
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Rechtliche Szenarien zur OP-Einwilligung</span>
      </div>
      
      <div className="mb-6">
        <p className="font-medium text-slate-800 mb-2">Fall 1: Ein 15-jähriger Patient mit Verdacht auf akute Appendizitis (Blinddarmentzündung) kommt zur Aufnahme. Es ist dringlich, aber es bleibt Zeit zur Abwägung. Seine Eltern sind im Urlaub. Er möchte den Aufklärungsbogen zur Narkose selbst unterschreiben. Was tun Sie?</p>
        <div className="space-y-2">
          {options1.map(opt => (
            <div 
              key={opt.id} onClick={() => { if (status !== 'correct') { setSelected1(opt.id); setStatus('idle'); } }}
              className={\`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 \${selected1 === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}\`}
            >{opt.text}</div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-medium text-slate-800 mb-2">Fall 2: Ein bewusstloser Patient wird nach einem schweren Verkehrsunfall mit einer lebensbedrohlichen Blutung eingeliefert (absolute Notfall-OP). Keine Angehörigen sind erreichbar. Wie ist das rechtliche Vorgehen?</p>
        <div className="space-y-2">
          {options2.map(opt => (
            <div 
              key={opt.id} onClick={() => { if (status !== 'correct') { setSelected2(opt.id); setStatus('idle'); } }}
              className={\`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 \${selected2 === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}\`}
            >{opt.text}</div>
          ))}
        </div>
      </div>

      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={!selected1 || !selected2} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Antworten prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Jugendliche über 14 können einsichtsfähig sein, der Arzt entscheidet. Bei vitaler Notfall-OP zählt der mutmaßliche Wille." : "Mindestens eine Antwort ist falsch."} onRetry={retry} />
    </div>
  );
}

// Quiz 1.1: Multi Select Fähigkeiten (Postoperativ)
function QuizFaehigkeiten({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const correctAnswers = ['a', 'b', 'd', 'e'];
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => shuffleArray([
    { id: 'a', text: 'Atemübungen / Einsatz eines Atemtrainers' },
    { id: 'b', text: 'En-bloc-Aufstehen aus dem Bett' },
    { id: 'c', text: 'Eigenständig mit dem i. v. - Zugang umgehen können' },
    { id: 'd', text: 'Korrekte Anwendung von Hilfsmitteln (z. B. Unterarmgehstützen)' },
    { id: 'e', text: 'Patientenkontrollierte Analgesie (PCA) / Schmerzpumpe bedienen' },
    { id: 'f', text: 'Das OP-Besteck benennen' }
  ]), []);

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

  const retry = () => { setStatus('idle'); setSelected([]); };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Auftrag: Welche Maßnahmen sind für die Zeit NACH der Operation relevant und sollten präoperativ (Prähabilitation) eingeübt werden? (Mehrere Antworten)</span>
      </div>
      <div className="space-y-2">
        {options.map(opt => (
          <div key={opt.id} onClick={() => toggleSelect(opt.id)} className={\`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 \${selected.includes(opt.id) ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}\`}>{opt.text}</div>
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

  const options = useMemo(() => shuffleArray([
    { id: 'a', text: 'Ein 8-jähriges Kind trinkt 2 Stunden vor OP ein halbes Glas klares Wasser.' },
    { id: 'b', text: 'Ein Patient isst heimlich Süßigkeiten.' },
    { id: 'c', text: 'Ein Patient mit Demenz trinkt versehentlich trüben Fruchtsaft 3 Stunden vor OP.' },
    { id: 'd', text: 'Ein Säugling (< 1 Jahr) wird 5 Stunden vor OP mit Formulanahrung (Flasche) gefüttert.' }
  ]), []);

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
        {options.map(opt => (
          <div key={opt.id} onClick={() => toggleSelect(opt.id)} className={\`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 \${selected.includes(opt.id) ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}\`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Süßigkeiten und trübe Säfte brechen die Nüchternheit. Klares Wasser bis 2h und Formulanahrung bis 4-6h (je nach Alter) sind erlaubt." : "Nicht ganz richtig. Denken Sie an die 6-Stunden-Regel für feste Nahrung/trübe Getränke und die 2-Stunden-Regel für klare Flüssigkeit."} onRetry={() => { setStatus('idle'); setSelected([]); }} />
    </div>
  );
}

function QuizAbfuhren({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': false, '2': true, '3': true } : { '1': null, '2': null, '3': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const statements = useMemo(() => shuffleArray([
    { id: '1', text: 'Eine orthograde Darmlavage (z.B. 4 Liter trinken zum Durchspülen) wird heute bei fast jeder OP durchgeführt.', correct: false, errorFeedback: 'Falsch: Wird heute nur noch selten (z.B. bei Stoma-Anlage) gemacht.' },
    { id: '2', text: 'Bei Eingriffen außerhalb des Intestinaltrakts (z.B. Knie-OP) wird manchmal am Vorabend ein Microklist verabreicht, um eine Darmentleerung während der Narkose zu vermeiden.', correct: true, errorFeedback: 'Richtig! Die Muskelerschlaffung in der Narkose kann zur Inkontinenz führen.' },
    { id: '3', text: 'Ob abgeführt wird, hängt stark vom geplanten Eingriff und dem Hausstandard der Klinik ab.', correct: true, errorFeedback: 'Das stimmt.' }
  ]), []);

  const checkAnswers = () => {
    const isCorrect = statements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); }
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wahr oder Falsch? (Thema Abführen)</span>
      </div>
      <div className="space-y-3">
        {statements.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <p className="font-medium text-slate-800 mb-3">{s.text}</p>
            <div className="flex space-x-3">
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} className={\`flex-1 py-2 rounded-lg border-2 font-medium \${answers[s.id] === true ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}\`}>Wahr</button>
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} className={\`flex-1 py-2 rounded-lg border-2 font-medium \${answers[s.id] === false ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}\`}>Falsch</button>
            </div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={Object.values(answers).some(a => a === null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Alle korrekt bewertet!" : "Einige Aussagen sind falsch bewertet."} onRetry={() => { setStatus('idle'); setAnswers({ '1': null, '2': null, '3': null }); }} />
    </div>
  );
}

// Quiz 3: Körperpflege / Schmuck
function QuizPflege({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(isDone ? { '1': true, '2': false, '3': true, '4': true, '5': false } : { '1': null, '2': null, '3': null, '4': null, '5': null });
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const statements = useMemo(() => shuffleArray([
    { id: '1', text: 'Zahnprothesen und Brillen sollten erst im OP-Vorraum bzw. Schleuse entfernt werden (sofern keine starke Sedierung vorliegt).', correct: true },
    { id: '2', text: 'Make-up und Körperlotion/Parfüm sind vor der OP unproblematisch.', correct: false },
    { id: '3', text: 'Ein sehr fester Ehering darf unter Umständen in der Praxis mit Pflaster abgeklebt werden, obwohl das Tragen von Schmuck streng vermieden werden sollte.', correct: true },
    { id: '4', text: 'Schmuck und Piercings (Metalle) bergen bei Einsatz der Hochfrequenz-Chirurgie das Risiko thermischer Verbrennungen.', correct: true },
    { id: '5', text: 'Haarentfernung sollte am besten 2 Tage vor der OP mit einem Nassrasierer erfolgen.', correct: false }
  ]), []);

  const checkAnswers = () => {
    const isCorrect = statements.every(s => answers[s.id] === s.correct);
    if (isCorrect) { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); }
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wahr oder Falsch? (Körperpflege, Schmuck, Haare)</span>
      </div>
      <div className="space-y-3">
        {statements.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <p className="font-medium text-slate-800 mb-3">{s.text}</p>
            <div className="flex space-x-3">
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: true })); }} className={\`flex-1 py-2 rounded-lg border-2 font-medium \${answers[s.id] === true ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}\`}>Wahr</button>
              <button disabled={status === 'correct'} onClick={() => { setStatus('idle'); setAnswers(p => ({ ...p, [s.id]: false })); }} className={\`flex-1 py-2 rounded-lg border-2 font-medium \${answers[s.id] === false ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'}\`}>Falsch</button>
            </div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={Object.values(answers).some(a => a === null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Lotionen behindern EKG-Elektroden, Make-up verbirgt Zyanose, Rasierer verursachen Mikroläsionen (Keime!)." : "Überprüfen Sie Ihre Eingaben. Es gibt hier einige Mythen aufzudecken."} onRetry={() => { setStatus('idle'); setAnswers({ '1': null, '2': null, '3': null, '4': null, '5': null }); }} />
    </div>
  );
}

// Quiz 4.1: Medikamente und Thrombose
function QuizThrombose({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = useMemo(() => shuffleArray([
    { id: 'a', text: 'Heparin als Spritze am Morgen der Operation ist zwingend.' },
    { id: 'b', text: 'Am OP-Tag gibt es KEINE medikamentöse Prophylaxe (z.B. Heparin). MTPS (Strümpfe) werden angezogen (Größe ausmessen!).' },
    { id: 'c', text: 'Thromboseprophylaxe erfolgt ausschließlich postoperativ durch Mobilisation.' }
  ]), []);

  const checkAnswers = () => { if (selected === 'b') { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); } };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wie erfolgt die Thromboseprophylaxe am OP-Tag präoperativ?</span>
      </div>
      <div className="space-y-2">
        {options.map(opt => (
          <div key={opt.id} onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }} className={\`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 \${selected === opt.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'}\`}>{opt.text}</div>
        ))}
      </div>
      {status !== 'correct' && <button onClick={checkAnswers} disabled={!selected} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Prüfen</button>}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Richtig! Heparin wird am OP-Tag meist weggelassen wegen Blutungsgefahr. MTPS (Strümpfe) sind Standard." : "Falsch. Denken Sie an die Blutungsgefahr bei OPs."} onRetry={() => { setStatus('idle'); setSelected(null); }} />
    </div>
  );
}

// Quiz 4.2: Sort Game Übergabe
function QuizSortGame({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const initialOrder = [
    { id: 'c', text: 'Gabe der Prämedikation (z.B. Midazolam).' },
    { id: 'a', text: 'Kontrolle von OP-Einwilligung, OP-Gebiet (Haare), Armband, MTPS & nüchternheit.' },
    { id: 'd', text: 'Aufklärung über erhöhte Sturzgefahr (aufgrund der Medikation) - Patient:in darf nicht mehr alleine aufstehen.' },
    { id: 'b', text: 'Aufforderung zur Blasen- und Darmentleerung auf der Toilette.' }
  ];
  
  const correctOrder = ['a', 'b', 'c', 'd'];
  const [items, setItems] = useState(isDone ? initialOrder.sort((x, y) => correctOrder.indexOf(x.id) - correctOrder.indexOf(y.id)) : shuffleArray(initialOrder));
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (status === 'correct') return;
    setStatus('idle');
    const newItems = [...items];
    if (direction === 'up' && index > 0) [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    else if (direction === 'down' && index < items.length - 1) [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    setItems(newItems);
  };

  const checkAnswers = () => {
    const isCorrect = items.every((item, idx) => item.id === correctOrder[idx]);
    if (isCorrect) { setStatus('correct'); onComplete(); } else { setStatus('incorrect'); playSound('error'); }
  };

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Ordnen Sie diese Schritte in die ZWINGEND richtige Reihenfolge VOR dem eigentlichen OP-Transport!</span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className={\`flex items-center p-3 rounded-xl border-2 transition-all \${status === 'correct' ? 'border-green-200 bg-green-50' : 'border-blue-500 bg-blue-50'}\`}>
            <div className="flex flex-col mr-3 space-y-1">
              <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0 || status === 'correct'} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1"><ChevronDown className="w-5 h-5 rotate-180" /></button>
              <button onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1 || status === 'correct'} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1"><ChevronDown className="w-5 h-5" /></button>
            </div>
            <div className="flex-grow font-medium text-slate-800">{item.text}</div>
            <div className="font-bold text-slate-300 ml-4 text-xl">{idx + 1}</div>
          </div>
        ))}
      </div>
      {status !== 'correct' && <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">Reihenfolge prüfen</button>}
      <QuizFeedback status={status} feedback="Exakt! Zuerst Formalien prüfen, DANN zur Toilette schicken, DANN prämedizieren und ZULETZT über die Sturzgefahr informieren." onRetry={() => { setStatus('idle'); setItems(shuffleArray(initialOrder)); }} />
    </div>
  );
}

// --- Main Section ---

export default function KnowledgeBaseSection({ onNavigate, onNuggetComplete, completedNuggets, onAchievement }: Props) {
  const requiredQuizzes = 7;
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
        <ModuleMeta time="Doppelstunde 1" mode="Einzelarbeit" goal="Fachwissen aufbauen & überprüfen" />
        
        <div className="mt-6 bg-blue-50/50 border border-blue-200 p-6 rounded-2xl text-left">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">Arbeitsauftrag</h3>
              <p className="text-slate-700 mb-4">Nachdem Sie das Einstiegsvideo angesehen haben, ist es nun an der Zeit, die Theorie zu festigen. Bitte bearbeiten Sie die untenstehenden Themengebiete sorgfältig. Bei Bedarf ziehen Sie das Skript hinzu.</p>
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
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Unter dem Begriff „präoperative Pflege“ versteht man alle pflegerischen Tätigkeiten und Handlungen, die vor einer Operation durchgeführt werden. Ziel der präoperativen Phase ist es, den Patienten optimal auf die geplante Operation vorzubereiten und Risiken auszuschließen.</p>
            <QuizFlipCards onComplete={() => onNuggetComplete(1)} isDone={!!completedNuggets[1]} />
            <LearningNugget title="Einteilung von Operationen" isVisible={!!completedNuggets[1]}>
              <p className="mb-2"><strong>Elektive Operation:</strong> „Elektiv“ bedeutet „auswählend“. In der Medizin sind mit elektiven Operationen solche gemeint, die medizinisch zwar indiziert sind, aber nicht umgehend durchgeführt werden müssen.</p>
              <p>Bei geplanten, nicht dringlichen Eingriffen (z. B. Knie-OP bei Arthrose), die vorbereitet werden können, werden die Voruntersuchungen und Aufklärungsgespräche heute meist ambulant durchgeführt, da so die stationäre Verweildauer kürzer ist.</p>
            </LearningNugget>
            <QuizScenario onComplete={() => onNuggetComplete(2)} isDone={!!completedNuggets[2]} />
          </div>
        </div>

        {/* Sektion 1: Prähabilitation */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-emerald-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Activity className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 1: Postoperative Fähigkeiten einüben</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Der Patient wird gezielt in die präoperativen Vorbereitungen einbezogen und gewinnt durch das Einüben postoperativer Fähigkeiten an Sicherheit. Dies kann Ängste reduzieren und sich positiv auf die Genesung auswirken.</p>
            <QuizFaehigkeiten onComplete={() => onNuggetComplete(3)} isDone={!!completedNuggets[3]} />
          </div>
        </div>

        {/* Sektion 2: Nüchternheit und Abführen */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-amber-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Utensils className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 2: Nüchternheit und Darmentleerung</h3>
            </div>
            <QuizNuechternheit onComplete={() => onNuggetComplete(4)} isDone={!!completedNuggets[4]} />
            <QuizAbfuhren onComplete={() => onNuggetComplete(5)} isDone={!!completedNuggets[5]} />
            <LearningNugget title="Maßnahmen am OP-Tag & Präoperatives Abführen" isVisible={!!completedNuggets[5]}>
              <p className="mb-2"><strong>Nüchternheit:</strong> Um bei der Narkoseeinleitung eine Aspiration von Mageninhalt zu verhindern, sollte eine Nahrungskarenz von mind. 4–6 h eingehalten werden. Klare Flüssigkeitsgabe ist bis 2 Stunden vorher möglich.</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Kinder &lt; 1 Jahr: bis zu 4h vor OP Muttermilch bzw. 4-6h Formulanahrung.</li>
                <li>Patient:innen mit kognitiven Einschränkungen: darauf achten, dass keine Nahrungsmittel in Reichweite stehen (auch Zahnputzwasser nicht trinken lassen!).</li>
              </ul>
              <p className="mb-2"><strong>Abführen:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Richtet sich nach Eingriff und Standard. Beugt intraoperativer Inkontinenz (Muskelerschlaffung in Narkose) vor.</li>
                <li>Orthograde Darmlavage (Literweise Trinken) wird heute nur noch selten durchgeführt (z.B. bei Stoma-Anlage).</li>
              </ul>
            </LearningNugget>
          </div>
        </div>

        {/* Sektion 3: Körperpflege / OP Tag */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-cyan-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600"><Bath className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 3: Körperpflege & Schmuck</h3>
            </div>
            <QuizPflege onComplete={() => onNuggetComplete(6)} isDone={!!completedNuggets[6]} />
          </div>
        </div>

        {/* Sektion 4: Medikation & Transport */}
        <div className="bg-white rounded-3xl shadow-sm border-l-8 border-l-indigo-500 border-y border-r border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><ClipboardCheck className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900">SEKTION 4: Medikation, Thromboseprophylaxe & Transport</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Am Operationstag sind die korrekte Verabreichung von Medikamenten, die Thromboseprophylaxe und die sichere Übergabe essenziell.</p>
            <QuizThrombose onComplete={() => onNuggetComplete(7)} isDone={!!completedNuggets[7]} />
            <QuizSortGame onComplete={() => onNuggetComplete(8)} isDone={!!completedNuggets[8]} />
            <LearningNugget title="Prämedikation & Transport" isVisible={!!completedNuggets[8]}>
              <p className="mb-2"><strong>Prämedikation:</strong> Dient der Anxiolyse und Sedierung. Achtung: Bei Benzodiazepinen bei älteren Menschen kritisch hinterfragen (verlängerte Aufwachzeit). Immer VORHER: Haarentfernung kontrollieren, MTPS anziehen, Armband checken, zur Toilette schicken.</p>
              <p className="mb-2"><strong>Transport und Übergabe:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Zahnprothesen und Wertgegenstände ablegen (Ausnahme: Seh-/Hörhilfen bis zum Vorraum).</li>
                <li>Übergabe in der Schleuse: Patient:in vorstellen, Name nennen, geplante Operation nennen (Verwechslungsgefahr!).</li>
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
`

fs.writeFileSync('src/components/KnowledgeBaseSection.tsx', content);
console.log('KnowledgeBaseSection rewritten successfully');
