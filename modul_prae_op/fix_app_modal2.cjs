const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the welcome modal text
appTsx = appTsx.replace(
  'Viel Erfolg beim Erkunden und Lernen!</p>',
  'Viel Erfolg beim Erkunden und Lernen!</p><p className="mt-4 text-sm text-blue-200">Hinweis: Sie können diese Info jederzeit über den "Info"-Button oben rechts wieder aufrufen.</p>'
);

fs.writeFileSync('src/App.tsx', appTsx);
