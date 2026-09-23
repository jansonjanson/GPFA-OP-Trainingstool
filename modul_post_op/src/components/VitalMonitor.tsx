import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vitals } from '../types';
import { HeartPulse, Activity, Smile, Meh, Frown, HeartCrack } from 'lucide-react';

interface VitalMonitorProps {
  vitals: Vitals;
  score: number;
  energy: number;
}

// Helper hook to animate numbers smoothly
const AnimatedNumber = ({ value }: { value: number | string }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (typeof value === 'number' && typeof displayValue === 'number') {
      const diff = value - displayValue;
      if (diff === 0) return;
      
      const step = diff > 0 ? 1 : -1;
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          if (typeof prev !== 'number') return value;
          const next = prev + step;
          if ((step > 0 && next >= value) || (step < 0 && next <= value)) {
            clearInterval(interval);
            return value;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return <>{displayValue}</>;
};

export const VitalMonitor: React.FC<VitalMonitorProps> = ({ vitals, score, energy }) => {
  const isCriticalSpO2 = typeof vitals.spo2 === 'number' && vitals.spo2 < 90;
  const isCriticalScore = score < 40;

  const getScoreColor = () => {
    if (score > 75) return 'bg-emerald-500';
    if (score > 40) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const getPatientIcon = () => {
    if (score < 20 || isCriticalSpO2) return <HeartCrack className="w-6 h-6 text-white" />;
    if (score < 50) return <Frown className="w-6 h-6 text-white" />;
    if (score < 80) return <Meh className="w-6 h-6 text-white" />;
    return <Smile className="w-6 h-6 text-white" />;
  };

  return (
    <aside className="bg-white text-slate-800 shadow-lg z-50 shrink-0 w-full md:w-72 lg:w-80 border-r relative flex flex-col h-auto md:h-screen overflow-y-auto">
      <AnimatePresence>
        {(isCriticalSpO2 || isCriticalScore) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-rose-500 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
      
      <div className="p-4 relative z-10 flex flex-col h-full gap-6">
        <div id="tour-safety" className="flex flex-col gap-5 p-1 -m-1 rounded-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm transition-colors duration-500 ${score >= 80 ? 'bg-teal-600' : score >= 50 ? 'bg-amber-500' : 'bg-rose-600'}`}>
              {getPatientIcon()}
            </div>
            <div>
              <h1 className="font-bold leading-tight text-slate-800">C. Meinhardt</h1>
              <p className="text-[10px] text-slate-500 font-medium">Laparoskopische Cholezystektomie</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider text-slate-500">
              <span>Sicherheit</span>
              <span className="font-mono">{score}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
              <motion.div 
                className={`h-full ${getScoreColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div id="tour-energy" className="p-1 -m-1 rounded-xl">
            <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider text-slate-500">
              <span>Energie</span>
              <span className="font-mono">{energy}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
              <motion.div 
                className={`h-full ${energy > 50 ? 'bg-indigo-500' : energy > 25 ? 'bg-amber-500' : 'bg-rose-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${energy}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div id="tour-vitals" className="grid grid-cols-2 md:grid-cols-1 gap-3 mt-2 pb-4 p-1 -m-1 rounded-xl">
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl shadow-sm relative overflow-hidden group">
            <div className="text-[10px] text-rose-600 uppercase tracking-widest font-bold flex justify-between">
              <span>HF (Puls)</span>
              {vitals.hr !== '--' && <HeartPulse className="text-rose-500 w-4 h-4 animate-pulse" />}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-rose-700">
                <AnimatedNumber value={vitals.hr} />
              </span>
              <span className="text-[10px] font-semibold text-rose-500">bpm</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl shadow-sm">
            <div className="text-[10px] text-orange-600 uppercase tracking-widest font-bold">NIBP (RR)</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-orange-700">{vitals.bp}</span>
              <span className="text-[10px] font-semibold text-orange-500">mmHg</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl shadow-sm relative">
            <div className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">SpO₂</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl md:text-3xl font-mono font-bold ${isCriticalSpO2 ? 'text-rose-600' : 'text-blue-700'}`}>
                <AnimatedNumber value={vitals.spo2} />
              </span>
              <span className="text-[10px] font-semibold text-blue-500">%</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-sm">
            <div className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">NRS (Schmerz)</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-emerald-700">
                <AnimatedNumber value={vitals.nrs} />
              </span>
              <span className="text-[10px] font-semibold text-emerald-500">/10</span>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl shadow-sm col-span-2 md:col-span-1">
            <div className="text-[10px] text-purple-600 uppercase tracking-widest font-bold">Vigilanz</div>
            <div className="mt-1">
              <span className="text-lg md:text-xl font-bold text-purple-700 truncate block">{vitals.vig}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
