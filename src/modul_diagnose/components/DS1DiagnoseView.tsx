import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Droplet, 
  Eye, 
  Flame, 
  Stethoscope, 
  Crosshair, 
  Layers, 
  ChevronRight, 
  AlertCircle, 
  RotateCcw, 
  Bot, 
  BookOpen,
  Award,
  Check,
  X,
  Target
} from 'lucide-react';
import { 
  diagnoseMedia, 
  cholezystoOverview, 
  sixFItems, 
  hotspots, 
  redFlagCards, 
  pfaActions, 
  clozeAnatomy, 
  therapyMatching 
} from '../data/diagnoseData';
import { playSound } from '../../modul_angst/utils/audio';

interface Props {
  unlockedNuggets: string[];
  completedQuizzes?: string[];
  onUnlockNugget: (nuggetId: string) => void;
  onCompleteQuiz?: (quizId: string) => void;
  onGoToSimulation: () => void;
  onViewNuggets?: () => void;
}

interface Quiz2Question {
  id: string;
  question: string;
  targetHotspotId: string;
  hint: string;
  explanation: string;
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUIZ2_QUESTIONS: Quiz2Question[] = [
  {
    id: 'q2_ruq',
    question: 'Frau Meinhardt erleidet eine akute Gallenkolik: Die Gallenblasenwand kontrahiert krampfhaft gegen einen festsitzenden Stein. Wo lokalisiert sie das primäre Schmerzzentrum mit krampfartigen, stechenden Wellenschmerzen (Dauer meist 15–60 Minuten)?',
    targetHotspotId: 'hs_ruq',
    hint: 'Achten Sie auf den rechten Oberbauch (RUQ) direkt unter dem rechten Rippenbogen unterhalb der Leber.',
    explanation: 'Exakt lokalisiert! Im rechten oberen Quadranten (RUQ) unterhalb der Leber liegt die Gallenblase. Die glatte Muskulatur zieht sich krampfhaft zusammen, um die Galle gegen den verklemmten Stein in den Zwölffingerdarm zu pressen. Typischerweise hält der Kolikschmerz 15 bis 60 Minuten an.'
  },
  {
    id: 'q2_shoulder',
    question: 'Wohin strahlt der Kolikschmerz durch reflektorische Weiterleitung über sensible Fasern des Nervus phrenicus (Head\'sche Zone, C3–C5) typischerweise aus?',
    targetHotspotId: 'hs_shoulder',
    hint: 'Sensible Fasern des Zwerchfellnervs projizieren den viszeralen Reiz nach kranial in die Schulter- und Rückenregion.',
    explanation: 'Richtig lokalisiert! Die Reizung des Peritoneums und des N. phrenicus projiziert den Schmerz reflektorisch in die rechte Schulter, das Schulterblatt und den Rücken. Viele Patientinnen deuten diese Beschwerden zunächst fälschlich als Muskelverspannung.'
  },
  {
    id: 'q2_gi',
    question: 'Welche vegetativen Begleitsymptome löst der viszerale Dehnungs- und Schmerzreiz im oberen Verdauungstrakt während der Kolik aus?',
    targetHotspotId: 'hs_gi',
    hint: 'Viszerale Afferenzen triggern das Brechzentrum und funktionelle Magen-Darm-Störungen.',
    explanation: 'Hervorragend erkannt! Starke Übelkeit, reflektorisches Erbrechen, Völlegefühl und Meteorismus (Blähungen) begleiten die Kolik. Wichtiger Pflegehinweis: Im Unterschied zu einer Magen-Darm-Grippe bringt Erbrechen bei einer Gallenkolik keine spürbare Schmerzentlastung!'
  },
  {
    id: 'q2_eyes',
    question: 'Ein Gallenstein verstopft den Hauptgallengang (Ductus choledochus) und die Galle staut sich bis in die Leber zurück. Welches sichtbare Leitsymptom an Augen und Haut signalisiert den Übertritt des Gallenfarbstoffs Bilirubin ins Blut?',
    targetHotspotId: 'hs_eyes',
    hint: 'Achten Sie auf das Augenweiß (Skleren) und die Gesichtshaut bei akutem Abflussstau des Bilirubins.',
    explanation: 'Perfekt erkannt! Bei Verstopfung des Gallengangs kann das Bilirubin (Abbauprodukt von Erythrozyten) nicht in den Darm abfließen und tritt ins Blut über. Dies führt zu Gelbfärbung des Augenweiß (Sklerenikterus) und der Haut (Ikterus). Zudem färbt sich der Urin bierbraun und der Stuhl hell entfärbt (Acholie)!'
  }
];

export const DS1DiagnoseView: React.FC<Props> = ({
  unlockedNuggets,
  completedQuizzes = [],
  onUnlockNugget,
  onCompleteQuiz,
  onGoToSimulation,
  onViewNuggets
}) => {
  // First-nugget spotlight modal
  const [showFirstNuggetModal, setShowFirstNuggetModal] = useState<boolean>(false);
  const [recentNuggetTitle, setRecentNuggetTitle] = useState<string>('');

  // Station completion tracking
  const [completedStations, setCompletedStations] = useState<Record<string, boolean>>(() => {
    return {
      station1: unlockedNuggets.includes('nugget_station1_patho'),
      station2: unlockedNuggets.includes('nugget_station2_article'),
      station3: unlockedNuggets.includes('nugget_station3_surgery')
    };
  });

  const triggerNuggetUnlock = (id: string, title: string) => {
    const isFirstEver = unlockedNuggets.length === 0;
    onUnlockNugget(id);
    if (isFirstEver) {
      setRecentNuggetTitle(title);
      setShowFirstNuggetModal(true);
      playSound('unlock');
    } else {
      playSound('success');
    }
  };

  const handleCompleteStation = (stationKey: 'station1' | 'station2' | 'station3', nuggetId: string, title: string) => {
    setCompletedStations(prev => ({ ...prev, [stationKey]: true }));
    triggerNuggetUnlock(nuggetId, title);
  };

  // Quiz 1: 6-F-Regel with robust Fisher-Yates shuffle
  const [q1Seed, setQ1Seed] = useState<number>(1);
  const shuffledTerms = useMemo(() => {
    return fisherYatesShuffle(sixFItems);
  }, [q1Seed]);

  const shuffledDescriptions = useMemo(() => {
    return fisherYatesShuffle(sixFItems);
  }, [q1Seed]);

  const [selected6FTerm, setSelected6FTerm] = useState<string | null>(null);
  const [matched6FPairs, setMatched6FPairs] = useState<Record<string, string>>({});
  const [q1Feedback, setQ1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 2: Symptom-Körper Challenge
  const [q2CurrentIndex, setQ2CurrentIndex] = useState<number>(0);
  const [q2AnsweredCorrectly, setQ2AnsweredCorrectly] = useState<string[]>([]);
  const [q2Feedback, setQ2Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [activeHotspotHover, setActiveHotspotHover] = useState<string | null>(null);

  // Quiz 3: Ausscheidungs-Labor
  const [selectedUrin, setSelectedUrin] = useState<'dunkel' | 'hell' | null>(null);
  const [selectedStuhl, setSelectedStuhl] = useState<'dunkel' | 'hell' | null>(null);
  const [q3Feedback, setQ3Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 4: Normal oder Notfall
  const [q4Index, setQ4Index] = useState<number>(0);
  const [q4Feedback, setQ4Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 5: PFA-Handlungs-Check
  const [q5Index, setQ5Index] = useState<number>(0);
  const [q5Feedback, setQ5Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 6: Lückentext with randomized dropdown options
  const [q6Seed, setQ6Seed] = useState<number>(1);
  const shuffledQ6Options = useMemo(() => {
    const res: Record<string, string[]> = {};
    clozeAnatomy.parts.forEach(part => {
      if (part.key && part.options) {
        res[part.key] = fisherYatesShuffle([...part.options]);
      }
    });
    return res;
  }, [q6Seed]);
  const [q6Selections, setQ6Selections] = useState<Record<string, string>>({});
  const [q6Feedback, setQ6Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 7: Therapie-Zuordnung with shuffled steps & solutions
  const [q7Seed, setQ7Seed] = useState<number>(1);
  const shuffledQ7Steps = useMemo(() => {
    return fisherYatesShuffle([...therapyMatching]);
  }, [q7Seed]);
  const shuffledQ7Solutions = useMemo(() => {
    return fisherYatesShuffle(therapyMatching.map(t => t.solution));
  }, [q7Seed]);
  const [q7SelectedStep, setQ7SelectedStep] = useState<string | null>(null);
  const [q7MatchedPairs, setQ7MatchedPairs] = useState<Record<string, string>>({});
  const [q7Feedback, setQ7Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Handlers Quiz 1 (6-F)
  const handle6FMatch = (germanDesc: string) => {
    if (!selected6FTerm) return;
    const targetItem = sixFItems.find(item => item.term === selected6FTerm);
    if (!targetItem) return;

    if (targetItem.germanDescription === germanDesc) {
      playSound('success');
      const updated = { ...matched6FPairs, [selected6FTerm]: germanDesc };
      setMatched6FPairs(updated);
      setSelected6FTerm(null);
      setQ1Feedback({
        isCorrect: true,
        text: `Korrekt! ${targetItem.term} = ${targetItem.germanDescription}. ${targetItem.explanation}`
      });

      if (Object.keys(updated).length === sixFItems.length) {
        triggerNuggetUnlock('nugget_6f', 'Die 6-F-Regel der Gallensteinentstehung');
        onCompleteQuiz?.('q1');
      }
    } else {
      playSound('error');
      setQ1Feedback({
        isCorrect: false,
        text: `Nicht passend für "${selected6FTerm}". Überlegen Sie genau: Welche klinische Bedeutung hat dieser englische Begriff?`
      });
    }
  };

  const handleResetQ1 = () => {
    setSelected6FTerm(null);
    setMatched6FPairs({});
    setQ1Feedback(null);
    setQ1Seed(prev => prev + 1);
    playSound('pop');
  };

  // Handlers Quiz 2 (Hotspot Challenge)
  const handleHotspotClick = (hsId: string) => {
    const currentQ = QUIZ2_QUESTIONS[q2CurrentIndex];
    if (!currentQ) return;

    if (hsId === currentQ.targetHotspotId) {
      playSound('success');
      const updated = [...q2AnsweredCorrectly, hsId];
      setQ2AnsweredCorrectly(updated);
      setQ2Feedback({
        isCorrect: true,
        text: currentQ.explanation
      });

      if (updated.length === QUIZ2_QUESTIONS.length) {
        triggerNuggetUnlock('nugget_symptoms', 'Symptom-Topographie & Head-Zonen');
        onCompleteQuiz?.('q2');
      }
    } else {
      playSound('error');
      setQ2Feedback({
        isCorrect: false,
        text: `Nicht ganz! ${currentQ.hint}`
      });
    }
  };

  const handleNextQ2Question = () => {
    setQ2Feedback(null);
    if (q2CurrentIndex < QUIZ2_QUESTIONS.length - 1) {
      setQ2CurrentIndex(prev => prev + 1);
    }
  };

  const handleResetQ2 = () => {
    setQ2CurrentIndex(0);
    setQ2AnsweredCorrectly([]);
    setQ2Feedback(null);
    playSound('pop');
  };

  // Handlers Quiz 3 (Ausscheidung)
  const handleQ3Check = () => {
    if (!selectedUrin || !selectedStuhl) return;
    const isCorrect = selectedUrin === 'dunkel' && selectedStuhl === 'hell';
    if (isCorrect) {
      playSound('unlock');
      setQ3Feedback({
        isCorrect: true,
        text: 'Exzellent! Durch den Gallenstau fehlt Bilirubin im Darm (Stuhl wird hell/lehmfarben entfärbt, da kein Sterkobilin entsteht). Gleichzeitig staut sich das Bilirubin ins Blut zurück und wird über die Nieren filtriert (Urin wird auffällig dunkel/bierbraun).'
      });
      triggerNuggetUnlock('nugget_excretion', 'Ausscheidungs-Befunde bei Gallenstau');
      onCompleteQuiz?.('q3');
    } else {
      playSound('error');
      setQ3Feedback({
        isCorrect: false,
        text: 'Überlegen Sie: Wo staut sich der braun-gelbe Gallenfarbstoff (Bilirubin) hin, wenn der Abfluss in den Darm blockiert ist? Urin wird dunkel (Bilirubinurie), während der Stuhl mangels Sterkobilin lehmfarben entfärbt bleibt.'
      });
    }
  };

  const handleResetQ3 = () => {
    setSelectedUrin(null);
    setSelectedStuhl(null);
    setQ3Feedback(null);
    playSound('pop');
  };

  // Handlers Quiz 4 (Swipe Cards)
  const handleQ4Answer = (isEmergencyChoice: boolean) => {
    const card = redFlagCards[q4Index];
    const isCorrect = card.isEmergency === isEmergencyChoice;

    if (isCorrect) {
      playSound('pop');
      setQ4Feedback({ isCorrect: true, text: card.explanation });
      if (q4Index === redFlagCards.length - 1) {
        triggerNuggetUnlock('nugget_redflags', 'Red Flags: Wann wird die Kolik zum Notfall?');
        onCompleteQuiz?.('q4');
      }
    } else {
      playSound('error');
      setQ4Feedback({ isCorrect: false, text: card.explanation });
    }
  };

  const handleNextQ4 = () => {
    setQ4Feedback(null);
    if (q4Index < redFlagCards.length - 1) {
      setQ4Index(prev => prev + 1);
    }
  };

  const handleResetQ4 = () => {
    setQ4Index(0);
    setQ4Feedback(null);
    playSound('pop');
  };

  // Handlers Quiz 5 (PFA Actions)
  const handleQ5Answer = (userSaidCorrect: boolean) => {
    const action = pfaActions[q5Index];
    const isCorrect = action.isCorrect === userSaidCorrect;

    if (isCorrect) {
      playSound('pop');
      setQ5Feedback({ isCorrect: true, text: action.explanation });
      if (q5Index === pfaActions.length - 1) {
        playSound('unlock');
        onCompleteQuiz?.('q5');
      }
    } else {
      playSound('error');
      setQ5Feedback({ isCorrect: false, text: action.explanation });
    }
  };

  const handleNextQ5 = () => {
    setQ5Feedback(null);
    if (q5Index < pfaActions.length - 1) {
      setQ5Index(prev => prev + 1);
    }
  };

  const handleResetQ5 = () => {
    setQ5Index(0);
    setQ5Feedback(null);
    playSound('pop');
  };

  // Handlers Quiz 6 (Lückentext)
  const handleQ6Submit = () => {
    const partsWithKeys = clozeAnatomy.parts.filter(p => p.key);
    let allRight = true;
    for (const p of partsWithKeys) {
      if (q6Selections[p.key!] !== p.correct) {
        allRight = false;
        break;
      }
    }

    if (allRight) {
      playSound('unlock');
      setQ6Feedback({
        isCorrect: true,
        text: 'Perfekt gelöst! Die Leber bildet täglich bis zu 1 Liter Galle, die Gallenblase speichert und dickt ein, Galle verdaut Fette, und Konkremente bestehen zu ca. 80% aus Cholesterin (Cholezystolithiasis).'
      });
      triggerNuggetUnlock('nugget_anatomy', 'Anatomie, Gallebildung & Cholesterin');
      onCompleteQuiz?.('q6');
    } else {
      playSound('error');
      setQ6Feedback({
        isCorrect: false,
        text: 'Einige anatomische oder physiologische Begriffe stimmen noch nicht. Prüfen Sie die Bildungsstätte der Galle und den chemischen Hauptbestandteil westlicher Gallensteine.'
      });
    }
  };

  const handleResetQ6 = () => {
    setQ6Selections({});
    setQ6Feedback(null);
    setQ6Seed(prev => prev + 1);
    playSound('pop');
  };

  // Handlers Quiz 7 (Therapie-Matching)
  const handleQ7Match = (solution: string) => {
    if (!q7SelectedStep) return;
    const pair = therapyMatching.find(p => p.id === q7SelectedStep);
    if (!pair) return;

    if (pair.solution === solution) {
      playSound('success');
      const updated = { ...q7MatchedPairs, [q7SelectedStep]: solution };
      setQ7MatchedPairs(updated);
      setQ7SelectedStep(null);
      setQ7Feedback({ isCorrect: true, text: `${pair.step}: ${pair.explanation}` });

      if (Object.keys(updated).length === therapyMatching.length) {
        triggerNuggetUnlock('nugget_therapy', 'PFA-Handlungspfad & Cholezystektomie');
        onCompleteQuiz?.('q7');
      }
    } else {
      playSound('error');
      setQ7Feedback({
        isCorrect: false,
        text: 'Diese Maßnahme passt nicht zu diesem Behandlungsschritt. Denken Sie an die Leitlinienkriterien bei asymptomatischen Steinen, die Notfall-Antibiose bei Entzündung und die elektive OP bei Koliken.'
      });
    }
  };

  const handleResetQ7 = () => {
    setQ7SelectedStep(null);
    setQ7MatchedPairs({});
    setQ7Feedback(null);
    setQ7Seed(prev => prev + 1);
    playSound('pop');
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* SPOTLIGHT MODAL: Erstes Wissensnugget freigeschaltet */}
      {showFirstNuggetModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-indigo-200 space-y-5 animate-in zoom-in-95 duration-250 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-white">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                🎉 Erstes Wissensnugget freigeschaltet!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Fachdatenbank aktiviert
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
                Sie haben soeben Ihr erstes Learning Nugget gesichert:
                <strong className="block text-indigo-950 font-bold mt-1 mb-1">
                  „{recentNuggetTitle || 'Pathophysiologie der Cholezystolithiasis'}“
                </strong>
                Hier werden alle gesicherten Kerninhalte aus Lehrvideos und Fachartikeln kompakt aufbereitet. Sie können die Fachdatenbank oben über den Reiter <em>Learning Nuggets</em> oder in der linken Navigationsleiste aufrufen, um vor und während der Quizzes Definitionen nachzuschlagen!
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onViewNuggets && (
                <button
                  onClick={() => {
                    setShowFirstNuggetModal(false);
                    onViewNuggets();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Zur Fachdatenbank ansehen
                </button>
              )}
              <button
                onClick={() => setShowFirstNuggetModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                Verstanden, weiter im Training
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER & LEARNING OBJECTIVE (No PFA-Niveau label) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-indigo-200/80">
              <span>Doppelstunde 1 / DS 1 (90 Minuten) • Theorie & Quizzes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cholezystolithiasis & Cholezystektomie erarbeiten
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
              <strong className="text-slate-900">Lernziel:</strong> Die Pflegefachassistenz stellt keine medizinischen Diagnosen, sondern beobachtet Symptome, erkennt Warnsignale (Red Flags), erfasst Schmerzcharakteristika und leitet Informationen fachgerecht weiter.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/80 rounded-2xl p-4 text-center sm:text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 block">
              Struktur DS 1
            </span>
            <span className="text-xs font-black text-indigo-950">
              Station 1 ➔ 2 ➔ 3 ➔ 7 Quizzes
            </span>
          </div>
        </div>

        {/* VISUELLE FÜHRUNG (Step Indicator) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-3">
            Didaktische Reihenfolge in Doppelstunde 1:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {/* Step 1 */}
            <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
              completedStations.station1
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-white border-indigo-200 text-slate-800'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                completedStations.station1 ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {completedStations.station1 ? '✓' : '1'}
              </div>
              <div className="min-w-0">
                <strong className="block truncate font-bold">Station 1: Video</strong>
                <span className="text-[10px] text-slate-500 block truncate">Dr. Weigl (13:30)</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
              completedStations.station2
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-white border-indigo-200 text-slate-800'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                completedStations.station2 ? 'bg-emerald-600 text-white' : 'bg-teal-600 text-white'
              }`}>
                {completedStations.station2 ? '✓' : '2'}
              </div>
              <div className="min-w-0">
                <strong className="block truncate font-bold">Station 2: Fachartikel</strong>
                <span className="text-[10px] text-slate-500 block truncate">gesund.bund.de</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
              completedStations.station3
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-white border-indigo-200 text-slate-800'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                completedStations.station3 ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white'
              }`}>
                {completedStations.station3 ? '✓' : '3'}
              </div>
              <div className="min-w-0">
                <strong className="block truncate font-bold">Station 3: OP-Film</strong>
                <span className="text-[10px] text-slate-500 block truncate">lap. CE (Chirurgie)</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl border bg-white border-indigo-200 text-slate-800 flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                4
              </div>
              <div className="min-w-0">
                <strong className="block truncate font-bold">Station 4: 7 Quizzes</strong>
                <span className="text-[10px] text-slate-500 block truncate">Wissensprüfung</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 MULTIMEDIALE STATIONEN */}
      <div className="space-y-8">
        {/* STATION 1: Video 1 Dr. Weigl (Duration: ca. 13:30 Min, full width video, button below) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Station 1 • Lehrvideo Pathophysiologie
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {diagnoseMedia.videoMain.title}
                </h3>
              </div>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full font-bold self-start sm:self-center">
              Dauer: ca. 13:30 Min. • Dr. Weigl
            </span>
          </div>

          {/* Arbeitsauftrag 1 */}
          <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 text-xs sm:text-sm text-indigo-950">
            <div className="font-bold flex items-center space-x-2 text-indigo-900 mb-1">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Arbeitsauftrag 1: Video vollständig ansehen & Pathophysiologie erfassen</span>
            </div>
            <p className="leading-relaxed text-indigo-950/90">
              Sehen Sie sich das Lehrvideo von Dr. Weigl aufmerksam und vollständig an (ca. 13:30 Minuten). Erstellen Sie freiwillig eine Zusammenfassung, der wichtigsten Inhalte.
            </p>
          </div>

          {/* Full Width Video Embed without awkward side box */}
          <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-200">
              <iframe
                src={diagnoseMedia.videoMain.url}
                title={diagnoseMedia.videoMain.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Actions directly underneath video */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <a
                href={diagnoseMedia.videoMain.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auf YouTube öffnen</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Active station 1 confirmation action card with clear user guidance */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-amber-50/90 border-amber-300 text-amber-950">
                <span className="text-base animate-bounce">👉</span>
                <span>
                  {completedStations.station1
                    ? 'Station 1 erfolgreich gesichert. Fahren Sie mit Station 2 fort.'
                    : 'Auftrag erledigt? Klicken Sie hier, um Station 1 zu sichern und das Wissensnugget freizuschalten!'}
                </span>
              </div>

              <button
                onClick={() => handleCompleteStation('station1', 'nugget_station1_patho', 'Station 1: Pathophysiologie & Kolik')}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-md flex-shrink-0 ${
                  completedStations.station1
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-400 shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 ring-4 ring-amber-300 animate-pulse shadow-amber-500/30'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${completedStations.station1 ? 'text-white' : 'text-slate-950'}`} />
                <span>
                  {completedStations.station1
                    ? '✓ Station 1 gesichert (Wissensnugget 1 im Speicher)'
                    : 'Station 1 gesichert (Jetzt bestätigen)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Visuelle Führung / Pfeil zu Station 2 */}
        <div className="flex flex-col items-center justify-center py-2 space-y-1">
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-extrabold shadow-xs">
            <span>Weiter zu Station 2</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-90 text-indigo-600 animate-bounce" />
          </div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-300 to-teal-400 rounded-full" />
        </div>

        {/* STATION 2: Fachartikel der Bundesregierung (gesund.bund.de) - Wiederholung & Ergebnissicherung */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Station 2 • Fachartikel der Bundesregierung
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {diagnoseMedia.sourceGesundBund.title}
                </h3>
              </div>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold self-start sm:self-center">
              Offizielles Portal: gesund.bund.de
            </span>
          </div>

          {/* Arbeitsauftrag 2 */}
          <div className="bg-teal-50/90 border border-teal-200 rounded-2xl p-4 text-xs sm:text-sm text-teal-950">
            <div className="font-bold flex items-center space-x-2 text-teal-900 mb-1">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Arbeitsauftrag 2: Fachartikel zur Wiederholung & Ergebnissicherung lesen</span>
            </div>
            <p className="leading-relaxed text-teal-950/90">
              Der offizielle Fachartikel des Bundesministeriums für Gesundheit enthält die gleichen fachlichen Kerninformationen wie das Lehrvideo aus Station 1. Er bietet Ihnen einen zweiten, textbasierten medialen Zugang und dient der <strong>vollständigen Wiederholung und nachhaltigen Ergebnissicherung</strong>. Lesen Sie den Artikel aufmerksam und vollständig durch.
            </p>
          </div>

          {/* Clean Portal Card */}
          <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                  Offizielle Quelle
                </span>
                <span className="text-xs text-slate-500 font-medium">Bundesministerium für Gesundheit</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                Gallensteine: Ursachen, Diagnostik und Behandlungsmöglichkeiten
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Umfassende wissenschaftliche Zusammenfassung zu Risikogruppen, Häufigkeiten und der Frage: Wann müssen Steine operiert werden und wann reichen Beobachtungen aus?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
              <a
                href={diagnoseMedia.sourceGesundBund.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Fachartikel auf gesund.bund.de öffnen</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>
          </div>

          {/* Active station 2 confirmation action card with clear user guidance */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-amber-50/90 border-amber-300 text-amber-950">
              <span className="text-base animate-bounce">👉</span>
              <span>
                {completedStations.station2
                  ? 'Station 2 erfolgreich gesichert. Fahren Sie mit Station 3 fort.'
                  : 'Artikel gelesen? Klicken Sie hier, um Station 2 zu sichern und das Wissensnugget freizuschalten!'}
              </span>
            </div>

            <button
              onClick={() => handleCompleteStation('station2', 'nugget_station2_article', 'Station 2: Leitlinienartikel Bundesgesundheitsportal')}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-md flex-shrink-0 ${
                completedStations.station2
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-400 shadow-emerald-600/20'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 ring-4 ring-amber-300 animate-pulse shadow-amber-500/30'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${completedStations.station2 ? 'text-white' : 'text-slate-950'}`} />
              <span>
                {completedStations.station2
                  ? '✓ Station 2 gesichert (Wissensnugget 2 im Speicher)'
                  : 'Station 2 gesichert (Jetzt bestätigen)'}
              </span>
            </button>
          </div>
        </div>

        {/* Visuelle Führung / Pfeil zu Station 3 */}
        <div className="flex flex-col items-center justify-center py-2 space-y-1">
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-extrabold shadow-xs">
            <span>Weiter zu Station 3 (OP-Dokumentation)</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-90 text-teal-600 animate-bounce" />
          </div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-teal-300 to-purple-400 rounded-full" />
        </div>

        {/* STATION 3: Video 2 Laparoskopische Cholezystektomie (Attractive Clickable YouTube Preview Card) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  Station 3 • OP-Dokumentation
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Exemplarische laparoskopische Cholezystektomie (lap. CE)
                </h3>
              </div>
            </div>
            <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-full font-bold self-start sm:self-center">
              Dauer: ca. 15:00 Min. • Minimal-invasiver Goldstandard (Schlüsselloch-OP)
            </span>
          </div>

          {/* Arbeitsauftrag 3 */}
          <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-4 text-xs sm:text-sm text-purple-950">
            <div className="font-bold flex items-center space-x-2 text-purple-900 mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Arbeitsauftrag 3: Operativen Ablauf der exemplarischen lap. CE ansehen</span>
            </div>
            <p className="leading-relaxed text-purple-950/90">
              Sehen Sie sich das OP-Video zur <strong>laparoskopischen Cholezystektomie (lap. CE)</strong> auf YouTube an.
            </p>
          </div>

          {/* High-quality Clickable YouTube Poster Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white border border-purple-400/20 shadow-lg space-y-5">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-purple-200 border border-white/10">
                  <Play className="w-3.5 h-3.5 text-purple-300 fill-current" />
                  <span>Chirurgische OP-Dokumentation (YouTube)</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Laparoskopische Cholezystektomie in 4 Schritten
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Aufgrund von Einbettungsbeschränkungen des Videoanbieters wird dieses Video direkt in einem neuen YouTube-Tab geöffnet. Bitte sehen Sie sich die Station an (ca. 15 Min.) und sichern Sie anschließend Ihr Wissensnugget.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 w-full sm:w-auto flex-shrink-0">
                <a
                  href="https://youtu.be/hueATDhHfLg?si=-4l67NOoye-Ub1-Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2.5 active:scale-98 group"
                >
                  <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  <span>Video auf YouTube starten</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>
              </div>
            </div>

            {/* Active station 3 confirmation action card with clear user guidance */}
            <div className="relative z-10 pt-3 border-t border-purple-400/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-amber-500/15 border-amber-400/30 text-amber-200">
                <span className="text-base animate-bounce">👉</span>
                <span>
                  {completedStations.station3
                    ? 'Station 3 erfolgreich gesichert. Fahren Sie mit den Quizzes fort.'
                    : 'OP-Video angesehen? Klicken Sie hier, um Station 3 zu sichern und das Wissensnugget freizuschalten!'}
                </span>
              </div>

              <button
                onClick={() => handleCompleteStation('station3', 'nugget_station3_surgery', 'Station 3: Laparoskopische Cholezystektomie (lap. CE)')}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-md flex-shrink-0 ${
                  completedStations.station3
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-400 shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 ring-4 ring-amber-300 animate-pulse shadow-amber-500/30'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${completedStations.station3 ? 'text-white' : 'text-slate-950'}`} />
                <span>
                  {completedStations.station3
                    ? '✓ Station 3 gesichert (Wissensnugget 3 im Speicher)'
                    : 'Station 3 gesichert (Jetzt bestätigen)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Visuelle Führung / Pfeil zu Station 4 (Quizzes) */}
        <div className="flex flex-col items-center justify-center py-4 space-y-1">
          <div className="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 text-purple-950 text-xs font-black shadow-sm">
            <span>Alle 3 Medienstationen absolviert ➔ Weiter zu Station 4 (7 Diagnose-Quizzes)</span>
            <ArrowRight className="w-4 h-4 rotate-90 text-purple-700 animate-bounce" />
          </div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full" />
        </div>
      </div>

      {/* QUIZ SECTION HEADER */}
      <div className="text-center pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
          Station 4 • Interaktive Wissensüberprüfung
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          7 Diagnose-Quizzes für die Pflegefachassistenz
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto mt-1 leading-relaxed">
          Lösen Sie die Quizzes, um direktes Feedback zu erhalten und wertvolle Wissenskarten in Ihrer Fachdatenbank freizuschalten.
        </p>
      </div>

      {/* QUIZ 1: Die 6-F-Regel (SHUFFLED choices, Forty check, Neustart-Button) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              1
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 1: Die „6-F-Regel“ der Gallenstein-Risikofaktoren
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(matched6FPairs).length} von 6 zugeordnet
            </span>
            <button
              onClick={handleResetQ1}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 1 neu mischen und wiederholen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Wählen Sie links ein englisches „F“ aus und ordnen Sie rechts die passende deutsche klinische Beschreibung zu (Kacheln sind durchmischt).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Shuffled terms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {shuffledTerms.map(item => {
              const isMatched = !!matched6FPairs[item.term];
              const isSelected = selected6FTerm === item.term;

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => {
                    setSelected6FTerm(item.term);
                    setQ1Feedback(null);
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold opacity-75'
                      : isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-lg ring-2 ring-indigo-400'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 font-bold text-slate-800 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className="text-base sm:text-lg block tracking-wide">{item.term}</span>
                  {isMatched && (
                    <span className="text-[10px] text-emerald-700 block font-normal mt-0.5">
                      ✓ Zugeordnet
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Shuffled descriptions */}
          <div className="space-y-2">
            {shuffledDescriptions.map(item => {
              const isUsed = Object.values(matched6FPairs).includes(item.germanDescription);

              return (
                <button
                  key={item.id}
                  disabled={isUsed || !selected6FTerm}
                  onClick={() => handle6FMatch(item.germanDescription)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 opacity-60 cursor-default'
                      : selected6FTerm
                      ? 'bg-white border-indigo-200 hover:bg-indigo-50 hover:border-indigo-500 font-medium text-slate-800 cursor-pointer shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{item.germanDescription}</span>
                  {isUsed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {q1Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q1Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <strong>{q1Feedback.isCorrect ? 'Richtig! ' : 'Hinweis: '}</strong>
            {q1Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 2: Der "Symptom-Körper" – INTERACTIVE CLINICAL CHALLENGE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              2
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 2: Der „Symptom-Körper“ – Klinische Lokalisations-Challenge
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Aufgabe {q2CurrentIndex + 1} von {QUIZ2_QUESTIONS.length}
            </span>
            <button
              onClick={handleResetQ2}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 2 zurücksetzen und neu üben"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        {/* Current Active Question Callout */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 border-2 border-indigo-200 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Klinische Suchaufgabe #{q2CurrentIndex + 1}:</span>
            </span>
            <span className="text-xs font-bold text-slate-600">
              {q2AnsweredCorrectly.length} von 4 gelöst
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            „{QUIZ2_QUESTIONS[q2CurrentIndex]?.question}“
          </p>
          <span className="text-xs text-indigo-900/80 block italic">
            ➔ Klicken Sie auf den zutreffenden Zielpunkt auf der anatomischen Silhouette!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Body Diagram with Interactive Hotspot Buttons */}
          <div className="relative bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[380px] text-white shadow-inner overflow-hidden">
            {/* Inner body container matching SVG viewBox 200x320 */}
            <div className="relative w-[200px] h-[320px]">
              {/* SVG Silhouette representation */}
              <svg viewBox="0 0 200 320" className="w-full h-full opacity-70 filter drop-shadow">
                {/* Head */}
                <circle cx="100" cy="40" r="24" fill="#334155" stroke="#64748b" strokeWidth="2" />
                {/* Neck */}
                <rect x="92" y="64" width="16" height="16" fill="#334155" />
                {/* Torso */}
                <path d="M 60 80 L 140 80 L 132 200 L 68 200 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
                {/* Shoulders / Arms */}
                <path d="M 60 80 L 40 160 L 52 165 L 68 95" fill="#334155" />
                <path d="M 140 80 L 160 160 L 148 165 L 132 95" fill="#334155" />
                {/* Legs */}
                <rect x="72" y="200" width="22" height="110" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                <rect x="106" y="200" width="22" height="110" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              </svg>

              {/* Hotspot overlay markers */}
              {hotspots.map(hs => {
                const isCorrectlyFound = q2AnsweredCorrectly.includes(hs.id);
                const isTargetForCurrent = QUIZ2_QUESTIONS[q2CurrentIndex]?.targetHotspotId === hs.id;

                return (
                  <button
                    key={hs.id}
                    onClick={() => handleHotspotClick(hs.id)}
                    onMouseEnter={() => setActiveHotspotHover(hs.id)}
                    onMouseLeave={() => setActiveHotspotHover(null)}
                    style={{
                      left: `${hs.xPercent}%`,
                      top: `${hs.yPercent}%`
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all focus:outline-none cursor-pointer ${
                      isCorrectlyFound
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 scale-110 z-20'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse hover:scale-125 z-10'
                    }`}
                    title={hs.title}
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] text-slate-400 mt-3 font-medium">
              Klicken Sie auf den passenden Marker am Körper
            </span>
          </div>

          {/* Right Feedback & Progression Panel */}
          <div className="space-y-4">
            {q2Feedback && (
              <div className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-3 ${
                q2Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="font-bold flex items-center space-x-2">
                  {q2Feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <span>{q2Feedback.isCorrect ? 'Exakt lokalisiert!' : 'Klinischer Hinweis:'}</span>
                </div>
                <p className="leading-relaxed">{q2Feedback.text}</p>

                {q2Feedback.isCorrect && q2CurrentIndex < QUIZ2_QUESTIONS.length - 1 && (
                  <button
                    onClick={handleNextQ2Question}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Nächste Frage (#{q2CurrentIndex + 2})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* List of already discovered symptoms */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Erkannte Schmerzzonen:
              </span>
              {hotspots.map(hs => {
                const isFound = q2AnsweredCorrectly.includes(hs.id);
                return (
                  <div
                    key={hs.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isFound
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        isFound ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isFound ? '✓' : '•'}
                      </span>
                      <div>
                        <strong className="block">{hs.title}</strong>
                        <span className="text-[10px]">{hs.symptomName}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold">
                      {isFound ? 'Gelöst' : 'Ausstehend'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ 3: Das Ausscheidungs-Labor (Answers NOT given away in preview!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              3
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 3: Das Ausscheidungs-Labor – Gallengangsverschluss & Bilirubin
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Farbdiagnostik
            </span>
            <button
              onClick={handleResetQ3}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 3 zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-medium">
          <strong>Frage:</strong> Wie verändern sich <strong>Urin</strong> und <strong>Stuhl</strong>, wenn ein Gallenstein den Hauptgallengang (Ductus choledochus) blockiert und der Gallenfarbstoff nicht mehr in den Darm abfließt?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Urin Section without revealing labels */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              1. Urinprobe auswählen:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedUrin('hell');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedUrin === 'hell'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-6 h-12 mx-auto rounded-md bg-amber-100 border border-amber-300 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Hellgelber, klarer Urin</span>
              </button>

              <button
                onClick={() => {
                  setSelectedUrin('dunkel');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedUrin === 'dunkel'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-6 h-12 mx-auto rounded-md bg-amber-900 border border-amber-950 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Dunkler, bierbrauner Urin</span>
              </button>
            </div>
          </div>

          {/* Stuhl Section without revealing labels */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              2. Stuhlprobe auswählen:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedStuhl('dunkel');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedStuhl === 'dunkel'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-12 h-6 mx-auto rounded-md bg-yellow-900 border border-yellow-950 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Braungelber, geformter Stuhl</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStuhl('hell');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedStuhl === 'hell'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-12 h-6 mx-auto rounded-md bg-stone-200 border border-stone-300 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Heller, lehmfarbener Stuhl</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleQ3Check}
          disabled={!selectedUrin || !selectedStuhl}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
        >
          Ausscheidungs-Befund prüfen
        </button>

        {q3Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q3Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <strong>{q3Feedback.isCorrect ? 'Exakt! ' : 'Korrektur: '}</strong>
            {q3Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 4: Normal oder Notfall? (Swipe / Triage-Karten) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              4
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 4: „Normal oder Notfall?“ – Triage & Red Flags
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Fall {q4Index + 1} von {redFlagCards.length}
            </span>
            <button
              onClick={handleResetQ4}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 4 zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        {/* Card stage */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-xs">
          <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-700 block mb-2">
            Patientensituation #{q4Index + 1}
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
            „{redFlagCards[q4Index].scenario}“
          </p>
        </div>

        {/* Decision buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => handleQ4Answer(false)}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-base">Normal / Harmlos</h5>
            <span className="text-xs opacity-80">Keine akute Intervention nötig</span>
          </button>

          <button
            onClick={() => handleQ4Answer(true)}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/70 hover:bg-rose-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-base">Rote Flagge / Notfall!</h5>
            <span className="text-xs opacity-80">Sofortige ärztliche Meldung</span>
          </button>
        </div>

        {q4Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q4Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex-1">
              <strong className="block font-bold mb-1">
                {q4Feedback.isCorrect ? 'Richtig triagiert!' : 'Kritische Fehleinschätzung:'}
              </strong>
              <span>{q4Feedback.text}</span>
              <div className="mt-3">
                {q4Index < redFlagCards.length - 1 && (
                  <button
                    onClick={handleNextQ4}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Nächsten Fall bewerten
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 5: PFA-Handlungs-Check */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              5
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 5: PFA-Handlungs-Check bei akuter Kolik
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Handlung {q5Index + 1} von {pfaActions.length}
            </span>
            <button
              onClick={handleResetQ5}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 5 zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center max-w-xl mx-auto shadow-xs">
          <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-700 block mb-2">
            Pflegerische Handlungsoption #{q5Index + 1}
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
            „{pfaActions[q5Index].actionText}“
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => handleQ5Answer(true)}
            disabled={!!q5Feedback}
            className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
          >
            ✓ RICHTIG
          </button>
          <button
            onClick={() => handleQ5Answer(false)}
            disabled={!!q5Feedback}
            className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
          >
            ✕ FALSCH
          </button>
        </div>

        {q5Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q5Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex-1">
              <strong className="block font-bold mb-1">
                {q5Feedback.isCorrect ? 'Fachlich korrekt beantwortet!' : 'Vorsicht bei Kolikpatienten:'}
              </strong>
              <span>{q5Feedback.text}</span>
              <div className="mt-3">
                {q5Index < pfaActions.length - 1 && (
                  <button
                    onClick={handleNextQ5}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Nächste Handlung prüfen
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 6: Anatomie & Fettverdauung (Lückentext) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              6
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 6: Anatomie & Fettverdauung (Lückentext)
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              5 Fachbegriffe
            </span>
            <button
              onClick={handleResetQ6}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 6 zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {clozeAnatomy.intro}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-sm sm:text-base leading-loose text-slate-800 shadow-xs">
          {clozeAnatomy.parts.map((part, index) => {
            if (!part.key) {
              return <span key={index}>{part.text}</span>;
            }

            return (
              <span key={index} className="inline-block mx-1">
                <select
                  value={q6Selections[part.key] || ''}
                  onChange={(e) => {
                    setQ6Selections(prev => ({ ...prev, [part.key!]: e.target.value }));
                    setQ6Feedback(null);
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    q6Selections[part.key]
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  <option value="">[ Auswählen ]</option>
                  {(shuffledQ6Options[part.key] || part.options!).map((opt) => (
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
          onClick={handleQ6Submit}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
        >
          Lückentext auswerten
        </button>

        {q6Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q6Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <strong>{q6Feedback.isCorrect ? 'Ausgezeichnet! ' : 'Hinweis: '}</strong>
            {q6Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 7: Therapie & Intervention (Zuordnung) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              7
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Quiz 7: Therapie & Intervention – Zuordnung der Behandlungsschritte
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(q7MatchedPairs).length} von {therapyMatching.length} zugeordnet
            </span>
            <button
              onClick={handleResetQ7}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
              title="Quiz 7 zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal üben</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Wählen Sie links eine klinische Indikation und ordnen Sie rechts die fachgerechte Maßnahme zu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Steps (Shuffled) */}
          <div className="space-y-2.5">
            {shuffledQ7Steps.map(item => {
              const isMatched = !!q7MatchedPairs[item.id];
              const isSelected = q7SelectedStep === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => {
                    setQ7SelectedStep(item.id);
                    setQ7Feedback(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-semibold cursor-pointer ${
                    isMatched
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'
                      : isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span>{item.step}</span>
                  {isMatched && (
                    <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{q7MatchedPairs[item.id]}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Solutions (Shuffled) */}
          <div className="space-y-2.5">
            {shuffledQ7Solutions.map((solution, sIdx) => {
              const isUsed = Object.values(q7MatchedPairs).includes(solution);

              return (
                <button
                  key={sIdx}
                  disabled={isUsed || !q7SelectedStep}
                  onClick={() => handleQ7Match(solution)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60'
                      : q7SelectedStep
                      ? 'bg-white border-indigo-200 hover:bg-indigo-600 hover:text-white shadow-sm cursor-pointer'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{solution}</span>
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

        {q7Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q7Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <strong>{q7Feedback.isCorrect ? 'Korrekt! ' : 'Hinweis: '}</strong>
            {q7Feedback.text}
          </div>
        )}
      </div>

      {/* MEILENSTEIN DS 1 ABSCHLUSS & ÜBERGANG ZU DS 2 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white border border-indigo-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-teal-400/20 text-teal-300 rounded-full text-xs font-bold border border-teal-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Meilenstein erreicht: Doppelstunde 1 vollständig erarbeitet</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Theorie, Medien & Quizzes abgeschlossen!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Sie haben die pathophysiologischen Grundlagen (Video 1), das Leitlinienwissen (gesund.bund.de), das chirurgische OP-Verfahren (Video 2) sowie alle 7 Quizzes erfolgreich durchgearbeitet.
              In <strong>Doppelstunde 2</strong> folgt nun die direkte Anwendung: Befragen Sie Frau Meinhardt in der interaktiven hausärztlichen Praxis-Simulation und begleiten Sie die Feststellung der OP-Indikation!
            </p>
          </div>

          <button
            onClick={onGoToSimulation}
            className="px-6 py-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 flex-shrink-0 group cursor-pointer"
          >
            <Stethoscope className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>Weiter zu DS 2: Hausarzt-Simulation</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
