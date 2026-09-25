import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Sparkles,
  Layers,
  ChevronDown,
  Info,
  Scale,
  ArrowDown,
  GripVertical,
  BookOpen
} from 'lucide-react';
import { 
  ds1Videos, 
  definitions, 
  quiz1BasketItems, 
  quiz2MatchingPairs, 
  quiz3ClozeText, 
  quiz4CascadeSteps, 
  quiz5SwipeCards 
} from '../data/ds1Data';
import { playSound } from '../utils/audio';

function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  unlockedNuggets: string[];
  completedQuizzes?: string[];
  onUnlockNugget: (quizId: string) => void;
  onCompleteQuiz?: (quizId: string) => void;
  onGoToDS2: () => void;
}

export const DS1View: React.FC<Props> = ({ 
  unlockedNuggets, 
  completedQuizzes = [],
  onUnlockNugget, 
  onCompleteQuiz,
  onGoToDS2 
}) => {
  // Video tab state
  const [activeVideoTab, setActiveVideoTab] = useState<'original' | 'shortened'>('shortened');

  // Schritt 1 & 2 completion tracking (pulsing button confirmation)
  const [step1Completed, setStep1Completed] = useState<boolean>(() => {
    return unlockedNuggets.includes('ds1_step1_video');
  });
  const [step2Completed, setStep2Completed] = useState<boolean>(() => {
    return unlockedNuggets.includes('ds1_step2_def');
  });

  // Quiz 1: Differenzierung Furcht vs. Angst
  const [q1ItemIndex, setQ1ItemIndex] = useState<number>(0);
  const [q1Answers, setQ1Answers] = useState<Record<string, 'furcht' | 'angst'>>({});
  const [q1Feedback, setQ1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 2: Matching Pairs state with shuffled terms
  const [q2Seed, setQ2Seed] = useState<number>(1);
  const shuffledQ2Terms = useMemo(() => {
    return fisherYatesShuffle(quiz2MatchingPairs.map(p => p.term));
  }, [q2Seed]);
  const [q2SelectedScenario, setQ2SelectedScenario] = useState<string | null>(null);
  const [q2MatchedPairs, setQ2MatchedPairs] = useState<Record<string, string>>({}); // scenarioId -> term
  const [q2Feedback, setQ2Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 3: Cloze text state with shuffled dropdown options
  const [q3Seed, setQ3Seed] = useState<number>(1);
  const shuffledQ3Options = useMemo(() => {
    const res: Record<string, string[]> = {};
    quiz3ClozeText.parts.forEach(part => {
      if (part.key && part.options) {
        res[part.key] = fisherYatesShuffle([...part.options]);
      }
    });
    return res;
  }, [q3Seed]);
  const [q3Selections, setQ3Selections] = useState<Record<string, string>>({});
  const [q3Feedback, setQ3Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 4: Cascade Ordering with Drag & Drop
  const [q4Order, setQ4Order] = useState<string[]>(['s3', 's1', 's5', 's2', 's4']);
  const [q4Feedback, setQ4Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Quiz 5: Swipe Card state
  const [q5CardIndex, setQ5CardIndex] = useState<number>(0);
  const [q5Feedback, setQ5Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [q5Completed, setQ5Completed] = useState<boolean>(false);

  // Handle Quiz 1 Sort
  const handleQ1Sort = (target: 'furcht' | 'angst') => {
    const currentItem = quiz1BasketItems[q1ItemIndex];
    const isCorrect = currentItem.target === target;

    setQ1Answers(prev => ({ ...prev, [currentItem.id]: target }));
    setQ1Feedback({
      isCorrect,
      text: currentItem.explanation
    });

    if (isCorrect) {
      playSound('pop');
    } else {
      playSound('error');
    }

    if (q1ItemIndex === quiz1BasketItems.length - 1 && isCorrect) {
      onUnlockNugget('ds1_quiz1');
      onCompleteQuiz?.('ds1_quiz1');
      playSound('unlock');
    }
  };

  const handleNextQ1Item = () => {
    setQ1Feedback(null);
    if (q1ItemIndex < quiz1BasketItems.length - 1) {
      setQ1ItemIndex(prev => prev + 1);
    }
  };

  // Handle Quiz 2 Match
  const handleQ2Match = (term: string) => {
    if (!q2SelectedScenario) return;
    const pair = quiz2MatchingPairs.find(p => p.id === q2SelectedScenario);
    if (!pair) return;

    const isCorrect = pair.term === term;
    if (isCorrect) {
      playSound('success');
      const updated = { ...q2MatchedPairs, [q2SelectedScenario]: term };
      setQ2MatchedPairs(updated);
      setQ2Feedback({ isCorrect: true, text: pair.explanation });
      setQ2SelectedScenario(null);

      if (Object.keys(updated).length === quiz2MatchingPairs.length) {
        onUnlockNugget('ds1_quiz2');
        onCompleteQuiz?.('ds1_quiz2');
        playSound('unlock');
      }
    } else {
      playSound('error');
      setQ2Feedback({
        isCorrect: false,
        text: `Nicht ganz! Überlegen Sie: Trifft diese Zuordnung wirklich zu?`
      });
    }
  };

  // Handle Quiz 3 Submit
  const handleQ3Submit = () => {
    const clozeParts = quiz3ClozeText.parts.filter(p => p.key);
    
    let allCorrect = true;
    for (const part of clozeParts) {
      if (q3Selections[part.key!] !== part.correct) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      playSound('unlock');
      setQ3Feedback({
        isCorrect: true,
        text: 'Hervorragend! Alle physiologischen Begriffe und vegetativen Regulationskreise wurden fachlich exakt zugeordnet.'
      });
      onUnlockNugget('ds1_quiz3');
      onCompleteQuiz?.('ds1_quiz3');
    } else {
      playSound('error');
      setQ3Feedback({
        isCorrect: false,
        text: 'Einige Begriffe sind noch nicht korrekt. Prüfen Sie insbesondere die Funktionen von Sympathikus vs. Parasympathikus.'
      });
    }
  };

  // Handle Quiz 4 Drag & Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...q4Order];
    const [movedItem] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);
    setQ4Order(newOrder);
    setQ4Feedback(null);
    setDraggedIndex(null);
    playSound('pop');
  };

  // Handle Quiz 4 Move (fallback button)
  const handleQ4Move = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...q4Order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setQ4Order(newOrder);
    setQ4Feedback(null);
  };

  const handleQ4Check = () => {
    const correctIds = ['s1', 's2', 's3', 's4', 's5'];
    const isCorrect = q4Order.every((id, idx) => id === correctIds[idx]);

    if (isCorrect) {
      playSound('unlock');
      setQ4Feedback({
        isCorrect: true,
        text: 'Perfekt! Sie haben die neurobiologische Signalkaskade vom Außenreiz über Amygdala und Hypothalamus bis zur Hormonausschüttung der Nebennieren fehlerfrei geordnet.'
      });
      onUnlockNugget('ds1_quiz4');
      onCompleteQuiz?.('ds1_quiz4');
    } else {
      playSound('error');
      setQ4Feedback({
        isCorrect: false,
        text: 'Die Reihenfolge stimmt noch nicht. Welches Organ nimmt den Reiz zuerst wahr und wo findet die emotionale Bewertung vor dem Hormonspiegel statt?'
      });
    }
  };

  // Handle Quiz 5 Swipe
  const handleQ5Answer = (userChoice: boolean) => {
    const card = quiz5SwipeCards[q5CardIndex];
    const isCorrect = card.isCorrect === userChoice;

    if (isCorrect) {
      playSound('pop');
    } else {
      playSound('error');
    }

    setQ5Feedback({
      isCorrect,
      text: card.explanation
    });

    if (q5CardIndex === quiz5SwipeCards.length - 1 && isCorrect) {
      setQ5Completed(true);
      onUnlockNugget('ds1_quiz5');
      onCompleteQuiz?.('ds1_quiz5');
      playSound('unlock');
    }
  };

  const handleNextQ5Card = () => {
    setQ5Feedback(null);
    if (q5CardIndex < quiz5SwipeCards.length - 1) {
      setQ5CardIndex(prev => prev + 1);
    }
  };

  const handleResetQ1 = () => {
    setQ1ItemIndex(0);
    setQ1Answers({});
    setQ1Feedback(null);
    playSound('pop');
  };

  const handleResetQ2 = () => {
    setQ2SelectedScenario(null);
    setQ2MatchedPairs({});
    setQ2Feedback(null);
    setQ2Seed(prev => prev + 1);
    playSound('pop');
  };

  const handleResetQ3 = () => {
    setQ3Selections({});
    setQ3Feedback(null);
    setQ3Seed(prev => prev + 1);
    playSound('pop');
  };

  const handleResetQ4 = () => {
    setQ4Order(['s3', 's1', 's5', 's2', 's4']);
    setQ4Feedback(null);
    setDraggedIndex(null);
    playSound('pop');
  };

  const handleResetQ5 = () => {
    setQ5CardIndex(0);
    setQ5Feedback(null);
    setQ5Completed(false);
    playSound('pop');
  };

  return (
    <div className="space-y-12">
      {/* Introduction Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span>Doppelstunde 3 / Modul 2 (90 Minuten)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Theoretische Grundlagen & Neurobiologie der OP-Angst
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Erarbeiten Sie die neurobiologischen Entstehungsformen und die physiologische Stresskaskade von Frau Meinhardt vor der Cholezystektomie.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">Freigeschaltete Nuggets</span>
              <span className="text-slate-500 font-medium">
                {unlockedNuggets.filter(id => id.startsWith('ds1_')).length} von 4 freigeschaltet
              </span>
            </div>
          </div>
        </div>

        {/* Video Section: Schritt 1 */}
        <div className="mt-8">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              Arbeitsauftrag 1: Video vollständig ansehen & Pathophysiologie erfassen
            </span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Sehen Sie sich das Lehrvideo zur Neurobiologie der Angst im Körper aufmerksam und vollständig an.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <span>1. Videoimpuls: Wie Angst im Körper entsteht</span>
            </h3>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveVideoTab('shortened')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeVideoTab === 'shortened'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gekürzte Fassung (Kompakt)
              </button>
              <button
                onClick={() => setActiveVideoTab('original')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeVideoTab === 'original'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Original (Volle Länge)
              </button>
              <a
                href={ds1Videos[activeVideoTab].externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm ml-1"
                title="Direkt auf YouTube öffnen"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Auf YouTube ansehen</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Video Player Box */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto shadow-lg relative border border-slate-800 group">
            <iframe
              key={ds1Videos[activeVideoTab].url}
              src={ds1Videos[activeVideoTab].url}
              title={ds1Videos[activeVideoTab].title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Quick-Access Floating YouTube Badge */}
            <a
              href={ds1Videos[activeVideoTab].externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 bg-slate-900/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-1.5 shadow-lg z-10"
            >
              <Play className="w-3 h-3 fill-current text-red-400 group-hover:text-white" />
              <span>Auf YouTube ansehen</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Prominente Anklickbare Linkfläche zur YouTube-Weiterleitung */}
          <a
            href={ds1Videos[activeVideoTab].externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-4xl mx-auto bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all shadow-sm hover:shadow-md text-left cursor-pointer group mt-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      YouTube Direktlink
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Neurobiologie der Angst
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {ds1Videos[activeVideoTab].title}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {ds1Videos[activeVideoTab].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex-shrink-0 self-start sm:self-center">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auf YouTube abspielen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>

          {/* Schritt 1 Bestätigungs-Button mit Pulsieren */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das vollständige Ansehen des Videos, um strukturiert zu Schritt 2 zu gelangen.
            </div>
            <button
              onClick={() => {
                setStep1Completed(true);
                onUnlockNugget('ds1_step1_video');
                playSound('success');
              }}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step1Completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step1Completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{step1Completed ? 'Schritt 1 gesichert: Video angesehen' : 'Schritt 1 bestätigen: Video vollständig angesehen'}</span>
            </button>
          </div>
        </div>

        {/* Pfeil-Leitung zwischen Schritt 1 und Schritt 2 */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="h-6 w-0.5 bg-blue-300"></div>
          <div className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 shadow-xs flex items-center space-x-1.5 my-1">
            <span>Nächster Schritt: Definitionen erarbeiten</span>
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="h-6 w-0.5 bg-blue-300"></div>
        </div>

        {/* Definitions Section: Schritt 2 */}
        <div className="pt-2 border-t border-slate-200">
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
              Arbeitsauftrag 2: Definitionen lesen & theoretisch sichern
            </span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Lesen Sie die folgenden wissenschaftlichen Definitionen zu „Angst“ und „Furcht“ aufmerksam und vollständig durch.
              <span className="block font-semibold text-indigo-900 mt-0.5">
                Hinweis: Diese präzise theoretische Differenzierung kam im Video noch nicht vor und ist neu!
              </span>
            </p>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <span>2. Definitionen: Angst vs. Furcht</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Furcht Box */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Akute Basisemotion
                  </span>
                  <span className="text-[11px] text-teal-600 font-medium">Ekman (2010)</span>
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2">Furcht (Fear)</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  „{definitions.furcht.quote}“
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-teal-100 space-y-1 text-xs text-teal-900 font-medium">
                {definitions.furcht.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-center space-x-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Angst Box */}
            <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                    Emotionaler Zustand
                  </span>
                  <span className="text-[11px] text-cyan-600 font-medium">Spielberger (1972) & Riemann</span>
                </div>
                <h4 className="text-xl font-bold text-cyan-950 mb-2">Angst (State-Angst)</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  „{definitions.angst.quote}“
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-cyan-100 space-y-1 text-xs text-cyan-900 font-medium">
                {definitions.angst.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-center space-x-1.5">
                    <span className="text-cyan-600 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schritt 2 Bestätigungs-Button mit Pulsieren */}
          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Durchlesen der Definitionen, um die interaktiven Quizzes zu bearbeiten.
            </div>
            <button
              onClick={() => {
                setStep2Completed(true);
                onUnlockNugget('ds1_step2_def');
                playSound('success');
              }}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step2Completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step2Completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4" />}
              <span>{step2Completed ? 'Schritt 2 gesichert: Definitionen verinnerlicht' : 'Schritt 2 bestätigen: Definitionen gelesen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pfeil-Leitung zwischen Schritt 2 und Schritt 3 */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="h-6 w-0.5 bg-blue-300"></div>
        <div className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 shadow-xs flex items-center space-x-1.5 my-1">
          <span>Weiter zu Schritt 3: Quizzes bearbeiten</span>
          <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="h-6 w-0.5 bg-blue-300"></div>
      </div>

      {/* SCHRITT 3: QUIZZES BEARBEITEN */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
          Schritt 3: Praxis-Quizzes bearbeiten
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          5 Interaktive Praxis-Quizzes
        </h3>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Lösen Sie alle 5 Aufgaben, um das Modul 2 Theorie-Achievement und wertvolle Learning Nuggets freizuschalten!
        </p>
      </div>

      {/* QUIZ 1: Drag & Drop – Die zwei Körbe (Angst vs. Furcht) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 1: Fall-Zuordnung – Angst vs. Furcht
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Fall {q1ItemIndex + 1} von {quiz1BasketItems.length}
            </span>
            {(q1ItemIndex > 0 || q1Feedback) && (
              <button
                onClick={handleResetQ1}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 1 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Scenario Card */}
        {q1ItemIndex < quiz1BasketItems.length && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
              Pflege-Szenario zum Zuordnen
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
              „{quiz1BasketItems[q1ItemIndex].text}“
            </p>
          </div>
        )}

        {/* The Two Target Categories: Furcht vs Angst */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          {/* Category 1: Furcht */}
          <button
            onClick={() => handleQ1Sort('furcht')}
            disabled={!!q1Feedback}
            className="group p-6 rounded-2xl border-2 border-teal-300 bg-teal-50/50 hover:bg-teal-500 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-teal-200 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-teal-700 transition-colors shadow-md">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h5 className="font-extrabold text-lg text-teal-950 group-hover:text-white">
              Furcht
            </h5>
            <span className="text-xs text-teal-700 group-hover:text-teal-100 mt-1">
              Akut, greifbar, präsente Gefahr
            </span>
          </button>

          {/* Category 2: Angst */}
          <button
            onClick={() => handleQ1Sort('angst')}
            disabled={!!q1Feedback}
            className="group p-6 rounded-2xl border-2 border-cyan-300 bg-cyan-50/50 hover:bg-cyan-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-cyan-200 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-cyan-700 transition-colors shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <h5 className="font-extrabold text-lg text-cyan-950 group-hover:text-white">
              Angst
            </h5>
            <span className="text-xs text-cyan-700 group-hover:text-cyan-100 mt-1">
              Zukunftsgerichtet, unbestimmt, unklar
            </span>
          </button>
        </div>

        {/* Immediate Feedback Modal/Banner */}
        {q1Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q1Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {q1Feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <strong className="block font-bold mb-1">
                {q1Feedback.isCorrect ? 'Richtig gelöst!' : 'Nicht ganz richtig:'}
              </strong>
              <span>{q1Feedback.text}</span>
              <div className="mt-3">
                {q1ItemIndex < quiz1BasketItems.length - 1 ? (
                  <button
                    onClick={handleNextQ1Item}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Nächstes Kärtchen einordnen
                  </button>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                    <Sparkles className="w-4 h-4" />
                    <span>Quiz 1 abgeschlossen! Nugget „Angst vs. Furcht“ freigeschaltet.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 2: Fallbeispiele zuordnen (Die 4 Entstehungsformen) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 2: Matching – Die 4 Entstehungsformen der Angst
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(q2MatchedPairs).length} von 4 zugeordnet
            </span>
            {Object.keys(q2MatchedPairs).length > 0 && (
              <button
                onClick={handleResetQ2}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 2 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Wählen Sie links ein Fallbeispiel aus der Pflege an und klicken Sie rechts auf den passenden Fachbegriff.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Scenarios */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pflege-Fallbeispiele
            </span>
            {quiz2MatchingPairs.map((pair) => {
              const isMatched = !!q2MatchedPairs[pair.id];
              const isSelected = q2SelectedScenario === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched}
                  onClick={() => {
                    setQ2SelectedScenario(pair.id);
                    setQ2Feedback(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs leading-relaxed ${
                    isMatched
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70 cursor-default'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-400/20 font-medium text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-[11px] font-bold text-blue-600 block mb-1">
                    {pair.scenarioTitle}
                  </span>
                  <span>{pair.scenario}</span>
                  {isMatched && (
                    <div className="mt-2 text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zugeordnet zu: {q2MatchedPairs[pair.id]}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Terms */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Fachbegriffe (Die 4 Formen)
            </span>
            {shuffledQ2Terms.map((term) => {
              const isUsed = Object.values(q2MatchedPairs).includes(term);

              return (
                <button
                  key={term}
                  disabled={isUsed || !q2SelectedScenario}
                  onClick={() => handleQ2Match(term)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all font-bold text-sm flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default'
                      : q2SelectedScenario
                      ? 'bg-white border-blue-300 hover:bg-blue-600 hover:text-white shadow-sm cursor-pointer'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{term}</span>
                  {isUsed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback display */}
        {q2Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q2Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q2Feedback.isCorrect ? 'Treffer! ' : 'Hinweis: '}</strong>
            {q2Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 3: Interaktiver Lückentext (Physiologie & Vegetatives Nervensystem) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 3: Lückentext – Physiologie & Autonomes Nervensystem
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              7 Fachbegriffe einsetzen
            </span>
            {(Object.keys(q3Selections).length > 0 || q3Feedback) && (
              <button
                onClick={handleResetQ3}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 3 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {quiz3ClozeText.intro}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-sm sm:text-base leading-loose text-slate-800">
          {quiz3ClozeText.parts.map((part, index) => {
            if (!part.key) {
              return <span key={index}>{part.text}</span>;
            }

            return (
              <span key={index} className="inline-block mx-1">
                <select
                  value={q3Selections[part.key] || ''}
                  onChange={(e) => {
                    setQ3Selections(prev => ({ ...prev, [part.key!]: e.target.value }));
                    setQ3Feedback(null);
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    q3Selections[part.key]
                      ? 'bg-blue-50 border-blue-400 text-blue-900'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  <option value="">[ Auswählen ]</option>
                  {(shuffledQ3Options[part.key] || part.options!).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleQ3Submit}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            Lückentext überprüfen
          </button>
        </div>

        {q3Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q3Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q3Feedback.isCorrect ? 'Hervorragend! ' : 'Korrektur nötig: '}</strong>
            {q3Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 4: Sortieraufgabe (Die Angstkaskade am Pflege-Szenario) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 4: Sortieraufgabe – Die neurobiologische Angstkaskade
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              5 Schritte chronologisch anordnen
            </span>
            {q4Feedback && (
              <button
                onClick={handleResetQ4}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 4 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900">
          <strong>Szenario:</strong> Sie betreten das Zimmer von Herrn K. im Krankenhaus, um den Verband seiner stark schmerzenden Wunde zu wechseln. Er sieht den Verbandswagen und gerät in Panik. Bringen Sie die neurobiologischen Schritte in die richtige chronologische Reihenfolge (von 1 oben bis 5 unten).
        </div>

        <div className="space-y-2">
          {q4Order.map((stepId, index) => {
            const step = quiz4CascadeSteps.find(s => s.id === stepId)!;
            const isDragging = draggedIndex === index;
            return (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`border rounded-2xl p-4 flex items-center justify-between transition-all cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? 'bg-blue-100/70 border-blue-400 shadow-md ring-2 ring-blue-300 opacity-60'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="cursor-grab text-slate-400 hover:text-slate-600 p-0.5">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{step.title}</h5>
                    <p className="text-xs text-slate-600">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <button
                    disabled={index === 0}
                    onClick={() => handleQ4Move(index, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-xs"
                    title="Nach oben verschieben"
                  >
                    ▲
                  </button>
                  <button
                    disabled={index === q4Order.length - 1}
                    onClick={() => handleQ4Move(index, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-xs"
                    title="Nach unten verschieben"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleQ4Check}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
        >
          Reihenfolge der Kaskade prüfen
        </button>

        {q4Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q4Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q4Feedback.isCorrect ? 'Exzellent! ' : 'Noch fehlerhaft: '}</strong>
            {q4Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 5: Fehlersuche / Wahr oder Falsch (Symptom-Check) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              5
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 5: Wahr oder Falsch – Symptom- & Praxis-Check
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Aussage {q5CardIndex + 1} von {quiz5SwipeCards.length}
            </span>
            {(q5CardIndex > 0 || q5Feedback) && (
              <button
                onClick={handleResetQ5}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 5 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        {/* Swipe Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl max-w-xl mx-auto shadow-lg text-center min-h-[160px] flex flex-col justify-center">
          <span className="text-xs uppercase font-semibold text-indigo-300 tracking-wider mb-2 block">
            Aussage zur Beurteilung
          </span>
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            „{quiz5SwipeCards[q5CardIndex].statement}“
          </p>
        </div>

        {/* Buttons: Falsch vs Wahr */}
        <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
          <button
            onClick={() => handleQ5Answer(false)}
            disabled={!!q5Feedback}
            className="flex-1 py-3 px-6 rounded-2xl border-2 border-rose-400 bg-rose-50 text-rose-800 font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm focus:outline-none"
          >
            ❌ FALSCH
          </button>
          <button
            onClick={() => handleQ5Answer(true)}
            disabled={!!q5Feedback}
            className="flex-1 py-3 px-6 rounded-2xl border-2 border-emerald-400 bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm focus:outline-none"
          >
            ✅ WAHR
          </button>
        </div>

        {/* Feedback Display */}
        {q5Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm max-w-xl mx-auto ${
            q5Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong className="block font-bold mb-1">
              {q5Feedback.isCorrect ? 'Richtig beurteilt!' : 'Leider falsch:'}
            </strong>
            <p>{q5Feedback.text}</p>
            {q5CardIndex < quiz5SwipeCards.length - 1 && (
              <button
                onClick={handleNextQ5Card}
                className="mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Nächste Aussage prüfen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Completion Banner for DS 1 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200 block mb-1">
            Doppelstunde 1 gemeistert
          </span>
          <h3 className="text-xl sm:text-2xl font-bold">
            Bereit für die Praxis? Wechseln Sie zu DS 2
          </h3>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            In Doppelstunde 2 lernen Sie den Digitalen Notfallkoffer kennen, üben deeskalierende Gesprächsführung und lösen die große OP-Simulation mit Frau Meinhardt.
          </p>
        </div>
        <button
          onClick={onGoToDS2}
          className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <span>Weiter zu Doppelstunde 2</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
