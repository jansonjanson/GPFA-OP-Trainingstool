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
import { learningNuggetsList } from './data/nuggetsData';
import { unlockAchievement, getLocal, setLocal, StorageKeys, notifyNuggetUnlocked } from '../utils/gamification';

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

  // Auto-scroll to top on every tab/DS change
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleUnlockNugget = (quizId: string) => {
    const matchedNugget = learningNuggetsList.find(n => n.unlockedByQuizId === quizId || n.id === quizId);
    const toAdd = [quizId];
    if (matchedNugget) {
      toAdd.push(matchedNugget.id);
      toAdd.push(`m2_${matchedNugget.id}`);
    }

    const next = Array.from(new Set([...unlockedNuggets, ...toAdd]));
    if (next.length > unlockedNuggets.length) {
      setUnlockedNuggets(next);
      setLocal(StorageKeys.MODUL2_NUGGETS, next);
      notifyNuggetUnlocked({
        id: matchedNugget ? matchedNugget.id : quizId,
        title: matchedNugget ? matchedNugget.title : undefined,
        category: matchedNugget ? matchedNugget.category : undefined,
        moduleNumber: 2
      });
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ds1')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'ds1'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/25'
                : 'bg-blue-50/90 hover:bg-blue-100 text-blue-900 border-blue-200 shadow-xs'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'ds1' ? 'text-white' : 'text-blue-600'}`} />
            <span>DS 3: Theorie & Neurobiologie</span>
          </button>

          <button
            onClick={() => setActiveTab('ds2')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'ds2'
                ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/25'
                : 'bg-rose-50/90 hover:bg-rose-100 text-rose-900 border-rose-200 shadow-xs'
            }`}
          >
            <BriefcaseMedical className={`w-4 h-4 ${activeTab === 'ds2' ? 'text-white' : 'text-rose-600'}`} />
            <span>DS 4: Praxis & Notfallkoffer</span>
          </button>

          {activeTab === 'simulation' && (
            <div className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 bg-indigo-600 text-white border border-indigo-700 shadow-md">
              <Activity className="w-4 h-4 text-white" />
              <span>Simulation (Aktiv)</span>
            </div>
          )}

          <button
            onClick={() => setActiveTab('nuggets')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 border cursor-pointer ${
              activeTab === 'nuggets'
                ? 'bg-teal-700 text-white border-teal-800 shadow-md shadow-teal-700/25'
                : 'bg-teal-50/90 hover:bg-teal-100 text-teal-900 border-teal-200 shadow-xs'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'nuggets' ? 'text-amber-300' : 'text-teal-600'}`} />
            <span>Learning Nuggets (Folien)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'nuggets' ? 'bg-white/20 text-white' : 'bg-teal-200 text-teal-900'
            }`}>
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
