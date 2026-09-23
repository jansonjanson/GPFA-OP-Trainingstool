import { PlayCircle } from 'lucide-react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
}

export default function MediaSection({ onNavigate }: Props) {
  return (
    <section className="max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Einblick in den OP</h2>
        <ModuleMeta 
          time="Hausaufgabe / Zusatz" 
          mode="Einzelarbeit" 
          goal="Perspektivenwechsel (Was passiert nach der Übergabe?)" 
        />
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
          Schauen Sie sich ausschließlich diese beiden Videos an, um besser zu verstehen, was in der Schleuse und anschließend im Operationssaal passiert. So wird deutlich, warum Ihre vorbereitende Arbeit auf der Station so entscheidend ist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <PlayCircle className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-slate-800 text-lg">Händehygiene & OP-Schleuse</h3>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mt-auto">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/66rpkChOeew"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <PlayCircle className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-slate-800 text-lg">Ablauf im Operationssaal</h3>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mt-auto">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/faeI5ywNf3M"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      
      
      
      <NavigationButtons current="videos" onNavigate={onNavigate} />
    </section>
  );
}
