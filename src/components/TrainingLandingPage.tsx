import React from 'react';
import { 
  BookOpen, 
  Stethoscope, 
  HeartHandshake, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  HelpCircle,
  Bot,
  ChevronRight
} from 'lucide-react';
import { isModuleUnlocked, getUnlockedAchievementsCount } from '../utils/gamification';

interface Props {
  onSelectModule: (module: 'diagnose' | 'angst' | 'prae_op' | 'post_op') => void;
  onOpenInfo: () => void;
  onOpenTutorial: () => void;
  onOpenAiHelper: () => void;
}

export const TrainingLandingPage: React.FC<Props> = ({
  onSelectModule,
  onOpenTutorial,
  onOpenAiHelper
}) => {
  const m1Unlocked = isModuleUnlocked(1);
  const m2Unlocked = isModuleUnlocked(2);
  const m3Unlocked = isModuleUnlocked(3);
  const m4Unlocked = isModuleUnlocked(4);

  const { unlocked: achUnlocked, total: achTotal } = getUnlockedAchievementsCount();

  // Determine next module to continue with
  const getNextAvailableModule = (): { id: 'diagnose' | 'angst' | 'prae_op' | 'post_op'; label: string } => {
    if (!m2Unlocked) return { id: 'diagnose', label: 'Modul 1: Diagnose' };
    if (!m3Unlocked) return { id: 'angst', label: 'Modul 2: Angst vor OP' };
    if (!m4Unlocked) return { id: 'prae_op', label: 'Modul 3: Prä-OP' };
    return { id: 'post_op', label: 'Modul 4: Post-OP' };
  };

  const nextMod = getNextAvailableModule();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* HERO SECTION (Clean, without duplicate Info button and without Meinhardt card) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generalistische Pflegeausbildung • DS 1 bis DS 8</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              LE 3.4 OP-Trainingstool
            </h1>

            <p className="text-base sm:text-lg font-bold text-indigo-300">
              J. Rosenow M. A.
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Praxisorientiertes digitales Trainingsprogramm für die perioperative Pflegefachassistenz. Erarbeiten Sie in 4 didaktischen Modulen die Diagnostik, psychosoziale Angstbegleitung, präoperative Vorbereitung sowie postoperative Überwachung im Aufwachraum.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectModule(nextMod.id)}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Weiter zu {nextMod.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTutorial}
                className="px-4 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-2xl transition-all flex items-center space-x-2 border border-slate-700 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>UI-Tutorial starten</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[200px] text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
              Trainings-Status
            </span>
            <div className="text-3xl font-black text-white">
              {achUnlocked} <span className="text-base font-normal text-slate-400">/ {achTotal}</span>
            </div>
            <span className="text-xs text-slate-300 block font-medium">
              Erfolge & Wissensnuggets
            </span>
          </div>
        </div>
      </div>

      {/* 4 MODULES OVERVIEW GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Curriculum & Modul-Übersicht (DS 1–8)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Die Module bauen sequentiell aufeinander auf und werden nach Erreichen der jeweiligen Meilensteine freigeschaltet.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200/80">
            Didaktische Sequenz
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MODUL 1: Diagnose & Beobachtung */}
          <div className={`rounded-3xl border transition-all p-6 flex flex-col justify-between ${
            m1Unlocked 
              ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300' 
              : 'bg-slate-50 border-slate-200 opacity-70'
          }`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Modul 1 • DS 1 & DS 2
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Diagnose & Pflegerische Beobachtung
                    </h3>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 1: Fachinhalte erarbeiten & 7 Wissens-Quizzes
                  </strong>
                  Cholezystolithiasis, Cholezystektomie, Lehrvideo Dr. Weigl, Fachartikel gesund.bund.de, OP-Film (lap. CE), 6-F-Regel, Symptom-Körper & Quizzes.
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 2: Auswertung & Hausarzt-Simulation
                  </strong>
                  Einführung Fall Meinhardt: Anamnesegespräch, Schmerzerfassung, Red Flags und Begleitung zur OP-Indikationsstellung.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Umfang: 2 × 90 Min.</span>
              <button
                onClick={() => onSelectModule('diagnose')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Modul 1 öffnen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MODUL 2: Angst vor der OP */}
          <div className={`rounded-3xl border transition-all p-6 flex flex-col justify-between ${
            m2Unlocked 
              ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' 
              : 'bg-slate-50/70 border-slate-200/80 opacity-75'
          }`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    m2Unlocked ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      Modul 2 • DS 3 & DS 4
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Angst vor der OP & Begleitung
                    </h3>
                  </div>
                </div>
                {m2Unlocked ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Freigeschaltet</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Gesperrt (Modul 1)</span>
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 3: Grundlagen & Facetten der Angst
                  </strong>
                  State-Angst, vegetative Kaskade (Sympathikus/Parasympathikus), 4 Entstehungsformen und bio-psycho-soziales Modell.
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 4: Maßnahmen & Patientensimulation
                  </strong>
                  Digitaler Notfallkoffer (Atemtechnik, 4-A-Regel, 5-4-3-2-1), beruhigende Kommunikation und dialogische Simulation.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Umfang: 2 × 90 Min.</span>
              {m2Unlocked ? (
                <button
                  onClick={() => onSelectModule('angst')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Modul 2 öffnen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Abschluss Modul 1 nötig</span>
                </span>
              )}
            </div>
          </div>

          {/* MODUL 3: Prä-OP Vorbereitung */}
          <div className={`rounded-3xl border transition-all p-6 flex flex-col justify-between ${
            m3Unlocked 
              ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300' 
              : 'bg-slate-50/70 border-slate-200/80 opacity-75'
          }`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    m3Unlocked ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Modul 3 • DS 5 & DS 6
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Präoperative Vorbereitung & Sicherheit
                    </h3>
                  </div>
                </div>
                {m3Unlocked ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Freigeschaltet</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Gesperrt (Modul 2)</span>
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 5: Fachinhalte & Quizzes erarbeiten
                  </strong>
                  Nüchternheitsregeln (6h feste Nahrung / 2h klare Flüssigkeiten), Schmuckablage, Prämedikation, steriler OP-Saal & Quizzes.
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 6: Auswertung & Vorbereitungs-Simulator
                  </strong>
                  Kitteltaschenkarte, Stationsbegleitung von Frau Meinhardt, Patientensicherheit und Übergabe an der OP-Schleuse.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Umfang: 2 × 90 Min.</span>
              {m3Unlocked ? (
                <button
                  onClick={() => onSelectModule('prae_op')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Modul 3 öffnen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Abschluss Modul 2 nötig</span>
                </span>
              )}
            </div>
          </div>

          {/* MODUL 4: Post-OP & AWR */}
          <div className={`rounded-3xl border transition-all p-6 flex flex-col justify-between ${
            m4Unlocked 
              ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300' 
              : 'bg-slate-50/70 border-slate-200/80 opacity-75'
          }`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    m4Unlocked ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Modul 4 • DS 7 & DS 8
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Postoperative Pflege & Aufwachraum
                    </h3>
                  </div>
                </div>
                {m4Unlocked ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Freigeschaltet</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Gesperrt (Modul 3)</span>
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 7: Fachinhalte, Lehrvideo & 19 Quizzes
                  </strong>
                  AWR-Lehrvideo, DMS-Kontrolle, Schmerztherapie (NRS & PCA-Pumpe), Infusionen, Nachblutung & 19 Quizstationen.
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    DS 8: Auswertung & AWR-Praxissimulation
                  </strong>
                  Patientenübernahme aus dem OP, interaktiver Vitalmonitor, Komplikationsmanagement und strukturierte ISBAR-Übergabe.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Umfang: 2 × 90 Min.</span>
              {m4Unlocked ? (
                <button
                  onClick={() => onSelectModule('post_op')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Modul 4 öffnen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Abschluss Modul 3 nötig</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CALLOUT BAR */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-teal-50 border border-indigo-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Benötigen Sie Unterstützung beim Lernen?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Der KI-Helfer in der linken Navigation bietet Ihnen Leitlinien, Definitionen und Reflexionsfragen zu Frau Meinhardt.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAiHelper}
          className="px-4 py-2.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl transition-all shadow-sm flex-shrink-0 flex items-center space-x-2 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>KI-Helfer öffnen</span>
        </button>
      </div>
    </div>
  );
};
