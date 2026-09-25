import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Sparkles
} from 'lucide-react';
import { playSound } from '../modul_angst/utils/audio';
import { unlockAllWithAdminPassword } from '../utils/gamification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdminUnlocked: () => void;
}

export const AdminUnlockModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdminUnlocked
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAllWithAdminPassword(password)) {
      playSound('unlock');
      setIsSuccess(true);
      setError(null);
      setTimeout(() => {
        onAdminUnlocked();
        onClose();
        setIsSuccess(false);
        setPassword('');
      }, 1200);
    } else {
      playSound('error');
      setError('Falsches Admin-Passwort. Bitte überprüfen Sie die Eingabe.');
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                Dozenten- & Lehrkraftmodus
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Admin-Bereich
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Geben Sie das Admin-Passwort ein, um alle 4 Module (DS 1 bis DS 8), sämtliche Quizzes und alle Learning Nuggets sofort für Lehrzwecke freizuschalten.
        </p>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center space-x-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="block font-bold">Zugang gewährt!</strong>
              <span>Alle Module, Simulationen und Learning Nuggets wurden erfolgreich freigeschaltet.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Passwort eingeben:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Passwort eingeben..."
                  autoFocus
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-sm font-medium outline-none transition-all"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Alle Inhalte entsperren</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
