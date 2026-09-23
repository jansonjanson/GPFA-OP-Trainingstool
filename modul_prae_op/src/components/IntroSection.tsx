import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
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

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-slate-100 mb-10 border border-slate-200">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/DADwjbcMfXg?si=IU5PQBU43wEt0A7K"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      <NavigationButtons current="intro" onNavigate={onNavigate} />
    </section>
  );
}
