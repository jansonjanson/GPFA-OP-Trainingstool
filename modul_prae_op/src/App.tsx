import React, { useState, useEffect, useCallback } from 'react';
import { HeartPulse, Lock, X, Activity, ChevronUp, Clock, Users, Gamepad2, MessageCircle, Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Section, sectionsOrder } from './types';
import KnowledgeBaseSection from './components/KnowledgeBaseSection';
import MediaSection from './components/MediaSection';
import SimulatorSection from './components/SimulatorSection';
import IntroVideosSection from './components/IntroVideosSection';
import { playSound } from './utils/audio';
import { unlockAchievement, notifyNuggetUnlocked } from '../../src/utils/gamification';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -300 : 300,
    opacity: 0
  })
};

export default function App({ onGoToModulPostOp }: { onGoToModulPostOp?: () => void }) {
  const [[activeSection, direction], setPage] = useState<[Section, number]>(['overview', 0]);
  const [completedNuggets, setCompletedNuggets] = useState<Record<number, boolean>>(() => {
    try {
      const raw = localStorage.getItem('gpfa_m3_unlocked_nuggets');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleReset = () => {
      try {
        const raw = localStorage.getItem('gpfa_m3_unlocked_nuggets');
        setCompletedNuggets(raw ? JSON.parse(raw) : {});
      } catch {
        setCompletedNuggets({});
      }
    };
    window.addEventListener('storage', handleReset);
    window.addEventListener('gpfa_global_reset', handleReset);
    return () => {
      window.removeEventListener('storage', handleReset);
      window.removeEventListener('gpfa_global_reset', handleReset);
    };
  }, []);
  const [showAchievement, setShowAchievement] = useState<{title: string, desc: string} | null>(null);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const isFreeNavGlobal = () => {
    try {
      return localStorage.getItem('gpfa_free_navigation_mode') === 'true';
    } catch {
      return false;
    }
  };

  const completedCount = Object.values(completedNuggets).filter(Boolean).length;
  const isWissenCompleted = completedCount >= 7;
  const canNavigateFreely = isWissenCompleted || isFreeNavGlobal();

  // Calculate total progress percentage out of 12 nuggets
  const progressPercentage = Math.min(100, Math.max(0, Math.round((completedCount / 12) * 100)));

  const navigateTo = (newSection: Section) => {
    // Locking logic
    if (['videos', 'auftrag', 'simulator'].includes(newSection) && !canNavigateFreely) {
      playSound('error');
      return;
    }

    const currentIndex = sectionsOrder.indexOf(activeSection);
    const newIndex = sectionsOrder.indexOf(newSection);
    if (newIndex !== currentIndex) {
      playSound('swoosh');
      setPage([newSection, newIndex > currentIndex ? 1 : -1]);
    }
  };

  const handleAchievement = useCallback((title: string, desc: string) => {
    setShowAchievement(prev => {
      if (prev && prev.title === title) return prev;
      return {title, desc};
    });
    if (title.toLowerCase().includes('simulator') || desc.toLowerCase().includes('simulator')) {
      unlockAchievement('modul3_simulation');
    }
  }, []);

  const handleNuggetComplete = (index: number) => {
    let shouldPlayUnlock = false;
    let shouldPlayPop = false;

    setCompletedNuggets(prev => {
      const next = { ...prev, [index]: true };
      try {
        localStorage.setItem('gpfa_m3_unlocked_nuggets', JSON.stringify(next));
      } catch (e) {
        // ignore
      }

      const newlyCompleted = Object.values(next).filter(Boolean).length >= 7;
      const previouslyCompleted = Object.values(prev).filter(Boolean).length >= 7;
      
      if (newlyCompleted && !previouslyCompleted) {
        shouldPlayUnlock = true;
      } else if (!prev[index]) {
        shouldPlayPop = true;
      }
      return next;
    });

    // Run side effects outside the state updater
    setTimeout(() => {
      if (shouldPlayUnlock) {
        unlockAchievement('modul3_nuggets');
        playSound('unlock');
        setShowAchievement({
          title: "Wissens-Meister!",
          desc: "Du hast alle Lern-Nuggets gesammelt. Neue Bereiche sind freigeschaltet!"
        });
        setTimeout(() => setShowAchievement(null), 5000);
      } else if (shouldPlayPop) {
        notifyNuggetUnlocked({
          id: `station-${index + 1}`,
          moduleNumber: 3
        });
        playSound('pop');
        setShowAchievement({
          title: "Nugget gesammelt!",
          desc: "Toll gemacht, weiter so!"
        });
        setTimeout(() => setShowAchievement(null), 3000);
      }
    }, 0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: Section; label: string; locked?: boolean }[] = [
    { id: 'overview', label: '1. Von der Vorbereitung zur OP' },
    { id: 'wissen', label: '2. Wissens-Base (Nuggets)' },
    { id: 'videos', label: '3. OP-Schleuse & OP-Saal', locked: !canNavigateFreely },
    { id: 'simulator', label: '4. OP-Simulator', locked: !canNavigateFreely },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-indigo-50/30 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* Global Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200 fixed top-0 left-0 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Sticky Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl shadow-sm sticky top-1.5 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:h-16 h-auto py-3 md:py-0">
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg mr-4 shadow-md flex-shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-center md:text-left">
                <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 leading-tight">
                  Prä-OP Navigator
                </span>
              </div>
            </div>
            <div className="flex space-x-1 md:space-x-4 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  disabled={item.locked}
                  className={`whitespace-nowrap px-3 md:px-2 py-2 text-sm font-medium transition-all relative flex items-center space-x-1.5 ${
                    activeSection === item.id
                      ? 'text-blue-700'
                      : item.locked 
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.locked && <Lock className="w-3.5 h-3.5 mb-0.5" />}
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-full hidden md:block"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 mb-16 flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSection}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex-grow flex flex-col"
          >
            {activeSection === 'overview' && <IntroVideosSection onNavigate={navigateTo} />}
            {activeSection === 'wissen' && <KnowledgeBaseSection onNavigate={navigateTo} onNuggetComplete={handleNuggetComplete} completedNuggets={completedNuggets} onAchievement={handleAchievement} />}
            {activeSection === 'videos' && <MediaSection onNavigate={navigateTo} />}
            {activeSection === 'simulator' && <SimulatorSection onNavigate={navigateTo} onAchievement={handleAchievement} onGoToModulPostOp={onGoToModulPostOp} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-br from-amber-400 to-yellow-500 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-5 border-2 border-yellow-200"
          >
            <div className="bg-white/30 p-2 rounded-full">
              <Trophy className="w-8 h-8 text-yellow-50 drop-shadow-md" />
            </div>
            <div className="flex-grow pr-4">
              <h4 className="font-bold text-base uppercase tracking-wider mb-1">{showAchievement.title}</h4>
              <p className="text-sm font-medium opacity-90">{showAchievement.desc}</p>
            </div>
            <button 
              onClick={() => setShowAchievement(null)}
              className="text-yellow-800 hover:bg-yellow-600/20 p-2 rounded-full transition-colors self-start -mt-2 -mr-2"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 text-slate-600 p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all active:scale-95"
            aria-label="Nach oben scrollen"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500 mt-auto relative z-10">
        <p>Trainingstool präoperative Pflege &bull; J. Rosenow M. A.</p>
      </footer>
    </div>
  );
}
