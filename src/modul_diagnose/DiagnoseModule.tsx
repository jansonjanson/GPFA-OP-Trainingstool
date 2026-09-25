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
import { unlockAchievement, getLocal, setLocal, StorageKeys } from '../utils/gamification';

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

  const handleUnlockNugget = (nuggetId: string) => {
    if (!unlockedNuggets.includes(nuggetId)) {
      const next = [...unlockedNuggets, nuggetId];
      setUnlockedNuggets(next);
      setLocal(StorageKeys.MODUL1_NUGGETS, next);
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
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ds1_theorie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'ds1_theorie'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>DS 1: Theorie, Videos & 7 Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('ds2_simulation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'ds2_simulation'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>DS 2: Hausarzt-Simulation Frau Meinhardt</span>
          </button>

          <button
            onClick={() => setActiveTab('nuggets')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'nuggets'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Learning Nuggets</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
              {unlockedNuggets.length}
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
