import React, { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

export interface TutorialStep {
  targetId: string;
  title: string;
  text: string;
}

interface InteractiveTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<InteractiveTutorialProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const step = steps[currentStep];
      const el = document.getElementById(step.targetId);
      if (el) {
        setRect(el.getBoundingClientRect());
        // Scroll smoothly into view if mostly hidden
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    // Timeout to catch layout shifts
    const timeout = setTimeout(updateRect, 400); 
    
    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timeout);
    };
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const isTop = rect ? rect.top > window.innerHeight / 2 : false;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
      {/* Spotlight SVG Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" preserveAspectRatio="none">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect 
                style={{
                  x: rect.left - 12,
                  y: rect.top - 12,
                  width: rect.width + 24,
                  height: rect.height + 24,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                rx="16" 
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(15, 23, 42, 0.85)" mask="url(#spotlight-mask)" />
      </svg>

      {/* Tooltip Dialog */}
      <div 
        className={`absolute z-[1001] w-full max-w-sm px-4 transition-all duration-500 pointer-events-auto ${
          isTop ? 'top-8 md:top-12' : 'bottom-8 md:bottom-12'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-6 relative">
          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            title="Tutorial überspringen"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2">
            Tutorial {currentStep + 1} / {steps.length}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{step.text}</p>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={onComplete}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Überspringen
            </button>
            <button 
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-sm"
            >
              {currentStep < steps.length - 1 ? 'Weiter' : 'Starten'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
