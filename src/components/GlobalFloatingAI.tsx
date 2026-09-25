import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { unlockAchievement } from '../utils/gamification';

interface GlobalFloatingAIProps {
  currentModuleTitle?: string;
  isOpenControlled?: boolean;
  onToggleControlled?: () => void;
}

export const GlobalFloatingAI: React.FC<GlobalFloatingAIProps> = ({ 
  currentModuleTitle,
  isOpenControlled,
  onToggleControlled
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalOpen;

  const handleClose = () => {
    if (onToggleControlled && isOpenControlled) {
      onToggleControlled();
    } else {
      setInternalOpen(false);
    }
  };

  const handleOpenNotebook = () => {
    unlockAchievement('ki_helfer_used');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div 
        onClick={handleClose}
        className="absolute inset-0"
      />
      
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-indigo-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-5 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-3 font-bold text-base">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Bot className="w-6 h-6 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg tracking-tight">Virtuelle Praxisanleitung</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  KI-Tutor
                </span>
              </div>
              <span className="block text-xs text-indigo-200 font-normal mt-0.5">
                Lernbegleitung für perioperative Pflege (DS 1 bis DS 8)
              </span>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-indigo-900 block mb-0.5 text-xs uppercase tracking-wider">
                Praxis-Tipp zu: {currentModuleTitle || 'diesem Modul'}
              </span>
              <p className="text-xs text-indigo-950/90">
                Nutzen Sie den KI-Helfer zur Klärung von Fachbegriffen (z. B. 6-F-Regel, Charcot-Trias, State-Angst), zur Prüfung Ihrer Überlegungen vor Quizzes oder für Leitfragen zu Frau Meinhardt.
              </p>
            </div>
          </div>

          {/* NotebookLM External Link Box */}
          <div className="space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-4 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Interaktiver KI-Tutor (Google NotebookLM)</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Einsatzbereit
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Im interaktiven NotebookLM-Dossier sind alle Original-Leitlinien, Fallakten zu Frau Meinhardt, OP-SOPs und pflegerische Begleitdokumente hinterlegt.
            </p>
            <a
              href="https://notebook.google.com/notebook/765c9c81-5dc1-4763-b78a-af11de18c7d3"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenNotebook}
              className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>NotebookLM im neuen Tab öffnen</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </a>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="space-y-2.5 pt-1">
            <span className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
              Typische Fragen an Ihre Praxisanleitung:
            </span>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="bg-slate-50 hover:bg-indigo-50/60 p-3 rounded-xl transition-colors border border-slate-200 flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>„Warum darf Frau Meinhardt bis 2 Stunden vor Narkosebeginn klares Wasser trinken, aber keine Milch?“</span>
              </li>
              <li className="bg-slate-50 hover:bg-indigo-50/60 p-3 rounded-xl transition-colors border border-slate-200 flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>„Was unterscheidet situationsbezogene State-Angst von einer generalisierten Angststörung?“</span>
              </li>
              <li className="bg-slate-50 hover:bg-indigo-50/60 p-3 rounded-xl transition-colors border border-slate-200 flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>„Welche pflegerischen Notfallmaßnahmen erfordert ein Verdacht auf ein Biliom im Aufwachraum?“</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>In der linken Seitenleiste jederzeit aufrufbar</span>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
