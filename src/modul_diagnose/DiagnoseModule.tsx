import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Stethoscope, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { DiagnoseTab } from './types';
import { DS1DiagnoseView } from './components/DS1DiagnoseView';
import { DS2PraxisSimulationView } from './components/DS2PraxisSimulationView';
import { DiagnoseNuggetsView } from './components/DiagnoseNuggetsView';
import { unlockAchievement, getLocal, setLocal, StorageKeys, notifyNuggetUnlocked } from '../utils/gamification';

interface Props {
  onGoToModulAngst: () => void;
  onBackToHub?: () => void;
}

export const DiagnoseModule: React.FC<Props> = ({ onGoToModulAngst, onBackToHub }) => {
  const [activeTab, setActiveTab] = useState<DiagnoseTab>('ds1_theorie');
  const [unlockedNuggets, setUnlockedNuggets] = useState<string[]>(() => {
    return getLocal<string[]>(StorageKeys.MODUL1_NUGGETS, []);
  });
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    return getLocal<string[]>(StorageKeys.MODUL1_QUIZZES, []);
  });

  React.useEffect(() => {
    const handleReset = () => {
      setUnlockedNuggets([]);
      setCompletedQuizzes([]);
    };
    window.addEventListener('storage', handleReset);
    window.addEventListener('gpfa_global_reset', handleReset);
    return () => {
      window.removeEventListener('storage', handleReset);
      window.removeEventListener('gpfa_global_reset', handleReset);
    };
  }, []);

  const handleUnlockNugget = (nuggetId: string) => {
    if (!unlockedNuggets.includes(nuggetId)) {
      const next = [...unlockedNuggets, nuggetId];
      setUnlockedNuggets(next);
      setLocal(StorageKeys.MODUL1_NUGGETS, next);
      notifyNuggetUnlocked({ id: nuggetId, moduleNumber: 1 });
    }
  };

  const handleCompleteQuiz = (quizId: string) => {
    if (!completedQuizzes.includes(quizId)) {
      const next = [...completedQuizzes, quizId];
      setCompletedQuizzes(next);
      setLocal(StorageKeys.MODUL1_QUIZZES, next);

      // Trigger achievement ONLY when all 7 quizzes in DS 1 are completed
      const allSevenQuizzes = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
      if (allSevenQuizzes.every(id => next.includes(id))) {
        unlockAchievement('modul1_theorie');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ds1_theorie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'ds1_theorie'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-700 shadow-md shadow-indigo-500/25'
                : 'bg-indigo-50/90 hover:bg-indigo-100 text-indigo-900 border-indigo-200 shadow-xs'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'ds1_theorie' ? 'text-white' : 'text-indigo-600'}`} />
            <span>DS 1: Theorie, Videos & 7 Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('ds2_simulation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'ds2_simulation'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-700 shadow-md shadow-teal-500/25'
                : 'bg-teal-50/90 hover:bg-teal-100 text-teal-950 border-teal-200 shadow-xs'
            }`}
          >
            <Stethoscope className={`w-4 h-4 ${activeTab === 'ds2_simulation' ? 'text-white' : 'text-teal-600'}`} />
            <span>DS 2: Hausarzt-Simulation Frau Meinhardt</span>
          </button>

          <button
            onClick={() => setActiveTab('nuggets')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'nuggets'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-600 shadow-md shadow-amber-500/25'
                : 'bg-amber-50/90 hover:bg-amber-100 text-amber-950 border-amber-200 shadow-xs'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'nuggets' ? 'text-slate-950' : 'text-amber-600'}`} />
            <span>Learning Nuggets</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'nuggets' ? 'bg-black/15 text-slate-950' : 'bg-amber-200 text-amber-900'
            }`}>
              {unlockedNuggets.length} / 9
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 pr-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Curriculum: 2 × 90 Min. (DS 1 & 2 / PFA)</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ds1_theorie' && (
        <DS1DiagnoseView
          unlockedNuggets={unlockedNuggets}
          completedQuizzes={completedQuizzes}
          onUnlockNugget={handleUnlockNugget}
          onCompleteQuiz={handleCompleteQuiz}
          onGoToSimulation={() => setActiveTab('ds2_simulation')}
          onViewNuggets={() => setActiveTab('nuggets')}
        />
      )}

      {activeTab === 'ds2_simulation' && (
        <DS2PraxisSimulationView
          onBackToTheorie={() => setActiveTab('ds1_theorie')}
          onGoToModulAngst={onGoToModulAngst}
        />
      )}

      {activeTab === 'nuggets' && (
        <DiagnoseNuggetsView
          unlockedNuggets={unlockedNuggets}
        />
      )}
    </div>
  );
};
