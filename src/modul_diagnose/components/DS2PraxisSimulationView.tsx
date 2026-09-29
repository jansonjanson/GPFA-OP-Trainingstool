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
  ClipboardCheck,
  Heart, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Hospital
} from 'lucide-react';
import { anamneseSteps, sixFChecklistItems, sonographieResult } from '../data/praxisSimulationData';
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
  const [selectedChoiceForCurrentStep, setSelectedChoiceForCurrentStep] = useState<AnamneseChoice | null>(null);
  const [diagnosticScore, setDiagnosticScore] = useState<number>(0);
  const [uncoveredFindings, setUncoveredFindings] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ isOptimal: boolean; text: string; answer: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [show6FHelper, setShow6FHelper] = useState<boolean>(false);

  // Phase 2: Interactive 6-F Checklist state
  const [selectedSixF, setSelectedSixF] = useState<string[]>([]);
  const [sixFError, setSixFError] = useState<string | null>(null);
  const [sixFSubmitted, setSixFSubmitted] = useState<boolean>(false);

  const currentStep = anamneseSteps[currentStepIndex];

  // Dynamic shuffle of options for each step
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
    setSelectedChoiceForCurrentStep(choice);
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

  const handleEvaluateSixF = () => {
    const correctIds = sixFChecklistItems.filter(i => i.isCorrect).map(i => i.id);
    const selectedCorrect = selectedSixF.filter(id => correctIds.includes(id));
    const selectedWrong = selectedSixF.filter(id => !correctIds.includes(id));

    if (selectedCorrect.length === correctIds.length && selectedWrong.length === 0) {
      setSixFSubmitted(true);
      setSixFError(null);
      playSound('success');
      setDiagnosticScore(prev => prev + 25);
      setUncoveredFindings(prev => [...prev, "6-F-Regel vollständig identifiziert: Female, Forty, Fat, Fertile, Fair, Family"]);
      setLastFeedback({
        isOptimal: true,
        text: "Exzellente Auswertung! Frau Meinhardt erfüllt alle 6 Kriterien der 6-F-Regel (Female, Forty, Fat, Fertile, Fair, Family). Die erbliche Veranlagung kombiniert mit Adipositas und Östrogenen hat die lithogene Gallebildung massiv begünstigt.",
        answer: "Dr. Weber nickt anerkennend: „Mustergültig ausgewertet! Frau Meinhardt erfüllt das 6-F-Risikoprofil zu 100%. Das untermauert unseren Verdacht auf Gallensteine massiv.“"
      });
    } else {
      playSound('error');
      if (selectedWrong.length > 0) {
        setSixFError("Achtung: Sie haben Faktoren ausgewählt, die nicht in Frau Meinhardts Akte dokumentiert sind oder nicht zur 6-F-Regel gehören. Bitte korrigieren.");
      } else {
        setSixFError(`Sie haben ${selectedCorrect.length} von 6 Kriterien gefunden. Bitte prüfen Sie die Patientenakte oben links nochmals gründlich (Alter, BMI/Gewicht, Kinder, Phänotyp, Familie).`);
      }
    }
  };

  const handleNextStep = () => {
    setLastFeedback(null);
    setSelectedChoiceForCurrentStep(null);
    setSixFError(null);
    setSixFSubmitted(false);

    const nextIndex = currentStepIndex + 1;

    if (nextIndex < anamneseSteps.length) {
      // ONLY scroll up to the patient record if the next step is specifically the 6-F phase!
      if (anamneseSteps[nextIndex].id === 'step_anamnese_6f') {
        const recordElement = document.getElementById('simulation-patient-record');
        if (recordElement) {
          recordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      setCurrentStepIndex(nextIndex);
    } else {
      setIsCompleted(true);
      playSound('unlock');
      unlockAchievement('modul1_simulation');
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedChoices([]);
    setSelectedChoiceForCurrentStep(null);
    setSelectedSixF([]);
    setSixFError(null);
    setSixFSubmitted(false);
    setDiagnosticScore(0);
    setUncoveredFindings([]);
    setLastFeedback(null);
    setIsCompleted(false);
    playSound('swoosh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <span>Praxis-Simulation • Hausärztin Dr. med. Elisabeth Weber</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Montag, 08:45 Uhr</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Frau Meinhardt stellt sich vor: Akute Cholezystitis
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnostischer PFA-Score</span>
            <span className="text-lg font-mono font-bold text-teal-400">{diagnosticScore} / 150 Pkt.</span>
          </div>
        </div>
      </div>

      {/* Patient Vitals & Observation Clipboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patient Master Card with 6-F Risk Factors */}
        <div id="simulation-patient-record" className="bg-white border-2 border-teal-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Patientenakte
              </span>
            </div>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              Frau Meinhardt
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-700">
            <p><strong>Name:</strong> Carola Meinhardt</p>
            <p><strong>Geschlecht:</strong> weiblich</p>
            <p><strong>Alter:</strong> 67 Jahre</p>
            <p><strong>Körpermaße:</strong> 165 cm, 84 kg (BMI 30,9 kg/m²)</p>
            <p><strong>Gynäkologie:</strong> 2 erwachsene Kinder (Spontangeburten)</p>
            <p><strong>Phänotyp:</strong> Heller Teint, blond, blauäugig</p>
            <p><strong>Familienanamnese:</strong> Mutter Cholezystektomie mit 58 Jahren</p>
            <p className="pt-1 text-[11px] text-slate-500"><strong>Allergien:</strong> Penicillin, Pflasterallergie</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200 font-semibold flex items-center justify-between">
              <span>Patientenstatus:</span>
              <span className="font-bold text-teal-700">Stammdaten zur Einsicht</span>
            </div>
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
              Akutphase
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Blutdruck</span>
              <strong className="text-slate-900 font-mono text-sm">145 / 90</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Puls (HF)</span>
              <strong className="text-slate-900 font-mono text-sm">94 bpm</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Temperatur</span>
              <strong className="text-amber-600 font-mono text-sm">37,8 °C</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">Schmerz (NRS)</span>
              <strong className="text-rose-600 font-mono text-sm">8 von 10</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
            Inspektion: Kaltschweißig, Gesichtsblässe, diskreter Sklerenikterus sichtbar.
          </div>
        </div>

        {/* PFA Observation Findings */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Erhobene Befunde
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-700 font-bold">
              {uncoveredFindings.length} / {anamneseSteps.length} Phasen
            </span>
          </div>
          <div className="space-y-1.5 overflow-y-auto max-h-36">
            {uncoveredFindings.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                Noch keine Befunde gesichert. Starten Sie mit der Schmerzanalyse in Phase 1.
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
            <span className="text-xs font-bold text-slate-500">
              Hausarztpraxis Dr. med. Elisabeth Weber
            </span>
          </div>

          {/* Clinical Scene Description */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {currentStep.situation}
            </p>

            {/* Special Callout for Phase 2: Check Patient File */}
            {currentStep.id === 'step_anamnese_6f' && (
              <div className="p-3.5 bg-purple-50 border-2 border-purple-200 rounded-2xl text-xs text-purple-900 flex items-center space-x-3">
                <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>
                  <strong>Arbeitsauftrag:</strong> Schauen Sie in die <strong>Patientenakte oben links</strong> und wählen Sie eigenständig alle Kriterien der 6-F-Regel aus, die auf Frau Meinhardts Daten zutreffen!
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
              {currentStep.instruction}
            </p>
          </div>

          {/* PHASE 2: INTERAKTIVE 6-F CHECKLISTE */}
          {currentStep.id === 'step_anamnese_6f' ? (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-purple-600" />
                  <span>Aktive 6-F Checkliste (mit Akte abgleichen)</span>
                </span>
                <span className="text-xs text-purple-800 font-bold bg-purple-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {selectedSixF.length} ausgewählt
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sixFChecklistItems.map(item => {
                  const isChecked = selectedSixF.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={sixFSubmitted}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSixF(prev => prev.filter(x => x !== item.id));
                        } else {
                          setSelectedSixF(prev => [...prev, item.id]);
                        }
                        setSixFError(null);
                      }}
                      className={`p-3.5 rounded-xl border-2 text-left flex items-start space-x-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'border-purple-600 bg-purple-50/90 text-purple-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        {sixFSubmitted && isChecked && item.isCorrect && (
                          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                            ✓ In Akte belegt: {item.fileFact}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {sixFError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{sixFError}</span>
                </div>
              )}

              {!sixFSubmitted && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEvaluateSixF}
                    className="w-full sm:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Checkliste auswerten (6-F-Regel prüfen)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Choices Options with Color Feedback after selection for other phases */
            <div className="space-y-3">
              {shuffledChoices.map(choice => {
                const isSelected = selectedChoiceForCurrentStep?.id === choice.id;
                const hasAnswered = !!lastFeedback;

                let buttonStyle = "border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/40 text-slate-800";
                if (hasAnswered) {
                  if (choice.category === 'optimal') {
                    buttonStyle = "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm";
                  } else if (isSelected) {
                    buttonStyle = "border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-sm";
                  } else {
                    buttonStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={choice.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm leading-relaxed font-medium group flex items-start justify-between shadow-xs ${buttonStyle}`}
                  >
                    <div className="flex items-start space-x-3">
                      {hasAnswered && (
                        <span className="flex-shrink-0 mt-0.5">
                          {choice.category === 'optimal' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isSelected ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <span className="w-4 h-4 block" />
                          )}
                        </span>
                      )}
                      <span>{choice.question}</span>
                    </div>
                    {!hasAnswered && (
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 flex-shrink-0 ml-3 mt-0.5 transform group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dialogue & Feedback after Choice */}
          {lastFeedback && (
            <div className="space-y-5 animate-in fade-in duration-300 pt-2 border-t border-slate-100">
              {/* Patient Response */}
              <div className="bg-teal-50/70 border-l-4 border-teal-500 p-5 rounded-r-2xl">
                <span className="text-xs font-bold text-teal-800 block mb-1">
                  Antwort von Frau Meinhardt / Ärztliche Rückmeldung:
                </span>
                <p className="text-base sm:text-lg font-semibold text-teal-950 italic">
                  {lastFeedback.answer}
                </p>
              </div>

              {/* Clinical PFA Significance */}
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
                lastFeedback.isOptimal
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {lastFeedback.isOptimal ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold mb-0.5">
                    {lastFeedback.isOptimal ? 'Diagnostisch zielführend (optimal):' : 'Fachlicher Lerneffekt (suboptimal):'}
                  </strong>
                  <span>{lastFeedback.text}</span>
                </div>
              </div>

              {/* Prominent Amber Pulsing CTA Button to next step */}
              <div className="pt-3">
                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl ring-4 ring-amber-300 animate-pulse flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <span>Weiter zum nächsten Anamnese-Schritt ({currentStepIndex + 2} von {anamneseSteps.length})</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* End Screen: Examination, Ultrasound & Hospital Referral */
        <div className="bg-white border-2 border-teal-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Anamnese & PFA-Beobachtung erfolgreich gemeistert!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Dank Ihrer präzisen Erhebung von Symptomen, Risikofaktoren (6-F-Regel), Nahrungsauslösern und Cholestase-Zeichen konnte Hausärztin Dr. Weber unverzüglich die Diagnose stellen und Frau Meinhardt lebensrettend einweisen.
            </p>
          </div>

          {/* Sonography Medical Report */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-teal-400" />
                <h4 className="font-bold text-base text-teal-300">
                  Ärztlicher Befund: Abdomen-Sonographie & Notfall-Labor
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

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-rose-950/70 border border-rose-800 p-3.5 rounded-2xl flex-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                  Endgültige Diagnose
                </span>
                <span className="text-sm font-bold text-white">
                  {sonographieResult.conclusion}
                </span>
              </div>

              <div className="bg-teal-950/70 border border-teal-800 p-3.5 rounded-2xl flex-1">
                <span className="text-[10px] uppercase font-bold text-teal-400 block mb-0.5">
                  Klinische Konsequenz & Einweisung
                </span>
                <span className="text-sm font-bold text-teal-200">
                  Stationäre Einweisung zur laparoskopischen Cholezystektomie (lap. CE)
                </span>
              </div>
            </div>
          </div>

          {/* Hospital Referral Box */}
          <div className="bg-gradient-to-r from-teal-50 via-indigo-50 to-blue-50 border-2 border-teal-300 rounded-3xl p-6 space-y-3">
            <div className="flex items-center space-x-3 text-teal-900">
              <Hospital className="w-6 h-6 text-teal-600" />
              <h4 className="font-black text-base sm:text-lg">
                Krankenhauseinweisung: Laparoskopische Cholezystektomie (lap. CE)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Frau Meinhardt wird mit einem Krankentransport direkt in die chirurgische Klinik eingewiesen. Sie bleibt nüchtern, erhält vorab ein Spasmolytikum (Butylscopolamin) und ein Nicht-Opioid-Analgetikum (Metamizol). Im Krankenhaus wird zeitnah innerhalb von 24–72 Stunden die laparoskopische Cholezystektomie durchgeführt.
            </p>
          </div>

          {/* Actions & Module Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleRestart}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulation wiederholen</span>
            </button>
            <button
              onClick={onBackToTheorie}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Zurück zur Modul 1 Theorie</span>
            </button>
            <button
              onClick={onGoToModulAngst}
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
            >
              <span>Weiter zu Modul 2: Angst vor der OP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
