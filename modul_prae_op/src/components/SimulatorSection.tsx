import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scenarios } from '../data';
import { Gamepad2, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Lightbulb, UserRound, ClipboardList, Clock, Activity, FileText, X } from 'lucide-react';
import { Section, Option, GameState } from '../types';
import NavigationButtons from './NavigationButtons';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
  onAchievement?: (title: string, desc: string) => void;
}

export default function SimulatorSection({ onNavigate, onAchievement }: Props) {
  const [gameState, setGameState] = useState<GameState>({});
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(100);
  const [jokers, setJokers] = useState(2);
  const [history, setHistory] = useState<{ title: string, correct: boolean }[]>([]);
  const [showJoker, setShowJoker] = useState(false);
  const [showAkte, setShowAkte] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Option | null>(null);

  const startSimulation = () => {
    setGameState({ time: 0, nervousness: 50 });
    setStarted(true);
    setStep(0);
    setScore(100);
    setJokers(2);
    setHistory([]);
    setCurrentFeedback(null);
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
      // We must check if the current state matches (note: stateEffects from just now is already in gameState because setState is async? Wait, setState is async!
      // To be safe, if we setGameState inside handleChoice, it might not be reflected in gameState here inside handleNext immediately?
      // Actually, handleChoice and handleNext are separate events (button clicks). By the time user clicks "Weiter", gameState is already updated.
      if (gameState[s.requiresState.key] === s.requiresState.value) break;
      nextStep++;
    }
    setStep(nextStep);
  };

  const isGameOver = step >= scenarios.length;

  useEffect(() => {
    if (isGameOver && score >= 90) {
      if (onAchievement) onAchievement("Master of Disaster", "Simulation fehlerfrei bestanden!");
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
  }, [isGameOver, score]);

  return (
    <section className="max-w-4xl mx-auto w-full">
      {!started ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 sm:p-14 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -ml-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            SEKTION 6: Der Simulator (Das Adventure)
          </h2>

          <div className="w-full text-left max-w-xl mx-auto relative z-10">
            <ModuleMeta 
              time="Doppelstunde 6 (Modul 3)" 
              mode="Einzel- oder Partnerarbeit + Plenum" 
              goal="Simulation & Auswertung" 
            />
          </div>

          

          <div className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed space-y-4 relative z-10 mt-4 text-left">
            <p>Haben Sie Ihre Kitteltaschenkarte griffbereit? Gut. Jetzt wird es ernst.</p>
            <p>Sie übernehmen die Frühschicht. Frau Meinhardt (67) ist für eine Gallen-OP um 08:30 Uhr geplant. Sie ist nervös und stellt viele Fragen.</p>
            <p className="font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">Ihre Aufgabe: Wenden Sie Ihr Wissen und Ihre selbstgeschriebene Checkliste an, um Frau Meinhardt sicher bis in die OP-Schleuse zu bringen.</p>
            <p className="text-sm bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-800 p-4 rounded-xl border border-amber-100/60 font-medium shadow-sm">
              Tipp: Wenn Sie nicht weiterwissen, können Sie 2x den Praxisanleitungs-Joker (oben rechts) nutzen!
            </p>
          </div>
          <button
            onClick={startSimulation}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg py-4 px-10 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto relative z-10"
          >
            Schicht beginnen
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative">
          
          {/* Header */}
          <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex flex-col lg:flex-row justify-between items-center z-10 space-y-4 lg:space-y-0 text-sm">
            <div className="flex items-center space-x-4 w-full lg:w-auto justify-between lg:justify-start">
              <div>
                <h1 className="font-semibold text-base sm:text-lg flex items-center space-x-2">
                  <span>Prä-OP Check</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Frau Meinhardt (67) | Cholezystektomie</p>
              </div>
              
              <button
                onClick={() => setShowAkte(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3 rounded-lg flex items-center transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Akte
              </button>
            </div>
            
            <div className="flex flex-wrap items-center w-full lg:w-auto justify-between lg:justify-end gap-4 sm:gap-6">
              
              <div className="flex items-center space-x-4 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700/50">
                <div className={`flex items-center font-mono text-sm sm:text-base ${
                  (390 + (gameState.time || 0)) >= 495 ? 'text-rose-400 animate-pulse' : 'text-blue-300'
                }`}>
                  <Clock className="w-4 h-4 mr-1.5" />
                  {String(Math.floor((390 + (gameState.time || 0)) / 60)).padStart(2, '0')}:
                  {String((390 + (gameState.time || 0)) % 60).padStart(2, '0')}
                </div>
                
                <div className="h-6 w-px bg-slate-700"></div>
                
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

              <div className="flex items-center space-x-4 sm:space-x-6">
                <button
                  onClick={() => {
                    if (jokers > 0 && !currentFeedback && !isGameOver) {
                      setJokers(j => j - 1);
                      setShowJoker(true);
                    }
                  }}
                  disabled={jokers === 0 || !!currentFeedback || isGameOver}
                  className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-30 disabled:hover:bg-amber-500/20 text-sm font-semibold py-1.5 px-3 rounded-full flex items-center transition-colors"
                >
                  <Lightbulb className="w-4 h-4 mr-1.5" />
                  Joker ({jokers})
                </button>
                
                <div className="text-right">
                  <div className="flex justify-between items-end mb-1">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Safety Score</div>
                    <span className="text-sm font-bold ml-2">{score}%</span>
                  </div>
                  <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
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
          <main className="flex-grow p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 relative">
            <AnimatePresence mode="wait">
              {isGameOver ? (
                <motion.div
                  key="end"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center w-full max-w-xl mx-auto"
                >
                  <div className="inline-block p-3 bg-white shadow-sm border border-slate-100 rounded-2xl mb-6">
                    <ClipboardList className="w-10 h-10 text-slate-400" />
                  </div>
                  <h2 className="text-4xl font-black mb-4 tracking-tight">
                    <span className={score >= 90 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600'}>
                      {score}% Score
                    </span>
                  </h2>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    {score >= 90 && (390 + (gameState.time || 0)) <= 510
                      ? "Perfekt! Die Kitteltaschenkarte hat sich bewährt. Frau Meinhardt ist absolut sicher und rechtzeitig im OP angekommen."
                      : (390 + (gameState.time || 0)) > 510 
                      ? "Zeitüberschreitung! Die Vorbereitung hat zu lange gedauert. Der OP-Slot um 08:30 Uhr wurde verpasst, was den gesamten OP-Plan durcheinanderbringt!"
                      : score >= 60 
                      ? "In Ordnung. Die Übergabe hat geklappt, aber Ihre Checkliste weist kleine Lücken auf. Die Sicherheit war noch gewährleistet."
                      : "Kritisch! Die OP musste wegen schwerer Mängel in der Vorbereitung fast abgebrochen werden. Überarbeiten Sie Ihre Checkliste dringend!"}
                  </p>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm mb-10">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                      Einsatz-Auswertung
                    </h3>
                    <ul className="space-y-3">
                      {history.map((item, i) => (
                        <li key={i} className="flex items-start text-sm">
                          {item.correct ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" />
                          )}
                          <span className={item.correct ? 'text-slate-700' : 'text-rose-700 font-medium'}>
                            {item.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={startSimulation}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Simulation neu starten</span>
                  </button>
                </motion.div>
              ) : currentFeedback ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-xl mx-auto flex flex-col items-center text-center py-8"
                >
                  {currentFeedback.correct ? (
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-6 ${currentFeedback.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {currentFeedback.feedbackTitle}
                  </h3>
                  
                  <div className={`p-6 rounded-2xl border shadow-sm ${currentFeedback.correct ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100/50' : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-100/50'} w-full text-left mb-10`}>
                    <p className={`font-semibold mb-2 ${currentFeedback.correct ? 'text-emerald-900' : 'text-rose-900'}`}>
                      Erläuterung:
                    </p>
                    <p className={`leading-relaxed text-sm sm:text-base ${currentFeedback.correct ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {currentFeedback.feedbackText}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-medium py-3.5 px-10 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 inline-flex items-center space-x-2"
                  >
                    <span>Weiter</span>
                    <ArrowRight className="w-5 h-5" />
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
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full border border-blue-200/50">
                      {scenarios[step].category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {scenarios[step].title}
                  </h2>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 text-slate-700 leading-relaxed text-sm sm:text-base border-l-4 border-l-blue-500">
                    {scenarios[step].text}
                  </div>
                  
                  <div className="space-y-3">
                    {scenarios[step].options.map((opt, i) => (
                      <button
                         key={i}
                         onClick={() => handleChoice(opt)}
                         className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-start group shadow-sm hover:shadow"
                       >
                         <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white font-bold w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 mt-0.5 transition-colors text-sm">
                           {String.fromCharCode(65 + i)}
                         </span>
                         <span className="font-medium text-slate-700 group-hover:text-slate-900 mt-1">
                           {opt.label}
                         </span>
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Joker Modal Overlay */}
          <AnimatePresence>
            {showJoker && !isGameOver && !currentFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-t-4 border-amber-400"
                >
                  <div className="flex items-start mb-6 space-x-4">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl flex-shrink-0">
                      <UserRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Tipp der Praxisanleitung</h3>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{scenarios[step].hint}"
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowJoker(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-3 rounded-xl transition-colors"
                  >
                    Verstanden
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Akte Modal Overlay */}
          <AnimatePresence>
            {showAkte && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
                >
                  <div className="bg-slate-800 p-4 sm:p-6 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-blue-400" />
                      Patientenakte: Meinhardt, Carola
                    </h3>
                    <button 
                      onClick={() => setShowAkte(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 overflow-y-auto flex-grow bg-slate-50 text-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Patientendaten</h4>
                          <p className="text-sm"><span className="font-semibold">Name:</span> Carola Meinhardt</p>
                          <p className="text-sm"><span className="font-semibold">Alter:</span> 67 Jahre</p>
                          <p className="text-sm"><span className="font-semibold">Größe / Gewicht:</span> 165 cm / 75 kg</p>
                          <p className="text-sm text-rose-600"><span className="font-semibold">Allergien:</span> Pflasterallergie, Penicillin</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Diagnose & OP</h4>
                          <p className="text-sm"><span className="font-semibold">Diagnose:</span> Symptomatische Cholezystolithiasis</p>
                          <p className="text-sm"><span className="font-semibold">Eingriff:</span> Laparoskopische Cholezystektomie</p>
                          <p className="text-sm"><span className="font-semibold">Geplante OP-Zeit:</span> 08:30 Uhr</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Anästhesie & Prämedikation</h4>
                          <p className="text-sm"><span className="font-semibold">Verfahren:</span> Intubationsnarkose (ITN)</p>
                          <p className="text-sm"><span className="font-semibold">Prämedikation:</span> Midazolam 7,5mg p.o. (auf Abruf)</p>
                          <p className="text-sm"><span className="font-semibold">Nüchternheit:</span> Ab 0:00 Uhr feste Nahrung, bis 06:30 Uhr Wasser erlaubt.</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Hausmedikation (morgens)</h4>
                          <p className="text-sm"><span className="font-semibold">L-Thyroxin 75µg:</span> PAUSIEREN</p>
                          <p className="text-sm"><span className="font-semibold">Ramipril 5mg:</span> PAUSIEREN</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setShowAkte(false)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      Akte schließen
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      )}
      
      <NavigationButtons current="simulator" onNavigate={onNavigate} />
    </section>
  );
}
