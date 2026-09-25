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
  ChevronDown,
  Info
} from 'lucide-react';
import { unlockAchievement } from '../utils/gamification';

interface CurriculumStartNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartModule: (module: 'diagnose' | 'angst' | 'prae_op' | 'post_op') => void;
}

export const CurriculumStartNavigatorModal: React.FC<CurriculumStartNavigatorModalProps> = ({
  isOpen,
  onClose,
  onStartModule
}) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen) return null;

  const handleStart = (module: 'diagnose' | 'angst' | 'prae_op' | 'post_op') => {
    unlockAchievement('curriculum_roadmap');
    onStartModule(module);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 rounded-2xl hover:bg-white/10"
            title="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Curriculum-Navigator • Generalistische Pflegeausbildung</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Willkommen zum OP-Training
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Ihr vollständiger Patientinnen-Pfad über <strong>alle 8 Doppelstunden (DS 1 bis 8)</strong>: 
            Von der ersten Schmerzbeobachtung in der Hausarztpraxis über die perioperative Vorbereitung 
            bis hin zur intensivierten postoperativen Überwachung im Aufwachraum.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 divide-y divide-slate-100">
          
          {/* Patientin Kontextbox */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">Fallpatientin: Carola Meinhardt</span>
                  <span className="text-xs text-slate-500 font-medium">67 Jahre · 165 cm · 75 kg</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Indikation:</strong> Symptomatische Cholezystolithiasis $\to$ Geplante laparoskopische Cholezystektomie.
                  <br />
                  <strong>Besonderheiten:</strong> Allergie gegen Penicillin & Kolophonium (Pflasterallergie).
                </p>
              </div>
            </div>
            <div className="text-[11px] text-teal-800 font-bold bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl whitespace-nowrap self-stretch sm:self-auto text-center">
              Begleitet Sie durch DS 1 bis 8
            </div>
          </div>

          {/* Curriculum-Fahrplan über alle 8 Doppelstunden */}
          <div className="pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Der Curriculum-Fahrplan: Alle 8 Doppelstunden (DS 1–8)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Stichpunktartige Übersicht der Lernschritte, Methoden und Praxissimulationen
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modul 1 */}
              <div className="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-teal-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-lg">
                      Modul 1 • DS 1 & 2
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 2 × 90 Min.
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>Diagnose & Beobachtung (Gallensteine)</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4 list-disc pl-4">
                    <li><strong>DS 1:</strong> 6-F-Regel, Head-Zonen (rechter Oberbauch, Schulter), Ausscheidungsbeobachtung (heller Stuhl, dunkler Urin).</li>
                    <li><strong>Notfall-Triage:</strong> Charcot-Trias (Fieber, Ikterus, Schmerz) & Peritonitis-Früherkennung.</li>
                    <li><strong>DS 2:</strong> Hausärztliche Anamnese-Simulation bei Frau Meinhardt & Stellung der OP-Indikation.</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStart('diagnose')}
                  className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Modul 1 starten</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modul 2 */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-rose-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-lg">
                      Modul 2 • DS 3 & 4
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 2 × 90 Min.
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
                    <HeartHandshake className="w-4 h-4 text-rose-600" />
                    <span>Angst vor der OP (Deeskalation)</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4 list-disc pl-4">
                    <li><strong>DS 3:</strong> Neurobiologie: Angst vs. Furcht, vegetative Stresskaskade (Sympathikus/Parasympathikus), 4 Entstehungsformen.</li>
                    <li><strong>DS 4:</strong> Digitaler Notfallkoffer (Kommunikation, Wärmedecke, PMR-Atemübungen, Prämedikation/Midazolam).</li>
                    <li><strong>Simulation:</strong> Patientengespräch & Deeskalation vor der Narkose.</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStart('angst')}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Modul 2 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modul 3 */}
              <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-blue-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-lg">
                      Modul 3 • DS 5 & 6
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 2 × 90 Min.
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Prä-OP Vorbereitung & OP-Saal</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4 list-disc pl-4">
                    <li><strong>DS 5:</strong> Nüchternheitsregeln (6h/2h), Schmuck-/Zahnersatzablage, Hautvorbereitung per Clipper, MTPS-Strümpfe.</li>
                    <li><strong>Rundgang:</strong> Schleusentransfer & interaktiver 3D-Rundgang im sterilen OP-Saal.</li>
                    <li><strong>DS 6:</strong> Kitteltaschenkarte & interaktiver OP-Vorbereitungs-Simulator bei Frau Meinhardt.</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStart('prae_op')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Modul 3 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modul 4 */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-emerald-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      Modul 4 • DS 7 & 8
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 2 × 90 Min.
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Post-OP Pflege & Aufwachraum (AWR)</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4 list-disc pl-4">
                    <li><strong>DS 7:</strong> Partnerarbeit mit 3 Lehrvideos (DIAKOVERE Aufwachraum, Abholung, Station) & 19 Quiz-Stationen mit Learning Nuggets.</li>
                    <li><strong>DS 8:</strong> Klinische Simulation mit Vitalmonitor (HF, RR, SpO2, Temp, Schmerz).</li>
                    <li><strong>Notfallmanagement:</strong> Nachblutung, PONV-Management & ISBAR-Übergabepuzzle.</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStart('post_op')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Modul 4 öffnen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>Sie können diesen Fahrplan jederzeit über das Menü erneut aufrufen.</span>
          </div>
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all w-1/2 sm:w-auto text-center"
            >
              Schließen
            </button>
            <button
              onClick={() => handleStart('diagnose')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-teal-600/30 flex items-center justify-center space-x-1.5 w-1/2 sm:w-auto text-center"
            >
              <span>Training bei Modul 1 starten</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
