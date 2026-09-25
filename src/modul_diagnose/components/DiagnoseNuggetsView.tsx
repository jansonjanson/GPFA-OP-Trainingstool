import React from 'react';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  Droplet, 
  Eye, 
  Stethoscope, 
  Flame, 
  ShieldCheck, 
  HelpCircle,
  Play,
  BookOpen,
  Activity
} from 'lucide-react';

interface Props {
  unlockedNuggets: string[];
}

export const DiagnoseNuggetsView: React.FC<Props> = ({ unlockedNuggets }) => {
  const isUnlocked = (id: string) => unlockedNuggets.includes(id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Klinische Fachdatenbank & Ergebnissicherung</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Learning Nuggets: Diagnose & Beobachtung (DS 1 & 2)
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Diese kompakten Wissenskarten fassen die Kerninhalte aus Lehrvideos, dem Bundesgesundheitsportal und den Quizzes zusammen. Nutzen Sie diese Spickzettel zur Vorbereitung auf Quizzes und die Hausarzt-Simulation!
          </p>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-center flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-indigo-900/60 block">Freigeschaltet</span>
          <span className="text-2xl font-black text-indigo-700 font-mono">
            {unlockedNuggets.length} <span className="text-sm font-normal text-slate-500">/ 9 Nuggets</span>
          </span>
        </div>
      </div>

      {/* SECTION 1: Stationen-Ergebnissicherungen (Videos & Fachartikel) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            Ergebnissicherung aus den Medien-Stationen (DS 1)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* NUGGET: Station 1 Dr. Weigl */}
          <div className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between ${
            isUnlocked('nugget_station1_patho')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-65'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center space-x-1.5">
                  <Play className="w-3.5 h-3.5" />
                  <span>Station 1 • Dr. Weigl</span>
                </span>
                {isUnlocked('nugget_station1_patho') ? (
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Gesichert</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Station 1 abschließen</span>
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-2">
                Pathophysiologie der Cholezystolithiasis
              </h4>

              {isUnlocked('nugget_station1_patho') ? (
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p><strong>Entstehung:</strong> Ungleichgewicht zwischen Cholesterin und Gallensäuren führt zu mikroskopischen Kristallen, die zu Konkrementen verklumpen.</p>
                  <p><strong>Kolikauslöser:</strong> Ein Stein verlegt den Ausführungsgang (Ductus cysticus). Die Gallenblasenwand kontrahiert rhythmisch gegen den Widerstand (krampfartiger Wehenschmerz).</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-3">
                  Schauen Sie das Lehrvideo von Dr. Weigl vollständig an und klicken Sie auf „Station 1 abschließen“, um dieses Wissen zu sichern.
                </p>
              )}
            </div>
          </div>

          {/* NUGGET: Station 2 gesund.bund.de */}
          <div className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between ${
            isUnlocked('nugget_station2_article')
              ? 'bg-white border-teal-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-65'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Station 2 • gesund.bund.de</span>
                </span>
                {isUnlocked('nugget_station2_article') ? (
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Gesichert</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Station 2 lesen</span>
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-2">
                Leitlinienwissen des Bundesgesundheitsportals
              </h4>

              {isUnlocked('nugget_station2_article') ? (
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p><strong>Stumme Steine:</strong> ca. 75–80 % bleiben beschwerdefrei (keine OP nötig).</p>
                  <p><strong>Symptomatische Steine:</strong> Wiederholte Koliken oder Entzündungen stellen eine eindeutige Indikation zur Cholezystektomie dar.</p>
                  <p><strong>Risikoprofil:</strong> Bestätigung der 6-F-Regel als epidemiologische Leitschiene.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-3">
                  Lesen Sie den Fachartikel auf gesund.bund.de und bestätigen Sie die Station zur Ergebnissicherung.
                </p>
              )}
            </div>
          </div>

          {/* NUGGET: Station 3 Laparoskopische CE */}
          <div className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between ${
            isUnlocked('nugget_station3_surgery')
              ? 'bg-white border-purple-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-65'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Station 3 • OP-Dokumentation</span>
                </span>
                {isUnlocked('nugget_station3_surgery') ? (
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Gesichert</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Station 3 ansehen</span>
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-2">
                Minimal-invasive Laparoskopische Cholezystektomie
              </h4>

              {isUnlocked('nugget_station3_surgery') ? (
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p><strong>Zugang:</strong> Schlüsselloch-OP mit 4 Trokaren und CO2-Pneumoperitoneum.</p>
                  <p><strong>Kritische Schritte:</strong> Freipräparation des Calot-Dreiecks, doppeltes Abclippen von Ductus cysticus und A. cystica.</p>
                  <p><strong>Bergung:</strong> Gallenblase wird im Bergebeutel über den Nabelschnitt intakt geborgen.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-3">
                  Sehen Sie sich die OP-Dokumentation zur lap. CE an und sichern Sie das Wissensnugget.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quiz-Wissenskarten (Praxis-Sicherung) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            Vertiefende Wissenskarten aus den 7 Quizzes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NUGGET 1: 6-F-Regel */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_6f')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Die 6-F-Regel der Gallensteinentstehung
                </h4>
              </div>
              {isUnlocked('nugget_6f') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 1 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_6f') ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FAT</strong>
                  <span className="text-slate-700">Übergewicht (erhöhte Cholesterinausscheidung)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FEMALE</strong>
                  <span className="text-slate-700">Weiblich (Östrogene steigern Lithogenität)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FERTILE</strong>
                  <span className="text-slate-700">Fruchtbar (Progesteron hemmt Gallenmotilität)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FORTY</strong>
                  <span className="text-slate-700">Alter &gt; 40 Jahre (steigende Steinbildung)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FAIR</strong>
                  <span className="text-slate-700">Heller kaukasischer Hauttyp</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="block text-indigo-700 font-bold text-sm">FAMILY</strong>
                  <span className="text-slate-700">Genetische Veranlagung in Familie</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 1 (6-F-Regel), um diese Wissenskarte dauerhaft freizuschalten.
              </p>
            )}
          </div>

          {/* NUGGET 2: Symptom-Topographie */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_symptoms')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Symptom-Topographie & Head-Zonen
                </h4>
              </div>
              {isUnlocked('nugget_symptoms') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 2 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_symptoms') ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  <strong className="text-rose-900 block font-bold">Rechter Oberbauch (RUQ):</strong>
                  <span>Krampfartiger Kolikschmerz durch Kontraktion der Gallenblasenwand gegen den Stein.</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                  <strong className="text-amber-900 block font-bold">Ausstrahlung in rechte Schulter:</strong>
                  <span>Reflektorischer Schmerz über Nervus phrenicus (Segmente C3-C5, Head'sche Zone).</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl">
                  <strong className="text-indigo-900 block font-bold">Sklerenikterus:</strong>
                  <span>Gelbfärbung von Skleren bei Gallestau durch Bilirubinübertritt in die Blutbahn.</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 2 (Symptom-Körper Challenge), um diese Wissenskarte dauerhaft freizuschalten.
              </p>
            )}
          </div>

          {/* NUGGET 3: Ausscheidungs-Labor */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_excretion')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Ausscheidungs-Befunde bei Gallenstau
                </h4>
              </div>
              {isUnlocked('nugget_excretion') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 3 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_excretion') ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-xl">
                  <strong className="text-amber-950 block font-bold text-sm">Dunkler Urin (Bierbraun)</strong>
                  <p className="text-slate-700 mt-1">
                    Weil Galle nicht in den Darm fließen kann, wird das Bilirubin ins Blut abgegeben und über die Nieren als dunkler Farbstoff filtriert.
                  </p>
                </div>
                <div className="bg-stone-100 border border-stone-300 p-3 rounded-xl">
                  <strong className="text-stone-900 block font-bold text-sm">Heller Stuhl (Lehmfarben)</strong>
                  <p className="text-slate-700 mt-1">
                    Im Darm fehlt das Bilirubin zur Bildung von Sterkobilin. Der Stuhl verliert seine typische braune Farbe und wird acholisch.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 3 (Ausscheidungs-Labor), um diese Wissenskarte freizuschalten.
              </p>
            )}
          </div>

          {/* NUGGET 4: Red Flags & Triage */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_redflags')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Red Flags: Wann wird die Kolik zum Notfall?
                </h4>
              </div>
              {isUnlocked('nugget_redflags') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 4 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_redflags') ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl">
                  <strong className="text-rose-900 block font-bold">Charcot-Trias (Akute Cholangitis):</strong>
                  <span>Rechter Oberbauchschmerz + Fieber/Schüttelfrost + Ikterus. Lebensbedrohliche Keimbesiedlung der Gallenwege!</span>
                </div>
                <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl">
                  <strong className="text-rose-900 block font-bold">Dauerschmerz &gt; 5 Stunden:</strong>
                  <span>Verdacht auf akute Gallenblasenentzündung (Cholezystitis) oder Begleitpankreatitis.</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl">
                  <strong className="text-emerald-900 block font-bold">Stumme Steine:</strong>
                  <span>Ca. 80 % aller Steinträger haben nie Beschwerden und benötigen keine Therapie.</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 4 (Normal oder Notfall?), um diese Wissenskarte freizuschalten.
              </p>
            )}
          </div>

          {/* NUGGET 5: Anatomie & Fettverdauung */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_anatomy')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  5
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Anatomie, Gallebildung & Cholesterin
                </h4>
              </div>
              {isUnlocked('nugget_anatomy') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 6 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_anatomy') ? (
              <div className="space-y-2 text-xs text-slate-700">
                <p><strong>Bildung:</strong> Bis zu 1 Liter Galle wird täglich in den Hepatozyten der Leber produziert.</p>
                <p><strong>Speicherung:</strong> Die Gallenblase (Vesica biliaris) dickt die Galle um das 5- bis 10-fache ein.</p>
                <p><strong>Steinzusammensetzung:</strong> Ca. 80 % aller Steine in westlichen Ländern sind Cholesterinsteine.</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 6 (Lückentext), um diese Wissenskarte freizuschalten.
              </p>
            )}
          </div>

          {/* NUGGET 6: PFA-Handlungspfad & Laparoskopie */}
          <div className={`rounded-3xl border-2 transition-all p-6 ${
            isUnlocked('nugget_therapy')
              ? 'bg-white border-indigo-200 shadow-sm'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  6
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  PFA-Handlungspfad & Cholezystektomie
                </h4>
              </div>
              {isUnlocked('nugget_therapy') ? (
                <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Freigeschaltet</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quiz 7 lösen</span>
                </span>
              )}
            </div>

            {isUnlocked('nugget_therapy') ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  <strong>Akute Kolik:</strong> Absolute Nahrungskarenz (keine Suppe, kein Fett/Essen!).
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl">
                  <strong>Medikation:</strong> Krampflöser (Spasmolytika wie Butylscopolamin) + Analgetika (Metamizol/NSAR) nach ärztlicher Anordnung.
                </div>
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                  <strong>Goldstandard OP:</strong> Laparoskopische Cholezystektomie (minimal-invasiv über 3–4 Trokare).
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Lösen Sie Quiz 7 (Therapie-Zuordnung), um diese Wissenskarte freizuschalten.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
