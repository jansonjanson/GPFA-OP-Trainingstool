import { useState, useEffect } from 'react';
import { Bot, X, ExternalLink, Sparkles, HelpCircle, CheckCircle2, BookOpen, Repeat } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface Props { onOpenAI?: () => void; }

export default function FloatingAI({ onOpenAI }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  
  useEffect(() => {
    // Show tutorial ping after a short delay
    const timer = setTimeout(() => {
      // Just keep it simple
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasClicked]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-80 sm:w-96 mb-4 border border-indigo-100 overflow-hidden origin-bottom-left"
          >
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center space-x-2 font-medium">
                <Bot className="w-5 h-5 text-indigo-100" />
                <span>Virtuelle Praxisanleitung</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 bg-gradient-to-b from-indigo-50/50 to-white text-sm flex flex-col space-y-4">
              <p className="text-slate-700 font-medium leading-relaxed">
                Hallo! Ich bin deine virtuelle Praxisanleitung. (Toll, du hast mich gefunden!) Ich unterstütze dich bei folgenden Aufgaben:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="mt-0.5 bg-violet-100 text-violet-600 p-1 rounded-md"><HelpCircle className="w-3.5 h-3.5" /></div>
                  <span className="text-slate-600 leading-tight"><strong>Fragen stellen:</strong> Fachliche Antwort erhalten</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-1 rounded-md"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                  <span className="text-slate-600 leading-tight"><strong>Überprüfen:</strong> Eigene Antworten und Vermutungen prüfen und verbessern lassen</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="mt-0.5 bg-blue-100 text-blue-600 p-1 rounded-md"><BookOpen className="w-3.5 h-3.5" /></div>
                  <span className="text-slate-600 leading-tight"><strong>Erarbeiten:</strong> Über die Unterrichtsinhalte das Thema weiter erarbeiten</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="mt-0.5 bg-amber-100 text-amber-600 p-1 rounded-md"><Repeat className="w-3.5 h-3.5" /></div>
                  <span className="text-slate-600 leading-tight"><strong>Wiederholen:</strong> Lernhilfe für die Wiederholung und Sicherung nutzen</span>
                </li>
              </ul>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-500 mt-2">
                <strong className="text-slate-700 block mb-1">Hinweis:</strong>
                Die KI ist nur mit einem Google Account nutzbar. Die Nutzung ist komplett kostenlos.
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <a 
                href="https://notebook.google.com/notebook/765c9c81-5dc1-4763-b78a-af11de18c7d3" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl transition-all shadow-sm active:scale-95 font-medium"
              >
                <span>Jetzt Chat starten</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative">
        <button
          onClick={() => { setIsOpen(!isOpen); if (!hasClicked) { setHasClicked(true); if (onOpenAI) onOpenAI(); } }}
          className={`bg-gradient-to-r from-violet-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${!hasClicked ? "animate-pulse ring-4 ring-indigo-300 ring-opacity-50" : ""}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </button>
        {!hasClicked && (
          <div className="absolute -top-16 left-0 bg-white text-indigo-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap border border-indigo-100 animate-bounce">
            Hallo! Ich bin dein KI-Helfer. 👋<br/>Klick mich für Tipps an!
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-indigo-100"></div>
          </div>
        )}
      </div>
    </div>
  );
}
