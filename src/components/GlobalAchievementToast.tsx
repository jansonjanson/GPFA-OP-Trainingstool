import React, { useEffect, useState } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement, onAchievementUnlocked } from '../utils/gamification';

export const GlobalAchievementToast: React.FC = () => {
  const [toast, setToast] = useState<Achievement | null>(null);

  useEffect(() => {
    const unsubscribe = onAchievementUnlocked((ach) => {
      setToast(ach);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85, x: 0.5 }
        });
      } catch (e) {
        // ignore
      }

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 5500);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[130] animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-white flex items-center space-x-4 max-w-md">
        <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-amber-900 shadow-sm">
          <Trophy className="w-6 h-6 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-950">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Erfolg freigeschaltet!</span>
          </div>
          <h4 className="font-extrabold text-sm sm:text-base text-slate-950 truncate">
            {toast.title}
          </h4>
          <p className="text-xs text-amber-950/90 leading-tight line-clamp-2 mt-0.5">
            {toast.description}
          </p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-amber-950/70 hover:text-amber-950 p-1.5 rounded-lg hover:bg-black/5 transition-colors self-start -mt-1 -mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
