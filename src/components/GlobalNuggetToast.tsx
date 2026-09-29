import React, { useEffect, useState } from 'react';
import { BookOpen, X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NuggetUnlockNotification, onNuggetUnlocked } from '../utils/gamification';
import { playSound } from '../modul_angst/utils/audio';

interface Props {
  onOpenFachhandbuch?: (nuggetId?: string) => void;
}

export const GlobalNuggetToast: React.FC<Props> = ({ onOpenFachhandbuch }) => {
  const [toast, setToast] = useState<NuggetUnlockNotification | null>(null);

  useEffect(() => {
    let dismissTimer: NodeJS.Timeout | null = null;

    const unsubscribe = onNuggetUnlocked((notification) => {
      setTimeout(() => {
        setToast(notification);

        try {
          playSound('unlock');
        } catch {
          // ignore
        }

        try {
          confetti({
            particleCount: 45,
            spread: 55,
            origin: { y: 0.2, x: 0.82 },
            colors: ['#10b981', '#14b8a6', '#06b6d4', '#fbbf24']
          });
        } catch {
          // ignore
        }
      }, 0);

      if (dismissTimer) clearTimeout(dismissTimer);
      dismissTimer = setTimeout(() => {
        setToast(prev => (prev?.id === notification.id ? null : prev));
      }, 5500);
    });

    return () => {
      unsubscribe();
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-[135] max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-emerald-400/50 backdrop-blur-md relative overflow-hidden flex flex-col gap-3">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 text-emerald-300 shadow-md">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Modul {toast.moduleNumber} • Learning Nugget freigeschaltet!</span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {toast.title}
              </h4>
              {toast.category && (
                <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-teal-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Kategorie: <strong>{toast.category}</strong></span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setToast(null)}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info & shortcut button */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
          <span className="text-[11px] text-slate-300">
            Gesichert im Wissensarchiv
          </span>

          <button
            onClick={() => {
              if (onOpenFachhandbuch) {
                onOpenFachhandbuch(toast.id);
              } else {
                window.dispatchEvent(new CustomEvent('gpfa_open_fachhandbuch', { detail: { nuggetId: toast.id } }));
              }
              setToast(null);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-400/40 text-emerald-200 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <span>Im Fachhandbuch ansehen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
