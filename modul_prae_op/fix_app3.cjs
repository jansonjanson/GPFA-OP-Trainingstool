const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  '<main className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">',
  `<main className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center relative z-20">
        <h1 className="text-xl font-bold text-blue-900 flex items-center">
          <HeartPulse className="w-6 h-6 mr-2 text-blue-600" />
          Prä-OP Navigator
        </h1>
        <button 
          onClick={() => setShowWelcomeModal(true)} 
          className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-full"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" /> Info
        </button>
      </header>`
);

appTsx = appTsx.replace(
  'Viel Erfolg beim Erkunden und Lernen!</p>',
  'Viel Erfolg beim Erkunden und Lernen!</p><p className="mt-4 text-sm text-blue-200">Hinweis: Sie können diese Info jederzeit über den "Info"-Button oben rechts wieder aufrufen.</p>'
);

fs.writeFileSync('src/App.tsx', appTsx);
