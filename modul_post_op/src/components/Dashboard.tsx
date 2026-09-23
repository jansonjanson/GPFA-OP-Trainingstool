import React, { useState } from 'react';
import { GameStats, SavedRun } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { Play, RotateCcw, Trophy, Target, Star, BrainCircuit, Trash2, Clock, Activity, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';

interface DashboardProps {
  stats: GameStats | null;
  savedRuns: SavedRun[];
  onStart: () => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, savedRuns, onStart, onReset }) => {
  const [resetConfirm, setResetConfirm] = useState(0);

  const handleReset = () => {
    if (resetConfirm === 0) setResetConfirm(1);
    else if (resetConfirm === 1) setResetConfirm(2);
    else {
      onReset();
      setResetConfirm(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 overflow-y-auto">
      <div className="max-w-4xl w-full">
        
        <div className="text-center mb-10">
          <div className="bg-teal-600 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-6 transform -rotate-3">
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Post OP Adventure</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Interaktives Fallbeispiel zur postoperativen Pflege. Trainieren Sie klinische Entscheidungen, Notfallmanagement und Patientenkommunikation.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          {stats && stats.runs > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Target className="text-teal-500" /> Ihre Statistiken
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Durchläufe</div>
                  <div className="text-3xl font-bold text-slate-800">{stats.runs}</div>
                </div>
                <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                  <div className="text-sm text-teal-600 font-semibold uppercase tracking-wider mb-1">Bester Score</div>
                  <div className="text-3xl font-bold text-teal-700">{stats.bestScore}%</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <div className="text-sm text-amber-600 font-semibold uppercase tracking-wider mb-1">Fachwissen</div>
                  <div className="text-3xl font-bold text-amber-700">{stats.bestCategories.fachwissen}</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <div className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">Voraussicht</div>
                  <div className="text-3xl font-bold text-indigo-700">{stats.bestCategories.voraussicht}</div>
                </div>
              </div>

              {savedRuns && savedRuns.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="text-sky-500" /> Letzte Durchläufe
                  </h3>
                  <div className="grid gap-3">
                    {savedRuns.slice(0, 5).map(run => (
                      <div key={run.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="font-bold text-slate-800">{new Date(run.date).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr</div>
                            <div className="text-xs text-slate-500">
                              {run.achievements.length} Achievements erzielt
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                            <div className={`font-bold ${run.score >= 80 ? 'text-emerald-600' : run.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{run.score}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Energie</div>
                            <div className="font-bold text-sky-600">{run.energy}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Trophy className="text-amber-500" /> Achievements ({stats.unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(ACHIEVEMENTS).map(ach => {
                  const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                  // @ts-ignore
                  const Icon = Icons[ach.icon] || Star;
                  
                  return (
                    <div 
                      key={ach.id} 
                      className={`group relative p-3 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all cursor-help ${
                        isUnlocked 
                          ? ach.type === 'positive' ? 'bg-emerald-50 border-emerald-200' :
                            ach.type === 'negative' ? 'bg-rose-50 border-rose-200' :
                            'bg-blue-50 border-blue-200'
                          : 'bg-slate-50 border-slate-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${isUnlocked ? (ach.type === 'positive' ? 'text-emerald-500' : ach.type === 'negative' ? 'text-rose-500' : 'text-blue-500') : 'text-slate-400'}`} />
                      <div className="text-sm font-bold text-slate-800 leading-tight">{ach.title}</div>
                      
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                        <div className="font-bold mb-1 text-amber-400">{ach.title}</div>
                        {ach.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-700">Noch keine Spieldaten</h3>
              <p className="text-slate-500 mt-2">Starten Sie Ihren ersten Durchlauf, um Statistiken und Achievements zu sammeln.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="flex-grow bg-teal-600 text-white font-bold py-5 rounded-2xl hover:bg-teal-700 transition shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-3 text-xl group"
            >
              {stats && stats.runs > 0 ? (
                <><RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform" /> Neuen Durchlauf starten</>
              ) : (
                <><Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> Simulation starten</>
              )}
            </button>
            
            {(stats && stats.runs > 0) && (
              <button 
                onClick={handleReset}
                className={`sm:w-auto px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
                  resetConfirm === 0 ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' :
                  resetConfirm === 1 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                  'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30'
                }`}
              >
                <Trash2 className="w-5 h-5" /> 
                <span className="hidden sm:inline">
                  {resetConfirm === 0 ? 'Reset' : resetConfirm === 1 ? 'Sicher?' : 'Wirklich löschen!'}
                </span>
                <span className="sm:hidden">
                  {resetConfirm === 0 ? '' : resetConfirm === 1 ? 'Sicher?' : 'Löschen!'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
