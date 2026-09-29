import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Video, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ExternalLink, 
  FileText, 
  Award, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  ArrowDown, 
  RotateCcw, 
  Stethoscope, 
  Activity, 
  ChevronRight, 
  Lightbulb,
  Maximize2
} from 'lucide-react';
import { 
  postOpVideos, 
  postOpPdfResources, 
  postOpQuizzes, 
  learningNuggets, 
  PostOpQuiz, 
  LearningNugget 
} from '../data/postOpCurriculumData';
import { getLocal, setLocal, unlockAchievement, notifyNuggetUnlocked, StorageKeys } from '../../../src/utils/gamification';
import { playSound } from '../utils/audio';

interface DS7PostOpCurriculumViewProps {
  onStartSimulation: () => void;
  onOpenPatientRecord: () => void;
}

export const DS7PostOpCurriculumView: React.FC<DS7PostOpCurriculumViewProps> = ({
  onStartSimulation,
  onOpenPatientRecord
}) => {
  // Step confirmations state (6 steps)
  const [step1Done, setStep1Done] = useState<boolean>(() => getLocal<boolean>('gpfa_m4_step1', false));
  const [step2Done, setStep2Done] = useState<boolean>(() => getLocal<boolean>('gpfa_m4_step2', false));
  const [step3Done, setStep3Done] = useState<boolean>(() => getLocal<boolean>('gpfa_m4_step3', false));
  const [step4Done, setStep4Done] = useState<boolean>(() => getLocal<boolean>('gpfa_m4_step4', false));

  // Gamification notification state
  const [gamificationToast, setGamificationToast] = useState<{
    title: string;
    desc: string;
    xp: number;
    step: number;
  } | null>(null);

  // Auto-close gamification toast
  useEffect(() => {
    if (gamificationToast) {
      const timer = setTimeout(() => setGamificationToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [gamificationToast]);

  // Handle step confirmations with celebratory sound and gamification toast
  const handleConfirmStep1 = () => {
    setStep1Done(true);
    playSound('unlock');
    try {
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.8, x: 0.85 } });
    } catch (e) {}
    setGamificationToast({
      title: '🎉 Schritt 1 gesichert! (+50 XP)',
      desc: 'Video 1 erfolgreich absolviert: Post-OP Grundlagen & Aufwachraum verinnerlicht.',
      xp: 50,
      step: 1
    });
    setTimeout(() => {
      document.getElementById('postop-step-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  const handleConfirmStep2 = () => {
    setStep2Done(true);
    playSound('unlock');
    try {
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.8, x: 0.85 } });
    } catch (e) {}
    setGamificationToast({
      title: '🎉 Schritt 2 gesichert! (+50 XP)',
      desc: 'Video 2 erfolgreich absolviert: Abholkriterien & AWR-Schnittstelle gemeistert.',
      xp: 50,
      step: 2
    });
    setTimeout(() => {
      document.getElementById('postop-step-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  const handleConfirmStep3 = () => {
    setStep3Done(true);
    playSound('unlock');
    try {
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.8, x: 0.85 } });
    } catch (e) {}
    setGamificationToast({
      title: '🎉 Schritt 3 gesichert! (+50 XP)',
      desc: 'Video 3 erfolgreich absolviert: Pflegemaßnahmen & Überwachung auf Station gesichert.',
      xp: 50,
      step: 3
    });
    setTimeout(() => {
      document.getElementById('postop-step-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  const handleConfirmStep4 = () => {
    setStep4Done(true);
    playSound('unlock');
    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.8, x: 0.85 } });
    } catch (e) {}
    setGamificationToast({
      title: '🏆 Schritt 4 gesichert! (+100 XP)',
      desc: 'I Care Fachtext vollständig durchgearbeitet. Schritt 5 (Quiz-Parcours) ist jetzt freigegeben!',
      xp: 100,
      step: 4
    });
    setTimeout(() => {
      document.getElementById('postop-step-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  // Auto-scroll to top on mount and reset listener
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const handleGlobalReset = () => {
      setStep1Done(false);
      setStep2Done(false);
      setStep3Done(false);
      setStep4Done(false);
      setQuizStates({});
    };

    window.addEventListener('storage', handleGlobalReset);
    window.addEventListener('gpfa_global_reset', handleGlobalReset);
    return () => {
      window.removeEventListener('storage', handleGlobalReset);
      window.removeEventListener('gpfa_global_reset', handleGlobalReset);
    };
  }, []);

  // Sync step confirmations
  useEffect(() => {
    setLocal('gpfa_m4_step1', step1Done);
  }, [step1Done]);
  useEffect(() => {
    setLocal('gpfa_m4_step2', step2Done);
  }, [step2Done]);
  useEffect(() => {
    setLocal('gpfa_m4_step3', step3Done);
  }, [step3Done]);
  useEffect(() => {
    setLocal('gpfa_m4_step4', step4Done);
  }, [step4Done]);

  // Quiz progress and answers state
  const [quizStates, setQuizStates] = useState<Record<string, {
    answered: boolean;
    isCorrect: boolean;
    selectedOptionId?: string;
    selectedMultiOptionIds?: string[];
    clozeValues?: Record<number, string>;
  }>>(() => {
    return getLocal<Record<string, any>>(StorageKeys.MODUL4_QUIZZES, {});
  });

  // BUGFIX FREISCHALTUNG:
  // Derive unlocked nuggets STRICTLY from quizzes that have been answered correctly!
  // If zero quizzes are answered, exactly 0 are unlocked (no automatic 19/19).
  const unlockedNuggetIds = useMemo(() => {
    const set = new Set<string>();
    postOpQuizzes.forEach(q => {
      if (quizStates[q.id]?.answered && quizStates[q.id]?.isCorrect) {
        set.add(q.nuggetId);
      }
    });
    return set;
  }, [quizStates]);

  const [selectedNuggetModal, setSelectedNuggetModal] = useState<LearningNugget | null>(null);
  const [shuffleSeeds, setShuffleSeeds] = useState<Record<string, number>>({});

  const getShuffledOptions = useCallback((quiz: PostOpQuiz) => {
    if (!quiz.options) return [];
    const seed = shuffleSeeds[quiz.id] || 0;
    const copy = [...quiz.options];
    for (let i = copy.length - 1; i > 0; i--) {
      const pseudo = Math.abs(Math.sin((seed + 1) * 9973 + (i + 1) * 31 + quiz.id.length * 7)) * 10000;
      const j = Math.floor((pseudo - Math.floor(pseudo)) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [shuffleSeeds]);

  // Sync quizStates with localStorage
  useEffect(() => {
    setLocal(StorageKeys.MODUL4_QUIZZES, quizStates);
    const correctCount = Object.values(quizStates).filter(s => s.answered && s.isCorrect).length;
    if (correctCount >= postOpQuizzes.length && postOpQuizzes.length > 0) {
      unlockAchievement('modul4_ds7_quizzes');
    }
  }, [quizStates]);

  // Listen to global reset
  useEffect(() => {
    const handleGlobalReset = () => {
      setQuizStates({});
      setShuffleSeeds({});
      setStep1Done(false);
      setStep2Done(false);
      setStep3Done(false);
      setStep4Done(false);
    };
    window.addEventListener('storage', handleGlobalReset);
    window.addEventListener('gpfa_global_reset', handleGlobalReset);
    return () => {
      window.removeEventListener('storage', handleGlobalReset);
      window.removeEventListener('gpfa_global_reset', handleGlobalReset);
    };
  }, []);

  const isFirstMountRef = React.useRef(true);
  const prevUnlockedNuggetsRef = React.useRef<Set<string>>(
    new Set(getLocal<string[]>(StorageKeys.MODUL4_NUGGETS, []))
  );

  useEffect(() => {
    setLocal(StorageKeys.MODUL4_NUGGETS, Array.from(unlockedNuggetIds));

    // On first mount, initialize ref to current unlocked IDs without firing notifications
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevUnlockedNuggetsRef.current = new Set(unlockedNuggetIds);
      return;
    }

    // Check for newly unlocked nuggets to notify
    unlockedNuggetIds.forEach(id => {
      if (!prevUnlockedNuggetsRef.current.has(id)) {
        prevUnlockedNuggetsRef.current.add(id);
        const nugget = learningNuggets.find(n => n.id === id);
        notifyNuggetUnlocked({
          id,
          title: nugget?.title || `Station ${id.replace('nugget_', '')}`,
          moduleNumber: 4,
          moduleName: 'Modul 4: Postoperative Pflege & AWR',
          category: nugget?.category || 'Postoperative Pflege'
        });
      }
    });
  }, [unlockedNuggetIds]);

  // Category filter for quizzes
  const [quizFilter, setQuizFilter] = useState<string>('all');

  // Trigger confetti effect
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  // Handle Single Choice selection
  const handleSingleChoiceSelect = (quiz: PostOpQuiz, optionId: string) => {
    const isCorrect = quiz.options?.find(o => o.id === optionId)?.isCorrect || false;
    
    setQuizStates(prev => ({
      ...prev,
      [quiz.id]: {
        answered: true,
        isCorrect,
        selectedOptionId: optionId
      }
    }));

    if (isCorrect) {
      triggerCelebration();
    }
  };

  // Handle Multiple Choice toggle
  const handleMultiChoiceToggle = (quizId: string, optionId: string) => {
    setQuizStates(prev => {
      const current = prev[quizId]?.selectedMultiOptionIds || [];
      const updated = current.includes(optionId) 
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      
      return {
        ...prev,
        [quizId]: {
          ...prev[quizId],
          answered: false,
          isCorrect: false,
          selectedMultiOptionIds: updated
        }
      };
    });
  };

  // Submit Multiple Choice
  const handleMultiChoiceSubmit = (quiz: PostOpQuiz) => {
    const selected = quizStates[quiz.id]?.selectedMultiOptionIds || [];
    const correctOptions = quiz.options?.filter(o => o.isCorrect).map(o => o.id) || [];
    
    const isCorrect = 
      selected.length === correctOptions.length &&
      selected.every(id => correctOptions.includes(id));

    setQuizStates(prev => ({
      ...prev,
      [quiz.id]: {
        ...prev[quiz.id],
        answered: true,
        isCorrect
      }
    }));

    if (isCorrect) {
      triggerCelebration();
    }
  };

  // Handle Cloze dropdown changes
  const handleClozeChange = (quizId: string, blankIndex: number, value: string) => {
    setQuizStates(prev => {
      const currentValues = prev[quizId]?.clozeValues || {};
      return {
        ...prev,
        [quizId]: {
          ...prev[quizId],
          answered: false,
          isCorrect: false,
          clozeValues: {
            ...currentValues,
            [blankIndex]: value
          }
        }
      };
    });
  };

  // BUGFIX FRAGE 1, 12, 17:
  // Validate cloze blanks consistently by blankIndex, case-insensitive and trimmed.
  const handleClozeSubmit = (quiz: PostOpQuiz) => {
    const currentValues = quizStates[quiz.id]?.clozeValues || {};
    let blankIndex = 0;
    let allCorrect = true;

    quiz.clozeParts?.forEach((part) => {
      if (part.type === 'blank') {
        const userVal = (currentValues[blankIndex] || '').trim().toLowerCase();
        const targetVal = part.value.trim().toLowerCase();
        if (!userVal || userVal !== targetVal) {
          allCorrect = false;
        }
        blankIndex++;
      }
    });

    setQuizStates(prev => ({
      ...prev,
      [quiz.id]: {
        ...prev[quiz.id],
        answered: true,
        isCorrect: allCorrect
      }
    }));

    if (allCorrect) {
      triggerCelebration();
    }
  };

  // Reset a single quiz
  const handleResetQuiz = (quizId: string) => {
    setQuizStates(prev => {
      const next = { ...prev };
      delete next[quizId];
      return next;
    });
    setShuffleSeeds(prev => ({ ...prev, [quizId]: (prev[quizId] || 0) + 1 }));
  };

  const totalQuizzes = postOpQuizzes.length;
  const answeredQuizzesCount = Object.values(quizStates).filter(s => s.answered && s.isCorrect).length;
  const progressPercent = Math.round((answeredQuizzesCount / totalQuizzes) * 100);

  // Filtered quizzes
  const filteredQuizzes = postOpQuizzes.filter(quiz => {
    if (quizFilter === 'station1_5') return quiz.number >= 1 && quiz.number <= 5;
    if (quizFilter === 'station6_10') return quiz.number >= 6 && quiz.number <= 10;
    if (quizFilter === 'station11_15') return quiz.number >= 11 && quiz.number <= 15;
    if (quizFilter === 'station16_19') return quiz.number >= 16 && quiz.number <= 19;
    return true;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Banner: Module, Curriculum & Group Mode */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 shadow-xl border-b border-emerald-900/30">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Modul 4: Post-OP Pflege • 2 × 90 Minuten (DS 7 & DS 8)</span>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Postoperative Pflege & Aufwachraum
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed">
              Nach der erfolgreichen Cholezystektomie von Frau Meinhardt begleiten Sie nun 
              die strukturierte Narkoseausleitung im Aufwachraum (AWR), 
              die professionelle Übergabe an die Bettenstation und die postoperativen Prophylaxen.
            </p>
          </div>

          {/* Quick Progress Bar */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-1">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fortschritt Quiz-Parcours (Schritt 5)</span>
                </span>
                <span className="font-bold text-emerald-400">
                  {answeredQuizzesCount} von {totalQuizzes} gelöst ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 via-emerald-400 to-green-400 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  onStartSimulation();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Direkt zu DS 8: OP-Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - 6 Sequential Steps (matching Modul 3 didactic UI logic) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* ================= SCHRITT 1 ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Schritt 1 • Lehrvideo Narkose & Aufwachraum
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {postOpVideos[0].title}
                </h2>
              </div>
            </div>

            <a
              href={postOpVideos[0].externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auf YouTube ansehen</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {postOpVideos[0].description}
          </p>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <strong>Klinischer Fokus:</strong> {postOpVideos[0].clinicalFocus} • Dauer: {postOpVideos[0].duration}
          </div>

          {/* Direct Embedded Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
            <iframe
              src={postOpVideos[0].embedUrl}
              title={postOpVideos[0].title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>

          {/* Action Confirmation Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Ansehen des Lehrvideos, um strukturiert zum nächsten Schritt zu gelangen.
            </div>
            <button
              onClick={handleConfirmStep1}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step1Done
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step1Done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Video className="w-4 h-4" />}
              <span>{step1Done ? 'Schritt 1 gesichert: Video 1 angesehen' : 'Schritt 1 bestätigen: Video 1 angesehen'}</span>
            </button>
          </div>
        </section>

        {/* Step Connector */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="h-6 w-0.5 bg-emerald-300"></div>
          <div className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-xs flex items-center space-x-1.5 my-1">
            <span>Weiter zu Schritt 2: Abholung aus dem Aufwachraum</span>
            <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="h-6 w-0.5 bg-emerald-300"></div>
        </div>

        {/* ================= SCHRITT 2 ================= */}
        <section id="postop-step-2" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  Schritt 2 • Lehrvideo Abholung & Schnittstelle AWR / Station
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {postOpVideos[1].title}
                </h2>
              </div>
            </div>

            <a
              href={postOpVideos[1].externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auf YouTube ansehen</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {postOpVideos[1].description}
          </p>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <strong>Klinischer Fokus:</strong> {postOpVideos[1].clinicalFocus} • Dauer: {postOpVideos[1].duration}
          </div>

          {/* Direct Embedded Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
            <iframe
              src={postOpVideos[1].embedUrl}
              title={postOpVideos[1].title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>

          {/* Action Confirmation Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Lehrvideo zur Abholung aus dem Aufwachraum.
            </div>
            <button
              onClick={handleConfirmStep2}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step2Done
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step2Done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Video className="w-4 h-4" />}
              <span>{step2Done ? 'Schritt 2 gesichert: Video 2 angesehen' : 'Schritt 2 bestätigen: Video 2 angesehen'}</span>
            </button>
          </div>
        </section>

        {/* Step Connector */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="h-6 w-0.5 bg-teal-300"></div>
          <div className="px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-200 shadow-xs flex items-center space-x-1.5 my-1">
            <span>Weiter zu Schritt 3: Post-OP Stationsmaßnahmen</span>
            <ArrowDown className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="h-6 w-0.5 bg-teal-300"></div>
        </div>

        {/* ================= SCHRITT 3 ================= */}
        <section id="postop-step-3" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                  Schritt 3 • Lehrvideo Post-OP Maßnahmen auf Station
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {postOpVideos[2].title}
                </h2>
              </div>
            </div>

            <a
              href={postOpVideos[2].externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auf YouTube ansehen</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {postOpVideos[2].description}
          </p>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <strong>Klinischer Fokus:</strong> {postOpVideos[2].clinicalFocus} • Dauer: {postOpVideos[2].duration}
          </div>

          {/* Direct Embedded Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
            <iframe
              src={postOpVideos[2].embedUrl}
              title={postOpVideos[2].title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>

          {/* Action Confirmation Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Video zu postoperativen Stationsmaßnahmen.
            </div>
            <button
              onClick={handleConfirmStep3}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step3Done
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step3Done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Video className="w-4 h-4" />}
              <span>{step3Done ? 'Schritt 3 gesichert: Video 3 angesehen' : 'Schritt 3 bestätigen: Video 3 angesehen'}</span>
            </button>
          </div>
        </section>

        {/* Step Connector */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="h-6 w-0.5 bg-blue-300"></div>
          <div className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 shadow-xs flex items-center space-x-1.5 my-1">
            <span>Weiter zu Schritt 4: Fachtext I Care Post-OP</span>
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="h-6 w-0.5 bg-blue-300"></div>
        </div>

        {/* ================= SCHRITT 4 ================= */}
        {/* Sole post-op source: "I care prä operative Pflege" removed completely */}
        <section id="postop-step-4" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Schritt 4 • Fachliteratur & Standard
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {postOpPdfResources[0].title}
                </h2>
              </div>
            </div>

            <a
              href={postOpPdfResources[0].downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
            >
              <FileText className="w-4 h-4" />
              <span>Original-PDF herunterladen</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <div className="bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider block">
              Arbeitsauftrag:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              Bitte lesen Sie sich den gesamten Fachtext (Kapitel 39.4, S. 809–813) vollständig durch. Nutzen Sie dazu den oben bereitgestellten Download des Original-Kapitels. Das Wissen benötigen Sie zur Bearbeitung der folgenden 19 Quizfragen in Schritt 5.
            </p>
          </div>

          {/* Action Confirmation Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Durcharbeiten des I Care Post-OP Fachstandards.
            </div>
            <button
              onClick={handleConfirmStep4}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step4Done
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step4Done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4" />}
              <span>{step4Done ? 'Schritt 4 gesichert: Fachtext durchgearbeitet' : 'Schritt 4 bestätigen: Fachtext gelesen'}</span>
            </button>
          </div>
        </section>

        {/* Step Connector */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="h-6 w-0.5 bg-indigo-300"></div>
          <div className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200 shadow-xs flex items-center space-x-1.5 my-1">
            <span>Weiter zu Schritt 5: Interaktiver Quiz-Parcours</span>
            <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="h-6 w-0.5 bg-indigo-300"></div>
        </div>

        {/* ================= SCHRITT 5: 19 INTERAKTIVE QUIZ-STATIONEN ================= */}
        <section className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  5
                </span>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Schritt 5 • 19 Interaktive Quiz-Stationen
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    Post-OP Quiz-Parcours & Falldiagnostik
                  </h2>
                </div>
              </div>

              {/* Station Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">Filter:</span>
                <select
                  value={quizFilter}
                  onChange={(e) => setQuizFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Alle 19 Fragen ({totalQuizzes})</option>
                  <option value="station1_5">Stationen 1–5 (Grundlagen & AWR)</option>
                  <option value="station6_10">Stationen 6–10 (Komplikationen & Übergabe)</option>
                  <option value="station11_15">Stationen 11–15 (Positionierung, DMS & Monitor)</option>
                  <option value="station16_19">Stationen 16–19 (Mobilisation, PCA & Kost)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Gelöste Aufgaben: <strong>{answeredQuizzesCount} / {totalQuizzes}</strong>
              </div>
              <div>
                Freigeschaltete Learning Nuggets: <strong>{unlockedNuggetIds.size} / {totalQuizzes}</strong>
              </div>
            </div>
          </div>

          {/* Quizzes List */}
          <div className="space-y-6">
            {filteredQuizzes.map((quiz) => {
              const state = quizStates[quiz.id];
              const isAnswered = !!state?.answered;
              const isCorrect = !!state?.isCorrect;
              const currentNugget = learningNuggets.find(n => n.id === quiz.nuggetId);

              return (
                <div
                  key={quiz.id}
                  id={`quiz-${quiz.id}`}
                  className={`rounded-3xl p-6 sm:p-8 border-2 transition-all space-y-5 shadow-sm ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 border-emerald-400 shadow-emerald-500/10'
                        : 'bg-gradient-to-br from-white via-rose-50/40 to-amber-50/30 border-rose-300 shadow-rose-500/10'
                      : 'bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/20 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  {/* Quiz Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                        isAnswered
                          ? isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{quiz.number}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {quiz.type === 'single_choice' && 'Single Choice (1 Antwort)'}
                          {quiz.type === 'multiple_choice' && 'Multiple Choice (Mehrfachauswahl)'}
                          {quiz.type === 'cloze' && 'Lückentext (Fachbegriffe)'}
                        </span>
                        <h3 className="font-bold text-base text-slate-900">
                          {quiz.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isAnswered && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Gelöst' : 'Überprüfen'}
                        </span>
                      )}
                      <button
                        onClick={() => handleResetQuiz(quiz.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        title="Quiz zurücksetzen"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* REIHENFOLGE-FIX: FRAGE 15 & 17 -> Zuerst muss das Video eingeblendet/angesehen werden, erst darunter darf die Frage erscheinen! */}
                  {quiz.specialMedia && quiz.specialMedia.type === 'video' && quiz.specialMedia.videoUrl && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                      <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <Video className="w-4 h-4 text-amber-600" />
                        <span>Erklärvideo zuerst ansehen: {quiz.specialMedia.title}</span>
                      </div>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        {quiz.specialMedia.content}
                      </p>
                      <div className="relative aspect-video max-w-lg rounded-xl overflow-hidden shadow-sm bg-slate-900">
                        <iframe
                          src={quiz.specialMedia.videoUrl}
                          title={quiz.specialMedia.title}
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                      <a
                        href={quiz.specialMedia.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Video auf YouTube öffnen</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {quiz.question}
                    </p>
                  </div>

                  {/* BILD-EINBINDUNG: FRAGE 14 -> Bild NACH der Fragestellung einbinden */}
                  {quiz.imageUrl && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>{quiz.imageAlt || 'Klinische Fachabbildung'}</span>
                        </span>
                        {quiz.imageSourceUrl && (
                          <a
                            href={quiz.imageSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <span>Großansicht öffnen</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-white max-w-2xl mx-auto shadow-md p-1.5 flex items-center justify-center">
                        <img
                          src={quiz.imageUrl}
                          alt={quiz.imageAlt || 'Abbildung Beobachtungskategorien'}
                          className="w-full h-auto object-contain max-h-[460px] rounded-lg"
                          loading="eager"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.triedFallback) {
                              target.dataset.triedFallback = 'true';
                              target.src = 'https://raw.githubusercontent.com/jansonjanson/GPFA-OP-Trainingstool/main/ICare%20Abb%20Beobachtungskategorien.JPG';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ================= QUIZ TYPE: CLOZE ================= */}
                  {quiz.type === 'cloze' && (() => {
                    let blankCounter = 0;
                    return (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="text-sm text-slate-800 leading-loose flex flex-wrap items-center gap-1.5">
                          {quiz.clozeParts?.map((part, pIdx) => {
                            if (part.type === 'text') {
                              return <span key={pIdx}>{part.value}</span>;
                            }
                            const currentBlankIdx = blankCounter++;
                            const userVal = state?.clozeValues?.[currentBlankIdx] || '';
                            const isCorrectBlank = userVal.trim().toLowerCase() === part.value.trim().toLowerCase();

                            let selectStyle = "border-slate-300 bg-white text-slate-900";
                            if (isAnswered) {
                              selectStyle = isCorrectBlank 
                                ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs" 
                                : "border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-xs";
                            }

                            return (
                              <select
                                key={pIdx}
                                value={userVal}
                                disabled={isAnswered}
                                onChange={(e) => handleClozeChange(quiz.id, currentBlankIdx, e.target.value)}
                                className={`font-semibold rounded-xl px-2.5 py-1 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${selectStyle}`}
                              >
                                <option value="">-- Begriff wählen --</option>
                                {part.options?.map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            );
                          })}
                        </div>

                        <div className="flex justify-end pt-2">
                          {!isAnswered ? (
                            <button
                              onClick={() => handleClozeSubmit(quiz)}
                              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md ring-4 ring-amber-300 animate-pulse transition-all cursor-pointer"
                            >
                              Lösung prüfen
                            </button>
                          ) : (
                            <button
                              onClick={() => handleResetQuiz(quiz.id)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Erneut bearbeiten</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ================= QUIZ TYPE: SINGLE CHOICE ================= */}
                  {quiz.type === 'single_choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getShuffledOptions(quiz).map((option) => {
                         const isSelected = state?.selectedOptionId === option.id;
                         let optionStyle = "bg-white hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs";

                         if (isAnswered) {
                           if (isSelected) {
                             optionStyle = option.isCorrect
                               ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-300"
                               : "bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold shadow-sm ring-2 ring-rose-300";
                           } else if (option.isCorrect) {
                             optionStyle = "bg-emerald-50/90 border-2 border-dashed border-emerald-400 text-emerald-900 font-semibold";
                           } else {
                             optionStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                           }
                         }

                         return (
                           <button
                             key={option.id}
                             disabled={isAnswered}
                             onClick={() => handleSingleChoiceSelect(quiz, option.id)}
                             className={`p-4 rounded-2xl text-left text-xs font-medium transition-all border flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                           >
                             <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                               isSelected
                                 ? option.isCorrect
                                   ? 'border-emerald-600 bg-emerald-600'
                                   : 'border-rose-600 bg-rose-600'
                                 : 'border-slate-400'
                             }`}>
                               {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                             </span>
                             <span>{option.text}</span>
                           </button>
                         );
                       })}
                    </div>
                  )}

                  {/* ================= QUIZ TYPE: MULTIPLE CHOICE ================= */}
                  {quiz.type === 'multiple_choice' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {getShuffledOptions(quiz).map((option) => {
                          const isChecked = (state?.selectedMultiOptionIds || []).includes(option.id);
                          let optionStyle = "bg-white hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs";

                          if (isAnswered) {
                            if (isChecked) {
                              optionStyle = option.isCorrect
                                ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-300"
                                : "bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold shadow-sm ring-2 ring-rose-300";
                            } else if (option.isCorrect) {
                              optionStyle = "bg-emerald-50/90 border-2 border-dashed border-emerald-400 text-emerald-900 font-semibold";
                            } else {
                              optionStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                            }
                          } else if (isChecked) {
                            optionStyle = "bg-indigo-50/90 border-2 border-indigo-500 text-indigo-950 font-semibold shadow-xs";
                          }

                          return (
                            <button
                              key={option.id}
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handleMultiChoiceToggle(quiz.id, option.id)}
                              className={`p-4 rounded-2xl text-left text-xs font-medium transition-all border flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                                isChecked
                                  ? isAnswered
                                    ? option.isCorrect ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-rose-600 bg-rose-600 text-white'
                                    : 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-slate-400'
                              }`}>
                                {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <span>{option.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-2">
                        {!isAnswered ? (
                          <button
                            onClick={() => handleMultiChoiceSubmit(quiz)}
                            disabled={(state?.selectedMultiOptionIds || []).length === 0}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl shadow-md ring-4 ring-amber-300 animate-pulse transition-all cursor-pointer"
                          >
                            Auswahl überprüfen
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetQuiz(quiz.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Erneut bearbeiten</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Tip Box (for tips that aren't videos) */}
                  {quiz.specialMedia && quiz.specialMedia.type === 'tip' && (
                    <div className="mt-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>{quiz.specialMedia.title}</span>
                      </div>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        {quiz.specialMedia.content}
                      </p>
                    </div>
                  )}

                  {/* Explanation & Learning Nugget Unlock Feedback */}
                  {isAnswered && (
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                      isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-rose-50 border border-rose-200 text-rose-950'
                    }`}>
                      <div className="flex items-start space-x-2 font-semibold">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{isCorrect ? 'Richtig gelöst!' : 'Fachlicher Hinweis:'}</p>
                          <p className="mt-0.5">{quiz.explanation}</p>
                        </div>
                      </div>

                      {/* Nugget Unlock Badge */}
                      {isCorrect && currentNugget && (
                        <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Learning Nugget #{currentNugget.number} freigeschaltet!</span>
                          </span>
                          <button
                            onClick={() => setSelectedNuggetModal(currentNugget)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                          >
                            Nugget ansehen
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DIREKTER WEITERLEITUNGS-BUTTON ZUR SIMULATION UNTER DEM QUIZ (Ohne Scrollen) */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Schritt 5 gemeistert • Bereit für den Ernstfall?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Direkt zur interaktiven OP-Simulation (DS 8)
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              Klicken Sie hier, um ohne langes Scrollen sofort in Frau Meinhardts Aufwachraum-Szenario zu starten.
            </p>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                onStartSimulation();
              }}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl ring-4 ring-amber-300 animate-pulse transition-all flex items-center space-x-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Simulation jetzt starten (DS 8)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

      </main>

      {/* Gamification Notification Toast */}
      {gamificationToast && (
        <div className="fixed bottom-6 right-6 z-[300] max-w-md w-[calc(100%-3rem)] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-start space-x-3.5 relative">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  +{gamificationToast.xp} XP • Schritt {gamificationToast.step} gesichert
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {gamificationToast.title}
              </h4>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {gamificationToast.desc}
              </p>
            </div>
            <button
              onClick={() => setGamificationToast(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Wegklicken"
            >
              <XCircle className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
