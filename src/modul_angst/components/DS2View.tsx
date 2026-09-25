import React, { useState, useMemo } from 'react';
import { 
  BriefcaseMedical, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  HeartHandshake, 
  ShieldCheck, 
  Layers,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowDown,
  BookOpen,
  Award
} from 'lucide-react';
import { 
  ds2Fachtext, 
  quiz1CommunicationItems, 
  quiz2PremedCloze, 
  quiz3DistractionMatching, 
  quiz4MatrixItems, 
  quiz5ErrorRadarItems 
} from '../data/ds2Data';
import { Notfallkoffer } from './Notfallkoffer';
import { playSound } from '../utils/audio';

function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  unlockedNuggets: string[];
  onUnlockNugget: (quizId: string) => void;
  onCompleteQuiz?: (quizId: string) => void;
  onStartSimulation: () => void;
}

export const DS2View: React.FC<Props> = ({ unlockedNuggets, onUnlockNugget, onCompleteQuiz, onStartSimulation }) => {
  // Step confirmation tracking
  const [step1Completed, setStep1Completed] = useState<boolean>(() => {
    return unlockedNuggets.includes('ds2_step1_text');
  });
  const [step2Completed, setStep2Completed] = useState<boolean>(() => {
    return unlockedNuggets.includes('ds2_step2_koffer');
  });

  // Quiz 1: Communication Scale (Do vs Don't)
  const [q1Index, setQ1Index] = useState<number>(0);
  const [q1Feedback, setQ1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 2: Premedication Cloze with shuffled options
  const [q2Seed, setQ2Seed] = useState<number>(1);
  const shuffledQ2Options = useMemo(() => {
    const res: Record<string, string[]> = {};
    quiz2PremedCloze.parts.forEach(part => {
      if (part.key && part.options) {
        res[part.key] = fisherYatesShuffle([...part.options]);
      }
    });
    return res;
  }, [q2Seed]);
  const [q2Selections, setQ2Selections] = useState<Record<string, string>>({});
  const [q2Feedback, setQ2Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 3: Distraction Matching with shuffled right-hand terms
  const [q3Seed, setQ3Seed] = useState<number>(1);
  const shuffledQ3Terms = useMemo(() => {
    return fisherYatesShuffle(quiz3DistractionMatching.map(p => p.term));
  }, [q3Seed]);
  const [q3SelectedScenario, setQ3SelectedScenario] = useState<string | null>(null);
  const [q3MatchedPairs, setQ3MatchedPairs] = useState<Record<string, string>>({});
  const [q3Feedback, setQ3Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 4: Matrix 3 Columns
  const [q4Index, setQ4Index] = useState<number>(0);
  const [q4Feedback, setQ4Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 5: Troubleshooting & Hygiene (Multiple Response)
  const [q5SelectedErrors, setQ5SelectedErrors] = useState<string[]>([]);
  const [q5Feedback, setQ5Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Handle Quiz 1 Sort
  const handleQ1Sort = (category: 'do' | 'dont') => {
    const item = quiz1CommunicationItems[q1Index];
    const isCorrect = item.category === category;

    if (isCorrect) {
      playSound('pop');
    } else {
      playSound('error');
    }

    setQ1Feedback({
      isCorrect,
      text: item.explanation
    });

    if (q1Index === quiz1CommunicationItems.length - 1 && isCorrect) {
      onUnlockNugget('ds2_quiz1');
      onCompleteQuiz?.('ds2_quiz1');
      playSound('unlock');
    }
  };

  const handleNextQ1 = () => {
    setQ1Feedback(null);
    if (q1Index < quiz1CommunicationItems.length - 1) {
      setQ1Index(prev => prev + 1);
    }
  };

  // Handle Quiz 2 Submit
  const handleQ2Submit = () => {
    const partsWithKeys = quiz2PremedCloze.parts.filter(p => p.key);
    let allCorrect = true;
    for (const part of partsWithKeys) {
      if (q2Selections[part.key!] !== part.correct) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      playSound('unlock');
      setQ2Feedback({
        isCorrect: true,
        text: 'Sehr gut! Sie beherrschen die Indikationen, Substanzklassen, das 45-Minuten-Zeitfenster und die Risiken (Delir bei Älteren) der medikamentösen Prämedikation.'
      });
      onUnlockNugget('ds2_quiz2');
      onCompleteQuiz?.('ds2_quiz2');
    } else {
      playSound('error');
      setQ2Feedback({
        isCorrect: false,
        text: 'Einige Angaben stimmen noch nicht. Achten Sie auf die Substanzgruppe und die typische Gabe ca. 45 Minuten vor OP.'
      });
    }
  };

  // Handle Quiz 3 Match
  const handleQ3Match = (term: string) => {
    if (!q3SelectedScenario) return;
    const pair = quiz3DistractionMatching.find(p => p.id === q3SelectedScenario);
    if (!pair) return;

    const isCorrect = pair.term === term;
    if (isCorrect) {
      playSound('success');
      const updated = { ...q3MatchedPairs, [q3SelectedScenario]: term };
      setQ3MatchedPairs(updated);
      setQ3Feedback({ isCorrect: true, text: pair.explanation });
      setQ3SelectedScenario(null);

      if (Object.keys(updated).length === quiz3DistractionMatching.length) {
        onUnlockNugget('ds2_quiz3');
        onCompleteQuiz?.('ds2_quiz3');
        playSound('unlock');
      }
    } else {
      playSound('error');
      setQ3Feedback({
        isCorrect: false,
        text: 'Überlegen Sie: Welche Methode passt exakt zur körperlichen Mobilität und den Bedürfnissen dieses Patienten?'
      });
    }
  };

  // Handle Quiz 4 Matrix Sort
  const handleQ4Sort = (target: 'symptom' | 'info' | 'angehoerige') => {
    const item = quiz4MatrixItems[q4Index];
    const isCorrect = item.targetCategory === target;

    if (isCorrect) {
      playSound('pop');
    } else {
      playSound('error');
    }

    setQ4Feedback({
      isCorrect,
      text: item.explanation
    });

    if (q4Index === quiz4MatrixItems.length - 1 && isCorrect) {
      onUnlockNugget('ds2_quiz4');
      onCompleteQuiz?.('ds2_quiz4');
      playSound('unlock');
    }
  };

  const handleNextQ4 = () => {
    setQ4Feedback(null);
    if (q4Index < quiz4MatrixItems.length - 1) {
      setQ4Index(prev => prev + 1);
    }
  };

  // Handle Quiz 5 Check
  const toggleQ5Select = (id: string) => {
    setQ5SelectedErrors(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setQ5Feedback(null);
  };

  const handleQ5Check = () => {
    // The errors to check are err1, err3, err4. err2 is NOT an error.
    const correctErrorIds = ['err1', 'err3', 'err4'];
    const isMatch = 
      correctErrorIds.every(id => q5SelectedErrors.includes(id)) &&
      !q5SelectedErrors.includes('err2');

    if (isMatch) {
      playSound('unlock');
      setQ5Feedback({
        isCorrect: true,
        text: 'Großartig! Sie haben alle 3 kritischen Fehler aufgedeckt: Kirschkernkissen birgt Hygienerisiken & Verbrennungsgefahr; panische Begleitpersonen verstärken die Angst; und kühle Routine zerstört Vertrauen. Nur die Bezugspflege ist korrekt!'
      });
      onUnlockNugget('ds2_quiz5');
      onCompleteQuiz?.('ds2_quiz5');
    } else {
      playSound('error');
      setQ5Feedback({
        isCorrect: false,
        text: 'Prüfen Sie noch einmal genau: Welche Maßnahmen stellen wirkliche Fehler oder Gefahren dar? (Tipp: 3 der 4 Aussagen sind fehlerhaft, eine ist eine empfohlene Pflegemaßnahme!)'
      });
    }
  };

  const handleResetQ1 = () => {
    setQ1Index(0);
    setQ1Feedback(null);
    playSound('pop');
  };

  const handleResetQ2 = () => {
    setQ2Selections({});
    setQ2Feedback(null);
    setQ2Seed(prev => prev + 1);
    playSound('pop');
  };

  const handleResetQ3 = () => {
    setQ3SelectedScenario(null);
    setQ3MatchedPairs({});
    setQ3Feedback(null);
    setQ3Seed(prev => prev + 1);
    playSound('pop');
  };

  const handleResetQ4 = () => {
    setQ4Index(0);
    setQ4Feedback(null);
    playSound('pop');
  };

  const handleResetQ5 = () => {
    setQ5SelectedErrors([]);
    setQ5Feedback(null);
    playSound('pop');
  };

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span>Doppelstunde 4 / Modul 2 (90 Minuten)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Pflegerische Praxis, Notfallkoffer & Akut-Interventionen
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Erarbeiten Sie deeskalierende Kommunikation, thermische Entlastung, gezielte Ablenkung und evidenzbasierte Prämedikation vor der Cholezystektomie.
            </p>
          </div>
          <button
            onClick={onStartSimulation}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Zur Frau Meinhardt Simulation</span>
          </button>
        </div>

        {/* SCHRITT 1: CNE Fachtext Banner */}
        <div className="mt-6">
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
              Arbeitsauftrag 1: CNE-Fachtext vollständig durcharbeiten
            </span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Lesen Sie den CNE-Fachtext „Angst vor Operationen“ aufmerksam durch, um evidenzbasierte Deeskalationsmethoden und Risiken der medikamentösen Prämedikation zu verstehen.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {ds2Fachtext.source}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {ds2Fachtext.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {ds2Fachtext.description}
                </p>
              </div>
            </div>
            <a
              href={ds2Fachtext.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 shadow-sm cursor-pointer"
            >
              <span>Fachtext öffnen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Schritt 1 Bestätigungs-Button mit Pulsieren */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
              Bestätigen Sie das Durcharbeiten des Fachtextes, um strukturiert zum Notfallkoffer zu gelangen.
            </div>
            <button
              onClick={() => {
                setStep1Completed(true);
                onUnlockNugget('ds2_step1_text');
                playSound('success');
              }}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                step1Completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
              }`}
            >
              {step1Completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4" />}
              <span>{step1Completed ? 'Schritt 1 gesichert: CNE-Fachtext durchgearbeitet' : 'Schritt 1 bestätigen: Fachtext gelesen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pfeil-Leitung zwischen Schritt 1 und Schritt 2 */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="h-6 w-0.5 bg-rose-300"></div>
        <div className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 shadow-xs flex items-center space-x-1.5 my-1">
          <span>Nächster Schritt: Digitalen Notfallkoffer erkunden</span>
          <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="h-6 w-0.5 bg-rose-300"></div>
      </div>

      {/* SCHRITT 2: DIGITALER NOTFALLKOFFER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
            Arbeitsauftrag 2: Die 5 Evidenz-Schubladen verinnerlichen
          </span>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
            Öffnen und prüfen Sie alle 5 Evidenz-Schubladen des digitalen Notfallkoffers (Kommunikation, Wärmedecke, Ablenkung, Prämedikation, ISBAR-Übergabe).
          </p>
        </div>

        <Notfallkoffer standalone={true} />

        {/* Schritt 2 Bestätigungs-Button mit Pulsieren */}
        <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">Pfad-Führung:</span>
            Bestätigen Sie das Verinnerlichen des Notfallkoffers, um strukturiert zu den Praxis-Quizzes zu gelangen.
          </div>
          <button
            onClick={() => {
              setStep2Completed(true);
              onUnlockNugget('ds2_step2_koffer');
              playSound('success');
            }}
            className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
              step2Completed
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300 animate-pulse'
            }`}
          >
            {step2Completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <BriefcaseMedical className="w-4 h-4" />}
            <span>{step2Completed ? 'Schritt 2 gesichert: Notfallkoffer verinnerlicht' : 'Schritt 2 bestätigen: Notfallkoffer beherrscht'}</span>
          </button>
        </div>
      </div>

      {/* Pfeil-Leitung zwischen Schritt 2 und Schritt 3 */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="h-6 w-0.5 bg-rose-300"></div>
        <div className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 shadow-xs flex items-center space-x-1.5 my-1">
          <span>Weiter zu Schritt 3: Quizzes bearbeiten</span>
          <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="h-6 w-0.5 bg-rose-300"></div>
      </div>

      {/* SCHRITT 3: QUIZZES TITLE */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200">
          Schritt 3: Praxis-Sicherung & Kompetenztraining
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          5 Praxis-Quizzes für die Doppelstunde 4
        </h3>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-1">
          Trainieren Sie die richtigen pflegerischen Worte, erkennen Sie Gefahren im Patientenzimmer und bereiten Sie sich optimal auf die Cholezystektomie-Simulation vor.
        </p>
      </div>

      {/* QUIZ 1: Die Kommunikations-Waage (Do vs. Don't) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 1: Die Kommunikations-Waage – Angstlösend (Do) vs. Blockierend (Don't)
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Aussage {q1Index + 1} von {quiz1CommunicationItems.length}
            </span>
            {(q1Index > 0 || q1Feedback) && (
              <button
                onClick={handleResetQ1}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 1 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        {/* Current statement */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
            Pflegerische Aussage / Handlung
          </span>
          <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
            {quiz1CommunicationItems[q1Index].text}
          </p>
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          <button
            onClick={() => handleQ1Sort('do')}
            disabled={!!q1Feedback}
            className="p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h5 className="font-extrabold text-base sm:text-lg">
              Angstlösend (DO)
            </h5>
            <span className="text-xs opacity-80 mt-1">
              Fördert Selbstbestimmung & Vertrauen
            </span>
          </button>

          <button
            onClick={() => handleQ1Sort('dont')}
            disabled={!!q1Feedback}
            className="p-6 rounded-2xl border-2 border-rose-300 bg-rose-50/50 hover:bg-rose-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h5 className="font-extrabold text-base sm:text-lg">
              Blockierend (DON'T)
            </h5>
            <span className="text-xs opacity-80 mt-1">
              Bagatellisierung oder Überforderung
            </span>
          </button>
        </div>

        {/* Feedback */}
        {q1Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q1Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex-1">
              <strong className="block font-bold mb-1">
                {q1Feedback.isCorrect ? 'Richtig eingeordnet!' : 'Nicht optimal:'}
              </strong>
              <span>{q1Feedback.text}</span>
              <div className="mt-3">
                {q1Index < quiz1CommunicationItems.length - 1 && (
                  <button
                    onClick={handleNextQ1}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Nächste Aussage beurteilen
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 2: Die "Wirkstoff-Tafel" zur Prämedikation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 2: Die Wirkstoff-Tafel zur medikamentösen Prämedikation
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              5 Fachbegriffe einsetzen
            </span>
            {(Object.keys(q2Selections).length > 0 || q2Feedback) && (
              <button
                onClick={handleResetQ2}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 2 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {quiz2PremedCloze.intro}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-sm sm:text-base leading-loose text-slate-800">
          {quiz2PremedCloze.parts.map((part, index) => {
            if (!part.key) {
              return <span key={index}>{part.text}</span>;
            }

            return (
              <span key={index} className="inline-block mx-1">
                <select
                  value={q2Selections[part.key] || ''}
                  onChange={(e) => {
                    setQ2Selections(prev => ({ ...prev, [part.key!]: e.target.value }));
                    setQ2Feedback(null);
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    q2Selections[part.key]
                      ? 'bg-rose-50 border-rose-400 text-rose-900'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  <option value="">[ Auswählen ]</option>
                  {(shuffledQ2Options[part.key] || part.options!).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </span>
            );
          })}
        </div>

        <button
          onClick={handleQ2Submit}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
        >
          Prämedikations-Wissen prüfen
        </button>

        {q2Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q2Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q2Feedback.isCorrect ? 'Perfekt! ' : 'Hinweis: '}</strong>
            {q2Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 3: Das "Ablenkungs-Matching" (Szenario-Zuordnung) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 3: Das Ablenkungs-Matching (Praxisnahe Stations-Szenarien)
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(q3MatchedPairs).length} von 4 zugeordnet
            </span>
            {Object.keys(q3MatchedPairs).length > 0 && (
              <button
                onClick={handleResetQ3}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 3 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Klicken Sie links auf einen Patienten und ordnen Sie ihm rechts die realistischste Ablenkungs- oder Entspannungsmethode zu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Scenarios */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Patienten auf Station
            </span>
            {quiz3DistractionMatching.map((item) => {
              const isMatched = !!q3MatchedPairs[item.id];
              const isSelected = q3SelectedScenario === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => {
                    setQ3SelectedScenario(item.id);
                    setQ3Feedback(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs leading-relaxed ${
                    isMatched
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70 cursor-default'
                      : isSelected
                      ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-400/20 font-medium text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-[11px] font-bold text-rose-600 block mb-1">
                    {item.scenarioTitle}
                  </span>
                  <span>{item.scenario}</span>
                  {isMatched && (
                    <div className="mt-2 text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Methode: {q3MatchedPairs[item.id]}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Methods (Shuffled) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Ablenkungs- & Entspannungsmethoden
            </span>
            {shuffledQ3Terms.map((term) => {
              const isUsed = Object.values(q3MatchedPairs).includes(term);

              return (
                <button
                  key={term}
                  disabled={isUsed || !q3SelectedScenario}
                  onClick={() => handleQ3Match(term)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all font-bold text-sm flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default'
                      : q3SelectedScenario
                      ? 'bg-white border-rose-300 hover:bg-rose-600 hover:text-white shadow-sm cursor-pointer'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{term}</span>
                  {isUsed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {q3Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q3Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q3Feedback.isCorrect ? 'Stimmig! ' : 'Hinweis: '}</strong>
            {q3Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 4: Die "Symptom- und Ressourcen-Matrix" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 4: Die 3-Säulen-Matrix – Zuordnung pflegerischer Maßnahmen
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Kärtchen {q4Index + 1} von {quiz4MatrixItems.length}
            </span>
            {(q4Index > 0 || q4Feedback) && (
              <button
                onClick={handleResetQ4}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 4 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        {/* Current card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
            Pflegerische Maßnahme
          </span>
          <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
            „{quiz4MatrixItems[q4Index].text}“
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => handleQ4Sort('symptom')}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-600 hover:text-white transition-all text-center flex flex-col items-center justify-center"
          >
            <h5 className="font-extrabold text-sm mb-1">Symptomorientierte Hilfe</h5>
            <span className="text-[11px] opacity-80">Wärme, Vitalwerte, Validierung</span>
          </button>

          <button
            onClick={() => handleQ4Sort('info')}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-600 hover:text-white transition-all text-center flex flex-col items-center justify-center"
          >
            <h5 className="font-extrabold text-sm mb-1">Informationssammlung</h5>
            <span className="text-[11px] opacity-80">Akte, Trigger, Vorerfahrung</span>
          </button>

          <button
            onClick={() => handleQ4Sort('angehoerige')}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-teal-200 bg-teal-50/60 hover:bg-teal-600 hover:text-white transition-all text-center flex flex-col items-center justify-center"
          >
            <h5 className="font-extrabold text-sm mb-1">Angehörige als Ressource</h5>
            <span className="text-[11px] opacity-80">Ruhige Begleitung, Telefonat</span>
          </button>
        </div>

        {q4Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q4Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex-1">
              <strong className="block font-bold mb-1">
                {q4Feedback.isCorrect ? 'Richtig zugeordnet!' : 'Überprüfung nötig:'}
              </strong>
              <span>{q4Feedback.text}</span>
              <div className="mt-3">
                {q4Index < quiz4MatrixItems.length - 1 && (
                  <button
                    onClick={handleNextQ4}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Nächstes Kärtchen einordnen
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 5: Troubleshooting & Hygiene (Fehler-Radar im Patientenzimmer) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
              5
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 5: Troubleshooting & Hygiene – Fehler-Radar im Patientenzimmer
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
              Multiple-Response
            </span>
            {(q5SelectedErrors.length > 0 || q5Feedback) && (
              <button
                onClick={handleResetQ5}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 5 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs sm:text-sm text-slate-700">
          <strong>Fall:</strong> Sie möchten den Angst-Patienten Herrn V. bestmöglich pflegerisch betreuen. Welche der folgenden gut gemeinten Maßnahmen sind <strong>fehlerhaft oder sogar gefährlich</strong>? <em>(Wählen Sie alle zutreffenden Fehler aus)</em>
        </div>

        <div className="space-y-3">
          {quiz5ErrorRadarItems.map((item) => {
            const isSelected = q5SelectedErrors.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => toggleQ5Select(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                  isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <span className="font-bold text-xs">✓</span>}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {item.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleQ5Check}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
        >
          Fehler-Radar auswerten
        </button>

        {q5Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q5Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q5Feedback.isCorrect ? 'Ausgezeichnet gelöst! ' : 'Noch unvollständig: '}</strong>
            {q5Feedback.text}
          </div>
        )}
      </div>

      {/* Pfeil-Leitung zu Schritt 4: Simulation */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="h-6 w-0.5 bg-rose-300"></div>
        <div className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 shadow-xs flex items-center space-x-1.5 my-1">
          <span>Weiter zu Schritt 4: Interaktive Praxis-Simulation</span>
          <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="h-6 w-0.5 bg-rose-300"></div>
      </div>

      {/* SCHRITT 4: Launch Simulation Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 block mb-1">
            Schritt 4: Praxistest & Verzweigtes Szenario
          </span>
          <h3 className="text-2xl font-bold">
            Die Simulation: Frau Meinhardts Ängste vor OP
          </h3>
          <p className="text-slate-200 text-sm mt-1 max-w-xl">
            Übernehmen Sie die Verantwortung auf Station 3B. Überwachen Sie Vitalzeichen in Echtzeit, steuern Sie das Angst- und Vertrauenslevel und setzen Sie den Digitalen Notfallkoffer gezielt ein!
          </p>
        </div>
        <button
          onClick={onStartSimulation}
          className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Simulation jetzt starten</span>
        </button>
      </div>
    </div>
  );
};
