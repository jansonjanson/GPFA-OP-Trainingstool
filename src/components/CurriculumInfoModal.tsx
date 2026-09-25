import React, { useState } from 'react';
import { 
  X, 
  Play, 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Stethoscope, 
  HeartHandshake, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Award, 
  User, 
  Sparkles, 
  ChevronRight, 
  HelpCircle,
  Compass,
  GraduationCap
} from 'lucide-react';
import { unlockAchievement } from '../utils/gamification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartModule: (module: 'diagnose' | 'angst' | 'prae_op' | 'post_op') => void;
  onStartTutorial: () => void;
}

export const CurriculumInfoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onStartModule,
  onStartTutorial
}) => {
  if (!isOpen) return null;

  const handleStart = (module: 'diagnose' | 'angst' | 'prae_op' | 'post_op') => {
    unlockAchievement('curriculum_roadmap');
    onStartModule(module);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 rounded-2xl hover:bg-white/10"
            title="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Infotafel & Lehrplan • Generalistische Pflegeausbildung</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            LE 3.4 OP-Trainingstool
          </h1>
          <p className="text-sm font-semibold text-indigo-200 mt-0.5">
            J. Rosenow M. A.
          </p>

          <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
            Didaktische Übersicht des 8-Doppelstunden-Curriculums zur perioperativen Pflegefachassistenz am Fallbeispiel von <strong>Frau Carola Meinhardt (67 J.)</strong> – laparoskopische Cholezystektomie (LCE).
          </p>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onStartTutorial();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Interaktives UI-Tutorial starten</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content: 4 Module Overview */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Patient Profile Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-slate-50 to-teal-50/80 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                  Leitfall der 8 Doppelstunden
                </span>
                <h4 className="font-extrabold text-slate-900 text-base mt-0.5">
                  Frau Carola Meinhardt (67 Jahre)
                </h4>
                <p className="text-xs text-slate-600">
                  Diagnose: Symptomatische Cholezystolithiasis (Gallenkolik) • Therapie: Elektive laparoskopische Cholezystektomie (LCE)
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              8 Doppelstunden (16 UE)
            </div>
          </div>

          {/* Module 1 to 4 Cards */}
          <div className="space-y-4">
            {/* Modul 1 */}
            <div className="border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 transition-all bg-white hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                    M1
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Modul 1 • DS 1 & DS 2 (2 × 90 Min.)
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      Diagnose & Pflegerische Beobachtung
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => handleStart('diagnose')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <span>Modul 1 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 1: Theorie & 7 Quizzes</strong>
                  Pathophysiologie der Cholezystolithiasis, Leitlinie (gesund.bund.de), OP-Film (LCE), 6-F-Regel, Symptom-Körper & Ausscheidungsbeobachtung.
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 2: Hausarzt-Simulation</strong>
                  Anamnese-Gespräch mit Frau Meinhardt, Schmerzerfassung, Red Flags und Begleitung zur OP-Indikationsstellung.
                </div>
              </div>
            </div>

            {/* Modul 2 */}
            <div className="border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all bg-white hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                    M2
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Modul 2 • DS 3 & DS 4 (2 × 90 Min.)
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      Angst vor der OP & Psychosoziale Begleitung
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => handleStart('angst')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <span>Modul 2 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 3: Grundlagen & Neurobiologie</strong>
                  State-Angst, vegetative Kaskade (Sympathikus/Parasympathikus), 4 Entstehungsformen und Angstmodell.
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 4: Maßnahmen & Simulation</strong>
                  Digitaler Notfallkoffer (Atemtechniken, 4-A-Regel, 5-4-3-2-1) und dialogische Patientensimulation.
                </div>
              </div>
            </div>

            {/* Modul 3 */}
            <div className="border border-slate-200 hover:border-teal-300 rounded-2xl p-5 transition-all bg-white hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
                    M3
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      Modul 3 • DS 5 & DS 6 (2 × 90 Min.)
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      Präoperative Vorbereitung & Sicherheit
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => handleStart('prae_op')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <span>Modul 3 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 5: Prä-OP Pflegestandards</strong>
                  Nüchternheitsregeln (6h/2h), OP-Vorbereitung, Schmuckablage, OP-Hemd & steriler OP-Saal.
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 6: Vorbereitungs-Simulator</strong>
                  Interaktive Stationsbegleitung, Kitteltaschen-Checkliste und Patiententransfer zur OP-Schleuse.
                </div>
              </div>
            </div>

            {/* Modul 4 */}
            <div className="border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 transition-all bg-white hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                    M4
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Modul 4 • DS 7 & DS 8 (2 × 90 Min.)
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      Postoperative Pflege & Aufwachraum (AWR)
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => handleStart('post_op')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <span>Modul 4 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 7: AWR-Fachinhalte & 19 Quizzes</strong>
                  AWR-Lehrvideo, DMS-Kontrolle, Schmerzmanagement (NRS & PCA-Pumpe), Infusionen und Frühmobilisation.
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block font-bold mb-0.5">DS 8: AWR-Praxissimulation</strong>
                  Übernahme aus dem OP, interaktiver Vitalmonitor, Notfallkomplikationen und ISBAR-Übergabe.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <span className="text-xs text-slate-500 text-center sm:text-left">
            LE 3.4 • J. Rosenow M. A. • Alle Module mit interaktiven Quizzes & Simulationen
          </span>
          <button
            onClick={() => handleStart('diagnose')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Training mit Modul 1 starten</span>
          </button>
        </div>
      </div>
    </div>
  );
};
