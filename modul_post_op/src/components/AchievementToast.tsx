import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../types';
import * as Icons from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  // Auto-close after 5 seconds
  React.useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          onClick={onClose}
          className="fixed bottom-6 right-6 z-[999] max-w-sm w-[calc(100%-3rem)] cursor-pointer select-none pointer-events-auto shadow-2xl"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 border-2 border-amber-400 hover:border-amber-300 relative transition-all">
            <div className={`p-3 rounded-full shrink-0 ${
              achievement.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
              achievement.type === 'negative' ? 'bg-rose-500/20 text-rose-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {/* @ts-ignore - Dynamic icon rendering */}
              {React.createElement(Icons[achievement.icon] || Icons.Award, { className: 'w-6 h-6' })}
            </div>
            <div className="flex-1 pr-7">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-0.5">
                <span>Achievement freigespielt!</span>
              </div>
              <h4 className="font-bold text-base mb-0.5 text-white">{achievement.title}</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-tight">{achievement.description}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2.5 right-2.5 p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-sm"
              title="Achievement schließen"
              aria-label="Achievement schließen"
            >
              <Icons.X className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
