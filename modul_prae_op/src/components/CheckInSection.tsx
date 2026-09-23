import { ClipboardList, Info, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
}

export default function CheckInSection({ onNavigate }: Props) {
  return (
    <section className="max-w-4xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Check-In & Hinweise</h2>
        <ModuleMeta time="Doppelstunde 6 (Modul 3 Abschluss)" mode="Gruppenarbeit / Plenum" goal="Theorie, Checklisten und Simulation verknüpfen" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 pointer-events-none"></div>
        <div className="p-6 sm:p-10 space-y-8 relative z-10">
          
          <div className="bg-indigo-50 border border-indigo-200 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <ClipboardList className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center">
                <Info className="w-6 h-6 mr-2 text-indigo-600" />
                Check-In für DS 6 (Doppelstunde 6)
              </h3>
              <p className="text-indigo-800 leading-relaxed mb-4 text-lg">
                In der 6. Doppelstunde werden alle Puzzleteile der präoperativen Vorbereitung zusammengeführt:
              </p>
              <ul className="space-y-3 text-indigo-900 font-medium text-lg">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-500"><CheckCircle2 className="w-5 h-5" /></span>
                  <span>Ihre Ergebnisse aus dem Arbeitsauftrag (SOP / Checkliste)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-500"><CheckCircle2 className="w-5 h-5" /></span>
                  <span>Die Theorie & Textinhalte aus der Wissens-Base</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-500"><CheckCircle2 className="w-5 h-5" /></span>
                  <span>Ihre Entscheidungen im OP-Simulator</span>
                </li>
              </ul>
              <p className="text-indigo-800 font-bold mt-6 p-4 bg-indigo-100/50 rounded-xl border border-indigo-200">
                Bitte achten Sie beim Spielen des Simulators genau darauf, wo sich Praxis und Theorie ggf. ergänzen oder herausfordern!
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-2xl mb-6">Wie ist der Ablauf?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">1. Gruppen bilden</h4>
                  <p className="text-sm text-slate-600">Finden Sie sich in Arbeitsgruppen zusammen.</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">2. Hauscheckliste ansehen</h4>
                  <p className="text-sm text-slate-600">Betrachten Sie die Vorlage aus dem <button onClick={() => onNavigate('auftrag')} className="text-blue-600 hover:underline font-semibold">Arbeitsauftrag</button>.</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">3. Ablaufplan (SOP) erstellen</h4>
                  <p className="text-sm text-slate-600">Entwerfen Sie einen eigenen Ablaufplan mit einem Tool Ihrer Wahl.</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">4. Simulation starten</h4>
                  <p className="text-sm text-slate-600">Nehmen Sie Ihre SOP mit in die Simulation und überprüfen Sie diese.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Module Teaser */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Ausblick: Curriculum DS 7 & 8
              </span>
              <h4 className="text-base font-bold text-emerald-950 mt-1">
                Nächster Schritt: Modul 4 – Post-OP Pflege & Aufwachraum
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Nach erfolgreichem Schleusentransfer erwacht Frau Meinhardt im Aufwachraum. Dort beginnt die postoperative Überwachung!
              </p>
            </div>
          </div>

        </div>
      </div>

      <NavigationButtons current="checkin" onNavigate={onNavigate} />
    </section>
  );
}
