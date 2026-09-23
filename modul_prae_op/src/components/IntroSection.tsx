import { motion } from 'motion/react';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import ModuleMeta from './ModuleMeta';

interface IntroSectionProps {
  onNavigate: (section: Section) => void;
}

export default function IntroSection({ onNavigate }: IntroSectionProps) {
  return (
    <section className="max-w-4xl mx-auto w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>
        
        <h1 className="relative text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 py-2 leading-tight">
          Präoperativer Navigator
        </h1>
        
        <div className="relative text-left max-w-2xl mx-auto">
          <ModuleMeta 
            time="Doppelstunde 1" 
            mode="Einzelarbeit (eigenes Tempo)" 
            goal="Orientierung & Einstieg" 
          />
        </div>

        <p className="relative text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Willkommen im präoperativen Navigator! Bevor Sie in die praktische Vorbereitung der Patientin einsteigen, müssen die Grundlagen sitzen.
          <br /><br />
          <strong className="text-blue-800">Arbeitsauftrag:</strong> Bitte sehen Sie sich zunächst das folgende Einführungsvideo <em>vollständig</em> an. Es gibt Ihnen einen wichtigen Überblick über die Abläufe der perioperativen Phase. Danach geht es im nächsten Modul tiefer in die einzelnen Themen.
        </p>

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-slate-100 mb-4 border border-slate-200 group">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/DADwjbcMfXg?si=IU5PQBU43wEt0A7K"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <a
            href="https://youtu.be/DADwjbcMfXg"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-slate-900/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-1.5 shadow-lg z-10"
          >
            <Play className="w-3 h-3 fill-current text-red-400 group-hover:text-white" />
            <span>Auf YouTube ansehen</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Anklickbare Linkfläche zur Weiterleitung auf YouTube */}
        <a
          href="https://youtu.be/DADwjbcMfXg"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all shadow-sm hover:shadow text-left cursor-pointer group mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                  YouTube Direktlink
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  Einführung in die perioperative Phase
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hier klicken, um das Einführungsvideo direkt auf YouTube in voller Bildschirmgröße zu öffnen.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex-shrink-0 self-start sm:self-center">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auf YouTube ansehen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </a>
      </div>
      
      <NavigationButtons current="intro" onNavigate={onNavigate} />
    </section>
  );
}
