import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  X, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../modul_angst/utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleProceedToStep2 = () => {
    playSound('pop');
    setStep(2);
  };

  const handleFinalConfirm = () => {
    playSound('error');
    onConfirmReset();
    setStep(1);
    onClose();
  };

  const handleCancel = () => {
    playSound('pop');
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-auto p-6 sm:p-7 space-y-6">
        {step === 1 ? (
          <>
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Sicherheitsabfrage (Schritt 1 von 2)
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Lernstand zurücksetzen?
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Möchten Sie das gesamte Training wirklich zurücksetzen? Ihre bisher erarbeiteten Quizzes, freigeschalteten Learning Nuggets und Simulationsergebnisse gehen dabei verloren.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
              <strong>Hinweis:</strong> Die Module 2, 3 und 4 werden wieder gesperrt, bis die jeweiligen Meilensteine erneut absolviert wurden.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleProceedToStep2}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Weiter zur Bestätigung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                  Letzte Warnung (Schritt 2 von 2)
                </span>
                <h3 className="text-xl font-bold text-rose-950">
                  Unwiderruflich löschen?
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Achtung: Diese Aktion kann <strong>nicht</strong> rückgängig gemacht werden. Alle Daten im lokalen Browserspeicher (localStorage) werden vollständig gelöscht und das Training beginnt bei DS 1.
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900">
              Bestätigen Sie nur, wenn Sie das Training für eine neue Ausbildungsgruppe oder einen kompletten Neustart vorbereiten möchten.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ja, alles unwiderruflich zurücksetzen</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
