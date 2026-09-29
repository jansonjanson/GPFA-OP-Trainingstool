import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { scenarios } from '../data';
import { 
  Gamepad2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  UserRound, 
  ClipboardList, 
  Clock, 
  Activity, 
  FileText, 
  X, 
  CheckSquare, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { Section, Option, GameState } from '../types';
import InteractiveChecklist from './InteractiveChecklist';
import NavigationButtons from './NavigationButtons';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import ModuleMeta from './ModuleMeta';
import { unlockAchievement, isAchievementUnlocked } from '../../../src/utils/gamification';

interface Props {
  onNavigate: (section: Section) => void;
  onAchievement?: (title: string, desc: string) => void;
  onGoToModulPostOp?: () => void;
}

export default function SimulatorSection({ onNavigate, onAchievement, onGoToModulPostOp }: Props) {
  const [gameState, setGameState] = useState<GameState>({});
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(100);
  const [jokers, setJokers] = useState(2);
  const [history, setHistory] = useState<{ title: string; correct: boolean }[]>([]);
  const [showJoker, setShowJoker] = useState(false);
  const [showAkte, setShowAkte] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [multiSelection, setMultiSelection] = useState<number[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Option | null>(null);
  
  const [simTutorialStep, setSimTutorialStep] = useState(0);
  const [hasSeenSimTutorial, setHasSeenSimTutorial] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (scenarios[step]) {
      const opts = [...scenarios[step].options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      setShuffledOptions(opts);
    }
  }, [step]);

  const startSimulation = () => {
    setGameState({ time: 0, nervousness: 50 });
    setStarted(true);
    setStep(0);
    setScore(100);
    setJokers(2);
    setHistory([]);
    setCurrentFeedback(null);
    if (!hasSeenSimTutorial) {
      setSimTutorialStep(1);
    }
  };

  const endSimTutorial = () => {
    setSimTutorialStep(0);
    setHasSeenSimTutorial(true);
  };

  const toggleMultiSelection = (index: number) => {
    setMultiSelection(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleMultiSubmit = () => {
    const currentScenario = scenarios[step];
    const correctIndices = shuffledOptions.map((o, i) => o.correct ? i : -1).filter(i => i !== -1);
    const isCorrect = correctIndices.length === multiSelection.length && 
                      correctIndices.every(i => multiSelection.includes(i));
    
    const newScore = Math.max(0, Math.min(100, score + (currentScenario.multiScoreChange || 0)));
    if (isCorrect) {
      setScore(newScore);
      playSound('success');
    } else {
      playSound('error');
    }
    
    setHistory(prev => [...prev, {
      title: currentScenario.title,
      correct: isCorrect
    }]);

    setCurrentFeedback({
      label: 'Multi-Select',
      scoreChange: currentScenario.multiScoreChange || 0,
      feedbackTitle: isCorrect ? (currentScenario.multiFeedbackTitle || 'Korrekt!') : 'Nicht ganz richtig...',
      feedbackText: currentScenario.multiFeedbackText || 'Überprüfen Sie noch einmal die Unterlagen.',
      correct: isCorrect
    });
    
    setMultiSelection([]);
  };

  const handleChoice = (option: Option) => {
    const newScore = Math.max(0, Math.min(100, score + option.scoreChange));
    setScore(newScore);
    
    setGameState(prev => {
      const newState = { ...prev };
      if (option.stateEffects) {
        Object.assign(newState, option.stateEffects);
      }
      if (option.timeCost !== undefined) {
        newState.time = (newState.time || 0) + option.timeCost;
      }
      if (option.nervousnessChange !== undefined) {
        newState.nervousness = Math.max(0, Math.min(100, (newState.nervousness || 50) + option.nervousnessChange));
      }
      return newState;
    });
    
    setHistory(prev => [...prev, {
      title: scenarios[step].title,
      correct: option.correct
    }]);

    setCurrentFeedback(option);
    
    if (option.correct) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const handleNext = () => {
    setCurrentFeedback(null);
    let nextStep = step + 1;
    while (nextStep < scenarios.length) {
      const s = scenarios[nextStep];
      if (!s.requiresState) break;
      if (gameState[s.requiresState.key] === s.requiresState.value) break;
      nextStep++;
    }
    setStep(nextStep);
  };

  const isGameOver = step >= scenarios.length;

  useEffect(() => {
    if (isGameOver) {
      unlockAchievement('modul3_simulation');
      try {
        localStorage.setItem('gpfa_m3_completed_quizzes', 'true');
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        // ignore
      }

      if (score >= 90 && onAchievement) {
        onAchievement("Master of Disaster", "Simulation fehlerfrei bestanden!");
      }
      playSound('unlock');
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [isGameOver, score, onAchievement]);

  return (
    <section className="max-w-4xl mx-auto w-full">
      {!started ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 sm:p-14 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -ml-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            Der Prä-OP Simulator
          </h2>

          <div className="w-full text-left max-w-xl mx-auto relative z-10">
            <ModuleMeta 
              time="Doppelstunde 6" 
              mode="Einzel- oder Partnerarbeit" 
              goal="Praxisnahe Fallsimulation & Schleusentransfer" 
            />
          </div>

          <div className="text-sm sm:text-base text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed space-y-4 relative z-10 mt-4 text-left">
            <p>Haben Sie die Checkliste und die Vorbereitungsstandards verinnerlicht? Jetzt wird es ernst.</p>
            <p>Sie übernehmen die Frühschicht auf Station 3B. Frau Meinhardt (67) ist für eine laparoskopische Cholezystektomie um 08:30 Uhr geplant. Sie ist nervös und stellt viele Fragen.</p>
            <p className="font-semibold text-slate-800 bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
              Ihre Aufgabe: Führen Sie Frau Meinhardt sicher und strukturiert durch alle Vorbereitungsschritte bis in die OP-Schleuse.
            </p>
            <p className="text-xs sm:text-sm bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-800 p-4 rounded-xl border border-amber-200 font-medium shadow-xs">
              Tipp: Wenn Sie unsicher sind, können Sie 2× den Praxisanleitungs-Joker (oben rechts) nutzen!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto relative z-10">
            <button
              onClick={startSimulation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base sm:text-lg py-4 px-10 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto cursor-pointer"
            >
              Schicht & Simulation beginnen
            </button>
            {isAchievementUnlocked('modul3_simulation') && (
              <button
                onClick={() => {
                  if (onGoToModulPostOp) onGoToModulPostOp();
                  else window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'post_op' }));
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base sm:text-lg py-4 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Direkt zu Modul 4: Post-OP</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white w-full max-w-5xl h-[95vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
            {/* Header */}
            <header className={`bg-slate-900 text-white px-4 sm:px-6 py-4 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 text-sm ${simTutorialStep > 0 ? '' : 'z-10'}`}>
              <div className="flex items-center space-x-3 w-full lg:w-auto justify-between lg:justify-start">
                <div>
                  <h1 className="font-bold text-base sm:text-lg flex items-center space-x-2 text-white">
                    <span>Prä-OP Check</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">Frau Meinhardt (67) • Cholezystektomie (08:30 Uhr)</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAkte(true)}
                    className={`bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center transition-colors shadow-sm cursor-pointer ${
                      simTutorialStep === 1 ? 'relative z-[105] ring-4 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    <span>Akte</span>
                  </button>
                  <button
                    onClick={() => setShowChecklist(true)}
                    className={`bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center transition-colors shadow-sm cursor-pointer ${
                      simTutorialStep === 2 ? 'relative z-[105] ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                  >
                    <CheckSquare className="w-4 h-4 mr-1.5" />
                    <span>Checkliste</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center w-full lg:w-auto justify-between lg:justify-end gap-3 sm:gap-6">
                
                {/* Time & Puls Indicator */}
                <div className={`flex items-center space-x-4 bg-slate-800 rounded-xl px-3.5 py-1.5 border border-slate-700 ${
                  simTutorialStep === 3 ? 'relative z-[105] ring-4 ring-rose-400 ring-offset-2 ring-offset-slate-900' : ''
                }`}>
                  <div className={`flex items-center font-mono text-sm sm:text-base ${
                    (390 + (gameState.time || 0)) >= 495 ? 'text-rose-400 animate-pulse font-bold' : 'text-blue-300 font-bold'
                  }`}>
                    <Clock className="w-4 h-4 mr-1.5" />
                    {String(Math.floor((390 + (gameState.time || 0)) / 60)).padStart(2, '0')}:
                    {String((390 + (gameState.time || 0)) % 60).padStart(2, '0')}
                  </div>
                  
                  <div className="h-5 w-px bg-slate-700"></div>
                  
                  <div className="flex flex-col w-20">
                    <div className="flex justify-between items-end mb-0.5">
                      <span className="text-[10px] uppercase text-slate-400 flex items-center"><Activity className="w-3 h-3 mr-1" /> Puls</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          (gameState.nervousness || 50) <= 40 ? 'bg-emerald-500' : (gameState.nervousness || 50) <= 70 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${gameState.nervousness || 50}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 ${
                    simTutorialStep === 5 ? 'relative z-[105] ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 p-1 rounded-xl bg-slate-800' : ''
                  }`}>
                    <button
                      onClick={startSimulation}
                      title="Simulation neu starten"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center transition-colors cursor-pointer border border-slate-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Neustart
                    </button>
                    <button
                      onClick={() => {
                        if (jokers > 0 && !currentFeedback && !isGameOver) {
                          setJokers(j => j - 1);
                          setShowJoker(true);
                        }
                      }}
                      disabled={jokers === 0 || !!currentFeedback || isGameOver}
                      className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 mr-1" />
                      Joker ({jokers})
                    </button>
                    <button
                      onClick={() => setStarted(false)}
                      title="Simulation schließen"
                      className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center transition-colors cursor-pointer border border-rose-800"
                    >
                      <X className="w-3.5 h-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Beenden</span>
                    </button>
                  </div>
                  
                  {/* Safety Score */}
                  <div className={`text-right ${
                    simTutorialStep === 4 ? 'relative z-[105] ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 p-1.5 rounded-xl bg-slate-800' : ''
                  }`}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Safety</span>
                      <span className="text-xs font-bold text-white ml-2">{score}%</span>
                    </div>
                    <div className="w-20 sm:w-28 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Area */}
            <main className="flex-grow p-5 sm:p-8 flex flex-col justify-start overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/20 relative">
              <AnimatePresence mode="wait">
                {isGameOver ? (
                  <motion.div
                    key="end"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center w-full max-w-xl mx-auto py-4"
                  >
                    <div className="inline-block p-4 bg-white shadow-md border border-slate-200 rounded-3xl mb-6">
                      <ClipboardList className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
                      <span className={score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'}>
                        {score}% Safety Score
                      </span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                      {score >= 80 && (390 + (gameState.time || 0)) <= 510
                        ? "Hervorragende Leistung! Frau Meinhardt ist absolut sicher, pünktlich und ohne Komplikationen in der OP-Schleuse angekommen. Die Vorbereitung war lückenlos."
                        : (390 + (gameState.time || 0)) > 510 
                        ? "Zeitüberschreitung! Die Vorbereitung hat zu lange gedauert. Der OP-Slot um 08:30 Uhr wurde verpasst."
                        : score >= 50 
                        ? "Solide Vorbereitung. Frau Meinhardt konnte übergeben werden, es gab jedoch kleinere Abweichungen von den klinischen Sicherheitsstandards."
                        : "Kritischer Verlauf! Wichtige Sicherheitsaspekte (z.B. Nüchternheit, Identifikation oder Sturzprophylaxe) wurden vernachlässigt."}
                    </p>
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-xs mb-8">
                      <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center">
                        Auswertung der Entscheidungssituationen
                      </h3>
                      <ul className="space-y-2.5">
                        {history.map((item, i) => (
                          <li key={i} className="flex items-start text-xs sm:text-sm">
                            {item.correct ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-500 mr-2.5 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={item.correct ? 'text-slate-700' : 'text-rose-700 font-semibold'}>
                              {item.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setStarted(false);
                          unlockAchievement('modul3_simulation');
                          try {
                            localStorage.setItem('gpfa_m3_completed_quizzes', 'true');
                            localStorage.setItem('gpfa_achievement_modul3_simulation', 'true');
                            window.dispatchEvent(new Event('storage'));
                          } catch (e) {
                            // ignore
                          }
                          if (onGoToModulPostOp) {
                            onGoToModulPostOp();
                          } else {
                            window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'post_op' }));
                          }
                        }}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2.5 cursor-pointer active:scale-95 ring-4 ring-emerald-300 animate-pulse"
                      >
                        <span>Weiter zu Modul 4: Post-OP & AWR</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={startSimulation}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Simulation wiederholen</span>
                      </button>
                      <button
                        onClick={() => setStarted(false)}
                        className="w-full sm:w-auto px-5 py-3 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Zurück zur Übersicht
                      </button>
                    </div>
                  </motion.div>
                ) : currentFeedback ? (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full max-w-xl mx-auto flex flex-col items-center text-center py-4"
                  >
                    {currentFeedback.correct ? (
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                    ) : (
                      <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
                    )}
                    
                    <h3 className={`text-2xl font-bold mb-3 ${currentFeedback.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {currentFeedback.feedbackTitle}
                    </h3>
                    
                    {(currentFeedback.timeCost || currentFeedback.nervousnessChange) ? (
                      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
                        {(currentFeedback.timeCost && currentFeedback.timeCost > 0) ? (
                          <div className="flex-1 bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center justify-center text-amber-900 font-bold text-xs">
                            <Clock className="w-4 h-4 mr-1.5 text-amber-600" />
                            +{currentFeedback.timeCost} Minuten Zeitverlust
                          </div>
                        ) : null}
                        {currentFeedback.nervousnessChange ? (
                          <div className={`flex-1 ${currentFeedback.nervousnessChange > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} border p-2.5 rounded-xl flex items-center justify-center font-bold text-xs`}>
                            <Activity className="w-4 h-4 mr-1.5" />
                            {currentFeedback.nervousnessChange > 0 
                              ? `Nervosität steigt (+${currentFeedback.nervousnessChange})` 
                              : `Nervosität sinkt (${currentFeedback.nervousnessChange})`}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className={`p-5 rounded-2xl border text-left mb-6 w-full shadow-xs ${
                      currentFeedback.correct ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-rose-50/80 border-rose-200 text-rose-950'
                    }`}>
                      <p className="font-bold text-xs uppercase tracking-wider mb-1.5 opacity-80">
                        Klinische Erläuterung:
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {currentFeedback.feedbackText}
                      </p>
                    </div>
                    
                    <button
                      onClick={currentFeedback.isFatal ? startSimulation : handleNext}
                      className={`font-bold py-3.5 px-8 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center space-x-2 cursor-pointer ${
                        currentFeedback.isFatal 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{currentFeedback.isFatal ? 'Simulation neustarten' : 'Weiter zum nächsten Schritt'}</span>
                      {currentFeedback.isFatal ? <RotateCcw className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scenario"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-xl mx-auto"
                  >
                    <div className="mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200">
                        {scenarios[step].category}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                      {scenarios[step].title}
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 p-5 rounded-2xl border border-blue-200 shadow-xs mb-6 text-blue-950 leading-relaxed text-xs sm:text-sm border-l-4 border-l-blue-600 font-medium">
                      {scenarios[step].text}
                    </div>
                    
                    <div className="space-y-3">
                      {scenarios[step].type === 'multiple' ? (
                        <>
                          {shuffledOptions.map((opt, i) => {
                            const isSelected = multiSelection.includes(i);
                            return (
                              <button
                                key={i}
                                onClick={() => toggleMultiSelection(i)}
                                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start group shadow-xs cursor-pointer ${
                                  isSelected 
                                    ? 'border-blue-500 bg-blue-50/90 text-blue-950 font-semibold' 
                                    : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-lg mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center border font-bold text-xs transition-all ${
                                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-slate-50 text-slate-400'
                                }`}>
                                  {isSelected && <Check className="w-4 h-4" />}
                                </span>
                                <span className="text-xs sm:text-sm leading-snug">
                                  {opt.label}
                                </span>
                              </button>
                            );
                          })}
                          <button 
                            onClick={handleMultiSubmit}
                            disabled={multiSelection.length === 0}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md cursor-pointer"
                          >
                            Auswahl bestätigen
                          </button>
                        </>
                      ) : (
                        shuffledOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleChoice(opt)}
                            className="w-full text-left p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-start group shadow-xs cursor-pointer"
                          >
                            <span className="w-7 h-7 bg-blue-100 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white font-black text-xs rounded-lg mr-3 flex-shrink-0 flex items-center justify-center transition-colors">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="font-medium text-slate-800 group-hover:text-slate-950 text-xs sm:text-sm leading-snug mt-0.5">
                              {opt.label}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Joker Modal */}
            <AnimatePresence>
              {showJoker && !isGameOver && !currentFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-t-4 border-amber-400"
                  >
                    <div className="flex items-start mb-6 space-x-3.5">
                      <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl flex-shrink-0">
                        <UserRound className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">Tipp der Praxisanleitung</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                          „{scenarios[step].hint}“
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowJoker(false)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm"
                    >
                      Verstanden
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Checklist Modal */}
            <AnimatePresence>
              {showChecklist && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] border border-slate-200"
                  >
                    <div className="bg-emerald-700 p-4 sm:p-5 flex justify-between items-center text-white">
                      <h3 className="text-base sm:text-lg font-bold flex items-center">
                        <CheckSquare className="w-5 h-5 mr-2 text-emerald-300" />
                        OP-Checkliste (Interaktiver Kontrollbogen)
                      </h3>
                      <button 
                        onClick={() => setShowChecklist(false)}
                        className="text-emerald-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow bg-slate-50">
                      <InteractiveChecklist />
                    </div>
                    
                    <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                      <button 
                        onClick={() => setShowChecklist(false)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Checkliste schließen
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Patientenakte Modal */}
            <AnimatePresence>
              {showAkte && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] border border-slate-200"
                  >
                    <div className="bg-slate-900 p-4 sm:p-5 flex justify-between items-center text-white">
                      <h3 className="text-base sm:text-lg font-bold flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-400" />
                        Patientenakte: Frau Carola Meinhardt
                      </h3>
                      <button 
                        onClick={() => setShowAkte(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-grow bg-slate-50 text-slate-800 text-xs sm:text-sm space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400">Patientenstammdaten</h4>
                          <p><span className="font-bold">Name:</span> Carola Meinhardt</p>
                          <p><span className="font-bold">Geburtstag / Alter:</span> 14.05.1959 (67 Jahre)</p>
                          <p><span className="font-bold">Größe / Gewicht:</span> 165 cm / 75 kg</p>
                          <p className="text-rose-600 font-bold">Allergien: Pflasterallergie, Penicillin</p>
                          <p><span className="font-bold">Besonderheit:</span> Vollprothese Oberkiefer</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400">Diagnose & OP</h4>
                          <p><span className="font-bold">Diagnose:</span> Symptomatische Cholezystolithiasis</p>
                          <p><span className="font-bold">Eingriff:</span> Laparoskopische Cholezystektomie</p>
                          <p><span className="font-bold">Geplante OP-Zeit:</span> 08:30 Uhr</p>
                          <p><span className="font-bold">Narkose:</span> Intubationsnarkose (ITN)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400">Anästhesie & Prämedikation</h4>
                          <p><span className="font-bold">Prämedikation:</span> Midazolam 7,5 mg p.o. (auf Abruf)</p>
                          <p><span className="font-bold">Nüchternheit:</span> Ab 00:00 Uhr keine feste Kost; bis 06:30 Uhr klares Wasser erlaubt</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400">Dauermedikation</h4>
                          <p><span className="font-bold">L-Thyroxin 75 µg:</span> Am OP-Morgen PAUSIEREN</p>
                          <p><span className="font-bold">Ramipril 5 mg:</span> Nach ärztl. Anordnung mit 1 Schluck Wasser GEBEN</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                      <button 
                        onClick={() => setShowAkte(false)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Akte schließen
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Simulator Tutorial Overlay (5-Step Walkthrough) */}
            <AnimatePresence>
              {simTutorialStep > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden"
                >
                  <motion.div
                    key={simTutorialStep}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    className="p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative border-4 bg-white border-blue-200"
                  >
                    {simTutorialStep === 1 && (
                      <>
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Die Patientenakte</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                          Sie können oben links jederzeit die Patientenakte öffnen, um Allergien, Vorerkrankungen und Medikationsanordnungen für Frau Meinhardt einzusehen.
                        </p>
                        <button onClick={() => setSimTutorialStep(2)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors mb-2 cursor-pointer">
                          Weiter
                        </button>
                        <button onClick={endSimTutorial} className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">
                          Tutorial überspringen
                        </button>
                      </>
                    )}
                    {simTutorialStep === 2 && (
                      <>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CheckSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Die OP-Checkliste</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                          Nutzen Sie die interaktive Checkliste während der Schicht. Haken Sie erledigte Kontrollpunkte ab, um keinen Sicherheitsaspekt zu übersehen.
                        </p>
                        <button onClick={() => setSimTutorialStep(3)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors mb-2 cursor-pointer">
                          Weiter
                        </button>
                        <button onClick={endSimTutorial} className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">
                          Tutorial überspringen
                        </button>
                      </>
                    )}
                    {simTutorialStep === 3 && (
                      <>
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Uhrzeit & Vitalparameter</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                          Oben sehen Sie die Uhrzeit. Zögern oder falsche Entscheidungen kosten wertvolle Zeit und steigern die Nervosität der Patientin.
                        </p>
                        <button onClick={() => setSimTutorialStep(4)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors mb-2 cursor-pointer">
                          Weiter
                        </button>
                        <button onClick={endSimTutorial} className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">
                          Tutorial überspringen
                        </button>
                      </>
                    )}
                    {simTutorialStep === 4 && (
                      <>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Safety Score</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                          Ihr Safety Score startet bei 100%. Jeder schwerwiegende Fehler zieht Punkte ab. Ziel ist ein Score von mindestens 80%.
                        </p>
                        <button onClick={() => setSimTutorialStep(5)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors mb-2 cursor-pointer">
                          Weiter
                        </button>
                        <button onClick={endSimTutorial} className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">
                          Tutorial überspringen
                        </button>
                      </>
                    )}
                    {simTutorialStep === 5 && (
                      <>
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Lightbulb className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Joker & Praxisanleitung</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                          Sie haben 2 Joker zur Verfügung. Nutzen Sie diese klug. Über den Neustart-Knopf können Sie jederzeit von vorn beginnen. Viel Erfolg!
                        </p>
                        <button onClick={endSimTutorial} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center cursor-pointer shadow-md">
                          <Gamepad2 className="w-5 h-5 mr-2" />
                          <span>Simulation starten</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>,
        document.body
      )}
      
      {!started && <NavigationButtons current="simulator" onNavigate={onNavigate} onGoToNextModule={onGoToModulPostOp} />}
    </section>
  );
}
