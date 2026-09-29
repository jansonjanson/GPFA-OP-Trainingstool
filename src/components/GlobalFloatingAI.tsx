import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Repeat 
} from 'lucide-react';
import { unlockAchievement } from '../utils/gamification';

interface GlobalFloatingAIProps {
  currentModuleTitle?: string;
  isOpenControlled?: boolean;
  onToggleControlled?: () => void;
}

export const GlobalFloatingAI: React.FC<GlobalFloatingAIProps> = ({ 
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
                  KI-Helfer
                </span>
              </div>
              <span className="block text-xs text-indigo-200 font-normal mt-0.5">
                Lernbegleitung für die generalistische Pflegeausbildung
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

        {/* Body with the 4 clear tasks from Modul 3 */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700">
          <p className="text-slate-800 font-semibold text-sm leading-relaxed">
            Hallo! Ich bin deine virtuelle Praxisanleitung. Ich unterstütze dich bei folgenden 4 Aufgaben:
          </p>

          <ul className="space-y-3 pt-1">
            <li className="flex items-start space-x-3 p-3 bg-violet-50/70 border border-violet-100 rounded-2xl">
              <div className="mt-0.5 bg-violet-200 text-violet-800 p-1.5 rounded-lg flex-shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold text-xs sm:text-sm">1. Fragen stellen:</strong>
                <span className="text-slate-600 leading-tight">Fachliche Antwort erhalten und komplexe Leitlinien sofort verständlich erklären lassen.</span>
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <div className="mt-0.5 bg-emerald-200 text-emerald-800 p-1.5 rounded-lg flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold text-xs sm:text-sm">2. Überprüfen:</strong>
                <span className="text-slate-600 leading-tight">Eigene Antworten, Pflegeplanungen und Vermutungen vor Quizzes prüfen und verbessern lassen.</span>
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
              <div className="mt-0.5 bg-blue-200 text-blue-800 p-1.5 rounded-lg flex-shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold text-xs sm:text-sm">3. Erarbeiten:</strong>
                <span className="text-slate-600 leading-tight">Über die Unterrichtsinhalte hinaus das Thema mit Fachquellen tiefergehend erarbeiten.</span>
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
              <div className="mt-0.5 bg-amber-200 text-amber-800 p-1.5 rounded-lg flex-shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold text-xs sm:text-sm">4. Wiederholen:</strong>
                <span className="text-slate-600 leading-tight">Als interaktive Lernhilfe für die gezielte Wiederholung und Wissenssicherung nutzen.</span>
              </div>
            </li>
          </ul>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600">
            <strong className="text-slate-800 block mb-0.5 font-bold">Hinweis zur Nutzung:</strong>
            Die KI ist in Google NotebookLM hinterlegt und mit jedem kostenlosen Google Account nutzbar. Die Nutzung ist komplett kostenfrei.
          </div>

          <div className="pt-2">
            <a
              href="https://notebook.google.com/notebook/765c9c81-5dc1-4763-b78a-af11de18c7d3"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenNotebook}
              className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Jetzt Chat mit KI-Helfer starten</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </a>
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
