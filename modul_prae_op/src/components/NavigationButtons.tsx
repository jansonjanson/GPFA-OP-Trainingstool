import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section, sectionsOrder } from '../types';

interface Props {
  current: Section;
  onNavigate: (s: Section) => void;
}

export default function NavigationButtons({ current, onNavigate }: Props) {
  const currentIndex = sectionsOrder.indexOf(current);
  const prev = currentIndex > 0 ? sectionsOrder[currentIndex - 1] : null;
  const next = currentIndex < sectionsOrder.length - 1 ? sectionsOrder[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200/60 w-full">
      {prev ? (
        <button
          onClick={() => onNavigate(prev)}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-700 transition-colors px-4 py-2.5 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Zurück</span>
        </button>
      ) : (
        <div></div>
      )}
      
      {next ? (
        <button
          onClick={() => onNavigate(next)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="font-medium">Weiter</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
