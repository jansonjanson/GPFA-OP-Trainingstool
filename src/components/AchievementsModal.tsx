import React from 'react';
import { 
  Trophy, 
  X, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Stethoscope, 
  Search, 
  Brain, 
  HeartHandshake, 
  ShieldCheck, 
  Activity, 
  HeartPulse, 
  Award, 
  Bot, 
  RotateCcw,
  Compass,
  Check
} from 'lucide-react';
import { ALL_ACHIEVEMENTS, getLocal, StorageKeys, setLocal, Achievement } from '../utils/gamification';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFreeNav: boolean;
  onToggleFreeNav: (enabled: boolean) => void;
  onResetAllProgress: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  isFreeNav,
  onToggleFreeNav,
  onResetAllProgress
}) => {
  if (!isOpen) return null;

  const unlockedIds = getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []);
  const completionPercentage = Math.round((unlockedIds.length / ALL_ACHIEVEMENTS.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="w-5 h-5 text-indigo-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-500" />;
      case 'Search': return <Search className="w-5 h-5 text-emerald-500" />;
      case 'Brain': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-600" />;
      default: return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  const getModuleBadge = (mod: Achievement['module']) => {
    switch (mod) {
      case 1: return <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Modul 1 (DS 1 & 2)</span>;
      case 2: return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Modul 2 (DS 3 & 4)</span>;
      case 3: return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Modul 3 (DS 5 & 6)</span>;
      case 4: return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Modul 4 (DS 7 & 8)</span>;
      default: return <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Curriculum Global</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
            title="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3.5 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Erfolge & Lernfortschritt</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {unlockedIds.length} von {ALL_ACHIEVEMENTS.length} Erfolgen freigeschaltet ({completionPercentage}%)
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-400 via-teal-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Free Navigation Toggle & Quick Actions */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">Freies Erkunden (Dozenten- / Wiederholungsmodus):</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleFreeNav(!isFreeNav)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
                isFreeNav 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isFreeNav ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isFreeNav ? 'Aktiv (Alle Stufen offen)' : 'Gesperrte Stufen freispielen'}</span>
            </button>
            <button
              onClick={onResetAllProgress}
              className="text-slate-500 hover:text-rose-600 font-medium transition-colors flex items-center space-x-1"
              title="Alle lokalen Fortschritte zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Achievement List */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {ALL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`pt-3 first:pt-0 flex items-start space-x-3.5 transition-all ${
                  isUnlocked ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isUnlocked 
                    ? 'bg-amber-50 border border-amber-200' 
                    : 'bg-slate-100 border border-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? getIcon(ach.iconName) : <Lock className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Freigeschaltet</span>
                        </span>
                      )}
                    </div>
                    {getModuleBadge(ach.module)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            Fertig & Weiterlernen
          </button>
        </div>
      </div>
    </div>
  );
};
