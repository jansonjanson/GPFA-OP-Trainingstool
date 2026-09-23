import React, { useState, useEffect } from 'react';
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
  HelpCircle, 
  RotateCcw, 
  Stethoscope, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  Eye, 
  Droplet, 
  Pill, 
  Heart,
  Lightbulb
} from 'lucide-react';
import { 
  postOpVideos, 
  postOpPdfResources, 
  postOpQuizzes, 
  learningNuggets, 
  PostOpQuiz, 
  LearningNugget 
} from '../data/postOpCurriculumData';
import { getLocal, setLocal, unlockAchievement, StorageKeys } from '../../../src/utils/gamification';

interface DS7PostOpCurriculumViewProps {
  onStartSimulation: () => void;
  onOpenPatientRecord: () => void;
}

export const DS7PostOpCurriculumView: React.FC<DS7PostOpCurriculumViewProps> = ({
  onStartSimulation,
  onOpenPatientRecord
}) => {
  // Navigation / Tab state within DS7
  const [activeStepTab, setActiveStepTab] = useState<'overview' | 'videos' | 'readings' | 'quizzes' | 'nuggets'>('overview');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  
  // Quiz progress and answers state
  // quizId -> { answered: boolean, isCorrect: boolean, selectedOptionId?: string, selectedMultiOptionIds?: string[], clozeValues?: Record<number, string> }
  const [quizStates, setQuizStates] = useState<Record<string, {
    answered: boolean;
    isCorrect: boolean;
    selectedOptionId?: string;
    selectedMultiOptionIds?: string[];
    clozeValues?: Record<number, string>;
  }>>(() => {
    return getLocal<Record<string, any>>(StorageKeys.MODUL4_QUIZZES, {});
  });

  // Unlocked nuggets set
  const [unlockedNuggetIds, setUnlockedNuggetIds] = useState<Set<string>>(() => {
    const list = getLocal<string[]>(StorageKeys.MODUL4_NUGGETS, []);
    return new Set(list);
  });
  const [selectedNuggetModal, setSelectedNuggetModal] = useState<LearningNugget | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    setLocal(StorageKeys.MODUL4_QUIZZES, quizStates);
    const correctCount = Object.values(quizStates).filter(s => s.answered && s.isCorrect).length;
    if (correctCount >= postOpQuizzes.length && postOpQuizzes.length > 0) {
      unlockAchievement('modul4_ds7_quizzes');
    }
  }, [quizStates]);

  useEffect(() => {
    setLocal(StorageKeys.MODUL4_NUGGETS, Array.from(unlockedNuggetIds));
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
      // fallback if window not supported
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
      setUnlockedNuggetIds(prev => new Set([...prev, quiz.nuggetId]));
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
    
    // Check if exactly the correct options are selected
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
      setUnlockedNuggetIds(prev => new Set([...prev, quiz.nuggetId]));
      triggerCelebration();
    }
  };

  // Handle Cloze dropdown change
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

  // Submit Cloze
  const handleClozeSubmit = (quiz: PostOpQuiz) => {
    const currentValues = quizStates[quiz.id]?.clozeValues || {};
    let blankIndex = 0;
    let allCorrect = true;

    quiz.clozeParts?.forEach((part) => {
      if (part.type === 'blank') {
        const userVal = (currentValues[blankIndex] || '').trim();
        if (userVal !== part.value) {
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
      setUnlockedNuggetIds(prev => new Set([...prev, quiz.nuggetId]));
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
  };

  // Statistics
  const totalQuizzes = postOpQuizzes.length;
  const answeredQuizzesCount = Object.values(quizStates).filter(s => s.answered && s.isCorrect).length;
  const progressPercent = Math.round((answeredQuizzesCount / totalQuizzes) * 100);

  const currentVideo = postOpVideos[selectedVideoIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner: Module, Curriculum & Group Mode */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 shadow-xl border-b border-emerald-900/30">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Modul 4: Post-OP Pflege • 2 × 90 Minuten</span>
            </div>

            {/* Quick Action Button to Patient File */}
            <button
              onClick={onOpenPatientRecord}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Akte: Carola Meinhardt (67 J.)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Postoperative Pflege & Aufwachraum
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Willkommen in Modul 4. Nach der erfolgreichen Cholezystektomie von Frau Meinhardt 
                begleiten Sie nun die kritische Phase der Narkoseausleitung im Aufwachraum (AWR), 
                die strukturierte Übergabe an die Bettenstation und die postoperativen Prophylaxen.
              </p>
            </div>

            {/* Group Work Highlight Box */}
            <div className="bg-emerald-900/40 border-2 border-emerald-400/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg space-y-2">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Bearbeitungsmodus: Partner- & Gruppenarbeit</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Bilden Sie 2er- oder 3er-Teams. Diskutieren Sie die Fachquellen und klinischen Videos 
                gemeinsam, lösen Sie den 19-teiligen Quiz-Parcours und schalten Sie alle Learning Nuggets frei!
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-emerald-500/20 text-emerald-200">
                <span>DS 7: Theorie & Quizzes</span>
                <span className="font-bold">DS 8: OP-Simulation</span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Jump Bar */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-1">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fortschritt Quiz-Parcours (DS 7)</span>
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
                onClick={onStartSimulation}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Direkt zu DS 8: OP-Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation Tabs for DS 7 */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveStepTab('overview')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                activeStepTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>1. Ablauf & Schritte</span>
            </button>

            <button
              onClick={() => setActiveStepTab('videos')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                activeStepTab === 'videos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>2. Lehrvideos (Schritt 1-3)</span>
            </button>

            <button
              onClick={() => setActiveStepTab('readings')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                activeStepTab === 'readings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Fachtexte & PDFs (Schritt 4)</span>
            </button>

            <button
              onClick={() => setActiveStepTab('quizzes')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                activeStepTab === 'quizzes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Quiz-Parcours (Schritt 5)</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {answeredQuizzesCount}/{totalQuizzes}
              </span>
            </button>

            <button
              onClick={() => setActiveStepTab('nuggets')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                activeStepTab === 'nuggets'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>5. Learning Nuggets ({unlockedNuggetIds.size}/{totalQuizzes})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ================= TAB 1: OVERVIEW & SCHRITTE ================= */}
        {activeStepTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Mission Statement */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Didaktischer Ablauf in Modul 4 (DS 7 & DS 8)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    PFA-Kompetenzbereich: Erkennen von Warnsignalen, Schnittstellenkommunikation und Prophylaxen
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                In diesem Modul erarbeiten Sie und Ihr Partner bzw. Ihre Gruppe Schritt für Schritt alle 
                Aspekte der postoperativen Versorgung. Nutzen Sie die Videos, lesen Sie die Fachtexte 
                vollständig durch und prüfen Sie Ihr Wissen in den 19 interaktiven Quiz-Stationen. 
                Jede gelöste Station schaltet ein wertvolles <strong>Learning Nugget</strong> frei!
              </p>

              {/* Steps Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>SCHRITT 1 & 2</span>
                    <span className="bg-emerald-100 px-2 py-0.5 rounded-full">AWR & Transfer</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Verlegung in den Aufwachraum & Abholung</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sehen Sie das DIAKOVERE-Lehrvideo und lernen Sie, wie der geschützte Übergang vom OP-Tisch in die Bettenstation gelingt.
                  </p>
                  <button 
                    onClick={() => { setActiveStepTab('videos'); setSelectedVideoIndex(0); }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 pt-1"
                  >
                    <span>Zu Video 1 & 2</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-700">
                    <span>SCHRITT 3 & 4</span>
                    <span className="bg-teal-100 px-2 py-0.5 rounded-full">Station & Theorie</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Post-OP Maßnahmen & Fachliteratur</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Arbeiten Sie das Lehrvideo zu postoperativen Stationsmaßnahmen und die I Care-Kapitel (PDFs) gründlich durch.
                  </p>
                  <button 
                    onClick={() => setActiveStepTab('readings')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 pt-1"
                  >
                    <span>Zu den Fachtexten</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                    <span>SCHRITT 5 & 6</span>
                    <span className="bg-indigo-100 px-2 py-0.5 rounded-full">Quiz & Simulation</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">19 Quizzes & OP-Simulator (DS 8)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Beantworten Sie die Quizzes, inkl. DMS-Video, Schwerkraftinfusion und PCA-Pumpe. Anschliessend meistern Sie Frau Meinhardts Simulation!
                  </p>
                  <button 
                    onClick={() => setActiveStepTab('quizzes')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 pt-1"
                  >
                    <span>Zum Quiz-Parcours</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Patient Case Carola Meinhardt */}
              <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>Patientenprofil: Frau Meinhardt</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Carola Meinhardt, 67 Jahre</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zustand nach komplikationsloser laparoskopischer Cholezystektomie (LCE). 
                  Sie befindet sich aktuell im Aufwachraum. Bekannte Pflasterallergie und Penicillinallergie. 
                  Oberkiefer-Vollprothese vor OP entnommen.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={onOpenPatientRecord}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Vollständige Patientenakte öffnen</span>
                  </button>
                </div>
              </div>

              {/* Card 2: DS 8 Simulation Launch */}
              <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-3xl p-6 border border-indigo-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-800">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>DS 8: Klinischer Simulator</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">AWR-Überwachung & ISBAR-Übergabe</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interaktiver OP-Simulator mit dynamischem Vitalmonitor, Schmerzmanagement-Entscheidungen, 
                  Kittelkarten und strukturierter ISBAR-Übergabe bei akuten Kreislaufkrisen.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onStartSimulation}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Simulation starten (DS 8)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VIDEOS (SCHRITT 1 - 3) ================= */}
        {activeStepTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Schritte 1 bis 3 • Videostationen
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Vom OP-Saal über den AWR bis auf Station
                  </h2>
                </div>

                {/* Video Switcher Tabs */}
                <div className="flex flex-wrap gap-2">
                  {postOpVideos.map((vid, idx) => (
                    <button
                      key={vid.id}
                      onClick={() => setSelectedVideoIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedVideoIndex === idx
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Schritt {vid.stepNumber}: {vid.source}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Video Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Schritt {currentVideo.stepNumber} von 3
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    {currentVideo.title} ({currentVideo.source})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentVideo.description}
                  </p>
                </div>

                <a
                  href={currentVideo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer"
                  title="Video auf YouTube öffnen"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auf YouTube ansehen</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>

              {/* Responsive Embedded Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md group">
                <iframe
                  key={currentVideo.embedUrl}
                  src={currentVideo.embedUrl}
                  title={currentVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

                {/* Floating Quick Access Badge */}
                <a
                  href={currentVideo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 bg-slate-900/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-1.5 shadow-lg z-10 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current text-red-400 group-hover:text-white" />
                  <span>Auf YouTube öffnen</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Prominente Anklickbare Linkfläche zur YouTube-Weiterleitung */}
              <a
                href={currentVideo.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-red-50 via-slate-50 to-emerald-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all shadow-sm hover:shadow-md group text-left cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                          YouTube Direktlink
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {currentVideo.duration}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors mt-0.5">
                        {currentVideo.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Fokus: <strong>{currentVideo.clinicalFocus}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform flex-shrink-0">
                    <span>Im externen YouTube-Tab abspielen</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 3: READINGS & FACHTEXTE (SCHRITT 4) ================= */}
        {activeStepTab === 'readings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Schritt 4 • Fachliteratur & E-Learning PDFs
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Fachtexte zur postoperativen Pflege
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lesen Sie die folgenden Fachtexte der Lernplattform vollständig durch, um Ihr Fachwissen 
                über Aufwachraum, Verlegungskriterien, Postaggressionssyndrom und Prophylaxen zu vertiefen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postOpPdfResources.map((pdf) => (
                <div 
                  key={pdf.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {pdf.pages}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Thieme Verlag</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {pdf.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-700">
                      {pdf.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pdf.summary}
                    </p>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kerninhalte & Schwerpunkte:
                      </h4>
                      <ul className="space-y-1.5">
                        {pdf.keyTopics.map((topic, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href={pdf.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-300" />
                      <span>PDF öffnen / herunterladen</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Knowledge Excerpt Card */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-3xl p-6 border border-emerald-200 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Wichtigste Zusammenfassung aus I Care & CNE für den Quiz-Parcours</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-slate-900">AWR-Überwachung</h4>
                  <p className="leading-relaxed">
                    Gewöhnliche Verweildauer 1–2 Stunden. Rückverlegung erst bei klarem Bewusstsein, 
                    stabiler Kreislaufsituation und ausreichender Spontanatmung mit Schutzreflexen.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-slate-900">Sichere Schnittstelle</h4>
                  <p className="leading-relaxed">
                    Abholung idealerweise zu zweit mit mindestens einer examinierten Pflegefachkraft. 
                    CAVE: Hohes Risiko für Informationsverluste bei reinem Hol- und Bringdienst!
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-slate-900">Stationspflege & FAST-TRACK</h4>
                  <p className="leading-relaxed">
                    Erstkontrolle von Vitalwerten, Wundverband und Schläuchen. 30°-Oberkörperhoch- und Knielagerung. 
                    Frühmobilisation und erste Miktion als Schlüssel für den Kostaufbau.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setActiveStepTab('quizzes')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <span>Weiter zum 19-teiligen Quiz-Parcours</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: QUIZZES (SCHRITT 5) ================= */}
        {activeStepTab === 'quizzes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info & Filter */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Schritt 5 • 19 Interaktive Quiz-Stationen
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Post-OP Quiz-Parcours & Falldiagnostik
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Direktes Feedback zu Richtig und Falsch • Schaltet nachhaltig Learning Nuggets frei
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600">Filter:</span>
                  <select
                    value={quizFilter}
                    onChange={(e) => setQuizFilter(e.target.value)}
                    className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Alle 19 Fragen ({totalQuizzes})</option>
                    <option value="awr">Aufwachraum & Verlegung (Q1-Q9)</option>
                    <option value="station">Erstversorgung & Lagerung (Q10-Q12)</option>
                    <option value="monitoring">Überwachung & DMS (Q13-Q15)</option>
                    <option value="care">Mobilisation, PCA & Kost (Q16-Q19)</option>
                  </select>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">
                  Gelöste Aufgaben: <strong>{answeredQuizzesCount} / {totalQuizzes}</strong>
                </span>
                <span className="font-semibold text-emerald-700">
                  Freigeschaltete Learning Nuggets: <strong>{unlockedNuggetIds.size} / {totalQuizzes}</strong>
                </span>
              </div>
            </div>

            {/* Quizzes List */}
            <div className="space-y-6">
              {postOpQuizzes
                .filter(quiz => {
                  if (quizFilter === 'awr') return quiz.number <= 9;
                  if (quizFilter === 'station') return quiz.number >= 10 && quiz.number <= 12;
                  if (quizFilter === 'monitoring') return quiz.number >= 13 && quiz.number <= 15;
                  if (quizFilter === 'care') return quiz.number >= 16;
                  return true;
                })
                .map((quiz) => {
                  const state = quizStates[quiz.id];
                  const isAnswered = !!state?.answered;
                  const isCorrect = !!state?.isCorrect;
                  const currentNugget = learningNuggets.find(n => n.id === quiz.nuggetId);

                  return (
                    <div 
                      key={quiz.id}
                      className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all shadow-sm space-y-5 ${
                        isAnswered && isCorrect
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : isAnswered && !isCorrect
                          ? 'border-rose-300 bg-rose-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Quiz Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isAnswered && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isAnswered && !isCorrect
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {quiz.number}
                          </span>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {quiz.type === 'single_choice' && 'Einfachauswahl (Single Choice)'}
                              {quiz.type === 'multiple_choice' && 'Mehrfachauswahl (Multiple Choice)'}
                              {quiz.type === 'cloze' && 'Lückentext (Fachbegriffe)'}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                              {quiz.title}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isAnswered && (
                          <div className="flex items-center space-x-2">
                            {isCorrect ? (
                              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Richtig gelöst</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                                <XCircle className="w-4 h-4 text-rose-600" />
                                <span>Überarbeiten</span>
                              </span>
                            )}
                            <button
                              onClick={() => handleResetQuiz(quiz.id)}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                              title="Frage zurücksetzen"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                        {quiz.question}
                      </p>

                      {/* ================= QUIZ TYPE: CLOZE ================= */}
                      {quiz.type === 'cloze' && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                          <div className="text-sm text-slate-800 leading-loose flex flex-wrap items-center gap-1.5">
                            {quiz.clozeParts?.map((part, pIdx) => {
                              if (part.type === 'text') {
                                return <span key={pIdx}>{part.value}</span>;
                              }
                              // Blank dropdown
                              const userVal = state?.clozeValues?.[pIdx] || '';
                              return (
                                <select
                                  key={pIdx}
                                  value={userVal}
                                  onChange={(e) => handleClozeChange(quiz.id, pIdx, e.target.value)}
                                  className="bg-white border-2 border-slate-300 font-semibold text-emerald-900 rounded-xl px-2.5 py-1 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                            <button
                              onClick={() => handleClozeSubmit(quiz)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              Lösung prüfen
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ================= QUIZ TYPE: SINGLE CHOICE ================= */}
                      {quiz.type === 'single_choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {quiz.options?.map((option) => {
                            const isSelected = state?.selectedOptionId === option.id;
                            return (
                              <button
                                key={option.id}
                                onClick={() => handleSingleChoiceSelect(quiz, option.id)}
                                className={`p-4 rounded-2xl text-left text-xs font-medium transition-all border-2 flex items-start space-x-3 cursor-pointer ${
                                  isSelected
                                    ? option.isCorrect
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                                      : 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                }`}
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
                            {quiz.options?.map((option) => {
                              const isChecked = (state?.selectedMultiOptionIds || []).includes(option.id);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handleMultiChoiceToggle(quiz.id, option.id)}
                                  className={`p-4 rounded-2xl text-left text-xs font-medium transition-all border-2 flex items-start space-x-3 cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-sm'
                                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                                    isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'
                                  }`}>
                                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </div>
                                  <span>{option.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => handleMultiChoiceSubmit(quiz)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              Auswahl überprüfen
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Special Media in Quiz (DMS Video, PCA Video, Tip Box) */}
                      {quiz.specialMedia && (
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            <span>{quiz.specialMedia.title}</span>
                          </div>
                          <p className="text-xs text-amber-950 leading-relaxed">
                            {quiz.specialMedia.content}
                          </p>

                          {quiz.specialMedia.videoUrl && (
                            <div className="space-y-2 pt-1">
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
                                <span>Erklärvideo direkt auf YouTube öffnen</span>
                                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                              </a>
                            </div>
                          )}
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
                              <p className="font-bold">{isCorrect ? 'Erklärung & Begründung:' : 'Fachlicher Hinweis:'}</p>
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
          </div>
        )}

        {/* ================= TAB 5: LEARNING NUGGETS ================= */}
        {activeStepTab === 'nuggets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Wissensarchiv • 19 Fachkarten
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Freigeschaltete Learning Nuggets
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Jedes Nugget repräsentiert einen Kernstandard aus den Fachquellen I Care und CNE. 
                Sie haben bereits <strong>{unlockedNuggetIds.size} von {totalQuizzes}</strong> Nuggets freigeschaltet.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {learningNuggets.map((nugget) => {
                const isUnlocked = unlockedNuggetIds.has(nugget.id);

                return (
                  <div
                    key={nugget.id}
                    onClick={() => isUnlocked && setSelectedNuggetModal(nugget)}
                    className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
                      isUnlocked
                        ? 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md cursor-pointer'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          Nugget #{nugget.number} • {nugget.category}
                        </span>
                        {isUnlocked ? (
                          <Award className="w-4 h-4 text-amber-500" />
                        ) : (
                          <span className="text-xs text-slate-400">Gesperrt</span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {nugget.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {isUnlocked 
                          ? nugget.summary 
                          : 'Lösen Sie das entsprechende Quiz im Parcours, um dieses Learning Nugget freizuschalten.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {nugget.reference}
                      </span>
                      {isUnlocked && (
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Learning Nugget Detail Modal */}
      {selectedNuggetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Learning Nugget #{selectedNuggetModal.number} • {selectedNuggetModal.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedNuggetModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNuggetModal(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Definition & Zusammenfassung
                </h4>
                <p>{selectedNuggetModal.summary}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Klinische Kernaspekte & Standards:
                </h4>
                <ul className="space-y-2">
                  {selectedNuggetModal.corePoints.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-1">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Praxistipp für die PFA:</span>
                </h4>
                <p className="text-emerald-950 leading-relaxed">
                  {selectedNuggetModal.clinicalTip}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2">
                <strong>Fachquelle:</strong> {selectedNuggetModal.reference}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNuggetModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
