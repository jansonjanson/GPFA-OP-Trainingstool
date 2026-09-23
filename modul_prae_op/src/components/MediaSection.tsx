import { PlayCircle, Play, ExternalLink } from 'lucide-react';
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
        {/* Video 1 */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <PlayCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-slate-800 text-lg">Händehygiene & OP-Schleuse</h3>
            </div>
            <a
              href="https://youtu.be/66rpkChOeew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
            >
              <span>Auf YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mt-auto group">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/66rpkChOeew"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <a
              href="https://youtu.be/66rpkChOeew"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all flex items-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>YouTube ↗</span>
            </a>
          </div>

          <a
            href="https://youtu.be/66rpkChOeew"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Direkt auf YouTube abspielen</span>
            </div>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>

        {/* Video 2 */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <PlayCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-slate-800 text-lg">Ablauf im Operationssaal</h3>
            </div>
            <a
              href="https://youtu.be/faeI5ywNf3M"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
            >
              <span>Auf YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mt-auto group">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/faeI5ywNf3M"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <a
              href="https://youtu.be/faeI5ywNf3M"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all flex items-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>YouTube ↗</span>
            </a>
          </div>

          <a
            href="https://youtu.be/faeI5ywNf3M"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Direkt auf YouTube abspielen</span>
            </div>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>
      </div>
      
      <NavigationButtons current="videos" onNavigate={onNavigate} />
    </section>
  );
}
