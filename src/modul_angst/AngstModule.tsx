import React, { useState } from 'react';
import { 
  HeartHandshake, 
  BookOpen, 
  BriefcaseMedical, 
  Play, 
  Sparkles, 
  Layers, 
  Award,
  CheckCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import { DSLevel } from './types';
import { DS1View } from './components/DS1View';
import { DS2View } from './components/DS2View';
import { AngstSimulation } from './components/AngstSimulation';
import { NuggetSlideCards } from './components/NuggetSlideCards';
import { unlockAchievement, getLocal, setLocal, StorageKeys } from '../utils/gamification';

interface Props {
  onBackToHub?: () => void;
  onGoToModulPraeOp?: () => void;
}

export const AngstModule: React.FC<Props> = ({ onBackToHub, onGoToModulPraeOp }) => {
  const [activeTab, setActiveTab] = useState<DSLevel>('ds1');
  const [unlockedNuggets, setUnlockedNuggets] = useState<string[]>(() => {
    return getLocal<string[]>(StorageKeys.MODUL2_NUGGETS, []);
  });
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    return getLocal<string[]>(StorageKeys.MODUL2_QUIZZES, []);
  });

  const handleUnlockNugget = (quizId: string) => {
    if (!unlockedNuggets.includes(quizId)) {
      const next = [...unlockedNuggets, quizId];
      setUnlockedNuggets(next);
      setLocal(StorageKeys.MODUL2_NUGGETS, next);
    }
  };

  const handleCompleteQuiz = (quizId: string) => {
    if (!completedQuizzes.includes(quizId)) {
      const next = [...completedQuizzes, quizId];
      setCompletedQuizzes(next);
      setLocal(StorageKeys.MODUL2_QUIZZES, next);

      // Trigger achievement ONLY when all DS 3 quizzes (quiz 1 to 5) are completed
      const allDS3Quizzes = ['ds1_quiz1', 'ds1_quiz2', 'ds1_quiz3', 'ds1_quiz4', 'ds1_quiz5'];
      if (allDS3Quizzes.every(id => next.includes(id))) {
        unlockAchievement('modul2_theorie');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs for Modul 1 */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ds1')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'ds1'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>DS 3: Theorie & Neurobiologie</span>
          </button>

          <button
            onClick={() => setActiveTab('ds2')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'ds2'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BriefcaseMedical className="w-4 h-4" />
            <span>DS 4: Praxis & Notfallkoffer</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'simulation'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Simulation: Frau Meinhardt</span>
          </button>

          <button
            onClick={() => setActiveTab('nuggets')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'nuggets'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Learning Nuggets (Folien)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
              {unlockedNuggets.length}
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 pr-3">
          <span>Curriculum: 2 × 90 Min. (DS 3 & 4 / PFA)</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ds1' && (
        <DS1View
          unlockedNuggets={unlockedNuggets}
          completedQuizzes={completedQuizzes}
          onUnlockNugget={handleUnlockNugget}
          onCompleteQuiz={handleCompleteQuiz}
          onGoToDS2={() => setActiveTab('ds2')}
        />
      )}

      {activeTab === 'ds2' && (
        <DS2View
          unlockedNuggets={unlockedNuggets}
          onUnlockNugget={handleUnlockNugget}
          onCompleteQuiz={handleCompleteQuiz}
          onStartSimulation={() => setActiveTab('simulation')}
        />
      )}

      {activeTab === 'simulation' && (
        <AngstSimulation
          onBackToOverview={() => setActiveTab('ds1')}
          onGoToModulPraeOp={onGoToModulPraeOp}
        />
      )}

      {activeTab === 'nuggets' && (
        <NuggetSlideCards
          unlockedNuggets={unlockedNuggets}
        />
      )}
    </div>
  );
};
