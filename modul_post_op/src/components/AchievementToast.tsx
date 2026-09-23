import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../types';
import * as Icons from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  // Auto-close after 4 seconds
  React.useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000);
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
          className="fixed bottom-6 right-6 z-[200] max-w-sm w-full"
        >
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-4 border border-slate-700">
            <div className={`p-3 rounded-full shrink-0 ${
              achievement.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
              achievement.type === 'negative' ? 'bg-rose-500/20 text-rose-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {/* @ts-ignore - Dynamic icon rendering */}
              {React.createElement(Icons[achievement.icon] || Icons.Award, { className: 'w-6 h-6' })}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Achievement unlocked!</div>
              <h4 className="font-bold text-lg mb-0.5">{achievement.title}</h4>
              <p className="text-slate-300 text-sm leading-tight">{achievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
