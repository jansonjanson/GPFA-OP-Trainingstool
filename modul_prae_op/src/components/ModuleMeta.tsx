import { Clock, Users, Target } from 'lucide-react';

interface MetaProps {
  time: string;
  mode: string;
  goal: string;
  extra?: string;
}

export default function ModuleMeta({ time, mode, goal, extra }: MetaProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 bg-slate-100/80 p-3 rounded-lg text-sm text-slate-700 mb-6 mt-2 border border-slate-200">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        <span><span className="font-semibold text-slate-900">Zeitplan:</span> {time}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-500" />
        <span><span className="font-semibold text-slate-900">Arbeitsmodus:</span> {mode}</span>
      </div>
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-amber-500" />
        <span><span className="font-semibold text-slate-900">Ziel:</span> {goal}</span>
      </div>
      {extra && (
        <div className="w-full text-xs text-slate-500 mt-1 sm:mt-0 italic basis-full">
          {extra}
        </div>
      )}
    </div>
  );
}
