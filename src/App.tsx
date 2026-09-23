import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  HeartHandshake,
  FileSearch,
  AlertCircle,
  Compass,
  Trophy,
  Play
} from 'lucide-react';
import { DiagnoseModule } from './modul_diagnose/DiagnoseModule';
import { AngstModule } from './modul_angst/AngstModule';
import PraeOpModule from '../modul_prae_op/src/App';
import PostOpModule from '../modul_post_op/src/App';
import { CurriculumStartNavigatorModal } from './components/CurriculumStartNavigatorModal';
import { GlobalFloatingAI } from './components/GlobalFloatingAI';
import { AchievementsModal } from './components/AchievementsModal';
import { GlobalAchievementToast } from './components/GlobalAchievementToast';
import { getLocal, setLocal, StorageKeys, ALL_ACHIEVEMENTS } from './utils/gamification';

type ModuleType = 'hub' | 'diagnose' | 'angst' | 'prae_op' | 'post_op';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('hub');
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [unlockedCount, setUnlockedCount] = useState<number>(() => {
    return getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []).length;
  });
  const [isFreeNav, setIsFreeNav] = useState<boolean>(() => {
    return getLocal<boolean>(StorageKeys.FREE_NAV_MODE, false);
  });

  // Keep unlocked count in sync
  useEffect(() => {
    const checkAchievements = () => {
      const ids = getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []);
      setUnlockedCount(ids.length);
    };
    window.addEventListener('storage', checkAchievements);
    const interval = setInterval(checkAchievements, 2000);
    return () => {
      window.removeEventListener('storage', checkAchievements);
      clearInterval(interval);
    };
  }, []);

  const handleToggleFreeNav = (enabled: boolean) => {
    setIsFreeNav(enabled);
    setLocal(StorageKeys.FREE_NAV_MODE, enabled);
  };

  const handleResetAllProgress = () => {
    localStorage.clear();
    setUnlockedCount(0);
    setIsFreeNav(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-200">
      {/* Top Global Trainingstool Switcher Bar */}
      <header className="sticky top-0 z-[60] bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveModule('hub')}
              className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity focus:outline-none"
              title="Zurück zur Übersicht"
            >
              <div className="bg-gradient-to-tr from-teal-500 via-indigo-500 to-rose-500 p-1.5 rounded-lg shadow-sm">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm sm:text-base tracking-tight leading-none text-white">
                  GPFA OP-Trainingstool
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">
                  Generalistische Pflegeausbildung • DS 1 bis 8
                </span>
              </div>
            </button>

            <span className="hidden xl:inline-flex text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
              {activeModule === 'hub' && 'Curriculum-Übersicht (DS 1–8)'}
              {activeModule === 'diagnose' && 'Modul 1: Diagnose & Beobachtung (DS 1 & 2)'}
              {activeModule === 'angst' && 'Modul 2: Angst vor OP (DS 3 & 4)'}
              {activeModule === 'prae_op' && 'Modul 3: Prä-OP (DS 5 & 6)'}
              {activeModule === 'post_op' && 'Modul 4: Post-OP (DS 7 & 8)'}
            </span>
          </div>

          {/* Module Switcher Buttons & Global Tools */}
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setActiveModule('hub')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeModule === 'hub'
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Übersicht</span>
              </button>

              {/* Modul 1: Diagnose */}
              <button
                onClick={() => setActiveModule('diagnose')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeModule === 'diagnose'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Modul 1: Diagnose</span>
              </button>

              {/* Modul 2: Angst vor OP */}
              <button
                onClick={() => setActiveModule('angst')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeModule === 'angst'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>Modul 2: Angst</span>
              </button>

              {/* Modul 3: Prä-OP */}
              <button
                onClick={() => setActiveModule('prae_op')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeModule === 'prae_op'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Modul 3: Prä-OP</span>
              </button>

              {/* Modul 4: Post-OP */}
              <button
                onClick={() => setActiveModule('post_op')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeModule === 'post_op'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modul 4: Post-OP</span>
              </button>
            </nav>

            <div className="h-5 w-px bg-slate-800 hidden md:block" />

            {/* Quick Actions: Roadmap & Achievements */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsStartModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 border border-indigo-500/50"
                title="Curriculum-Roadmap & Video-Intro über alle 8 Doppelstunden öffnen"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden lg:inline">Roadmap (DS 1–8)</span>
              </button>

              <button
                onClick={() => setIsAchievementsOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-all flex items-center space-x-1.5 active:scale-95"
                title="Erfolge & Freies Skippen öffnen"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{unlockedCount}/{ALL_ACHIEVEMENTS.length}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Module Content */}
      <main className="flex-1 flex flex-col">
        {activeModule === 'hub' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 mb-10 shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Klinisches Simulations- & E-Learning Portal • 4 Module</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                  GPFA OP-Trainingstool
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                  Vollständiger Patientinnen-Pfad für Frau Carola Meinhardt (67 J.) durch das Curriculum (PFA-Niveau).
                  Von der Erstvorstellung in der Hausarztpraxis (Gallenkolik) über die präoperative Angstbewältigung 
                  bis zur Vorbereitung im OP-Saal und der postoperativen Aufwachraum-Überwachung.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsStartModalOpen(true)}
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-lg hover:shadow-indigo-600/30 active:scale-95 text-sm border border-indigo-400/40"
                  >
                    <Compass className="w-4 h-4 text-indigo-200" />
                    <span>Curriculum-Roadmap & Video-Intro öffnen (DS 1–8)</span>
                    <Play className="w-3.5 h-3.5 fill-current ml-1" />
                  </button>
                  <button
                    onClick={() => setActiveModule('diagnose')}
                    className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-white font-semibold transition-all shadow-md active:scale-95 text-sm"
                  >
                    <span>Modul 1: Diagnose</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveModule('angst')}
                    className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-semibold transition-all shadow-md active:scale-95 text-sm"
                  >
                    <span>Modul 2: Angst</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveModule('prae_op')}
                    className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-semibold transition-all shadow-md active:scale-95 text-sm"
                  >
                    <span>Modul 3: Prä-OP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveModule('post_op')}
                    className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md active:scale-95 text-sm"
                  >
                    <span>Modul 4: Post-OP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Decorative background glow */}
              <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* 4 Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Card 1: Modul 1 Diagnose & Beobachtung (Gallensteine) */}
              <div className="bg-white rounded-3xl p-7 border-2 border-teal-100 hover:border-teal-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                      Modul 1 (Neu integriert)
                    </span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" /> 2 × 90 Min. (DS 1 & 2 / ehem. DS 3 & 4)
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Diagnose & Beobachtung (Gallensteine)
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Symptome beobachten, Red Flags erkennen und weiterleiten. Behandelt Cholezystolithiasis, 6-F-Regel, 
                    Symptom-Körper (Head-Zonen), Ausscheidungs-Labor (dunkler Urin, heller Stuhl), 7 Quizzes mit Sofort-Feedback, 
                    Learning Nuggets und die hausärztliche Anamnese-Simulation zur Feststellung der OP-Indikation.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>DS 1: Videos, 6-F-Regel, Symptom-Körper, Triage & Lückentexte</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>DS 2: Hausarzt-Simulation mit Frau Meinhardt & Sonographie</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>PFA-Lernziel: Beobachtung & Erkennung lebensbedrohlicher Warnsignale</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Endergebnis: OP-Indikation zur laparoskopischen Cholezystektomie</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModule('diagnose')}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-teal-600 text-white hover:bg-teal-500 font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Modul 1 starten: Diagnose & Beobachtung</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2: Modul 2 Angst vor der OP */}
              <div className="bg-white rounded-3xl p-7 border-2 border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-700">
                      Modul 2
                    </span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" /> 2 × 90 Min. (DS 3 & 4)
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Angst vor der OP
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Nach Erhalt der OP-Indikation brechen bei Frau Meinhardt Ängste auf. 
                    Behandelt Angst vs. Furcht, Neurobiologie, 10 Quizzes, freischaltbare Foliensätze, 
                    digitalen Notfallkoffer und die verzweigte Stationssimulation zur OP-Vorbereitung.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>DS 3: Neurobiologie, vegetative Kaskade & 4 Entstehungsformen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>DS 4: Digitaler Notfallkoffer (Kommunikation, Wärme, PMR, Midazolam)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Branched Simulation Frau Meinhardt vor Cholezystektomie</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Learning Nuggets mit visuell aufbereiteten Lehrfolien</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModule('angst')}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-rose-600 text-white hover:bg-rose-500 font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Modul 2 starten: Angst vor der OP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 3: Modul 3 Prä-OP Navigator */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Modul 3
                    </span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" /> 2 × 90 Min. (DS 5 & 6)
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Prä-OP Navigator
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Umfassendes E-Learning zur Vorbereitung der Patientin auf den OP-Tag. 
                    Behandelt Nüchternheitsgebote, Checklisten, Schmuck- und Zahnteilprothesen-Regeln 
                    sowie den reibungslosen Ablauf in der OP-Schleuse und im OP-Saal.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>7 interaktive Lern-Nuggets in der Wissens-Base</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Virtueller 3D-Rundgang & Videos (OP-Schleuse & Saal)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Praktischer Arbeitsauftrag & OP-Simulator</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModule('prae_op')}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Modul 3: Prä-OP Navigator öffnen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 4: Modul 4 Post-OP Pflege */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      Modul 4 • Partnerarbeit
                    </span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" /> 2 × 90 Min. (DS 7 & 8)
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Post-OP Pflege & AWR
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    DS 7: Partner-/Gruppenarbeit mit 3 Lehrvideos (DIAKOVERE Aufwachraum, Abholung, Stationsmaßnahmen), 
                    Fachtexten (I Care) und 19-teiligem Quiz-Parcours mit Learning Nuggets. 
                    DS 8: Interaktive klinische OP-Simulation mit Vitalmonitor und ISBAR-Übergabe.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>DS 7: 19 interaktive Quiz-Stationen & freischaltbare Learning Nuggets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>DS 8: Vitalmonitor (HF, RR, SpO2, Temp, NRS) & Notfallmanagement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>ISBAR-Übergabe, DMS-Kontrolle & Schmerzmanagement (PCA)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModule('post_op')}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Modul 4: Post-OP Pflege öffnen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Curriculum Competencies Overview DS 1-8 */}
            <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-700" />
                <span>Curriculum-Chronologie der Doppelstunden (DS 1 bis DS 8)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm text-slate-600">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-teal-700 block uppercase mb-1">
                    DS 1 & 2 • Modul 1
                  </span>
                  <h4 className="font-bold text-slate-800 mb-1">Diagnose & Beobachtung</h4>
                  <p className="text-xs leading-relaxed">
                    Gallensteine erkennen, Red Flags (Charcot-Trias, Cholestase) deuten, Anamnese bei Frau Meinhardt erheben und OP-Indikation begründen.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-rose-700 block uppercase mb-1">
                    DS 3 & 4 • Modul 2
                  </span>
                  <h4 className="font-bold text-slate-800 mb-1">Angst vor der OP</h4>
                  <p className="text-xs leading-relaxed">
                    Vegetative Symptome, Deeskalation, Notfallkoffer (Kommunikation, Wärme, PMR, Prämedikation) und Cholezystektomie-Vorbereitungs-Simulation.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-blue-700 block uppercase mb-1">
                    DS 5 & 6 • Modul 3
                  </span>
                  <h4 className="font-bold text-slate-800 mb-1">Prä-OP Navigator</h4>
                  <p className="text-xs leading-relaxed">
                    Nüchternheitsgebote, Patientenidentifikation, Vorbereitungskoffer, Schleusentransfer und interaktiver OP-Saal-Rundgang.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-emerald-700 block uppercase mb-1">
                    DS 7 & 8 • Modul 4
                  </span>
                  <h4 className="font-bold text-slate-800 mb-1">Post-OP Adventure</h4>
                  <p className="text-xs leading-relaxed">
                    Überwachung im AWR, Vitalzeichen-Monitoring, Nachblutungen, PONV-Management und strukturierte ISBAR-Übergabe an Ärzte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modul 1: Diagnose & Beobachtung */}
        {activeModule === 'diagnose' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            <DiagnoseModule 
              onGoToModulAngst={() => setActiveModule('angst')}
              onBackToHub={() => setActiveModule('hub')} 
            />
          </div>
        )}

        {/* Modul 2: Angst vor OP */}
        {activeModule === 'angst' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            <AngstModule 
              onBackToHub={() => setActiveModule('hub')} 
              onGoToModulPraeOp={() => setActiveModule('prae_op')}
            />
          </div>
        )}

        {/* Modul 3: Prä-OP (ehemaliges Modul 1 / Modul 3) */}
        {activeModule === 'prae_op' && (
          <div className="relative">
            <PraeOpModule />
          </div>
        )}

        {/* Modul 4: Post-OP (ehemaliges Modul 2 / Modul 4) */}
        {activeModule === 'post_op' && (
          <div className="relative">
            <PostOpModule />
          </div>
        )}
      </main>

      {/* Global Curriculum Modals & Assistants */}
      <CurriculumStartNavigatorModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onStartModule={(mod) => {
          setActiveModule(mod);
          setIsStartModalOpen(false);
        }}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        isFreeNav={isFreeNav}
        onToggleFreeNav={handleToggleFreeNav}
        onResetAllProgress={handleResetAllProgress}
      />

      <GlobalFloatingAI
        currentModuleTitle={
          activeModule === 'diagnose'
            ? 'Modul 1: Diagnose & Beobachtung (DS 1 & 2)'
            : activeModule === 'angst'
            ? 'Modul 2: Angst vor OP (DS 3 & 4)'
            : activeModule === 'prae_op'
            ? 'Modul 3: Prä-OP Vorbereitung (DS 5 & 6)'
            : activeModule === 'post_op'
            ? 'Modul 4: Post-OP Aufwachraum (DS 7 & 8)'
            : 'GPFA Curriculum Gesamtübersicht (DS 1–8)'
        }
      />

      <GlobalAchievementToast />
    </div>
  );
}
