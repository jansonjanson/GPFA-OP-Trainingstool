import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';

interface TimerBarProps {
  timeLimit: number; // in seconds
  onTimeout: () => void;
  isActive: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({ timeLimit, onTimeout, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeout]);

  const percentage = (timeLeft / timeLimit) * 100;
  const isUrgent = percentage < 30;

  return (
    <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-4 mb-6 shadow-sm border border-slate-200">
      <Clock className={`w-5 h-5 ${isUrgent ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
      <div className="flex-grow">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
          <span className={isUrgent ? 'text-rose-500' : 'text-slate-500'}>
            {isUrgent ? 'Schnelles Handeln erforderlich!' : 'Zeitdruck'}
          </span>
          <span className="font-mono text-slate-600">{timeLeft}s</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${isUrgent ? 'bg-rose-500' : 'bg-teal-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
};
