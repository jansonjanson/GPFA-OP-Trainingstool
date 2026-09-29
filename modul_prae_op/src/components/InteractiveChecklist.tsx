import { useState } from 'react';

type CheckState = 'ja' | 'nein' | 'na' | null;

interface CheckItem {
  id: string;
  label: string;
  hasNA?: boolean;
}

const stationChecks: CheckItem[] = [
  { id: 'armband', label: 'Patientenarmband angelegt / Patientenetiketten' },
  { id: 'bettschild', label: 'Bettschild angebracht und überprüft' },
  { id: 'op_einverstandnis', label: 'OP-Einverständniserklärung ist unterschrieben' },
  { id: 'anaesthesie', label: 'Anästhesieprotokoll liegt vor' },
  { id: 'labor', label: 'Labor/Röntgen/EKG liegt nach Anordnung vor', hasNA: true },
  { id: 'eingriffsort', label: 'Eingriffsort wurde vom Arzt markiert', hasNA: true },
  { id: 'schmuck', label: 'Zahnprothese, Schmuck, Piercings entfernt' },
  { id: 'praemedikation', label: 'Prämedikation wurde verabreicht' },
  { id: 'haare', label: 'Haare im OP-Bereich geschert / Nabelpflege durchgeführt', hasNA: true },
  { id: 'mre', label: 'MRE-Screening durchgeführt / Befund vorhanden', hasNA: true },
  { id: 'ida', label: 'IDA-Box angelegt', hasNA: true }
];

const schleuseChecks: CheckItem[] = [
  { id: 'befragung', label: 'Aktive Befragung des Patienten mit Namen, Vornamen, Geburtsdatum und geplantem Eingriff', hasNA: true },
  { id: 'daten_armband', label: 'Daten auf dem Patientenarmband stimmen mit den Unterlagen überein' },
  { id: 'eingriffsort_schleuse', label: 'Eingriffsort ist markiert', hasNA: true },
  { id: 'hautdefekte', label: 'Hautdefekte vorhanden', hasNA: true }
];

export default function InteractiveChecklist() {
  const [checks, setChecks] = useState<Record<string, CheckState>>({});

  const handleCheck = (id: string, state: CheckState) => {
    setChecks(prev => ({
      ...prev,
      [id]: prev[id] === state ? null : state
    }));
  };

  const renderSection = (title: string, items: CheckItem[]) => (
    <div className="mb-8">
      <h4 className="font-bold text-slate-800 bg-slate-200 px-4 py-2 rounded-t-lg">{title}</h4>
      <div className="border border-slate-200 rounded-b-lg overflow-hidden bg-white">
        {items.map((item, index) => (
          <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 ${index < items.length - 1 ? 'border-b border-slate-100' : ''}`}>
            <span className="text-sm text-slate-700 font-medium mb-2 sm:mb-0 pr-4">{item.label}</span>
            <div className="flex space-x-2 shrink-0">
              <button 
                onClick={() => handleCheck(item.id, 'ja')}
                className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors ${checks[item.id] === 'ja' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
              >
                Ja
              </button>
              <button 
                onClick={() => handleCheck(item.id, 'nein')}
                className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors ${checks[item.id] === 'nein' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
              >
                Nein
              </button>
              {item.hasNA && (
                <button 
                  onClick={() => handleCheck(item.id, 'na')}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors ${checks[item.id] === 'na' ? 'bg-slate-500 text-white border-slate-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                >
                  N/A
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 overflow-y-auto">
      {renderSection('1. Check durch die Station', stationChecks)}
      <div className="mb-2 text-sm text-slate-500 font-medium px-4">Gespräch mit Anästhesiefachperson, Pflegefachperson und Patient:in</div>
      {renderSection('2. Check in der OP-Schleuse', schleuseChecks)}
    </div>
  );
}
