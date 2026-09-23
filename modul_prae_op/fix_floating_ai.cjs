const fs = require('fs');

let aiTsx = fs.readFileSync('src/components/FloatingAI.tsx', 'utf8');

// Add onOpenAI prop
aiTsx = aiTsx.replace(
  'export default function FloatingAI() {',
  'interface Props { onOpenAI?: () => void; }\nexport default function FloatingAI({ onOpenAI }: Props) {'
);

// We need a tutorial tooltip pointing to it if it hasn't been clicked yet.
aiTsx = aiTsx.replace(
  'const [isOpen, setIsOpen] = useState(false);',
  `const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  
  useEffect(() => {
    // Show tutorial ping
    const timer = setTimeout(() => {
      if (!hasClicked) {
        // play a small sound or just rely on visuals
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [hasClicked]);`
);

aiTsx = aiTsx.replace(
  'onClick={() => setIsOpen(!isOpen)}',
  'onClick={() => { setIsOpen(!isOpen); if (!hasClicked) { setHasClicked(true); if (onOpenAI) onOpenAI(); } }}'
);

aiTsx = aiTsx.replace(
  'className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-110 active:scale-95"',
  'className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-110 active:scale-95 ${!hasClicked ? "animate-pulse ring-4 ring-blue-300 ring-opacity-50" : ""}`}'
);

aiTsx = aiTsx.replace(
  '<Bot className="w-6 h-6" />',
  `<Bot className="w-6 h-6" />
        {!hasClicked && (
          <div className="absolute -top-16 right-0 bg-white text-blue-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap border border-blue-100 animate-bounce">
            Hallo! Ich bin Ihr KI-Helfer. 👋<br/>Klicken Sie mich für Tipps an!
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-blue-100"></div>
          </div>
        )}`
);

// Initial message from AI
aiTsx = aiTsx.replace(
  "text: 'Hallo! Ich bin Ihr Praxisanleitungs-Joker. Ich kann Ihnen Tipps geben, wenn Sie in der Simulation feststecken, oder Fachfragen beantworten. Wie kann ich helfen?'",
  "text: 'Hallo! Ich bin Ihr Praxisanleitungs-Joker. Ich kann Ihnen Tipps geben, wenn Sie in der Simulation feststecken, oder Fachfragen beantworten. (Toll, Sie haben mich gefunden!) Wie kann ich helfen?'"
);

fs.writeFileSync('src/components/FloatingAI.tsx', aiTsx);
