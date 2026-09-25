import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  HeartHandshake, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Info, 
  Bot, 
  Trophy, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  Award,
  HelpCircle,
  User,
  GraduationCap,
  ArrowUp
} from 'lucide-react';
import { DiagnoseModule } from './modul_diagnose/DiagnoseModule';
import { AngstModule } from './modul_angst/AngstModule';
import PraeOpModule from '../modul_prae_op/src/App';
import PostOpModule from '../modul_post_op/src/App';
import { TrainingLandingPage } from './components/TrainingLandingPage';
import { CurriculumInfoModal } from './components/CurriculumInfoModal';
import { TrainingTutorialOverlay } from './components/TrainingTutorialOverlay';
import { AdminUnlockModal } from './components/AdminUnlockModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { GlobalFloatingAI } from './components/GlobalFloatingAI';
import { AchievementsModal } from './components/AchievementsModal';
import { GlobalAchievementToast } from './components/GlobalAchievementToast';
import { 
  getLocal, 
  setLocal, 
  StorageKeys, 
  isModuleUnlocked, 
  isAdminUnlocked,
  getUnlockedAchievementsCount,
  resetEntireTrainingProgress
} from './utils/gamification';

type ModuleType = 'hub' | 'diagnose' | 'angst' | 'prae_op' | 'post_op';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>(() => {
    return getLocal<ModuleType>(StorageKeys.ACTIVE_MODULE, 'hub');
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Sync achievements counter & progression
  const [achievementsStats, setAchievementsStats] = useState(() => getUnlockedAchievementsCount());
  const [isAdmin, setIsAdmin] = useState(() => isAdminUnlocked());

  // First-run lifecycle
  useEffect(() => {
    const tutorialSeen = getLocal<boolean>(StorageKeys.TUTORIAL_SEEN, false);

    // Initial visit: Only open the tutorial as start! The info box opens exclusively on user click.
    if (!tutorialSeen) {
      setIsInfoModalOpen(false);
      setIsTutorialOpen(true);
    }
  }, []);

  // Track achievements changes
  useEffect(() => {
    const updateStats = () => {
      setAchievementsStats(getUnlockedAchievementsCount());
      setIsAdmin(isAdminUnlocked());
    };

    window.addEventListener('storage', updateStats);
    const interval = setInterval(updateStats, 2000);
    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  // Per-module scroll positions tracking
  const scrollPositions = React.useRef<Record<string, number>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectModule = (module: ModuleType) => {
    // Save current scroll position for previous module
    scrollPositions.current[activeModule] = window.scrollY;

    setActiveModule(module);
    setLocal(StorageKeys.ACTIVE_MODULE, module);
    setMobileMenuOpen(false);

    // If target module has a recorded position, restore it; otherwise start at the very top (0)
    const targetPos = typeof scrollPositions.current[module] === 'number' ? scrollPositions.current[module] : 0;
    window.scrollTo({ top: targetPos, behavior: 'auto' });
    setTimeout(() => {
      window.scrollTo({ top: targetPos, behavior: 'auto' });
    }, 40);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInfoModal = () => {
    setIsTutorialOpen(false);
    setIsInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const handleOpenTutorial = () => {
    setIsInfoModalOpen(false);
    setIsTutorialOpen(true);
  };

  const handleCompleteTutorial = () => {
    setLocal(StorageKeys.TUTORIAL_SEEN, true);
    setLocal(StorageKeys.WELCOME_SEEN, true);
    setIsTutorialOpen(false);
    setIsInfoModalOpen(false);
    // Explicitly navigate to the landing page (Übersicht & Curriculum)
    setActiveModule('hub');
    setLocal(StorageKeys.ACTIVE_MODULE, 'hub');
  };

  const handleCloseTutorial = () => {
    setLocal(StorageKeys.TUTORIAL_SEEN, true);
    setLocal(StorageKeys.WELCOME_SEEN, true);
    setIsTutorialOpen(false);
    setIsInfoModalOpen(false);
    setActiveModule('hub');
    setLocal(StorageKeys.ACTIVE_MODULE, 'hub');
  };

  const handleAdminUnlocked = () => {
    setIsAdmin(true);
    setAchievementsStats(getUnlockedAchievementsCount());
  };

  const handleConfirmReset = () => {
    resetEntireTrainingProgress();
    setIsAdmin(false);
    setAchievementsStats(getUnlockedAchievementsCount());
    setActiveModule('hub');
    setLocal(StorageKeys.ACTIVE_MODULE, 'hub');
    window.location.reload();
  };

  const m1Unlocked = isModuleUnlocked(1);
  const m2Unlocked = isModuleUnlocked(2);
  const m3Unlocked = isModuleUnlocked(3);
  const m4Unlocked = isModuleUnlocked(4);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 selection:bg-indigo-200">
      {/* MOBILE TOP BAR */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-3 flex items-center justify-between border-b border-indigo-100 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-colors"
            aria-label="Navigation öffnen"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
              LE 3.4 OP-Trainingstool
            </h1>
            <span className="text-[10px] text-indigo-700 font-bold block leading-none">
              J. Rosenow M. A.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenInfoModal}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
            title="Info & Curriculum"
          >
            <Info className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">Info</span>
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION (Modern, Bright, Frosted-Glass Violet/Slate Theme) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white/95 lg:bg-slate-50/95 backdrop-blur-xl text-slate-800 flex flex-col border-r border-indigo-100 shadow-xl transition-transform duration-300 ease-in-out
        ${(mobileMenuOpen || isTutorialOpen) ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header: Branding */}
        <div id="hud-header" className="p-5 border-b border-indigo-100/80 relative flex-shrink-0 bg-gradient-to-b from-indigo-50/70 via-white to-transparent">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-[10px] border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Generalistische Pflegeausbildung</span>
            </span>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleSelectModule('hub')}
            className="text-left w-full group mt-3 block focus:outline-none cursor-pointer"
          >
            <h2 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              LE 3.4 OP-Trainingstool
            </h2>
            <p className="text-xs font-bold text-indigo-700 tracking-wide mt-0.5">
              J. Rosenow M. A.
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Perioperative Pflegefachassistenz • DS 1–8
            </p>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-indigo-100">
          {/* Main Module Progression Area */}
          <div id="hud-nav-modules" className="space-y-1.5">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-indigo-950/60 block mb-2">
              Lernmodule (DS 1 bis 8)
            </span>

            {/* Hub / Overview Button */}
            <button
              onClick={() => handleSelectModule('hub')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'hub'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-700 hover:text-indigo-950 hover:bg-indigo-50/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className={`w-4 h-4 ${activeModule === 'hub' ? 'text-white' : 'text-indigo-600'}`} />
                <span>Übersicht & Curriculum</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                activeModule === 'hub' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-900'
              }`}>
                DS 1–8
              </span>
            </button>

            {/* Modul 1: Diagnose & Beobachtung */}
            <button
              onClick={() => handleSelectModule('diagnose')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all text-left cursor-pointer ${
                activeModule === 'diagnose'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                  : 'text-slate-700 hover:text-indigo-950 hover:bg-indigo-50/80'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  activeModule === 'diagnose' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block leading-tight">Modul 1: Diagnose</span>
                  <span className={`text-[10px] block mt-0.5 ${
                    activeModule === 'diagnose' ? 'text-indigo-100' : 'text-slate-500'
                  }`}>
                    DS 1 & DS 2 • Beobachtung
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                activeModule === 'diagnose' 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                Aktiv
              </span>
            </button>

            {/* Modul 2: Angst vor der OP */}
            <button
              disabled={!m2Unlocked}
              onClick={() => m2Unlocked && handleSelectModule('angst')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all text-left ${
                !m2Unlocked
                  ? 'text-slate-400 cursor-not-allowed opacity-60 bg-slate-100/50'
                  : activeModule === 'angst'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-bold'
                  : 'text-slate-700 hover:text-blue-950 hover:bg-blue-50/80 cursor-pointer'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !m2Unlocked 
                    ? 'bg-slate-200 text-slate-500' 
                    : activeModule === 'angst' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block leading-tight">Modul 2: Angst vor OP</span>
                  <span className={`text-[10px] block mt-0.5 ${
                    activeModule === 'angst' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    DS 3 & DS 4 • Psychosozial
                  </span>
                </div>
              </div>
              {m2Unlocked ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  activeModule === 'angst'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  Offen
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Modul 3: Prä-OP Vorbereitung */}
            <button
              disabled={!m3Unlocked}
              onClick={() => m3Unlocked && handleSelectModule('prae_op')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all text-left ${
                !m3Unlocked
                  ? 'text-slate-400 cursor-not-allowed opacity-60 bg-slate-100/50'
                  : activeModule === 'prae_op'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/25 font-bold'
                  : 'text-slate-700 hover:text-teal-950 hover:bg-teal-50/80 cursor-pointer'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !m3Unlocked 
                    ? 'bg-slate-200 text-slate-500' 
                    : activeModule === 'prae_op' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block leading-tight">Modul 3: Prä-OP</span>
                  <span className={`text-[10px] block mt-0.5 ${
                    activeModule === 'prae_op' ? 'text-teal-100' : 'text-slate-500'
                  }`}>
                    DS 5 & DS 6 • Vorbereitung
                  </span>
                </div>
              </div>
              {m3Unlocked ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  activeModule === 'prae_op'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  Offen
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Modul 4: Post-OP & AWR */}
            <button
              disabled={!m4Unlocked}
              onClick={() => m4Unlocked && handleSelectModule('post_op')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all text-left ${
                !m4Unlocked
                  ? 'text-slate-400 cursor-not-allowed opacity-60 bg-slate-100/50'
                  : activeModule === 'post_op'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                  : 'text-slate-700 hover:text-emerald-950 hover:bg-emerald-50/80 cursor-pointer'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !m4Unlocked 
                    ? 'bg-slate-200 text-slate-500' 
                    : activeModule === 'post_op' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block leading-tight">Modul 4: Post-OP</span>
                  <span className={`text-[10px] block mt-0.5 ${
                    activeModule === 'post_op' ? 'text-emerald-100' : 'text-slate-500'
                  }`}>
                    DS 7 & DS 8 • Aufwachraum
                  </span>
                </div>
              </div>
              {m4Unlocked ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  activeModule === 'post_op'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  Offen
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Assistant & Information Tools Area */}
          <div className="space-y-1.5 pt-2 border-t border-indigo-100/80">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-indigo-950/60 block mb-2">
              Didaktik & Assistenz
            </span>

            {/* Info Button: Curriculum Roadmap & Tutorial launcher */}
            <button
              id="hud-info-btn"
              onClick={handleOpenInfoModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:text-indigo-950 hover:bg-indigo-50/80 transition-all cursor-pointer group"
              title="Curriculum-Infotafel & Video öffnen"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Info className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-bold block leading-tight text-slate-900">Info & Curriculum</span>
                  <span className="text-[10px] text-slate-500 block">
                    Infotafel DS 1–8 & Tutorial
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* KI-Helfer Button (Exclusively in Sidebar) */}
            <button
              id="hud-ai-helper"
              onClick={() => setIsAiOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-violet-50/80 hover:bg-violet-100/90 border border-violet-200/80 text-violet-950 transition-all cursor-pointer group"
              title="Virtuelle Praxisanleitung / KI-Helfer öffnen"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-extrabold block leading-tight text-violet-950">KI-Helfer</span>
                  <span className="text-[10px] text-violet-700 block font-medium">
                    Virtuelle Praxisanleitung
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-violet-200 text-violet-900 border border-violet-300 px-2 py-0.5 rounded-md font-bold">
                Online
              </span>
            </button>

            {/* Achievements & Nuggets Counter */}
            <button
              id="hud-achievements-btn"
              onClick={() => setIsAchievementsOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:text-amber-950 hover:bg-amber-50/80 transition-all cursor-pointer group"
              title="Erfolge & Learning Nuggets einsehen"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-bold block leading-tight text-slate-900">Erfolge & Nuggets</span>
                  <span className="text-[10px] text-slate-500 block">
                    {achievementsStats.unlocked} von {achievementsStats.total} freigespielt
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Admin & Reset Area */}
        <div id="hud-admin-reset" className="p-3.5 border-t border-indigo-100/80 bg-white/90 space-y-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            {/* Admin Lock Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title="Admin-Bereich: Alle Inhalte freischalten"
            >
              {isAdmin ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isAdmin ? 'Admin aktiv' : 'Admin'}</span>
            </button>

            {/* Reset Tool Button (2-step confirmation) */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-2 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
              title="Trainingsstand vollständig zurücksetzen (2 Bestätigungsschritte)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:pl-80 min-h-screen flex flex-col">
        {/* Top desktop breadcrumb bar */}
        <div className="hidden lg:flex items-center justify-between h-14 px-8 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-bold">LE 3.4 OP-Trainingstool</span>
            <span>/</span>
            <span className="text-indigo-600">
              {activeModule === 'hub' && 'Übersicht & Curriculum (DS 1–8)'}
              {activeModule === 'diagnose' && 'Modul 1: Diagnose & Beobachtung (DS 1 & DS 2)'}
              {activeModule === 'angst' && 'Modul 2: Angst vor der OP (DS 3 & DS 4)'}
              {activeModule === 'prae_op' && 'Modul 3: Präoperative Vorbereitung (DS 5 & DS 6)'}
              {activeModule === 'post_op' && 'Modul 4: Postoperative Pflege & AWR (DS 7 & DS 8)'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500">
              Fallbeispiel: <strong>Frau Carola Meinhardt</strong>
            </span>
            <button
              onClick={handleOpenTutorial}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
              title="UI-Tutorial starten"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Tutorial</span>
            </button>
          </div>
        </div>

        {/* Dynamic Module Rendering */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeModule === 'hub' && (
            <TrainingLandingPage
              onSelectModule={handleSelectModule}
              onOpenInfo={handleOpenInfoModal}
              onOpenTutorial={handleOpenTutorial}
              onOpenAiHelper={() => setIsAiOpen(true)}
            />
          )}

          {activeModule === 'diagnose' && (
            <DiagnoseModule
              onGoToModulAngst={() => handleSelectModule('angst')}
              onBackToHub={() => handleSelectModule('hub')}
            />
          )}

          {activeModule === 'angst' && (
            <AngstModule
              onBackToHub={() => handleSelectModule('hub')}
              onGoToModulPraeOp={() => handleSelectModule('prae_op')}
            />
          )}

          {activeModule === 'prae_op' && (
            <div className="relative">
              <PraeOpModule />
            </div>
          )}

          {activeModule === 'post_op' && (
            <div className="relative">
              <PostOpModule />
            </div>
          )}
        </div>
      </main>

      {/* MODALS & OVERLAYS */}

      {/* Curriculum Info Modal (Infotafel DS 1–8) - opens ONLY on button click */}
      <CurriculumInfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        onStartModule={(mod) => {
          setIsInfoModalOpen(false);
          handleSelectModule(mod);
        }}
        onStartTutorial={handleOpenTutorial}
      />

      {/* Interactive HUD / UI Tutorial Overlay - starts on first run, redirects to landing page on finish */}
      <TrainingTutorialOverlay
        isOpen={isTutorialOpen}
        onClose={handleCloseTutorial}
        onComplete={handleCompleteTutorial}
      />

      {/* Admin Unlock Modal (PW: "Janson") */}
      <AdminUnlockModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAdminUnlocked={handleAdminUnlocked}
      />

      {/* Reset Confirmation Modal (2 steps) */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        isFreeNav={isAdmin}
        onToggleFreeNav={() => {}}
        onResetAllProgress={handleConfirmReset}
      />

      {/* Floating KI-Praxisanleitung */}
      <GlobalFloatingAI
        isOpenControlled={isAiOpen}
        onToggleControlled={() => setIsAiOpen(!isAiOpen)}
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

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          aria-label="An den Seitenanfang springen"
          title="An den Seitenanfang springen"
          className="fixed bottom-6 right-20 z-40 p-3 bg-white/95 hover:bg-white text-indigo-700 hover:text-indigo-900 rounded-2xl shadow-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 flex items-center space-x-1.5 backdrop-blur-md cursor-pointer group active:scale-95 animate-in fade-in slide-in-from-bottom-3"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">Nach oben</span>
        </button>
      )}

      {/* Toast notifications on achievement unlock */}
      <GlobalAchievementToast />
    </div>
  );
}
