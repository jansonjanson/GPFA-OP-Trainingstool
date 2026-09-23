const fs = require('fs');

let kbTsx = fs.readFileSync('src/components/KnowledgeBaseSection.tsx', 'utf8');

// 1. Rephrase Arbeitsauftrag to "Sie"-Form directly addressing trainees
kbTsx = kbTsx.replace(
  'Die Teilnehmer sollen den folgenden Fachtext vollständig durchlesen. Das Wissen benötigen Sie zur Bearbeitung der folgenden Quiz-/Anwendungsformate.',
  'Bitte lesen Sie sich den folgenden Fachtext vollständig durch. Das Wissen benötigen Sie zur Bearbeitung der folgenden Aufgaben und Quizformate.'
);
kbTsx = kbTsx.replace(
  'Sie können jederzeit im Skript nach Antworten suchen oder den KI-Helfer (unten rechts) fragen, wenn Sie sich nicht sicher sind.',
  'Sie können jederzeit im Skript nach Antworten suchen oder unseren KI-Helfer (unten rechts) fragen, wenn Sie sich nicht sicher sind. Viel Erfolg!'
);

// 2. Explanations for Lückentext
kbTsx = kbTsx.replace(
  '<span className="mt-1">Lückentext: Definition</span>',
  '<span className="mt-1">Aufgabe: Definieren Sie die präoperative Pflege. Ziehen Sie die richtigen Begriffe in die passenden Lücken.</span>'
);

// 3. Explanations for Flashcards
kbTsx = kbTsx.replace(
  '<span className="mt-1">Lernmethode Flashcards: Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet. Drehen Sie die Karte um!</span>',
  '<span className="mt-1">Lernmethode Flashcards: Lesen Sie den Begriff und überlegen Sie kurz, was er bedeutet. Drehen Sie die Karte um! Wichtig: Lassen Sie alle Karten am Ende aufgedeckt, um diese Aufgabe abzuschließen.</span>'
);

// 4. Update title for Sektion 1
kbTsx = kbTsx.replace(
  '<h3 className="text-2xl font-bold text-slate-900">SEKTION 1: Postoperative Fähigkeiten einüben</h3>',
  '<h3 className="text-2xl font-bold text-slate-900">SEKTION 1: Postoperative Fähigkeiten einüben (Prähabilitation)</h3>'
);

// 5. Update images (Lightbox logic)
// I will wrap images in a new component, so let's import or create a LightboxImage component in the same file.
const lightboxComponent = `
function LightboxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        className={\`\${className} cursor-pointer hover:opacity-90 transition-opacity\`}
        onClick={() => setIsOpen(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <motion.img 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`;

kbTsx = kbTsx.replace('// --- Shared Components ---', '// --- Shared Components ---\n' + lightboxComponent);

// Now replace all <img ... /> with <LightboxImage ... />
kbTsx = kbTsx.replace(/<img src="([^"]+)" alt="([^"]+)" className="([^"]+)" \/>/g, '<LightboxImage src="$1" alt="$2" className="$3" />');

// 6. Add images where requested
// Hautverletzung 2:
kbTsx = kbTsx.replace(
  '<LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautverletzung%201.png" alt="Mikroverletzung" className="rounded-lg shadow-sm w-full object-cover col-span-2" />',
  `<LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautverletzung%201.png" alt="Mikroverletzung 1" className="rounded-lg shadow-sm w-full object-cover h-32" />
   <LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Hautbverletzung%202.jpg" alt="Mikroverletzung 2" className="rounded-lg shadow-sm w-full object-cover h-32" />`
);

// Add ATS image:
kbTsx = kbTsx.replace(
  '<LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Netzhose.png" alt="Netzhose" className="rounded-lg shadow-sm max-h-32 object-cover" />',
  `<LightboxImage src="https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/Netzhose.png" alt="Netzhose" className="rounded-lg shadow-sm max-h-32 object-cover" />
   <LightboxImage src="https://dn711003.ca.archive.org/0/items/icare-pflege-pra-op-kapitel-reduced/ATS.jpg" alt="MTPS / ATS" className="rounded-lg shadow-sm max-h-32 object-cover" />`
);

// Also make Klistier and Microklist smaller in their container (max-h-24 instead of max-h-40)
kbTsx = kbTsx.replace(
  /className="rounded-lg shadow-sm w-full h-auto object-cover max-h-40"/g,
  'className="rounded-lg shadow-sm w-full h-auto object-contain max-h-24 bg-white"'
);

// 7. Arrow transitions between sections.
// E.g. <div className="flex justify-center my-6 text-slate-400"><ArrowDown className="w-8 h-8 animate-bounce" /><span>Weiter geht's mit...</span></div>
// Let's add them before Sektion 1, Sektion 2, Sektion 3, Sektion 4.
const arrow1 = `
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Prähabilitation</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
`;
kbTsx = kbTsx.replace('<!-- Arrow 1 -->', arrow1); // I'll do this via replacement
kbTsx = kbTsx.replace(
  '{/* Sektion 1: Prähabilitation */}',
  arrow1 + '\n        {/* Sektion 1: Prähabilitation */}'
);

const arrow2 = `
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Ernährung & Ausscheidung</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
`;
kbTsx = kbTsx.replace(
  '{/* Sektion 2: Nüchternheit und Abführen */}',
  arrow2 + '\n        {/* Sektion 2: Nüchternheit und Abführen */}'
);

const arrow3 = `
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit Körperpflege</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
`;
kbTsx = kbTsx.replace(
  '{/* Sektion 3: Körperpflege / OP Tag */}',
  arrow3 + '\n        {/* Sektion 3: Körperpflege / OP Tag */}'
);

const arrow4 = `
        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
          <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent mb-2"></div>
          <span className="text-sm font-medium uppercase tracking-wider mb-2">Weiter geht's mit dem Transport in den OP</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
`;
kbTsx = kbTsx.replace(
  '{/* Sektion 4: Medikation & Transport */}',
  arrow4 + '\n        {/* Sektion 4: Medikation & Transport */}'
);

fs.writeFileSync('src/components/KnowledgeBaseSection.tsx', kbTsx);
