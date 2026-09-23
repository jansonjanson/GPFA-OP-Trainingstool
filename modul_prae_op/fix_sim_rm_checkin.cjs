const fs = require('fs');

let content = fs.readFileSync('src/components/SimulatorSection.tsx', 'utf8');

// The block to remove starts roughly at '<div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto text-left relative z-10">'
// and ends at the closing div of "Bevor Sie starten:"

const toReplace = `<div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto text-left relative z-10">
            <h3 className="font-bold text-indigo-900 text-lg flex items-center mb-3">
              <ClipboardList className="w-6 h-6 mr-2 text-indigo-600" />
              Check-In für DS 4 (Doppelstunde 4)
            </h3>
            <p className="text-indigo-800 leading-relaxed mb-2">
              In der 4. Doppelstunde werden wir alle Puzzleteile zusammenführen:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-indigo-800/90 font-medium">
              <li>Ihre Ergebnisse aus dem Arbeitsauftrag (SOP / Checkliste)</li>
              <li>Die Theorie & Textinhalte aus der Wissens-Base</li>
              <li>Ihre Entscheidungen in diesem Simulator</li>
            </ul>
            <p className="text-indigo-800 text-sm mt-3 pt-3 border-t border-indigo-200/50">
              Bitte achten Sie beim Spielen des Simulators genau darauf, wo sich Praxis und Theorie ggf. ergänzen oder herausfordern!
            </p>
          </div>

          <div className="text-lg text-slate-600 mb-6 max-w-xl mx-auto leading-relaxed space-y-4 relative z-10 mt-4 text-left">
            <h3 className="font-bold text-slate-900 text-xl mb-2">Bevor Sie starten:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700 font-medium">
              <li><strong>Gruppen bilden</strong></li>
              <li>Die verlinkte <strong>Hauscheckliste ansehen</strong> (siehe <button onClick={() => onNavigate('auftrag')} className="text-blue-600 hover:underline">Arbeitsauftrag</button>)</li>
              <li>Einen <strong>eigenen Ablaufplan erstellen</strong> (Ihre SOP)</li>
              <li>Beides als Hilfsmittel <strong>in die Simulation mitnehmen</strong></li>
            </ol>
          </div>`;

content = content.replace(toReplace, '');

fs.writeFileSync('src/components/SimulatorSection.tsx', content);
