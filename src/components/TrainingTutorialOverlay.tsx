import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Trophy,
  Info,
  Bot
} from 'lucide-react';
import { playSound } from '../modul_angst/utils/audio';

export interface TutorialStep {
  targetId: string;
  title: string;
  description: string;
  badge: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    targetId: 'hud-header',
    title: 'LE 3.4 OP-Trainingstool (J. Rosenow M. A.)',
    description: 'Willkommen zum digitalen OP-Trainingstool für die generalistische Pflegeausbildung! Sie begleiten Frau Carola Meinhardt (67 J.) durch alle 8 Doppelstunden (DS 1–8) rund um ihre laparoskopische Cholezystektomie.',
    badge: 'Schritt 1 von 5 • Einführung'
  },
  {
    targetId: 'hud-nav-modules',
    title: 'Didaktische Modul-Navigation (DS 1 bis 8)',
    description: 'Hier steuern Sie durch die 4 Lernmodule: Modul 1 (Diagnose DS 1–2), Modul 2 (Angst vor OP DS 3–4), Modul 3 (Prä-OP DS 5–6) und Modul 4 (Post-OP DS 7–8). Neue Module schalten sich sequentiell frei, sobald Sie die vorangehenden Stationen und Praxissimulationen erfolgreich absolviert haben.',
    badge: 'Schritt 2 von 5 • Modul-Progression'
  },
  {
    targetId: 'hud-info-btn',
    title: 'Info & Curriculum (DS 1–8)',
    description: 'Über diesen Info-Button öffnen Sie jederzeit die interaktive Infotafel mit allen 8 Doppelstunden, didaktischen Lernzielen und dem Intro-Video. Auch dieses UI-Tutorial können Sie hier bei Bedarf jederzeit erneut aufrufen.',
    badge: 'Schritt 3 von 5 • Orientierung'
  },
  {
    targetId: 'hud-ai-helper',
    title: 'KI-Helfer (Virtuelle Praxisanleitung)',
    description: 'Ihr KI-Lernbegleiter ist fest in der linken Navigationsleiste verankert. Er liefert Ihnen gezielte Praxishinweise zu jedem Modul, prüft Ihre Gedanken vor Quizzes und bietet direkten Zugriff auf das vollständige Fall- und Leitliniendossier in Google NotebookLM.',
    badge: 'Schritt 4 von 5 • Assistenz'
  },
  {
    targetId: 'hud-achievements-btn',
    title: 'Erfolge & Wissensspeicher (Learning Nuggets)',
    description: 'Mit jedem absolvierten Lehrvideo, Fachartikel und Quiz schalten Sie Erfolge sowie kompakte Learning Nuggets für Ihre Fachdatenbank frei. Diese dienen Ihnen als gesicherte Nachschlagewerke für spätere Prüfungssituationen und die Simulationen.',
    badge: 'Schritt 5 von 5 • Wissenssicherung'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TrainingTutorialOverlay: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const updatePosition = useCallback(() => {
    if (!currentStep) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      const bounding = el.getBoundingClientRect();
      setRect(bounding);
    } else {
      setRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const timer1 = setTimeout(updatePosition, 50);
    const timer2 = setTimeout(updatePosition, 200);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, currentStepIndex, updatePosition]);

  if (!isOpen) return null;

  const handleNext = () => {
    playSound('pop');
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      playSound('unlock');
      onComplete();
    }
  };

  const handlePrev = () => {
    playSound('pop');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden select-none pointer-events-auto">
      {/* Dark overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-200">
        <defs>
          <mask id="tutorial-mask">
            {/* White covers entire screen */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black rectangle cuts hole for highlighted element */}
            {rect && (
              <rect
                x={Math.max(4, rect.left - 6)}
                y={Math.max(4, rect.top - 6)}
                width={rect.width + 12}
                height={rect.height + 12}
                rx="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Semi-transparent dark backdrop */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.78)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Pulsing highlight frame around target element */}
      {rect && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.max(4, rect.left - 6)}px`,
            top: `${Math.max(4, rect.top - 6)}px`,
            width: `${rect.width + 12}px`,
            height: `${rect.height + 12}px`
          }}
          className="rounded-2xl border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.55)] pointer-events-none transition-all duration-200 z-10"
        />
      )}

      {/* Floating Guidance Card */}
      <div className="fixed inset-x-4 bottom-6 md:inset-x-auto md:left-84 md:bottom-10 md:max-w-md z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-250">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-indigo-100 space-y-4">
          {/* Header with step badge */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/80">
              {currentStep.badge}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              title="Tutorial überspringen"
            >
              <span>Überspringen</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Step indicators & Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {/* Progress Dots */}
            <div className="flex items-center space-x-1.5">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStepIndex
                      ? 'w-6 bg-indigo-600'
                      : i < currentStepIndex
                      ? 'w-2 bg-indigo-300'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Next / Prev Buttons */}
            <div className="flex items-center space-x-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Zurück</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{isLast ? 'Tutorial beenden' : 'Weiter'}</span>
                {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
