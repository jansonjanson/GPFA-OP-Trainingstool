const fs = require('fs');
let taskTsx = fs.readFileSync('src/components/TaskSection.tsx', 'utf8');

taskTsx = taskTsx.replace(
  `<span><strong>Digital:</strong> Nutzen Sie Tools wie <a href="https://www.canva.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Canva</a> (für Infografiken), <a href="https://genial.ly/de/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Genially</a> oder Padlet.</span>`,
  `<span><strong>Digital:</strong> Nutzen Sie z. B. <a href="https://www.canva.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Canva</a>, <a href="https://genial.ly/de/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-yellow-700 transition">Genially</a>, Padlet oder KI-Tools (dies sind nur Beispiele). Sie können alle möglichen Tools nutzen, um Ihren Ablaufplan zu erstellen und visuell aufzubereiten. Hauptsache es ist verständlich!</span>`
);

const toRemove = `<div className="padlet-embed shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', width: '100%', background: '#F4F4F4' }}>
              <p style={{ padding: 0, margin: 0 }}>
                <iframe src="https://padlet.com/embed/w2dvp9f4h3cl8g44" frameBorder="0" allow="camera;microphone;geolocation;display-capture;clipboard-write" style={{ width: '100%', height: '608px', display: 'block', padding: 0, margin: 0 }}></iframe>
              </p>
            </div>`;
taskTsx = taskTsx.replace(toRemove, '');
// just in case there are spacing differences:
taskTsx = taskTsx.replace(/<div className="padlet-embed shadow-sm"[\s\S]*?<\/div>/g, '');

fs.writeFileSync('src/components/TaskSection.tsx', taskTsx);
