import { FileText, Info, Users, Clock } from 'lucide-react';
import { Section } from '../types';
import NavigationButtons from './NavigationButtons';
import ModuleMeta from './ModuleMeta';

interface Props {
  onNavigate: (section: Section) => void;
}

export default function TaskSection({ onNavigate }: Props) {
  return (
    <section className="max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Der Arbeitsauftrag</h2>
        <ModuleMeta 
          time="Doppelstunde 5 & 6 (Modul 3)" 
          mode="Gruppenarbeit (3-4 Personen)" 
          goal="Transfer in die Praxis (SOP Erstellung)" 
        />
        <p className="text-slate-600 text-lg leading-relaxed">
          Wandeln Sie Ihr theoretisches Wissen nun in ein konkretes, praktisches Werkzeug um.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8">
          
          <div className="bg-blue-50/50 border border-blue-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-blue-900 text-lg mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Hausstandard-Checkliste
              </h4>
              <p className="text-sm text-blue-800">
                Laden Sie sich diese Hausstandard-Checkliste als Original-PDF herunter. Sie müssen deren Inhalte für Ihr eigenes Werkzeug und für den späteren Simulator zwingend berücksichtigen!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a 
                href="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/OP-Checkliste%20-%20Copy.pdf"
                target="_blank" rel="noopener noreferrer"
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                PDF Download
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Was ist zu tun?</h3>
            <ol className="list-decimal pl-5 space-y-3 text-slate-700">
              <li><strong>Gruppen bilden:</strong> Finden Sie sich in Kleingruppen von 3-4 Personen zusammen.</li>
              <li><strong>Checkliste analysieren:</strong> Sichten Sie die oben verlinkte Hausstandard-Checkliste.</li>
              <li><strong>Ablaufplan erstellen:</strong> Erstellen Sie einen chronologischen, lückenlosen Ablaufplan (Standard Operating Procedure / SOP) für die präoperative Vorbereitung auf der Pflegestation.</li>
              <li><strong>Simulator-Vorbereitung:</strong> Dieses Werkzeug werden Sie im Anschluss benötigen, um die Fallsimulation erfolgreich zu meistern.</li>
            </ol>
            <p className="mt-4 text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
              Tipp: Produzieren Sie eine Hilfe für die eigene Praxis. Was würde Ihnen im Stationsalltag helfen und eine sichere Übersicht geben?
            </p>
          </div>


          
          <div className="bg-yellow-50/50 border border-yellow-200 p-6 rounded-2xl mt-8">
            <div className="flex items-center space-x-2 text-yellow-800 font-semibold mb-4">
              <Info className="w-5 h-5" />
              <h4>Wie wird gearbeitet?</h4>
            </div>
            <ul className="space-y-4 text-yellow-900/80">
              <li className="flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span>
                <span><strong>Digital:</strong> Nutzen Sie z. B. <a href="https://www.canva.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Canva</a>, <a href="https://genial.ly/de/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Genially</a>, Padlet oder KI-Tools (dies sind nur Beispiele). Sie können alle möglichen Tools nutzen, um Ihren Ablaufplan zu erstellen und visuell aufzubereiten. Hauptsache es ist verständlich!</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span>
                <span><strong>Analog:</strong> Wenn Sie besser ohne Bildschirm denken, gestalten Sie ein Poster, eine Mindmap oder eine handgeschriebene Checkliste auf Papier. (Machen Sie am Ende ein gutes Foto davon).</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Zeit & Upload
            </h3>
            <p className="text-slate-700 mb-6">Sie haben für die Erstellung <strong>90 Minuten</strong> Zeit. Laden Sie Ihr fertiges Produkt (PDF, Link oder Foto) bitte in folgendem Padlet hoch:</p>
            
            <a href="https://padlet.com/Jan_Rosenow_ZPA/ce05-u1-pra-operative-pflege-ergebnisse-w2dvp9f4h3cl8g44" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
    <span>Zum Padlet (Upload)</span>
  </a>
  <div className="mt-8 padlet-embed" style={{border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', width: '100%', background: '#F4F4F4'}}>
    <iframe src="https://padlet.com/embed/w2dvp9f4h3cl8g44" frameBorder="0" allow="camera;microphone;geolocation;display-capture;clipboard-write" style={{width: '100%', height: '608px', display: 'block', padding: 0, margin: 0}}></iframe>
  </div>

            
          </div>
          
        </div>
      </div>
      <NavigationButtons current="auftrag" onNavigate={onNavigate} />
    </section>
  );
}
