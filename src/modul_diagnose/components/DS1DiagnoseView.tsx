import React, { useState } from 'react';
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
  Bot
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
  onUnlockNugget: (nuggetId: string) => void;
  onGoToSimulation: () => void;
}

export const DS1DiagnoseView: React.FC<Props> = ({
  unlockedNuggets,
  onUnlockNugget,
  onGoToSimulation
}) => {
  // Video switcher
  const [activeVideo, setActiveVideo] = useState<'patho' | 'surgery'>('patho');

  // Quiz 1: 6-F-Regel
  const [selected6FTerm, setSelected6FTerm] = useState<string | null>(null);
  const [matched6FPairs, setMatched6FPairs] = useState<Record<string, string>>({});
  const [q1Feedback, setQ1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 2: Symptom-Körper Hotspots
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState<string[]>([]);

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

  // Quiz 6: Lückentext
  const [q6Selections, setQ6Selections] = useState<Record<string, string>>({});
  const [q6Feedback, setQ6Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Quiz 7: Therapie-Zuordnung
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
        playSound('unlock');
        onUnlockNugget('nugget_6f');
      }
    } else {
      playSound('error');
      setQ1Feedback({
        isCorrect: false,
        text: `Nicht ganz passend für "${selected6FTerm}". Bitte ordnen Sie die korrekte deutsche Übersetzung zu.`
      });
    }
  };

  // Handlers Quiz 2 (Hotspot)
  const handleHotspotClick = (hsId: string) => {
    setActiveHotspot(hsId);
    playSound('pop');
    if (!discoveredHotspots.includes(hsId)) {
      const updated = [...discoveredHotspots, hsId];
      setDiscoveredHotspots(updated);
      if (updated.length === hotspots.length) {
        playSound('unlock');
        onUnlockNugget('nugget_symptoms');
      }
    }
  };

  // Handlers Quiz 3 (Ausscheidung)
  const handleQ3Check = () => {
    if (!selectedUrin || !selectedStuhl) return;
    const isCorrect = selectedUrin === 'dunkel' && selectedStuhl === 'hell';
    if (isCorrect) {
      playSound('unlock');
      setQ3Feedback({
        isCorrect: true,
        text: 'Exzellent! Durch den Gallestau fehlt Bilirubin im Darm (Stuhl wird hell/entfärbt), während es über die Nieren filtriert wird (Urin wird bierbraun dunkel).'
      });
      onUnlockNugget('nugget_excretion');
    } else {
      playSound('error');
      setQ3Feedback({
        isCorrect: false,
        text: 'Überlegen Sie: Wo staut sich der gelb-braune Gallenfarbstoff hin, wenn er nicht in den Darm gelangen kann? (Urin = dunkel; Stuhl = entfärbt/hell).'
      });
    }
  };

  // Handlers Quiz 4 (Swipe Cards)
  const handleQ4Answer = (isEmergencyChoice: boolean) => {
    const card = redFlagCards[q4Index];
    const isCorrect = card.isEmergency === isEmergencyChoice;

    if (isCorrect) {
      playSound('pop');
      setQ4Feedback({ isCorrect: true, text: card.explanation });
      if (q4Index === redFlagCards.length - 1) {
        playSound('unlock');
        onUnlockNugget('nugget_redflags');
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

  // Handlers Quiz 5 (PFA Actions)
  const handleQ5Answer = (userSaidCorrect: boolean) => {
    const action = pfaActions[q5Index];
    const isCorrect = action.isCorrect === userSaidCorrect;

    if (isCorrect) {
      playSound('pop');
      setQ5Feedback({ isCorrect: true, text: action.explanation });
      if (q5Index === pfaActions.length - 1) {
        playSound('unlock');
        onUnlockNugget('nugget_actions');
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
        text: 'Perfekt gelöst! Leber bildet die Galle, Gallenblase speichert und dickt ein, Galle verdaut Fette, und Steine bestehen zu 80% aus Cholesterin (Cholezystolithiasis).'
      });
      onUnlockNugget('nugget_anatomy');
    } else {
      playSound('error');
      setQ6Feedback({
        isCorrect: false,
        text: 'Einige anatomische oder physiologische Begriffe stimmen noch nicht. Prüfen Sie die Bildungsstätte der Galle und den Hauptbestandteil der Steine.'
      });
    }
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
        playSound('unlock');
        onUnlockNugget('nugget_therapy');
      }
    } else {
      playSound('error');
      setQ7Feedback({
        isCorrect: false,
        text: 'Diese Maßnahme passt nicht zu diesem Behandlungsschritt. Denken Sie an die Nahrungskarenz bei akuter Kolik und die Laparoskopie bei der OP.'
      });
    }
  };

  const handleResetQ1 = () => {
    setSelected6FTerm(null);
    setMatched6FPairs({});
    setQ1Feedback(null);
    playSound('pop');
  };

  const handleResetQ2 = () => {
    setDiscoveredHotspots([]);
    setActiveHotspot(null);
    playSound('pop');
  };

  const handleResetQ3 = () => {
    setSelectedUrin(null);
    setSelectedStuhl(null);
    setQ3Feedback(null);
    playSound('pop');
  };

  const handleResetQ4 = () => {
    setQ4Index(0);
    setQ4Feedback(null);
    playSound('pop');
  };

  const handleResetQ5 = () => {
    setQ5Index(0);
    setQ5Feedback(null);
    playSound('pop');
  };

  const handleResetQ6 = () => {
    setQ6Selections({});
    setQ6Feedback(null);
    playSound('pop');
  };

  const handleResetQ7 = () => {
    setQ7SelectedStep(null);
    setQ7MatchedPairs({});
    setQ7Feedback(null);
    playSound('pop');
  };

  return (
    <div className="space-y-10">
      {/* KI-Helfer & Orientierungs-Callout */}
      <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Virtuelle Praxisanleitung & KI-Helfer</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">DS 1 bis 8</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Unser KI-Helfer steht Ihnen ab sofort in allen 4 Modulen unten links zur Verfügung (Fragen beantworten, Antworten prüfen, Wissen wiederholen).
            </p>
          </div>
        </div>
        <a
          href="https://notebook.google.com/notebook/765c9c81-5dc1-4763-b78a-af11de18c7d3"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 self-stretch sm:self-auto text-center justify-center"
        >
          <span>KI-Helfer in neuem Tab öffnen</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Top Banner & Learning Objective */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span>Doppelstunde 1 / DS 3 (90 Minuten)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cholezystolithiasis & Cholezystektomie erarbeiten
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              <strong>Lernziel (PFA-Niveau):</strong> Die Pflegefachassistenz stellt keine medizinischen Diagnosen, sondern beobachtet Symptome, erkennt Warnsignale (Red Flags) und leitet Informationen korrekt weiter.
            </p>
          </div>

          <button
            onClick={onGoToSimulation}
            className="px-5 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Zur Hausarzt-Simulation (DS 2)</span>
          </button>
        </div>

        {/* Video & Media Showcase */}
        {(() => {
          const currentVideoData = activeVideo === 'patho' ? diagnoseMedia.videoMain : diagnoseMedia.videoSurgerySim;
          return (
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Multimediale Wissensgrundlage (Videos & Leitfaden)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveVideo('patho')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeVideo === 'patho'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    1. Gallensteine Entstehung
                  </button>
                  <button
                    onClick={() => setActiveVideo('surgery')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeVideo === 'surgery'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    2. OP-Simulation Cholezystektomie
                  </button>
                  <a
                    href={currentVideoData.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0"
                    title="Aktuelles Video direkt auf YouTube öffnen"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Auf YouTube ansehen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Embedded Video or Clean Direct Link Preview */}
              {activeVideo === 'surgery' ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border-2 border-indigo-500/30 shadow-xl flex flex-col items-center justify-center p-6 text-center group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_70%)] pointer-events-none" />
                  
                  {/* Big Play Button linking directly to YouTube */}
                  <a
                    href={currentVideoData.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all mb-4 group/btn cursor-pointer"
                    title="Video auf YouTube abspielen"
                  >
                    <Play className="w-10 h-10 fill-current ml-1 text-white" />
                  </a>

                  <div className="max-w-xl space-y-2 z-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                      <span>YouTube-Video mit Einbettungsschutz</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {currentVideoData.title}
                    </h3>
                    <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 text-xs text-slate-300 text-left max-w-lg mx-auto mt-2">
                      <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Was ist hier zu tun?</span>
                      </p>
                      <p className="leading-relaxed">
                        Der Videoinhaber hat die Web-Einbettung („Playback on other websites“) auf YouTube deaktiviert, weshalb YouTube das Video in Web-Frames sperrt.
                        <strong> Klicken Sie einfach unten oder auf den roten Play-Button, um das Video direkt in bester Qualität auf YouTube zu öffnen.</strong>
                      </p>
                    </div>
                  </div>

                  <a
                    href={currentVideoData.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all z-10 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Video jetzt auf YouTube öffnen (neuer Tab)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md group">
                  <iframe
                    key={currentVideoData.url}
                    src={currentVideoData.url}
                    title={currentVideoData.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  
                  {/* Floating Quick-Access YouTube Badge */}
                  <a
                    href={currentVideoData.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-slate-900/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-1.5 shadow-lg z-10"
                  >
                    <Play className="w-3 h-3 fill-current text-red-400 group-hover:text-white" />
                    <span>Auf YouTube öffnen</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              )}

              {/* Prominente Anklickbare Linkfläche zur YouTube-Weiterleitung */}
              <a
                href={currentVideoData.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-red-50 via-slate-50 to-indigo-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all shadow-sm hover:shadow-md group text-left cursor-pointer"
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
                          {activeVideo === 'patho' ? 'Pathophysiologie' : 'Chirurgische OP-Animation'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {currentVideoData.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {activeVideo === 'surgery' 
                          ? 'Falls der YouTube-Kanal das Abspielen in Web-Frames sperrt („Video nicht verfügbar“), klicken Sie hier zur direkten Wiedergabe auf YouTube.' 
                          : currentVideoData.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex-shrink-0 self-start sm:self-center">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Auf YouTube ansehen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>

              {/* Source Link gesund.bund.de */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">
                      {diagnoseMedia.sourceGesundBund.title} ({diagnoseMedia.sourceGesundBund.source})
                    </strong>
                    <span className="text-slate-600">
                      {diagnoseMedia.sourceGesundBund.description}
                    </span>
                  </div>
                </div>
                <a
                  href={diagnoseMedia.sourceGesundBund.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 rounded-xl font-semibold text-slate-700 transition-colors flex-shrink-0 shadow-sm"
                >
                  <span>Artikel auf gesund.bund.de</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })()}
      </div>

      {/* QUIZ SECTION HEADER */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
          Interaktive Wissensüberprüfung & PFA-Beobachtung
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          7 Diagnose-Quizzes für die Pflegefachassistenz
        </h3>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-1">
          Lösen Sie die Quizzes, um direktes Feedback zu erhalten und wertvolle Learning Nuggets für Ihre spätere Stationspraxis freizuschalten.
        </p>
      </div>

      {/* QUIZ 1: Die 6-F-Regel (Drag & Drop / Puzzle) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 1: Die „6-F-Regel“ der Gallenstein-Risikofaktoren
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(matched6FPairs).length} von 6 zugeordnet
            </span>
            {Object.keys(matched6FPairs).length > 0 && (
              <button
                onClick={handleResetQ1}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 1 zurücksetzen und erneut üben"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Wählen Sie links ein englisches „F“ aus und ordnen Sie rechts die passende deutsche klinische Beschreibung zu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left terms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {sixFItems.map(item => {
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
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold opacity-75'
                      : isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-lg ring-2 ring-indigo-400'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 font-bold text-slate-800'
                  }`}
                >
                  <span className="text-lg block tracking-wide">{item.term}</span>
                  {isMatched && (
                    <span className="text-[10px] text-emerald-700 block font-normal mt-0.5">
                      ✓ Zugeordnet
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right descriptions */}
          <div className="space-y-2">
            {sixFItems.map(item => {
              const isUsed = Object.values(matched6FPairs).includes(item.germanDescription);

              return (
                <button
                  key={item.id}
                  disabled={isUsed || !selected6FTerm}
                  onClick={() => handle6FMatch(item.germanDescription)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 opacity-60 cursor-default'
                      : selected6FTerm
                      ? 'bg-white border-indigo-200 hover:bg-indigo-50 hover:border-indigo-500 font-medium text-slate-800 cursor-pointer shadow-sm'
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
            q1Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q1Feedback.isCorrect ? 'Richtig! ' : 'Hinweis: '}</strong>
            {q1Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 2: Der "Symptom-Körper" (Hotspot-Bildaufgabe) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 2: Der „Symptom-Körper“ – Schmerzlokalisation & Projektion
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {discoveredHotspots.length} von {hotspots.length} Hotspots entdeckt
            </span>
            {discoveredHotspots.length > 0 && (
              <button
                onClick={handleResetQ2}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 2 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Klicken Sie auf die Hotspots am Körper, an denen Symptome einer Gallenkolik oder eines Gallenstaus spürbar oder sichtbar werden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Body Diagram with Interactive Hotspot Buttons */}
          <div className="relative bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[360px] text-white shadow-inner overflow-hidden">
            {/* SVG Silhouette representation */}
            <svg viewBox="0 0 200 320" className="h-72 w-auto opacity-70 filter drop-shadow">
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
              const isFound = discoveredHotspots.includes(hs.id);
              const isActive = activeHotspot === hs.id;

              return (
                <button
                  key={hs.id}
                  onClick={() => handleHotspotClick(hs.id)}
                  style={{
                    left: `${hs.xPercent}%`,
                    top: `${hs.yPercent}%`
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all focus:outline-none ${
                    isActive
                      ? 'bg-rose-500 text-white ring-4 ring-rose-400 scale-125 z-20 animate-pulse'
                      : isFound
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-bounce'
                  }`}
                  title={hs.title}
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              );
            })}

            <span className="text-[11px] text-slate-400 mt-2">
              Klicken Sie auf die leuchtenden Zielpunkte am Körper
            </span>
          </div>

          {/* Right Symptom Details Panel */}
          <div className="space-y-3">
            {hotspots.map(hs => {
              const isFound = discoveredHotspots.includes(hs.id);
              const isActive = activeHotspot === hs.id;

              return (
                <div
                  key={hs.id}
                  onClick={() => handleHotspotClick(hs.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-50/90 border-rose-400 shadow-md ring-1 ring-rose-300'
                      : isFound
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-white border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center space-x-1.5">
                      <span>{hs.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({hs.bodyPart})</span>
                    </span>
                    {isFound ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Erkannt
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                        Ausstehend
                      </span>
                    )}
                  </div>
                  {isFound ? (
                    <div className="space-y-1">
                      <strong className="block text-xs text-rose-700 font-bold">
                        {hs.symptomName}
                      </strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {hs.description}
                      </p>
                      <span className="text-[11px] text-slate-500 block italic">
                        Hinweis: {hs.clinicalNote}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Klicken Sie den Hotspot am Körper an, um die Symptomatik freizuschalten.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUIZ 3: Das Ausscheidungs-Labor (Farben-Zuordnung) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 3: Das Ausscheidungs-Labor – Gallengangsverschluss & Bilirubin
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Pathologische Farbdiagnostik
            </span>
            {(selectedUrin || selectedStuhl || q3Feedback) && (
              <button
                onClick={handleResetQ3}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 3 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-medium">
          <strong>Frage:</strong> Wie verändern sich <strong>Urin</strong> und <strong>Stuhl</strong>, wenn ein Gallenstein den Hauptgallengang blockiert und der Gallenfarbstoff nicht mehr in den Darm abfließt?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Urin Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              1. Urinprobe (Nierenfiltration)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedUrin('hell');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedUrin === 'hell'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-6 h-12 mx-auto rounded-md bg-amber-100 border border-amber-300 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Hellgelb</span>
                <span className="text-[10px] text-slate-400">Normalbefund</span>
              </button>

              <button
                onClick={() => {
                  setSelectedUrin('dunkel');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedUrin === 'dunkel'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-6 h-12 mx-auto rounded-md bg-amber-900 border border-amber-950 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Dunkel / Bierbraun</span>
                <span className="text-[10px] text-slate-400">Bilirubinurie</span>
              </button>
            </div>
          </div>

          {/* Stuhl Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Stuhlprobe (Darmpassage)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedStuhl('dunkel');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedStuhl === 'dunkel'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-6 mx-auto rounded-md bg-yellow-900 border border-yellow-950 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Braungelb</span>
                <span className="text-[10px] text-slate-400">Normal (Sterkobilin)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStuhl('hell');
                  setQ3Feedback(null);
                }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedStuhl === 'hell'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-400 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-6 mx-auto rounded-md bg-stone-200 border border-stone-300 mb-2 shadow-inner" />
                <span className="text-xs block font-bold text-slate-800">Hell / Lehmfarben</span>
                <span className="text-[10px] text-slate-400">Acholisch (farblos)</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleQ3Check}
          disabled={!selectedUrin || !selectedStuhl}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
        >
          Ausscheidungs-Befund prüfen
        </button>

        {q3Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q3Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q3Feedback.isCorrect ? 'Exakt! ' : 'Korrektur: '}</strong>
            {q3Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 4: Normal oder Notfall? (Swipe / Karten) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 4: „Normal oder Notfall?“ – Triage & Red Flags
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Fall {q4Index + 1} von {redFlagCards.length}
            </span>
            {(q4Index > 0 || q4Feedback) && (
              <button
                onClick={handleResetQ4}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 4 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        {/* Card stage */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-sm">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
            Patientensituation
          </span>
          <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
            „{redFlagCards[q4Index].scenario}“
          </p>
        </div>

        {/* Decision buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => handleQ4Answer(false)}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-base">Normal / Harmlos</h5>
            <span className="text-xs opacity-80">Keine akute Intervention nötig</span>
          </button>

          <button
            onClick={() => handleQ4Answer(true)}
            disabled={!!q4Feedback}
            className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/60 hover:bg-rose-600 hover:text-white transition-all text-center flex flex-col items-center justify-center focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-base">Rote Flagge / Notfall!</h5>
            <span className="text-xs opacity-80">Sofortige ärztliche Meldung</span>
          </button>
        </div>

        {q4Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q4Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
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
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Nächsten Fall bewerten
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 5: PFA-Handlungs-Check (Richtig / Falsch) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              5
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 5: PFA-Handlungs-Check bei akuter Kolik
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              Handlung {q5Index + 1} von {pfaActions.length}
            </span>
            {(q5Index > 0 || q5Feedback) && (
              <button
                onClick={handleResetQ5}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 5 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
            Pflegerische Handlungsvariante
          </span>
          <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
            „{pfaActions[q5Index].actionText}“
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => handleQ5Answer(true)}
            disabled={!!q5Feedback}
            className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white font-bold text-sm transition-all"
          >
            ✓ RICHTIG
          </button>
          <button
            onClick={() => handleQ5Answer(false)}
            disabled={!!q5Feedback}
            className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white font-bold text-sm transition-all"
          >
            ✕ FALSCH
          </button>
        </div>

        {q5Feedback && (
          <div className={`p-4 rounded-2xl border text-sm max-w-xl mx-auto flex items-start space-x-3 ${
            q5Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
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
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Nächste Handlung prüfen
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ 6 (Ergänzung 1): Anatomie & Funktion (Lückentext) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              6
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 6: Anatomie & Fettverdauung (Lückentext)
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              5 Fachbegriffe
            </span>
            {(Object.keys(q6Selections).length > 0 || q6Feedback) && (
              <button
                onClick={handleResetQ6}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 6 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {clozeAnatomy.intro}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-sm sm:text-base leading-loose text-slate-800">
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
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    q6Selections[part.key]
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  <option value="">[ Auswählen ]</option>
                  {part.options!.map((opt) => (
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
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
        >
          Lückentext auswerten
        </button>

        {q6Feedback && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            q6Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q6Feedback.isCorrect ? 'Ausgezeichnet! ' : 'Hinweis: '}</strong>
            {q6Feedback.text}
          </div>
        )}
      </div>

      {/* QUIZ 7 (Ergänzung 2): Therapie & Intervention (Zuordnung) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              7
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Quiz 7: Therapie & Intervention – Zuordnung der Behandlungsschritte
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(q7MatchedPairs).length} von 4 zugeordnet
            </span>
            {Object.keys(q7MatchedPairs).length > 0 && (
              <button
                onClick={handleResetQ7}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                title="Quiz 7 zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nochmal üben</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Wählen Sie links eine klinische Indikation und ordnen Sie rechts die fachgerechte Maßnahme zu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Steps */}
          <div className="space-y-2.5">
            {therapyMatching.map(item => {
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
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-semibold ${
                    isMatched
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'
                      : isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span>{item.step}</span>
                  {isMatched && (
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">
                      ✓ {q7MatchedPairs[item.id]}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Solutions */}
          <div className="space-y-2.5">
            {therapyMatching.map(item => {
              const isUsed = Object.values(q7MatchedPairs).includes(item.solution);

              return (
                <button
                  key={item.id}
                  disabled={isUsed || !q7SelectedStep}
                  onClick={() => handleQ7Match(item.solution)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between ${
                    isUsed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60'
                      : q7SelectedStep
                      ? 'bg-white border-indigo-200 hover:bg-indigo-600 hover:text-white shadow-sm cursor-pointer'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{item.solution}</span>
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
            q7Feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <strong>{q7Feedback.isCorrect ? 'Korrekt! ' : 'Hinweis: '}</strong>
            {q7Feedback.text}
          </div>
        )}
      </div>

      {/* Banner to DS 2 (DS 4) Simulation */}
      <div className="bg-gradient-to-r from-teal-800 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-teal-300 block mb-1">
            Doppelstunde 2 / DS 4 • Praxistransfer
          </span>
          <h3 className="text-2xl font-bold">
            Hausärztliche Anamnese-Simulation mit Frau Meinhardt
          </h3>
          <p className="text-slate-200 text-sm mt-1 max-w-xl">
            Übernehmen Sie die Überschulter-Perspektive der PFA in der Arztpraxis: Befragen Sie Frau Meinhardt gezielt nach ihrer Kolik, erkennen Sie die Red Flags und begleiten Sie die Feststellung der OP-Indikation!
          </p>
        </div>
        <button
          onClick={onGoToSimulation}
          className="px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <Stethoscope className="w-5 h-5" />
          <span>Simulation jetzt starten</span>
        </button>
      </div>
    </div>
  );
};
