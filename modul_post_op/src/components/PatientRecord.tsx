import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText } from 'lucide-react';

interface PatientRecordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientRecord: React.FC<PatientRecordProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#1e2532] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col relative z-10"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-xl">Patientenakte: Meinhardt, Carola</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 bg-slate-100 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patientendaten */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Patientendaten</h4>
                  <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
                    <p><strong className="text-slate-900">Name:</strong> Carola Meinhardt</p>
                    <p><strong className="text-slate-900">Alter:</strong> 67 Jahre</p>
                    <p><strong className="text-slate-900">Größe / Gewicht:</strong> 165 cm / 75 kg</p>
                    <p><strong className="text-slate-900">Allergien:</strong> <span className="text-rose-600 font-semibold">Pflasterallergie, Penicillin</span></p>
                    <p><strong className="text-slate-900">Besonderheiten:</strong> Trägt Vollprothese<br/>(Oberkiefer)</p>
                  </div>
                </div>

                {/* Anästhesie & Prämedikation */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AWR-Verlauf (Post-OP)</h4>
                  <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
                    <p><strong className="text-slate-900">Letzte Vitalwerte (AWR):</strong></p>
                    <ul className="list-disc pl-4 mb-2">
                      <li>RR: 105/60 mmHg <span className="text-rose-500 text-xs">(zw.zeitl. 95/55)</span></li>
                      <li>HF: 92/min</li>
                      <li>SpO₂: 97%</li>
                    </ul>
                    <p><strong className="text-slate-900">Schmerz (NRS):</strong> 3</p>
                    <p><strong className="text-slate-900">Gabe im AWR:</strong> 3mg Piritramid i.v.</p>
                  </div>
                </div>

                {/* Diagnose & OP */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Diagnose & OP</h4>
                  <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
                    <p><strong className="text-slate-900">Diagnose:</strong> Symptomatische<br/>Cholezystolithiasis</p>
                    <p><strong className="text-slate-900">Eingriff:</strong> Laparoskopische<br/>Cholezystektomie</p>
                    <p><strong className="text-slate-900">Geplante OP-Zeit:</strong> 08:30 Uhr</p>
                  </div>
                </div>

                {/* Hausmedikation */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ärztliche Anordnungen (Station)</h4>
                  <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
                    <p><strong className="text-slate-900">Schmerzkonzept Stufe II:</strong></p>
                    <ul className="list-disc pl-4 mb-2">
                      <li>Novaminsulfon Tbl. 500mg 2-2-2-2</li>
                      <li><strong>Bedarf: Metamizol (Novalgin) 1g als Kurzinfusion</strong> bei Schmerzen &gt; NRS 4. <br/><span className="text-rose-600 font-bold text-xs">CAVE: Wirkt blutdrucksenkend. Vor i.v. Gabe zwingend RR kontrollieren!</span></li>
                      <li>Oxycodon akut 5mg b.B.</li>
                    </ul>
                    <p><strong className="text-slate-900">Überwachung:</strong> Vitalwerte mind. 4-stündlich</p>
                    <p><strong className="text-slate-900">Kostaufbau:</strong> Fast-Track (schluckweise Flüssigkeit ab sofort erlaubt)</p>
                    <p><strong className="text-slate-900">Mobilisation:</strong> Frühmobilisation am OP-Tag</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
