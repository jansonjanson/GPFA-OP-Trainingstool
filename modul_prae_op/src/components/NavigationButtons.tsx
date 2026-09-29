import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section, sectionsOrder } from '../types';

interface Props {
  current: Section;
  onNavigate: (s: Section) => void;
  onGoToNextModule?: () => void;
}

export default function NavigationButtons({ current, onNavigate, onGoToNextModule }: Props) {
  const currentIndex = sectionsOrder.indexOf(current);
  const prev = currentIndex > 0 ? sectionsOrder[currentIndex - 1] : null;
  const next = currentIndex < sectionsOrder.length - 1 ? sectionsOrder[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200/60 w-full">
      {prev ? (
        <button
          onClick={() => onNavigate(prev)}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-700 transition-colors px-4 py-2.5 rounded-xl hover:bg-white shadow-sm border border-slate-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Zurück</span>
        </button>
      ) : (
        <div></div>
      )}
      
      {next ? (
        <button
          onClick={() => onNavigate(next)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-bold text-sm cursor-pointer"
        >
          <span>Weiter</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : current === 'simulator' ? (
        <button
          onClick={() => {
            if (onGoToNextModule) onGoToNextModule();
            else window.dispatchEvent(new CustomEvent('gpfa_switch_module', { detail: 'post_op' }));
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-extrabold text-sm cursor-pointer"
        >
          <span>Weiter zu Modul 4: Post-OP & AWR</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
