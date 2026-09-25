import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Activity, 
  Wind, 
  Droplet, 
  Eye, 
  BriefcaseMedical, 
  User, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { simScenes, initialSimState } from '../data/simulationData';
import { SimChoice, SimScene } from '../types';
import { Notfallkoffer } from './Notfallkoffer';
import { playSound } from '../utils/audio';
import { unlockAchievement } from '../../utils/gamification';

interface Props {
  onBackToOverview: () => void;
  onGoToModulPraeOp?: () => void;
}

export const AngstSimulation: React.FC<Props> = ({ onBackToOverview, onGoToModulPraeOp }) => {
  const [currentSceneId, setCurrentSceneId] = useState<string>('start');
  const [trust, setTrust] = useState<number>(initialSimState.trust);
  const [stress, setStress] = useState<number>(initialSimState.stress);
  const [vitals, setVitals] = useState(initialSimState.vitals);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: 'optimal' | 'acceptable' | 'critical' } | null>(null);
  const [showNotfallkoffer, setShowNotfallkoffer] = useState<boolean>(false);
  const [showPatientFile, setShowPatientFile] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<string[]>([]);

  const currentScene: SimScene = simScenes[currentSceneId] || simScenes['start'];
  const isFinished = currentScene.choices.length === 0;

  // Randomize choices so the first option is never always the correct one
  const shuffledChoices = useMemo(() => {
    if (!currentScene?.choices) return [];
    const list = [...currentScene.choices];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [currentSceneId]);

  const handleChoice = (choice: SimChoice) => {
    // Audio
    if (choice.type === 'optimal') {
      playSound('success');
    } else if (choice.type === 'critical') {
      playSound('error');
    } else {
      playSound('pop');
    }

    // Update Trust & Stress
    const newTrust = Math.min(100, Math.max(0, trust + choice.trustChange));
    const newStress = Math.min(100, Math.max(0, stress + choice.stressChange));
    setTrust(newTrust);
    setStress(newStress);

    // Update Vitals if specified
    if (choice.vitalsEffect) {
      setVitals(prev => ({
        hr: choice.vitalsEffect?.hr ?? prev.hr,
        bpSys: choice.vitalsEffect?.bpSys ?? prev.bpSys,
        bpDia: choice.vitalsEffect?.bpDia ?? prev.bpDia,
        resp: choice.vitalsEffect?.resp ?? prev.resp,
        sweat: (choice.vitalsEffect?.sweat as any) ?? prev.sweat,
        pupils: prev.pupils
      }));
    }

    // Achievements checks
    const newAchievements = [...achievements];
    if (choice.id === 'c1_good' && !newAchievements.includes('Empathie-Profi')) {
      newAchievements.push('Empathie-Profi');
    }
    if (choice.id === 'c2_warmdecke' && !newAchievements.includes('Wärmespender')) {
      newAchievements.push('Wärmespender');
    }
    if (choice.id === 'c3_audio' && !newAchievements.includes('Kognitive Entlastung')) {
      newAchievements.push('Kognitive Entlastung');
    }
    if (choice.id === 'c4_perfect' && !newAchievements.includes('Prämedikations-Experte')) {
      newAchievements.push('Prämedikations-Experte');
    }
    if (choice.id === 'c5_isbar' && !newAchievements.includes('ISBAR-Vorbild')) {
      newAchievements.push('ISBAR-Vorbild');
    }
    setAchievements(newAchievements);

    setLastFeedback({
      text: choice.feedback,
      type: choice.type
    });

    setDecisionHistory(prev => [...prev, choice.text]);
    setCurrentSceneId(choice.nextSceneId);
    if (simScenes[choice.nextSceneId]?.choices.length === 0) {
      unlockAchievement('modul2_simulation');
    }
  };

  const handleRestart = () => {
    setCurrentSceneId('start');
    setTrust(initialSimState.trust);
    setStress(initialSimState.stress);
    setVitals(initialSimState.vitals);
    setLastFeedback(null);
    setAchievements([]);
    setDecisionHistory([]);
    playSound('swoosh');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Simulation Header with patient file & notfallkoffer buttons */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs text-rose-300 font-semibold uppercase tracking-wider">
              <span>Klinische Simulation</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{currentScene.time}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Frau Meinhardt: Angst vor Cholezystektomie
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPatientFile(!showPatientFile)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Patientenakte</span>
          </button>

          <button
            onClick={() => setShowNotfallkoffer(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center space-x-1.5 transition-colors"
          >
            <BriefcaseMedical className="w-4 h-4" />
            <span>Notfallkoffer öffnen</span>
          </button>
        </div>
      </div>

      {/* Patient File Dropdown */}
      {showPatientFile && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-lg text-slate-800 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-slate-900">Patientenakte: Carola Meinhardt (67 J.)</h3>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Station 3B, Zi. 14
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="block text-slate-500 mb-0.5">Patientin:</strong>
              <span className="font-semibold text-slate-900">Carola Meinhardt, 67 J. (165 cm, 75 kg)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="block text-slate-500 mb-0.5">Diagnose:</strong>
              <span className="font-semibold text-slate-900">Symptomatische Cholezystolithiasis</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="block text-slate-500 mb-0.5">Geplanter Eingriff:</strong>
              <span className="font-semibold text-slate-900">Laparoskopische Cholezystektomie (LCE)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="block text-slate-500 mb-0.5">Allergien / CAVE:</strong>
              <span className="font-semibold text-rose-600">Pflasterallergie, Penicillin</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <strong>Ärztliche Anordnung Prämedikation:</strong> Midazolam 7,5 mg 1 Tbl. p.o. ca. 45 Min. vor OP-Abruf mit min. Flüssigkeit. Sturzprophylaxe beachten!
          </div>
        </div>
      )}

      {/* Live Vital Monitor & Stress / Trust Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Trust & Security */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Patientensicherheit & Vertrauen
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-extrabold text-slate-900">{trust}%</span>
            <span className={`text-xs font-bold ${trust >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {trust >= 75 ? 'Hoch (Stabil)' : trust >= 50 ? 'Moderat' : 'Kritisch gering'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${trust}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Anxiety / Stress Level */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Angst-Score (State-Angst)
            </span>
            <Activity className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-extrabold text-slate-900">{stress}%</span>
            <span className={`text-xs font-bold ${stress <= 35 ? 'text-emerald-600' : stress <= 65 ? 'text-amber-600' : 'text-rose-600'}`}>
              {stress >= 75 ? 'Akute Panik' : stress >= 45 ? 'Ausgeprägt' : 'Entspannt'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                stress > 70 ? 'bg-rose-500' : stress > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${stress}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Live Vitals Box */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">
              VITALMONITOR (LIVE)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block">PULS (HF)</span>
              <span className={`font-mono font-bold text-base ${vitals.hr > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {vitals.hr} <span className="text-[9px]">bpm</span>
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block">RR (mmHg)</span>
              <span className={`font-mono font-bold text-base ${vitals.bpSys > 140 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {vitals.bpSys}/{vitals.bpDia}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block">ATMUNG</span>
              <span className={`font-mono font-bold text-base ${vitals.resp > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {vitals.resp} <span className="text-[9px]">/min</span>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Haut: <strong className="text-slate-200">{vitals.sweat}</strong></span>
            <span>Pupillen: <strong className="text-slate-200">{vitals.pupils}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Clinical Scene Stage */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Scene Title and Location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
              {currentScene.title}
            </span>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentScene.location}</span>
            </div>
          </div>

          {currentScene.recommendedKitAction && (
            <div className="text-xs bg-amber-50 text-amber-800 font-medium px-3 py-1.5 rounded-xl border border-amber-200 flex items-center space-x-1.5 self-start sm:self-auto">
              <span>Empfohlen: <strong>{currentScene.recommendedKitAction}</strong></span>
            </div>
          )}
        </div>

        {/* Narrative & Patient Dialogue */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {currentScene.situationText}
          </p>

          <div className="bg-rose-50/60 border-l-4 border-rose-500 p-4 sm:p-5 rounded-r-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
              Frau Meinhardt:
            </span>
            <p className="text-base sm:text-lg font-semibold text-rose-950 italic">
              {currentScene.patientQuote}
            </p>
          </div>
        </div>

        {/* Feedback Banner from Previous Decision */}
        {lastFeedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
            lastFeedback.type === 'optimal'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : lastFeedback.type === 'critical'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            {lastFeedback.type === 'optimal' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="block font-bold mb-0.5">
                {lastFeedback.type === 'optimal' ? 'Fachlich exzellent!' : lastFeedback.type === 'critical' ? 'Kritischer Fehler / Gefährdung:' : 'Verbesserungsfähig:'}
              </strong>
              <span>{lastFeedback.text}</span>
            </div>
          </div>
        )}

        {/* Choices Options or Final Screen */}
        {!isFinished ? (
          <div className="space-y-3 pt-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
              Ihre nächste pflegerische Entscheidung:
            </span>
            {shuffledChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs sm:text-sm text-slate-800 leading-relaxed font-medium group flex items-start justify-between shadow-sm hover:shadow cursor-pointer"
              >
                <span>{choice.text}</span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0 ml-3 mt-0.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        ) : (
          /* Finished Screen */
          <div className="space-y-6 pt-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Simulation erfolgreich abgeschlossen!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mt-1">
                Frau Meinhardt konnte dank Ihrer empathischen und evidenzbasierten Betreuung ruhig und sicher in den OP übergeben werden.
              </p>
            </div>

            {/* Achievements collected */}
            {achievements.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Verdiente PFA-Kompetenzabzeichen
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {achievements.map((ach) => (
                    <span
                      key={ach}
                      className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ach}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Szenario wiederholen</span>
              </button>
              <button
                onClick={onBackToOverview}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all shadow-md flex items-center space-x-2"
              >
                <span>Zurück zur Modulübersicht</span>
              </button>
              {onGoToModulPraeOp && currentSceneId === 'end_success' && (
                <button
                  onClick={onGoToModulPraeOp}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center space-x-2"
                >
                  <span>Weiter zu Modul 3: Prä-OP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notfallkoffer Modal in Simulation */}
      {showNotfallkoffer && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-rose-600 text-white rounded-2xl">
                  <BriefcaseMedical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Digitaler Notfallkoffer: Angstinterventionen
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schlagen Sie vor Ihrer Entscheidung geeignete pflegerische Maßnahmen nach.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotfallkoffer(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                Schließen ✕
              </button>
            </div>

            <Notfallkoffer standalone={false} />
          </div>
        </div>
      )}
    </div>
  );
};
