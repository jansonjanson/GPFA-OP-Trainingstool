import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  User, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Eye, 
  Sparkles, 
  ClipboardList, 
  Heart, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { anamneseSteps, sonographieResult } from '../data/praxisSimulationData';
import { AnamneseChoice } from '../types';
import { playSound } from '../../modul_angst/utils/audio';
import { unlockAchievement } from '../../utils/gamification';

interface Props {
  onBackToTheorie: () => void;
  onGoToModulAngst: () => void;
}

export const DS2PraxisSimulationView: React.FC<Props> = ({
  onBackToTheorie,
  onGoToModulAngst
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<AnamneseChoice[]>([]);
  const [diagnosticScore, setDiagnosticScore] = useState<number>(0);
  const [uncoveredFindings, setUncoveredFindings] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ isOptimal: boolean; text: string; answer: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showUltrasoundModal, setShowUltrasoundModal] = useState<boolean>(false);

  const currentStep = anamneseSteps[currentStepIndex];

  const shuffledChoices = useMemo(() => {
    if (!currentStep) return [];
    const list = [...currentStep.choices];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [currentStep?.id]);

  const handleSelectChoice = (choice: AnamneseChoice) => {
    if (choice.category === 'optimal') {
      playSound('success');
    } else {
      playSound('error');
    }

    setDiagnosticScore(prev => prev + choice.diagnosticPoints);
    setSelectedChoices(prev => [...prev, choice]);

    // Add findings to observation log
    if (choice.category === 'optimal') {
      setUncoveredFindings(prev => [...prev, choice.clinicalSignificance]);
    }

    setLastFeedback({
      isOptimal: choice.category === 'optimal',
      text: choice.clinicalSignificance,
      answer: choice.patientAnswer
    });
  };

  const handleNextStep = () => {
    setLastFeedback(null);
    if (currentStepIndex < anamneseSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      playSound('unlock');
      unlockAchievement('modul1_simulation');
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedChoices([]);
    setDiagnosticScore(0);
    setUncoveredFindings([]);
    setLastFeedback(null);
    setIsCompleted(false);
    playSound('swoosh');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Simulation Top Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Stethoscope className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs text-teal-300 font-semibold uppercase tracking-wider">
              <span>Praxis-Simulation • Hausärztliche Anamnese</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Montag, 08:45 Uhr</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Frau Meinhardt stellt sich vor: Akute Gallenkolik
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnostischer PFA-Score</span>
            <span className="text-lg font-mono font-bold text-teal-400">{diagnosticScore} / 100 Pkt.</span>
          </div>
        </div>
      </div>

      {/* Patient Vitals & Observation Clipboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patient Master Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Patientin
              </span>
            </div>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              Erstkontakt Praxis
            </span>
          </div>
          <div className="text-xs space-y-1.5 text-slate-700">
            <p><strong>Name:</strong> Carola Meinhardt</p>
            <p><strong>Alter:</strong> 67 Jahre</p>
            <p><strong>Körpermaße:</strong> 165 cm / 76 kg (BMI ~ 27,9 kg/m²)</p>
            <p><strong>Familienanamnese:</strong> Mutter litt unter Gallensteinen (Cholezystektomie mit 58 J.)</p>
            <p><strong>Gynäkologische Anamnese:</strong> 2 Kinder (Spontangeburten), Menopause mit 51 J.</p>
            <p><strong>Phänotyp:</strong> Heller kaukasischer Hauttyp (blond, blaue Augen)</p>
            <p><strong>Allergien / Unverträglichkeiten:</strong> Penicillin, Pflasterallergie (Kolophonium)</p>
          </div>
        </div>

        {/* Current Vital Signs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                PFA-Vitalwertmessung
              </span>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              Schmerz-Kompensation
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Blutdruck</span>
              <strong className="text-slate-900 font-mono text-sm">145 / 90</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Puls (HF)</span>
              <strong className="text-slate-900 font-mono text-sm">92 bpm</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Temperatur</span>
              <strong className="text-slate-900 font-mono text-sm">37,6 °C</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Schmerz (NRS)</span>
              <strong className="text-rose-600 font-mono text-sm">7 von 10</strong>
            </div>
          </div>
        </div>

        {/* PFA Observation Findings */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Dokumentierte Leitsymptome
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-700 font-bold">
              {uncoveredFindings.length} / 4
            </span>
          </div>
          <div className="space-y-1.5 overflow-y-auto max-h-24">
            {uncoveredFindings.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                Noch keine Leitsymptome erfragt. Starten Sie mit der Schmerzlokalisation.
              </p>
            ) : (
              uncoveredFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{finding}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Simulation Stage */}
      {!isCompleted ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {currentStep.phaseTitle}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                Schritt {currentStepIndex + 1} von {anamneseSteps.length}
              </span>
            </div>
          </div>

          {/* Clinical Scene Description */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {currentStep.situation}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {currentStep.instruction}
            </p>
          </div>

          {/* Choices Options */}
          {!lastFeedback ? (
            <div className="space-y-3">
              {shuffledChoices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/40 transition-all text-xs sm:text-sm text-slate-800 leading-relaxed font-medium group flex items-start justify-between shadow-sm hover:shadow"
                >
                  <span>{choice.question}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 flex-shrink-0 ml-3 mt-0.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          ) : (
            /* Dialogue & Feedback after Choice */
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Patient Response */}
              <div className="bg-teal-50/70 border-l-4 border-teal-500 p-5 rounded-r-2xl">
                <span className="text-xs font-bold text-teal-800 block mb-1">
                  Antwort von Frau Meinhardt / Situation:
                </span>
                <p className="text-base sm:text-lg font-semibold text-teal-950 italic">
                  {lastFeedback.answer}
                </p>
              </div>

              {/* Clinical PFA Significance */}
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
                lastFeedback.isOptimal
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                {lastFeedback.isOptimal ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold mb-0.5">
                    {lastFeedback.isOptimal ? 'Diagnostisch zielführend:' : 'Pflegerischer Lerneffekt:'}
                  </strong>
                  <span>{lastFeedback.text}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md flex items-center space-x-2"
                >
                  <span>Weiter zum nächsten Anamnese-Schritt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* End Screen: Examination, Ultrasound & OP-Indication */
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Anamnese & PFA-Beobachtung erfolgreich abgeschlossen!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Dank Ihrer präzisen Vorab-Befragung konnte die Hausärztin Dr. Weber unverzüglich die gezielte Ultraschalldiagnostik durchführen.
            </p>
          </div>

          {/* Sonography Medical Report */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-teal-400" />
                <h4 className="font-bold text-base text-teal-300">
                  Ärztlicher Befund: Abdomen-Sonographie
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {sonographieResult.doctorName}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              {sonographieResult.findings.map((f, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-rose-950/70 border border-rose-800 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                  Endgültige Diagnose
                </span>
                <span className="text-sm font-bold text-white">
                  {sonographieResult.conclusion}
                </span>
              </div>

              <div className="bg-teal-950/70 border border-teal-800 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-teal-400 block mb-0.5">
                  Klinische Konsequenz
                </span>
                <span className="text-sm font-bold text-teal-200">
                  OP-Indikation: Laparoskopische Cholezystektomie
                </span>
              </div>
            </div>
          </div>

          {/* Educational Bridge to Modul 2 (Angst vor OP) */}
          <div className="bg-gradient-to-r from-rose-50 to-indigo-50 border-2 border-rose-200 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-rose-700 tracking-wider block mb-1">
                Nahtloser Curriculum-Übergang:
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Frau Meinhardt erfährt die OP-Indikation – Ängste brechen auf
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Mit dem Einweisungsschein in der Hand sitzt Frau Meinhardt nun voller Sorge vor Vollnarkose, Schmerzen und Komplikationen im Wartezimmer. Begleiten Sie sie im nächsten Modul!
              </p>
            </div>
            <button
              onClick={onGoToModulAngst}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
            >
              <span>Weiter zu Modul 2: Angst vor OP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulation wiederholen</span>
            </button>
            <button
              onClick={onBackToTheorie}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
            >
              Zurück zu DS 1 (Theorie & Quizzes)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
