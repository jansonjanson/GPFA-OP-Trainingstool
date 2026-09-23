const fs = require('fs');

// 1. Fix App.tsx (Header and Welcome Modal)
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
  'Viel Erfolg beim Erkunden und Lernen!',
  'Viel Erfolg beim Erkunden und Lernen!</p><p className="mt-4 text-sm text-blue-200">Hinweis: Sie können diese Info jederzeit über den "Info"-Button oben rechts wieder aufrufen.'
);
fs.writeFileSync('src/App.tsx', appTsx);

// 2. Fix IntroSection.tsx
let introTsx = fs.readFileSync('src/components/IntroSection.tsx', 'utf8');
introTsx = introTsx.replace(
  /<div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate-100 mb-8 border-4 border-white">[\s\S]*?<\/div>/m,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-100 border-4 border-white">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/5a22V0L1Kxk"
        title="YouTube video player 1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-100 border-4 border-white">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/Y3EwPcJxr80"
        title="YouTube video player 2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>`
);
introTsx = introTsx.replace(
  'Sehen Sie sich das kurze Einführungsvideo an.',
  'Bitte sehen Sie sich beide Videos an. Das zweite Video zeigt ein direktes Praxisbeispiel – beachten Sie, dass der genaue Ablauf je nach Klinik abweichen kann. Mehr dazu erfahren Sie in der Wissens-Base.'
);
fs.writeFileSync('src/components/IntroSection.tsx', introTsx);

// 3. Fix TaskSection.tsx
let taskTsx = fs.readFileSync('src/components/TaskSection.tsx', 'utf8');
taskTsx = taskTsx.replace(
  /Folgende Kategorien müssen zwingend chronologisch enthalten sein:[\s\S]*?<\/ul>/m,
  ''
);
taskTsx = taskTsx.replace(
  'Stellen Sie sich vor: Eine neue Auszubildende im Unterkurs nutzt Ihre Karte, um nichts zu vergessen.',
  'Stellen Sie sich vor: Sie möchten eine Hilfe für die eigene Praxis herstellen. Was würde Ihnen da helfen und eine gute Übersicht geben?'
);
taskTsx = taskTsx.replace(
  'Digital: Nutzen Sie Tools wie Canva (für Infografiken), Genially oder Padlet.',
  'Digital: Nutzen Sie z. B. Canva, Genially, Padlet oder KI-Tools. Hauptsache es ist visuell, für die Nutzung auf Station gedacht und der Input (besonders bei KI) stammt von Ihnen selbst!'
);
taskTsx = taskTsx.replace(
  /<a href="https:\/\/padlet\.com[^>]+>[\s\S]*?<\/a>/m,
  `<a href="https://padlet.com/Jan_Rosenow_ZPA/ce05-u1-pra-operative-pflege-ergebnisse-w2dvp9f4h3cl8g44" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
    <span>Zum Padlet (Upload)</span>
  </a>
  <div className="mt-8 padlet-embed" style={{border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', width: '100%', background: '#F4F4F4'}}>
    <iframe src="https://padlet.com/embed/w2dvp9f4h3cl8g44" frameBorder="0" allow="camera;microphone;geolocation;display-capture;clipboard-write" style={{width: '100%', height: '608px', display: 'block', padding: 0, margin: 0}}></iframe>
  </div>`
);
fs.writeFileSync('src/components/TaskSection.tsx', taskTsx);

// 4. Fix MediaSection.tsx
let mediaTsx = fs.readFileSync('src/components/MediaSection.tsx', 'utf8');
mediaTsx = mediaTsx.replace(
  '<ModuleMeta time="Doppelstunde 1" mode="Hausaufgabe / Zusatz" goal="Einblicke in die OP-Schleuse" />',
  '<ModuleMeta time="Zeitplan nach Absprache" mode="Plenum / Einzelarbeit" goal="Einblicke in die OP-Schleuse & den OP-Saal" />'
);
mediaTsx = mediaTsx.replace(/<div className="flex justify-center mb-8">[\s\S]*?<\/div>/m, '');
mediaTsx = mediaTsx.replace(/<p className="text-sm text-slate-500 mb-8 text-center">[\s\S]*?<\/p>/m, '');
mediaTsx = mediaTsx.replace(
  'Hier finden Sie zusätzliche visuelle Einblicke',
  'Sehen Sie sich diese beiden Videos an, um besser zu verstehen, was in der Schleuse und anschließend im OP-Saal passiert.'
);
fs.writeFileSync('src/components/MediaSection.tsx', mediaTsx);

console.log("Other sections updated successfully.");
