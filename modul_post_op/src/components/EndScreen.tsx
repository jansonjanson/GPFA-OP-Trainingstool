import React, { useState } from 'react';
import { HistoryItem, CategoryScores, GameStats } from '../types';
import { RotateCcw, ListChecks, Target, Activity, FileWarning, BookOpen, Trophy, Sparkles, Home } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { StoryMap } from './StoryMap';
import { CurriculumEndcardModal } from './CurriculumEndcardModal';

interface EndScreenProps {
  score: number;
  energy: number;
  categories: CategoryScores;
  history: HistoryItem[];
  onRestart: () => void;
  gameStats?: GameStats | null;
  isCriticalFail?: boolean;
}

export const EndScreen: React.FC<EndScreenProps> = ({ score, energy, categories, history, onRestart, gameStats, isCriticalFail }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'debriefing'>('overview');
  const [showEndcard, setShowEndcard] = useState(!isCriticalFail);

  const getMessage = () => {
    if (isCriticalFail) {
      return (
        <>
          <h4 className="text-xl font-bold text-rose-700 mb-2">Kritischer Verlauf - Abbruch</h4>
          <p>Es wurden gravierende Fehler gemacht (z.B. mangelnde Überwachung oder unterlassene Erste Hilfe), die zu einem lebensbedrohlichen Notfall geführt haben. Die Simulation wurde abgebrochen.</p>
        </>
      );
    }
    if (score >= 80) {
      return (
        <>
          <h4 className="text-xl font-bold text-teal-700 mb-2">Hervorragende Leistung!</h4>
          <p>Sie haben Frau Meinhardt sicher und fachkompetent versorgt. Sie haben kritische Situationen erkannt und korrekt gehandelt.</p>
        </>
      );
    }
    if (score >= 40) {
      return (
        <>
          <h4 className="text-xl font-bold text-amber-700 mb-2">Bestanden mit Verbesserungspotenzial</h4>
          <p>Die Patientin hat überlebt, aber es gab einige riskante Entscheidungen. Achten Sie mehr auf Überwachung und Sicherheitsstandards.</p>
        </>
      );
    }
    return (
      <>
        <h4 className="text-xl font-bold text-rose-700 mb-2">Kritischer Verlauf</h4>
        <p>Es wurden gravierende Fehler gemacht, die die Patientin gefährdet haben. Bitte wiederholen Sie das Kapitel "Postoperative Überwachung".</p>
      </>
    );
  };

  const chartData = [
    {
      subject: 'Fachwissen',
      A: categories.fachwissen,
      B: gameStats?.bestCategories?.fachwissen || categories.fachwissen,
      fullMark: 50,
    },
    {
      subject: 'Voraussicht',
      A: categories.voraussicht,
      B: gameStats?.bestCategories?.voraussicht || categories.voraussicht,
      fullMark: 50,
    },
    {
      subject: 'Zeitmanagement',
      A: categories.zeitmanagement,
      B: gameStats?.bestCategories?.zeitmanagement || categories.zeitmanagement,
      fullMark: 50,
    },
    {
      subject: 'Patientenzentrierung',
      A: categories.patientenzentrierung,
      B: gameStats?.bestCategories?.patientenzentrierung || categories.patientenzentrierung,
      fullMark: 50,
    },
  ];

  const mistakes = history.filter(h => h.type === 'danger' || h.type === 'warning' || h.type === 'timeout');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 py-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full">
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-3xl bg-white shadow-xl mb-4 border border-slate-100">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Finaler Score</div>
            <div className={`text-6xl font-black ${isCriticalFail || score < 40 ? 'text-rose-500' : score >= 80 ? 'text-teal-500' : 'text-amber-500'}`}>
              {score}%
            </div>
          </div>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {getMessage()}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 mb-8">
          
          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200 mb-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Übersicht & Verlauf
            </button>
            <button 
              onClick={() => setActiveTab('debriefing')}
              className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'debriefing' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'} flex items-center gap-2`}
            >
              <BookOpen className="w-4 h-4" /> Analyse & Debriefing {mistakes.length > 0 && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs">{mistakes.length}</span>}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="animate-in fade-in">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Target className="w-5 h-5" /></div> 
                    Kompetenzprofil
                  </h3>
                  <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 10']} tick={false} axisLine={false} />
                        <Radar name="Aktueller Durchlauf" dataKey="A" stroke="#0d9488" fill="#14b8a6" fillOpacity={0.5} />
                        {gameStats && gameStats.runs > 1 && (
                          <Radar name="Bester Durchlauf" dataKey="B" stroke="#6366f1" fill="#818cf8" fillOpacity={0.2} />
                        )}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-xs font-bold mt-2">
                    <div className="flex items-center gap-1 text-teal-700"><div className="w-3 h-3 rounded-full bg-teal-500"></div> Aktuell</div>
                    {gameStats && gameStats.runs > 1 && (
                      <div className="flex items-center gap-1 text-indigo-700"><div className="w-3 h-3 rounded-full bg-indigo-400 opacity-50"></div> Bestleistung</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl text-teal-600"><ListChecks className="w-5 h-5" /></div> 
                    Verlaufsprotokoll
                  </h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {history.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border ${
                          item.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                          item.type === 'warning' ? 'bg-amber-50 border-amber-100' : 
                          item.type === 'danger' ? 'bg-rose-50 border-rose-100' :
                          item.type === 'timeout' ? 'bg-slate-50 border-slate-200 border-dashed' :
                          'bg-indigo-50 border-indigo-100' // system
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{item.scene}</div>
                        <div className="font-semibold text-slate-800 text-sm leading-snug">{item.text}</div>
                        {item.feedback && (
                          <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-black/5">
                            <span className="font-bold">{item.feedback.title}:</span> {item.feedback.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <StoryMap history={history} />
              </div>
            </div>
          )}

          {activeTab === 'debriefing' && (
            <div className="animate-in fade-in">
              <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><FileWarning className="w-5 h-5" /></div> 
                Fehleranalyse & Lernhinweise
              </h3>
              
              {mistakes.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ListChecks className="text-emerald-600 w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-800 text-lg">Makelloser Durchlauf!</h4>
                  <p className="text-emerald-700">Sie haben in diesem Durchlauf keine wesentlichen Fehler gemacht.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-slate-600">Die folgende Liste zeigt Ihre riskanten oder inkorrekten Entscheidungen aus diesem Durchlauf. Nutzen Sie die Quellenangaben, um das Hintergrundwissen aufzufrischen.</p>
                  
                  <div className="grid gap-4">
                    {mistakes.map((mistake, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border-l-4 ${mistake.type === 'danger' ? 'border-l-rose-500 bg-rose-50' : 'border-l-amber-500 bg-amber-50'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Situation: {mistake.scene}</div>
                            <div className="font-bold text-slate-800 mb-2">{mistake.text}</div>
                            {mistake.feedback && (
                              <div className="text-sm text-slate-700 bg-white/50 p-3 rounded-xl">
                                <span className="font-bold block mb-1">{mistake.feedback.title}</span>
                                {mistake.feedback.text}
                              </div>
                            )}
                          </div>
                        </div>
                        {mistake.feedback?.source && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                            <BookOpen className="w-3 h-3" /> Literatur/Quelle: {mistake.feedback.source}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setShowEndcard(true)}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 cursor-pointer ring-4 ring-amber-300/60"
            >
              <Trophy className="w-5 h-5 text-amber-900" />
              <span>🏆 Gesamtabschluss & Endcard ansehen</span>
            </button>

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'hub' }))}
              className="bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition shadow-lg flex items-center gap-2.5 cursor-pointer"
            >
              <Home className="w-5 h-5" /> Zurück zum Hub
            </button>

            <button 
              onClick={onRestart}
              className="bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-900 transition shadow-lg flex items-center gap-3 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" /> Simulation wiederholen
            </button>
          </div>
        </div>
      </div>

      <CurriculumEndcardModal 
        isOpen={showEndcard}
        onClose={() => setShowEndcard(false)}
        score={score}
        categories={categories}
        gameStats={gameStats ?? null}
        onRestart={onRestart}
      />
    </div>
  );
};
