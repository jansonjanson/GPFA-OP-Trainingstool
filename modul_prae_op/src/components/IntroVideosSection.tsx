import React from 'react';
import { PlayCircle, Play, ExternalLink, ArrowRight, Video, Sparkles, BookOpen } from 'lucide-react';
import { Section } from '../types';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
}

export default function IntroVideosSection({ onNavigate }: Props) {
  return (
    <section className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/40 rounded-3xl p-6 sm:p-10 border border-blue-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Modul 1: Übersicht & Einführung</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Von der Vorbereitung zur OP
          </h2>

          <ModuleMeta 
            time="Doppelstunde 5 • Einführung" 
            mode="Einzelarbeit / Plenum" 
            goal="Theoretische & praktische Einführung in die perioperative Phase" 
          />

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl">
            Willkommen im präoperativen Navigator! Bevor Sie in die praktische Vorbereitung der Patientin einsteigen, müssen die Grundlagen sitzen.
          </p>

          {/* Arbeitsauftrag Box */}
          <div className="bg-white/90 backdrop-blur-xs border-l-4 border-blue-600 border-y border-r border-blue-100 rounded-r-2xl p-5 shadow-xs space-y-2">
            <h3 className="font-extrabold text-blue-950 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Arbeitsauftrag:</span>
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Bitte sehen Sie sich zunächst die beiden folgenden Einführungsvideos vollständig an, bevor Sie zum nächsten Modul wechseln.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Das erste Video (ErstensMedizin) gibt Ihnen eine übersichtliche theoretische Einführung in die perioperative Phase anhand eines fiktiven Falls. Das zweite Video zeigt Ihnen ein echtes Beispiel aus dem Klinikalltag. Beachten Sie dabei: Die genauen Abläufe können von Klinik zu Klinik leicht variieren.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Einführungsvideos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video 1: ErstensMedizin */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-blue-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Theorie: ErstensMedizin
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                  Einführung in die perioperative Phase
                </h3>
              </div>
            </div>
            <a
              href="https://youtu.be/DADwjbcMfXg?si=6kchwL_QhQ-JJCWp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/DADwjbcMfXg"
              title="Einführung in die perioperative Phase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <a
              href="https://youtu.be/DADwjbcMfXg?si=6kchwL_QhQ-JJCWp"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all flex items-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>YouTube ↗</span>
            </a>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Strukturierte theoretische Übersicht: Von der Indikationsstellung und Prämedikation bis zur Narkoseausleitung und Übergabe.
          </p>

          <a
            href="https://youtu.be/DADwjbcMfXg?si=6kchwL_QhQ-JJCWp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Direkt auf YouTube öffnen</span>
            </div>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>

        {/* Video 2: Klinikalltag */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-blue-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Praxis: Klinikalltag
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                  OP-Begleitung & Abläufe im Krankenhaus
                </h3>
              </div>
            </div>
            <a
              href="https://youtu.be/Y3EwPcJxr80?si=AvqD1IWAN2PTJ2jz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Y3EwPcJxr80"
              title="Klinikalltag OP-Begleitung"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <a
              href="https://youtu.be/Y3EwPcJxr80?si=AvqD1IWAN2PTJ2jz"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all flex items-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>YouTube ↗</span>
            </a>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Authentischer Einblick in die Praxis: Wie Pflegefachkräfte Patienten vorbereiten, begleiten und an das OP-Team übergeben.
          </p>

          <a
            href="https://youtu.be/Y3EwPcJxr80?si=AvqD1IWAN2PTJ2jz"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Direkt auf YouTube öffnen</span>
            </div>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>
      </div>

      {/* Weiter Button zur Wissens-Base */}
      <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-extrabold text-base block">Videos angesehen?</span>
          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
            Wechseln Sie jetzt zum Fachtext und bearbeiten Sie die Aufgaben in der Wissens-Base.
          </p>
        </div>
        <button
          onClick={() => onNavigate('wissen')}
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <span>Weiter zu 2. Wissens-Base</span>
          <ArrowRight className="w-4 h-4 text-blue-700" />
        </button>
      </div>
    </section>
  );
}
