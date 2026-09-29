import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle, Sparkles, X, RotateCcw, ArrowRight, ShieldCheck, HeartPulse, Brain, Heart, ClipboardCheck, BookOpen, Star } from 'lucide-react';
import { CategoryScores, GameStats } from '../types';

interface EndcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  energy: number;
  categories: CategoryScores;
  onRestart: () => void;
  onGoToHub?: () => void;
}

export const EndcardModal: React.FC<EndcardModalProps> = ({
  isOpen,
  onClose,
  score,
  energy,
  categories,
  onRestart,
  onGoToHub
}) => {
  // Fire confetti upon opening
  useEffect(() => {
    if (isOpen) {
      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899']
      });

      // Follow-up side cannons
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ['#10B981', '#3B82F6', '#F59E0B']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ['#8B5CF6', '#EC4899', '#10B981']
        });
      }, 300);

      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  const triggerMoreConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#10B981', '#6366F1', '#F59E0B', '#EC4899']
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Banner with Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 text-white relative overflow-hidden shrink-0">
            {/* Background sparkle accents */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-28 h-28 bg-emerald-400/20 rounded-full blur-lg pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors cursor-pointer"
              title="Schließen"
              aria-label="Modal schließen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xl shrink-0 ring-4 ring-white/30 animate-bounce">
                <Trophy className="w-11 h-11" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Abschlusszertifikat • GPFA OP-Curriculum</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Herzlichen Glückwunsch zum Trainingsabschluss!
                </h2>
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Sie haben alle 4 Module (Doppelstunden 1 bis 8) der perioperativen Pflege erfolgreich absolviert und die Praxissimulation gemeistert.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
            {/* Quick Result KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">Safety Score</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-800">{score}%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Patientensicherheit</span>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">Lehrgang</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-800">4 / 4</span>
                <span className="text-[10px] text-blue-600 block mt-0.5 font-medium">Module gemeistert</span>
              </div>
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-0.5">Doppelstunden</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-800">8 von 8</span>
                <span className="text-[10px] text-indigo-600 block mt-0.5 font-medium">Curriculum erfüllt</span>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">Kompetenzstatus</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-800">100%</span>
                <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">Praxisreife PFA</span>
              </div>
            </div>

            {/* Gesamtzusammenfassung der 4 Module */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Curriculare Gesamtübersicht: Was Sie gelernt haben</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  Alle 4 Säulen komplett
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modul 1 */}
                <div className="bg-gradient-to-br from-white to-sky-50/50 border-2 border-sky-200 rounded-2xl p-4 shadow-xs hover:border-sky-400 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      1
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">DS 1 & 2 • Diagnostik</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Beobachten, Beurteilen & Pflegediagnostik</h4>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-sky-300 mt-2">
                    <li>• Pflegerische Ersteinschätzung und Beobachtungskategorien</li>
                    <li>• NANDA-I Pflegediagnosen & PESR-Struktur</li>
                    <li>• Schmerz-Assessment (NRS) und zielgerichtete Dokumentation</li>
                  </ul>
                  <div className="mt-3 flex items-center text-[11px] font-bold text-emerald-700 gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Kompetenzbereich Diagnostik gesichert</span>
                  </div>
                </div>

                {/* Modul 2 */}
                <div className="bg-gradient-to-br from-white to-amber-50/50 border-2 border-amber-200 rounded-2xl p-4 shadow-xs hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      2
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">DS 3 & 4 • Kommunikation</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Umgang mit präoperativer Angst</h4>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-amber-300 mt-2">
                    <li>• Empathische Gesprächsführung & 4-Ohren-Modell (Schulz von Thun)</li>
                    <li>• Do's & Don'ts bei Akutangst vor Narkose und Schnitt</li>
                    <li>• Medikamentöse Anxiolyse (Benzodiazepine) & Sicherheitsregeln</li>
                  </ul>
                  <div className="mt-3 flex items-center text-[11px] font-bold text-emerald-700 gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Kompetenzbereich Patientenbegleitung gesichert</span>
                  </div>
                </div>

                {/* Modul 3 */}
                <div className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-200 rounded-2xl p-4 shadow-xs hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      3
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">DS 5 & 6 • Vorbereitung</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Präoperative Pflege & Patientensicherheit</h4>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-blue-300 mt-2">
                    <li>• Nahrungskarenz (Nüchternheit: 6h / 2h) & Bauchnabelpflege</li>
                    <li>• Haarkürzung mit elektrischem Clipper (Nassrasur vermeiden!)</li>
                    <li>• Rechtssicherheit: Aufklärung durch Arzt & Identitätsprüfung</li>
                    <li>• Sichere Schleusenübergabe vor Narkoseeinleitung</li>
                  </ul>
                  <div className="mt-3 flex items-center text-[11px] font-bold text-emerald-700 gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Kompetenzbereich Prä-OP Patientensicherheit gesichert</span>
                  </div>
                </div>

                {/* Modul 4 */}
                <div className="bg-gradient-to-br from-white to-teal-50/50 border-2 border-teal-200 rounded-2xl p-4 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      4
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">DS 7 & 8 • Post-OP</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Postoperative Überwachung & Aufwachraum</h4>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-teal-300 mt-2">
                    <li>• AWR-Abholkriterien & Transportbegleitung</li>
                    <li>• Schocklagerung & Aspirationsprophylaxe bei Übelkeit</li>
                    <li>• Strukturierte ärztliche ISBAR-Übergabe</li>
                    <li>• Frühmobilisation nach vorheriger Vitalzeichenkontrolle</li>
                  </ul>
                  <div className="mt-3 flex items-center text-[11px] font-bold text-emerald-700 gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Kompetenzbereich Post-OP & Notfallmanagement gesichert</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Signature Stamp Box */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Offizieller Ausbildungsnachweis</h4>
                  <p className="text-xs text-slate-500">
                    Geprüft nach den Leitlinien für die generalistische Pflegefachassistenz (GPFA).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerMoreConfetti}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Noch mehr Konfetti!</span>
              </button>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              onClick={onRestart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulation wiederholen</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  if (onGoToHub) {
                    onGoToHub();
                  } else {
                    window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'hub' }));
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Zurück zur Lehrgangsübersicht</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
