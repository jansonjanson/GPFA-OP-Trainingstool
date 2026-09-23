import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initialVitals, scenes } from './data/scenes';
import { ACHIEVEMENTS } from './data/achievements';
import { Vitals, HistoryItem, Choice, Achievement, CategoryScores, GameStats, SavedRun } from './types';
import { VitalMonitor } from './components/VitalMonitor';
import { FeedbackModal } from './components/FeedbackModal';
import { EndScreen } from './components/EndScreen';
import { TimerBar } from './components/TimerBar';
import { Dashboard } from './components/Dashboard';
import { AchievementToast } from './components/AchievementToast';
import { ISBARPuzzle } from './components/ISBARPuzzle';
import { KnowledgeBase } from './components/KnowledgeBase';
import { PatientRecord } from './components/PatientRecord';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { MapPin, Clock, ChevronRight, CheckSquare, Square, Stethoscope, BookOpen, FileText, RotateCcw, Lock, HelpCircle } from 'lucide-react';

type AppState = 'dashboard' | 'playing';


const tutorialSteps: TutorialStep[] = [
  {
    targetId: 'tour-safety',
    title: 'Patientensicherheit',
    text: 'Jede Entscheidung beeinflusst die Patientensicherheit. Sinkt der Wert auf 0%, ist die Simulation gescheitert.'
  },
  {
    targetId: 'tour-energy',
    title: 'Ihre Energie',
    text: 'Handlungen kosten Zeit und Kraft. Wenn Ihre Energie zu niedrig ist, werden Aktionen anstrengender und das Risiko für Fehler steigt.'
  },
  {
    targetId: 'tour-vitals',
    title: 'Vitalwerte',
    text: 'Behalten Sie diese immer im Blick. Sie reagieren dynamisch auf Ihre pflegerischen und medizinischen Maßnahmen.'
  },
  {
    targetId: 'tour-tools',
    title: 'Werkzeuge & Akte',
    text: 'Hier können Sie jederzeit in die Patientenakte schauen oder den Spickzettel öffnen. In Notfallsituationen kostet langes Lesen jedoch wertvolle Zeit!'
  },
  {
    targetId: 'tour-tools',
    title: 'Hilfe & Neustart',
    text: 'Über den Hilfe-Button können Sie dieses Tutorial jederzeit erneut aufrufen. Hier finden Sie auch den Knopf zum Neustarten der Simulation.'
  },
  {
    targetId: 'tour-scene',
    title: 'Die Situation',
    text: 'Hier sehen Sie das aktuelle Geschehen und treffen Ihre Entscheidungen. Beurteilen Sie die Lage fachlich und wählen Sie Ihre Handlung.'
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>([]);

  const [currentSceneId, setCurrentSceneId] = useState<string>('prep');
  const [score, setScore] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(100);
  const [vitals, setVitals] = useState<Vitals>(initialVitals);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [categories, setCategories] = useState<CategoryScores>({ fachwissen: 0, voraussicht: 0, zeitmanagement: 0, patientenzentrierung: 0 });
  const [flags, setFlags] = useState<string[]>([]);
  
  const [inventory, setInventory] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  
  const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);
  const [pendingNextScene, setPendingNextScene] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  
  const [showKnowledgeBase, setShowKnowledgeBase] = useState<boolean>(false);
  const [showPatientRecord, setShowPatientRecord] = useState<boolean>(false);
  const [showInventoryFeedback, setShowInventoryFeedback] = useState<boolean>(false);

  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentScene = scenes[currentSceneId];

  useEffect(() => {
    if (currentScene?.choices) {
      const shuffled = [...currentScene.choices].sort(() => Math.random() - 0.5);
      setShuffledChoices(shuffled);
    } else {
      setShuffledChoices([]);
    }
  }, [currentSceneId]);

  useEffect(() => {
    const saved = localStorage.getItem('simLabStats');
    if (saved) {
      setGameStats(JSON.parse(saved));
    }
    const runs = localStorage.getItem('simLabRuns');
    if (runs) {
      setSavedRuns(JSON.parse(runs));
    }
    const hasSeenTutorial = localStorage.getItem('simLabTutorialV2');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleHardReset = () => {
    localStorage.removeItem('simLabStats');
    localStorage.removeItem('simLabRuns');
    localStorage.removeItem('simLabTutorialV2');
    setGameStats(null);
    setSavedRuns([]);
    setUnlockedAchievements([]);
  };

  const saveStats = (finalScore: number, finalCats: CategoryScores, newUnlocks: string[], finalEnergy: number, finalHistory: HistoryItem[]) => {
    setGameStats(prev => {
      const mergedUnlocks = Array.from(new Set([...(prev?.unlockedAchievements || []), ...newUnlocks]));
      const newStats: GameStats = {
        runs: (prev?.runs || 0) + 1,
        bestScore: Math.max(prev?.bestScore || 0, finalScore),
        bestCategories: {
          fachwissen: Math.max(prev?.bestCategories?.fachwissen || 0, finalCats.fachwissen),
          voraussicht: Math.max(prev?.bestCategories?.voraussicht || 0, finalCats.voraussicht),
          zeitmanagement: Math.max(prev?.bestCategories?.zeitmanagement || 0, finalCats.zeitmanagement),
          patientenzentrierung: Math.max(prev?.bestCategories?.patientenzentrierung || 0, finalCats.patientenzentrierung),
        },
        unlockedAchievements: mergedUnlocks
      };
      localStorage.setItem('simLabStats', JSON.stringify(newStats));
      return newStats;
    });

    const newRun: SavedRun = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: finalScore,
      energy: finalEnergy,
      achievements: newUnlocks,
      history: finalHistory
    };

    setSavedRuns(prev => {
      const updated = [newRun, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem('simLabRuns', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (appState === 'playing' && currentScene?.updateVitals) {
      setVitals(prev => ({ ...prev, ...currentScene.updateVitals! }));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setIsTimerActive(true);
  }, [currentSceneId, appState]);

  useEffect(() => {
    if (energy <= 50 && !unlockedAchievements.includes('marathon')) {
      unlockAchievement('marathon');
    }
  }, [energy, unlockedAchievements]);

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id) && ACHIEVEMENTS[id]) {
      setUnlockedAchievements(prev => [...prev, id]);
      setActiveAchievement(ACHIEVEMENTS[id]);
    }
  };

  const checkAchievements = (choice: Choice) => {
    if (inventory.length === 0 && currentSceneId === 'prep') unlockAchievement('macgyver');
    if (currentSceneId === 'prep' && inventory.length >= 3) unlockAchievement('prepared');
    if (currentSceneId === 'awr_arrival' && choice.action === 'openRecord') unlockAchievement('pain_manager');
    if (currentSceneId === 'ward_wound_check' && choice.id === 'c_phone_ignore') unlockAchievement('adlerauge');
    if (currentSceneId === 'ward_wound_check' && choice.id === 'c_phone_answer_dirty') unlockAchievement('keimschleuder');
    if (currentSceneId === 'ward_isbar_doctor' && choice.id === 'c1') unlockAchievement('isbar_pro');
    if (currentSceneId === 'ward_diet' && choice.id === 'c1') unlockAchievement('fast_track');
    if (choice.type === 'danger' && choice.scoreChange <= -30) unlockAchievement('code_blue');
    
    // Check if 10 achievements are unlocked
    if (unlockedAchievements.length >= 10 && !unlockedAchievements.includes('multiverse')) {
      unlockAchievement('multiverse');
    }
  };

  useEffect(() => {
    if (appState === 'playing' && currentScene?.isEnd) {
      let finalUnlocks = [...unlockedAchievements];
      if (score === 100 && !finalUnlocks.includes('textbook')) {
        unlockAchievement('textbook');
        finalUnlocks.push('textbook');
      }
      saveStats(score, categories, finalUnlocks, energy, history);
    }
  }, [currentSceneId, appState]);

  const handleChoice = (choice: Choice) => {
    setIsTimerActive(false);

    if (choice.setFlags) {
      setFlags(prev => Array.from(new Set([...prev, ...choice.setFlags!])));
    }

    let newScore = score + choice.scoreChange;
    if (newScore > 100) newScore = 100;
    if (newScore < 0) newScore = 0;
    setScore(newScore);

    if (choice.energyChange) {
      let newEnergy = energy + choice.energyChange;
      if (newEnergy > 100) newEnergy = 100;
      if (newEnergy < 0) newEnergy = 0;
      setEnergy(newEnergy);
    }

    if (choice.categoryImpact) {
      setCategories(prev => ({
        fachwissen: prev.fachwissen + (choice.categoryImpact?.fachwissen || 0),
        voraussicht: prev.voraussicht + (choice.categoryImpact?.voraussicht || 0),
        zeitmanagement: prev.zeitmanagement + (choice.categoryImpact?.zeitmanagement || 0),
        patientenzentrierung: prev.patientenzentrierung + (choice.categoryImpact?.patientenzentrierung || 0),
      }));
    }

    setHistory(prev => [
      ...prev,
      {
        sceneId: currentSceneId,
        scene: currentScene.location,
        text: choice.text,
        type: choice.type,
        feedback: choice.feedback
      }
    ]);

    checkAchievements(choice);

    setPendingNextScene(choice.next);
    setFeedbackChoice(choice);
  };

  const handleTimeout = () => {
    setIsTimerActive(false);
    const penalty = currentScene.timeoutPenalty || -15;
    
    let newScore = score + penalty;
    if (newScore < 0) newScore = 0;
    setScore(newScore);

    // Find the worst outcome or first choice to force progression
    const fallbackChoice = currentScene.choices?.find(c => c.type === 'danger') || currentScene.choices?.[currentScene.choices.length - 1];

    setHistory(prev => [
      ...prev,
      {
        sceneId: currentSceneId,
        scene: currentScene.location,
        text: "Zögerliches Handeln...",
        type: 'timeout',
        feedback: {
          title: "Zeitlimit überschritten",
          text: "In dieser Situation haben Sie zu lange gezögert. Wertvolle Zeit ist verstrichen.",
          source: "Simulation"
        }
      }
    ]);

    if (fallbackChoice) {
      setFeedbackChoice(fallbackChoice);
      setPendingNextScene(fallbackChoice.next);
    }
  };

  const toggleInventoryItem = (id: string) => {
    setInventory(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleInventoryConfirm = (choice: Choice) => {
    if (inventory.length === 0 && currentSceneId === 'prep') {
      unlockAchievement('macgyver');
    }
    
    if (inventory.length >= 3 && currentSceneId === 'prep') {
      unlockAchievement('prepared');
    }
    
    if (inventory.length === 0 && currentSceneId === 'prep_transport') {
      setEnergy(e => Math.max(0, e - 20));
      setScore(s => Math.max(0, s - 10));
      setHistory(prev => [...prev, { sceneId: currentSceneId, scene: currentScene.location, text: 'Transportausrüstung vergessen! Das rächt sich später.', type: 'danger' }]);
    }
    
    setHistory(prev => [
      ...prev,
      {
        sceneId: currentSceneId,
        scene: currentScene.location,
        text: `Ausrüstung gepackt (${inventory.length} Gegenstände)`,
        type: 'system',
      }
    ]);
    
    if (choice.categoryImpact) {
      setCategories(prev => ({
        ...prev,
        voraussicht: prev.voraussicht + (choice.categoryImpact?.voraussicht || 0)
      }));
    }
    
    setPendingNextScene(choice.next);
    setShowInventoryFeedback(true);
  };

  const handleNext = () => {
    if (pendingNextScene) {
      setCurrentSceneId(pendingNextScene);
    }
    setFeedbackChoice(null);
    setPendingNextScene(null);
  };

  const handleRestart = () => {
    setAppState('dashboard');
    setCurrentSceneId('prep');
    setScore(100);
    setEnergy(100);
    setCategories({ fachwissen: 0, voraussicht: 0, zeitmanagement: 0, patientenzentrierung: 0 });
    setFlags([]);
    setVitals(initialVitals);
    setHistory([]);
    setInventory([]);
    setFeedbackChoice(null);
    setPendingNextScene(null);
  };

  const startSimulation = () => {
    setAppState('playing');
    if (!localStorage.getItem('simLabTutorialV2')) {
      setShowTutorial(true);
    }
  };

  const getVisibleChoices = () => {
    if (!shuffledChoices) return [];
    return shuffledChoices.filter(choice => {
      if (choice.requiredItems && !choice.requiredItems.every(item => inventory.includes(item))) return false;
      if (choice.forbiddenItems && choice.forbiddenItems.some(item => inventory.includes(item))) return false;
      if (choice.requiredFlags && !choice.requiredFlags.every(flag => flags.includes(flag))) return false;
      if (choice.forbiddenFlags && choice.forbiddenFlags.some(flag => flags.includes(flag))) return false;
      return true;
    });
  };

  const handleOpenKnowledgeBase = () => {
    if (isTimerActive && !feedbackChoice && currentScene.timeLimit) {
      // Penalty for opening in an emergency
      setEnergy(prev => Math.max(0, prev - 20));
      setScore(prev => Math.max(0, prev - 5));
      setHistory(prev => [
        ...prev,
        {
          sceneId: currentSceneId,
          scene: currentScene.location,
          text: "Wissen nachgeschlagen (Kritischer Zeitverlust!)",
          type: 'warning',
          feedback: {
            title: "Verzögerung",
            text: "Das Nachlesen während einer zeitkritischen Situation kostet Sie wertvolle Ressourcen.",
            source: "Simulation"
          }
        }
      ]);
    }
    setShowKnowledgeBase(true);
  };

  const dismissTutorial = () => {
    localStorage.setItem('simLabTutorialV2', 'true');
    setShowTutorial(false);
  };

  const getProgressPercentage = () => {
    const totalScenes = 12; // Approximation of full golden path steps
    const currentStep = history.length;
    return Math.min(100, Math.round((currentStep / totalScenes) * 100));
  };

  if (appState === 'dashboard') {
    return (
      <Dashboard stats={gameStats} savedRuns={savedRuns} onStart={startSimulation} onReset={handleHardReset} />
    );
  }

  if (appState === 'playing' && currentScene?.isEnd) {
    return (
      <>
        <EndScreen score={score} energy={energy} categories={categories} history={history} onRestart={handleRestart} gameStats={gameStats} isCriticalFail={currentSceneId !== 'end'} />
        <AchievementToast 
          achievement={activeAchievement} 
          onClose={() => setActiveAchievement(null)} 
        />
      </>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 h-screen flex flex-col md:flex-row overflow-hidden font-sans selection:bg-teal-200 relative">
      <VitalMonitor vitals={vitals} score={score} energy={energy} />
      
      <div className="flex-grow flex flex-col relative h-screen overflow-hidden">
        <header className="bg-slate-800 py-2 px-4 flex justify-between items-center shadow-md z-40 relative shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">{currentScene.location}</span>
            <span className="text-slate-600 mx-1 hidden sm:inline">|</span>
            <Clock className="w-4 h-4" />
            <span>{currentScene.time}</span>
          </div>
          <div id="tour-tools" className="flex items-center gap-2 p-1 -m-1 rounded-xl">
            {adminMode && (
              <select 
                className="bg-slate-700 text-white text-xs p-1.5 rounded outline-none border border-slate-600 focus:border-amber-400"
                onChange={(e) => {
                  setCurrentSceneId(e.target.value);
                  setFeedbackChoice(null);
                  setPendingNextScene(null);
                }}
                value={currentSceneId}
              >
                {Object.keys(scenes).map(key => (
                  <option key={key} value={key}>{scenes[key].title}</option>
                ))}
              </select>
            )}
            {showAdminPrompt && (
              <div className="flex items-center gap-1 bg-slate-700 p-1 rounded-lg">
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (adminPassword === 'Janson') {
                        setAdminMode(true);
                      }
                      setShowAdminPrompt(false);
                      setAdminPassword('');
                    }
                  }}
                  onBlur={() => {
                      setShowAdminPrompt(false);
                      setAdminPassword('');
                  }}
                  autoFocus
                  placeholder="Passwort"
                  className="bg-slate-800 text-white text-xs px-2 py-1.5 rounded outline-none w-24 border border-slate-600 focus:border-amber-400"
                />
              </div>
            )}
            <button 
              onClick={() => {
                if (adminMode) {
                  setAdminMode(false);
                } else {
                  setShowAdminPrompt(!showAdminPrompt);
                }
              }}
              className={`p-1.5 rounded transition-colors ${adminMode ? 'text-amber-400 bg-slate-700' : 'text-slate-500 hover:text-white hover:bg-slate-700'}`}
              title="Admin Mode"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowPatientRecord(true)}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-sky-600 hover:text-white text-sky-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Akte</span>
            </button>

            <button 
              onClick={handleOpenKnowledgeBase}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-indigo-500 hover:text-white text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Spickzettel</span>
            </button>

            <button 
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-teal-500 hover:text-white text-teal-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
              title="Tutorial anzeigen"
            >
              <HelpCircle className="w-4 h-4" /> <span className="hidden sm:inline">Hilfe</span>
            </button>

            <button 
              onClick={handleRestart}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-rose-500 hover:text-white text-rose-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm ml-2"
            >
              <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Neustart</span>
            </button>
          </div>
        </header>

        {/* Progress Tracker */}
        <div className="bg-slate-300 h-2.5 w-full shrink-0 shadow-inner">
          <div 
            className="bg-gradient-to-r from-teal-400 to-indigo-500 h-full transition-all duration-500 ease-out border-r-2 border-white/40 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-8 relative z-10 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            
            <AnimatePresence mode="wait">
              <motion.div 
                id="tour-scene"
                key={currentSceneId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-teal-400 to-indigo-500"></div>
                
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-6 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>{currentScene.location}</span>
                    <span className="mx-2 text-slate-200">•</span>
                    <Clock className="w-4 h-4" />
                    <span>{currentScene.time}</span>
                  </div>

                  <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">{currentScene.title}</h2>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-inner text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: typeof currentScene.text === 'function' ? currentScene.text(inventory, flags) : currentScene.text }} />
                    
                    {currentScene.quote && (
                      <div className="relative mt-8 mb-6">
                        <div className="absolute -top-4 -left-3 text-6xl text-teal-200 opacity-50 leading-none select-none font-serif">"</div>
                        <div className="bg-gradient-to-r from-teal-50 to-white border-l-4 border-teal-500 p-6 pl-8 italic text-slate-700 rounded-r-2xl shadow-sm text-lg">
                          {currentScene.quote}
                        </div>
                      </div>
                    )}
                  </div>

                  {currentScene.timeLimit && (
                    <TimerBar 
                      timeLimit={currentScene.timeLimit} 
                      onTimeout={handleTimeout} 
                      isActive={isTimerActive && !feedbackChoice} 
                    />
                  )}

                  {currentScene.sceneType === 'inventory' ? (
                    <div className="space-y-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {currentScene.inventoryItems?.map(item => {
                          const isSelected = inventory.includes(item.id);
                          let buttonStyle = isSelected 
                            ? 'border-teal-500 bg-teal-50/50' 
                            : 'border-slate-200 bg-white hover:border-teal-200';
                            
                          if (showInventoryFeedback) {
                            if (isSelected && item.isCorrect) {
                              buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                            } else if (isSelected && !item.isCorrect) {
                              buttonStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                            } else if (!isSelected && item.isCorrect) {
                              buttonStyle = 'border-amber-500 bg-amber-50 text-amber-800';
                            } else if (!isSelected) {
                              buttonStyle = 'border-slate-200 bg-slate-50 opacity-60 grayscale';
                            }
                          }
                          return (
                            <button
                              key={item.id}
                              onClick={() => !showInventoryFeedback && toggleInventoryItem(item.id)}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${buttonStyle}`}
                              disabled={showInventoryFeedback}
                            >
                              <div className={`shrink-0 ${showInventoryFeedback && !isSelected && item.isCorrect ? 'text-amber-500' : showInventoryFeedback ? '' : isSelected ? 'text-teal-500' : 'text-slate-400'}`}>
                                {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                              </div>
                              <div className="text-left">
                                <div className={`font-bold ${showInventoryFeedback && isSelected ? '' : showInventoryFeedback && item.isCorrect ? 'text-amber-800' : 'text-slate-800'}`}>{item.name}</div>
                                <div className={`text-sm ${showInventoryFeedback && isSelected ? 'opacity-80' : showInventoryFeedback && item.isCorrect ? 'text-amber-700/80' : 'text-slate-500'}`}>{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {!showInventoryFeedback ? (
                        <button
                          onClick={() => handleInventoryConfirm(currentScene.choices![0])}
                          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition shadow-lg flex items-center justify-center gap-2 group mt-6"
                        >
                          Ausrüstung bestätigen <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6 space-y-4">
                          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm">
                            <span className="font-bold block mb-1">Feedback zur Vorbereitung:</span>
                            {currentScene.choices![0].feedback.text}
                          </div>
                          <button
                            onClick={() => {
                              setShowInventoryFeedback(false);
                              if (pendingNextScene) {
                                setCurrentSceneId(pendingNextScene);
                                setPendingNextScene(null);
                              }
                            }}
                            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition shadow-lg flex items-center justify-center gap-2 group"
                          >
                            Weiter <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : currentScene.sceneType === 'measurement' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            if (!inventory.includes('bp_cuff')) {
                              setEnergy(e => Math.max(0, e - 15));
                              setHistory(prev => [...prev, { sceneId: currentSceneId, scene: 'Vitalzeichen', text: 'Stethoskop/Manschette vergessen. Laufweg kostet Energie.', type: 'danger' }]);
                            }
                            setVitals(prev => ({ ...prev, bp: flags.includes('novalgin_fast') ? '90/55' : '120/80' }));
                          }}
                          disabled={vitals.bp !== '--/--'}
                          className={`border-2 p-4 rounded-xl text-left transition-all ${vitals.bp !== '--/--' ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-indigo-200 hover:bg-indigo-50'}`}
                        >
                          <div className="font-bold text-indigo-800">Blutdruck (RR) messen</div>
                          <div className="text-xs text-slate-500 mt-1">Manschette & Stethoskop</div>
                          {vitals.bp !== '--/--' && <div className="text-lg font-black text-indigo-700 mt-2">{vitals.bp}</div>}
                        </button>
                        
                        <button 
                          onClick={() => {
                            setVitals(prev => ({ ...prev, hr: 85 }));
                          }}
                          disabled={vitals.hr !== '--'}
                          className={`border-2 p-4 rounded-xl text-left transition-all ${vitals.hr !== '--' ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-indigo-200 hover:bg-indigo-50'}`}
                        >
                          <div className="font-bold text-indigo-800">Puls (HF) messen</div>
                          <div className="text-xs text-slate-500 mt-1">Palpation</div>
                          {vitals.hr !== '--' && <div className="text-lg font-black text-indigo-700 mt-2">{vitals.hr} /min</div>}
                        </button>

                        <button 
                          onClick={() => {
                            if (!inventory.includes('pulsoxy')) {
                              setEnergy(e => Math.max(0, e - 10));
                              setHistory(prev => [...prev, { sceneId: currentSceneId, scene: 'Vitalzeichen', text: 'Pulsoxymeter vergessen. Laufweg kostet Energie.', type: 'danger' }]);
                            }
                            setVitals(prev => ({ ...prev, spo2: 98 }));
                          }}
                          disabled={vitals.spo2 !== '--'}
                          className={`border-2 p-4 rounded-xl text-left transition-all ${vitals.spo2 !== '--' ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-indigo-200 hover:bg-indigo-50'}`}
                        >
                          <div className="font-bold text-indigo-800">Sauerstoffsättigung (SpO₂)</div>
                          <div className="text-xs text-slate-500 mt-1">Pulsoxymeter</div>
                          {vitals.spo2 !== '--' && <div className="text-lg font-black text-indigo-700 mt-2">{vitals.spo2} %</div>}
                        </button>
                        
                        <button 
                          onClick={() => {
                            setVitals(prev => ({ ...prev, nrs: 6 }));
                          }}
                          disabled={vitals.nrs !== '--'}
                          className={`border-2 p-4 rounded-xl text-left transition-all ${vitals.nrs !== '--' ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-indigo-200 hover:bg-indigo-50'}`}
                        >
                          <div className="font-bold text-indigo-800">Schmerz (NRS) erfragen</div>
                          <div className="text-xs text-slate-500 mt-1">Kommunikation</div>
                          {vitals.nrs !== '--' && <div className="text-lg font-black text-indigo-700 mt-2">{vitals.nrs} /10</div>}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          const missingKreislauf = vitals.bp === '--/--' || vitals.hr === '--';
                          
                          let targetId = 'c_measure';
                          if (missingKreislauf) {
                            targetId = 'c_measure_incomplete';
                          } else if (flags.includes('novalgin_fast')) {
                            targetId = 'c_measure_novalgin';
                          }
                          
                          const measureChoice = currentScene.choices?.find(c => c.id === targetId);
                          if (measureChoice) {
                            handleChoice(measureChoice);
                          } else {
                            handleChoice(currentScene.choices![0]);
                          }
                        }}
                        className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition shadow-lg flex items-center justify-center gap-2 group"
                      >
                        Werte dokumentieren & Weiter <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ) : currentScene.sceneType === 'isbar_puzzle' ? (
                    <ISBARPuzzle items={currentScene.puzzleItems!} onComplete={() => handleChoice(currentScene.choices![0])} />
                  ) : (
                    <div className="grid gap-4">
                      {getVisibleChoices().map((choice, index) => {
                        const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
                        const colorClass = colors[index % colors.length];
                        return (
                        <button
                          key={choice.id}
                          onClick={() => handleChoice(choice)}
                          disabled={!!feedbackChoice}
                          className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all duration-200 flex justify-between items-center group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-4 w-full pr-4">
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-white font-bold text-sm ${colorClass}`}>
                              {index + 1}
                            </div>
                            <span className="font-semibold text-base text-slate-700 leading-snug">{choice.text}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </button>
                      )})}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </main>

      <FeedbackModal 
        feedback={feedbackChoice?.feedback || null} 
        type={feedbackChoice?.type || null}
        onNext={handleNext} 
      />

      <KnowledgeBase 
        isOpen={showKnowledgeBase}
        onClose={() => setShowKnowledgeBase(false)}
        isTimerActive={isTimerActive && !feedbackChoice && !!currentScene.timeLimit}
      />

      <PatientRecord 
        isOpen={showPatientRecord}
        onClose={() => setShowPatientRecord(false)}
      />

      <AchievementToast 
        achievement={activeAchievement} 
        onClose={() => setActiveAchievement(null)} 
      />

      {showTutorial && (
        <TutorialOverlay steps={tutorialSteps} onComplete={dismissTutorial} />
      )}
      </div>
    </div>
  );
}
