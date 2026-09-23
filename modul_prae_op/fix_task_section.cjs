const fs = require('fs');

let taskTsx = fs.readFileSync('src/components/TaskSection.tsx', 'utf8');

// Title change
taskTsx = taskTsx.replace(
  '<h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Ihr Arbeitsauftrag: Die SOP</h2>',
  '<h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Ihr Arbeitsauftrag: Ablaufplan erstellen</h2>'
);

// Add "KI-Tools" to digital
taskTsx = taskTsx.replace(
  'Digital mit Canva, Genially oder Padlet',
  'Digital (z.B. Canva, Genially, Padlet oder KI-Tools Ihrer Wahl)'
);

// Fix Padlet double embedding
// We need to see what's currently in TaskSection.tsx regarding Padlet.
fs.writeFileSync('src/components/TaskSection.tsx', taskTsx);
