import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { generateCertificatePdf } from '../utils/certificatePdf';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Home, 
  RotateCcw, 
  BookOpen, 
  X, 
  ShieldCheck, 
  HeartPulse, 
  Activity, 
  FileText,
  Download,
  User,
  Check
} from 'lucide-react';
import { CategoryScores, GameStats } from '../types';

interface CurriculumEndcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  categories: CategoryScores;
  gameStats: GameStats | null;
  onRestart: () => void;
  onBackToHub?: () => void;
}

export const CurriculumEndcardModal: React.FC<CurriculumEndcardModalProps> = ({
  isOpen,
  onClose,
  score,
  categories,
  onRestart,
  onBackToHub
}) => {
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('gpfa_student_name') || '';
    } catch {
      return '';
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      const cleanName = studentName.trim() || 'Auszubildende/r Pflegefachassistenz';
      try {
        localStorage.setItem('gpfa_student_name', cleanName);
      } catch (_) {}

      generateCertificatePdf({
        studentName: cleanName,
        score,
        categories
      });
      playSound('success');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4500);
    } catch (err) {
      console.error('Fehler bei der PDF-Generierung', err);
    } finally {
      setIsExporting(false);
    }
  };

  const triggerConfettiAndSound = () => {
    try {
      playSound('fanfare');
      // Multi-stage confetti celebration
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#34d399', '#60a5fa']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981', '#6366f1']
        });
      }, 350);
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.4, x: 0.5 }
        });
      }, 700);
    } catch (e) {
      console.debug('Confetti or audio effect fallback', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfettiAndSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToHub = () => {
    if (onBackToHub) {
      onBackToHub();
    } else {
      window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'hub' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-6 sm:p-8 text-slate-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/20 blur-2xl pointer-events-none"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 transition-colors cursor-pointer"
            title="Schließen & Analyse ansehen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative z-10">
            <button 
              onClick={triggerConfettiAndSound}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-amber-600 flex-shrink-0 border-2 border-amber-200 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Nochmals Konfetti & Jubel abspielen!"
            >
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce" />
            </button>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/15 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curriculum OP-Pflege PFA • Gesamtabschluss</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Herzlichen Glückwunsch!
              </h2>
              <p className="text-slate-900 text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed">
                Sie haben alle 4 Module und die interaktive Simulation erfolgreich gemeistert. Frau Meinhardt ist wohlauf und sicher an den Nachtdienst übergeben!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Complete Curriculum Summary */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[68vh] overflow-y-auto">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Simulations-Score</div>
              <div className={`text-2xl font-black mt-0.5 ${score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {score}%
              </div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Absolvierte Module</div>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">
                4 von 4
              </div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Umfang Training</div>
              <div className="text-2xl font-black text-teal-600 mt-0.5">
                8 Doppelstunden
              </div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patientensicherheit</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-6 h-6" />
                <span>Gesichert</span>
              </div>
            </div>
          </div>

          {/* Module-by-Module Summary Card */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Zusammenfassung aller 4 Ausbildungsmodule:</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-3.5">
              
              {/* Module 1 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white border-2 border-blue-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Modul 1 • DS 1 & 2
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Indikation & Diagnostik</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Klinisches Assessment, Labor (Leukozyten, CRP, Bilirubin), Sonographie der Cholezystolithiasis & Vorbereitung der Patientin Frau Meinhardt.
                </p>
              </div>

              {/* Module 2 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white border-2 border-indigo-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                    Modul 2 • DS 3 & 4
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Umgang mit präoperativer Angst</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Erkennen vegetativer Angstsymptome, empathische Gesprächsführung mit dem 4-A-Modell, Anxiolyse & Begleitung am Vorabend der OP.
                </p>
              </div>

              {/* Module 3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/80 to-white border-2 border-teal-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                    Modul 3 • DS 5 & 6
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Von der Vorbereitung zur OP</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Arztvorbehalt der Aufklärung, Nüchternheit, Nabelpflege, keimarme Haarkürzung mit Clipper (Schnittwunden vermeiden) & OP-Schleusenübergabe.
                </p>
              </div>

              {/* Module 4 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border-2 border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Modul 4 • DS 7 & 8
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Postoperative Pflege & AWR</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  AWR-Abholkriterien, sicheres Schmerzmanagement (Metamizol-Vorsicht), Aspirations- und Sturzprophylaxe, Frühmobilisation & ISBAR-Übergabe.
                </p>
              </div>
            </div>
          </div>

          {/* Competency Certificate & PDF Export Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border-2 border-amber-400/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-lg">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Offizieller Ausbildungsnachweis LE 3.4</span>
                  </div>
                  <h4 className="font-extrabold text-base sm:text-lg text-white">
                    Teilnahmebescheinigung: Perioperative Pflege PFA
                  </h4>
                  <p className="text-xs text-slate-300">
                    Erreichte Punktzahl: <strong className="text-amber-300 font-bold">{score} / 100 Punkte</strong> &bull; Alle 4 Module (DS 1–8) absolviert.
                  </p>
                </div>
              </div>

              {exportSuccess && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold rounded-xl animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PDF erfolgreich erstellt!</span>
                </div>
              )}
            </div>

            {/* Personalized Name Input & Download Action */}
            <div className="pt-3 border-t border-slate-700/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ihr Vor- und Nachname (für das Zertifikat)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-600 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-inner"
                />
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm py-2.5 px-5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 active:scale-95 disabled:opacity-50"
                title="Offizielle Teilnahmebescheinigung als PDF herunterladen"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isExporting ? 'Erstelle PDF...' : 'Teilnahmebescheinigung als PDF herunterladen'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Detaillierte Analyse & Debriefing</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              title="Teilnahmebescheinigung als PDF herunterladen"
            >
              <Download className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">PDF-Bescheinigung</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onRestart();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulation wiederholen</span>
            </button>

            <button
              onClick={handleGoToHub}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Zum Curriculum-Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
