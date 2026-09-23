import React, { useState } from 'react';
import { 
  Scale, 
  Brain, 
  Activity, 
  GitCommit, 
  Eye, 
  Megaphone, 
  Dna, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Info,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { learningNuggetsList } from '../data/nuggetsData';

interface Props {
  unlockedNuggets: string[];
}

export const NuggetSlideCards: React.FC<Props> = ({ unlockedNuggets }) => {
  const [selectedSlide, setSelectedSlide] = useState<string>('angst_vs_furcht');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kompaktwissen & Fachfolien</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Freigeschaltete Learning Nuggets
          </h2>
          <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
            Hier finden Sie die didaktisch aufbereiteten Inhalte der Lehrfolien. Schließen Sie die Quizzes in DS 1 und DS 2 ab, um alle Nuggets dauerhaft für Ihr Examen und die Praxis freizuschalten.
          </p>
        </div>
      </div>

      {/* Nugget Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {learningNuggetsList.slice(0, 4).map((nugget) => {
          const isUnlocked = unlockedNuggets.includes(nugget.unlockedByQuizId);
          const isSelected = selectedSlide === nugget.slideType;

          return (
            <button
              key={nugget.id}
              onClick={() => setSelectedSlide(nugget.slideType)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-600 bg-cyan-50/80 shadow-md ring-2 ring-cyan-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Folie {nugget.slideType === 'angst_vs_furcht' ? '1' : nugget.slideType === 'entstehungsformen' ? '2' : nugget.slideType === 'physiologie' ? '3' : '4'}
                </span>
                {isUnlocked ? (
                  <span className="text-emerald-600 bg-emerald-100 p-1 rounded-full" title="Freigeschaltet">
                    <Unlock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-slate-400 bg-slate-100 p-1 rounded-full" title="Noch gesperrt">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                {nugget.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Selected Slide Content Display */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* SLIDE 1: Angst vs. Furcht */}
        {selectedSlide === 'angst_vs_furcht' && (
          <div className="space-y-6">
            <div className="border-b border-cyan-600 pb-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Angst vs. <span className="underline decoration-cyan-500 decoration-4">Furcht</span>
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Klinische Differenzierung nach Auslöser, evolutionärer Funktion und zeitlichem Aspekt
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-tl-xl">
                      Unterscheidungsmerkmal
                    </th>
                    <th className="py-3 px-4 bg-teal-600 text-white font-bold text-xs sm:text-sm">
                      Furcht (Fear)
                    </th>
                    <th className="py-3 px-4 bg-cyan-700 text-white font-bold text-xs sm:text-sm">
                      Angst (State-Anxiety)
                    </th>
                    <th className="py-3 px-4 bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-tr-xl">
                      Gemeinsamkeiten
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/50">
                      Auslöser / Bezug
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <strong className="text-teal-700">Konkretes</strong>, präsentes Objekt oder akute Situation (z. B. dicke Nadel, Sturz).
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <strong className="text-cyan-700">Diffus</strong>, unklar, zukunftsgerichtet (z. B. Warten auf Biopsie-Befund, Angst vor Narkose).
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 bg-slate-50/30">
                      Reaktion auf eine subjektiv wahrgenommene Bedrohung.
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/50">
                      Funktion
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      Akutes Überleben, Kampf-, Flucht- oder Erstarrungsreaktion (Fight / Flight / Freeze).
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      Erhöhte Wachsamkeit (<strong className="text-cyan-700">Vigilanz</strong>) gegenüber möglichen künftigen Risiken.
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 bg-slate-50/30">
                      Sinnvolle, evolutionäre Schutzfunktion für den Menschen.
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/50">
                      Zeitlicher Aspekt
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <strong className="text-teal-700">Akut und präsent</strong>. Endet meist schnell, sobald die akute Gefahr vorüber ist.
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <strong className="text-cyan-700">Zukunftsgerichtet</strong> (Antizipation). Kann langanhaltend und zermürbend sein.
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 bg-slate-50/30">
                      Führen zu einer enormen psychischen & körperlichen Belastung.
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/50">
                      Einordnung
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      Basisemotion (<em className="text-slate-600">nach Ekman</em>).
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      Emotionaler Zustand / State (<em className="text-slate-600">nach Spielberger</em>).
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 bg-slate-50/30 font-medium">
                      Vegetative Begleitsymptome (z. B. Pulsanstieg, Schwitzen, Tachypnoe).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SLIDE 2: Die 4 Entstehungsformen */}
        {selectedSlide === 'entstehungsformen' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Die 4 <span className="text-cyan-600">Entstehungsformen</span> der Angst
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Konditionierung, soziales Lernen, Verbale Instruktion und Genetik im klinischen Alltag
              </p>
            </div>

            {/* Visual Head Layout with 4 Quadrants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Quadrant 1: Erlernte Angst */}
              <div className="bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-cyan-600 text-white rounded-2xl shadow-md">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Quadrant 1</span>
                    <h4 className="text-lg font-bold text-slate-900">Erlernte Angst</h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  <strong>Konditionierte Reaktion</strong> auf bedrohlich empfundene Situationen. Konzept zur Vermeidung von schädlichen Dingen/Situationen.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-cyan-100 text-xs text-slate-600">
                  <strong className="text-cyan-800">Auslöser:</strong> Persönliche Erfahrungen mit unerwarteten, plötzlichen, wiederkehrenden und/oder Situationen der Hilflosigkeit (z. B. Schock nach schmerzhafter OP).
                </div>
              </div>

              {/* Quadrant 2: Beobachtungslernen */}
              <div className="bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-md">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Quadrant 2</span>
                    <h4 className="text-lg font-bold text-slate-900">Beobachtungslernen</h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  <strong>Beobachtete Reaktion</strong> einer anderen Person auf eine angstauslösende Situation oder eigene Beobachtung einer gefährlichen Situation.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-teal-100 text-xs text-slate-600">
                  <strong className="text-teal-800">Merksatz:</strong> Es wurde <em>keine eigene, direkte Erfahrung</em> der Situation gemacht (z. B. Miterleben eines Sturzes des Zimmernachbarn).
                </div>
              </div>

              {/* Quadrant 3: Instruktionslernen */}
              <div className="bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-md">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Quadrant 3</span>
                    <h4 className="text-lg font-bold text-slate-900">Instruktionslernen</h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  <strong>Warnung, Information, Instruktion</strong> in Hinsicht auf gefährliche Situationen oder Verweis auf zu vermeidendes Verhalten durch andere Personen.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-sky-100 text-xs text-slate-600">
                  <strong className="text-sky-800">Klinikalltag:</strong> Wissen über vermeintlich gefährliche Situationen wird verbal weitergegeben (z. B. Horrorgeschichten über Narkoseüberdosierung im Bekanntenkreis).
                </div>
              </div>

              {/* Quadrant 4: Veranlagung / Genetik */}
              <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
                    <Dna className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Quadrant 4</span>
                    <h4 className="text-lg font-bold text-slate-900">Veranlagung (Genetik)</h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  <strong>Genetische Weitergabe</strong> von evolutionär verankerten Veranlagungen für bestimmte Ängste, die in den vorangegangenen Generationen überlebensbestimmend waren.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-indigo-100 text-xs text-slate-600">
                  <strong className="text-indigo-800">Beispiele:</strong> Angst vor engen Räumen (Höhlen/Klaustrophobie), Höhen, Dunkelheit, Blut oder bestimmten Tieren (Schlangen/Spinnen).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: Physiologie & Autonomes Nervensystem */}
        {selectedSlide === 'physiologie' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Physiologie: <span className="text-teal-600">Autonomes Nervensystem</span>
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Gegenspieler im Angstgeschehen: Sympathikus (aktiv) vs. Parasympathikus (passiv)
              </p>
            </div>

            {/* Tree Branch Visual */}
            <div className="max-w-md mx-auto bg-slate-800 text-white text-center py-3 px-6 rounded-2xl font-bold text-sm shadow-md mb-6">
              Autonomes Nervensystem
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Branch: Sympathikus */}
              <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-300 rounded-3xl p-6 shadow-sm">
                <div className="text-center pb-4 border-b border-blue-200 mb-4">
                  <div className="inline-block px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-sm mb-2 shadow-sm">
                    Sympathikus
                  </div>
                  <h4 className="text-lg font-bold text-blue-900">
                    Aktive Angstreaktion
                  </h4>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Fight or Flight
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Gesteigerte Aufmerksamkeit</strong>, Herzfrequenz (Tachykardie) & Atemfrequenz</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Geweitete Pupillen</strong> (Mydriasis für Weitsicht)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Erhöhter Muskeltonus</strong> und Blutdruck (Hypertonie)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Flachere, schnellere Atmung (Tachypnoe)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Bereitstellung von Glukose & Energie für die Muskeln</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Reduzierte Verdauungs- und Blasentätigkeit</strong> (Hemmung peristaltischer Aktivität)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Gesteigerte Schweißproduktion</strong> (feuchte Hände, Kältezittern)</span>
                  </li>
                </ul>
              </div>

              {/* Right Branch: Parasympathikus */}
              <div className="bg-gradient-to-b from-teal-50 to-white border-2 border-teal-300 rounded-3xl p-6 shadow-sm">
                <div className="text-center pb-4 border-b border-teal-200 mb-4">
                  <div className="inline-block px-4 py-1.5 bg-teal-600 text-white font-bold rounded-xl text-sm mb-2 shadow-sm">
                    Parasympathikus
                  </div>
                  <h4 className="text-lg font-bold text-teal-900">
                    Passive Angstreaktion
                  </h4>
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                    Freezing / Erstarrung
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Reduzierte Herz- und Atemfrequenz</strong> (Bradykardie)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Gesenkter Blutdruck</strong> durch akute Vasodilatation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Drohende Ohnmacht</strong> (vasovagale Synkope) durch verminderte zerebrale Perfusion</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Freeze-Zustand:</strong> Gefühl des Ausgeliefertseins und der Handlungsunfähigkeit</span>
                  </li>
                </ul>

                <div className="mt-6 p-3 bg-teal-100/60 rounded-xl text-xs text-teal-900 font-medium">
                  💡 <strong>Klinischer Pflegetipp:</strong> Fällt ein Patient vor einer Injektion oder beim Verbandwechsel in die Erstarrung, sofort flach lagern und Beine hochlegen, um einer Synkope zuvorzukommen!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: Die Angstkaskade */}
        {selectedSlide === 'angstkaskade' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Die <span className="text-cyan-600">Angstkaskade</span> im menschlichen Gehirn
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Neurobiologische Kette: Vom Sinnesreiz über das emotionale Bewertungszentrum zur körperlichen Stressreaktion
              </p>
            </div>

            {/* Cascade Flow Steps */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full uppercase">
                      Schritt 1
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">
                      Reiz
                    </h4>
                    <p className="text-xs text-slate-600">
                      Angstauslösende Situation tritt ein. Sinnesorgane (Auge, Ohr) nehmen wahr und leiten Reiz weiter.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-400 font-mono">
                    z. B. Klappern von OP-Besteck
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-700 bg-cyan-200 px-2 py-0.5 rounded-full uppercase">
                      Schritt 2
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">
                      Amygdala
                    </h4>
                    <p className="text-xs text-slate-600">
                      Reize laufen im <strong>Mandelkern</strong> zusammen und werden emotional bewertet. Abgleich mit früheren Schmerzerfahrungen.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-cyan-800 font-semibold">
                    SOS-Signal wird gefeuert
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-200 px-2 py-0.5 rounded-full uppercase">
                      Schritt 3
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">
                      Hypothalamus
                    </h4>
                    <p className="text-xs text-slate-600">
                      Signale treffen ein. Dies ist das zentrale <strong>Steuerungszentrum</strong> für hormonelle und vegetative Prozesse.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-teal-800 font-semibold">
                    Aktiviert Sympathikus & CRH
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full uppercase">
                      Schritt 4
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">
                      Nebennieren
                    </h4>
                    <p className="text-xs text-slate-600">
                      Ausschüttung von <strong>Stresshormonen</strong> (Adrenalin & Noradrenalin) in den Blutkreislauf.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-amber-800 font-semibold">
                    Systemische Hormonflut
                  </div>
                </div>

                {/* Step 5 */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-200 px-2 py-0.5 rounded-full uppercase">
                      Schritt 5
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">
                      Angstreaktion
                    </h4>
                    <p className="text-xs text-slate-600">
                      Körper ist in voller <strong>Alarmbereitschaft</strong>: Schwitzen, Zittern, Tachykardie, Fluchtimpuls.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-rose-800 font-semibold">
                    Symptome manifestieren sich
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
