import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  X, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Repeat, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { unlockAchievement } from '../utils/gamification';

interface GlobalFloatingAIProps {
  currentModuleTitle?: string;
}

export const GlobalFloatingAI: React.FC<GlobalFloatingAIProps> = ({ currentModuleTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      return localStorage.getItem('gpfa_ki_interacted') === 'true';
    } catch {
      return false;
    }
  });

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        localStorage.setItem('gpfa_ki_interacted', 'true');
      } catch (e) {
        // ignore
      }
    }
    unlockAchievement('ki_helfer_used');
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start select-none">
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] w-80 sm:w-96 mb-3 border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-4.5 flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-2.5 font-bold text-sm sm:text-base">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <span>Virtuelle Praxisanleitung</span>
                <span className="block text-[10px] text-indigo-200 font-normal">
                  KI-Lernbegleiter für DS 1 bis DS 8
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-xl"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body Content */}
          <div className="p-5 bg-gradient-to-b from-indigo-50/40 via-white to-white text-xs sm:text-sm flex flex-col space-y-3.5">
            <p className="text-slate-800 font-semibold leading-relaxed">
              Hallo! Ich begleite dich als deine digitale Praxisanleitung durch alle 8 Doppelstunden des OP-Trainings:
            </p>
            
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2.5">
                <div className="mt-0.5 bg-violet-100 text-violet-700 p-1.5 rounded-lg flex-shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 leading-snug">
                  <strong className="text-slate-900">Fragen stellen:</strong> Fachliche Antworten zu Symptomen, Nüchternheit, Notfallkoffer & AWR
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="mt-0.5 bg-emerald-100 text-emerald-700 p-1.5 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 leading-snug">
                  <strong className="text-slate-900">Überprüfen:</strong> Eigene Antworten, Pflegebeobachtungen und Begründungen gegenprüfen
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="mt-0.5 bg-blue-100 text-blue-700 p-1.5 rounded-lg flex-shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 leading-snug">
                  <strong className="text-slate-900">Erarbeiten:</strong> Fachtexte aus *I Care* und Leitlinien strukturiert durchgehen
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="mt-0.5 bg-amber-100 text-amber-700 p-1.5 rounded-lg flex-shrink-0">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 leading-snug">
                  <strong className="text-slate-900">Wiederholen:</strong> Gezielte Simulationen und Wissensabfragen vor Prüfungen
                </span>
              </li>
            </ul>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-500">
              <strong className="text-slate-700 block mb-0.5">Google NotebookLM Chat:</strong>
              Kostenlos mit deinem Google-Konto nutzbar. Die KI basiert auf den offiziellen Unterrichtsmaterialien & Leitlinien.
            </div>
          </div>
          
          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <a 
              href="https://notebook.google.com/notebook/765c9c81-5dc1-4763-b78a-af11de18c7d3" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => unlockAchievement('ki_helfer_used')}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3 rounded-2xl transition-all shadow-md active:scale-95 font-bold text-xs sm:text-sm"
            >
              <span>KI-Chat in NotebookLM öffnen</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="relative group">
        <button
          onClick={handleOpen}
          className={`bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white ${
            !hasInteracted ? "animate-pulse ring-4 ring-indigo-300/60" : ""
          }`}
          title="Virtuelle Praxisanleitung (KI-Helfer)"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </button>

        {!hasInteracted && !isOpen && (
          <div className="absolute -top-20 left-0 bg-white text-indigo-950 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl whitespace-nowrap border border-indigo-100 animate-bounce">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hier ist dein KI-Helfer! 👋</span>
            </div>
            <span className="block text-[10px] text-slate-500 font-normal">Klick mich für fachliche Tipps an</span>
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white transform rotate-45 border-b border-r border-indigo-100"></div>
          </div>
        )}
      </div>
    </div>
  );
};
