import os

content = """import { useState, useEffect } from 'react';
import { Brain, Activity, Utensils, Bath, ClipboardCheck, Trophy, BookOpen, FileText, AlertCircle, TestTube, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import { playSound } from '../utils/audio';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
  onNuggetComplete: (index: number) => void;
  completedNuggets: Record<number, boolean>;
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

function QuizFeedback({ status, feedback }: { status: 'idle' | 'correct' | 'incorrect', feedback: string }) {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 10, height: 0 }} 
          animate={{ opacity: 1, y: 0, height: 'auto' }} 
          exit={{ opacity: 0, y: 10, height: 0 }}
          className="mt-4 overflow-hidden relative z-10"
        >
          <div className={`p-4 rounded-xl border-2 flex items-start space-x-3 text-sm font-medium ${
            status === 'correct' 
              ? 'bg-green-100 border-green-500 text-green-800' 
              : 'bg-red-100 border-red-500 text-red-800'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {status === 'correct' ? (
                <i className="fas fa-check text-green-700 text-lg"></i>
              ) : (
                <i className="fas fa-times text-red-700 text-lg"></i>
              )}
            </div>
            <span>{feedback}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Quiz 0.1: Flashcards ---
function QuizFlipCards({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>(
    isDone ? { '1': true, '2': true, '3': true, '4': true } : { '1': false, '2': false, '3': false, '4': false }
  );
  const [status, setStatus] = useState<'idle' | 'correct'>(isDone ? 'correct' : 'idle');

  const cards = [
    { id: '1', front: 'Offene OP', back: 'Hautschnitt (längs oder quer), bei dem die Bauchdecke oder Thorax eröffnet wird.' },
    { id: '2', front: 'Minimalinvasiv', back: 'Laparoskopie ("Schlüsselloch-Chirurgie"). Vorteil: kleinere Wunden, weniger Infektionen.' },
    { id: '3', front: 'Elektiv', back: 'Frei wählbarer Zeitpunkt (z.B. Leistenbruch, Gelenkersatz). Keine akute Lebensgefahr.' },
    { id: '4', front: 'Notfall', back: 'Sofortige OP zwingend erforderlich (z.B. innere Blutung, Milzruptur) zur Lebensrettung.' }
  ];

  const toggleCard = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // When all have been flipped at least once
  const [hasFlipped, setHasFlipped] = useState<Record<string, boolean>>(
    isDone ? { '1': true, '2': true, '3': true, '4': true } : { '1': false, '2': false, '3': false, '4': false }
  );

  useEffect(() => {
    const newHasFlipped = { ...hasFlipped };
    let changed = false;
    Object.keys(flipped).forEach(key => {
      if (flipped[key] && !newHasFlipped[key]) {
        newHasFlipped[key] = true;
        changed = true;
      }
    });
    if (changed) {
      setHasFlipped(newHasFlipped);
      if (Object.values(newHasFlipped).every(Boolean) && status !== 'correct') {
        setStatus('correct');
        onComplete();
      }
    }
  }, [flipped, status, onComplete, hasFlipped]);

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">
          Lernmethode Flashcards: Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet. Klicken Sie dann auf die Karte, um Ihre Antwort zu überprüfen.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <div 
            key={c.id} 
            className="h-36 cursor-pointer group perspective-1000"
            onClick={() => toggleCard(c.id)}
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-500" 
              style={{ transformStyle: 'preserve-3d', transform: flipped[c.id] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div 
                className="absolute inset-0 bg-white border-2 border-blue-200 rounded-xl flex items-center justify-center p-4 shadow-sm group-hover:shadow-md transition-shadow"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="font-bold text-blue-800 text-lg text-center">{c.front}</span>
              </div>
              <div 
                className="absolute inset-0 bg-blue-50 border-2 border-blue-400 rounded-xl flex items-center justify-center p-4 shadow-sm"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="font-medium text-blue-900 text-sm text-center">{c.back}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {status === 'correct' && (
        <QuizFeedback status="correct" feedback="Super! Sie haben alle Karten umgedreht. Der Learning Nugget ist nun verfügbar." />
      )}
    </div>
  );
}

// --- Quiz 0.2: Bucket ---
function QuizBucket({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const correctAnswers = ['Blutbild', 'Gerinnungsfaktoren', 'EKG', 'Röntgenthorax', 'Elektrolyte'];
  const [bucket, setBucket] = useState<string[]>(isDone ? [...correctAnswers] : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = ['Blutbild', 'Vitamin D-Spiegel', 'Gerinnungsfaktoren', 'Langzeit-Blutdruck', 'EKG', 'Röntgenthorax', 'MRT Kopf', 'Elektrolyte'];

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

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">
          Auftrag: Welche Untersuchungen gehören typischerweise (je nach Alter und Eingriff) zu den allgemeinen präoperativen Voruntersuchungen? Wählen Sie die richtigen aus!
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(opt => {
          const inBucket = bucket.includes(opt);
          return (
            <button
              key={opt}
              disabled={status === 'correct'}
              onClick={() => toggleItem(opt)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                inBucket 
                  ? 'border-blue-500 bg-blue-100 text-blue-900 shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt} {inBucket && <i className="fas fa-check ml-1 text-blue-600"></i>}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/50 min-h-[100px] flex flex-col items-center justify-center">
        {bucket.length === 0 ? (
          <span className="text-slate-400 font-medium text-center">Ausgewählte Untersuchungen</span>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {bucket.map(b => (
              <span key={b} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm">
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
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        >
          Antwort prüfen
        </button>
      )}

      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Blutwerte, EKG und Röntgenthorax (sowie Lungenfunktion) sind Standardverfahren." : "Nicht ganz. Überlegen Sie: Braucht man standardmäßig ein MRT vom Kopf oder den Vitamin-D-Spiegel?"} />
    </div>
  );
}

// --- Quiz 0.3: Aufklärung Scenario ---
function QuizScenario({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = [
    { id: 'a', text: 'Sie lassen ihn unterschreiben, da er über 14 Jahre alt ist und einsichtsfähig wirkt.' },
    { id: 'b', text: 'Sie informieren den Arzt. Zwar können Jugendliche über 14 u. U. selbst einwilligen, im Zweifelsfall sollte der Arzt aber auch die Zustimmung der Eltern einholen.' },
    { id: 'c', text: 'Sie als Pflegefachkraft klären ihn einfach schnell selbst auf, damit der Zettel unterschrieben ist.' }
  ];

  const checkAnswers = () => {
    if (selected === 'b') {
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
        <span className="mt-1">Szenario: Ein 15-jähriger Patient kommt zur Aufnahme. Seine Eltern sind im Urlaub. Er möchte den Aufklärungsbogen zur Narkose selbst unterschreiben. Was tun Sie?</span>
      </div>
      <div className="space-y-2">
        {options.map(opt => {
          const isSel = selected === opt.id;
          return (
            <div 
              key={opt.id}
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 hover:shadow-sm ${
                isSel ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              } ${status === 'correct' ? 'pointer-events-none' : ''}`}
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
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Antwort prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback="Richtig! Eine Aufklärung durch die Pflege ist verboten. Ärztliche und juristische Absicherung (Eltern) ist hier nötig." />
    </div>
  );
}

// --- Quiz 1.1: Multi Select Fähigkeiten ---
function QuizFaehigkeiten({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const correctAnswers = ['a', 'b', 'd', 'e'];
  const [selected, setSelected] = useState<string[]>(isDone ? correctAnswers : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = [
    { id: 'a', text: 'Atemübungen / Einsatz eines Atemtrainers' },
    { id: 'b', text: 'En-bloc-Aufstehen aus dem Bett' },
    { id: 'c', text: 'Sich selbstständig eine Flexüle legen' },
    { id: 'd', text: 'Bettfahrrad fahren / Fußgelenke kreisen' },
    { id: 'e', text: 'Korrekte Handhabung des Patienten-Schmerztropfs (PCA-Pumpe)' },
    { id: 'f', text: 'Das OP-Besteck benennen' }
  ];

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

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">
          Auftrag: Welche der folgenden Maßnahmen können postoperativ relevant sein und sollten daher bereits präoperativ (im Rahmen der Prähabilitation) mit dem Patienten eingeübt werden? (Mehrere Antworten)
        </span>
      </div>
      <div className="space-y-2">
        {options.map(opt => {
          const isSel = selected.includes(opt.id);
          return (
            <div 
              key={opt.id}
              onClick={() => toggleSelect(opt.id)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 hover:shadow-sm ${
                isSel ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'
              } ${status === 'correct' ? 'pointer-events-none' : ''}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all"
        >
          Antwort prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback={status === 'correct' ? "Korrekt! Alle patientenbezogenen physiologischen Übungen (Atmung, Bewegung, Schmerz) gehören dazu. Das Legen von Zugängen ist natürlich pflegerische/ärztliche Aufgabe." : "Überprüfen Sie Ihre Auswahl. Nicht jede absurde Option ist eine pflegerische Schulung."} />
    </div>
  );
}


// --- Quiz 1.2: Zuordnung ---
function QuizMatching({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    isDone ? { '1': 'b', '2': 'a', '3': 'c', '4': 'd' } : { '1': '', '2': '', '3': '', '4': '' }
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const pairs = [
    { id: '1', text: 'Atemübungen / Atemtrainer', target: 'b' },
    { id: '2', text: 'En-bloc-Aufstehen', target: 'a' },
    { id: '3', text: 'Fußgymnastik im Bett', target: 'c' },
    { id: '4', text: 'Umgang mit Schmerzpumpe (PCA)', target: 'd' }
  ];

  const targets = [
    { id: 'a', text: 'Schmerzen an der Bauchnaht beim Mobilisieren minimieren.' },
    { id: 'b', text: 'Sekretstau und Pneumonie vorbeugen.' },
    { id: 'c', text: 'Venösen Rückfluss steigern (Thromboseprophylaxe).' },
    { id: 'd', text: 'Ausreichende Analgesie zur Frühmobilisation sichern.' }
  ];

  const checkAnswers = () => {
    if (answers['1'] === 'b' && answers['2'] === 'a' && answers['3'] === 'c' && answers['4'] === 'd') {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
      playSound('error');
    }
  };

  const isAllAnswered = Object.values(answers).every(v => v !== '');

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Auftrag: Ordnen Sie nun der präoperativen Übung das korrekte postoperative Ziel zu!</span>
      </div>
      <div className="space-y-3 text-sm">
        {pairs.map(p => (
          <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-medium text-slate-700 mb-2 md:mb-0 md:w-1/3">{p.text}</span>
            
            <div className="flex items-center text-slate-400 mx-2 hidden md:block">
              <i className="fas fa-arrow-right"></i>
            </div>
            
            <select 
              value={answers[p.id]} 
              onChange={(e) => { setAnswers({...answers, [p.id]: e.target.value}); setStatus('idle'); }}
              disabled={status === 'correct'}
              className={`w-full md:w-1/2 p-2 rounded-lg border outline-none transition-colors ${
                status === 'correct' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-slate-50 border-slate-300 text-slate-700 focus:border-blue-500'
              }`}
            >
              <option value="" disabled>Ziel auswählen...</option>
              {targets.map(t => (
                <option key={t.id} value={t.id}>{t.text}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button 
          onClick={checkAnswers}
          disabled={!isAllAnswered}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all"
        >
          Zuordnung prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback="Perfekt zugeordnet! Sie haben die Zusammenhänge der Prähabilitation verstanden." />
    </div>
  );
}


// --- Quiz 2.1: Multi Select Abführen ---
function QuizMultipleSelect({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string[]>(isDone ? ['b', 'c'] : []);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = [
    { id: 'a', text: 'Das Kind trinkt ein halbes Glas stilles Wasser (klare Flüssigkeit).' },
    { id: 'b', text: 'Das Kind isst heimlich ein Kaugummi aus dem Nachttisch.' },
    { id: 'c', text: 'Das Kind trinkt ein Glas warme Milch.' },
    { id: 'd', text: 'Die Eltern lesen etwas vor.' }
  ];

  const toggleSelect = (id: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const checkAnswers = () => {
    const isCorrect = selected.length === 2 && selected.includes('b') && selected.includes('c');
    if (isCorrect) {
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
        <span className="mt-1">Szenario: Ein Kind ist für eine OP um 10:00 Uhr geplant. Welche Handlungen um 07:00 Uhr führen zur OP-Absage? (Mehrere Antworten)</span>
      </div>
      <div className="space-y-2">
        {options.map(opt => {
          const isSel = selected.includes(opt.id);
          return (
            <div 
              key={opt.id}
              onClick={() => toggleSelect(opt.id)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 hover:shadow-sm ${
                isSel ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">
          Antwort prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback="Richtig! Milch zählt als Nahrung (6 Stunden Karenz). Kaugummi regt die Magensaftsekretion an und bricht ebenfalls die Nüchternheit." />
    </div>
  );
}


// --- Quiz 2.2: Fast Track ---
function QuizFastTrack({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [selected, setSelected] = useState<string | null>(isDone ? 'b' : null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const options = [
    { id: 'a', text: 'Ja, abführen gehört bei jeder OP zur Routine.' },
    { id: 'b', text: 'Nein, nach Fast-Track-Konzept wird meist auf aufwändige Darmreinigung verzichtet.' },
    { id: 'c', text: 'Abführen ist nur wichtig, wenn der Patient Angst vor dem Eingriff hat.' }
  ];

  const checkAnswers = () => {
    if (selected === 'b') {
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
        <span className="mt-1">Szenario: Eine unkomplizierte OP steht an. Wird nach dem modernen "Fast-Track-Konzept" standardmäßig abgeführt?</span>
      </div>
      <div className="space-y-2">
        {options.map(opt => {
          const isSel = selected === opt.id;
          return (
            <div 
              key={opt.id}
              onClick={() => { if (status !== 'correct') { setSelected(opt.id); setStatus('idle'); } }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 hover:shadow-sm ${
                isSel ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={!selected} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">
          Antwort prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback="Richtig! Eine vollständige Darmentleerung schwächt den Patienten (Flüssigkeits-/Elektrolytverlust) und wird heute meist vermieden." />
    </div>
  );
}


// --- Quiz 3: True / False ---
function QuizTrueFalse({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    isDone ? { '1': true, '2': true, '3': false, '4': true } : { '1': null, '2': null, '3': null, '4': null }
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const statements = [
    { id: '1', text: 'Ein sehr fester Ehering, der sich nicht lösen lässt, darf in der Praxis (bzw. im Notfall) mit Pflaster abgeklebt werden, obwohl das Tragen von Schmuck vermieden werden sollte.', correct: true, errorFeedback: 'Falsch: In der Praxis wird bei nicht-entfernbaren Ringen oft so vorgegangen, da das Durchtrennen des Rings ein schwerwiegender Schritt ist.' },
    { id: '2', text: 'Die Haarentfernung per Clipper sollte möglichst nah am OP-Zeitpunkt stattfinden.', correct: true, errorFeedback: 'Richtig! Geringeres Infektionsrisiko.' },
    { id: '3', text: 'Einwegrasierer (Nassrasur) sind eine sichere Alternative zur Haarentfernung.', correct: false, errorFeedback: 'Falsch: Obsolet! Mikroläsionen fördern Keimbesiedlung.' },
    { id: '4', text: 'Nagellack muss entfernt werden, um die Sauerstoffsättigung (Pulsoxymetrie) messen und eine Zyanose am Nagelbett visuell erkennen zu können.', correct: true, errorFeedback: 'Das ist absolut korrekt!' }
  ];

  const setAnswer = (id: string, val: boolean) => {
    if (status === 'correct') return;
    setStatus('idle');
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

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

  const feedbackText = status === 'correct' 
    ? "Alle Aussagen korrekt bewertet! Sehr gut." 
    : statements.map(s => answers[s.id] !== null && answers[s.id] !== s.correct ? s.errorFeedback : "").filter(Boolean).join(" ");

  return (
    <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start space-x-3 text-blue-800 font-semibold mb-4">
        <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="mt-1">Wahr oder Falsch?</span>
      </div>
      <div className="space-y-3">
        {statements.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <p className="font-medium text-slate-800 mb-3">{s.text}</p>
            <div className="flex space-x-3">
              <button 
                disabled={status === 'correct'}
                onClick={() => setAnswer(s.id, true)} 
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                  answers[s.id] === true ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                Wahr
              </button>
              <button 
                disabled={status === 'correct'}
                onClick={() => setAnswer(s.id, false)} 
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                  answers[s.id] === false ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                Falsch
              </button>
            </div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} disabled={Object.values(answers).some(a => a === null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">
          Antwort prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback={feedbackText} />
    </div>
  );
}


// --- Quiz 4: Sort Game ---
function QuizSortGame({ onComplete, isDone }: { onComplete: () => void, isDone: boolean }) {
  const initialOrder = [
    { id: 'c', text: 'Die Prämedikation (z.B. Sedativa) wird verabreicht.' },
    { id: 'a', text: 'Die Dokumente in der (digitalen/analogen) Patientenakte (OP-Einwilligung, Narkoseprotokoll) werden kontrolliert.' },
    { id: 'd', text: 'Der Patient wird über die erhöhte Sturzgefahr aufgeklärt (darf nicht mehr alleine aufstehen).' },
    { id: 'b', text: 'Der Patient wird gebeten, die Blase auf der Toilette nochmals zu entleeren.' }
  ];
  
  const correctOrder = ['a', 'b', 'c', 'd'];
  
  const [items, setItems] = useState(
    isDone ? initialOrder.sort((x, y) => correctOrder.indexOf(x.id) - correctOrder.indexOf(y.id)) : initialOrder
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isDone ? 'correct' : 'idle');

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (status === 'correct') return;
    setStatus('idle');
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < items.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setItems(newItems);
  };

  const checkAnswers = () => {
    const isCorrect = items.every((item, idx) => item.id === correctOrder[idx]);
    if (isCorrect) {
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
        <span className="mt-1">Auftrag: Ordnen Sie diese Schritte in die ZWINGEND richtige Reihenfolge vor dem eigentlichen OP-Transport!</span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className={`flex items-center p-3 rounded-xl border-2 transition-all ${status === 'correct' ? 'border-green-200 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
            <div className="flex flex-col mr-3 space-y-1">
              <button 
                onClick={() => moveItem(idx, 'up')} 
                disabled={idx === 0 || status === 'correct'}
                className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1"
              >
                <i className="fas fa-chevron-up"></i>
              </button>
              <button 
                onClick={() => moveItem(idx, 'down')} 
                disabled={idx === items.length - 1 || status === 'correct'}
                className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1"
              >
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
            <div className="flex-grow font-medium text-slate-800">{item.text}</div>
            <div className="font-bold text-slate-300 ml-4 text-xl">{idx + 1}</div>
          </div>
        ))}
      </div>
      {status !== 'correct' && (
        <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all">
          Reihenfolge prüfen
        </button>
      )}
      <QuizFeedback status={status} feedback="Exakt! Zuerst Formalien prüfen, DANN zur Toilette schicken, DANN prämedizieren und ZULETZT über die Sturzgefahr informieren (da der Patient danach nicht mehr alleine gehen darf)." />
    </div>
  );
}

// --- Main Section ---

export default function KnowledgeBaseSection({ onNavigate, onNuggetComplete, completedNuggets }: Props) {
  const requiredQuizzes = 8;
  const allCompleted = Object.values(completedNuggets).filter(Boolean).length >= requiredQuizzes;

  return (
    <section className="max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Die Wissens-Base</h2>
        <ModuleMeta 
          time="Doppelstunde 1" 
          mode="Einzelarbeit" 
          goal="Fachwissen aufbauen & überprüfen" 
        />
        
        <div className="mt-6 bg-blue-50/50 border border-blue-200 p-6 rounded-2xl text-left">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">Arbeitsauftrag</h3>
              <p className="text-slate-700 mb-4">
                Nachdem Sie das Einstiegsvideo angesehen haben, ist es nun an der Zeit, die Theorie zu festigen. Bitte lesen Sie den Primärtext vollständig durch und bearbeiten Sie anschließend die untenstehenden Themengebiete. 
              </p>
              <div className="space-y-3">
                <a 
                  href="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/ICare%20Pflege%20pr%C3%A4%20OP%20Kapitel%20-%20Reduced.pdf" 
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>I Care Text (Primärquelle) öffnen</span>
                </a>
                
                <p className="text-sm text-slate-500 mt-2">
                  Zusatzangebot für schnelle Leser:innen: <br />
                  <a 
                    href="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/CNE%20pr%C3%A4OP.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    CNE Artikel zur präoperativen Vorbereitung
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-yellow-900 flex flex-col sm:flex-row items-center justify-between shadow-lg border border-yellow-400/50"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white/40 p-3 rounded-full shrink-0">
                <Trophy className="w-8 h-8 text-amber-700 drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Wissens-Meister!</h3>
                <p className="text-sm font-medium opacity-90">Sie haben alle Learning Nuggets erfolgreich absolviert. Die nächsten Module sind nun entsperrt.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        
        {/* Sektion 0 */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3">SEKTION 0: Grundlagen & Einteilung von Operationen</h3>
            
            <div className="mt-6 space-y-6">
              {/* Block 0.1 */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-800">BLOCK 0.1: Definition & Einteilung</h4>
                </div>
                <div className="p-4 sm:p-6">
                  <QuizFlipCards onComplete={() => onNuggetComplete(1)} isDone={!!completedNuggets[1]} />
                  <LearningNugget title="Einteilung von Operationen" isVisible={!!completedNuggets[1]}>
                    <p className="mb-2"><strong>Nach Operationstechnik:</strong></p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li><strong>Offene OP:</strong> Es erfolgt ein größerer Hautschnitt (Längs- oder Querschnitt), bei dem z. B. die Bauchdecke eröffnet wird.</li>
                      <li><strong>Minimalinvasive Verfahren (MIC):</strong> Laparoskopie bzw. „Schlüsselloch-Chirurgie“. Die Eingriffe haben kleinere Wunden, ein geringeres Infektionsrisiko und ermöglichen oft eine schnellere Mobilisation.</li>
                    </ul>
                    <p className="mb-2"><strong>Nach Dringlichkeit:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Elektive Operation:</strong> Der Zeitpunkt ist frei wählbar (z. B. Leistenbruch, Gelenkersatz).</li>
                      <li><strong>Notfalloperation:</strong> Muss sofort zur Lebensrettung durchgeführt werden (z. B. Milzruptur).</li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, perioperative Phase, Kapitel "Einteilung von Operationen".</p>
                  </LearningNugget>
                </div>
              </div>

              {/* Block 0.2 */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center space-x-3">
                  <TestTube className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-800">BLOCK 0.2: Voruntersuchungen & Aufklärung</h4>
                </div>
                <div className="p-4 sm:p-6">
                  <QuizBucket onComplete={() => onNuggetComplete(2)} isDone={!!completedNuggets[2]} />
                  <LearningNugget title="Präoperative Voruntersuchungen" isVisible={!!completedNuggets[2]}>
                    <p className="mb-2">Je nach Alter und Vorerkrankung des Patienten werden verschiedene klinische Untersuchungen angeordnet:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li><strong>Labor:</strong> Kleines/großes Blutbild, Blutgerinnung, Elektrolyte, Kreuzblut.</li>
                      <li><strong>EKG:</strong> Häufig ab einem bestimmten Alter oder bei kardiologischen Vorerkrankungen.</li>
                      <li><strong>Röntgen-Thorax:</strong> Um Herz und Lunge vor der Narkose zu beurteilen.</li>
                      <li><strong>Lungenfunktionstest:</strong> Bei bestehenden Atemwegserkrankungen (z.B. COPD).</li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, perioperative Phase, "Klinische Voruntersuchungen".</p>
                  </LearningNugget>

                  <QuizScenario onComplete={() => onNuggetComplete(3)} isDone={!!completedNuggets[3]} />
                  <LearningNugget title="Die OP-Aufklärung" isVisible={!!completedNuggets[3]}>
                    <p className="mb-2"><strong>Wer klärt auf?</strong> Ausschließlich der Arzt (Arztvorbehalt). Die Pflege darf organisieren, aber keine medizinisch-inhaltliche Aufklärung durchführen.</p>
                    <p className="mb-2"><strong>Wer willigt ein?</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Erwachsene, die einwilligungsfähig sind.</li>
                      <li>Bei Minderjährigen (insbesondere unter 14 Jahren) sind die Sorgeberechtigten zuständig. Bei Jugendlichen über 14 Jahren hängt es von der Einsichtsfähigkeit und der Schwere des Eingriffs ab (z.B. elektiv vs. Notfall). Im elektiven Setting wird in der Regel zusätzlich die Unterschrift der Eltern eingeholt.</li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, "Die Aufklärung".</p>
                  </LearningNugget>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sektion 1 */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-3">
              <Activity className="w-7 h-7 text-green-600" />
              <h3 className="text-xl font-bold text-slate-900">SEKTION 1: Präoperative Fähigkeiten einüben (Prähabilitation)</h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Die <strong>Prähabilitation</strong> zielt darauf ab, die funktionelle Kapazität des Patienten <em>vor</em> der Operation so zu verbessern, dass Komplikationen nach dem Eingriff reduziert werden. Dazu gehört es, physiologische Fähigkeiten frühzeitig zu schulen.
            </p>

            <QuizFaehigkeiten onComplete={() => onNuggetComplete(4)} isDone={!!completedNuggets[4]} />
            
            <AnimatePresence>
              {completedNuggets[4] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6">
                  <QuizMatching onComplete={() => onNuggetComplete(5)} isDone={!!completedNuggets[5]} />
                  <LearningNugget title="Ziele der Prähabilitation" isVisible={!!completedNuggets[5]}>
                    <p className="mb-2">Das Einüben postoperativer Fähigkeiten (Prähabilitation) hat klare prophylaktische Ziele:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Atemübungen & Atemtrainer:</strong> Dienen der Pneumonieprophylaxe. Sie sollen Sekretstau verhindern und die Lunge nach der Narkose belüften.</li>
                      <li><strong>Bettfahrrad & Fußgymnastik:</strong> Dienen der Thromboseprophylaxe durch Steigerung des venösen Rückflusses.</li>
                      <li><strong>En-bloc-Aufstehen:</strong> (Aufstehen mit geradem Rücken und über die Seite) Reduziert die Dehnungsschmerzen an der Bauchnaht (Wundschmerz) und fördert eine sichere Frühmobilisation.</li>
                      <li><strong>Handhabung der PCA-Pumpe:</strong> Eine effektive Schmerztherapie (Analgesie) ist die Voraussetzung dafür, dass der Patient überhaupt tief atmen und aufstehen kann.</li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, "Präoperative Vorbereitung: Fähigkeiten einüben".</p>
                  </LearningNugget>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sektion 2 */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-3">
              <Utensils className="w-7 h-7 text-orange-500" />
              <h3 className="text-xl font-bold text-slate-900">SEKTION 2: Nüchternheit und Darmentleerung</h3>
            </div>
            
            <QuizMultipleSelect onComplete={() => onNuggetComplete(6)} isDone={!!completedNuggets[6]} />
            <QuizFastTrack onComplete={() => onNuggetComplete(7)} isDone={!!completedNuggets[7]} />
            
            <LearningNugget title="Nüchternheit & Abführen" isVisible={!!completedNuggets[7]}>
              <p className="mb-2"><strong>Aspirationsgefahr:</strong> Um das Risiko des Erbrechens (und der Einatmung in die Lunge) während der Narkoseeinleitung zu verringern, gelten strenge Regeln:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Bis <strong>6 Stunden</strong> vor der OP: Keine feste Nahrung (dazu zählen auch Milch und Milchprodukte!).</li>
                <li>Bis <strong>2 Stunden</strong> vor der OP: Nur noch kleine Mengen (1-2 Gläser) klare Flüssigkeiten (stilles Wasser, ungesüßter Tee).</li>
                <li>Kaugummikauen und Rauchen erhöhen die Magensaftsekretion und sind untersagt.</li>
              </ul>
              <p className="mb-2"><strong>Darmentleerung (Abführen):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Im Zuge der "Fast-Track-Chirurgie" wird heute auf routinemäßiges orthogrades Abführen oft verzichtet, da es den Patienten stresst und den Elektrolythaushalt stört.</li>
                <li>Nur bei speziellen OPs (insb. am Darm) wird gezielt abgeführt.</li>
              </ul>
              <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, "Nüchternheit" und "Darmentleerung".</p>
            </LearningNugget>
          </div>
        </div>

        {/* Sektion 3 */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-3">
              <Bath className="w-7 h-7 text-cyan-500" />
              <h3 className="text-xl font-bold text-slate-900">SEKTION 3: Maßnahmen am OP-Tag</h3>
            </div>
            
            <QuizTrueFalse onComplete={() => onNuggetComplete(8)} isDone={!!completedNuggets[8]} />
            
            <LearningNugget title="Vor der Operation (Körperpflege, Schmuck, Haare)" isVisible={!!completedNuggets[8]}>
              <p className="mb-2"><strong>Schmuck und Brillen:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Schmuck und Piercings (besonders Metalle) müssen abgenommen werden. Grund: Gefahr von thermischen Verbrennungen durch Hochfrequenz-Chirurgie (Diathermie).</li>
                <li>Praxistipp: Lässt sich z.B. ein Ehering absolut nicht lösen, wird dieser in Rücksprache mit Arzt/Anästhesie abgeklebt, um Verletzungen durch Ring-Durchtrennung zu vermeiden.</li>
              </ul>
              <p className="mb-2"><strong>Nagellack & Make-up:</strong></p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Nagellack und künstliche Nägel verfälschen die Werte der Pulsoxymetrie. Zudem behindern sie die visuelle Einschätzung der Hautdurchblutung (Zyanose).</li>
              </ul>
              <p className="mb-2"><strong>Haarentfernung:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Immer so nah wie möglich am OP-Zeitpunkt, um die Kolonisation (Keimwachstum) auf der Haut gering zu halten.</li>
                <li>Nur mit einem elektrischen Clipper oder Enthaarungscreme! Nassrasierer hinterlassen Mikroverletzungen und erhöhen die Rate von Wundinfektionen.</li>
              </ul>
              <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, "Maßnahmen am OP-Tag".</p>
            </LearningNugget>
          </div>
        </div>

        {/* Sektion 4 */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-3">
              <ClipboardCheck className="w-7 h-7 text-indigo-500" />
              <h3 className="text-xl font-bold text-slate-900">SEKTION 4: Dokumentation & Übergabe</h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Ein wesentlicher Teil der Übergabe ist die Überprüfung der Patientenakte. Beachten Sie, dass in modernen Kliniken oft eine <strong>hybride Aktenführung</strong> (teils digitale Akte im KIS, teils physische Mappe mit Original-Unterschriften) stattfindet. Im OP müssen alle aufklärungsrelevanten Informationen (Diagnose, Einwilligungen, Allergien) einsehbar sein.
            </p>

            <QuizSortGame onComplete={() => onNuggetComplete(9)} isDone={!!completedNuggets[9]} />
            
            <LearningNugget title="Transport & Übergabe in die Schleuse" isVisible={!!completedNuggets[9]}>
              <p className="mb-2">Die Reihenfolge der letzten Schritte ist entscheidend für die Patientensicherheit:</p>
              <ul className="list-decimal pl-5 mb-4 space-y-2">
                <li><strong>Dokumente / Identifikation:</strong> Die Patientenakte (inkl. unterschriebener Einwilligung und Narkosebogen) prüfen. Identitätsarmband anlegen.</li>
                <li><strong>Toilette:</strong> Bevor sedierende Medikamente wirken, den Patienten nochmals zur Blasenentleerung bitten.</li>
                <li><strong>Prämedikation:</strong> Die "LMA-Pille" (z.B. Midazolam) verabreichen.</li>
                <li><strong>Sicherheit herstellen:</strong> Danach darf der Patient wegen erhöhter Sturzgefahr nicht mehr alleine aufstehen!</li>
              </ul>
              <p className="text-xs text-slate-400 mt-4 italic">Ref: I Care Pflege, "Übergabe und Transport".</p>
            </LearningNugget>
          </div>
        </div>

      </div>

      <NavigationButtons current="wissen" onNavigate={onNavigate} />
    </section>
  );
}
"""

with open("src/components/KnowledgeBaseSection.tsx", "w", encoding="utf-8") as f:
    f.write(content)

