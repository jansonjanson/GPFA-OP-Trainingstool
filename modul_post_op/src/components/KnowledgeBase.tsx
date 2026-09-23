import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, AlertCircle } from 'lucide-react';

interface KnowledgeBaseProps {
  isOpen: boolean;
  onClose: () => void;
  isTimerActive: boolean;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ isOpen, onClose, isTimerActive }) => {
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 border border-slate-200"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">CNE / Thieme Spickzettel</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8 text-sm text-slate-600">
              {isTimerActive && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-800">Achtung: Zeitverlust!</h4>
                    <p>Sie lesen während einer laufenden Notfallsituation in Ihren Unterlagen! Das kostet wertvolle Zeit und mindert Ihre Ressourcen (Energie).</p>
                  </div>
                </div>
              )}

              <section>
                <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b pb-2">1. Postoperative Überwachung</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Bewusstsein:</strong> Regelmäßig kontrollieren (Narkoseüberhang, neurologische Störungen).</li>
                  <li><strong>Vitalzeichen:</strong> Puls, Blutdruck und Atmung engmaschig überwachen (Hypoxie, Volumenmangel?).</li>
                  <li><strong>Wundverband & Drainagen:</strong> Bei jedem Patientenkontakt auf Nachblutungen (durchgebluteter Verband) und Füllstand der Drainagen kontrollieren.</li>
                  <li><strong>Nachblutung:</strong> Ein unkontrolliertes Entfernen durchbluteter Verbände kann Koagel zerstören und die Blutung verschlimmern. Korrekt: Belassen, komprimieren, Arzt rufen.</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b pb-2">2. Mobilisation & PONV (Übelkeit)</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Aspirationsgefahr:</strong> Bei Erbrechen den Patienten niemals flach lagern! Oberkörperhochlagerung oder Seitenlage ist Pflicht. Nierenschalen müssen griffbereit sein.</li>
                  <li><strong>Frühmobilisation:</strong> Effektive Maßnahme zur Prophylaxe von Thrombosen und Pneumonien. Vorher Vitalzeichen messen!</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b pb-2">3. Kostaufbau (Fast-Track-Konzept)</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Langes postoperatives Nüchternlassen ist obsolet.</li>
                  <li>Moderne Fast-Track-Konzepte erlauben nach komplikationslosen Eingriffen einen zügigen schluckweisen Kostaufbau (Wasser, ungesüßter Tee), um die Darmperistaltik anzuregen.</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b pb-2">4. Das ISBAR-Schema</h4>
                <p className="mb-2">Strukturierte Kommunikation für Übergaben und Arztanrufe:</p>
                <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <li><strong>I (Identify):</strong> Identifikation (Wer ruft an? Um welchen Patienten geht es?)</li>
                  <li><strong>S (Situation):</strong> Aktuelle Situation (Was ist passiert?)</li>
                  <li><strong>B (Background):</strong> Hintergrund (Relevante Vorgeschichte / OP)</li>
                  <li><strong>A (Assessment):</strong> Assessment (Aktuelle Vitalwerte, Schmerzskala, Wundstatus)</li>
                  <li><strong>R (Recommendation):</strong> Empfehlung (Was schlage ich vor? Was benötige ich vom Arzt?)</li>
                </ul>
              </section>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
              >
                Verstanden
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
