import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackModalProps {
  feedback: Feedback | null;
  type: 'success' | 'warning' | 'danger' | null;
  onNext: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, type, onNext }) => {
  if (!feedback) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-emerald-500', icon: <CheckCircle className="w-8 h-8 text-emerald-600" /> };
      case 'warning':
        return { bg: 'bg-amber-500', icon: <AlertTriangle className="w-8 h-8 text-amber-600" /> };
      case 'danger':
        return { bg: 'bg-rose-500', icon: <XCircle className="w-8 h-8 text-rose-600" /> };
      default:
        return { bg: 'bg-slate-500', icon: null };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className={`p-6 flex items-center gap-4 text-white ${style.bg}`}>
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            {style.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{feedback.title}</h3>
            <p className="text-white/90 text-sm font-medium">Auswertung Ihrer Entscheidung</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-6">
            <div className={`shrink-0 w-1 rounded-full ${style.bg} opacity-50`}></div>
            <div 
              className="text-slate-700 text-lg leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: feedback.text }}
            />
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4 mb-8">
            <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
              <BookOpen className="text-teal-600 w-5 h-5" />
            </div>
            <div className="text-sm text-slate-600 mt-1">
              <span className="font-bold block text-slate-800 mb-1">Wissen to go:</span>
              <span className="italic">{feedback.source}</span>
            </div>
          </div>

          <button 
            onClick={onNext}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 transition shadow-lg flex items-center justify-center gap-2 group"
          >
            Weiter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
