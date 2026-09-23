import React, { useState } from 'react';
import { 
  BriefcaseMedical, 
  MessageSquareHeart, 
  ShieldAlert, 
  Flame, 
  Users, 
  Headphones, 
  Pill, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Info,
  ChevronRight
} from 'lucide-react';
import { notfallkofferItems } from '../data/ds2Data';
import { NotfallkofferItem } from '../types';

interface NotfallkofferProps {
  isModalOpen?: boolean;
  onCloseModal?: () => void;
  standalone?: boolean;
}

export const Notfallkoffer: React.FC<NotfallkofferProps> = ({ standalone = true }) => {
  const [selectedItem, setSelectedItem] = useState<NotfallkofferItem | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'MessageSquareHeart': return <MessageSquareHeart className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Headphones': return <Headphones className="w-6 h-6" />;
      case 'Pill': return <Pill className="w-6 h-6" />;
      default: return <BriefcaseMedical className="w-6 h-6" />;
    }
  };

  return (
    <div className={standalone ? "space-y-6" : ""}>
      {standalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <div className="inline-flex items-center space-x-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-semibold mb-1">
              <BriefcaseMedical className="w-3.5 h-3.5" />
              <span>Praxis-Hilfsmittel für Pflegefachassistenten</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Digitaler Notfallkoffer: Angstinterventionen
            </h2>
            <p className="text-slate-600 text-sm">
              Klicken Sie auf eine Kachel, um konkrete Handlungsanweisungen, Evidenzen und No-Gos für die PFA zu öffnen.
            </p>
          </div>
          <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Auch während der Simulation abrufbar</span>
          </div>
        </div>
      )}

      {/* Grid Layout of Clickable Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notfallkofferItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Top Color Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm`}>
                  {getIcon(item.iconName)}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-snug">
                {item.subtitle}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600 group-hover:text-blue-700">
              <span>Handlungsleitfaden ansehen</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedItem.color} text-white relative rounded-t-3xl`}>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                title="Schließen"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  {getIcon(selectedItem.iconName)}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                    Kategorie: {selectedItem.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">
                    {selectedItem.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-white/90">
                {selectedItem.subtitle}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Overview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
                <strong className="block text-slate-900 mb-1">Klinischer Hintergrund:</strong>
                {selectedItem.description}
              </div>

              {/* Dos & Don'ts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Empfohlene Maßnahmen (DO)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedItem.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Zu vermeiden (DON'T)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedItem.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practical Tip */}
              <div className="flex items-start space-x-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Praxistipp für die Station:</strong>
                  <span>{selectedItem.practicalTips}</span>
                </div>
              </div>

              {/* Clinical Rationale */}
              <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex items-center justify-between">
                <span><strong>Wirkmechanismus:</strong> {selectedItem.clinicalRationale}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Verstanden & Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
